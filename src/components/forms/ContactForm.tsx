"use client";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { apiRequest } from "@/api/axiosInstance";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const schema = yup
  .object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(/^\+?[0-9]+$/, "Phone number can include an optional +"),
    message: yup.string().required("Message is required"),
  })
  .required();

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await apiRequest({
        url: "/contact",
        method: "POST",
        data,
      });
        toast.success("Message sent successfully!", { position: "top-center" });
        reset();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} id="contact-form">
      <div className="row">
        <div className="col-lg-6 mb-25">
          <input
            className="input"
            type="text"
            {...register("name")}
            placeholder="Name"
          />
          <p className="form_error">{errors.name?.message}</p>
        </div>

        <div className="col-lg-6 mb-25">
          <input
            className="input"
            type="email"
            {...register("email")}
            placeholder="E-mail"
          />
          <p className="form_error">{errors.email?.message}</p>
        </div>

        <div className="col-lg-12 mb-25">
          <input
            className="input"
            type="tel"
            {...register("phone")}
            placeholder="Phone Number"
          />
          <p className="form_error">{errors.phone?.message}</p>
        </div>

        <div className="col-lg-12">
          <textarea
            className="textarea mb-5"
            {...register("message")}
            placeholder="Your Message"
          ></textarea>
          <p className="form_error">{errors.message?.message}</p>

          <button type="submit" className="tg-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </div>
      </div>
    </form>
     <style jsx>{`
        .form_error {
          color: red !important;
          font-size: 11px;
          margin:4px;
        }
      `}</style>
    </>
  );
};

export default ContactForm;



