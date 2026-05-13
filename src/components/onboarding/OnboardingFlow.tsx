"use client";

import { apiRequest } from "@/api/axiosInstance";
import {
  getOnboardingRole,
  type OnboardingQuestion,
  type OnboardingRoleId,
} from "@/data/OnboardingQuestions";
import pricing_data from "@/data/PricingData";
import { useRouter, useSearchParams } from "next/navigation";
import type { FormEvent, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { Swiper as SwiperType } from "swiper";
import OnboardingSidebar from "./flow/OnboardingSidebar";
import CheckoutStep from "./flow/steps/CheckoutStep";
import OtpStep from "./flow/steps/OtpStep";
import PlanStep from "./flow/steps/PlanStep";
import QuestionsStep from "./flow/steps/QuestionsStep";
import RoleStep from "./flow/steps/RoleStep";
import SignupStep from "./flow/steps/SignupStep";
import type {
  InlineMessage,
  OnboardingFlowProps,
  PaymentState,
  QuestionAnswerState,
  SignupState,
  StepId,
} from "./flow/types";
import {
  DASHBOARD_URL,
  OTP_LENGTH,
  STEP_CONTENT,
  STRIPE_TEST_PUBLISHABLE_KEY,
  extractApiQuestions,
  formatCardNumber,
  formatQuestionAnswerPayload,
  getApiErrorMessage,
  getDefaultPlanForRole,
  getPlanBySlug,
  getPlansForRole,
  getQuestionAnswerState,
  getStripeExpiryYear,
  getUnansweredQuestions,
  initialPaymentState,
  initialSignupState,
  isBuyerRole,
  isValidRoleId,
  sanitizeDigits,
  validatePaymentState,
  validateSignupState,
} from "./flow/utils";
import styles from "./OnboardingFlow.module.css";

/** signup/complete returns { data: { token, user, ... } } (shape from apiRequest). */
const extractSignupUserAndToken = (apiBody: any) => {
  const data = apiBody?.data ?? apiBody;
  const user = data?.user;
  const token = data?.token;
  return {
    userId:
      user?.id != null && !Number.isNaN(Number(user.id))
        ? Number(user.id)
        : null,
    token: typeof token === "string" ? token : null,
  };
};

const persistOnboardingAuth = (
  apiBody: any,
  setUserId: (id: number | null) => void,
) => {
  const { userId, token } = extractSignupUserAndToken(apiBody);
  if (userId != null) {
    setUserId(userId);
    sessionStorage.setItem("mh-onboarding-user-id", String(userId));
    if (typeof window !== "undefined") {
      localStorage.setItem("user_id", JSON.stringify(userId));
    }
  }
  if (token && typeof window !== "undefined") {
    sessionStorage.setItem("token", token);
    localStorage.setItem("token", token);
  }
};

const resolveOnboardingUserId = (stateId: number | null): number | null => {
  if (stateId != null && Number.isFinite(stateId)) {
    return stateId;
  }
  if (typeof window === "undefined") {
    return null;
  }
  const fromSession = sessionStorage.getItem("mh-onboarding-user-id");
  if (fromSession) {
    const n = Number(fromSession);
    return Number.isFinite(n) ? n : null;
  }
  const raw = localStorage.getItem("user_id");
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    const n = Number(parsed);
    return Number.isFinite(n) ? n : null;
  } catch {
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }
};

const OnboardingFlow = ({ defaultPlanSlug }: OnboardingFlowProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPlan = searchParams.get("plan");
  const requestedRole = searchParams.get("role");

  const initialRoleId = isValidRoleId(requestedRole) ? requestedRole : null;
  const initialPlanSlug =
    getPlanBySlug(requestedPlan)?.slug ??
    getPlanBySlug(defaultPlanSlug)?.slug ??
    getDefaultPlanForRole(initialRoleId);

  const [currentStep, setCurrentStep] = useState<StepId>("role");
  const [selectedRoleId, setSelectedRoleId] = useState<OnboardingRoleId | null>(
    initialRoleId,
  );
  const [selectedPlanSlug, setSelectedPlanSlug] =
    useState<string>(initialPlanSlug);
  const [planManuallySelected, setPlanManuallySelected] = useState(
    Boolean(requestedPlan || defaultPlanSlug),
  );
  const [signupState, setSignupState] =
    useState<SignupState>(initialSignupState);
  const [paymentState, setPaymentState] =
    useState<PaymentState>(initialPaymentState);
  const [otpCode, setOtpCode] = useState("");
  const [resendCountdown, setResendCountdown] = useState(30);
  const [expandedPlanDescriptions, setExpandedPlanDescriptions] = useState<
    Record<string, boolean>
  >({});
  const [apiQuestions, setApiQuestions] = useState<
    Partial<Record<OnboardingRoleId, OnboardingQuestion[]>>
  >({});
  const [questionAnswers, setQuestionAnswers] = useState<
    Record<string, QuestionAnswerState>
  >({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<StepId | null>(null);
  const [otpMessage, setOtpMessage] = useState<InlineMessage | null>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(DASHBOARD_URL);
  /** Set when signup/complete returns so question POST can send user_id. */
  const [onboardingUserId, setOnboardingUserId] = useState<number | null>(null);
  const otpInputRef = useRef<HTMLInputElement | null>(null);
  const planSwiperRef = useRef<SwiperType | null>(null);

  const selectedRole = getOnboardingRole(selectedRoleId);
  const isBuyer = isBuyerRole(selectedRoleId);
  const availablePlans = getPlansForRole(selectedRoleId);
  const selectedPlan =
    availablePlans.find((item) => item.slug === selectedPlanSlug) ??
    availablePlans.find(
      (item) => item.slug === selectedRole?.recommendedPlanSlug,
    ) ??
    availablePlans[0] ??
    pricing_data[0];
  const activeQuestions =
    (selectedRoleId ? apiQuestions[selectedRoleId] : undefined) ??
    selectedRole?.questions ??
    [];
  const expiryDisplayValue = `${paymentState.expMonth}${
    paymentState.expMonth.length === 2 ? "/" : ""
  }${paymentState.expYear}`;
  const unansweredQuestions = getUnansweredQuestions(
    activeQuestions,
    questionAnswers,
  );
  const stripePublishableKey =
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || STRIPE_TEST_PUBLISHABLE_KEY;

  useEffect(() => {
    if (!selectedRoleId) {
      return;
    }

    const rolePlans = getPlansForRole(selectedRoleId);
    const selectedPlanIsAvailable = rolePlans.some(
      (item) => item.slug === selectedPlanSlug,
    );

    if (!planManuallySelected || !selectedPlanIsAvailable) {
      setSelectedPlanSlug(getDefaultPlanForRole(selectedRoleId));
    }
  }, [planManuallySelected, selectedPlanSlug, selectedRoleId]);

  useEffect(() => {
    if (!selectedRoleId) {
      return;
    }

    setQuestionAnswers({});

    let isActive = true;

    const loadRoleQuestions = async () => {
      try {
        const response = await apiRequest({
          url: `professional-questions/${selectedRoleId}`,
          method: "GET",
        });

        if (!isActive) {
          return;
        }

        const questions = extractApiQuestions(response);

        if (questions.length > 0) {
          setApiQuestions((current) => ({
            ...current,
            [selectedRoleId]: questions,
          }));
        }
      } catch {
        // Keep local fallback questions when API questions are unavailable.
      }
    };

    loadRoleQuestions();

    return () => {
      isActive = false;
    };
  }, [selectedRoleId]);

  useEffect(() => {
    const fullName = `${signupState.firstName} ${signupState.lastName}`.trim();

    setPaymentState((current) => ({
      ...current,
      name: current.name || fullName,
      email: current.email || signupState.email,
      cardName: current.cardName || fullName,
    }));
  }, [signupState.email, signupState.firstName, signupState.lastName]);

  useEffect(() => {
    if (typeof window === "undefined" || !stripePublishableKey) {
      return;
    }

    const interval = window.setInterval(() => {
      if (window.Stripe) {
        window.Stripe.setPublishableKey(stripePublishableKey);
        window.clearInterval(interval);
      }
    }, 300);

    return () => window.clearInterval(interval);
  }, [stripePublishableKey]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setFieldErrors({});
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== "otp") {
      return;
    }

    setResendCountdown(30);

    const interval = window.setInterval(() => {
      setResendCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [currentStep]);

  const setStep = (step: StepId) => {
    setCurrentStep(step);
  };

  const clearFieldError = (field: string) => {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const getCurrentQuestionAnswerState = (questionId: string) =>
    getQuestionAnswerState(questionAnswers, questionId);

  const updateSignupField = (field: keyof SignupState, value: string) => {
    setSignupState((current) => ({ ...current, [field]: value }));
    clearFieldError(field);
  };

  const updatePaymentField = (field: keyof PaymentState, value: string) => {
    setPaymentState((current) => ({ ...current, [field]: value }));
    clearFieldError(field);
  };

  const updateExpiryValue = (value: string) => {
    const digits = sanitizeDigits(value, 4);
    const month = digits.slice(0, 2);
    const yearSuffix = digits.slice(2, 4);

    setPaymentState((current) => ({
      ...current,
      expMonth: month,
      expYear: yearSuffix,
    }));
    clearFieldError("expMonth");
    clearFieldError("expYear");
  };

  const handleContinueFromRole = () => {
    if (!selectedRoleId) {
      toast.error("Please select a role to continue.");
      return;
    }

    setStep("signup");
  };

  const handleSignupSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedRoleId) {
      toast.error("Please select a role to continue.");
      setStep("role");
      return;
    }

    const errors = validateSignupState(signupState);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setActionLoading("signup");

      const response = await apiRequest({
        url: "signup/send-code",
        method: "POST",
        data: {
          email: signupState.email.trim(),
        },
      });

      if (!response) {
        toast.error("No response received from the server.");
        return;
      }

      if ((response as any).error) {
        toast.error(
          (response as any).message || "Unable to send verification code.",
        );
        return;
      }

      setOtpCode("");
      setOtpMessage({
        tone: "info",
        text: `We've sent a verification code to ${signupState.email.trim()}. Enter it below to continue.`,
      });
      toast.success("Verification code sent successfully.");
      setStep("otp");
    } catch (error: any) {
      toast.error(
        getApiErrorMessage(error, "Something went wrong. Please try again."),
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!otpCode.trim()) {
      setFieldErrors({ otp: "OTP is required." });
      return;
    }

    if (otpCode.trim().length < OTP_LENGTH) {
      setFieldErrors({ otp: "Enter the full 6-digit code." });
      return;
    }

    try {
      setActionLoading("otp");
      setOtpMessage(null);

      const verifyResponse = await apiRequest({
        url: "signup/verify-code",
        method: "POST",
        data: {
          email: signupState.email.trim(),
          email_verification_code: otpCode.trim(),
        },
      });

      if ((verifyResponse as any).error) {
        setOtpMessage({
          tone: "error",
          text:
            verifyResponse.message ||
            "Invalid verification code. Please try again.",
        });
        return;
      }
      const nextVerificationToken = (verifyResponse as any).data
        ?.verification_token;

      if (!nextVerificationToken) {
        setOtpMessage({
          tone: "error",
          text: "Verification succeeded, but no verification token was returned.",
        });
        return;
      }

      const createLeadResponse = await apiRequest({
        url: "signup/lead",
        method: "POST",
        data: {
          role: selectedRoleId,
          first_name: signupState.firstName.trim(),
          last_name: signupState.lastName.trim(),
          email: signupState.email.trim(),
          password: signupState.password,
          password_confirmation: signupState.confirmPassword,
          verification_token: nextVerificationToken,
        },
      });

      if ((createLeadResponse as any).error) {
        setOtpMessage({
          tone: "error",
          text:
            createLeadResponse.message ||
            "Your email was verified, but we could not create the signup lead.",
        });
        return;
      }

      const leadId = (createLeadResponse as any).data?.lead?.id;
      const leadCode = (createLeadResponse as any).data?.lead?.code || "";

      if (!leadId || !leadCode) {
        setOtpMessage({
          tone: "error",
          text: "Lead created, but the lead ID or code was missing from the response.",
        });
        return;
      }

      sessionStorage.setItem(
        "mh-signup-verification-token",
        nextVerificationToken,
      );
      sessionStorage.setItem("mh-signup-lead-id", String(leadId));
      sessionStorage.setItem("mh-signup-lead-code", String(leadCode));

      if (isBuyerRole(selectedRoleId)) {
        const completeSignupResponse = await apiRequest({
          url: "signup/complete",
          method: "POST",
          data: {
            lead_id: leadId,
            lead_code: leadCode,
          },
        });

        if ((completeSignupResponse as any).error) {
          setOtpMessage({
            tone: "error",
            text:
              completeSignupResponse.message ||
              "Your account was verified, but buyer signup could not be completed.",
          });
          return;
        }
        persistOnboardingAuth(
          completeSignupResponse,
          setOnboardingUserId,
        );
        setRedirectUrl(
          (completeSignupResponse as any).redirect
            ? `https://dash.magnatehub.au${
                (completeSignupResponse as any).redirect
              }`
            : DASHBOARD_URL,
        );
        setPaymentCompleted(true);
        setOtpMessage({
          tone: "success",
          text: "Verification successful. Buyer signup is complete, so you can continue straight to the questions.",
        });
        toast.success("Buyer signup completed successfully.");
        setStep("questions");
        return;
      }

      setOtpMessage({
        tone: "success",
        text: "Verification successful. Your account details are saved and plan selection is ready.",
      });
      toast.success("Verification complete. Choose your plan.");
      setStep("plan");
    } catch (error: any) {
      setOtpMessage({
        tone: "error",
        text: getApiErrorMessage(
          error,
          "Unable to verify OTP. Please try again.",
        ),
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleResendOtp = async () => {
    if (!signupState.email.trim()) {
      setOtpMessage({
        tone: "error",
        text: "Enter your email address first so we can resend the verification code.",
      });
      return;
    }

    try {
      setActionLoading("otp");
      setOtpMessage({
        tone: "info",
        text: "Sending a fresh verification code to your email address.",
      });

      const response = await apiRequest({
        url: "signup/send-code",
        method: "POST",
        data: {
          email: signupState.email.trim(),
        },
      });

      if ((response as any).error) {
        setOtpMessage({
          tone: "error",
          text: response.message || "Failed to resend verification code.",
        });
        return;
      }

      setResendCountdown(30);
      setOtpMessage({
        tone: "success",
        text: "Verification code resent successfully. Check your inbox and continue.",
      });
      toast.success("Verification code resent successfully.");
    } catch (error: any) {
      setOtpMessage({
        tone: "error",
        text: getApiErrorMessage(error, "Failed to resend verification code."),
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handlePlanSelect = (slug: string) => {
    setSelectedPlanSlug(slug);
    setPlanManuallySelected(true);
  };

  const handlePlanCardKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    slug: string,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    handlePlanSelect(slug);
  };

  const togglePlanDescription = (planKey: string) => {
    setExpandedPlanDescriptions((current) => ({
      ...current,
      [planKey]: !current[planKey],
    }));
  };

  const handlePlanContinue = () => {
    const selectedPlanIsAvailable = availablePlans.some(
      (plan) => plan.slug === selectedPlanSlug,
    );

    if (!selectedPlanSlug || !selectedPlanIsAvailable) {
      toast.error("Please choose a plan to continue.");
      return;
    }

    setStep("checkout");
  };

  const handleCheckoutSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validatePaymentState(paymentState, selectedPlan);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setActionLoading("checkout");

      const leadId = sessionStorage.getItem("mh-signup-lead-id");
      const leadCode = sessionStorage.getItem("mh-signup-lead-code");

      if (!leadId || !leadCode) {
        toast.error(
          "Signup session is missing lead details. Please restart signup.",
        );
        return;
      }

      const payload: Record<string, string | number> = {
        lead_id: Number(leadId),
        lead_code: leadCode,
        plan_id: selectedPlan.id,
      };

      if (selectedPlan.price > 0) {
        if (!window.Stripe) {
          toast.error("Stripe is still loading. Please try again in a moment.");
          return;
        }

        const stripeResponse = await new Promise<any>((resolve, reject) => {
          window.Stripe?.createToken(
            {
              number: paymentState.cardNumber.replace(/\s/g, ""),
              cvc: paymentState.cvc,
              exp_month: paymentState.expMonth,
              exp_year: getStripeExpiryYear(paymentState.expYear),
              name: paymentState.cardName.trim(),
            },
            (_status: number, response: any) => {
              if (response?.error) {
                reject(response.error.message);
                return;
              }

              resolve(response);
            },
          );
        });

        payload.stripe_token = stripeResponse.id;
      }

      const response = await apiRequest({
        url: "signup/complete",
        method: "POST",
        data: payload,
      });

      if ((response as any)?.error) {
        toast.error(
          (response as any)?.message || "Signup could not be completed.",
        );
        return;
      }

      persistOnboardingAuth(response, setOnboardingUserId);
      sessionStorage.removeItem("mh-signup-lead-id");
      sessionStorage.removeItem("mh-signup-lead-code");
      sessionStorage.removeItem("mh-signup-verification-token");

      setRedirectUrl(
        (response as any)?.redirect
          ? `https://dash.magnatehub.au${(response as any).redirect}`
          : DASHBOARD_URL,
      );
      setPaymentCompleted(true);
      toast.success(
        selectedPlan.price > 0
          ? "Payment completed successfully."
          : `${selectedPlan.title} selected successfully.`,
      );
      setStep("questions");
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, "Payment could not be completed."));
    } finally {
      setActionLoading(null);
    }
  };

  const handleQuestionSelect = (
    question: OnboardingQuestion,
    answer: string,
  ) => {
    setQuestionAnswers((current) => {
      const existing = current[question.id] ?? {
        selectedOptions: [],
        customValue: "",
      };

      const selectedOptions = question.allowMultiple
        ? existing.selectedOptions.includes(answer)
          ? existing.selectedOptions.filter((option) => option !== answer)
          : [...existing.selectedOptions, answer]
        : [answer];

      return {
        ...current,
        [question.id]: {
          selectedOptions,
          customValue:
            question.customOptionLabel &&
            !selectedOptions.includes(question.customOptionLabel)
              ? ""
              : existing.customValue,
        },
      };
    });

    clearFieldError(question.id);
  };

  const handleQuestionCustomValueChange = (
    questionId: string,
    value: string,
  ) => {
    setQuestionAnswers((current) => {
      const existing = current[questionId] ?? {
        selectedOptions: [],
        customValue: "",
      };

      return {
        ...current,
        [questionId]: {
          ...existing,
          customValue: value,
        },
      };
    });

    clearFieldError(questionId);
  };

  const handleFinishOnboarding = async () => {
    if (!selectedRole) {
      toast.error("Please select a role before continuing.");
      setStep("role");
      return;
    }

    if (unansweredQuestions.length > 0) {
      setFieldErrors((current) => ({
        ...current,
        ...Object.fromEntries(
          unansweredQuestions.map((question) => [
            question.id,
            question.customOptionLabel &&
            getCurrentQuestionAnswerState(question.id).selectedOptions.includes(
              question.customOptionLabel,
            )
              ? "Please enter the custom value to continue."
              : "Please answer this question before continuing.",
          ]),
        ),
      }));
      toast.error("Please answer all questions before continuing.");
      return;
    }

    const userId = resolveOnboardingUserId(onboardingUserId);
    if (userId == null) {
      toast.error("Your account session is missing. Please complete signup again before submitting answers.",);
      return;
    }

    const answers = activeQuestions.map((question) => {
      const state = getCurrentQuestionAnswerState(question.id);
      const body = formatQuestionAnswerPayload(question, state);
      return {
        professional_question_id: Number(question.professionalQuestionId),
        ...body,
      };
    });

    const payload = {
      user_id: userId,
      answers,
    };

    try {
      setActionLoading("questions");

      sessionStorage.setItem("mh-onboarding-answers",JSON.stringify(payload.answers),);
      sessionStorage.setItem("mh-onboarding-plan", selectedPlan.slug || "");
      sessionStorage.setItem("mh-onboarding-role", selectedRole.id);

      const answerIsComplete = (a: (typeof answers)[number]) => {
        if (!a.professional_question_id) {
          return false;
        }
        if (
          "selected_option_ids" in a &&
          Array.isArray(a.selected_option_ids) &&
          a.selected_option_ids.length > 0
        ) {
          return true;
        }
        if (
          "answer_text" in a &&
          typeof a.answer_text === "string" &&
          a.answer_text.trim() !== ""
        ) {
          return true;
        }
        return false;
      };

      if (
        payload.answers.length === 0 ||
        payload.answers.some((answer) => !answerIsComplete(answer))
      ) {
        toast.error(
          "Professional questions could not be loaded correctly. Please refresh and try again.",
        );
        return;
      }
      await apiRequest({
        url: "professional-question-answers",
        method: "POST",
        data: payload,
      });
      toast.success("Onboarding complete, Now you can login to your dashboard.");
      router.push(`/login`);
    } catch (error: any) {
      toast.warn(
        getApiErrorMessage(
          error,
          "Responses were kept locally. Redirecting to dashboard.",
        ),
      );
      // router.push(`/login`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBack = () => {
    if (currentStep === "signup") {
      setStep("role");
      return;
    }

    if (currentStep === "otp") {
      setStep("signup");
      return;
    }

    if (currentStep === "plan") {
      setStep("otp");
      return;
    }

    if (currentStep === "checkout") {
      setStep("plan");
      return;
    }

    if (currentStep === "questions" && isBuyer) {
      setStep("otp");
    }
  };

  const showBackButton = currentStep !== "role" && !(currentStep === "questions" && paymentCompleted);
  const showStepper = currentStep !== "otp";
  const displayStepIndex = isBuyer
    ? currentStep === "role"
      ? 0
      : currentStep === "signup" || currentStep === "otp"
        ? 1
        : 2
    : currentStep === "role"
      ? 0
      : currentStep === "signup" || currentStep === "otp"
        ? 1
        : currentStep === "plan"
          ? 2
          : currentStep === "checkout"
            ? 3
            : 4;
  const displaySteps = isBuyer
    ? [
        {
          key: "role",
          label: "ROLE",
        },
        {
          key: "account",
          label: "CREATE ACCOUNT",
        },
        {
          key: "questions",
          label: "QUESTIONS",
        },
      ]
    : [
        {
          key: "role",
          label: "ROLE",
        },
        {
          key: "account",
          label: "CREATE ACCOUNT",
        },
        {
          key: "plan",
          label: "PLAN",
        },
        {
          key: "checkout",
          label: "CHECKOUT",
        },
        {
          key: "questions",
          label: "QUESTIONS",
        },
      ];

  const renderStep = () => {
    if (currentStep === "role") {
      return (
        <RoleStep
          selectedRoleId={selectedRoleId}
          onSelectRole={setSelectedRoleId}
          onContinue={handleContinueFromRole}
        />
      );
    }

    if (currentStep === "signup") {
      return (
      <SignupStep
          signupState={signupState}
          fieldErrors={fieldErrors}
          actionLoading={actionLoading}
          onSubmit={handleSignupSubmit}
          onUpdateField={updateSignupField}
        />
      );
    }

    if (currentStep === "otp") {
      return (
        <OtpStep
          otpCode={otpCode}
          resendCountdown={resendCountdown}
          fieldErrors={fieldErrors}
          otpMessage={otpMessage}
          actionLoading={actionLoading}
          otpInputRef={otpInputRef}
          onSubmit={handleVerifyOtp}
          onOtpChange={(value) => {
            setOtpCode(value);
            clearFieldError("otp");
          }}
          onResend={handleResendOtp}
        />
      );
    }

    if (currentStep === "plan") {
      return (
        <PlanStep
          plans={availablePlans}
          selectedPlan={selectedPlan}
          selectedRole={selectedRole}
          expandedPlanDescriptions={expandedPlanDescriptions}
          planSwiperRef={planSwiperRef}
          onSelectPlan={handlePlanSelect}
          onPlanCardKeyDown={handlePlanCardKeyDown}
          onToggleDescription={togglePlanDescription}
          onContinue={handlePlanContinue}
        />
      );
    }

    if (currentStep === "checkout") {
      return (
        <CheckoutStep
          selectedPlan={selectedPlan}
          paymentState={paymentState}
          expiryDisplayValue={expiryDisplayValue}
          fieldErrors={fieldErrors}
          actionLoading={actionLoading}
          onSubmit={handleCheckoutSubmit}
          onUpdateField={updatePaymentField}
          onUpdateExpiryValue={updateExpiryValue}
          formatCardNumber={formatCardNumber}
          sanitizeDigits={sanitizeDigits}
        />
      );
    }

    return (
      <QuestionsStep
        activeQuestions={activeQuestions}
        questionAnswers={questionAnswers}
        unansweredQuestions={unansweredQuestions}
        fieldErrors={fieldErrors}
        actionLoading={actionLoading}
        onSelectQuestion={handleQuestionSelect}
        onCustomValueChange={handleQuestionCustomValueChange}
        onFinish={handleFinishOnboarding}
      />
    );
  };

  const currentStepContent = STEP_CONTENT[currentStep];
  const shellClassName = `${styles.shell} ${
    currentStep === "plan" ||
    currentStep === "questions" ||
    currentStep === "checkout"
      ? styles.shellWide
      : currentStep === "otp"
        ? styles.shellCompact
        : ""
  }`;

  return (
    <section className={styles.area}>
      <div className="container " style={{ marginTop: "5rem" }}>
        <div className="row justify-content-center">
          <div className="col-xl-11 col-lg-11">
            <div className={shellClassName}>
              <OnboardingSidebar
                displayStepIndex={displayStepIndex}
                displaySteps={displaySteps}
                showStepper={showStepper}
                summary={{
                  roleLabel: selectedRole?.label || "Not selected",
                  email: signupState.email || "Pending",
                  planTitle: selectedPlan.title,
                  planPrice: selectedPlan.price,
                }}
              />

              <div className={styles.content}>
                <div
                  className={`${styles.contentHeader} ${
                    currentStep === "checkout"
                      ? styles.contentHeaderCentered
                      : ""
                  }`}
                >
                  <p className={styles.eyebrow}>{currentStepContent.eyebrow}</p>
                  <h1 className={styles.title}>{currentStepContent.title}</h1>
                  <p className={styles.description}>
                    {currentStepContent.description}
                  </p>
                </div>

                <div className={styles.contentBody}>{renderStep()}</div>

                {showBackButton && (
                  <div className={styles.footerActions}>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={handleBack}
                      disabled={actionLoading !== null}
                    >
                      Back
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnboardingFlow;
