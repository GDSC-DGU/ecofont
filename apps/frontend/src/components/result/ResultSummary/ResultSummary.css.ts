import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles/theme.css";

export const card = style({
  display: "grid",
  gridTemplateColumns: "1fr 1px 1fr",
  alignItems: "center",
  padding: `${vars.space.xl} ${vars.space.lg}`,
  background: vars.color.surface,
  backdropFilter: "blur(24px) saturate(160%)",
  WebkitBackdropFilter: "blur(24px) saturate(160%)",
  border: `1px solid ${vars.color.outline}`,
  borderRadius: vars.shape.extraLarge,
  boxShadow: vars.elevation.level1,
  "@media": {
    [media.tablet]: {
      padding: `${vars.space.xl} ${vars.space.xxl}`,
    },
  },
});

export const divider = style({
  width: "1px",
  height: "64px",
  background: vars.color.outlineVariant,
  justifySelf: "center",
});

export const block = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: vars.space.md,
  textAlign: "center",
});

export const value = style({
  fontSize: "48px",
  fontWeight: 700,
  color: vars.color.primary,
  lineHeight: 1,
  letterSpacing: "-0.03em",
  "@media": {
    [media.tablet]: {
      fontSize: "64px",
    },
  },
});

export const label = style({
  fontSize: "13px",
  fontWeight: 500,
  color: vars.color.onSurfaceVariant,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
});
