# System Architecture

## System Overview

EcoFont는 Next.js 기반 프론트엔드, FastAPI 기반 백엔드, SSIM 기반 AI 최적화 엔진, OCR 가독성 검증 파이프라인으로 구성된 웹 플랫폼이다. 현재 프론트엔드만 구현되어 있으며, 백엔드/AI는 미구현 상태다.

## Architecture Diagram

```
+-------------------+      HTTPS       +---------------------------+
|  사용자 브라우저   | <-------------> |  Vercel (Frontend CDN)    |
|  (Next.js SSR)    |                  |  apps/frontend (Next.js)  |
+-------------------+                  +---------------------------+
                                                    |
                                               REST API
                                                    |
                                       +------------+------------+
                                       | GCP Cloud Run           |
                                       | FastAPI Backend          |
                                       | - TTF 파싱 (FontTools)  |
                                       | - 잉크 절약률 계산       |
                                       | - 탄소 저감량 계산       |
                                       +------------+------------+
                                                    |
                              +---------------------+------------------+
                              |                                        |
                   +----------+----------+               +------------+----------+
                   | GCP Cloud Run       |               | GCP Cloud Storage     |
                   | AI 최적화 엔진      |               | (GCS)                 |
                   | - SSIM 기반 변환    |               | - 업로드 TTF 저장     |
                   | - OCR 검증 파이프라인|               | - 변환 TTF 저장       |
                   +---------------------+               +-----------------------+
```

## Component Descriptions

### apps/frontend
- **Purpose**: 사용자 웹 인터페이스
- **Responsibilities**: 파일 업로드, 로딩 UI, 결과 대시보드, 다운로드
- **Dependencies**: Backend REST API (미연결)
- **Type**: Application (Next.js 16 / React 19)

### Backend (미구현)
- **Purpose**: 폰트 파일 처리 및 비즈니스 로직
- **Responsibilities**: TTF 파싱, 잉크 절약률/탄소 저감량 계산, GCS 연동
- **Dependencies**: GCS, AI 엔진
- **Type**: Application (FastAPI / Python)

### AI 최적화 엔진 (미구현)
- **Purpose**: 에코폰트 변환 핵심 알고리즘
- **Responsibilities**: SSIM 손실 함수 기반 글리프 최적화, OCR 가독성 검증
- **Dependencies**: Backend
- **Type**: Application (Python)

### GCP Cloud Storage
- **Purpose**: TTF 파일 저장소
- **Responsibilities**: 업로드 원본 및 변환 결과 파일 관리
- **Type**: Infrastructure

## Data Flow

```
사용자 --[TTF 업로드]--> Frontend --[POST /convert]--> Backend
Backend --[글리프 추출]--> AI 엔진 --[에코폰트 생성]--> Backend
Backend --[결과 저장]--> GCS
Backend --[잉크절약률, 탄소저감량, 다운로드 URL]--> Frontend
Frontend --[결과 표시 + 다운로드 링크]--> 사용자
```

## Integration Points

- **External APIs**: 없음 (현재)
- **Databases**: GCS (파일 저장), 추후 Pinecone (RAG, Post-MVP)
- **Third-party Services**: Vercel (프론트엔드 배포), GCP Cloud Run (백엔드/AI 배포)

## Infrastructure Components

- **IaC**: Terraform (hashicorp/google ~> 5.0)
- **Deployment Model**: Vercel(FE) + GCP Cloud Run(BE/AI)
- **Networking**: GCP 기본 네트워크
