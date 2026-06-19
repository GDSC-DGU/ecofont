"use client";

// 파일 변환 흐름(폴링 mock → fetch(downloadUrl) → Context 저장 → /result 이동)과 로딩·단계·에러 상태를 관리하는 훅
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useConversion } from "@/context/ConversionContext";
import { startConversion, pollJob } from "@/mocks/convertFont";
import { copy } from "@/constants/copy";

const POLL_INTERVAL_MS = 2500;

export function useConvertFont() {
  const router = useRouter();
  const { setResult } = useConversion();
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, []);

  const convert = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setStage("uploading");

    let jobId: string;
    try {
      jobId = await startConversion(file);
    } catch {
      setError(copy.upload.conversionError);
      setIsLoading(false);
      setStage(null);
      return;
    }

    let attempt = 0;

    intervalRef.current = setInterval(async () => {
      attempt += 1;
      try {
        const poll = await pollJob(jobId, file, attempt);

        if (poll.status === "processing") {
          setStage(poll.stage);
          return;
        }

        clearInterval(intervalRef.current!);
        intervalRef.current = null;

        if (poll.status === "failed") {
          setError(copy.upload.conversionError);
          setIsLoading(false);
          setStage(null);
          return;
        }

        // status === "done"
        setStage("finalizing");
        const { download_url, ink_saving_rate, carbon_reduction_g, converted_filename } = poll.result;

        const convertedBlob = await fetch(download_url).then((r) => r.blob());

        setResult({
          originalFile: file,
          convertedBlob,
          downloadUrl: download_url,
          convertedFileName: converted_filename,
          inkSavingRate: ink_saving_rate,
          carbonReduction: carbon_reduction_g,
        });

        router.push("/result");
      } catch {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setError(copy.upload.conversionError);
        setIsLoading(false);
        setStage(null);
      }
    }, POLL_INTERVAL_MS);
  };

  return { convert, isLoading, stage, error };
}
