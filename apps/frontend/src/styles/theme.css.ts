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
    primary: "#1A73E8",
    onPrimary: "#FFFFFF",
    primaryContainer: "rgba(26, 115, 232, 0.12)",
    onPrimaryContainer: "#062E6F",
    secondary: "#1558B0",
    onSecondary: "#FFFFFF",
    secondaryContainer: "rgba(21, 88, 176, 0.12)",
    onSecondaryContainer: "#062E6F",
    surface: "rgba(255, 255, 255, 0.88)",
    onSurface: "#1C2B3A",
    surfaceVariant: "rgba(248, 250, 255, 0.72)",
    onSurfaceVariant: "#4A5568",
    outline: "rgba(218, 225, 240, 0.80)",
    outlineVariant: "rgba(210, 220, 235, 0.60)",
    background: "transparent",
    onBackground: "#1C2B3A",
    error: "#D93025",
    onError: "#FFFFFF",
  },
  space: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  shape: {
    extraSmall: "8px",
    small: "12px",
    medium: "16px",
    large: "20px",
    extraLarge: "28px",
    full: "9999px",
  },
  elevation: {
    level0: "none",
    level1: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.95)",
    level2: "0 2px 6px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,1)",
  },
  font: {
    body: "Arial, Helvetica, sans-serif",
  },
});

// ExportCard 인라인 스타일용 (vanilla-extract 외부에서 참조)
export const rawTokens = {
  color: {
    primary: "#1A73E8",
    secondary: "#1558B0",
    onSurface: "#1C2B3A",
    onSurfaceVariant: "#4A5568",
    outlineVariant: "#DADCE0",
    surface: "#FFFFFF",
    secondaryContainer: "#D2E3FC",
  },
} as const;
