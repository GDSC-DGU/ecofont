"use client";

import { useConversion } from "@/context/ConversionContext";
import { copy } from "@/constants/copy";
import * as styles from "./ResultMetrics.css";

export function ResultMetrics() {
  const { result } = useConversion();

  const inkSaving = result
    ? `${(result.inkSavingRate * 100).toFixed(1)}%`
    : "—";
  const carbonReduction = result
    ? `${result.carbonReduction}g`
    : "—";

  return (
    <aside className={styles.card}>
      <h2 className={styles.title}>{copy.result.metrics.title}</h2>
      <div className={styles.metric}>
        <p className={styles.label}>{copy.result.metrics.inkSavingLabel}</p>
        <p className={styles.value}>{inkSaving}</p>
      </div>
      <div className={styles.metric}>
        <p className={styles.label}>{copy.result.metrics.carbonSavingLabel}</p>
        <p className={styles.value}>{carbonReduction}</p>
      </div>
      <p className={styles.note}>{copy.result.metrics.note}</p>
    </aside>
  );
}
