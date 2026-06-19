"use client";

import { LoadingOverlay } from "@/components/loading/LoadingOverlay";
import { useConvertFont } from "@/hooks/useConvertFont";
import { copy } from "@/constants/copy";
import * as styles from "./StartConversionButton.css";

export function StartConversionButton({ file }: { file: File | null }) {
  const { convert, isLoading, error } = useConvertFont();

  return (
    <>
      <div>
        <button
          className={styles.action}
          type="button"
          disabled={!file || isLoading}
          data-testid="start-conversion-button"
          onClick={() => file && convert(file)}
        >
          {copy.upload.action}
        </button>
        {error ? (
          <p role="alert" style={{ margin: "8px 0 0", color: "red", fontSize: "14px" }}>
            {error}
          </p>
        ) : null}
      </div>
      {isLoading ? <LoadingOverlay /> : null}
    </>
  );
}
