# Unit 1b Code Generation Plan

> **유닛**: Unit 1b (Frontend API 연동 — Mock 폴링 시뮬레이션)
> **담당**: 이정선
> **선행**: Unit 2 API 계약 확정 (완료)
> **브랜치**: `feat-comparison-ui` (Unit 1a 이어서)

---

## 구현 목표

- `POST /convert` → job_id → `GET /jobs/{id}` 폴링 흐름을 mock으로 시뮬레이션
- `fetch(downloadUrl)` 단계 포함 → 실 API 연결 시 mock 함수만 교체
- `inkSavingRate`, `carbonReduction` Context에 저장 → ResultMetrics 실제 값 표시

---

## Step 체크리스트

- [x] Step 1: `src/constants/copy.ts` — 폴링 단계 메시지 추가
- [x] Step 2: `src/mocks/convertFont.ts` — 폴링 시뮬레이션으로 전면 교체
- [x] Step 3: `src/context/ConversionContext.tsx` — ConversionResult 타입 확장
- [x] Step 4: `src/hooks/useConvertFont.ts` — 폴링 루프 + fetch(downloadUrl) 구현
- [x] Step 5: `src/components/loading/LoadingPanel/index.tsx` — stage prop 수용
- [x] Step 6: `src/components/loading/LoadingOverlay/index.tsx` — stage prop 전달
- [x] Step 7: `src/components/upload/StartConversionButton/index.tsx` — stage 연결
- [x] Step 8: `src/components/result/DownloadResult/index.tsx` — downloadUrl 사용
- [x] Step 9: `src/components/result/ResultMetrics/index.tsx` — 실제 지표 표시

---

## Step 상세

### Step 1: `src/constants/copy.ts`

`upload` 섹션에 `stages` 추가:

```ts
upload: {
  ...기존,
  stages: {
    uploading:  "파일을 업로드하는 중입니다",
    parsing:    "폰트 구조를 분석하는 중입니다",
    optimizing: "잉크 절약 최적화를 적용하는 중입니다",
    finalizing: "결과를 마무리하는 중입니다",
  },
}
```

---

### Step 2: `src/mocks/convertFont.ts` (전면 교체)

```ts
// Unit 1b 실 API 연결 시: startConversion → POST /convert fetch로 교체
//                          pollJob → GET /jobs/{id} fetch로 교체
export type MockJobStatus = "pending" | "processing" | "done" | "failed";

export type MockPollResult =
  | { status: "processing"; stage: string; progress: number }
  | { status: "done"; result: { download_url: string; ink_saving_rate: number; carbon_reduction_g: number; converted_filename: string } }
  | { status: "failed"; message: string };

export async function startConversion(_file: File): Promise<string> {
  await delay(300);
  return "mock-job-id";
}

export async function pollJob(
  _jobId: string,
  file: File,
  attempt: number
): Promise<MockPollResult> {
  await delay(1000);
  if (attempt === 1) return { status: "processing", stage: "parsing",    progress: 0.3 };
  if (attempt === 2) return { status: "processing", stage: "optimizing", progress: 0.7 };
  const blob = new Blob([await file.arrayBuffer()], { type: "font/ttf" });
  return {
    status: "done",
    result: {
      download_url:       URL.createObjectURL(blob),
      ink_saving_rate:    0.234,
      carbon_reduction_g: 12.5,
      converted_filename: file.name.replace(/\.ttf$/i, "_eco.ttf"),
    },
  };
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
```

---

### Step 3: `src/context/ConversionContext.tsx`

`ConversionResult` 타입에 3개 필드 추가:

```ts
export type ConversionResult = {
  originalFile: File;
  convertedBlob: Blob;       // fetch(downloadUrl) 결과 — FontFace 미리보기용
  downloadUrl: string;        // 다운로드 anchor href용
  convertedFileName: string;
  inkSavingRate: number;      // 0~1 (예: 0.234)
  carbonReduction: number;    // g 단위 (예: 12.5)
};
```

컨텍스트 내부 로직 변경 없음.

---

### Step 4: `src/hooks/useConvertFont.ts` (전면 교체)

```ts
// 파일 변환 흐름(폴링 mock → fetch → Context 저장 → /result 이동)과 로딩·단계·에러 상태를 관리하는 훅
export function useConvertFont() {
  // 상태: isLoading, stage (string|null), error
  // convert(file):
  //   1. startConversion(file) → jobId
  //   2. setInterval 2500ms:
  //      pollJob(jobId, file, attempt++) →
  //        processing: setStage(stage)
  //        done:       fetch(result.download_url) → blob
  //                    setResult({ originalFile, convertedBlob: blob, downloadUrl, convertedFileName, inkSavingRate, carbonReduction })
  //                    clearInterval → router.push('/result')
  //        failed:     setError(message) → clearInterval → setIsLoading(false)
  //   3. useEffect cleanup: clearInterval (언마운트 안전)
  return { convert, isLoading, stage, error };
}
```

`stage` 타입: `"uploading" | "parsing" | "optimizing" | "finalizing" | null`

---

### Step 5: `src/components/loading/LoadingPanel/index.tsx`

- `stage?: string | null` prop 추가
- `stage` 있을 때 `copy.upload.stages[stage]` 를 subtitle로 렌더링

---

### Step 6: `src/components/loading/LoadingOverlay/index.tsx`

- `stage?: string | null` prop 추가 → `LoadingPanel`에 전달

---

### Step 7: `src/components/upload/StartConversionButton/index.tsx`

- `useConvertFont()`에서 `stage` 추가로 구조분해
- `<LoadingOverlay stage={stage} />` 로 변경

---

### Step 8: `src/components/result/DownloadResult/index.tsx`

```tsx
// 변경 전
const url = URL.createObjectURL(result.convertedBlob);
a.href = url;
a.download = result.convertedFileName;
a.click();
URL.revokeObjectURL(url);

// 변경 후
const a = document.createElement("a");
a.href = result.downloadUrl;
a.download = result.convertedFileName;
a.click();
```

Blob URL 생성/해제 불필요 (downloadUrl이 이미 BlobURL 또는 GCS URL).

---

### Step 9: `src/components/result/ResultMetrics/index.tsx`

- `"use client"` 추가
- `useConversion()` → `result` 읽기
- `inkSavingRate`: `(result.inkSavingRate * 100).toFixed(1) + "%"` 포맷
- `carbonReduction`: `result.carbonReduction + "g"` 포맷
- `result` 없을 때 fallback: `"—"` 표시

---

## 실 API 교체 시 변경 범위 (참조)

| 파일 | 변경 내용 |
|------|---------|
| `src/mocks/convertFont.ts` | `startConversion` → `fetch(POST /convert)`, `pollJob` → `fetch(GET /jobs/{id})` |
| `src/hooks/useConvertFont.ts` | import path `@/mocks/convertFont` → `@/api/convertFont` 1줄 |
| `.env.local` | `NEXT_PUBLIC_API_URL` 추가 |

나머지 파일 변경 없음.
