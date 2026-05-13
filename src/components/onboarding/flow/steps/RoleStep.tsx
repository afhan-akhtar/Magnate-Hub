"use client";

import Link from "next/link";
import { onboardingRoleConfigs } from "@/data/OnboardingQuestions";
import type { RoleStepProps } from "../types";
import styles from "../../OnboardingFlow.module.css";

const RoleStep = ({
  selectedRoleId,
  onSelectRole,
  onContinue,
}: RoleStepProps) => (
  <>
    <div className={styles.roleChoiceGrid}>
      {onboardingRoleConfigs.map((role) => {
        const isActive = selectedRoleId === role.id;

        return (
          <button
            key={role.id}
            type="button"
            className={`${styles.roleChoiceButton} ${
              isActive ? styles.roleChoiceButtonActive : ""
            }`}
            onClick={() => onSelectRole(role.id)}
          >
            {role.label}
          </button>
        );
      })}
    </div>
    <div className={styles.roleFooterActions}>
      <button
        type="button"
        className={`${styles.primaryButton} ${styles.rolePrimaryButton}`}
        onClick={onContinue}
      >
        Next
      </button>
    </div>
    <div className={styles.roleBackRow}>
      <Link href="/login" className={styles.secondaryButton}>
        Back to login
      </Link>
    </div>
  </>
);

export default RoleStep;
