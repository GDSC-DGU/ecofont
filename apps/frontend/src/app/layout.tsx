import type { Metadata } from "next";
import { Header } from "@/components/common";
import { copy } from "@/constants/copy";
import { themeClass } from "@/styles/theme.css";
import "@/styles/global.css";

export const metadata: Metadata = {
  title: copy.brand.name,
  description: copy.brand.metadataDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={themeClass}>
        <Header />
        {children}
      </body>
    </html>
  );
}
