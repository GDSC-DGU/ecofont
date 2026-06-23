"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontComparison, FontList, ResultSummary } from "@/components/result";
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
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>{copy.result.title}</h1>
          <p className={styles.description}>{copy.result.description}</p>
        </div>

        <ResultSummary variants={result.variants} />

        <FontComparison />

        <FontList
          variants={result.variants}
          originalFileName={result.originalFile.name}
        />
      </section>
    </main>
  );
}
