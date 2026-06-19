import type { EcoFontVariant } from "@/context/ConversionContext";
import * as styles from "./ResultSummary.css";

type Props = { variants: EcoFontVariant[] };

export function ResultSummary({ variants }: Props) {
  if (variants.length === 0) return null;

  const avgInk =
    variants.reduce((sum, v) => sum + v.inkSavingRate, 0) / variants.length;
  const avgCarbon =
    variants.reduce((sum, v) => sum + v.carbonReduction, 0) / variants.length;

  return (
    <div className={styles.card} role="region" aria-label="전체 결과 요약">
      <div className={styles.block}>
        <span className={styles.value}>{(avgInk * 100).toFixed(1)}%</span>
        <span className={styles.label}>평균 잉크 절약률</span>
      </div>

      <div className={styles.divider} aria-hidden="true" />

      <div className={styles.block}>
        <span className={styles.value}>{avgCarbon.toFixed(1)}g</span>
        <span className={styles.label}>평균 탄소 절감량</span>
      </div>
    </div>
  );
}
