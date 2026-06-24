"use client";

// Blob/File을 FontFace API로 브라우저 폰트 레지스트리에 동적 등록하고, 로딩 완료 여부를 반환하는 훅
import { useEffect, useState } from "react";

export function useFontFaceLoader(name: string, source: Blob | null): boolean {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!source) return;

    const url = URL.createObjectURL(source);
    const fontFace = new FontFace(name, `url(${url})`);

    fontFace.load().then((face) => {
      document.fonts.add(face);
      setLoaded(true);
    });

    return () => {
      document.fonts.delete(fontFace);
      URL.revokeObjectURL(url);
      setLoaded(false);
    };
  }, [name, source]);

  return loaded;
}
