"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type ConversionResult = {
  originalFile: File;
  convertedBlob: Blob;
  convertedFileName: string;
};

type ConversionContextValue = {
  result: ConversionResult | null;
  setResult: (result: ConversionResult) => void;
};

const ConversionContext = createContext<ConversionContextValue | null>(null);

export function ConversionProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<ConversionResult | null>(null);

  return (
    <ConversionContext.Provider value={{ result, setResult }}>
      {children}
    </ConversionContext.Provider>
  );
}

export function useConversion() {
  const ctx = useContext(ConversionContext);
  if (!ctx) throw new Error("useConversion must be used within ConversionProvider");
  return ctx;
}
