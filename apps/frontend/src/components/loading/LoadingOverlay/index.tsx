import { LoadingPanel } from "@/components/loading/LoadingPanel";
import * as styles from "./LoadingOverlay.css";

type Props = { stage?: string | null };

export function LoadingOverlay({ stage }: Props) {
  return (
    <div className={styles.overlay} role="alert" aria-live="assertive">
      <div className={styles.inner}>
        <LoadingPanel stage={stage} />
      </div>
    </div>
  );
}
