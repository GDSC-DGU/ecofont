# Eco-Font 인프라 발표 자료 (이소은)

> 발표용 슬라이드 내용. 2페이지 — ① GCP + Terraform + Claude Code, ② OIDC/WIF.
> 실제 프로젝트(`ecofont-re`) 구성 기준.

---

## 📄 Page 1 — GCP + Terraform 조합, 그리고 Claude Code 병행

### 무엇을 만들었나 (한 줄)
사용자가 올린 TTF를 변환하는 백엔드를 **GCP 위에 Terraform 코드로** 통째로 정의·배포.

### GCP 구성 (서버리스 중심)
- **Cloud Run** — 백엔드 컨테이너 실행 (요청 없으면 인스턴스 0개 → idle 비용 $0)
- **Cloud Storage(GCS)** — 입력/출력 폰트 저장 (Lifecycle 1일 자동 삭제)
- **Artifact Registry** — 컨테이너 이미지 저장소
- **IAM / Service Account** — 최소 권한 원칙
- → "GCP 기술 1개 이상 필수" 제약을 Cloud Run + GCS로 충족

### 왜 Terraform (IaC) 인가
- **인프라를 코드로**: 클릭 대신 `.tf` 파일 → Git으로 버전 관리·리뷰·롤백
- **재현성**: `terraform apply` 한 번에 동일 환경 재생성 (사람마다 다른 수동 설정 X)
- **변경 추적**: `terraform plan`이 "무엇이 바뀌는지" 미리 보여줌 → 사고 방지
- **상태(state) 관리**: GCS 버킷에 원격 저장 → 팀 공유·충돌 방지

### Claude Code 병행 시 유용했던 점 ⭐ (실제 경험)
- **부트스트랩 자동화**: 빌링 연결 → API 활성화 → 상태 버킷 생성 → `apply`까지 순서대로 실행·검증
- **Provider 호환성 디버깅**: `google ~> 5.0`에서 미지원인 속성(`deletion_protection`)을 잡아 수정
- **인증 문제 진단**: gcloud CLI 계정과 Terraform ADC 계정 불일치(403) 원인을 즉시 특정
- **검증까지 한 번에**: 배포 후 `/health`·CORS·이미지 태그를 실제로 호출해 동작 확인
- **문서·코드 동기화**: 변경할 때마다 README·상태 문서(SSOT)를 같이 갱신
- **핵심**: 사람은 "무엇을/왜"를 결정, 반복적인 "어떻게(명령·문법·검증)"는 위임 → 빠르고 실수 적음

### 발표 멘트 예시
> "인프라를 콘솔에서 클릭으로 만들면 누가 무엇을 바꿨는지 추적이 안 됩니다. Terraform으로 코드화하니 Git 리뷰가 되고, Claude Code와 함께 쓰니 명령·문법·검증 같은 반복 작업을 맡기고 저는 설계 결정에 집중할 수 있었습니다."

---

## 📄 Page 2 — OIDC / Workload Identity Federation (CI/CD 인증)

### 배경: CI에서 GCP에 어떻게 로그인하지?
GitHub Actions가 이미지를 빌드해 Cloud Run에 자동 배포하려면 **GCP 인증**이 필요.

### 전통적 방식의 문제 — 서비스 계정 키(JSON)
- 장기 유효한 **비밀키 파일**을 GitHub Secret에 저장
- 유출되면? → 누구나 그 키로 우리 GCP 접근 (만료가 없어 위험 지속)
- 키 교체(rotation) 수동 관리 부담

### 해결: OIDC 기반 Workload Identity Federation (키리스)
- **비밀키 자체가 없음.** GitHub Actions가 실행 시 **단기 OIDC 토큰**을 발급받아 GCP와 교환
- 동작 흐름:
  1. GitHub Actions → 짧은 수명의 OIDC 토큰 발급
  2. GCP의 Workload Identity Pool이 토큰 검증
  3. **조건 만족 시에만** 배포용 SA로 단기 자격증명 발급
- **조건(attribute condition)**: `repository == "GDSC-DGU/ecofont"` → **우리 저장소에서 온 요청만** 허용

### 유용한 점 / 보안 이점 ⭐
- **장기 비밀키 0개** → 유출 위험 원천 제거
- **토큰이 짧게 살고 자동 만료** → 탈취돼도 곧 무효
- **저장소 단위로 잠금** → 다른 repo가 토큰 흉내 내도 거부
- **최소 권한**: 배포 전용 SA에 딱 필요한 권한만 (이미지 push + Cloud Run 배포 + 런타임 SA 사용)
- **키 교체 관리 불필요** → 운영 부담↓

### 발표 멘트 예시
> "CI에 서비스 계정 키를 넣는 건 만료 없는 비밀번호를 코드 저장소 옆에 두는 것과 같습니다. OIDC 연합을 쓰면 키 없이, 배포할 때만 잠깐 발급되는 토큰으로 인증하고, 그것도 '우리 저장소에서 온 요청'일 때만 통과시킵니다. 키 유출 사고를 구조적으로 막는 방식입니다."

### (선택) 한 줄 다이어그램
```
GitHub Actions ──OIDC 토큰──▶ GCP Workload Identity Pool
                                   │ (repo 조건 검증)
                                   ▼
                          배포 SA 단기 자격증명 ──▶ Cloud Run 배포
```
