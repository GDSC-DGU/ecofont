"use client";

import { useState } from "react";
import { LoadingOverlay } from "@/components/loading/LoadingOverlay";
import { copy } from "@/constants/copy";
import * as styles from "./StartConversionButton.css";

/**
 * 폰트 변환 시작 버튼 컴포넌트
 */
export function StartConversionButton({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <button
        className={styles.action}
        type="button"
        disabled={disabled}
        onClick={() => setIsLoading(true)}
      >
        {copy.upload.action}
      </button>
      {isLoading ? <LoadingOverlay /> : null}
    </>
  );
}
