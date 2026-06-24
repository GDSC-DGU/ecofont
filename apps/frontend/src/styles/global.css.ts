import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./theme.css";

globalStyle("*", {
  boxSizing: "border-box",
});

globalStyle("html", {
  minHeight: "100%",
});

globalStyle("body", {
  minHeight: "100%",
  margin: 0,
  background: "transparent",
  color: vars.color.onBackground,
  fontFamily: "var(--font-roboto), Arial, sans-serif",
});

// 구글 스타일 클린 배경 — 극도로 미묘한 블루 힌트
globalStyle("body::before", {
  content: "''",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  background: [
    "radial-gradient(ellipse 70% 60% at 5% 0%, rgba(26, 115, 232, 0.07) 0%, transparent 60%)",
    "radial-gradient(ellipse 55% 50% at 95% 100%, rgba(21, 88, 176, 0.06) 0%, transparent 55%)",
    "#F8FAFF",
  ].join(", "),
  pointerEvents: "none",
});

globalStyle("a", {
  color: "inherit",
  textDecoration: "none",
});

globalStyle("button, input", {
  font: "inherit",
});
