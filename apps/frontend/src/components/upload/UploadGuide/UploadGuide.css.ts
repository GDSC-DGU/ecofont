import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles/theme.css";

export const section = style({
  display: "grid",
  padding: vars.space.lg,
  background: vars.color.surfaceVariant,
  border: `1px solid ${vars.color.outline}`,
  borderRadius: vars.shape.large,
  boxShadow: vars.elevation.level1,
});

export const list = style({
  position: "relative",
  display: "grid",
  gap: vars.space.md,
  margin: 0,
  padding: 0,
  listStyle: "none",
  selectors: {
    "&::before": {
      content: "",
      position: "absolute",
      top: "31px",
      bottom: "31px",
      left: "23px",
      width: "2px",
      background: vars.color.outline,
    },
  },
  "@media": {
    [media.desktop]: {
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: 0,
      selectors: {
        "&::before": {
          top: "23px",
          left: "calc(16.666% + 23px)",
          right: "calc(16.666% + 23px)",
          bottom: "auto",
          width: "auto",
          height: "2px",
        },
      },
    },
  },
});

export const item = style({
  position: "relative",
  display: "grid",
  gridTemplateColumns: "48px 1fr",
  gap: vars.space.md,
  minWidth: 0,
  "@media": {
    [media.desktop]: {
      gridTemplateColumns: "1fr",
      justifyItems: "center",
      gap: vars.space.md,
      padding: `0 ${vars.space.md}`,
      textAlign: "center",
    },
  },
});

export const markerWrap = style({
  position: "relative",
  zIndex: 1,
  display: "grid",
  justifyItems: "center",
});

export const number = style({
  display: "inline-grid",
  width: "48px",
  height: "48px",
  placeItems: "center",
  background: vars.color.surface,
  color: vars.color.primary,
  border: `2px solid ${vars.color.primary}`,
  borderRadius: "50%",
  boxShadow: `0 0 0 8px ${vars.color.surfaceVariant}`,
  fontSize: "15px",
  fontWeight: 800,
});

export const content = style({
  minWidth: 0,
  padding: vars.space.md,
  background: "rgba(255, 255, 255, 0.76)",
  border: `1px solid ${vars.color.outline}`,
  borderRadius: vars.shape.medium,
  "@media": {
    [media.desktop]: {
      width: "100%",
    },
  },
});

export const title = style({
  margin: 0,
  color: vars.color.onSurface,
  fontSize: "17px",
  lineHeight: 1.35,
});

export const description = style({
  margin: `${vars.space.sm} 0 0`,
  color: vars.color.onSurfaceVariant,
  fontSize: "14px",
  lineHeight: 1.65,
  wordBreak: "keep-all",
});
