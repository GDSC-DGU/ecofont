import Link from "next/link";
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
      <div className={styles.spinner} aria-hidden="true" />
      <h1 className={styles.title}>{copy.loading.title}</h1>
      {stageMessage ? (
        <p className={styles.description}>{stageMessage}</p>
      ) : (
        <p className={styles.description}>{copy.loading.description}</p>
      )}
      <Link className={styles.action} href="/result">
        {copy.loading.action}
      </Link>
    </div>
  );
}
