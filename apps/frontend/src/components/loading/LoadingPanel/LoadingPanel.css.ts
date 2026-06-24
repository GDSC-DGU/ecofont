import { keyframes, style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

const spin = keyframes({
  to: { transform: "rotate(360deg)" },
});

export const card = style({
  display: "grid",
  justifyItems: "center",
  gap: vars.space.lg,
  padding: vars.space.xl,
  textAlign: "center",
  background: "#FFFFFF",
  border: "none",
  borderRadius: vars.shape.extraLarge,
  boxShadow: "0 24px 64px rgba(0, 0, 0, 0.25), 0 8px 24px rgba(0, 0, 0, 0.12)",
});

export const spinner = style({
  width: "56px",
  height: "56px",
  border: `4px solid ${vars.color.primaryContainer}`,
  borderTopColor: vars.color.primary,
  borderRadius: "50%",
  animation: `${spin} 900ms linear infinite`,
});

export const title = style({
  margin: 0,
  fontSize: "24px",
  fontWeight: 400,
  lineHeight: 1.3,
  color: vars.color.onSurface,
});

export const description = style({
  maxWidth: "520px",
  margin: 0,
  color: vars.color.onSurfaceVariant,
  lineHeight: 1.7,
  fontSize: "14px",
});

// MD3 Tonal Button
export const action = style({
  position: "relative",
  display: "inline-flex",
  minHeight: "40px",
  alignItems: "center",
  justifyContent: "center",
  padding: `0 ${vars.space.lg}`,
  background: vars.color.secondaryContainer,
  color: vars.color.onSecondaryContainer,
  border: 0,
  borderRadius: vars.shape.full,
  fontWeight: 500,
  fontSize: "14px",
  cursor: "pointer",
  overflow: "hidden",
  selectors: {
    "&::before": {
      content: "''",
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
      background: "currentColor",
      opacity: 0,
      transition: "opacity 200ms ease",
    },
    "&:hover::before": { opacity: 0.08 },
    "&:active::before": { opacity: 0.12 },
  },
});
