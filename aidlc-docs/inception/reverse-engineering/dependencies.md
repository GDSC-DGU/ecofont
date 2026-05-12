# Dependencies

## Internal Dependencies

```
apps/frontend
    (no internal package dependencies currently)

apps/backend (미구현)
    └── apps/ai-engine (예정)

apps/ai-engine (미구현)
    (standalone)
```

## External Dependencies (Frontend)

| 패키지 | 버전 | 목적 |
|--------|------|------|
| next | 16.2.4 | SSR 프레임워크 |
| react | 19.2.4 | UI 라이브러리 |
| react-dom | 19.2.4 | DOM 렌더링 |
| @vanilla-extract/css | 1.17.4 | zero-runtime CSS-in-TS |
| @vanilla-extract/next-plugin | 2.4.14 | Next.js vanilla-extract 통합 |

## Dev Dependencies (Frontend)

| 패키지 | 버전 | 목적 |
|--------|------|------|
| typescript | ^5 | 타입 시스템 |
| eslint | ^9 | 린팅 |
| eslint-config-next | 16.2.4 | Next.js ESLint 규칙 |
| prettier | ^3.8.3 | 코드 포매팅 |
