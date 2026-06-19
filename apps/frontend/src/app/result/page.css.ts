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
  width: "100%",
  maxWidth: "100%",
  margin: "0 auto",
  display: "grid",
  gap: vars.space.xl,
  "@media": {
    [media.tablet]: {
      maxWidth: "860px",
    },
    [media.desktop]: {
      maxWidth: "960px",
    },
  },
});

export const pageHeader = style({
  display: "grid",
  gap: vars.space.md,
  textAlign: "center",
  justifyItems: "center",
});

export const title = style({
  margin: 0,
  fontSize: "32px",
  lineHeight: 1.18,
  color: vars.color.onSurface,
  wordBreak: "keep-all",
  "@media": {
    [media.tablet]: {
      fontSize: "44px",
    },
  },
});

export const description = style({
  margin: 0,
  fontSize: "20px",
  fontWeight: 500,
  color: vars.color.onSurface,
  lineHeight: 1.6,
  wordBreak: "keep-all",
  whiteSpace: "pre-line",
  "@media": {
    [media.tablet]: {
      fontSize: "24px",
    },
  },
});
