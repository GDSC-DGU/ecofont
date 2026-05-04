# GitHub PR 템플릿 가이드

이 프로젝트는 작업 유형에 따라 다양한 PR 템플릿을 제공합니다.

## 📁 템플릿 구조

```
.github/
├── pull_request_template.md          # 기본 템플릿 (일반 작업용)
└── PULL_REQUEST_TEMPLATE/
    ├── docs.md                        # 문서 작업용
    ├── feature.md                     # 기능 개발용
    └── bugfix.md                      # 버그 수정용
```

## 🎯 템플릿 선택 가이드

### 1️⃣ 기본 템플릿 (자동 적용)
- PR 생성 시 자동으로 적용됩니다
- 일반적인 코드 변경, 리팩토링 등에 사용

### 2️⃣ 문서 템플릿 (`docs.md`)
**사용 시점:**
- README, 가이드 문서 작성/수정
- API 문서 업데이트
- 주석, 코드 설명 추가
- 번역 작업

**적용 방법:**
PR 생성 시 URL 끝에 `?template=docs.md` 추가
```
https://github.com/your-repo/compare/main...your-branch?template=docs.md
```

### 3️⃣ 기능 개발 템플릿 (`feature.md`)
**사용 시점:**
- 새로운 기능 추가
- 기존 기능 개선
- 새 API 엔드포인트 추가
- 주요 아키텍처 변경

**적용 방법:**
```
https://github.com/your-repo/compare/main...your-branch?template=feature.md
```

### 4️⃣ 버그 수정 템플릿 (`bugfix.md`)
**사용 시점:**
- 버그 수정
- 에러 핸들링 개선
- 성능 이슈 해결
- 보안 취약점 수정

**적용 방법:**
```
https://github.com/your-repo/compare/main...your-branch?template=bugfix.md
```

## 🚀 빠른 시작

### GitHub CLI 사용 (추천)
```bash
# 기능 개발 PR
gh pr create --template feature.md

# 버그 수정 PR
gh pr create --template bugfix.md

# 문서 작업 PR
gh pr create --template docs.md
```

### 웹 인터페이스 사용
1. PR 생성 페이지로 이동
2. URL에 `?template=템플릿이름.md` 추가
3. 또는 PR 본문에서 템플릿 선택

## 💡 템플릿 커스터마이징

프로젝트 특성에 맞게 템플릿을 수정하세요:

1. `.github/PULL_REQUEST_TEMPLATE/` 폴더로 이동
2. 원하는 템플릿 파일 수정
3. 변경사항 커밋 및 푸시

## 📌 작성 팁

### 좋은 PR 설명 작성하기
✅ **DO**
- 변경 이유를 명확히 설명
- 스크린샷/GIF로 시각적 변화 표현
- 테스트 방법 상세 기술
- 관련 이슈 링크 포함

❌ **DON'T**
- "코드 수정", "버그 수정" 같은 모호한 설명
- 체크리스트 무시하고 제출
- 테스트 없이 PR 생성

## 🔗 참고 자료

- [GitHub PR 템플릿 공식 문서](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository)
- [효과적인 PR 작성법](https://github.com/blog/2111-issue-and-pull-request-templates)
