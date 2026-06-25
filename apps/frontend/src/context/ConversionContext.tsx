"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type EcoFontVariant = {
  downloadUrl: string;
  fileName: string;
  inkSavingRate: number;
  carbonReduction: number;
  // OCR 글자 인식률(0~1). 결과 정렬·표시에 사용. OCR 미가용 후보는 null.
  ocrScore: number | null;
};

export type ConversionResult = {
  originalFile: File;
  variants: EcoFontVariant[];
  script: string; // 서버가 판정한 스크립트(예: "cherokee") — 미리보기 UI 분기에 사용
};

type ConversionContextValue = {
  result: ConversionResult | null;
  setResult: (result: ConversionResult) => void;
  previewText: string;
  setPreviewText: (text: string) => void;
};

const ConversionContext = createContext<ConversionContextValue | null>(null);

export function ConversionProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [previewText, setPreviewText] = useState("");

  return (
    <ConversionContext.Provider value={{ result, setResult, previewText, setPreviewText }}>
      {children}
    </ConversionContext.Provider>
  );
}

export function useConversion() {
  const ctx = useContext(ConversionContext);
  if (!ctx) throw new Error("useConversion must be used within ConversionProvider");
  return ctx;
}
