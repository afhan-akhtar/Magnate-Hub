import AuthShell from "@/components/auth/AuthShell";
import ForgotPasswordFindForm from "@/components/forms/ForgotPasswordFindForm";

const ForgotPasswordArea = () => {
  return (
    <AuthShell
      title="Forgot your password?"
      description="Enter your email address and we will send you a reset code."
    >
      <ForgotPasswordFindForm />
    </AuthShell>
  );
};

export default ForgotPasswordArea;
