"use client";

import Box from "@mui/material/Box";
import type { StepIconProps } from "@mui/material/StepIcon";

const OnboardingStepIcon = ({ active, completed, icon }: StepIconProps) => {
  const isHighlighted = Boolean(active || completed);

  return (
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isHighlighted
          ? "linear-gradient(90deg, #5a00ff 0%, #7d12ff 100%)"
          : "rgba(255, 255, 255, 0.24)",
        color: "#fff",
        fontSize: "14px",
        fontWeight: 700,
        lineHeight: 1,
        boxShadow: isHighlighted
          ? "0 10px 24px rgba(95, 20, 255, 0.24)"
          : "none",
      }}
    >
      {icon}
    </Box>
  );
};

export default OnboardingStepIcon;
