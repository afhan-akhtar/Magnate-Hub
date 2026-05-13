import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/forms/LoginForm";

const LoginArea = () => {
  return (
    <AuthShell
      title="Sign in to your account"
      description="Enter your credentials to access your account."
    >
      <LoginForm />
    </AuthShell>
  );
};

export default LoginArea;
