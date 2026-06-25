// 백엔드 연결 불가/강제 mock 모드일 때 사용하는 가짜 변환 결과 생성기.
// 실 API(URL 기반)와 달리 백엔드가 없으므로, 업로드한 원본 파일 바이트를
// object URL 로 만들어 미리보기·다운로드가 동작하도록 한다(변환은 흉내만).
import type { EcoFontVariant } from "@/context/ConversionContext";

// TODO(Open-2): 탄소 환산 계수 확정 시 교체. 실 API 경로의 mock 탄소도 이 값 공유.
export const MOCK_CARBON_FACTOR_G = 52.6;

// mock 후보 스펙(잉크 절약률, OCR 인식률). OCR 값은 정렬 동작 확인용으로 일부러 뒤섞음.
const MOCK_CANDIDATES: { rate: number; ocr: number }[] = [
  { rate: 0.15, ocr: 0.88 },
  { rate: 0.23, ocr: 0.72 },
  { rate: 0.31, ocr: 0.95 },
  { rate: 0.38, ocr: 0.6 },
  { rate: 0.45, ocr: 0.81 },
];

export function buildMockVariants(file: File): EcoFontVariant[] {
  // 모든 변형이 원본 파일 바이트를 공유(변환을 흉내내는 mock이므로)
  const objectUrl = URL.createObjectURL(file);

  return MOCK_CANDIDATES.map(({ rate, ocr }, i) => ({
    downloadUrl: objectUrl,
    fileName: file.name.replace(/\.ttf$/i, `_eco_v${i + 1}.ttf`),
    inkSavingRate: rate,
    carbonReduction: +(rate * MOCK_CARBON_FACTOR_G).toFixed(1),
    ocrScore: ocr,
  }));
}

// ── 한글 mock ──────────────────────────────────────────────
// 백엔드는 한글 폰트를 미지원(422)하므로, 한국어 폰트 업로드 시 프론트가 보유한
// 사전 생성 한글 에코폰트(public/hangul_eco/*.ttf)로 결과 화면을 처리한다.
// 파일은 백엔드와 동일한 20가지 스타일 레시피. ink/ocr 값은 임의값(확정 데이터 아님).
// 잉크 절약률은 40% 미만 범위로 지정. diag 계열의 ≤0 은 finish() 필터로 자동 제외된다.
type HangulMockSpec = { file: string; ink: number; ocr: number };

const HANGUL_MOCK_DIR = "/hangul_eco";
const HANGUL_MOCK_CANDIDATES: HangulMockSpec[] = [
  { file: "hangul_full_00_source_original.ttf", ink: 0.0, ocr: 0.88 },
  { file: "hangul_full_01_source_erode1.ttf", ink: 0.08, ocr: 0.81 },
  { file: "hangul_full_02_source_erode2.ttf", ink: 0.15, ocr: 0.5 },
  { file: "hangul_full_03_source_inline_soft.ttf", ink: 0.16, ocr: 0.84 },
  { file: "hangul_full_04_source_inline_w1.ttf", ink: 0.28, ocr: 0.84 },
  { file: "hangul_full_05_source_inline_w2.ttf", ink: 0.33, ocr: 0.97 },
  { file: "hangul_full_06_source_erode1_inline_soft.ttf", ink: 0.19, ocr: 0.88 },
  { file: "hangul_full_07_source_inline_erode_w1.ttf", ink: 0.27, ocr: 0.78 },
  { file: "hangul_full_08_source_inline_erode_w2.ttf", ink: 0.31, ocr: 0.96 },
  { file: "hangul_full_09_source_closed_inline_w1.ttf", ink: 0.24, ocr: 0.63 },
  { file: "hangul_full_10_source_closed_inline_w2.ttf", ink: 0.3, ocr: 0.95 },
  { file: "hangul_full_11_source_erode2_inline_soft.ttf", ink: 0.26, ocr: 0.66 },
  { file: "hangul_full_12_source_erode2_inline_w1.ttf", ink: 0.34, ocr: 0.59 },
  { file: "hangul_full_13_source_erode2_inline_w2.ttf", ink: 0.38, ocr: 0.19 },
  { file: "hangul_full_14_source_diag_t45.ttf", ink: -0.09, ocr: 0.81 },
  { file: "hangul_full_15_source_diag_t60.ttf", ink: -0.03, ocr: 0.84 },
  { file: "hangul_full_16_source_erode_diag_t45.ttf", ink: 0.11, ocr: 0.81 },
  { file: "hangul_full_17_source_erode_diag_t60.ttf", ink: 0.13, ocr: 0.84 },
  { file: "hangul_full_18_source_closed_diag_t45.ttf", ink: -0.17, ocr: 0.81 },
  { file: "hangul_full_19_source_closed_diag_t60.ttf", ink: -0.1, ocr: 0.81 },
];

export function buildHangulMockVariants(): EcoFontVariant[] {
  return HANGUL_MOCK_CANDIDATES.map(({ file, ink, ocr }) => ({
    downloadUrl: `${HANGUL_MOCK_DIR}/${file}`,
    fileName: file,
    inkSavingRate: ink,
    carbonReduction: +(ink * MOCK_CARBON_FACTOR_G).toFixed(1),
    ocrScore: ocr,
  }));
}

export function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
