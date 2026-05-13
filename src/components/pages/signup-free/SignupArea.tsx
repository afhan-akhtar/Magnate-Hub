import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import { Suspense } from "react";

const SignupArea = () => {
  return (
    <Suspense fallback={null}>
      <OnboardingFlow defaultPlanSlug="free_plan" />
    </Suspense>
  );
};

export default SignupArea;
