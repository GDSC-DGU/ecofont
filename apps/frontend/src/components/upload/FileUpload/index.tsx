import { StartConversionButton } from "@/components/upload/StartConversionButton";
import { copy } from "@/constants/copy";
import * as styles from "./FileUpload.css";

export function FileUpload() {
  return (
    <section className={styles.card}>
      <div className={styles.top}>
        <div>
          <h2 className={styles.title}>{copy.upload.title}</h2>
          <p className={styles.description}>{copy.upload.description}</p>
        </div>
        <span className={styles.badge}>{copy.upload.badge}</span>
      </div>

      <label className={styles.dropzone}>
        <span className={styles.uploadText}>
          <span className={styles.primaryText}>
            {copy.upload.dropzonePrimary}
          </span>
          <span className={styles.secondaryText}>
            {copy.upload.dropzoneSecondary}
          </span>
        </span>
        <input className={styles.input} type="file" accept=".ttf,font/ttf" />
      </label>

      <StartConversionButton />
    </section>
  );
}
