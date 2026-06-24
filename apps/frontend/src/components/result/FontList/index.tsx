"use client";

import { useEffect, useState } from "react";
import type { EcoFontVariant } from "@/context/ConversionContext";
import { FontListItem } from "@/components/result/FontListItem";
import * as styles from "./FontList.css";

type Props = {
  variants: EcoFontVariant[];
  originalFileName: string;
};

export function FontList({ variants, originalFileName }: Props) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (variants.length === 0) return;

    const faces = variants.map(
      (v, i) => new FontFace(`eco-variant-${i}`, `url(${v.downloadUrl})`)
    );

    Promise.allSettled(faces.map((f) => f.load())).then((results) => {
      results.forEach((r, i) => {
        if (r.status === "fulfilled") document.fonts.add(faces[i]);
      });
      setFontsLoaded(true);
    });

    return () => {
      faces.forEach((f) => {
        try { document.fonts.delete(f); } catch {}
      });
    };
  }, [variants]);

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>
        에코폰트 변형 &nbsp;{variants.length}개
      </h2>
      {!fontsLoaded && (
        <p className={styles.loadingNote}>폰트를 불러오는 중…</p>
      )}
      <div className={styles.list}>
        {variants.map((variant, i) => (
          <FontListItem
            key={variant.fileName}
            variant={variant}
            index={i}
            originalFileName={originalFileName}
            fontsLoaded={fontsLoaded}
          />
        ))}
      </div>
    </section>
  );
}
