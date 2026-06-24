"use client";

import { useState, type RefObject } from "react";
import html2canvas from "html2canvas";

export function useExportImage(
  targetRef: RefObject<HTMLDivElement | null>,
  fileName: string
): { exportImage: () => Promise<void>; isExporting: boolean } {
  const [isExporting, setIsExporting] = useState(false);

  const exportImage = async () => {
    if (!targetRef.current) return;
    setIsExporting(true);
    try {
      await document.fonts.ready;
      const el = targetRef.current;
      // scrollWidth/scrollHeight가 offsetWidth/offsetHeight보다 클 경우
      // html2canvas가 overflow 영역까지 캡처해 이미지가 넓어지는 문제를 방지.
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        width: el.offsetWidth,
        height: el.offsetHeight,
      });
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName}_ecofont.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    } finally {
      setIsExporting(false);
    }
  };

  return { exportImage, isExporting };
}
