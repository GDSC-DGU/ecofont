import { copy } from "@/constants/copy";
import * as styles from "./ResultMetrics.css";

export function ResultMetrics() {
  return (
    <aside className={styles.card}>
      <h2 className={styles.title}>{copy.result.metrics.title}</h2>
      <div className={styles.metric}>
        <p className={styles.label}>{copy.result.metrics.inkSavingLabel}</p>
        <p className={styles.value}>18.4%</p>
      </div>
      <div className={styles.metric}>
        <p className={styles.label}>{copy.result.metrics.carbonSavingLabel}</p>
        <p className={styles.value}>42g</p>
      </div>
      <p className={styles.note}>{copy.result.metrics.note}</p>
    </aside>
  );
}
