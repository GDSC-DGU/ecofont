import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const wrapper = style({
  display: "grid",
  gap: vars.space.sm,
});

export const label = style({
  margin: 0,
  fontSize: "12px",
  fontWeight: 500,
  color: vars.color.onSurfaceVariant,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
});

// MD3 Filled Text Field — 입력 필드 자체가 원본 폰트 미리보기
export const input = style({
  width: "100%",
  padding: `${vars.space.md} ${vars.space.lg}`,
  background: vars.color.surfaceVariant,
  border: "none",
  borderBottom: `2px solid ${vars.color.outline}`,
  borderRadius: `${vars.shape.small} ${vars.shape.small} 0 0`,
  fontSize: "28px",
  lineHeight: 1.4,
  color: vars.color.onSurface,
  outline: "none",
  transition: "border-color 160ms ease",
  selectors: {
    "&::placeholder": {
      color: vars.color.onSurfaceVariant,
    },
    "&:focus": {
      borderBottomColor: vars.color.primary,
      borderBottomWidth: "2px",
    },
  },
});

export const helper = style({
  margin: 0,
  fontSize: "12px",
  color: vars.color.onSurfaceVariant,
  paddingLeft: vars.space.xs,
});

// Cherokee 문자 팔레트 (IME 없이 클릭으로 입력)
export const paletteWrap = style({
  display: "grid",
  gap: vars.space.sm,
});

export const paletteHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.sm,
});

export const paletteHint = style({
  margin: 0,
  fontSize: "12px",
  color: vars.color.onSurfaceVariant,
});

export const paletteActions = style({
  display: "flex",
  gap: vars.space.xs,
});

export const palette = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.space.xs,
});

export const key = style({
  minWidth: "40px",
  height: "40px",
  padding: "0 8px",
  borderRadius: vars.shape.extraSmall,
  border: `1.5px solid ${vars.color.outline}`,
  background: vars.color.surface,
  color: vars.color.onSurface,
  fontSize: "22px",
  lineHeight: 1,
  cursor: "pointer",
  transition: "background 140ms ease, border-color 140ms ease",
  selectors: {
    "&:hover": {
      background: vars.color.primaryContainer,
      borderColor: vars.color.primary,
    },
  },
});

export const actionKey = style({
  height: "40px",
  padding: "0 14px",
  borderRadius: vars.shape.extraSmall,
  border: `1.5px solid ${vars.color.outline}`,
  background: vars.color.surface,
  color: vars.color.onSurfaceVariant,
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "background 140ms ease, border-color 140ms ease",
  selectors: {
    "&:hover": {
      background: vars.color.primaryContainer,
      borderColor: vars.color.primary,
    },
  },
});
