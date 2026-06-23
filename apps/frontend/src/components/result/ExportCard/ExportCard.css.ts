import { style } from "@vanilla-extract/css";

// 캡처 전용 숨겨진 카드 — 화면에 표시되지 않음
export const hidden = style({
  position: "absolute",
  left: "-9999px",
  top: 0,
  pointerEvents: "none",
});

export const card = style({
  width: "1200px",
  height: "630px",
  display: "flex",
  flexDirection: "column",
  padding: "32px 56px",
  background: "#FFFFFF",
  borderRadius: "28px",
  boxSizing: "border-box",
  overflow: "hidden",
  gap: "12px",
});

// 상단 헤더 행
export const header = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexShrink: 0,
});

export const logoText = style({
  fontSize: "22px",
  letterSpacing: "-0.025em",
  lineHeight: 1,
});

export const badge = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 16px",
  background: "#1A73E8",
  color: "#FFFFFF",
  borderRadius: "9999px",
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.02em",
});

export const divider = style({
  height: "1px",
  background: "#DADCE0",
  flexShrink: 0,
});

// 중앙 히어로 — flex:1로 남은 공간 전부 차지
export const hero = style({
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  paddingTop: "20px",
  paddingBottom: "20px",
});

export const headlineRow = style({
  display: "flex",
  flexDirection: "column",
  gap: "0px",
  overflow: "hidden",
  minWidth: 0,
});

// headlineLabel은 삭제 (공간 확보)

export const previewText = style({
  margin: 0,
  width: "100%",
  fontSize: "76px",
  fontWeight: 700,
  color: "#000000",
  lineHeight: 1.1,
  overflow: "hidden",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  wordBreak: "break-all",
});

// 메트릭 행 — 수치를 화면에 꽉 차게
export const metricsRow = style({
  display: "flex",
  alignItems: "flex-end",
  gap: "64px",
});

export const metricBlock = style({
  display: "flex",
  flexDirection: "column",
  gap: "2px",
});

export const metricValue = style({
  fontSize: "140px",
  fontWeight: 700,
  color: "#1A73E8",
  lineHeight: 0.95,
  letterSpacing: "-0.03em",
});

export const metricLabel = style({
  fontSize: "30px",
  color: "#5F6368",
  fontWeight: 500,
  letterSpacing: "0.04em",
  marginTop: "6px",
});

export const metricDivider = style({
  width: "1px",
  height: "100px",
  background: "#DADCE0",
  alignSelf: "center",
  marginBottom: "28px",
});

// 하단 푸터
export const footer = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexShrink: 0,
});

export const footerText = style({
  fontSize: "13px",
  color: "#5F6368",
  letterSpacing: "0.01em",
});
