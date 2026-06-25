"use client";

import TextField from "@mui/material/TextField";
import { useConversion } from "@/context/ConversionContext";
import { getScriptPreviewConfig } from "@/constants/preview";
import * as styles from "./FontComparison.css";

const MAX_LEN = 40;

export function FontComparison() {
  const { previewText, setPreviewText, result } = useConversion();
  const config = getScriptPreviewConfig(result?.script);

  const appendChar = (char: string) => {
    setPreviewText((previewText + char).slice(0, MAX_LEN));
  };

  const backspace = () => setPreviewText(previewText.slice(0, -1));
  const clearAll = () => setPreviewText("");

  return (
    <div className={styles.paletteWrap}>
      <TextField
        fullWidth
        variant="filled"
        placeholder={config.placeholder}
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
            maxLength: MAX_LEN,
            style: {
              fontFamily: "inherit",
              fontSize: "24px",
              lineHeight: 1.4,
            },
          },
        }}
      />

      {/* Cherokee 등 IME 가 없는 스크립트에서만 문자 팔레트 노출 */}
      {config.showPalette && (
        <>
          <div className={styles.paletteHeader}>
            <p className={styles.paletteHint}>
              체로키 문자를 눌러 미리보기를 만들어 보세요
            </p>
            <div className={styles.paletteActions}>
              <button
                type="button"
                className={styles.actionKey}
                onClick={() => appendChar(" ")}
              >
                공백
              </button>
              <button
                type="button"
                className={styles.actionKey}
                onClick={backspace}
              >
                ⌫ 지우기
              </button>
              <button
                type="button"
                className={styles.actionKey}
                onClick={clearAll}
              >
                전체 삭제
              </button>
            </div>
          </div>

          <div
            className={styles.palette}
            role="group"
            aria-label="체로키 문자 팔레트"
          >
            {config.palette.map((char) => (
              <button
                key={char}
                type="button"
                className={styles.key}
                onClick={() => appendChar(char)}
                aria-label={`체로키 문자 ${char} 입력`}
              >
                {char}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
