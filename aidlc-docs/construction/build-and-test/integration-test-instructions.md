# Integration Test Instructions — Unit 1a (Frontend)

## 목적

업로드 → 변환 중 → 결과 표시 → 다운로드 전체 UI 플로우가
mock 데이터 기반으로 독립적으로 동작하는지 검증합니다.

---

## 수동 통합 테스트 (브라우저)

### 사전 준비

```bash
cd apps/frontend
pnpm dev
# http://localhost:3000 접속
```

테스트에 사용할 샘플 `.ttf` 파일 준비 (예: NotoSans.ttf, 10MB 이하)

---

### 시나리오 1: 정상 변환 플로우

| # | 액션 | 기대 결과 |
|---|------|---------|
| 1 | `/` 페이지 접속 | 업로드 UI 표시 |
| 2 | `.ttf` 파일 드래그&드롭 또는 선택 | 파일명 표시, "잉크 다이어트 시작" 버튼 활성화 |
| 3 | "잉크 다이어트 시작" 클릭 | LoadingOverlay 표시, 버튼 disabled |
| 4 | 1.5초 후 | `/result` 페이지로 자동 이동 |
| 5 | 결과 페이지 확인 | FontComparison 패널 2개, 입력 박스, 다운로드 버튼 표시 |
| 6 | 입력 박스에 텍스트 입력 | 양쪽 패널이 동일 텍스트를 각자 폰트로 실시간 렌더링 |
| 7 | 입력 박스 비움 | 양쪽 패널에 회색 placeholder 텍스트 표시 |
| 8 | "다이어트 TTF 다운로드" 클릭 | `eco_{원본파일명}.ttf` 다운로드 시작 |

---

### 시나리오 2: 결과 페이지 직접 접속 (리다이렉트)

| # | 액션 | 기대 결과 |
|---|------|---------|
| 1 | `/result` 직접 URL 입력 | 즉시 `/`로 리다이렉트 |

---

### 시나리오 3: 잘못된 파일 업로드

| # | 액션 | 기대 결과 |
|---|------|---------|
| 1 | `.pdf`, `.otf` 등 비TTF 파일 선택 | "TTF 파일만 업로드할 수 있습니다." 에러 표시 |
| 2 | 파일 2개 동시 드롭 | "파일은 하나만 선택할 수 있습니다." 에러 표시 |

---

## E2E 자동화 (향후 — Playwright 권장)

```typescript
// e2e/conversion-flow.spec.ts
test('정상 변환 플로우', async ({ page }) => {
  await page.goto('/');
  await page.setInputFiles('[data-testid="file-upload-input"]', 'fixtures/sample.ttf');
  await page.click('[data-testid="start-conversion-button"]');
  await page.waitForURL('/result');
  await expect(page.locator('[data-testid="font-comparison-original"]')).toBeVisible();
  await expect(page.locator('[data-testid="font-comparison-converted"]')).toBeVisible();
});

test('결과 페이지 직접 접속 시 리다이렉트', async ({ page }) => {
  await page.goto('/result');
  await expect(page).toHaveURL('/');
});

test('인터랙티브 미리보기 입력', async ({ page }) => {
  // ... 정상 변환 후
  await page.fill('[data-testid="font-comparison-input"]', 'Hello World');
  await expect(page.locator('[data-testid="font-comparison-original"]')).toContainText('Hello World');
  await expect(page.locator('[data-testid="font-comparison-converted"]')).toContainText('Hello World');
});
```
