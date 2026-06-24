import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

// MD3 Filled Button — state layer via ::before
export const action = style({
  position: "relative",
  display: "inline-flex",
  width: "fit-content",
  minHeight: "44px",
  alignItems: "center",
  justifyContent: "center",
  padding: `0 ${vars.space.xl}`,
  background: vars.color.primary,
  border: 0,
  color: vars.color.onPrimary,
  borderRadius: vars.shape.full,
  cursor: "pointer",
  fontWeight: 500,
  fontSize: "14px",
  letterSpacing: "0.01em",
  overflow: "hidden",
  transition: "box-shadow 200ms ease",
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
    "&:hover::before": {
      opacity: 0.08,
    },
    "&:active::before": {
      opacity: 0.12,
    },
    "&:hover": {
      boxShadow: vars.elevation.level1,
    },
    "&:disabled": {
      background: vars.color.outline,
      color: vars.color.onSurfaceVariant,
      cursor: "not-allowed",
      boxShadow: "none",
    },
    "&:disabled::before": {
      display: "none",
    },
  },
});
