"use client";

import { ConversionProvider } from "@/context/ConversionContext";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <ConversionProvider>{children}</ConversionProvider>;
}
