# Unit 1c: NFR Design

> **단계**: CONSTRUCTION / NFR Design
> **유닛**: Unit 1c (Frontend UI Redesign + Export)
> **담당**: 이정선 / 류동현

---

## 1. NFR → 구현 매핑

### NFR-U1C-PERF-1 — FontFace 10개 병렬 로드

`FontCard`마다 `useEffect` 안에서 개별 `FontFace.load()`를 호출하면 순차 로드가 된다.  
대신 `FontGrid`에서 모든 variant의 Blob을 받아 `Promise.all`로 병렬 로드한다.

```ts
// FontGrid 또는 result page에서
const fontFaces = variants.map((v, i) =>
  new FontFace(`eco-variant-${i}`, `url(${v.downloadUrl})`)
);
await Promise.all(fontFaces.map((f) => f.load()));
fontFaces.forEach((f) => document.fonts.add(f));
```

각 `FontCard`는 `fontFamily: 'eco-variant-{index}'` 인라인 스타일을 적용한다.

### NFR-U1C-PERF-2 — Export 캡처 시간 보장

`useExportImage` 훅에서 캡처 전에 `document.fonts.ready`를 명시적으로 대기한다.  
FontFace가 이미 로드됐으면 즉시 resolve되므로 추가 지연은 없다.

```ts
export function useExportImage(ref: RefObject<HTMLDivElement>, fileName: string) {
  const [isExporting, setIsExporting] = useState(false);

  const exportImage = async () => {
    if (!ref.current) return;
    setIsExporting(true);
    try {
      await document.fonts.ready;
      const canvas = await html2canvas(ref.current, { scale: 2, useCORS: true, allowTaint: false });
      canvas.toBlob((blob) => {
        if (!blob) return;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${fileName}_ecofont.png`;
        a.click();
        URL.revokeObjectURL(a.href);
      }, "image/png");
    } catch {
      // NFR-U1C-COMPAT-1 처리 위임 — 호출부에서 catch
      throw new Error("export-failed");
    } finally {
      setIsExporting(false);
    }
  };

  return { exportImage, isExporting };
}
```

### NFR-U1C-PERF-3 — FontCard 고정 높이 (CLS 방지)

`FontCard.css.ts`에서 카드 최소 높이를 고정한다.

```ts
export const card = style({
  minHeight: "280px",  // 미리보기 영역 + 버튼 영역 합산 기준
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
});
```

### NFR-U1C-A11Y-1/2/3 — aria 속성

```tsx
// FontCard
<article aria-label={`변형 ${index + 1} 에코폰트`}>
  <button
    aria-label={`변형 ${index + 1} TTF 다운로드`}
    onClick={handleDownload}
  >
    TTF 저장
  </button>
  <button
    aria-label={`변형 ${index + 1} 이미지 저장`}
    aria-busy={isExporting}
    disabled={isExporting}
    onClick={exportImage}
  >
    {isExporting ? "이미지 생성 중..." : "이미지 저장"}
  </button>
</article>
```

### NFR-U1C-COMPAT-1 — html2canvas 실패 에러 처리

`FontCard`에서 `exportImage()`를 try-catch로 감싸고 에러 발생 시 인라인 에러 메시지 표시한다.  
별도 토스트 컴포넌트 없이 `useState<string | null>(null)` 에러 상태를 카드 하단에 렌더링한다.

```tsx
const [exportError, setExportError] = useState<string | null>(null);

const handleExport = async () => {
  try {
    setExportError(null);
    await exportImage();
  } catch {
    setExportError(copy.result.exportError);
  }
};
```

### NFR-U1C-COMPAT-2 — FontFace 로드 실패 폴백

`FontGrid`의 `Promise.all` 로드를 try-catch로 감싸고, 실패한 variant는 시스템 폰트(`sans-serif`)로 대체한다.

```ts
const loadedFonts = await Promise.allSettled(fontFaces.map((f) => f.load()));
loadedFonts.forEach((result, i) => {
  if (result.status === "fulfilled") document.fonts.add(fontFaces[i]);
  // rejected: fontFamily fallback은 CSS cascade에서 sans-serif로 자동 처리
});
```

### NFR-U1C-MAINT-1 — 토큰 하드코딩 금지

모든 `.css.ts` 파일은 `import { vars } from "@/styles/theme.css"` 후 `vars.color.*`, `vars.typeScale.*`, `vars.shape.*`, `vars.elevation.*`만 사용한다.  
`ExportCard`의 캡처 전용 div는 DOM에 인라인 스타일이 필요하므로, `theme.css.ts`에서 JS 상수로도 값을 export한다.

```ts
// theme.css.ts 하단 추가
export const rawTokens = {
  color: {
    primary: "#1A73E8",
    secondary: "#34A853",
    onSurface: "#202124",
    onSurfaceVariant: "#5F6368",
    outlineVariant: "#DADCE0",
    surface: "#FFFFFF",
  },
} as const;
```

### NFR-U1C-MAINT-2 — EcoFontVariant 단일 정의

`EcoFontVariant`와 `ConversionResult`는 `src/context/ConversionContext.tsx`에서만 정의하고 named export한다.  
`FontCard`, `FontGrid`, `ExportCard` 등 모두 이 파일에서 import한다.

---

## 2. 의존성 추가

| 패키지 | 버전 | 용도 |
|--------|------|------|
| `html2canvas` | `^1.4.1` | DOM → Canvas 캡처 |

```bash
pnpm --filter frontend add html2canvas
pnpm --filter frontend add -D @types/html2canvas  # 타입이 번들에 포함된 경우 불필요
```

> `html2canvas` 1.4.x는 자체 타입 정의를 포함한다. `@types/html2canvas`는 설치 불필요.

---

## 3. 결정 요약

| NFR ID | 구현 방식 |
|--------|---------|
| PERF-1 | `Promise.all(FontFace.load[])` 병렬 로드 — FontGrid 레벨 |
| PERF-2 | `useExportImage`에서 `document.fonts.ready` await |
| PERF-3 | `FontCard.css.ts` `minHeight: "280px"` 고정 |
| A11Y-1 | `<article aria-label="변형 N 에코폰트">` |
| A11Y-2 | 버튼 `aria-label="변형 N TTF/이미지 다운로드"` |
| A11Y-3 | `disabled={isExporting}` + `aria-busy={isExporting}` |
| COMPAT-1 | `FontCard`에서 try-catch → 인라인 에러 메시지 |
| COMPAT-2 | `Promise.allSettled` + CSS cascade 폴백 |
| MAINT-1 | `.css.ts`는 `vars.*` 참조 + `rawTokens` JS 상수 병행 export |
| MAINT-2 | `EcoFontVariant` 단일 정의 in `ConversionContext.tsx` |
