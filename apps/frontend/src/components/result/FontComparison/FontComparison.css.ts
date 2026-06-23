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
