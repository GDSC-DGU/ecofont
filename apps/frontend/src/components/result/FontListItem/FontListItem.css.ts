import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles/theme.css";

export const row = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.lg,
  padding: `${vars.space.lg} 0`,
  borderBottom: `1px solid ${vars.color.outlineVariant}`,
  selectors: {
    "&:first-child": {
      borderTop: `1px solid ${vars.color.outlineVariant}`,
    },
  },
});

/* ── 좌측: 액션 버튼 영역 ─────────────────────────────── */
export const actions = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
  flexShrink: 0,
  width: "108px",
  "@media": {
    [media.tablet]: {
      width: "120px",
    },
  },
});

/* ── 중앙: 폰트 미리보기 ─────────────────────────────── */
export const previewWrap = style({
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
});

export const previewText = style({
  margin: 0,
  fontSize: "30px",
  lineHeight: 1.35,
  color: vars.color.onSurface,
  overflow: "hidden",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  wordBreak: "break-all",
  "@media": {
    [media.tablet]: {
      fontSize: "36px",
    },
  },
});

export const previewPlaceholder = style({
  margin: 0,
  fontSize: "30px",
  lineHeight: 1.35,
  color: vars.color.onSurfaceVariant,
  overflow: "hidden",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  wordBreak: "break-all",
  "@media": {
    [media.tablet]: {
      fontSize: "36px",
    },
  },
});

export const fileName = style({
  marginTop: vars.space.xs,
  fontSize: "11px",
  color: vars.color.onSurfaceVariant,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  letterSpacing: "0.01em",
});

/* ── 우측: 메트릭 ─────────────────────────────────────── */
export const metrics = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: vars.space.md,
  flexShrink: 0,
});

export const metricBlock = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "3px",
  textAlign: "center",
});

export const metricPrimary = style({
  fontSize: "22px",
  fontWeight: 700,
  color: vars.color.primary,
  lineHeight: 1,
  letterSpacing: "-0.02em",
  "@media": {
    [media.tablet]: {
      fontSize: "26px",
    },
  },
});

export const metricSecondary = style({
  fontSize: "11px",
  fontWeight: 500,
  color: vars.color.onSurfaceVariant,
  lineHeight: 1.2,
  whiteSpace: "nowrap",
});

export const metricDivider = style({
  width: "1px",
  height: "32px",
  background: vars.color.outlineVariant,
  flexShrink: 0,
});

export const errorText = style({
  marginTop: vars.space.xs,
  fontSize: "11px",
  color: vars.color.error,
});
