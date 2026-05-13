import type { OnboardingQuestion, OnboardingRoleId } from "@/data/OnboardingQuestions";

export type StepId =
  | "role"
  | "signup"
  | "otp"
  | "plan"
  | "checkout"
  | "questions";

export type MessageTone = "info" | "success" | "error";

export interface PricingItem {
  id: number;
  slug?: string;
  title: string;
  desc: string;
  price: number;
  list: string[];
}

export interface StepContent {
  eyebrow: string;
  title: string;
  description: string;
}

export interface OnboardingFlowProps {
  defaultPlanSlug?: string;
}

export interface SignupState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface PaymentState {
  name: string;
  email: string;
  phone: string;
  message: string;
  cardName: string;
  cardNumber: string;
  cvc: string;
  expMonth: string;
  expYear: string;
}

export interface InlineMessage {
  tone: MessageTone;
  text: string;
}

export interface QuestionAnswerState {
  selectedOptions: string[];
  customValue: string;
}

export interface SidebarSummary {
  roleLabel: string;
  email: string;
  planTitle: string;
  planPrice: number;
}

export interface RoleStepProps {
  selectedRoleId: OnboardingRoleId | null;
  onSelectRole: (roleId: OnboardingRoleId) => void;
  onContinue: () => void;
}

export interface SignupStepProps {
  signupState: SignupState;
  fieldErrors: Record<string, string>;
  actionLoading: StepId | null;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onUpdateField: (field: keyof SignupState, value: string) => void;
}

export interface OtpStepProps {
  otpCode: string;
  resendCountdown: number;
  fieldErrors: Record<string, string>;
  otpMessage: InlineMessage | null;
  actionLoading: StepId | null;
  otpInputRef: React.RefObject<HTMLInputElement | null>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onOtpChange: (value: string) => void;
  onResend: () => void;
}

export interface PlanStepProps {
  plans: PricingItem[];
  selectedPlan: PricingItem;
  selectedRole: { recommendedPlanSlug?: string } | null | undefined;
  expandedPlanDescriptions: Record<string, boolean>;
  planSwiperRef: React.MutableRefObject<import("swiper").Swiper | null>;
  onSelectPlan: (slug: string) => void;
  onPlanCardKeyDown: (
    event: React.KeyboardEvent<HTMLDivElement>,
    slug: string
  ) => void;
  onToggleDescription: (planKey: string) => void;
  onContinue: () => void;
}

export interface CheckoutStepProps {
  selectedPlan: PricingItem;
  paymentState: PaymentState;
  expiryDisplayValue: string;
  fieldErrors: Record<string, string>;
  actionLoading: StepId | null;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onUpdateField: (field: keyof PaymentState, value: string) => void;
  onUpdateExpiryValue: (value: string) => void;
  formatCardNumber: (value: string) => string;
  sanitizeDigits: (value: string, maxLength: number) => string;
}

export interface QuestionsStepProps {
  activeQuestions: OnboardingQuestion[];
  questionAnswers: Record<string, QuestionAnswerState>;
  unansweredQuestions: OnboardingQuestion[];
  fieldErrors: Record<string, string>;
  actionLoading: StepId | null;
  onSelectQuestion: (question: OnboardingQuestion, answer: string) => void;
  onCustomValueChange: (questionId: string, value: string) => void;
  onFinish: () => void;
}
