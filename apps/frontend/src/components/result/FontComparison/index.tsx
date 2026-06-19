"use client";

import TextField from "@mui/material/TextField";
import { useConversion } from "@/context/ConversionContext";
import { useFontFaceLoader } from "@/hooks/useFontFaceLoader";

export function FontComparison() {
  const { result, previewText, setPreviewText } = useConversion();

  const originalLoaded = useFontFaceLoader(
    "eco-original",
    result?.originalFile ?? null
  );

  return (
    <TextField
      fullWidth
      variant="filled"
      placeholder="미리보기 텍스트를 입력하세요"
      value={previewText}
      onChange={(e) => setPreviewText(e.target.value)}
      sx={{
        "& .MuiFilledInput-root": {
          borderRadius: "9999px",
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingTop: "0px",
          paddingBottom: "0px",
          outline: "1.5px solid rgba(218, 225, 240, 0.90)",
          transition: "outline-color 160ms ease",
        },
        "& .MuiFilledInput-root.Mui-focused": {
          outline: "2px solid #1A73E8",
        },
        "& .MuiFilledInput-root::before": { display: "none" },
        "& .MuiFilledInput-root::after": { display: "none" },
        "& .MuiInputBase-input": {
          paddingTop: "16px",
          paddingBottom: "16px",
        },
      }}
      slotProps={{
        htmlInput: {
          "data-testid": "font-comparison-input",
          "aria-label": "미리보기 텍스트 입력",
          maxLength: 40,
          style: {
            fontFamily: originalLoaded ? "eco-original, sans-serif" : "inherit",
            fontSize: "24px",
            lineHeight: 1.4,
          },
        },
      }}
    />
  );
}
