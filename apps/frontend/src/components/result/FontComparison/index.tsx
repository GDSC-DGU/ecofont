import { copy } from "@/constants/copy";
import * as styles from "./FontComparison.css";

export function FontComparison() {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>{copy.result.comparison.title}</h2>
      <div className={styles.grid}>
        <PreviewPanel
          label={copy.result.comparison.originalLabel}
          text={copy.result.comparison.sample}
        />
        <PreviewPanel
          label={copy.result.comparison.optimizedLabel}
          text={copy.result.comparison.sample}
          optimized
        />
      </div>
    </section>
  );
}

function PreviewPanel({
  label,
  text,
  optimized = false,
}: {
  label: string;
  text: string;
  optimized?: boolean;
}) {
  return (
    <div className={styles.panel}>
      <p className={styles.label}>{label}</p>
      <p className={`${styles.sample} ${optimized ? styles.optimized : ""}`}>
        {text}
      </p>
    </div>
  );
}
