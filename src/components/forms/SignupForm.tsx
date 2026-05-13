"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import * as yup from "yup";
import { useRouter } from "next/navigation";

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const schema = yup
  .object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("password")], "Passwords must match"),
  })
  .required();

const SignupForm = () => {
  const [activeTab, setActiveTab] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const { registerUser } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      setLoading(true);
      // Prepare form data
      const formData = new FormData();
      formData.append("first_name", data.firstName);
      formData.append("last_name", data.lastName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("password_confirmation", data.confirmPassword);
      formData.append("type", activeTab);

      const response = await registerUser(formData);

      if (!response) {
        toast.error("No response from server.", { position: "top-center" });
        return;
      }

      if ((response as any)?.error) {
        toast.error((response as any)?.message || "Registration failed.", {
          position: "top-center",
        });
        return;
      }
      if (!response.error && response.code) {
        localStorage.setItem("code", response.code);
        localStorage.setItem("otp", response.otp || "");
        router.push("/verifiy-otp");
      }
      reset();
    } catch (error: any) {
      console.error("Registration error:", error);
      const message =
        error?.response?.data?.message ||
        error?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      toast.error(message, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "buyer", label: "Buyer" },
    { id: "seller", label: "Seller" },
    { id: "capital_raiser", label: "Capital Raiser" },
    { id: "broker", label: "Brokers + Franchisers" },
  ];

  return (
    <>
     <ToastContainer/>
      <div className="d-flex gap-2 justify-content-center mb-4 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="tab-btn"
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background:
                activeTab === tab.id
                  ? "linear-gradient(90deg,#6A14DA,#316FF6)"
                  : "#F1F1F1",
              color: activeTab === tab.id ? "#fff" : "#333",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-lg-6 mb-25">
            <input
              className="input"
              type="text"
              placeholder="First Name"
              {...register("firstName")}
            />
            <p className="form_error">{errors.firstName?.message}</p>
          </div>

          <div className="col-lg-6 mb-25">
            <input
              className="input"
              type="text"
              placeholder="Last Name"
              {...register("lastName")}
            />
            <p className="form_error">{errors.lastName?.message}</p>
          </div>

          <div className="col-lg-12 mb-25">
            <input
              className="input"
              type="email"
              placeholder="Example@gmail.com"
              {...register("email")}
            />
            <p className="form_error">{errors.email?.message}</p>
          </div>

          <div className="col-lg-12 mb-25">
            <input
              className="input"
              type="password"
              placeholder="Password"
              {...register("password")}
            />
            <p className="form_error">{errors.password?.message}</p>
          </div>

          <div className="col-lg-12 mb-25">
            <input
              className="input"
              type="password"
              placeholder="Re-type Password"
              {...register("confirmPassword")}
            />
            <p className="form_error">{errors.confirmPassword?.message}</p>
          </div>

          <div className="col-lg-12">
            <div className="d-flex align-items-center justify-content-between">
              <div className="review-checkbox d-flex align-items-center mb-25">
                <label className="tg-label text-white">
                  Already Have An Account?
                </label>
              </div>
              <div className="tg-login-navigate mb-25 ">
                <Link href="/login" className="text-white">
                  Log In
                </Link>
              </div>
            </div>

            <button type="submit" className="tg-btn w-100" disabled={loading}>
              {loading ? "Sign Up Free..." : "Sign Up Free"}
            </button>
          </div>
        </div>
      </form>

      <style jsx>{`
        .form_error {
          color: red !important;
          font-size: 11px;
          margin: 4px 4px;
        }
      `}</style>
    </>
  );
};

export default SignupForm;
