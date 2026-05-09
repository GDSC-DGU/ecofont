import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles/theme.css";

export const header = style({
  padding: `${vars.space.lg} ${vars.space.md} 0`,
  "@media": {
    [media.tablet]: {
      padding: `${vars.space.xl} ${vars.space.xl} 0`,
    },
  },
});

export const inner = style({
  width: "100%",
  maxWidth: "1120px",
  margin: "0 auto",
  paddingBottom: vars.space.lg,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const logoLink = style({
  display: "inline-flex",
  alignItems: "center",
});

export const logo = style({
  display: "block",
  width: "180px",
  height: "auto",
  "@media": {
    [media.tablet]: {
      width: "220px",
    },
  },
});
