import { copy } from "@/constants/copy";
import * as styles from "./UploadGuide.css";

export function UploadGuide() {
  return (
    <section className={styles.section}>
      <ol className={styles.list}>
        {copy.upload.guideSteps.map((step, index) => (
          <li className={styles.item} key={step.title}>
            <div className={styles.markerWrap}>
              <span className={styles.number}>{index + 1}</span>
            </div>
            <div className={styles.content}>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.description}>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
