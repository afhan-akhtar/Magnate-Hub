import LoginArea from "./LoginArea";
import HeaderOne from "@/layouts/headers/HeaderOne";
import FooterOne from "@/layouts/footers/FooterOne";

const Login = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <LoginArea />
      </main>
      <FooterOne />
    </>
  );
};

export default Login;
