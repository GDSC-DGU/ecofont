"use client";

import Button from "@mui/material/Button";
import { LoadingOverlay } from "@/components/loading/LoadingOverlay";
import { useConvertFont } from "@/hooks/useConvertFont";
import { copy } from "@/constants/copy";

export function StartConversionButton({ file }: { file: File | null }) {
  const { convert, isLoading, stage, error } = useConvertFont();

  return (
    <>
      <div>
        <Button
          variant="contained"
          size="large"
          disabled={!file || isLoading}
          data-testid="start-conversion-button"
          onClick={() => file && convert(file)}
        >
          {copy.upload.action}
        </Button>
        {error ? (
          <p role="alert" style={{ margin: "8px 0 0", color: "#D93025", fontSize: "14px" }}>
            {error}
          </p>
        ) : null}
      </div>
      {isLoading ? <LoadingOverlay stage={stage} /> : null}
    </>
  );
}
