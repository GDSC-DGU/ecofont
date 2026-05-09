import { keyframes, style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

const spin = keyframes({
  to: {
    transform: "rotate(360deg)",
  },
});

export const card = style({
  display: "grid",
  justifyItems: "center",
  gap: vars.space.lg,
  padding: vars.space.xl,
  textAlign: "center",
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.subtle,
});

export const spinner = style({
  width: "56px",
  height: "56px",
  border: `5px solid ${vars.color.primarySoft}`,
  borderTopColor: vars.color.primary,
  borderRadius: "50%",
  animation: `${spin} 900ms linear infinite`,
});

export const title = style({
  margin: 0,
  fontSize: "28px",
  lineHeight: 1.2,
});

export const description = style({
  maxWidth: "520px",
  margin: 0,
  color: vars.color.textMuted,
  lineHeight: 1.7,
});

export const action = style({
  display: "inline-flex",
  minHeight: "42px",
  alignItems: "center",
  justifyContent: "center",
  padding: `0 ${vars.space.lg}`,
  background: vars.color.primary,
  color: vars.color.surface,
  borderRadius: vars.radius.sm,
  fontWeight: 700,
});
