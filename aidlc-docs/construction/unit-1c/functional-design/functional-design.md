# Unit 1c: Frontend UI 리디자인 + Export — Functional Design

> **단계**: CONSTRUCTION / Functional Design
> **유닛**: Unit 1c (Frontend UI Redesign + Export)
> **담당**: 이정선 / 류동현
> **선행**: Unit 1a 완료
> **브랜치**: `feat/material-design`
> **데드라인**: 이번 주

---

## 1. 목적

1. 현재 커스텀 그린 테마를 **Material Design 3(MD3)** 토큰 체계로 재정비해 컴포넌트 일관성 확보
2. 변환 완료 후 결과를 이미지로 캡처·다운로드하는 **Export 기능** 추가

---

## 2. 미결정 사항 (Q1~Q4)

### Q1: MD3 컬러 전략

EcoFont의 에코 그린 브랜딩을 어떻게 처리할 것인가?

| 옵션                                       | 설명                                                                     | 장점                        | 단점                 |
| ------------------------------------------ | ------------------------------------------------------------------------ | --------------------------- | -------------------- |
| **A. 에코 그린 유지 + MD3 토큰 구조 적용** | 현재 그린 팔레트(`#2f8f4e` 등)를 MD3 역할(Primary, Surface, etc.)에 매핑 | 브랜딩 유지, 작업 범위 최소 | 순수 MD3 룩앤필 아님 |
| **B. MD3 기본 팔레트 적용**                | 구글 기본 보라/파랑 계열로 교체                                          | MD3 정통 구현               | EcoFont 브랜딩 소실  |

[Answer]: B

---

### Q2: Export 캡처 구현 방식

| 옵션                            | 설명                    | 장점                     | 단점                               |
| ------------------------------- | ----------------------- | ------------------------ | ---------------------------------- |
| **A. `html2canvas` 라이브러리** | DOM을 캔버스로 변환     | 구현 단순                | 외부 의존성 추가, 폰트 렌더링 제한 |
| **B. Canvas API 직접 구현**     | 직접 텍스트·박스 그리기 | 완전한 제어, 의존성 없음 | 구현 복잡                          |

[Answer]: A

---

### Q3: Export 이미지에 포함할 내용

기본: 원본/변환 폰트 미리보기 텍스트 + 잉크 절약률 + EcoFont 브랜딩

추가 포함 여부를 결정해주세요:

- [~] 탄소 절감량 수치
- [~] 잉크 절약률 수치
- [~] 원본 폰트 파일명
- [ ] 변환 날짜

[Answer]: 해당 탄소 절감량 및 잉크 절약률의 숫자 폰트를 생성된 ttf 폰트에 기반하여 보여지도록 한다.

---

### Q4: Export 공유 방식

| 옵션                                   | 설명                                      |
| -------------------------------------- | ----------------------------------------- |
| **A. 이미지 다운로드만**               | PNG 파일로 저장                           |
| **B. 이미지 다운로드 + 클립보드 복사** | `navigator.clipboard.write()`             |
| **C. 이미지 다운로드 + Web Share API** | 모바일 SNS 공유 시트 (지원 브라우저 한정) |

[Answer]: A

---

### Q5: 10개 폰트의 구분 기준

백엔드가 하나의 TTF 변환에 대해 약 10개의 에코폰트 TTF를 반환한다. 이 10개는 어떤 기준으로 구분되는가?

| 옵션                    | 설명                                                            |
| ----------------------- | --------------------------------------------------------------- |
| **A. 잉크 절약 강도별** | 10%, 20%, …, 100% 등 절약 강도를 단계적으로 달리한 변형         |
| **B. 알고리즘 변형별**  | 획 제거 방식·글자 구조 최적화 전략 등 알고리즘 종류가 다른 변형 |
| **C. 기타**             | (직접 기술)                                                     |

[Answer]: B

---

### Q6: 폰트별 지표 상이 여부

10개 폰트 각각 `ink_saving_rate`와 `carbon_reduction_g` 값이 다른 값인가, 아니면 전체 동일한 대표값인가?

| 옵션               | 설명                                                |
| ------------------ | --------------------------------------------------- |
| **A. 폰트별 상이** | 각 카드마다 개별 지표 수치 표시 필요                |
| **B. 전체 동일**   | 대표값 1개를 페이지 상단에 표시, 카드에는 지표 없음 |

[Answer]: A

---

## 3. MD3 디자인 토큰

### 3.1 컬러 토큰

기본: 화이트 배경 + 다크 텍스트. 포인트(버튼·강조·링크)에 Google Blue 사용.  
에코 브랜딩은 Secondary 역할에 Google Green으로 잔존시켜 친환경 맥락 유지.

| MD3 역할               | 토큰명                 | 값        | 용도                           |
| ---------------------- | ---------------------- | --------- | ------------------------------ |
| Primary                | `primary`              | `#1A73E8` | 버튼·링크·포커스 (Google Blue) |
| On Primary             | `onPrimary`            | `#FFFFFF` | 버튼 텍스트                    |
| Primary Container      | `primaryContainer`     | `#D2E3FC` | 선택 상태 배경                 |
| On Primary Container   | `onPrimaryContainer`   | `#062E6F` | 컨테이너 위 텍스트             |
| Secondary              | `secondary`            | `#34A853` | 에코 포인트 (Google Green)     |
| On Secondary           | `onSecondary`          | `#FFFFFF` |                                |
| Secondary Container    | `secondaryContainer`   | `#CEEAD6` | 지표 카드 배경                 |
| On Secondary Container | `onSecondaryContainer` | `#0D652D` | 지표 카드 텍스트               |
| Surface                | `surface`              | `#FFFFFF` | 카드 배경                      |
| On Surface             | `onSurface`            | `#202124` | 본문 텍스트 (Google dark)      |
| Surface Variant        | `surfaceVariant`       | `#F1F3F4` | 입력 필드·서브 영역            |
| On Surface Variant     | `onSurfaceVariant`     | `#5F6368` | 보조 텍스트 (Google gray)      |
| Outline                | `outline`              | `#DADCE0` | 카드·입력 테두리               |
| Background             | `background`           | `#FFFFFF` | 페이지 배경                    |
| On Background          | `onBackground`         | `#202124` |                                |
| Error                  | `error`                | `#D93025` | 에러 (Google Red)              |
| On Error               | `onError`              | `#FFFFFF` |                                |

### 3.2 타이포그래피 토큰 (MD3 Type Scale)

| 역할            | 크기 | 줄높이 | 굵기 | 사용처           |
| --------------- | ---- | ------ | ---- | ---------------- |
| Display Small   | 36px | 44px   | 400  | 페이지 대형 제목 |
| Headline Medium | 28px | 36px   | 400  | 섹션 제목        |
| Headline Small  | 24px | 32px   | 400  | 카드 제목        |
| Title Large     | 22px | 28px   | 400  | 카드 소제목      |
| Title Medium    | 16px | 24px   | 500  | 레이블           |
| Body Large      | 16px | 24px   | 400  | 본문             |
| Body Medium     | 14px | 20px   | 400  | 보조 본문        |
| Label Large     | 14px | 20px   | 500  | 버튼             |
| Label Medium    | 12px | 16px   | 500  | 배지·태그        |

### 3.3 Shape 토큰 (MD3 Shape Scale)

| 역할        | 값       | 사용처         |
| ----------- | -------- | -------------- |
| Extra Small | `4px`    | Chip, 배지     |
| Small       | `8px`    | 입력 필드      |
| Medium      | `12px`   | 일반 카드      |
| Large       | `16px`   | 대형 카드·패널 |
| Extra Large | `28px`   | 다이얼로그     |
| Full        | `9999px` | 버튼·Pill      |

### 3.4 Elevation 토큰

| 레벨    | 값                                                        | 사용처               |
| ------- | --------------------------------------------------------- | -------------------- |
| Level 0 | `none`                                                    | Flat 카드            |
| Level 1 | `0 1px 2px rgba(0,0,0,.3), 0 1px 3px 1px rgba(0,0,0,.15)` | 기본 카드            |
| Level 2 | `0 1px 2px rgba(0,0,0,.3), 0 2px 6px 2px rgba(0,0,0,.15)` | 로딩 패널·다이얼로그 |

---

## 4. 컴포넌트 변경 명세

### 4.1 `src/styles/theme.css.ts` — 전면 교체

현재 커스텀 토큰을 MD3 역할 기반으로 재정의.  
기존 `vars.color.primary` 등 참조 파일 전체 수정 필요.

```ts
// 신규 구조
color: {
  (primary,
    onPrimary,
    primaryContainer,
    onPrimaryContainer,
    secondary,
    onSecondary,
    secondaryContainer,
    onSecondaryContainer,
    surface,
    onSurface,
    surfaceVariant,
    onSurfaceVariant,
    outline,
    background,
    onBackground,
    error,
    onError);
}
typeScale: {
  (displaySmall,
    headlineMedium,
    headlineSmall,
    titleLarge,
    titleMedium,
    bodyLarge,
    bodyMedium,
    labelLarge,
    labelMedium);
}
shape: {
  (extraSmall, small, medium, large, extraLarge, full);
}
elevation: {
  (level0, level1, level2);
}
```

### 4.2 컴포넌트별 MD3 적용

| 컴포넌트                | 변경 내용                                                                         |
| ----------------------- | --------------------------------------------------------------------------------- |
| `Header`                | Top App Bar — `surface` 배경, `outline` 하단 구분선                               |
| `FileUpload` 드롭존     | Outlined Card — `outline` 테두리, 호버 시 `primaryContainer` 배경                 |
| `FileUpload` 선택 패널  | `primaryContainer` 배경, `onPrimaryContainer` 텍스트                              |
| `StartConversionButton` | Filled Button — `primary` 배경, `onPrimary` 텍스트, `full` shape                  |
| `LoadingPanel`          | Elevated Card — `level2` elevation, `extraLarge` shape                            |
| `ResultMetrics`         | **삭제** — 지표는 각 `FontCard` 내부로 이동 (§4.3)                                |
| `FontComparison`        | **축소** — 원본 폰트 단독 미리보기 영역으로만 사용, Outlined Card style로 MD3 적용 |
| `DownloadResult`        | **삭제** — 다운로드는 각 `FontCard` 내부로 이동 (§4.3)                            |

### 4.3 다중 폰트 결과 뷰 (신규 구조)

하나의 변환 결과로 약 10개의 에코폰트 TTF가 반환된다 (Q5=B: 알고리즘 변형별).  
각 폰트 카드는 독립적으로 TTF 다운로드와 이미지 export를 지원한다 (Q6=A: 폰트별 지표 상이).

#### 데이터 타입 변경 (`src/context/ConversionContext.tsx`)

```ts
// 기존 (Unit 1b) → 삭제
// convertedBlob, downloadUrl, convertedFileName, inkSavingRate, carbonReduction

// 신규 (Unit 1c)
export type EcoFontVariant = {
  blob: Blob;
  downloadUrl: string;       // mock: BlobURL / 실API: GCS Signed URL
  fileName: string;
  inkSavingRate: number;     // 폰트별 상이
  carbonReduction: number;   // 폰트별 상이
};

export type ConversionResult = {
  originalFile: File;
  variants: EcoFontVariant[];  // 약 10개
};
```

#### 결과 페이지 레이아웃

```
[ 원본 폰트 미리보기 ]
┌─────────────────────────────────────────────────────────────┐
│ 원본: [사용자 입력 텍스트 — 원본 TTF FontFace]               │
└─────────────────────────────────────────────────────────────┘

[ 에코폰트 변형 그리드 — FontGrid ]
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  Variant 1    │  │  Variant 2    │  │  Variant 3    │  ...
│  [미리보기]   │  │  [미리보기]   │  │  [미리보기]   │
│  잉크 23.4%   │  │  잉크 31.2%   │  │  잉크 38.0%   │
│  탄소 12.5g   │  │  탄소 16.3g   │  │  탄소 20.1g   │
│ [TTF 저장]    │  │ [TTF 저장]    │  │ [TTF 저장]    │
│ [이미지 저장] │  │ [이미지 저장] │  │ [이미지 저장] │
└───────────────┘  └───────────────┘  └───────────────┘
(3열 그리드, 반응형: 태블릿 2열, 모바일 1열)
```

#### 신규 컴포넌트

| 컴포넌트 | 역할 |
|---------|------|
| `FontGrid` | `variants[]` 받아 카드 목록 렌더링, 3열 CSS Grid |
| `FontCard` | 개별 에코폰트 카드 — 미리보기 + 지표 + TTF 다운로드 버튼 + 이미지 export 버튼 + 숨겨진 `ExportCard` |

#### `FontCard` 내부 구조

각 `FontCard`는 해당 variant의 `ExportCard`를 숨겨진 div로 포함한다.  
이미지 export 버튼 클릭 시 `useExportImage(cardRef)` 훅을 호출하여 해당 카드만 캡처한다.

```tsx
function FontCard({ variant, previewText }: { variant: EcoFontVariant; previewText: string }) {
  const exportCardRef = useRef<HTMLDivElement>(null);
  const { exportImage, isExporting } = useExportImage(exportCardRef);
  // variant.blob → FontFace 로드 → 미리보기 텍스트에 적용
  // variant.downloadUrl → TTF 저장 버튼
  // exportImage() → ExportCard 캡처 → PNG 다운로드
}
```

#### mock 변경 (`src/mocks/convertFont.ts`)

`pollJob()` done 응답이 단일 객체 → `variants` 배열로 변경:

```ts
// 기존 (Unit 1b)
{ status: "done", result: { download_url, ink_saving_rate, carbon_reduction_g, converted_filename } }

// 변경 (Unit 1c) — 약 10개 variant 반환 mock
{ status: "done", result: { variants: Array<{ download_url, ink_saving_rate, carbon_reduction_g, converted_filename }> } }
```

---

## 5. Export 기능 명세

### 5.1 Export 이미지 레이아웃

참고 템플릿 구조를 기반으로 MD3 디자인 요소를 혼합:

```
┌─────────────────────────────────────────────┐  1200×630px
│                                             │  ← MD3 ExtraLarge radius (28px)
│  EcoFont 로고         [● Ink Diet 배지]    │  ← 배지: Google Blue chip
│  ─────────────────────────────────────────  │  ← MD3 Divider (outlineVariant)
│                                             │
│  잉크 다이어트, Ecofont                     │  ← onSurface (#202124), bold
│  [사용자가 입력한 미리보기 텍스트]           │  ← eco-converted TTF 폰트, Google Blue
│                                             │
│  ─────────────────────────────────────────  │  ← MD3 Divider
│                                             │
│   23.4%              12.5g                 │  ← Google Green, eco-converted TTF
│   탄소 절감          잉크 절약             │  ← onSurfaceVariant, labelMedium
│                                             │
│  ─────────────────────────────────────────  │  ← MD3 Divider
│  font: MyFont_eco.ttf   date: 2026-06-19  │  ← eco-converted TTF, bodyMedium
└─────────────────────────────────────────────┘
```

**MD3 디자인 포인트:**

- 카드 전체: `surface` (#FFF) 배경, `level1` elevation, `extraLarge` shape (28px)
- 배지: Google Blue (`primary`) 배경의 MD3 Assist Chip — "Ink Diet ✓"
- 제목("잉크 다이어트, Ecofont"): `onSurface` (#202124), headlineMedium
- 미리보기 텍스트: `primary` (#1A73E8) 컬러, displaySmall 크기, **eco-converted TTF 렌더링**
- 지표 수치(23.4%, 12.5g): `secondary` (#34A853, Google Green), displaySmall, **eco-converted TTF 렌더링**
- 지표 레이블(탄소 절감, 잉크 절약): `onSurfaceVariant` (#5F6368), labelMedium
- 하단(font/date): `onSurfaceVariant`, bodyMedium, **eco-converted TTF 렌더링**
- 구분선: `outlineVariant` (#DADCE0)

### 5.2 신규 파일

**`src/components/result/ExportCard/index.tsx`**

- `variant: EcoFontVariant`와 `previewText: string`을 prop으로 받음
- 화면에서 숨겨진 캡처 전용 div (`position: absolute; left: -9999px`)
- 해당 variant의 Blob으로 `FontFace` 생성 → `fontFamily` 인라인 스타일 적용
- Context 의존 없음 — 순수 prop 기반 (각 FontCard가 독립적으로 보유)

**`src/hooks/useExportImage.ts`**

```ts
export function useExportImage(targetRef: RefObject<HTMLDivElement>, fileName: string): {
  exportImage: () => Promise<void>;
  isExporting: boolean;
};
```

- `document.fonts.ready` 완료 후 캡처 시작 (커스텀 폰트 보장)
- `html2canvas(el, { scale: 2, useCORS: true, allowTaint: false })`
- `canvas.toBlob('image/png')` → `<a download="{fileName}_ecofont.png">` 트리거

**`src/components/result/FontGrid/index.tsx`** (신규)

- `variants: EcoFontVariant[]`와 `previewText: string`을 prop으로 받음
- 3열 CSS Grid, 반응형

**`src/components/result/FontCard/index.tsx`** (신규)

- `variant: EcoFontVariant`, `previewText: string` prop
- 내부에 숨겨진 `<ExportCard ref={exportCardRef} />` 보유
- MD3 Outlined Card (`outline` 테두리, `large` shape, `level1` elevation)
- TTF 저장 버튼: Filled Button (`primary`), `a.href = variant.downloadUrl`
- 이미지 저장 버튼: Tonal Button (`secondaryContainer`), `useExportImage()` 호출

### 5.3 `src/app/result/page.tsx` 변경

- `<ResultMetrics />` 제거
- `<DownloadResult />` 제거
- `<FontComparison />` → 원본 미리보기 전용으로 축소 유지 (originalFile 기반)
- `<FontGrid variants={result.variants} previewText={previewText} />` 추가
- `previewText`는 `FontComparison` 입력 텍스트와 동일한 값 — Context 또는 URL param으로 전달

### 5.4 `src/constants/copy.ts` 추가 문구

```ts
result: {
  exportAction: "결과 이미지 저장",
  exportingAction: "이미지 생성 중...",
}
```

---

## 6. 변경 파일 목록

| 파일                                                                       | 변경 유형 |
| -------------------------------------------------------------------------- | --------- |
| `src/styles/theme.css.ts`                                                  | 교체      |
| `src/context/ConversionContext.tsx`                                        | 수정 (EcoFontVariant 타입 도입, ConversionResult.variants 배열로 변경) |
| `src/mocks/convertFont.ts`                                                 | 수정 (pollJob done 응답 → variants 배열 반환) |
| `src/hooks/useConvertFont.ts`                                              | 수정 (variants 배열 Context 저장) |
| `src/components/common/Header/Header.css.ts`                               | 수정      |
| `src/components/upload/FileUpload/FileUpload.css.ts`                       | 수정      |
| `src/components/upload/StartConversionButton/StartConversionButton.css.ts` | 수정      |
| `src/components/loading/LoadingPanel/LoadingPanel.css.ts`                  | 수정      |
| `src/components/result/ResultMetrics/`                                     | **삭제**  |
| `src/components/result/DownloadResult/`                                    | **삭제**  |
| `src/components/result/FontComparison/FontComparison.css.ts`               | 수정 (원본 미리보기 전용, MD3 스타일) |
| `src/components/result/FontGrid/index.tsx`                                 | 신규      |
| `src/components/result/FontGrid/FontGrid.css.ts`                           | 신규      |
| `src/components/result/FontCard/index.tsx`                                 | 신규      |
| `src/components/result/FontCard/FontCard.css.ts`                           | 신규      |
| `src/components/result/ExportCard/index.tsx`                               | 신규      |
| `src/components/result/ExportCard/ExportCard.css.ts`                       | 신규      |
| `src/hooks/useExportImage.ts`                                              | 신규      |
| `src/app/result/page.tsx`                                                  | 수정      |
| `src/constants/copy.ts`                                                    | 수정      |

---

## 7. 기술 고려사항

html2canvas는 `@font-face`로 로드된 커스텀 폰트를 캡처하지 못하는 경우가 있다.  
`document.fonts.ready` Promise 완료 후 캡처를 시작하고 `useCORS: true`를 적용한다.  
그래도 폰트가 누락되면 `FontFace.load()` 완료를 명시적으로 기다린 뒤 캡처한다.
