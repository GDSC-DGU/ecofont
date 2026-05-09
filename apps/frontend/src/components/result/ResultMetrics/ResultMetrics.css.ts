import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const card = style({
  display: "grid",
  gap: vars.space.md,
  padding: vars.space.lg,
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.subtle,
});

export const title = style({
  margin: 0,
  fontSize: "20px",
});

export const metric = style({
  padding: vars.space.md,
  background: vars.color.surfaceMuted,
  borderRadius: vars.radius.md,
});

export const label = style({
  margin: 0,
  color: vars.color.textMuted,
  fontSize: "14px",
});

export const value = style({
  margin: `${vars.space.xs} 0 0`,
  color: vars.color.primary,
  fontSize: "34px",
  fontWeight: 800,
});

export const note = style({
  margin: 0,
  color: vars.color.textMuted,
  fontSize: "14px",
  lineHeight: 1.6,
});
