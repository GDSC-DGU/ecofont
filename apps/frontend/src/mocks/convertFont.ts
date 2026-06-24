// TODO(Unit 1b): 실 API 연결 시 startConversion → POST /convert fetch로 교체
//               pollJob → GET /jobs/{id} fetch로 교체
//
// 현재 mock은 백엔드가 TTF 바이너리를 직접 응답하는 구조를 임시 시뮬레이션.
// 백엔드 최종 응답 방식(직접 전송 vs GCS Signed URL)이 확정되면
// MockVariant 타입과 pollJob 반환값을 실 응답 스키마에 맞게 교체할 것.

export type MockVariant = {
  // TODO(Unit 1b): 백엔드 응답 구조 확정 후 이 필드 교체
  //   - TTF 직접 전송 방식 → ttf_blob 유지 (또는 Response.blob() 처리로)
  //   - GCS Signed URL 방식 → download_url: string 으로 교체 후 hook에서 fetch
  ttf_blob: Blob;
  ink_saving_rate: number;
  carbon_reduction_g: number;
  converted_filename: string;
};

export type MockPollResult =
  | { status: "processing"; stage: string; progress: number }
  | { status: "done"; result: { variants: MockVariant[] } }
  | { status: "failed"; message: string };

export async function startConversion(_file: File): Promise<string> {
  await delay(300);
  return "mock-job-id";
}

export async function pollJob(
  _jobId: string,
  file: File,
  attempt: number
): Promise<MockPollResult> {
  await delay(1000);
  if (attempt === 1)
    return { status: "processing", stage: "parsing", progress: 0.3 };
  if (attempt === 2)
    return { status: "processing", stage: "optimizing", progress: 0.7 };

  const variantSpecs = [
    { rate: 0.15, carbon: 7.8, suffix: "_eco_v1" },
    { rate: 0.23, carbon: 12.1, suffix: "_eco_v2" },
    { rate: 0.31, carbon: 16.4, suffix: "_eco_v3" },
    { rate: 0.38, carbon: 20.0, suffix: "_eco_v4" },
    { rate: 0.45, carbon: 23.7, suffix: "_eco_v5" },
  ];

  // TODO(Unit 1b): 실 API 연결 시 아래 blob 생성 로직 제거.
  // 현재는 원본 파일 바이트를 그대로 복사해 TTF 직접 수신을 흉내냄.
  // 실 API는 변환된 TTF를 바이너리로 응답(또는 Signed URL로 제공)하게 됨.
  const arrayBuffer = await file.arrayBuffer();
  const variants = variantSpecs.map((v) => ({
    ttf_blob: new Blob([arrayBuffer], { type: "font/ttf" }),
    ink_saving_rate: v.rate,
    carbon_reduction_g: v.carbon,
    converted_filename: file.name.replace(/\.ttf$/i, `${v.suffix}.ttf`),
  }));

  return { status: "done", result: { variants } };
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
