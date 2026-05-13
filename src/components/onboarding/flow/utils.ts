"use client";

import {
  getOnboardingRole,
  onboardingRoleConfigs,
  type OnboardingQuestion,
  type OnboardingRoleId,
} from "@/data/OnboardingQuestions";
import pricing_data from "@/data/PricingData";
import type {
  PaymentState,
  PricingItem,
  QuestionAnswerState,
  SignupState,
  StepContent,
  StepId,
} from "./types";

export const STEP_CONTENT: Record<StepId, StepContent> = {
  role: {
    eyebrow: "Step 1 of 6",
    title: "Select Role",
    description:
      "Choose the role that best describes how you will use Magnate Hub. This helps us customize your experience from the start.",
  },
  signup: {
    eyebrow: "Step 2 of 6",
    title: "Create Your Account",
    description:
      "Create your Magnate Hub account by entering your details. We'll email you a verification code before your account is created.",
  },
  otp: {
    eyebrow: "Step 3 of 6",
    title: "Verify Your Email",
    description:
      "Enter the verification code sent to your email. Once it's confirmed, we'll create your signup lead and unlock plan selection.",
  },
  plan: {
    eyebrow: "Step 4 of 6",
    title: "Select a Plan",
    description:
      "Choose the plan that best fits your needs. You can review features and select the option that works best for you.",
  },
  checkout: {
    eyebrow: "Step 5 of 6",
    title: "",
    description: "",
  },
  questions: {
    eyebrow: "Step 6 of 6",
    title: "Personalize Your Dashboard",
    description:
      "Answer a few quick questions so we can tailor your dashboard and features to match your goals.",
  },
};

export const DASHBOARD_URL =
  "https://dash.magnatehub.au/dashboard/professionals";
export const STRIPE_TEST_PUBLISHABLE_KEY =
  "pk_test_51MNU17FLKdDrx0HlvOHo2FL7A2WgPTHhoF39uLjJ85HE9MzIcdfVg7538L663FmEPKf2zHRE344l4cUhekQS8Il700Ai0b51y2";
export const OTP_LENGTH = 6;

export const initialSignupState: SignupState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const initialPaymentState: PaymentState = {
  name: "",
  email: "",
  phone: "",
  message: "",
  cardName: "",
  cardNumber: "",
  cvc: "",
  expMonth: "",
  expYear: "",
};

export const isValidRoleId = (
  value?: string | null
): value is OnboardingRoleId =>
  onboardingRoleConfigs.some((role) => role.id === value);

export const getDefaultPlanForRole = (roleId?: OnboardingRoleId | null) =>
  getOnboardingRole(roleId)?.recommendedPlanSlug ?? "free_plan";

export const isBuyerRole = (roleId?: OnboardingRoleId | null) =>
  roleId === "buyer";

export const getPlanBySlug = (slug?: string | null): PricingItem | undefined =>
  (pricing_data as PricingItem[]).find((item) => item.slug === slug);

export const getPlansForRole = (roleId?: OnboardingRoleId | null) => {
  const role = getOnboardingRole(roleId);

  if (!role || role.availablePlanSlugs.length === 0) {
    return pricing_data as PricingItem[];
  }

  return (pricing_data as PricingItem[]).filter((item) =>
    role.availablePlanSlugs.includes(item.slug || "")
  );
};

const normalizeApiErrorMessage = (message: any): string | undefined => {
  if (typeof message === "string") {
    return message.trim() || undefined;
  }

  if (Array.isArray(message)) {
    return message.map(normalizeApiErrorMessage).filter(Boolean).join(" ");
  }

  if (message && typeof message === "object") {
    return Object.values(message)
      .map(normalizeApiErrorMessage)
      .filter(Boolean)
      .join(" ");
  }

  return undefined;
};

export const getApiErrorMessage = (error: any, fallback: string) => {
  const responseData = error?.response?.data;
  const directData = error?.data;

  const message =
    normalizeApiErrorMessage(responseData?.errors) ||
    normalizeApiErrorMessage(responseData?.message) ||
    normalizeApiErrorMessage(responseData?.error) ||
    normalizeApiErrorMessage(directData?.errors) ||
    normalizeApiErrorMessage(directData?.message) ||
    normalizeApiErrorMessage(directData?.error) ||
    normalizeApiErrorMessage(error?.errors) ||
    normalizeApiErrorMessage(error?.message) ||
    normalizeApiErrorMessage(error?.error) ||
    normalizeApiErrorMessage(responseData) ||
    normalizeApiErrorMessage(directData) ||
    normalizeApiErrorMessage(error);

  return message || fallback;
};

export const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

export const sanitizeDigits = (value: string, maxLength: number) =>
  value.replace(/\D/g, "").slice(0, maxLength);

export const getStripeExpiryYear = (expYear: string) =>
  expYear.length === 2 ? `20${expYear}` : expYear;

export const getQuestionOptionLabel = (option: any) => {
  if (typeof option === "string") {
    return option;
  }

  return String(
    option?.label ??
      option?.title ??
      option?.name ??
      option?.option ??
      option?.answer ??
      option?.answer_text ??
      option?.value ??
      ""
  );
};

export const getQuestionOptionId = (option: any) => {
  const id =
    option?.id ??
    option?.professional_question_option_id ??
    option?.question_option_id ??
    option?.answer_option_id ??
    option?.option_id;

  return Number.isFinite(Number(id)) ? Number(id) : undefined;
};

export const getRawQuestionOptions = (rawQuestion: any) => {
  const source =
    rawQuestion?.options ??
    rawQuestion?.answer_options ??
    rawQuestion?.question_options ??
    rawQuestion?.professional_question_options ??
    rawQuestion?.choices ??
    [];

  return Array.isArray(source) ? source : [];
};

export const extractQuestionOptions = (rawQuestion: any): string[] =>
  getRawQuestionOptions(rawQuestion)
    .map(getQuestionOptionLabel)
    .filter(Boolean);

export const extractQuestionOptionIds = (
  rawQuestion: any
): Record<string, number> =>
  getRawQuestionOptions(rawQuestion).reduce(
    (optionIdsByLabel: Record<string, number>, option: any) => {
      const label = getQuestionOptionLabel(option);
      const id = getQuestionOptionId(option);

      if (label && id !== undefined) {
        optionIdsByLabel[label] = id;
      }

      return optionIdsByLabel;
    },
    {}
  );

export const mapApiQuestion = (rawQuestion: any): OnboardingQuestion => ({
  id: String(rawQuestion?.id ?? rawQuestion?.professional_question_id ?? ""),
  professionalQuestionId: Number(
    rawQuestion?.id ?? rawQuestion?.professional_question_id ?? 0
  ),
  prompt:
    rawQuestion?.question ??
    rawQuestion?.prompt ??
    rawQuestion?.title ??
    "",
  options: extractQuestionOptions(rawQuestion),
  optionIdsByLabel: extractQuestionOptionIds(rawQuestion),
  allowMultiple: Boolean(
    rawQuestion?.allow_multiple ??
      rawQuestion?.is_multiple ??
      (rawQuestion?.type === "multi_choice" ||
        rawQuestion?.question_type === "multi_choice") ??
      false
  ),
  customOptionLabel:
    rawQuestion?.custom_option_label ??
    rawQuestion?.other_option_label ??
    undefined,
  customInputPlaceholder:
    rawQuestion?.custom_input_placeholder ??
    rawQuestion?.other_input_placeholder ??
    undefined,
  helperText:
    rawQuestion?.helper_text ??
    (rawQuestion?.type === "multi_choice" ||
    rawQuestion?.question_type === "multi_choice"
      ? "Select all that apply."
      : undefined),
});

export const extractApiQuestions = (payload: any): OnboardingQuestion[] => {
  const questionList =
    payload?.data?.questions ?? payload?.questions ?? payload?.data ?? payload;

  if (!Array.isArray(questionList)) {
    return [];
  }

  return questionList
    .map(mapApiQuestion)
    .filter((question) => question.id && question.prompt);
};

export const normalizeExistingAnswer = (
  question: OnboardingQuestion,
  rawAnswer: any
): QuestionAnswerState => {
  if (Array.isArray(rawAnswer)) {
    const optionLabelsById = Object.fromEntries(
      Object.entries(question.optionIdsByLabel ?? {}).map(([label, id]) => [
        String(id),
        label,
      ])
    );

    return {
      selectedOptions: rawAnswer.map(
        (value) => optionLabelsById[String(value)] ?? String(value)
      ),
      customValue: "",
    };
  }

  const answerText = String(rawAnswer ?? "").trim();

  if (!answerText) {
    return { selectedOptions: [], customValue: "" };
  }

  if (question.allowMultiple) {
    return {
      selectedOptions: answerText
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      customValue: "",
    };
  }

  return {
    selectedOptions: [answerText],
    customValue: "",
  };
};

export const getQuestionAnswerState = (
  questionAnswers: Record<string, QuestionAnswerState>,
  questionId: string
): QuestionAnswerState =>
  questionAnswers[questionId] ?? { selectedOptions: [], customValue: "" };

/**
 * API shape per answer (see professional-question-answers POST):
 * { professional_question_id, selected_option_ids: number[] } or { answer_text } for free text.
 */
export const formatQuestionAnswerPayload = (
  question: OnboardingQuestion,
  answerState: QuestionAnswerState
): { selected_option_ids: number[] } | { answer_text: string } => {
  const customAnswer =
    question.customOptionLabel &&
    answerState.selectedOptions.includes(question.customOptionLabel)
      ? answerState.customValue.trim()
      : "";

  if (customAnswer) {
    return { answer_text: customAnswer };
  }

  const selectedOptionIds = answerState.selectedOptions
    .map((option) => question.optionIdsByLabel?.[option])
    .map((id) => (id !== undefined ? Number(id) : NaN))
    .filter((id): id is number => Number.isFinite(id));

  if (selectedOptionIds.length > 0) {
    return { selected_option_ids: selectedOptionIds };
  }

  const normalizedOptions = answerState.selectedOptions.map((option) =>
    option === question.customOptionLabel ? answerState.customValue.trim() : option
  );

  return {
    answer_text: question.allowMultiple
      ? normalizedOptions.filter(Boolean).join(", ")
      : normalizedOptions[0] ?? "",
  };
};

export const getUnansweredQuestions = (
  activeQuestions: OnboardingQuestion[],
  questionAnswers: Record<string, QuestionAnswerState>
) =>
  activeQuestions.filter((question) => {
    const answerState = questionAnswers[question.id];

    if (!answerState || answerState.selectedOptions.length === 0) {
      return true;
    }

    if (
      question.customOptionLabel &&
      answerState.selectedOptions.includes(question.customOptionLabel)
    ) {
      return !answerState.customValue.trim();
    }

    return false;
  });

export const validateSignupState = (signupState: SignupState) => {
  const errors: Record<string, string> = {};

  if (!signupState.firstName.trim()) {
    errors.firstName = "First name is required.";
  }
  if (!signupState.lastName.trim()) {
    errors.lastName = "Last name is required.";
  }
  if (!signupState.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupState.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!signupState.password) {
    errors.password = "Password is required.";
  } else if (signupState.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  if (!signupState.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (signupState.confirmPassword !== signupState.password) {
    errors.confirmPassword = "Passwords must match.";
  }

  return errors;
};

export const validatePaymentState = (
  paymentState: PaymentState,
  selectedPlan: PricingItem
) => {
  const errors: Record<string, string> = {};

  if (!paymentState.name.trim()) {
    errors.name = "Full name is required.";
  }
  if (!paymentState.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentState.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!paymentState.phone.trim()) {
    errors.phone = "Phone number is required.";
  }

  if (selectedPlan.price === 0) {
    return errors;
  }

  const cleanCardNumber = paymentState.cardNumber.replace(/\s/g, "");

  if (!paymentState.cardName.trim()) {
    errors.cardName = "Name on card is required.";
  }
  if (!cleanCardNumber) {
    errors.cardNumber = "Card number is required.";
  } else if (!/^\d{16}$/.test(cleanCardNumber)) {
    errors.cardNumber = "Card number must be 16 digits.";
  }
  if (!/^\d{3,4}$/.test(paymentState.cvc)) {
    errors.cvc = "Enter a valid CVC.";
  }
  if (!/^(0[1-9]|1[0-2])$/.test(paymentState.expMonth)) {
    errors.expMonth = "Enter a valid month.";
  }
  if (!/^\d{2}$/.test(paymentState.expYear)) {
    errors.expYear = "Enter a valid year.";
  }

  return errors;
};
