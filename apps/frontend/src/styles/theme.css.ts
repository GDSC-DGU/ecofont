import { createTheme } from "@vanilla-extract/css";

export const breakpoints = {
  mobile: "480px",
  tablet: "768px",
  desktop: "1024px",
  wide: "1280px",
} as const;

export const media = {
  mobile: `screen and (min-width: ${breakpoints.mobile})`,
  tablet: `screen and (min-width: ${breakpoints.tablet})`,
  desktop: `screen and (min-width: ${breakpoints.desktop})`,
  wide: `screen and (min-width: ${breakpoints.wide})`,
} as const;

export const [themeClass, vars] = createTheme({
  color: {
    background: "#f8fdea",
    surface: "#ffffff",
    surfaceMuted: "#f0fadf",
    surfaceStrong: "#dcf7b7",
    border: "#cce9aa",
    borderStrong: "#98d66a",
    text: "#162915",
    textMuted: "#60775a",
    primary: "#2f8f4e",
    primaryHover: "#25763f",
    primarySoft: "#ddf7c8",
    accent: "#b8ea4f",
    accentStrong: "#79c43d",
    warning: "#f5c95d",
  },
  space: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  radius: {
    sm: "6px",
    md: "8px",
    lg: "12px",
  },
  font: {
    body: "Arial, Helvetica, sans-serif",
  },
  shadow: {
    subtle: "0 12px 32px rgba(47, 143, 78, 0.1)",
  },
});
