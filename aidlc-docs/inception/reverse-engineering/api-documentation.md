# API Documentation

## REST APIs

현재 프론트엔드와 백엔드 간 API는 미구현 상태. 아래는 계획된 API 명세(예상).

### POST /convert
- **Method**: POST
- **Path**: /convert
- **Purpose**: TTF 파일 업로드 및 에코폰트 변환 요청
- **Request**: multipart/form-data (TTF 파일)
- **Response**: `{ inkSavingRate: number, carbonSaving: number, downloadUrl: string }`
- **Status**: 미구현

## Internal APIs (Frontend)

### useTtfFileUpload()
- **Location**: `src/hooks/useTtfFileUpload.ts`
- **Methods**:
  - `handleFileChange(event)` - input change 이벤트 처리
  - `handleDrop(event)` - 드래그앤드롭 이벤트 처리
  - `clearSelectedFile()` - 파일 선택 초기화
- **Return**: `{ inputRef, selectedFile, errorMessage, handleFileChange, handleDrop, clearSelectedFile }`

## Data Models

### File Upload State
- `selectedFile: File | null` - 선택된 TTF 파일
- `errorMessage: string` - 검증 실패 메시지

### Conversion Result (미구현, 예상)
- `inkSavingRate: number` - 잉크 절약률 (%)
- `carbonSaving: number` - 탄소 저감량 (g)
- `downloadUrl: string` - 변환된 TTF GCS URL
