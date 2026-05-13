"use client";
import Image from "next/image";
import Link from "next/link";

import logo from "@/assets/img/logo/logo-white.png";
import { useState } from "react";
import { apiRequest } from "@/api/axiosInstance";

const FooterOne = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const submitNewsLetter = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await apiRequest({
        method: "POST",
        url: "subscribe",
        data: { email },
      });

      if (response) {
        setMessage("Successfully subscribed to our newsletter!");
        setIsSuccess(true);
      }
    } catch (error) {
      setMessage("Failed to subscribe. Please try again later.");
      setIsSuccess(false);
    } finally {
      setEmail("");
      setLoading(false);
    }
  };

  return (
    <footer>
      <div
        className="tg-footer-area tg-footer-su-wrapper pt-100"
        style={{
          backgroundColor: "#560ce3",
        }}
      >
        <div className="container">
          <div className="tg-footer-top mb-45">
            <div className="row">
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                <div className="tg-footer-widget mb-40">
                  <div className="tg-footer-logo mb-20">
                    <Link href="/">
                      <Image
                        src={logo}
                        className="w-50 h-50"
                        alt="Magnate Hub Logo"
                      />
                    </Link>
                  </div>
                  <p className="mb-20">
                    Magnate Hub connects business owners, investors, and
                    entrepreneurs in one trusted marketplace. Buy, sell, or
                    invest in businesses with confidence and transparency.
                  </p>
                  <div className="tg-footer-form mb-30">
                    <form onSubmit={submitNewsLetter}>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <button
                        className="tg-footer-form-btn"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <span>Sending...</span>
                        ) : (
                          <svg
                            width="22"
                            height="17"
                            viewBox="0 0 22 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1.52514 8.47486H20.4749M20.4749 8.47486L13.5 1.5M20.4749 8.47486L13.5 15.4497"
                              stroke="white"
                              strokeWidth="1.77778"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                    </form>

                    {message && (
                      <p
                        style={{
                          color: isSuccess ? "#00ff91" : "#ff4d4d",
                          marginTop: "8px",
                          fontSize: "14px",
                        }}
                      >
                        {message}
                      </p>
                    )}
                  </div>
                  <div className="tg-footer-social">
                    <Link
                      href="https://www.facebook.com/profile.php?id=100089795772361"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fa-brands fa-facebook-f"></i>
                    </Link>

                    <Link
                      href="https://www.instagram.com/magnatehubaus/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fa-brands fa-instagram"></i>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                <div className="tg-footer-widget tg-footer-link ml-80 mb-40">
                  <h3 className="tg-footer-widget-title mb-25">Quick Links</h3>
                  <ul>
                    <li>
                      <Link href="/">Home</Link>
                    </li>
                    <li>
                      <Link href="/about">About Us</Link>
                    </li>
                    <li>
                      <Link href="/listings">Business Listings</Link>
                    </li>
                    <li>
                      <Link href="/investment-opportunities">
                        Investment Opportunities
                      </Link>
                    </li>
                    <li>
                      <Link href="/premium-packages">Premium Packages</Link>
                    </li>
                    <li>
                      <Link href="/media1">Media</Link>
                    </li>
                    <li>
                      <Link href="/pricing">Pricing</Link>
                    </li>
                    <li>
                      <Link href="/contact">Contact Us</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
                <div className="tg-footer-widget tg-footer-info mb-40">
                  <h3 className="tg-footer-widget-title mb-25">
                    Contact Information
                  </h3>
                  <ul className="mb-4">
                    <li className="mb-3 d-flex align-items-start">
                      <span className="me-2">
                        <i className="fa-solid fa-location-dot"></i>
                      </span>
                      <span>Melbourne, Australia</span>
                    </li>
                    <li className="mb-3 d-flex align-items-start">
                      <span className="me-2">
                        <i className="fa-solid fa-envelope"></i>
                      </span>
                      <Link
                        style={{
                          textTransform: "lowercase",
                        }}
                        href="mailto:info@magnatehub.au"
                      >
                        info@magnatehub.au
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tg-footer-copyright text-center">
          <span>
            Copyright © {new Date().getFullYear()}{" "}
            <Link href="/">Magnate Hub</Link> | All Rights Reserved
          </span>
        </div>
      </div>
    </footer>
  );
};

export default FooterOne;
