# Business Rules — Unit 1a

## 파일 업로드
- BR-1: `.ttf` 확장자 파일만 허용 (대소문자 무관)
- BR-2: 파일은 한 번에 1개만 선택 가능
- BR-3: 파일이 선택되지 않은 상태에서 변환 버튼은 disabled

## 변환 트리거
- BR-4: 변환 중(`isLoading=true`)에는 버튼 중복 클릭 불가
- BR-5: 변환 실패 시 에러 메시지를 버튼 아래 인라인으로 표시하고 업로드 페이지에 머무름
- BR-6: 에러 메시지는 새 파일 선택 또는 재시도 시 초기화

## 결과 페이지 접근
- BR-7: `/result` 진입 시 ConversionContext에 result가 없으면 `/`로 리다이렉트

## 폰트 미리보기
- BR-8: 원본/변환 폰트 각각 고유한 이름으로 FontFace 레지스트리에 등록 (`eco-original`, `eco-converted`)
- BR-9: 컴포넌트 언마운트 시 FontFace 레지스트리에서 제거, Blob URL 해제

## 인터랙티브 미리보기 입력
- BR-14: FontComparison 상단에 원본/변환 패널을 나란히 표시하고, 하단에 텍스트 입력 박스를 배치
- BR-15: 텍스트 입력 박스의 초기값은 `copy.result.comparison.sample` (기본 샘플 문구)
- BR-16: 사용자가 입력 박스에 타이핑하면 두 패널이 동일한 텍스트를 각자의 폰트로 실시간 렌더링
- BR-17: 입력 박스가 비어 있을 때 두 패널에는 `copy.result.comparison.sample` 문구를 회색(placeholder 색상)으로 표시

## 다운로드
- BR-10: convertedBlob이 없을 때 다운로드 버튼은 disabled
- BR-11: 다운로드 파일명은 `eco_{원본파일명}` 형식

## Mock 전용
- BR-12 (Mock): convertFont 함수는 원본 File을 Blob으로 그대로 반환 (1.5초 지연)
- BR-13 (Mock): Unit 1b에서 실 API로 교체 시 이 규칙은 제거
