import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Header } from "@/components/common";
import { Providers } from "@/app/providers";
import { copy } from "@/constants/copy";
import { themeClass } from "@/styles/theme.css";
import "@/styles/global.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

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
      <body className={`${themeClass} ${roboto.variable}`}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
