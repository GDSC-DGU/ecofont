# Unit of Work Story Map

## 기능 요구사항 → 유닛 매핑

| 요구사항 | 내용 | Unit 1a | Unit 1b | Unit 2 | Unit 3 | Unit 4 |
|----------|------|:-------:|:-------:|:------:|:------:|:------:|
| FR-1 | 폰트 업로드 (drag&drop, TTF 검증) | ✓ | | ✓ | | |
| FR-2 | 에코폰트 변환 (FontTools + SSIM + TTF 생성) | | | ✓ | ✓ | |
| FR-3 | 잉크 절약률 / 탄소 저감량 계산 | | | ✓ | | |
| FR-4 | OCR 가독성 검증 (내부 전용) | | | | ✓ | |
| FR-5 | 결과 화면 (수치 표시, 미리보기, 다운로드) | ✓ | ✓ | ✓ | | |
| FR-6 | 에러 처리 (변환 실패 메시지) | ✓ | ✓ | ✓ | | |
| FR-7 | 로딩 UI (콜드 스타트 안내 오버레이) | ✓ | ✓ | | | |
| NFR-2 | GCS 1일 자동 삭제 (저작권 보호) | | | | | ✓ |
| NFR-5 | Cloud Run + GCS 배포 | | | | | ✓ |

## 유닛별 담당 요구사항 요약

### Unit 1a — Frontend UI 완성
- FR-1: 파일 업로드 UI (이정선 / Week 1)
- FR-5: 결과 화면 mock 데이터 연결 (이정선 / Week 2~3)
- FR-6: 에러 상태 UI (이정선 / Week 3)
- FR-7: 로딩 오버레이 (류동현 / Week 1)

### Unit 1b — Frontend API 연동
- FR-1: 업로드 파일을 Backend로 전송 (이정선 / Week 3)
- FR-5: 실데이터 연결, 다운로드 URL 활성화 (이정선·류동현 / Week 3~4)
- FR-6: API 에러 처리 (이정선 / Week 4)
- FR-7: 실제 변환 시간 기반 로딩 상태 (이정선 / Week 3)

### Unit 2 — Backend / Font Processing
- FR-1: TTF 파일 수신 및 GCS 저장 (이소은 / Week 1~2)
- FR-2: FontTools 글리프 파싱, AI Engine 호출, 변환 TTF 생성 (이소은 / Week 2~3)
- FR-3: 잉크 절약률·탄소 저감량 계산 (이소은 / Week 3)
- FR-5: 변환 결과 응답 (이소은 / Week 3)
- FR-6: 변환 실패 에러 응답 (이소은 / Week 3)

### Unit 3 — AI Engine
- FR-2: SSIM 기반 글리프 최적화 (이우제 / Week 1~3)
- FR-4: OCR 검증 파이프라인 (류동현 / Week 2~3, 내부 전용)

### Unit 4 — Infrastructure
- NFR-2: GCS Lifecycle 1일 자동 삭제 (이소은 / Week 1)
- NFR-5: Cloud Run + GCS 프로비저닝 (이소은 / Week 1, 최종 Week 4)
