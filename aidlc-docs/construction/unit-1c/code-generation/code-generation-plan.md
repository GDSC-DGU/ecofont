# Unit 1c: Code Generation Plan

> **단계**: CONSTRUCTION / Code Generation Plan
> **유닛**: Unit 1c (Frontend UI Redesign + Export)
> **담당**: 이정선 / 류동현
> **브랜치**: `feat/material-design`

---

## 전제

- 기존 토큰(`vars.color.text`, `vars.radius.*`, `vars.shadow.*` 등)을 MD3 토큰으로 교체
- `theme.css.ts`를 교체하면 **모든 `.css.ts` 파일의 토큰 참조를 동시에 수정**해야 TypeScript/빌드 오류가 없음
- `ResultMetrics`, `DownloadResult`는 UI에서 제거 → CSS 파일도 null 스텁으로 교체해 빌드 오류 방지

### 토큰 매핑 (old → new)

| 구 토큰 | 신 토큰 |
|--------|--------|
| `vars.color.text` | `vars.color.onSurface` |
| `vars.color.textMuted` | `vars.color.onSurfaceVariant` |
| `vars.color.border` | `vars.color.outline` |
| `vars.color.borderStrong` | `vars.color.outline` (강조 시 `vars.color.primary`) |
| `vars.color.primarySoft` | `vars.color.primaryContainer` |
| `vars.color.primaryHover` | `vars.color.primaryContainer` |
| `vars.color.surfaceMuted` | `vars.color.surfaceVariant` |
| `vars.color.surfaceStrong` | `vars.color.primaryContainer` |
| `vars.color.warning` | (제거) |
| `vars.color.accent` / `accentStrong` | (제거) |
| `vars.shadow.subtle` | `vars.elevation.level1` |
| `vars.radius.sm` | `vars.shape.extraSmall` |
| `vars.radius.md` | `vars.shape.medium` |
| `vars.radius.lg` | `vars.shape.large` |

---

## Phase 1 — 의존성

| # | 작업 | 파일 |
|---|------|------|
| 1.1 | `html2canvas` 설치 | `apps/frontend/package.json` (pnpm 실행) |

```bash
pnpm --filter frontend add html2canvas
```

---

## Phase 2 — 데이터 레이어 (순서 의존성 있음)

| # | 작업 | 파일 | 변경 내용 |
|---|------|------|---------|
| 2.1 | `ConversionContext` 타입 변경 | `src/context/ConversionContext.tsx` | `EcoFontVariant` 신규 타입 + `ConversionResult.variants[]` + `previewText`/`setPreviewText` 컨텍스트 추가 |
| 2.2 | mock 반환값 변경 | `src/mocks/convertFont.ts` | `MockPollResult` done → `variants[]` (5개 mock 변형) |
| 2.3 | 훅 결과 처리 변경 | `src/hooks/useConvertFont.ts` | done 분기: `variants[]` 각각 `fetch(url).then(r=>r.blob())` 병렬 처리 → `setResult({ originalFile, variants })` |

### 2.1 신규 타입 구조

```ts
export type EcoFontVariant = {
  blob: Blob;
  downloadUrl: string;
  fileName: string;
  inkSavingRate: number;
  carbonReduction: number;
};

export type ConversionResult = {
  originalFile: File;
  variants: EcoFontVariant[];
};

// Context에 previewText 추가
type ConversionContextValue = {
  result: ConversionResult | null;
  setResult: (r: ConversionResult) => void;
  previewText: string;
  setPreviewText: (t: string) => void;
};
```

### 2.2 mock variants (5개)

```ts
// 실제 알고리즘 변형은 5~10개. mock은 5개로 시뮬레이션
const variants = await Promise.all(
  [
    { rate: 0.15, carbon: 7.8,  suffix: "_eco_v1" },
    { rate: 0.23, carbon: 12.1, suffix: "_eco_v2" },
    { rate: 0.31, carbon: 16.4, suffix: "_eco_v3" },
    { rate: 0.38, carbon: 20.0, suffix: "_eco_v4" },
    { rate: 0.45, carbon: 23.7, suffix: "_eco_v5" },
  ].map(async (v) => {
    const blob = new Blob([await file.arrayBuffer()], { type: "font/ttf" });
    return {
      download_url: URL.createObjectURL(blob),
      ink_saving_rate: v.rate,
      carbon_reduction_g: v.carbon,
      converted_filename: file.name.replace(/\.ttf$/i, `${v.suffix}.ttf`),
    };
  })
);
return { status: "done", result: { variants } };
```

### 2.3 useConvertFont done 분기

```ts
// status === "done"
setStage("finalizing");
const variantResults = await Promise.all(
  poll.result.variants.map(async (v) => {
    const blob = await fetch(v.download_url).then((r) => r.blob());
    return {
      blob,
      downloadUrl: v.download_url,
      fileName: v.converted_filename,
      inkSavingRate: v.ink_saving_rate,
      carbonReduction: v.carbon_reduction_g,
    };
  })
);
setResult({ originalFile: file, variants: variantResults });
router.push("/result");
```

---

## Phase 3 — 테마 교체 (Phase 2 이후, Phase 4 이전)

| # | 작업 | 파일 |
|---|------|------|
| 3.1 | MD3 토큰으로 전면 교체 + `rawTokens` JS 상수 추가 | `src/styles/theme.css.ts` |
| 3.2 | 전역 스타일 토큰 참조 업데이트 | `src/styles/global.css.ts` |

### 3.1 신규 theme.css.ts 구조

```ts
export const [themeClass, vars] = createTheme({
  color: {
    primary: "#1A73E8",
    onPrimary: "#FFFFFF",
    primaryContainer: "#D2E3FC",
    onPrimaryContainer: "#062E6F",
    secondary: "#34A853",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#CEEAD6",
    onSecondaryContainer: "#0D652D",
    surface: "#FFFFFF",
    onSurface: "#202124",
    surfaceVariant: "#F1F3F4",
    onSurfaceVariant: "#5F6368",
    outline: "#DADCE0",
    outlineVariant: "#DADCE0",
    background: "#FFFFFF",
    onBackground: "#202124",
    error: "#D93025",
    onError: "#FFFFFF",
  },
  space: { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px", xxl: "48px" },
  shape: { extraSmall: "4px", small: "8px", medium: "12px", large: "16px", extraLarge: "28px", full: "9999px" },
  elevation: {
    level0: "none",
    level1: "0 1px 2px rgba(0,0,0,.3), 0 1px 3px 1px rgba(0,0,0,.15)",
    level2: "0 1px 2px rgba(0,0,0,.3), 0 2px 6px 2px rgba(0,0,0,.15)",
  },
  font: { body: "Arial, Helvetica, sans-serif" },
});

// ExportCard 인라인 스타일용 JS 상수 (vanilla-extract 외부)
export const rawTokens = { ... };
```

---

## Phase 4 — 기존 컴포넌트 CSS + JSX 업데이트

순서 무관 (테마 교체 후 병렬 작업 가능).

| # | 파일 | 변경 내용 |
|---|------|---------|
| 4.1 | `Header.css.ts` | `vars.color.border` → `vars.color.outline` |
| 4.2 | `FileUpload.css.ts` | 토큰 전면 교체 (MD3 Outlined Card 스타일) |
| 4.3 | `StartConversionButton.css.ts` | MD3 Filled Button (`primary` bg, `full` shape) |
| 4.4 | `LoadingPanel.css.ts` | MD3 Elevated Card (`level2` elevation, `extraLarge` shape) |
| 4.5 | `LoadingOverlay.css.ts` | 토큰 참조 확인 및 업데이트 |
| 4.6 | `UploadGuide.css.ts` | `surfaceMuted`→`surfaceVariant`, `borderStrong`→`outline` 등 |
| 4.7 | `app/page.css.ts` | `textMuted`→`onSurfaceVariant`, `radius`→`shape` |
| 4.8 | `app/result/page.css.ts` | 레이아웃 변경: `grid` 2열→ 단일 컬럼 + FontGrid 섹션 추가 |
| 4.9 | `FontComparison/index.tsx` | 원본 패널만 유지 + `setPreviewText` context 연동 |
| 4.10 | `FontComparison/FontComparison.css.ts` | MD3 Outlined Card 스타일 |
| 4.11 | `ResultMetrics/index.tsx` | `null` 스텁 (UI 제거) |
| 4.12 | `ResultMetrics/ResultMetrics.css.ts` | 빈 파일 스텁 (빌드 오류 방지) |
| 4.13 | `DownloadResult/index.tsx` | `null` 스텁 (UI 제거) |
| 4.14 | `DownloadResult/DownloadResult.css.ts` | 빈 파일 스텁 |

### 4.9 FontComparison 변경 사항

- `useFontFaceLoader("eco-converted", result.convertedBlob)` 제거
- `convertedLoaded` 패널 제거
- `previewText` local state → `const { previewText, setPreviewText } = useConversion()`
- 원본 패널 1개만 표시

---

## Phase 5 — 신규 컴포넌트

| # | 파일 | 내용 |
|---|------|------|
| 5.1 | `src/hooks/useExportImage.ts` | NFR Design §구현 매핑 PERF-2 그대로 |
| 5.2 | `src/components/result/ExportCard/index.tsx` | variant + previewText prop, 숨겨진 캡처 div, 1200×630 레이아웃 |
| 5.3 | `src/components/result/ExportCard/ExportCard.css.ts` | `rawTokens` JS 상수 사용 (인라인용) + CSS 모듈 클래스 |
| 5.4 | `src/components/result/FontCard/index.tsx` | variant prop + useFontFaceLoader + useExportImage + 숨겨진 ExportCard |
| 5.5 | `src/components/result/FontCard/FontCard.css.ts` | MD3 Outlined Card, `minHeight: "280px"` |
| 5.6 | `src/components/result/FontGrid/index.tsx` | variants[] + previewText context 읽기 + Promise.allSettled 병렬 로드 |
| 5.7 | `src/components/result/FontGrid/FontGrid.css.ts` | 3열 CSS Grid, 반응형 |

### 5.6 FontGrid 폰트 로딩 전략

```ts
// FontGrid: 마운트 시 모든 variant 병렬 로드
useEffect(() => {
  const faces = variants.map((v, i) => new FontFace(`eco-variant-${i}`, `url(${v.downloadUrl})`));
  Promise.allSettled(faces.map((f) => f.load())).then((results) => {
    results.forEach((r, i) => {
      if (r.status === "fulfilled") document.fonts.add(faces[i]);
    });
    setFontsLoaded(true);
  });
  return () => { faces.forEach((f) => { try { document.fonts.delete(f); } catch {} }); };
}, [variants]);

// FontCard에 fontFamily="eco-variant-{index}" prop 전달
```

---

## Phase 6 — 배럴 export + 페이지 + copy

| # | 파일 | 변경 내용 |
|---|------|---------|
| 6.1 | `src/components/result/index.ts` | DownloadResult·ResultMetrics 제거, FontGrid·FontCard 추가 |
| 6.2 | `src/app/result/page.tsx` | DownloadResult·ResultMetrics 제거, `<FontGrid />` 추가 |
| 6.3 | `src/constants/copy.ts` | `result.exportAction`, `result.exportingAction`, `result.exportError` 추가 |

---

## 생성 순서 요약

```
Phase 1 (의존성 설치)
  → Phase 2 (ConversionContext → mocks → useConvertFont)
  → Phase 3 (theme.css.ts → global.css.ts)
  → Phase 4 (기존 CSS 파일 전체 일괄 업데이트)
  → Phase 5 (신규 훅·컴포넌트)
  → Phase 6 (배럴·페이지·copy)
```

Phase 3 완료 전에 Phase 4를 진행하면 TypeScript 오류 발생. 순서 엄수.
