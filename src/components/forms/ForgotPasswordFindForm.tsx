"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/api/axiosInstance";
import * as yup from "yup";

interface EmailData {
  email: string;
}

interface ForgotPasswordResponse {
  error?: boolean;
  message?: string;
  code?: string;
}

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPasswordFindForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: EmailData) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("email", data.email);

      const response = (await apiRequest({
        url: "password/forgot",
        method: "POST",
        data: formData,
      })) as ForgotPasswordResponse;

      if (!response?.error) {
        localStorage.removeItem("verify_email");
        localStorage.setItem("verify_email", data.email);
        reset();
        router.push("/verify-reset-code");
        return;
      }

      toast.error(response.message || "Not able to send token", {
        position: "top-center",
      });
    } catch {
      toast.error("Something went wrong", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
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

        <div className="col-lg-12 mb-20 text-end">
          <Link href="/login" className="mh-auth-inline-link">
            Back to login
          </Link>
        </div>

        <div className="col-lg-12">
          <button type="submit" className="tg-btn w-100" disabled={loading}>
            {loading ? "Sending code..." : "Send code"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ForgotPasswordFindForm;
