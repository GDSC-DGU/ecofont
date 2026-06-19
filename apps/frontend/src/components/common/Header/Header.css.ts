import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles/theme.css";

export const header = style({
  position: "sticky",
  top: 0,
  zIndex: 100,
  padding: `0 ${vars.space.md}`,
  background: "rgba(248, 250, 255, 0.85)",
  backdropFilter: "blur(24px) saturate(140%)",
  WebkitBackdropFilter: "blur(24px) saturate(140%)",
  borderBottom: "1px solid rgba(218, 225, 240, 0.80)",
  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.06)",
  "@media": {
    [media.tablet]: {
      padding: `0 ${vars.space.xl}`,
    },
  },
});

export const inner = style({
  width: "100%",
  maxWidth: "1120px",
  margin: "0 auto",
  paddingTop: vars.space.lg,
  paddingBottom: vars.space.lg,
});

export const logoLink = style({
  display: "inline-flex",
  alignItems: "center",
});
