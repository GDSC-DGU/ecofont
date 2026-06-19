import { style } from "@vanilla-extract/css";
import { media, vars } from "@/styles/theme.css";

export const card = style({
  display: "grid",
  gap: vars.space.lg,
  padding: vars.space.lg,
  background: vars.color.surface,
  backdropFilter: "blur(24px) saturate(160%)",
  WebkitBackdropFilter: "blur(24px) saturate(160%)",
  border: `1px solid ${vars.color.outline}`,
  borderRadius: vars.shape.extraLarge,
  boxShadow: vars.elevation.level1,
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
  color: vars.color.onSurface,
});

export const description = style({
  margin: `${vars.space.sm} 0 0`,
  color: vars.color.onSurfaceVariant,
  lineHeight: 1.6,
});

export const badge = style({
  width: "fit-content",
  padding: `${vars.space.xs} ${vars.space.sm}`,
  background: vars.color.primaryContainer,
  color: vars.color.onPrimaryContainer,
  borderRadius: vars.shape.extraSmall,
  fontSize: "13px",
  fontWeight: 700,
});

export const dropzone = style({
  minHeight: "220px",
  display: "grid",
  placeItems: "center",
  padding: vars.space.lg,
  textAlign: "center",
  background: "rgba(255, 255, 255, 0.38)",
  border: "1.5px dashed rgba(26, 115, 232, 0.35)",
  borderRadius: vars.shape.large,
  cursor: "pointer",
  transition:
    "border-color 180ms ease, background 180ms ease, box-shadow 180ms ease",
  selectors: {
    "&:hover": {
      background: "rgba(26, 115, 232, 0.08)",
      borderColor: "rgba(26, 115, 232, 0.65)",
      boxShadow: "0 0 0 4px rgba(26, 115, 232, 0.08)",
    },
  },
});

export const uploadText = style({
  display: "grid",
  gap: vars.space.sm,
  color: vars.color.onSurface,
});

export const primaryText = style({
  fontWeight: 700,
});

export const secondaryText = style({
  color: vars.color.onSurfaceVariant,
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
  // minHeight: "220px",
  display: "grid",
  gap: vars.space.md,
  alignItems: "center",
  padding: vars.space.lg,
  background: "rgba(26, 115, 232, 0.10)",
  border: "1px solid rgba(26, 115, 232, 0.30)",
  borderRadius: vars.shape.large,
  cursor: "default",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
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
  color: vars.color.onPrimaryContainer,
  fontSize: "13px",
  fontWeight: 800,
});

export const fileName = style({
  overflow: "hidden",
  color: vars.color.onSurface,
  fontSize: "16px",
  fontWeight: 700,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const fileStatus = style({
  color: vars.color.onSurfaceVariant,
  fontSize: "14px",
});

export const errorMessage = style({
  margin: 0,
  color: vars.color.error,
  fontSize: "14px",
  fontWeight: 700,
});
