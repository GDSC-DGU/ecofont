"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type EcoFontVariant = {
  blob: Blob;
  downloadUrl: string;
  fileName: string;
  inkSavingRate: number;
  carbonReduction: number;
};

export type ConversionResult = {
  originalFile: File;
  variants: EcoFontVariant[];
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
