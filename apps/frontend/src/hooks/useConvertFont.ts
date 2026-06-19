"use client";

// 파일 변환 흐름(mock 호출 → Context 저장 → /result 이동)과 로딩·에러 상태를 관리하는 훅
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConversion } from "@/context/ConversionContext";
import { convertFont } from "@/mocks/convertFont";
import { copy } from "@/constants/copy";

export function useConvertFont() {
  const router = useRouter();
  const { setResult } = useConversion();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convert = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const convertedBlob = await convertFont(file);
      setResult({
        originalFile: file,
        convertedBlob,
        convertedFileName: `eco_${file.name}`,
      });
      router.push("/result");
    } catch {
      setError(copy.upload.conversionError);
      setIsLoading(false);
    }
  };

  return { convert, isLoading, error };
}
