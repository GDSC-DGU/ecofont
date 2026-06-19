"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DownloadResult,
  FontComparison,
  ResultMetrics,
} from "@/components/result";
import { useConversion } from "@/context/ConversionContext";
import { copy } from "@/constants/copy";
import * as styles from "./page.css";

export default function ResultPage() {
  const router = useRouter();
  const { result } = useConversion();

  useEffect(() => {
    if (!result) {
      router.push("/");
    }
  }, [result, router]);

  if (!result) return null;

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.top}>
          <div>
            <h1 className={styles.title}>{copy.result.title}</h1>
            <p className={styles.description}>{copy.result.description}</p>
          </div>
          <DownloadResult />
        </div>

        <div className={styles.grid}>
          <ResultMetrics />
          <FontComparison />
        </div>
      </section>
    </main>
  );
}
