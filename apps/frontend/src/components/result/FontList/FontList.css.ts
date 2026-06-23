import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const section = style({
  display: "flex",
  flexDirection: "column",
});

export const heading = style({
  margin: "0 0 4px",
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: vars.color.onSurfaceVariant,
});

export const list = style({
  display: "flex",
  flexDirection: "column",
});

export const loadingNote = style({
  padding: `${vars.space.md} 0`,
  fontSize: "13px",
  color: vars.color.onSurfaceVariant,
});
