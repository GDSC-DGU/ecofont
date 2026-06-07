# Eco-Font AI Engine (Unit 3)

> **담당**: 이우제 (OptimizationEngine) · 류동현 (OCRValidationPipeline)
> **상태**: 시작 전 — Backend(Unit 2)는 stub identity adapter로 통합 대기 중
> **설계 출처**:
> - `aidlc-docs/inception/application-design/unit-of-work.md` §Unit 3
> - `aidlc-docs/construction/unit-2/functional-design.md` §5.5 (Backend↔AI 인터페이스 합의 사항)

---

## 1. 이 디렉토리에서 만들 것 (2가지)

### A. OptimizationEngine (이우제)
TTF 글리프 벡터를 받아 **잉크 절약형으로 변환**해서 돌려주는 핵심 알고리즘.
- 알고리즘: **SSIM 손실 함수 최소화** (논문/구현체 자유)
- 입력/출력: `GlyphData` (스펙 §3 참조)
- 외부에 노출되는 함수: `optimize_glyphs`

### B. OCRValidationPipeline (류동현)
변환 전후 글리프를 렌더링해 OCR로 인식률 비교 → **모델 품질 검증 도구**.
- 실 서비스 호출 흐름에는 **노출되지 않음** (FR-4: 내부 검증 전용)
- OCR 모델 후보: Tesseract / EasyOCR / PaddleOCR — 비교 후 선택
- 목표 인식률: 변환 후 95% 이상 (모델 품질 지표)

---

## 2. 시작 가이드 (어디서 어떻게)

### 2.1 디렉토리 위치
**여기.** `apps/ai-engine/`. Frontend/Backend와 같은 모노레포 안.

### 2.2 권장 패키지 구조 (자유롭게 조정 가능)
```
apps/ai-engine/
├── pyproject.toml                 # uv workspace member, Backend와 같은 도구체인
├── README.md                      # 본 파일
├── ai_engine/                     # ← Backend가 import할 패키지 이름
│   ├── __init__.py
│   ├── optimization.py            # ⚠️ optimize_glyphs 함수 노출 (§3.1)
│   ├── ocr_validation.py          # 동현 작업
│   └── (모델·유틸·실험 코드 자유 구성)
└── notebooks/                     # 실험·튜닝용 (선택)
```

> **이름이 중요**: 패키지 이름은 반드시 **`ai_engine`** (하이픈 아님). Backend가 `from ai_engine.optimization import optimize_glyphs`로 import 예정.

### 2.3 pyproject.toml 템플릿 (Backend와 일관)
```toml
[project]
name = "ecofont-ai-engine"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "numpy>=2.1",
    "scipy>=1.14",
    # SSIM: scikit-image 또는 직접 구현
    "scikit-image>=0.24",
    # OCR (동현 부분, 선택된 모델로 교체)
    # "easyocr>=1.7",
]

[dependency-groups]
dev = ["ruff>=0.7", "pyright>=1.1.385"]

[tool.uv]
package = true

[tool.hatch.build.targets.wheel]
packages = ["ai_engine"]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

### 2.4 로컬 환경
```bash
cd apps/ai-engine
uv sync
uv run python -m ai_engine.optimization  # 직접 실행 테스트 (스크립트 추가 시)
```

---

## 3. Backend와의 인터페이스 (변경 금지 — 합의 사항)

### 3.1 노출해야 할 함수

```python
# apps/ai-engine/ai_engine/optimization.py
from app.domain.models import GlyphData

def optimize_glyphs(glyphs: GlyphData) -> GlyphData:
    """SSIM 손실 함수 최소화로 잉크 절약형 글리프 생성.

    Args:
        glyphs: 원본 글리프 벡터 컬렉션 (GlyphData)

    Returns:
        최적화된 글리프 벡터 컬렉션 (GlyphData) — 같은 구조, 좌표만 변경
    """
    ...
```

- **시그니처 동기 함수**로 두는 게 권장 (`async def` 불필요). Backend가 `asyncio.to_thread`로 워커 스레드에서 호출.
- 예외 발생 시 그대로 raise → Backend가 잡아서 Job `failed` 처리.

### 3.2 GlyphData 스펙

`app/domain/models.py` (Backend) 정의를 그대로 import해서 사용:

```python
@dataclass(frozen=True)
class Contour:
    coordinates: tuple[tuple[float, float], ...]
    end_indices: tuple[int, ...]

@dataclass(frozen=True)
class GlyphData:
    glyphs: dict[str, tuple[Contour, ...]]  # glyph name → contours
    units_per_em: int
```

- `glyphs` 키: 글리프 이름 문자열 (예: `"A"`, `"uni0041"`)
- `coordinates`: 외곽선 점들의 (x, y) 튜플
- `units_per_em`: 폰트 단위 기준 (보통 1000 또는 2048)
- **불변(frozen)**: 원본을 수정하지 말고 **새 객체를 반환**

### 3.3 Backend가 호출하는 곳

`apps/backend/app/adapters/outbound/inprocess_ai_engine.py`:
```python
# 현재 (stub): identity 반환
def _optimize_sync(glyphs):
    return glyphs

# 우제 모듈 완성 후 교체:
from ai_engine.optimization import optimize_glyphs
def _optimize_sync(glyphs):
    return optimize_glyphs(glyphs)
```

이 한 줄 교체 + import만으로 통합 완료. **Backend 다른 코드 수정 불필요.**

---

## 4. 통합 시점 체크리스트

우제 모듈이 준비되면:

1. [ ] `apps/ai-engine/pyproject.toml` 작성, `ai_engine.optimization.optimize_glyphs` export
2. [ ] 루트 `pyproject.toml` 또는 Backend의 `pyproject.toml`에 workspace member로 등록 (uv workspace)
3. [ ] `apps/backend/app/adapters/outbound/inprocess_ai_engine.py` 의 `_optimize_sync` 를 위 시그니처로 교체
4. [ ] `cd apps/backend && uv sync` 로 새 의존성 반영
5. [ ] 로컬에서 `POST /convert` 호출해서 E2E 동작 확인
6. [ ] Docker 빌드도 ai-engine 포함하도록 빌드 컨텍스트 조정 (필요 시 Dockerfile 수정)

---

## 5. OCR 검증 파이프라인 (동현)

별도 함수로 분리 — 실 서비스 호출 흐름에는 노출 금지.

```python
# apps/ai-engine/ai_engine/ocr_validation.py

def validate(original: GlyphData, optimized: GlyphData) -> ValidationReport:
    """변환 전후 OCR 인식률 비교."""
    ...
```

- 호출 시점: 개발·튜닝 단계 (CLI 스크립트, notebook, 또는 별도 검증 작업)
- `POST /convert` 흐름에는 포함 안 함 (FR-4)
- OCR 모델 선정 결과(Tesseract/EasyOCR/PaddleOCR)는 본 README 또는 별도 문서에 기록

---

## 6. 관련 Open Items (협의 필요)

| ID | 항목 | 협의 대상 |
|----|------|----------|
| **Open-1** | 잉크 절약률 산출 방법 — Backend MetricsCalculator가 어떤 지표로 계산할지 | 이소은 + 이우제 |
| **Open-2** | CO2 환산 계수 (잉크량 → g) | 이소은 (논문 근거) |
| OCR 언어 범위 | 한글·영문·소수민족 언어 어디까지 검증할지 | 류동현 |

Open-1은 우제의 최적화 결과 형태에 따라 달라짐 → **우제가 첫 프로토타입 만든 직후 협의** 권장.

---

## 7. 시작 명령 한 줄

```bash
cd apps/ai-engine && touch pyproject.toml ai_engine/__init__.py ai_engine/optimization.py
```

그리고 위 §3.1 시그니처부터 채워서 identity가 아닌 진짜 SSIM 기반 변환을 구현하면 됩니다.

질문 생기면 본 README + Functional Design v2 (§5.5) 먼저 확인 → 그래도 모호하면 소은한테.
