"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponse {
  error?: boolean;
  message?: string;
  code?: string;
  link?: string;
  redirect?:string;
}

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  rememberMe: yup.boolean().default(false),
});

const LoginForm = () => {
  const router = useRouter();
  const { loginUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("rememberMe", data.rememberMe ? "true" : "false");

      const response = (await loginUser(formData)) as LoginResponse;

      if (!response) {
        toast.error("No response from server.", { position: "top-center" });
        return;
      }

      if (response?.error) {
        if (response.message === "Account Not Verified") {
          toast.error(
            "Account not verified. Redirecting to OTP verification.",
            { position: "top-center" }
          );
          localStorage.setItem("code", response.code || "");
          router.push("/verifiy-otp");
          return;
        }

        toast.error(response?.message || "Login failed.", {
          position: "top-center",
        });
        return;
      }

      toast.success("Login successful!", { position: "top-center" });
      localStorage.removeItem("code");
      reset();

      if (response?.redirect) window.open(response.redirect,"_blank");
      router.push("/");
    } catch (error: unknown) {
      console.error("Login error:", error);
      const message =
        error instanceof Error ? error.message : null;
      toast.error(message || "Invalid email or password.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mh-auth-form">
        <div className="row text-white">
          <div className="col-lg-12 mb-25">
            <input
              className="mh-auth-input"
              type="text"
              placeholder="E-mail"
              {...register("email")}
            />
            <p className="mh-auth-error">{errors.email?.message}</p>
          </div>

          <div className="col-lg-12 mb-25">
            <input
              className="mh-auth-input"
              type="password"
              placeholder="Password"
              {...register("password")}
            />
            <p className="mh-auth-error">{errors.password?.message}</p>
          </div>

          <div className="col-lg-12 mb-20 text-end">
            <Link href="/forgot-password" className="mh-auth-inline-link">
              Forgot Password?
            </Link>
          </div>

          <div className="col-lg-12">
            <div className="d-flex align-items-center justify-content-between">
              <div className="review-checkbox d-flex align-items-center mb-25">
                <input
                  className="tg-checkbox"
                  type="checkbox"
                  id="rememberMe"
                  {...register("rememberMe")}
                />
                <label htmlFor="rememberMe" className="tg-label text-white">
                  Remember me
                </label>
              </div>
              <div className="tg-login-navigate mb-25 text-white">
                <Link href="/register" className="mh-auth-nav-link">
                  Register Now
                </Link>
              </div>
            </div>

            <button type="submit" className="tg-btn w-100" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </div>
      </form>

      <style jsx>{`
        .mh-auth-form :global(.tg-checkbox) {
          accent-color: #7d12ff;
        }

        .mh-auth-form :global(.tg-label),
        .mh-auth-form :global(.tg-login-navigate a),
        .mh-auth-form :global(a) {
          color: rgba(255, 255, 255, 0.92) !important;
          font-size: 12px !important;
          font-weight: 500;
        }

        .mh-auth-form :global(.tg-login-navigate a:hover),
        .mh-auth-form :global(.tg-login-navigate a:focus),
        .mh-auth-form :global(.tg-login-navigate a:active),
        .mh-auth-form :global(a:hover),
        .mh-auth-form :global(a:focus),
        .mh-auth-form :global(a:active) {
          color: rgba(255, 255, 255, 0.92) !important;
          cursor: pointer;
        }

        .mh-auth-form :global(.tg-btn) {
          min-height: 52px;
          border: 0;
          border-radius: 14px;
          background: var(--mh-auth-button-bg);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          box-shadow: 0 16px 36px rgba(90, 0, 255, 0.28);
        }

        .mh-auth-form :global(.tg-btn:disabled) {
          opacity: 0.72;
        }
      `}</style>
    </>
  );
};

export default LoginForm;
