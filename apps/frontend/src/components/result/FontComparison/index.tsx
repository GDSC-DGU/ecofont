"use client";

import { useState } from "react";
import { useConversion } from "@/context/ConversionContext";
import { useFontFaceLoader } from "@/hooks/useFontFaceLoader";
import { copy } from "@/constants/copy";
import * as styles from "./FontComparison.css";

export function FontComparison() {
  const { result } = useConversion();
  const [previewText, setPreviewText] = useState("");

  const originalLoaded = useFontFaceLoader(
    "eco-original",
    result?.originalFile ?? null
  );
  const convertedLoaded = useFontFaceLoader(
    "eco-converted",
    result?.convertedBlob ?? null
  );

  const displayText = previewText || null;

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>{copy.result.comparison.title}</h2>
      <div className={styles.grid}>
        <PreviewPanel
          label={copy.result.comparison.originalLabel}
          text={displayText}
          placeholder={copy.result.comparison.sample}
          fontFamily={originalLoaded ? "eco-original" : undefined}
          data-testid="font-comparison-original"
        />
        <PreviewPanel
          label={copy.result.comparison.optimizedLabel}
          text={displayText}
          placeholder={copy.result.comparison.sample}
          fontFamily={convertedLoaded ? "eco-converted" : undefined}
          data-testid="font-comparison-converted"
        />
      </div>
      <div className={styles.inputWrapper}>
        <p className={styles.inputLabel}>미리보기 텍스트 입력</p>
        <input
          className={styles.input}
          type="text"
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          placeholder={copy.result.comparison.sample}
          data-testid="font-comparison-input"
        />
      </div>
    </section>
  );
}

function PreviewPanel({
  label,
  text,
  placeholder,
  fontFamily,
  "data-testid": testId,
}: {
  label: string;
  text: string | null;
  placeholder: string;
  fontFamily?: string;
  "data-testid"?: string;
}) {
  const isEmpty = text === null;

  return (
    <div className={styles.panel} data-testid={testId}>
      <p className={styles.label}>{label}</p>
      <p
        className={isEmpty ? styles.samplePlaceholder : styles.sample}
        style={fontFamily ? { fontFamily } : undefined}
      >
        {isEmpty ? placeholder : text}
      </p>
    </div>
  );
}
