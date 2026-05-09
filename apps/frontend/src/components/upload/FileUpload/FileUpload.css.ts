import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles/theme.css";

export const card = style({
  display: "grid",
  gap: vars.space.lg,
  padding: vars.space.lg,
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.subtle,
});

export const top = style({
  display: "grid",
  gap: vars.space.sm,
  "@media": {
    [media.tablet]: {
      gridTemplateColumns: "1fr auto",
      alignItems: "start",
    },
  },
});

export const title = style({
  margin: 0,
  fontSize: "22px",
});

export const description = style({
  margin: `${vars.space.sm} 0 0`,
  color: vars.color.textMuted,
  lineHeight: 1.6,
});

export const badge = style({
  width: "fit-content",
  padding: `${vars.space.xs} ${vars.space.sm}`,
  background: vars.color.primarySoft,
  color: vars.color.primary,
  borderRadius: vars.radius.sm,
  fontSize: "13px",
  fontWeight: 700,
});

export const dropzone = style({
  minHeight: "220px",
  display: "grid",
  placeItems: "center",
  padding: vars.space.lg,
  textAlign: "center",
  background: vars.color.surfaceMuted,
  border: `1px dashed ${vars.color.borderStrong}`,
  borderRadius: vars.radius.md,
  cursor: "pointer",
  transition: "border-color 160ms ease, background 160ms ease",
  selectors: {
    "&:hover": {
      background: vars.color.primarySoft,
      borderColor: vars.color.primary,
    },
  },
});

export const uploadText = style({
  display: "grid",
  gap: vars.space.sm,
  color: vars.color.text,
});

export const primaryText = style({
  fontWeight: 700,
});

export const secondaryText = style({
  color: vars.color.textMuted,
  fontSize: "14px",
});

export const input = style({
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
});

export const selectedFilePanel = style({
  minHeight: "220px",
  display: "grid",
  gap: vars.space.md,
  alignItems: "center",
  padding: vars.space.lg,
  background: vars.color.primarySoft,
  border: `1px solid ${vars.color.borderStrong}`,
  borderRadius: vars.radius.md,
  cursor: "default",
  "@media": {
    [media.tablet]: {
      gridTemplateColumns: "1fr auto",
    },
  },
});

export const fileInfo = style({
  display: "grid",
  gap: vars.space.xs,
  minWidth: 0,
});

export const fileLabel = style({
  color: vars.color.primary,
  fontSize: "13px",
  fontWeight: 800,
});

export const fileName = style({
  overflow: "hidden",
  color: vars.color.text,
  fontSize: "16px",
  fontWeight: 700,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const fileStatus = style({
  color: vars.color.textMuted,
  fontSize: "14px",
});

export const clearButton = style({
  minHeight: "36px",
  padding: `0 ${vars.space.md}`,
  background: vars.color.surface,
  border: `1px solid ${vars.color.borderStrong}`,
  color: vars.color.primary,
  borderRadius: vars.radius.sm,
  cursor: "pointer",
  fontWeight: 700,
});

export const errorMessage = style({
  margin: 0,
  color: "#c2410c",
  fontSize: "14px",
  fontWeight: 700,
});
