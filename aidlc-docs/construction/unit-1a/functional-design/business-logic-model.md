# Business Logic Model — Unit 1a

## 핵심 플로우

```
[사용자] .ttf 파일 선택
    │
    ▼
[FileUploadComponent] 파일 검증 (TTF, 단일 파일)
    │  selectedFile: File
    ▼
[ConversionTriggerComponent] "잉크 다이어트 시작" 클릭
    │
    ▼
[useConvertFont hook]
    ├── isLoading = true → LoadingOverlay 표시
    ├── convertFont(file) 호출 (mock 함수)
    │       └── 1.5초 지연 후 원본 File을 그대로 Blob으로 반환
    │
    ├── 성공 시
    │     ├── ConversionContext.setResult({ originalFile, convertedBlob, convertedFileName })
    │     └── router.push('/result')
    │
    └── 실패 시
          ├── isLoading = false
          └── error 메시지 → 버튼 아래 인라인 표시, 업로드 페이지 유지

[ResultPage /result]
    ├── ConversionContext에서 result 읽기
    │     └── result == null → router.push('/') 리다이렉트
    │
    ├── [FontComparison]
    │     ├── useFontFaceLoader('eco-original', result.originalFile)
    │     │     └── FontFace API로 브라우저 폰트 레지스트리 등록
    │     ├── useFontFaceLoader('eco-converted', result.convertedBlob)
    │     │     └── FontFace API로 브라우저 폰트 레지스트리 등록
    │     ├── [상단] 두 폰트를 font-family 인라인 스타일로 나란히 렌더링
    │     │     ├── 왼쪽 패널: previewText를 'eco-original' 폰트로 표시
    │     │     └── 오른쪽 패널: previewText를 'eco-converted' 폰트로 표시
    │     ├── [하단] 텍스트 입력 박스 (previewText 상태)
    │     │     ├── 초기값: copy.result.comparison.sample (기본 샘플 문구)
    │     │     ├── 사용자 입력 → previewText 업데이트
    │     │     └── 두 패널이 실시간으로 동일한 previewText를 각자 폰트로 렌더링
    │     └── previewText 상태는 FontComparison 컴포넌트 내부에서 관리 (useState)
    │
    ├── [ResultMetrics] mock 수치 표시 (18.4%, 42g)
    │
    └── [DownloadResult]
          └── result.convertedBlob → URL.createObjectURL → <a> 클릭 → 다운로드
```

## 상태 흐름

| 단계 | isLoading | error | result (Context) |
|------|-----------|-------|-----------------|
| 초기 | false | null | null |
| 변환 중 | true | null | null |
| 변환 성공 | false | null | { originalFile, convertedBlob, ... } |
| 변환 실패 | false | "에러 메시지" | null |
