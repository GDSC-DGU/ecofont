import Link from "next/link";
import { copy } from "@/constants/copy";
import * as styles from "./LoadingPanel.css";

export function LoadingPanel() {
  return (
    <div className={styles.card}>
      <div className={styles.spinner} aria-hidden="true" />
      <h1 className={styles.title}>{copy.loading.title}</h1>
      <p className={styles.description}>{copy.loading.description}</p>
      <Link className={styles.action} href="/result">
        {copy.loading.action}
      </Link>
    </div>
  );
}
