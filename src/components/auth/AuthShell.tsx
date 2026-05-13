import { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

const AuthShell = ({ title, description, children }: AuthShellProps) => {
  return (
    <div className="tg-login-area mh-auth-page pt-130 pb-130 bg-cover bg-center relative">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8 col-md-10">
            <div className="mh-auth-wrapper">
              <div className="tg-login-top text-center mb-30">
                <h2 className="mh-auth-heading">{title}</h2>
                <p className="mh-auth-subheading">{description}</p>
              </div>
              <div className="tg-login-form">
                <div className="tg-tour-about-review-form">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
