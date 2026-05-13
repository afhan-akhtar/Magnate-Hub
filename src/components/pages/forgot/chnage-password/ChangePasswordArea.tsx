import AuthShell from "@/components/auth/AuthShell";
import PasswordChangeForm from "@/components/forms/PasswordChangeForm";

const ChangePasswordArea = () => {
  return (
    <AuthShell
      title="Create a new password"
      description="Choose a new password for your account to complete the reset process."
    >
      <PasswordChangeForm />
    </AuthShell>
  );
};

export default ChangePasswordArea;
