import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./theme.css";

globalStyle("*", {
  boxSizing: "border-box",
});

globalStyle("html", {
  minHeight: "100%",
  background: vars.color.background,
});

globalStyle("body", {
  minHeight: "100%",
  margin: 0,
  background: vars.color.background,
  color: vars.color.text,
  fontFamily: vars.font.body,
});

globalStyle("a", {
  color: "inherit",
  textDecoration: "none",
});

globalStyle("button, input", {
  font: "inherit",
});
