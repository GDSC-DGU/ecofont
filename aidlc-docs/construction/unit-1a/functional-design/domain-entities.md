# Domain Entities — Unit 1a

## ConversionResult

변환 완료 후 Context에 저장되는 핵심 데이터 구조.

```typescript
type ConversionResult = {
  originalFile: File;          // 사용자가 업로드한 원본 .ttf
  convertedBlob: Blob;         // 변환된 .ttf (mock: 원본과 동일)
  convertedFileName: string;   // 예: "eco_NotoSans.ttf"
}
```

## ConversionContextValue

ConversionContext가 제공하는 인터페이스.

```typescript
type ConversionContextValue = {
  result: ConversionResult | null;
  setResult: (result: ConversionResult) => void;
}
```

## useConvertFont 반환값

```typescript
type UseConvertFontResult = {
  convert: (file: File) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}
```

## convertFont (mock 함수) 시그니처

```typescript
// src/mocks/convertFont.ts
async function convertFont(file: File): Promise<Blob>
```

Unit 1b에서 실 API 연동 시 동일한 시그니처를 유지하여 hook 교체 최소화.
