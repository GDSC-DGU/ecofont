import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const button = style({
  display: "inline-flex",
  minHeight: "44px",
  alignItems: "center",
  justifyContent: "center",
  padding: `0 ${vars.space.lg}`,
  background: vars.color.primary,
  color: vars.color.surface,
  border: 0,
  borderRadius: vars.radius.sm,
  fontWeight: 700,
  cursor: "not-allowed",
  opacity: 0.72,
});
