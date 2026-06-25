"use client";

// 파일 변환 흐름(단일 API 호출 → variants 매핑 → Context 저장 → /result 이동)과
// 로딩·단계·에러 상태를 관리하는 훅.
//
// 백엔드는 진행률을 주지 않고 동기 응답 한 번으로 결과를 반환하므로,
// 로딩 단계 문구는 타이머로 순차 전환하다가 마지막 단계("finalizing")에서
// 응답이 올 때까지 유지한다(= indeterminate progress 패턴).
//
// mock 폴백: ① NEXT_PUBLIC_USE_MOCK=true 면 항상 mock ② API 연결 자체가
// 실패하면(터널 미개통/백엔드 다운) mock 으로 자동 폴백한다. 단, 서버가
// 응답한 에러(422 비-Cherokee, 500 등)는 mock 으로 가리지 않고 그대로 노출.
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useConversion } from "@/context/ConversionContext";
import type { EcoFontVariant } from "@/context/ConversionContext";
import {
  generateEcoFont,
  toAbsoluteUrl,
  FontGenerationError,
} from "@/api/fontGeneration";
import {
  buildMockVariants,
  buildHangulMockVariants,
  MOCK_CARBON_FACTOR_G,
  delay,
} from "@/mocks/fontGeneration";
import { getScriptPreviewConfig } from "@/constants/preview";

// 타이머로 전환되는 로딩 단계(마지막 단계는 응답 올 때까지 유지)
const STAGE_TIMELINE: { stage: string; afterMs: number }[] = [
  { stage: "parsing", afterMs: 800 },
  { stage: "optimizing", afterMs: 2400 },
  { stage: "finalizing", afterMs: 5000 },
];

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
// mock 결과의 script 값(미리보기 UI 분기 테스트용). "cherokee" | "hangul" 등.
const MOCK_SCRIPT = process.env.NEXT_PUBLIC_MOCK_SCRIPT ?? "cherokee";

export function useConvertFont() {
  const router = useRouter();
  const { setResult, setPreviewText } = useConversion();
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => clearTimers, []);

  const finish = (file: File, variants: EcoFontVariant[], script: string) => {
    clearTimers();
    // 잉크 절약률 ≤ 0(원본과 같거나 잉크를 더 쓰는) 후보는 에코 목적에 반하므로 제외.
    // 남은 후보는 OCR 글자 인식률 내림차순 정렬(가독성 높은 후보부터, null은 뒤로) — OCR 값은 UI 미노출, 정렬에만 사용.
    const ranked = variants
      .filter((v) => v.inkSavingRate > 0)
      .sort((a, b) => (b.ocrScore ?? -1) - (a.ocrScore ?? -1));
    // 스크립트별 미리보기 입력 초기값 설정(cherokee 면 샘플 프리필, 그 외 빈 값)
    setPreviewText(getScriptPreviewConfig(script).inputDefault);
    setResult({ originalFile: file, variants: ranked, script });
    router.push("/result");
  };

  const convert = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setStage("uploading");

    // 단계 문구 타이머 시작
    clearTimers();
    timersRef.current = STAGE_TIMELINE.map(({ stage, afterMs }) =>
      setTimeout(() => setStage(stage), afterMs)
    );

    // 강제 mock 모드: 로딩 UI 가 보이도록 잠깐 지연 후 mock 결과
    if (USE_MOCK) {
      await delay(2500);
      finish(file, buildMockVariants(file), MOCK_SCRIPT);
      return;
    }

    try {
      const data = await generateEcoFont(file);

      const variants = data.candidates.map((c) => {
        const inkSavingRate = c.metrics.mean_ink_saving;
        return {
          downloadUrl: toAbsoluteUrl(c.ttf_url),
          fileName: c.ttf_url.split("/").pop() ?? `${c.candidate_id}.ttf`,
          inkSavingRate,
          // mock 탄소 절감량(잉크 절약률에 비례) — 실 계수 확정 시 교체
          carbonReduction: +(inkSavingRate * MOCK_CARBON_FACTOR_G).toFixed(1),
          ocrScore: c.metrics.mean_ocr_score,
        };
      });

      finish(file, variants, data.script);
    } catch (e) {
      if (e instanceof FontGenerationError) {
        // 한국어 폰트: 백엔드 미지원(422)이지만, 프론트 보유 한글 mock 에코폰트로 결과 화면 처리
        if (e.detail?.detected_script === "hangul") {
          finish(file, buildHangulMockVariants(), "hangul");
          return;
        }
        // 그 외 서버 에러(다른 비-Cherokee 스크립트 등)는 그대로 노출
        clearTimers();
        setError(e.message);
        setIsLoading(false);
        setStage(null);
        return;
      }

      // 연결 자체 실패(터널 미개통/백엔드 다운) → mock 으로 자동 폴백
      console.warn("[useConvertFont] API 연결 실패 → mock 데이터로 폴백", e);
      finish(file, buildMockVariants(file), MOCK_SCRIPT);
    }
  };

  return { convert, isLoading, stage, error };
}
