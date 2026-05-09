import { LoadingPanel } from "@/components/loading/LoadingPanel";
import * as styles from "./LoadingOverlay.css";

export function LoadingOverlay() {
  return (
    <div className={styles.overlay} role="alert" aria-live="assertive">
      <div className={styles.inner}>
        <LoadingPanel />
      </div>
    </div>
  );
}
