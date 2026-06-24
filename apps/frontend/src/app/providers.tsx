"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ConversionProvider } from "@/context/ConversionContext";
import type { ReactNode } from "react";

const muiTheme = createTheme({
  palette: {
    primary: { main: "#1A73E8", contrastText: "#FFFFFF" },
    secondary: { main: "#1558B0", contrastText: "#FFFFFF" },
    error: { main: "#D93025" },
    background: { default: "transparent", paper: "rgba(255,255,255,0.65)" },
    text: { primary: "#1C2B3A", secondary: "#4A5568" },
  },
  shape: { borderRadius: 9999 },
  typography: {
    fontFamily: "var(--font-roboto), Arial, sans-serif",
    button: { textTransform: "none", fontWeight: 500, letterSpacing: "0.01em" },
  },
  components: {
    MuiButton: {
      defaultProps: { disableRipple: false },
      styleOverrides: {
        root: { borderRadius: 9999, minHeight: 40, padding: "0 24px" },
        sizeSmall: { minHeight: 36, padding: "0 16px", fontSize: "13px" },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "filled" },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: "16px 16px 0 0",
          backgroundColor: "rgba(255,255,255,0.50)",
          backdropFilter: "blur(16px)",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.65)" },
          "&.Mui-focused": { backgroundColor: "rgba(255,255,255,0.72)" },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(20px) saturate(140%)",
          WebkitBackdropFilter: "blur(20px) saturate(140%)",
          border: "1px solid rgba(218,225,240,0.80)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.95)",
        },
        outlined: {
          border: "1px solid rgba(218,225,240,0.80)",
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: "rgba(26,115,232,0.25)",
          "&.Mui-active": { color: "#1A73E8" },
          "&.Mui-completed": { color: "#1A73E8" },
        },
      },
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={muiTheme}>
        <ConversionProvider>{children}</ConversionProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
