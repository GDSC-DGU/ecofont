import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles/theme.css";

export const page = style({
  minHeight: "100vh",
  padding: `${vars.space.lg} ${vars.space.md} ${vars.space.xl}`,
  "@media": {
    [media.tablet]: {
      padding: `${vars.space.xl} ${vars.space.xl} ${vars.space.xxl}`,
    },
  },
});

export const shell = style({
  display: "grid",
  gap: vars.space.xl,
  width: "100%",
  maxWidth: "1120px",
  margin: "0 auto",
});

export const header = style({
  display: "grid",
  gap: vars.space.md,
});

export const eyebrow = style({
  margin: 0,
  color: vars.color.primary,
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
});

export const title = style({
  maxWidth: "760px",
  margin: 0,
  fontSize: "36px",
  lineHeight: 1.12,
  wordBreak: "keep-all",
  "@media": {
    [media.tablet]: {
      fontSize: "52px",
    },
  },
});

export const description = style({
  maxWidth: "680px",
  margin: 0,
  color: vars.color.textMuted,
  fontSize: "16px",
  lineHeight: 1.7,
  wordBreak: "keep-all",
});
