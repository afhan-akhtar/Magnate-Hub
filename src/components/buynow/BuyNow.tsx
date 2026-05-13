"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, ToastContainer } from "react-toastify";
import * as yup from "yup";
import styles from "./BuyNow.module.css";
import pricing_data from "@/data/PricingData";
import Loading from "../loading/Loading";
import { submitStripePayment } from "@/lib/submitStripePayment";
import { STRIPE_TEST_PUBLISHABLE_KEY } from "../onboarding/flow/utils";

interface BuyNowProps {
  slug: string;
}

interface PricingItem {
  title: string;
  price: number;
  slug?: string;
  desc: string;
  list: string[];
  id:any;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  cardName: string;
  cardNumber: string;
  cvc: string;
  expMonth: string;
  expYear: string;
  plan: string;
}

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  message: yup.string().required("Message is required"),
  cardName: yup.string().required("Name on card is required"),
  cardNumber: yup
    .string()
    .required("Card number is required")
    .matches(/^[0-9]{16}$/, "Card must be 16 digits"),
  cvc: yup
    .string()
    .required("CVC is required")
    .matches(/^[0-9]{3,4}$/, "Invalid CVC"),
  expMonth: yup
    .string()
    .required("MM is required")
    .matches(/^(0[1-9]|1[0-2])$/, "Invalid month"),
  expYear: yup
    .string()
    .required("Year required")
    .matches(/^20[2-9][0-9]$/, "Invalid year"),
  plan: yup.string().required("Please select a plan"),
});

declare global {
  interface Window {
    Stripe: any;
  }
}

const BuyNow: React.FC<BuyNowProps> = ({ slug }) => {
  const [selectedSlug, setSelectedSlug] = useState(slug);
  const [item, setItem] = useState<PricingItem | null>(null);
  const [showFullText, setShowFullText] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { plan: slug },
  });

  const getPackageDetails = (slug: string) => {
    const data = pricing_data.find((plan) => plan.slug === slug);
    setItem(data || null);
  };

  useEffect(() => {
    getPackageDetails(selectedSlug);
  }, [selectedSlug]);


  useEffect(() => {
    const interval = setInterval(() => {
      if (window.Stripe) {
        window.Stripe.setPublishableKey(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || STRIPE_TEST_PUBLISHABLE_KEY);
        clearInterval(interval);
      }
    }, 500);
  }, []);



  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
       const stripeResponse = await new Promise((resolve, reject) => {
        window.Stripe.createToken(
          {
            number: data.cardNumber,
            cvc: data.cvc,
            exp_month: data.expMonth,
            exp_year: data.expYear,
            name: data.cardName,
          },
          (status: number, response: any) => {
            if (response.error) reject(response.error.message);
            else resolve(response);
          }
        );
      });

      const token = (stripeResponse as any).id;

      const response = await submitStripePayment({
        stripeToken: token,
        planId: item && item.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        message: data.message,
      });

       window.open(
          `https://dash.magnatehub.au${response.redirect || "/dashboard/professionals"}`,
          "_blank"
        );
      toast.success("Plan Purchase Successfully!");
      reset({plan: selectedSlug});
    } catch (error: any) {
      toast.error(error?.message || "Error submitting form");
    } finally {
      setLoading(false);
    }
  };


  const truncatedText =
    item?.desc && item.desc.length > 120
      ? item.desc.slice(0, 120) + "..."
      : item?.desc;

  if (!item) {
    return <Loading loadingText={"Loading Package Details"} />;
  }

  return (
    <>
    <ToastContainer  style={{ marginTop: "120px" }}/>
    <div className={styles.buyNowContainer}>
      <div className="container">
        <div className="row justify-content-center g-4">
          <div className="col-lg-7 col-md-8">
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Complete Your Purchase</h2>
                <p className={styles.formSubtitle}>
                  Fill in your details to proceed with the payment
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.formSection}>
                  <label className={styles.label}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 11l3 3L22 4"></path>
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                    </svg>
                    Select Package
                  </label>
                  <div className={styles.selectWrapper}>
                    <select
                      {...register("plan")}
                      value={selectedSlug}
                      onChange={(e) => setSelectedSlug(e.target.value)}
                      className={styles.select}
                    >
                      {pricing_data.map((p) => (
                        <option key={p.slug} value={p.slug}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.plan && (
                    <p className={styles.error}>{errors.plan.message}</p>
                  )}
                </div>

                {/* CONTACT DETAILS */}
                <div className={styles.formSection}>
                  <div className={styles.sectionHeader}>
                    <h4 className={styles.sectionTitle}>Contact Details</h4>
                    <div className={styles.sectionDivider}></div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Full Name</label>
                        <div className={styles.inputWrapper}>
                          <svg
                            className={styles.inputIcon}
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          <input
                            className={styles.input}
                            {...register("name")}
                            placeholder="John Doe"
                          />
                        </div>
                        {errors.name && (
                          <p className={styles.error}>{errors.name.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>
                          Email Address
                        </label>
                        <div className={styles.inputWrapper}>
                          <svg
                            className={styles.inputIcon}
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                          <input
                            type="email"
                            className={styles.input}
                            style={{paddingLeft:'42px'}}
                            {...register("email")}
                            placeholder="john@example.com"
                          />
                        </div>
                        {errors.email && (
                          <p className={styles.error}>{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>
                          Phone Number
                        </label>
                        <div className={styles.inputWrapper}>
                          <svg
                            className={styles.inputIcon}
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
                          </svg>
                          <input
                            type="tel"
                            className={styles.input}
                            style={{paddingLeft:'42px'}}
                            {...register("phone")}
                            placeholder="+61 400 000 000"
                          />
                        </div>
                        {errors.phone && (
                          <p className={styles.error}>{errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>
                          Message
                        </label>
                        <textarea
                          className={styles.textarea}
                          {...register("message")}
                          placeholder="Any additional information or questions..."
                          rows={4}
                        ></textarea>
                        {errors.message && (
                          <p className={styles.error}>
                            {errors.message.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.formSection}>
                  <div className={styles.sectionHeader}>
                    <h4 className={styles.sectionTitle}>Payment Information</h4>
                    <div className={styles.sectionDivider}></div>
                  </div>

                  <div className="row g-3">
                    <div className="col-12">
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>
                          Name on Card
                        </label>
                        <div className={styles.inputWrapper}>
                          <svg
                            className={styles.inputIcon}
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          <input
                            className={styles.input}
                            {...register("cardName")}
                            placeholder="JOHN DOE"
                          />
                        </div>
                        {errors.cardName && (
                          <p className={styles.error}>
                            {errors.cardName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Card Number</label>
                        <div className={styles.inputWrapper}>
                          <svg
                            className={styles.inputIcon}
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect
                              x="1"
                              y="4"
                              width="22"
                              height="16"
                              rx="2"
                              ry="2"
                            ></rect>
                            <line x1="1" y1="10" x2="23" y2="10"></line>
                          </svg>
                          <input
                            className={styles.input}
                            {...register("cardNumber")}
                            placeholder="1234 5678 9012 3456"
                            maxLength={16}
                          />
                        </div>
                        {errors.cardNumber && (
                          <p className={styles.error}>
                            {errors.cardNumber.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>CVC</label>
                        <div className={styles.inputWrapper}>
                          <svg
                            className={styles.inputIcon}
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect
                              x="1"
                              y="4"
                              width="22"
                              height="16"
                              rx="2"
                              ry="2"
                            ></rect>
                            <line x1="1" y1="10" x2="23" y2="10"></line>
                          </svg>
                          <input
                            className={styles.input}
                            {...register("cvc")}
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                        {errors.cvc && (
                          <p className={styles.error}>{errors.cvc.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>
                          Expiry Month
                        </label>
                        <div className={styles.inputWrapper}>
                          <input
                            className={styles.input}
                            {...register("expMonth")}
                            placeholder="MM"
                            maxLength={2}
                          />
                        </div>
                        {errors.expMonth && (
                          <p className={styles.error}>
                            {errors.expMonth.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Expiry Year</label>
                        <div className={styles.inputWrapper}>
                          <input
                            className={styles.input}
                            {...register("expYear")}
                            placeholder="YYYY"
                            maxLength={4}
                          />
                        </div>
                        {errors.expYear && (
                          <p className={styles.error}>
                            {errors.expYear.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className={styles.spinnerSmall}></span>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                      Complete Payment - ${item.price}/month
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          <div className="col-lg-5 col-md-6">
            <div className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <div className={styles.pricingBadge}>Selected Plan</div>
                <h3 className={styles.pricingTitle}>{item.title}</h3>
              </div>

              <div className={styles.pricingAmount}>
                <div className={styles.priceWrapper}>
                  <span className={styles.currency}>$</span>
                  <span className={styles.price}>{item.price}</span>
                </div>
                {/* <span className={styles.pricePeriod}>/month</span> */}
              </div>

              <div className={styles.pricingDescription}>
                <p className={styles.descriptionText}>
                  {showFullText ? item.desc : truncatedText}
                </p>
                {item.desc.length > 120 && (
                  <button
                    onClick={() => setShowFullText(!showFullText)}
                    className={styles.seeMoreBtn}
                  >
                    {showFullText ? "See Less" : "See More"}
                  </button>
                )}
              </div>
              <div className="d-flex align-items-center gap-2">
                <p><strong>Includes:</strong></p>
                <p>10% GST</p>
              </div>
              <div className={styles.featuresList}>
                <h5 className={styles.featuresTitle}>What's Included:</h5>
                <ul className={styles.features}>
                  {item.list.map((list, i) => (
                    <li key={i} className={styles.featureItem}>
                      <span className={styles.checkIcon}>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17 8.26858V9.00458C16.999 10.7297 16.4404 12.4083 15.4075 13.79C14.3745 15.1718 12.9226 16.1826 11.2683 16.6717C9.61394 17.1608 7.8458 17.1021 6.22757 16.5042C4.60934 15.9064 3.22772 14.8015 2.28877 13.3542C1.34981 11.907 0.903833 10.195 1.01734 8.47363C1.13085 6.75223 1.79777 5.11364 2.91862 3.80224C4.03948 2.49083 5.55423 1.57688 7.23695 1.1967C8.91967 0.816507 10.6802 0.990449 12.256 1.69258M17 2.60458L9 10.6126L6.6 8.21258"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span>{list}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.securityBadge}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default BuyNow;
