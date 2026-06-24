# Eco-Font Backend 이식 가이드 — 우제 Cherokee 폰트 생성 API

> **상태 (2026-06-24 팀 합의)**: 우제가 만든 Cherokee 폰트 생성 FastAPI가 기존 `apps/backend`(Unit 2 비동기 오케스트레이터)를 **통째 대체**한다. 프론트가 직접 호출하는 메인 엔드포인트가 우제 API가 된다.
>
> 이 문서는 우제 코드를 레포에 이식할 때 **무엇을 가져오고 / 버리고 / 맞추는지**를 명시한다.
> 옛 `optimize_glyphs(GlyphData) -> GlyphData` in-process 라이브러리 합의는 **폐기**됐다.

---

## 1. 확정된 결정

| 항목 | 결정 |
|------|------|
| 통합 형태 | 우제 API가 `apps/backend`를 **통째 대체** (별도 마이크로서비스 아님 — 서버 하나) |
| 엔드포인트 | `POST /v1/font-generation/ttf` (프론트가 직접 호출) |
| 응답 방식 | **동기 단일 응답** — 한 번의 POST로 `status:"completed"`까지. 비동기 job 폴링 **폐기** |
| 도메인 | **Cherokee 전용** — cmap으로 자동 판정, 아니면 422 |
| 결과 전달 | `candidates[]` 20개 + zip/manifest/preview, 상대경로 URL `/v1/assets/{job_id}/...` |
| asset 저장 | **GCS** (로컬 디스크 금지 — §4 참조) |
| 업로드 한도 | 50MB (413) |

전체 클라이언트 계약은 **§7 부록**에 박제.

---

## 2. 가져올 것 (우제 코드에서 이식)

- FastAPI 앱 전체: cmap Unicode coverage 판정 → Cherokee 여부 → eco 후보 20개 생성 → OCR 평가 → 응답 조립
- `POST /v1/font-generation/ttf` 핸들러
- `GET /v1/assets/{job_id}/...` 다운로드 핸들러 — **단, 저장소를 로컬 파일시스템 → GCS로 교체** (§4)

## 3. 버릴 것 (기존 `apps/backend`에서 안 가져옴)

- 비동기 job/폴링 일체: `GET /jobs/{id}`, `MemoryJobStoreAdapter`, Job 스키마 4종(Pending/Processing/Done/Failed), `ConvertFontUseCase`의 `asyncio.create_task` 골격, `main.py`의 graceful shutdown job 마킹
- AI 엔진 포트/스텁: `app/ports/ai_engine.py`, `app/adapters/outbound/inprocess_ai_engine.py` (`optimize_glyphs` 합의 폐기)
- 단일 결과 계약: `ConvertResultBody`, 기존 `POST /convert`

---

## 4. GCS 배선 (이미 준비됨 → `apps/backend/app/adapters/outbound/gcs_assets.py`)

**왜 GCS인가** — Cloud Run은 stateless·multi-instance·ephemeral이다. 생성(POST)을 처리한 인스턴스의 로컬 디스크에 결과를 쓰면, 이어지는 다운로드(GET)가 다른 인스턴스로 라우팅될 때 **404**가 난다. 그래서 결과물은 공유 스토리지(GCS)에 두고, `/v1/assets` 핸들러가 거기서 읽어 **프록시 서빙**한다.

> Signed URL은 쓰지 않는다. 스펙이 `/v1/assets/...` **상대경로**로 고정돼 있어(프론트가 API_BASE를 붙임) 절대 URL로 바꾸면 프론트 계약이 깨진다. Cloud Run이 GCS object를 직접 읽어 내려준다 → 프론트 변경 0.

### 4.1 결과물 저장 — 우제 코드의 "파일 쓰기" 자리를 이걸로 교체

```python
from app.adapters.outbound.gcs_assets import put_asset

# 후보·zip·manifest·preview를 만들 때마다 로컬 저장 대신:
await put_asset(settings.gcs_asset_bucket, job_id, "font_generation/cherokee_candidates.zip", zip_bytes)
await put_asset(settings.gcs_asset_bucket, job_id, "font_generation/manifest.json", manifest_bytes)
await put_asset(settings.gcs_asset_bucket, job_id, f"font_generation/candidates/{name}.ttf", ttf_bytes)
await put_asset(settings.gcs_asset_bucket, job_id, f"font_generation/previews/{name}.png", png_bytes)
```

`rel_path`는 `/v1/assets/{job_id}/` **뒤의 경로 전체**와 정확히 일치해야 한다(응답의 `ttf_url`·`preview_url`·`zip_url`이 그대로 다운로드 키가 됨).

### 4.2 다운로드 핸들러 — 이 라우트를 우제 앱에 추가

```python
from fastapi import APIRouter, HTTPException, Response
from app.adapters.outbound.gcs_assets import get_asset

router = APIRouter()

@router.get("/v1/assets/{job_id}/{rel_path:path}")
async def download_asset(job_id: str, rel_path: str):
    result = await get_asset(settings.gcs_asset_bucket, job_id, rel_path)
    if result is None:
        raise HTTPException(status_code=404, detail="asset not found or expired")
    data, content_type = result
    return Response(content=data, media_type=content_type)
```

### 4.3 버킷 설정

- `settings.gcs_asset_bucket` 환경변수 추가. 결과물 전용 버킷(예: `ecofont-assets`) 권장. 기존 `ecofont-output` 재활용도 가능.
- **1일 자동 삭제는 버킷 Lifecycle(Terraform)에 맡긴다** — 코드에서 TTL 관리 안 함. 기존 GCS lifecycle 정책 패턴 재활용.
- 인증은 키리스 — Cloud Run SA가 버킷 읽기/쓰기 권한을 가지면 됨(기존 `gcs_storage.py`의 self-impersonation 패턴 참고).

---

## 5. 갖춰야 할 운영 배선 (기존 `apps/backend`에서 패턴만 가져오기)

우제 API가 프론트 메인 엔드포인트가 되므로, 기존 backend가 갖췄던 운영 요소를 우제 앱에도 갖춰야 한다:

- [ ] **CORS** — Vercel(프로덕션·preview)·localhost. `apps/backend/app/main.py`의 `CORSMiddleware` + `app/config.py`의 origins/regex 그대로 이식
- [ ] **파일 크기 검증** — 50MB 초과 시 413 (기존은 10MB였음, 50MB로)
- [ ] **에러 본문** — `{"detail": ...}` (스펙 §7대로. 미지원 언어는 detail이 객체)
- [ ] **`GET /health`** — Cloud Run startup/liveness probe용 (`{"status":"ok"}`)
- [ ] **구조화 로깅** — `structlog` (기존 `app/logging_config.py` 참고)

## 6. 인프라 재배선

- [ ] **CI/CD 트리거 경로**: 현재 `.github/workflows/backend-deploy.yml`이 `apps/backend/**` push에 반응 → 우제 코드 경로로 변경
- [ ] **Dockerfile**: 기존 uv 멀티스테이지(`apps/backend/Dockerfile`) 패턴 재사용. OCR/폰트 라이브러리(Tesseract 등 시스템 패키지 필요 시 apt 설치 레이어 추가)
- [ ] **Terraform**: GCS asset 버킷 + 1일 lifecycle 추가, Cloud Run env에 `GCS_ASSET_BUCKET`, SA에 버킷 권한. **timeout 20분·메모리 4Gi 유지**(동기 무거운 변환이라 필수)
- [ ] **의존성**: 우제 `pyproject.toml`에 `google-cloud-storage`·`google-auth` 포함

---

## 7. 부록 — 클라이언트 API 스펙 (변경 금지, 프론트 합의본)

```
POST /v1/font-generation/ttf
Content-Type: multipart/form-data   (브라우저 FormData는 Content-Type 직접 지정 안 함)
Authorization: 없음

Request:  { "font": File(.ttf 또는 TrueType glyf 기반 .otf) }   ← font 필드만. 나머지 안 보냄.
서버 고정값: method=eco_research_guided, candidate_count=20, codepoint_set=cherokee_full, ocr_lang=chr

Response 200:
{
  "job_id": "...",
  "status": "completed",
  "script": "cherokee",
  "method": "eco_research_guided",
  "generation_mode": "uploaded_ttf_style_recipe_batch",
  "input_filename": "input.ttf",
  "codepoint_set": "cherokee_full",
  "coverage": { "requested_glyphs": 172, "covered_glyphs": 172,
                "visible_source_glyphs": 172, "missing_glyphs": 0, "missing_codepoints": [] },
  "outputs": {
    "zip_url": "/v1/assets/{job_id}/font_generation/cherokee_candidates.zip",
    "manifest_url": "/v1/assets/{job_id}/font_generation/manifest.json"
  },
  "candidates": [
    {
      "candidate_id": "candidate_00",
      "style_id": "source_original",
      "ttf_url": "/v1/assets/{job_id}/font_generation/candidates/candidate_00_source_original.ttf",
      "preview_url": "/v1/assets/{job_id}/font_generation/previews/candidate_00_source_original.png",
      "file_size_bytes": 123456,
      "metrics": { "eval_glyphs": 32, "mean_ocr_score": 0.91, "mean_ink_saving": 0.24,
                   "mean_ocr_confidence": 78.5, "ocr_available": true, "ocr_lang": "chr" }
    }
    // ... 총 20개
  ]
}

다운로드: GET {API_BASE}{*_url}   (*_url은 상대경로 → 프론트가 API_BASE 붙임)

Error:
  { "detail": "error message" }
  미지원 언어 시 detail이 객체:
  { "detail": { "message": "uploaded font is not a supported Cherokee font",
                "detected_script": null, "script_counts": {"cherokee":0,"hangul":0},
                "supported_scripts": ["cherokee"] } }
  413: 50MB 초과 / 422: 빈 파일·잘못된 폰트 형식·glyf 미지원·Cherokee 글자 없음 / 500: 생성 중 서버 오류
```

---

## 8. 이식 체크리스트

1. [ ] 우제 FastAPI 코드를 `apps/backend/app/` 하위에 배치 (backend 통째 대체 확정)
2. [ ] 결과물 저장을 로컬 → `put_asset`(GCS)로 교체 (§4.1)
3. [ ] `/v1/assets/{job_id}/{rel_path:path}` 다운로드 라우트 추가 (§4.2)
4. [ ] `gcs_asset_bucket` 설정 + 운영 배선(CORS·50MB·health·로깅) 이식 (§5)
5. [ ] 인프라 재배선 — CI 트리거·Dockerfile·Terraform·의존성 (§6)
6. [ ] 로컬에서 `POST /v1/font-generation/ttf` E2E + 다운로드 확인
7. [ ] 설계 문서 동기화 (rule 5.3): `unit-2/functional-design.md` API 계약 교체, vision/CLAUDE.md MVP를 Cherokee로, `status.html`(rule 5.7)

> 질문은 소은(BE/인프라)에게. GCS 배선(`integration/gcs_assets.py`)은 그대로 import해서 쓰면 됨.
```
