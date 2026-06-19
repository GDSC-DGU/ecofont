# Unit Test Instructions — Unit 1a (Frontend)

## 현재 상태

Unit 1a에는 별도의 테스트 프레임워크(Jest, Vitest 등)가 설정되어 있지 않습니다.
아래는 Week 2 완료 기준 검증을 위한 **수동 단위 검증 항목**과,
이후 자동화 테스트 추가 시 작성해야 할 테스트 명세입니다.

---

## 수동 검증 — 핵심 로직

### `convertFont` (mock)
- [ ] `.ttf` 파일 입력 시 약 1.5초 후 Blob 반환 확인
- [ ] 반환된 Blob의 `type`이 `"font/ttf"` 인지 확인

### `useFontFaceLoader`
- [ ] `source`가 `null`일 때 `false` 반환 확인
- [ ] 유효한 Blob 입력 시 FontFace 등록 후 `true` 반환 확인
- [ ] 컴포넌트 언마운트 시 `document.fonts`에서 제거됐는지 확인

### `useConvertFont`
- [ ] `convert(file)` 호출 시 `isLoading`이 `true`로 전환 확인
- [ ] 성공 시 `ConversionContext.result` 설정 및 `/result` 이동 확인
- [ ] 실패 시 `error` 메시지 표시 및 업로드 페이지 유지 확인

### `ConversionContext`
- [ ] `ConversionProvider` 외부에서 `useConversion()` 호출 시 에러 throw 확인
- [ ] `setResult` 호출 후 `result` 업데이트 확인

---

## 자동화 테스트 추가 시 명세 (Vitest + Testing Library 권장)

```typescript
// src/hooks/useConvertFont.test.ts
describe('useConvertFont', () => {
  it('convert 호출 시 isLoading이 true가 된다')
  it('성공 시 context에 result가 저장된다')
  it('실패 시 error 메시지가 설정된다')
})

// src/hooks/useFontFaceLoader.test.ts
describe('useFontFaceLoader', () => {
  it('source가 null이면 false를 반환한다')
  it('FontFace 로드 완료 시 true를 반환한다')
  it('언마운트 시 FontFace가 document.fonts에서 제거된다')
})

// src/mocks/convertFont.test.ts
describe('convertFont', () => {
  it('File을 입력받아 Blob을 반환한다')
  it('반환 Blob의 type은 font/ttf이다')
})
```

## 자동화 테스트 환경 설정 방법 (향후)

```bash
# Vitest + Testing Library 추가
cd apps/frontend
pnpm add -D vitest @testing-library/react @testing-library/user-event jsdom

# package.json scripts에 추가
"test": "vitest"
```
