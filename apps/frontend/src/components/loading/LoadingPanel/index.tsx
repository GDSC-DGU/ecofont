import CircularProgress from "@mui/material/CircularProgress";
import { copy } from "@/constants/copy";
import * as styles from "./LoadingPanel.css";

type Props = { stage?: string | null };

export function LoadingPanel({ stage }: Props) {
  const stageMessage =
    stage && stage in copy.upload.stages
      ? copy.upload.stages[stage as keyof typeof copy.upload.stages]
      : null;

  return (
    <div className={styles.card}>
      <CircularProgress color="primary" size={56} thickness={4} />
      <h1 className={styles.title}>{copy.loading.title}</h1>
      <p className={styles.description}>
        {stageMessage ?? copy.loading.description}
      </p>
    </div>
  );
}
