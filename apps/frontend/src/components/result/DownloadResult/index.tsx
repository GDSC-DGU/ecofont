"use client";

import { useConversion } from "@/context/ConversionContext";
import { copy } from "@/constants/copy";
import * as styles from "./DownloadResult.css";

export function DownloadResult() {
  const { result } = useConversion();

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.convertedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.convertedFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      className={styles.button}
      type="button"
      disabled={!result}
      data-testid="download-result-button"
      onClick={handleDownload}
    >
      {copy.result.downloadAction}
    </button>
  );
}
