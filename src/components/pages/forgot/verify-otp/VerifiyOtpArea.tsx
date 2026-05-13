import AuthShell from "@/components/auth/AuthShell";
import PasswordOtpForm from "@/components/forms/PasswordOtpForm";

const VerifiyOtpArea = () => {
  return (
    <AuthShell
      title="Verify your reset code"
      description="Enter the OTP sent to your email so you can continue resetting your password."
    >
      <PasswordOtpForm />
    </AuthShell>
  );
};

export default VerifiyOtpArea;
