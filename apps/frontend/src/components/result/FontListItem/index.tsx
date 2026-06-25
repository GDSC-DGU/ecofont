"use client";

import { useRef, useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import type { EcoFontVariant } from "@/context/ConversionContext";
import { useConversion } from "@/context/ConversionContext";
import { downloadFile } from "@/api/fontGeneration";
import { getScriptPreviewConfig } from "@/constants/preview";
import { useExportImage } from "@/hooks/useExportImage";
import { ExportCard } from "@/components/result/ExportCard";
import { copy } from "@/constants/copy";
import * as styles from "./FontListItem.css";

type Props = {
  variant: EcoFontVariant;
  index: number;
  originalFileName: string;
  fontsLoaded: boolean;
};

export function FontListItem({ variant, index, originalFileName, fontsLoaded }: Props) {
  const { previewText, result } = useConversion();
  const fallbackSample = getScriptPreviewConfig(result?.script).fallbackSample;
  const exportCardRef = useRef<HTMLDivElement>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const fontFamily = `eco-variant-${index}`;
  const { exportImage, isExporting } = useExportImage(
    exportCardRef,
    variant.fileName.replace(/\.ttf$/i, "")
  );

  const handleDownload = async () => {
    // 크로스 오리진 URL 이라 <a download> 가 무시되므로 blob 으로 받아 저장
    setIsDownloading(true);
    try {
      await downloadFile(variant.downloadUrl, variant.fileName);
    } catch {
      setExportError(copy.result.exportError);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExportError(null);
      await exportImage();
    } catch {
      setExportError(copy.result.exportError);
    }
  };

  const inkPct = `${(variant.inkSavingRate * 100).toFixed(1)}%`;
  const carbonG = `${variant.carbonReduction}g`;
  const displayText = previewText || null;
  const fontStyle = fontsLoaded ? { fontFamily } : undefined;

  return (
    <article className={styles.row} aria-label={`에코폰트 변형 ${index + 1}`}>

      {/* 좌측: 폰트 미리보기 */}
      <div className={styles.previewWrap}>
        <p
          className={displayText ? styles.previewText : styles.previewPlaceholder}
          style={fontStyle}
        >
          {displayText ?? fallbackSample}
        </p>
        <p className={styles.fileName}>{variant.fileName}</p>
      </div>

      {/* 중앙: 메트릭 */}
      <div className={styles.metrics} aria-label={`잉크 절약 ${inkPct}, 탄소 절감 ${carbonG}`}>
        <div className={styles.metricBlock}>
          <span className={styles.metricPrimary}>{inkPct}</span>
          <span className={styles.metricSecondary}>잉크 절약</span>
        </div>
        <div className={styles.metricDivider} aria-hidden="true" />
        <div className={styles.metricBlock}>
          <span className={styles.metricPrimary}>{carbonG}</span>
          <span className={styles.metricSecondary}>CO₂ 절감</span>
        </div>
      </div>

      {/* 우측: 다운로드 + 이미지 저장 버튼 */}
      <div className={styles.actions}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          fullWidth
          startIcon={
            isDownloading
              ? <CircularProgress size={14} color="inherit" />
              : <FileDownloadOutlinedIcon fontSize="small" />
          }
          disabled={isDownloading}
          onClick={handleDownload}
          aria-label={`변형 ${index + 1} TTF 다운로드`}
          aria-busy={isDownloading}
        >
          {isDownloading ? "저장 중" : "TTF"}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          fullWidth
          startIcon={
            isExporting
              ? <CircularProgress size={14} color="inherit" />
              : <ImageOutlinedIcon fontSize="small" />
          }
          disabled={isExporting}
          onClick={handleExport}
          aria-label={`변형 ${index + 1} 이미지 저장`}
          aria-busy={isExporting}
        >
          {isExporting ? "저장 중" : "이미지"}
        </Button>
        {exportError && (
          <p className={styles.errorText} role="alert">{exportError}</p>
        )}
      </div>

      {/* 숨겨진 ExportCard (html2canvas 캡처용) */}
      <ExportCard
        ref={exportCardRef}
        variant={variant}
        previewText={previewText}
        fallbackText={fallbackSample}
        fontFamily={fontsLoaded ? fontFamily : "sans-serif"}
        originalFileName={originalFileName}
      />
    </article>
  );
}
