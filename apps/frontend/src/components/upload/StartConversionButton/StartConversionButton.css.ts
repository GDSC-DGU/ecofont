import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const action = style({
  display: "inline-flex",
  width: "fit-content",
  minHeight: "44px",
  alignItems: "center",
  justifyContent: "center",
  padding: `0 ${vars.space.lg}`,
  background: vars.color.primary,
  border: 0,
  color: vars.color.surface,
  borderRadius: vars.radius.sm,
  cursor: "pointer",
  fontWeight: 700,
  transition: "background 160ms ease",
  selectors: {
    "&:hover": {
      background: vars.color.primaryHover,
    },
    "&:disabled": {
      background: vars.color.border,
      color: vars.color.textMuted,
      cursor: "not-allowed",
    },
  },
});
