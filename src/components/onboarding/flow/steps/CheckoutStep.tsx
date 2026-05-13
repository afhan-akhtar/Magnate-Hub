"use client";

import type { CheckoutStepProps } from "../types";
import styles from "../../OnboardingFlow.module.css";

const CheckoutStep = ({
  selectedPlan,
  paymentState,
  expiryDisplayValue,
  fieldErrors,
  actionLoading,
  onSubmit,
  onUpdateField,
  onUpdateExpiryValue,
  formatCardNumber,
  sanitizeDigits,
}: CheckoutStepProps) => (
  <form onSubmit={onSubmit}>
    <div className={`${styles.checkoutGrid} ${styles.checkoutGridCentered}`}>
      <div className={styles.checkoutFormPanel}>
        {selectedPlan.price > 0 && (
          <div className={styles.checkoutSection}>
            <div className={styles.checkoutSectionHeader}>
              <h3 className={styles.checkoutSectionTitle}>
                Payment information
              </h3>
              <span className={styles.checkoutSecurityNote}>
                Secured by Stripe
              </span>
            </div>

            <div className={styles.checkoutPaymentGrid}>
              <div className={`${styles.field} ${styles.checkoutFieldWide}`}>
                <input
                  className={`${styles.input} ${styles.checkoutInput}`}
                  value={paymentState.cardNumber}
                  onChange={(event) =>
                    onUpdateField(
                      "cardNumber",
                      formatCardNumber(event.target.value)
                    )
                  }
                  placeholder="Card number"
                  inputMode="numeric"
                />
                <p className={styles.error}>{fieldErrors.cardNumber}</p>
              </div>

              <div className={styles.field}>
                <input
                  className={`${styles.input} ${styles.checkoutInput}`}
                  value={expiryDisplayValue}
                  onChange={(event) => onUpdateExpiryValue(event.target.value)}
                  placeholder="MM/YY"
                  inputMode="numeric"
                  maxLength={5}
                />
                <p className={styles.error}>
                  {fieldErrors.expMonth || fieldErrors.expYear}
                </p>
              </div>

              <div className={styles.field}>
                <input
                  className={`${styles.input} ${styles.checkoutInput}`}
                  value={paymentState.cardName}
                  onChange={(event) =>
                    onUpdateField("cardName", event.target.value)
                  }
                  placeholder="Name on card"
                />
                <p className={styles.error}>{fieldErrors.cardName}</p>
              </div>

              <div className={styles.field}>
                <input
                  className={`${styles.input} ${styles.checkoutInput}`}
                  value={paymentState.cvc}
                  onChange={(event) =>
                    onUpdateField("cvc", sanitizeDigits(event.target.value, 4))
                  }
                  placeholder="CVV"
                  inputMode="numeric"
                />
                <p className={styles.error}>{fieldErrors.cvc}</p>
              </div>
            </div>
          </div>
        )}

        <div className={styles.checkoutSection}>
          <h3 className={styles.checkoutSectionTitle}>Billing information</h3>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>Full name</label>
              <input
                className={`${styles.input} ${styles.checkoutInput}`}
                value={paymentState.name}
                onChange={(event) => onUpdateField("name", event.target.value)}
                placeholder="John Doe"
              />
              <p className={styles.error}>{fieldErrors.name}</p>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Email address</label>
              <input
                className={`${styles.input} ${styles.checkoutInput}`}
                type="email"
                value={paymentState.email}
                onChange={(event) => onUpdateField("email", event.target.value)}
                placeholder="john@example.com"
              />
              <p className={styles.error}>{fieldErrors.email}</p>
            </div>

            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Phone number</label>
              <input
                className={`${styles.input} ${styles.checkoutInput}`}
                value={paymentState.phone}
                onChange={(event) => onUpdateField("phone", event.target.value)}
                placeholder="+61 400 000 000"
              />
              <p className={styles.error}>{fieldErrors.phone}</p>
            </div>

            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Message</label>
              <textarea
                className={`${styles.textarea} ${styles.checkoutTextarea}`}
                value={paymentState.message}
                onChange={(event) =>
                  onUpdateField("message", event.target.value)
                }
                placeholder="Any additional details you want the team to know..."
              />
            </div>
          </div>
        </div>

        <div className={styles.checkoutNotice}>
          {selectedPlan.price === 0
            ? "Free plan selected. No card details are required. Continue to the final setup questions."
            : "Payment is processed securely through Stripe. After a successful payment, you will continue to the onboarding questions."}
        </div>

        <div className={`${styles.actionRow} ${styles.checkoutActionRow}`}>
          <button
            type="submit"
            className={`${styles.primaryButton} ${styles.checkoutPrimaryButton}`}
            disabled={actionLoading === "checkout"}
          >
            {actionLoading === "checkout"
              ? "Processing..."
              : selectedPlan.price === 0
              ? "Continue to questions"
              : `Pay $${selectedPlan.price} and continue`}
          </button>
        </div>
      </div>
    </div>
  </form>
);

export default CheckoutStep;
