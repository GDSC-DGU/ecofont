import { FileUpload, UploadGuide } from "@/components/upload";
import { copy } from "@/constants/copy";
import * as styles from "./page.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{copy.brand.name}</p>
          <h1 className={styles.title}>{copy.brand.slogan}</h1>
          <p className={styles.description}>{copy.home.description}</p>
        </header>
        <FileUpload />
        <UploadGuide />
      </section>
    </main>
  );
}
