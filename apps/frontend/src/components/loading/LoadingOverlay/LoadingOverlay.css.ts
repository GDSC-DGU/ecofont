import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles/theme.css";

export const overlay = style({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 200,
  display: "grid",
  placeItems: "center",
  padding: vars.space.md,
  background: "rgba(8, 12, 28, 0.62)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
});

export const inner = style({
  width: "100%",
  "@media": {
    [media.tablet]: {
      maxWidth: "440px",
    },
  },
});
