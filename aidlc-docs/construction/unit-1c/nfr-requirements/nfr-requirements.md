# Unit 1c: NFR Requirements

> **단계**: CONSTRUCTION / NFR Requirements
> **유닛**: Unit 1c (Frontend UI Redesign + Export)
> **담당**: 이정선 / 류동현

---

## 1. 범위

Unit 1c에서 신규 도입되는 기능(다중 폰트 그리드, html2canvas export)과 MD3 전환에서 발생하는 비기능 요구사항을 정의한다.

---

## 2. NFR 목록

### 성능 (PERF)

| ID | 요구사항 | 측정 기준 |
|----|---------|---------|
| NFR-U1C-PERF-1 | result 페이지 진입 후 10개 FontFace 로드 완료까지 **3초 이내** | `document.fonts.ready` resolve 시간 (Chrome DevTools 기준) |
| NFR-U1C-PERF-2 | 이미지 export 버튼 클릭 후 PNG 다운로드 시작까지 **5초 이내** | 버튼 클릭 → `<a>` click 트리거까지 |
| NFR-U1C-PERF-3 | FontCard 10개 렌더링 시 레이아웃 시프트(CLS) 없음 | 각 카드 높이를 CSS로 고정 (min-height 지정) |

### 접근성 (A11Y)

| ID | 요구사항 | 측정 기준 |
|----|---------|---------|
| NFR-U1C-A11Y-1 | FontGrid의 각 FontCard에 `aria-label="변형 N 에코폰트"` 제공 | 스크린리더 읽기 확인 |
| NFR-U1C-A11Y-2 | TTF 저장 / 이미지 저장 버튼에 명확한 `aria-label` 제공 (예: "Variant 1 TTF 다운로드") | 버튼 텍스트 or aria-label 존재 여부 |
| NFR-U1C-A11Y-3 | 이미지 export 중(`isExporting=true`) 버튼 `disabled` 처리 + aria-busy 표시 | DOM 확인 |

### 호환성 (COMPAT)

| ID | 요구사항 | 측정 기준 |
|----|---------|---------|
| NFR-U1C-COMPAT-1 | html2canvas 미지원 환경에서 export 버튼 클릭 시 에러 토스트 표시 (크래시 금지) | try-catch 처리 여부 |
| NFR-U1C-COMPAT-2 | FontFace API 미지원 브라우저에서 폰트 미리보기 폴백 — 시스템 폰트로 대체 표시 | `CSS.supports('font-display', 'swap')` 체크 불필요, try-catch로 충분 |

### 유지보수성 (MAINT)

| ID | 요구사항 | 측정 기준 |
|----|---------|---------|
| NFR-U1C-MAINT-1 | 모든 색상·타이포·shape 값은 `theme.css.ts` 변수를 통해서만 참조 (인라인 하드코딩 금지) | 코드 리뷰 시 `#` 색상값 직접 사용 여부 확인 |
| NFR-U1C-MAINT-2 | `EcoFontVariant` 타입은 `ConversionContext.tsx` 한 곳에서만 정의 | export 경로 단일화 |

---

## 3. 측정 계획

NFR-U1C-PERF-1·2는 Build & Test 단계에서 개발 서버(`pnpm dev`) 기준으로 수동 측정한다.  
NFR-U1C-A11Y-1·2·3은 결과 페이지 DOM 확인으로 검증한다.  
NFR-U1C-COMPAT-1은 `html2canvas`를 `null`로 mock하여 수동 검증한다.
