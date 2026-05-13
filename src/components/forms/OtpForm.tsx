"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/api/axiosInstance";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

interface OtpData {
  otp: string;
  code?: string;
}

const schema = yup.object({
  otp: yup
    .string()
    .required("OTP is required")
    .min(4, "OTP must be at least 4 digits"),
});

type MessageType = "success" | "error" | "info";

const OtpForm = () => {
  const router = useRouter();
  const { verifiyOtp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpData>({
    resolver: yupResolver(schema),
  });

  const [otpResendLoading, setOtpResendLoading] = useState(false);
  const [otpVerifyLoading, setOtpVerifyLoading] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<MessageType>("info");

  const getCode = () => {
    const code = localStorage.getItem("code");
    if (!code) {
      setMessageType("error");
      setMessage("Something went wrong. Please try again.");
      return;
    }
    return code;
  };

  const onSubmit = async (data: OtpData) => {
    const code = getCode();
    if (!code) return;

    const formData = new FormData();
    formData.append("otp", data.otp);
    formData.append("code", code);

    try {
      setOtpVerifyLoading(true);
      setMessage(null);

      const response = await verifiyOtp(formData);

      if ((response as any)?.error) {
        setMessageType("error");
        setMessage(response.message || "Invalid OTP!");
        return;
      }

      setMessageType("success");
      setMessage("OTP verified successfully!");
      router.push("/login");
    } catch {
      setMessageType("error");
      setMessage("Something went wrong. Please try again.");
    } finally {
      setOtpVerifyLoading(false);
    }
  };

  const handleResend = async () => {
    const code = getCode();
    if (!code) return;

    const formData = new FormData();
    formData.append("code", code);

    try {
      setOtpResendLoading(true);
      setMessageType("info");
      setMessage("Generating OTP...");

      const response = await apiRequest({
        url: "Raising/Resend/Otp",
        method: "POST",
        data: formData,
      });

      if ((response as any)?.error) {
        setMessageType("error");
        setMessage(response.message || "Failed to resend OTP");
        return;
      }

      localStorage.setItem("code", response.code);
      setMessageType("success");
      setMessage("OTP resent successfully. Please check your email.");
    } catch {
      setMessageType("error");
      setMessage("Failed to resend OTP.");
    } finally {
      setOtpResendLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="col-lg-12 mb-25">
          <input
            className="input"
            type="text"
            placeholder="Enter OTP"
            {...register("otp")}
          />
          <p className="form_error">{errors.otp?.message}</p>
        </div>

        {message && <p className={`form_message ${messageType}`}>{message}</p>}

        <div className="d-flex align-items-center justify-content-between mb-3">
          <span>Didn’t receive the OTP?</span>
          <button
            type="button"
            className="resend-btn"
            onClick={handleResend}
            disabled={otpResendLoading}
          >
            {otpResendLoading ? "Resending..." : "Resend"}
          </button>
        </div>

        <button
          type="submit"
          className="tg-btn w-100"
          disabled={otpResendLoading || otpVerifyLoading}
        >
          {otpVerifyLoading ? "Verify OTP..." : "Verify OTP"}
        </button>
      </form>

      <style jsx>{`
        .form_error {
          color: red;
          font-size: 11px;
          margin: 4px 0;
        }

        .form_message {
          font-size: 13px;
          margin-bottom: 12px;
        }

        .form_message.success {
          color: #28a745;
        }

        .form_message.error {
          color: #dc3545;
        }

        .form_message.info {
          color: #ffc107;
        }

        .resend-btn {
          background: none;
          border: none;
          color: white;
          text-decoration: none;
          cursor: pointer;
          font-size: 14px;
          padding: 0;
        }
      `}</style>
    </>
  );
};

export default OtpForm;
