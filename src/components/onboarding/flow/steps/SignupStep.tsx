"use client";

import Link from "next/link";
import type { SignupStepProps } from "../types";
import styles from "../../OnboardingFlow.module.css";

const SignupStep = ({
  signupState,
  fieldErrors,
  actionLoading,
  onSubmit,
  onUpdateField,
}: SignupStepProps) => (
  <form onSubmit={onSubmit} className={styles.signupForm} autoComplete="off">
    <input
      type="text"
      name="fake_username"
      autoComplete="username"
      tabIndex={-1}
      className={styles.autofillTrap}
    />
    <input
      type="password"
      name="fake_password"
      autoComplete="current-password"
      tabIndex={-1}
      className={styles.autofillTrap}
    />
    <div className={`${styles.formGrid} ${styles.signupFormGrid}`}>
      <div className={styles.field}>
        <label className={`${styles.label} ${styles.signupLabel}`}>
          First name
        </label>
        <input
          className={`${styles.input} ${styles.signupInputGhost}`}
          name="register_first_name"
          autoComplete="off"
          value={signupState.firstName}
          onChange={(event) => onUpdateField("firstName", event.target.value)}
          placeholder="John"
        />
        <p className={styles.error}>{fieldErrors.firstName}</p>
      </div>

      <div className={styles.field}>
        <label className={`${styles.label} ${styles.signupLabel}`}>
          Last name
        </label>
        <input
          className={`${styles.input} ${styles.signupInputGhost}`}
          name="register_last_name"
          autoComplete="off"
          value={signupState.lastName}
          onChange={(event) => onUpdateField("lastName", event.target.value)}
          placeholder="Doe"
        />
        <p className={styles.error}>{fieldErrors.lastName}</p>
      </div>

      <div className={`${styles.field} ${styles.fieldFull}`}>
        <label className={`${styles.label} ${styles.signupLabel}`}>
          Email address
        </label>
        <input
          className={`${styles.input} ${styles.signupInputSolid}`}
          type="email"
          name="register_email"
          autoComplete="off"
          value={signupState.email}
          onChange={(event) => onUpdateField("email", event.target.value)}
          placeholder="john@example.com"
        />
        <p className={styles.error}>{fieldErrors.email}</p>
      </div>

      <div className={styles.field}>
        <label className={`${styles.label} ${styles.signupLabel}`}>
          Password
        </label>
        <input
          className={`${styles.input} ${styles.signupInputSolid}`}
          type="password"
          name="register_password"
          autoComplete="new-password"
          value={signupState.password}
          onChange={(event) => onUpdateField("password", event.target.value)}
          placeholder="Minimum 6 characters"
        />
        <p className={styles.error}>{fieldErrors.password}</p>
      </div>

      <div className={styles.field}>
        <label className={`${styles.label} ${styles.signupLabel}`}>
          Confirm password
        </label>
        <input
          className={`${styles.input} ${styles.signupInputSolid}`}
          type="password"
          name="register_confirm_password"
          autoComplete="new-password"
          value={signupState.confirmPassword}
          onChange={(event) =>
            onUpdateField("confirmPassword", event.target.value)
          }
          placeholder="Re-type password"
        />
        <p className={styles.error}>{fieldErrors.confirmPassword}</p>
      </div>
    </div>

    <div className={styles.inlineFooter}>
      <span>Already have an account?</span>
      <Link href="/login" className={styles.inlineLink}>
        Log in
      </Link>
    </div>

    <div className={styles.actionRow}>
      <button
        type="submit"
        className={`${styles.primaryButton} ${styles.signupPrimaryButton}`}
        disabled={actionLoading === "signup"}
      >
        {actionLoading === "signup" ? "Creating account..." : "Create account"}
      </button>
    </div>
  </form>
);

export default SignupStep;
