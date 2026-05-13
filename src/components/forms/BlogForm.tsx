"use client";

import { useAuth } from "@/context/AuthContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useState } from "react";
import { apiRequest } from "@/api/axiosInstance";
import styles from "./BlogForm.module.css";

interface BlogCommentForm {
  comment: string;
  name: string;
  email: string;
  phone?: string;
}

const schema: yup.ObjectSchema<BlogCommentForm> = yup.object({
  comment: yup.string().required("Message is required"),
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]*$/, "Phone must be numeric")
    .optional(),
});

type BlogFormProps = {
  blogId: number;
};

const BlogForm = ({ blogId }: BlogFormProps) => {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BlogCommentForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<BlogCommentForm> = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("blog_id", blogId?.toString());
      formData.append("user_id", userId ?? "0");
      formData.append("message", data.comment);
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data.phone) {
        formData.append("phone", data.phone);
      }

      await apiRequest({
        url: `blogs/${blogId}/comment`,
        method: "POST",
        data: formData,
      });

      toast.success("Comment submitted!", { position: "top-center" });

      reset();
    } catch (error) {
      console.error(error);
      toast.error("Error submitting comment", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formRoot}>
      <div className={`row gx-15 ${styles.formRow}`}>
        {/* Comment */}
        <div className="col-lg-12">
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="blog-comment">
              Comment <span className={styles.required}>*</span>
            </label>
            <textarea
              id="blog-comment"
              className={styles.textarea}
              placeholder="Write your comment..."
              {...register("comment")}
            ></textarea>
            {errors.comment?.message && (
              <p className={styles.formError}>{errors.comment.message}</p>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="col-lg-4 mb-15">
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="blog-name">
              Name <span className={styles.required}>*</span>
            </label>
            <input
              id="blog-name"
              className={styles.input}
              type="text"
              placeholder="Enter your name"
              {...register("name")}
            />
            {errors.name?.message && (
              <p className={styles.formError}>{errors.name.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="col-lg-4 mb-15">
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="blog-email">
              Email <span className={styles.required}>*</span>
            </label>
            <input
              id="blog-email"
              className={styles.input}
              type="email"
              placeholder="Enter your email"
              {...register("email")}
            />
            {errors.email?.message && (
              <p className={styles.formError}>{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="col-lg-4 mb-15">
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="blog-phone">
              Phone <span className={styles.optional}>(optional)</span>
            </label>
            <input
              id="blog-phone"
              className={styles.input}
              type="text"
              placeholder="Enter your phone"
              {...register("phone")}
            />
            {errors.phone?.message && (
              <p className={styles.formError}>{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Button */}
        <div className="col-lg-12">
          <div className={styles.actions}>
            <button
              type="submit"
              className={`tg-btn  ${styles.submitBtn}`}
              disabled={loading}
            >
              <span className="d-flex align-items-center justify-content-center">
                <span className="btn-text">
                  {loading ? "Submitting..." : "Submit Comment"}
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BlogForm;
