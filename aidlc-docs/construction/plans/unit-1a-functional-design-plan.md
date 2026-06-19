# Unit 1a Functional Design Plan

**Unit**: Unit 1a — Frontend UI 완성  
**담당**: 이정선 (주), 류동현 (지원)  
**범위 (Week 2)**: 원본/변환 비교 미리보기 UI (mock API 연결)

---

## 설계 배경

기존 구현 상태:

- `FileUploadComponent` — 완료 (파일 검증, drag&drop)
- `ConversionTriggerComponent` (StartConversionButton) — 부분 구현 (로딩 상태만, API 연결 없음)
- `ResultDisplayComponent` (FontComparison, ResultMetrics) — 하드코딩 상태
- `DownloadComponent` — disabled 상태

Week 2 목표: mock API를 통해 업로드 → 변환 중 → 결과 화면까지 전체 UI 플로우 동작

---

## 질문 파일

아래 질문에 답변해 주세요. 각 `[Answer]:` 태그 뒤에 선택 알파벳을 입력하면 됩니다.

---

## Question 1

변환 결과(원본 File + 변환된 Blob)를 업로드 페이지(`/`)에서 결과 페이지(`/result`)로 어떻게 전달할까요?

A) React Context (`ConversionProvider`) — 앱 전체를 감싸는 전역 상태로 공유. 실제 API 연동(Unit 1b)으로 교체할 때 context 내부만 바꾸면 됨  
B) `sessionStorage` — 페이지 이동 시 직렬화하여 저장. Context 없이 단순하지만 File/Blob 직렬화 제약 있음  
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

Mock API를 어디에 위치시킬까요?

A) Next.js Route Handler (`app/api/convert/route.ts`) — 실제 백엔드 API와 동일한 인터페이스(`POST /api/convert`, FormData). Unit 1b에서 fetch URL만 교체하면 실 API로 전환 가능  
B) 클라이언트 측 mock 함수 (`src/mocks/convertFont.ts`) — 네트워크 요청 없이 즉시 응답. 서버 없이 순수 프론트엔드에서만 동작  
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 3

`FontComparison` 컴포넌트에서 원본/변환 `.ttf` 파일을 브라우저에서 렌더링하는 방식은?

A) `FontFace` API — `new FontFace(name, url)` + `document.fonts.add()` 로 동적 로딩. 브라우저 폰트 레지스트리에 등록하여 `font-family` CSS로 적용  
B) 동적 `<style>` 태그 주입 — `@font-face { src: url(blobUrl) }` 를 `<style>` 요소로 head에 삽입  
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

변환 실패(네트워크 오류, 파일 파싱 실패 등) 시 에러 UI를 어떻게 표시할까요?

A) 인라인 메시지 — 변환 버튼 아래에 에러 문구 표시, 업로드 페이지에 머무름  
B) 로딩 오버레이에 에러 상태 추가 — `LoadingOverlay`가 에러 상태일 때 다른 UI(메시지 + 재시도 버튼)를 표시  
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

답변 완료 후 "답변 완료" 라고 알려주세요.
