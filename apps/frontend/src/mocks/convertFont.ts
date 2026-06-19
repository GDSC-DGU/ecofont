// Unit 1b 실 API 연결 시: startConversion → POST /convert fetch로 교체
//                          pollJob → GET /jobs/{id} fetch로 교체
export type MockPollResult =
  | { status: "processing"; stage: string; progress: number }
  | {
      status: "done";
      result: {
        download_url: string;
        ink_saving_rate: number;
        carbon_reduction_g: number;
        converted_filename: string;
      };
    }
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
  const blob = new Blob([await file.arrayBuffer()], { type: "font/ttf" });
  return {
    status: "done",
    result: {
      download_url: URL.createObjectURL(blob),
      ink_saving_rate: 0.234,
      carbon_reduction_g: 12.5,
      converted_filename: file.name.replace(/\.ttf$/i, "_eco.ttf"),
    },
  };
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
