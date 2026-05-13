import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import { Suspense } from "react";

const RegisterArea = () => {
  return (
    <Suspense fallback={null}>
      <OnboardingFlow />
    </Suspense>
  );
};

export default RegisterArea;
