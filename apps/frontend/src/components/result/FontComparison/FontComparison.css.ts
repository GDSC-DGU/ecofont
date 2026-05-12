import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles/theme.css";

export const card = style({
  display: "grid",
  gap: vars.space.lg,
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

export const grid = style({
  display: "grid",
  gap: vars.space.md,
  "@media": {
    [media.tablet]: {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  },
});

export const panel = style({
  minHeight: "260px",
  display: "grid",
  alignContent: "space-between",
  gap: vars.space.lg,
  padding: vars.space.lg,
  background: vars.color.surfaceMuted,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
});

export const label = style({
  margin: 0,
  color: vars.color.textMuted,
  fontSize: "14px",
  fontWeight: 700,
});

export const sample = style({
  margin: 0,
  color: vars.color.text,
  fontSize: "34px",
  fontWeight: 800,
  lineHeight: 1.18,
});

export const optimized = style({
  color: vars.color.primary,
});
