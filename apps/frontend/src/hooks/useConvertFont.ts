"use client";

// 파일 변환 흐름(폴링 mock → variants fetch → Context 저장 → /result 이동)과 로딩·단계·에러 상태를 관리하는 훅
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

        // status === "done": blob을 직접 수신 (현재 TTF 직접 전송 구조 임시 시뮬레이션)
        // TODO(Unit 1b): 백엔드 응답 방식 확정 후 교체
        //   - TTF 직접 전송 → 현재 코드 유지 (response.blob() 처리로 연결)
        //   - GCS Signed URL 방식 → fetch(v.download_url).then(r => r.blob()) 로 교체
        setStage("finalizing");
        const variantResults = poll.result.variants.map((v) => {
          const blob = v.ttf_blob;
          const downloadUrl = URL.createObjectURL(blob);
          return {
            blob,
            downloadUrl,
            fileName: v.converted_filename,
            inkSavingRate: v.ink_saving_rate,
            carbonReduction: v.carbon_reduction_g,
          };
        });

        setResult({ originalFile: file, variants: variantResults });
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
