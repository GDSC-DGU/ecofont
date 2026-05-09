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
  maxWidth: "1120px",
  margin: "0 auto",
  display: "grid",
  gap: vars.space.lg,
});

export const top = style({
  display: "grid",
  gap: vars.space.md,
  "@media": {
    [media.desktop]: {
      gridTemplateColumns: "1fr auto",
      alignItems: "end",
    },
  },
});

export const title = style({
  margin: 0,
  fontSize: "32px",
  lineHeight: 1.18,
  wordBreak: "keep-all",
  "@media": {
    [media.tablet]: {
      fontSize: "44px",
    },
  },
});

export const description = style({
  maxWidth: "660px",
  margin: `${vars.space.sm} 0 0`,
  color: vars.color.textMuted,
  lineHeight: 1.7,
  wordBreak: "keep-all",
});

export const grid = style({
  display: "grid",
  gap: vars.space.lg,
  "@media": {
    [media.desktop]: {
      gridTemplateColumns: "360px 1fr",
    },
  },
});
