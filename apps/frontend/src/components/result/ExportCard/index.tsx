"use client";

import { forwardRef } from "react";
import type { EcoFontVariant } from "@/context/ConversionContext";
import * as styles from "./ExportCard.css";

type ExportCardProps = {
  variant: EcoFontVariant;
  previewText: string;
  fontFamily: string;
  originalFileName: string;
};

export const ExportCard = forwardRef<HTMLDivElement, ExportCardProps>(
  ({ variant, previewText, fontFamily, originalFileName }, ref) => {
    const inkPct = `${(variant.inkSavingRate * 100).toFixed(1)}%`;
    const carbonG = `${variant.carbonReduction}g`;
    const today = new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const displayText = previewText || "지속 가능한 타이포그래피 EcoFont";

    return (
      <div className={styles.hidden}>
        <div ref={ref} className={styles.card}>
          {/* 헤더 */}
          <div className={styles.header}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
              <svg width="36" height="36" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect width="32" height="32" rx="8.5" fill="#1A73E8" />
                <rect x="8" y="6" width="5" height="20" rx="2" fill="white" />
                <rect x="8" y="6" width="16" height="5" rx="2" fill="white" />
                <rect x="8" y="14.5" width="11" height="5" rx="2" fill="white" />
                <circle cx="19" cy="8.5" r="1.6" fill="#1A73E8" />
                <circle cx="15.5" cy="17" r="1.6" fill="#1A73E8" />
              </svg>
              <span className={styles.logoText}>
                <span style={{ fontWeight: 700, color: "#1A73E8" }}>eco</span>
                <span style={{ fontWeight: 300, color: "#1C2B3A" }}>font</span>
              </span>
            </span>
            <span className={styles.badge}>Ink Diet ✓</span>
          </div>

          <div className={styles.divider} />

          {/* 히어로: 미리보기 텍스트 + 대형 메트릭 */}
          <div className={styles.hero}>
            <p className={styles.previewText} style={{ fontFamily }}>
              {displayText}
            </p>

            <div className={styles.metricsRow}>
              <div className={styles.metricBlock}>
                <span className={styles.metricValue} style={{ fontFamily }}>
                  {inkPct}
                </span>
                <span className={styles.metricLabel}>잉크 절약</span>
              </div>
              <div className={styles.metricDivider} />
              <div className={styles.metricBlock}>
                <span className={styles.metricValue} style={{ fontFamily }}>
                  {carbonG}
                </span>
                <span className={styles.metricLabel}>탄소 절감</span>
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          {/* 푸터 */}
          <div className={styles.footer}>
            <span
              className={styles.footerText}
              style={{ fontFamily }}
            >
              font: {originalFileName}
            </span>
            <span className={styles.footerText}>
              date: {today}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

ExportCard.displayName = "ExportCard";
