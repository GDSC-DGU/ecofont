import { copy } from "@/constants/copy";
import * as styles from "./DownloadResult.css";

export function DownloadResult() {
  return (
    <button className={styles.button} disabled type="button">
      {copy.result.downloadAction}
    </button>
  );
}
