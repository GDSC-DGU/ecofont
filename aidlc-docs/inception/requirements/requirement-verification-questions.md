# Requirements Verification Questions

vision_document.md, tech_stack.md, task_assignment.md를 통해 대부분의 요구사항이 확인됐습니다.
아래 항목들만 추가로 확인이 필요합니다. [Answer]: 태그에 선택지 알파벳을 입력해주세요.

---

## Question 1
변환 실패 시 (서버 오류, 타임아웃 등) 사용자에게 어떻게 안내할 건가요?

A) 에러 메시지를 화면에 표시하고 재시도 버튼 제공
B) 에러 메시지만 표시 (재시도 버튼 없음, 사용자가 다시 업로드)
C) 이전 업로드 화면으로 자동 리다이렉트
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2
OCR 가독성 검증에서 인식률이 95% 미달일 때 어떻게 처리할 건가요?

A) 변환 결과를 반환하되 경고 메시지 표시 ("가독성 기준 미달, 사용에 주의")
B) 변환 자체를 실패로 처리하고 사용자에게 알림
C) OCR 검증 없이 무조건 변환 결과 반환 (MVP에서는 검증 생략)
X) Other (please describe after [Answer]: tag below)

[Answer]: OCR 인식률은 변환 모델의 성능을 검증할 때만 사용하고, 실 서비스에서는 OCR가독성 검증을 하지 않는걸로 생각중

---

## Question 3
잉크 절약률 20% 미달 시 처리 방식은?

A) 그래도 변환 결과 반환 (절약률이 낮더라도 사용자에게 제공)
B) 변환 실패로 처리하고 사용자에게 알림
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4
GCS에 업로드되는 파일명 중복은 어떻게 처리할 건가요?

A) UUID 또는 타임스탬프를 파일명에 붙여 항상 고유하게 저장
B) 동일 파일명이면 덮어쓰기
X) Other (please describe after [Answer]: tag below)

[Answer]: 일단 결정 보류

---

## Question 5
프론트엔드 → 백엔드 API 호출 방식은?

A) 단순 REST (POST /convert 단건 요청, 변환 완료까지 동기 대기)
B) 비동기 폴링 (POST /convert 후 job ID 받아 주기적으로 상태 조회)
C) WebSocket (변환 진행률 실시간 수신)
X) Other (please describe after [Answer]: tag below)

[Answer]: 결정 보류

---

## Question 6 — Security Extension
이 프로젝트에 보안 규칙(Security Baseline)을 강제 적용할 건가요?

A) Yes — 모든 보안 규칙을 blocking 제약으로 적용 (프로덕션 수준 권장)
B) No — 보안 규칙 생략 (PoC·프로토타입·MVP 수준에 적합)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 7 — Property-Based Testing Extension
속성 기반 테스트(Property-Based Testing) 규칙을 적용할 건가요?

A) Yes — 전체 적용 (비즈니스 로직, 데이터 변환, 직렬화 포함)
B) Partial — 순수 함수 및 직렬화 라운드트립에만 적용
C) No — 생략 (MVP 일정 우선, 테스트 미작성 기존 결정 유지)
X) Other (please describe after [Answer]: tag below)

[Answer]: C
