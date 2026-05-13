"use client";

import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import type { SidebarSummary } from "./types";
import OnboardingStepIcon from "./OnboardingStepIcon";
import styles from "../OnboardingFlow.module.css";

interface OnboardingSidebarProps {
  displayStepIndex: number;
  displaySteps: Array<{ key: string; label: string }>;
  showStepper: boolean;
  summary: SidebarSummary;
}

const stepperStyles = {
  width: "100%",
  mb: "28px",
  overflowX: { xs: "auto", md: "visible" },
  pb: { xs: "4px", md: 0 },
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  "& .MuiStepper-root": {
    width: { xs: "620px", md: "100%" },
  },
  "& .MuiStep-root": {
    px: 0,
  },
  "& .MuiStepLabel-root": {
    alignItems: "center",
  },
  "& .MuiStepLabel-alternativeLabel": {
    alignItems: "center",
  },
  "& .MuiStepLabel-labelContainer": {
    mt: "14px",
  },
  "& .MuiStepLabel-label": {
    mt: "0 !important",
    color: "rgba(255, 255, 255, 0.92)",
    fontSize: "12px",
    fontWeight: 700,
    lineHeight: 1.35,
    letterSpacing: "0.08em",
    textAlign: "center",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
  "& .MuiStepLabel-label.Mui-active, & .MuiStepLabel-label.Mui-completed": {
    color: "#fff",
  },
  "& .MuiStepConnector-root": {
    top: "17px",
    left: "calc(-50% + 28px)",
    right: "calc(50% + 28px)",
  },
  "& .MuiStepConnector-line": {
    borderTopWidth: "2px",
    borderColor: "rgba(255, 255, 255, 0.22)",
  },
  "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line, & .MuiStepConnector-root.Mui-completed .MuiStepConnector-line":
    {
      borderColor: "#7d12ff",
    },
} as const;

const OnboardingSidebar = ({
  displayStepIndex,
  displaySteps,
  showStepper,
  summary,
}: OnboardingSidebarProps) => (
  <aside className={styles.sidebar}>
    <span className={styles.brand}>Magnate Hub Onboarding</span>
    <h2 className={styles.sidebarTitle}>
      Create, verify, choose your package, and launch.
    </h2>
    <p className={styles.sidebarText}>
      The flow follows the sequence you requested: role, signup, OTP, plan
      selection, checkout, then role-based dashboard questions.
    </p>

    {showStepper && (
      <Box sx={stepperStyles}>
        <Stepper activeStep={displayStepIndex} alternativeLabel>
          {displaySteps.map((step, index) => (
            <Step key={step.key} completed={displayStepIndex > index}>
              <StepLabel StepIconComponent={OnboardingStepIcon}>
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    )}

    <div className={styles.summaryCard}>
      <div className={styles.summaryRow}>
        <span>Role</span>
        <strong>{summary.roleLabel}</strong>
      </div>
      <div className={styles.summaryRow}>
        <span>Email</span>
        <strong>{summary.email}</strong>
      </div>
      <div className={styles.summaryRow}>
        <span>Plan</span>
        <strong>
          {summary.planTitle}{" "}
          {summary.planPrice === 0 ? "(Free)" : `($${summary.planPrice})`}
        </strong>
      </div>
    </div>
  </aside>
);

export default OnboardingSidebar;
