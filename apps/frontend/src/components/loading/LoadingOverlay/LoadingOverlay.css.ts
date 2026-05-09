import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const overlay = style({
  position: "fixed",
  inset: 0,
  zIndex: 100,
  display: "grid",
  placeItems: "center",
  padding: vars.space.md,
  background: vars.color.background,
});

export const inner = style({
  width: "100%",
  maxWidth: "760px",
});
