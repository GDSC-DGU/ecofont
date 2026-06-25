// EcoFont 백엔드 폰트 생성 API 클라이언트
// 스펙: POST /v1/font-generation/ttf (multipart/form-data, 동기 응답)
//   - 프론트는 TTF 파일 하나만 전송 (script/method/candidate_count 등은 서버 고정값)
//   - 서버가 Cherokee 여부를 cmap으로 판정하고 eco 후보 TTF들 + OCR 점수를 반환
//   - 응답의 *_url 은 모두 상대 경로 → 다운로드 시 API_BASE 를 앞에 붙인다

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

export type CandidateMetrics = {
  eval_glyphs: number;
  mean_ocr_score: number | null;
  mean_ink_saving: number;
  mean_ocr_confidence: number;
  ocr_available: boolean;
  ocr_lang: string;
};

export type Candidate = {
  candidate_id: string;
  style_id: string;
  ttf_url: string;
  preview_url: string;
  file_size_bytes: number;
  metrics: CandidateMetrics;
};

export type FontGenerationResponse = {
  job_id: string;
  status: string;
  script: string;
  method: string;
  generation_mode: string;
  input_filename: string;
  codepoint_set: string;
  coverage: {
    requested_glyphs: number;
    covered_glyphs: number;
    visible_source_glyphs: number;
    missing_glyphs: number;
    missing_codepoints: number[];
  };
  outputs: { zip_url: string; manifest_url: string };
  candidates: Candidate[];
};

// 비-Cherokee 폰트 등에서 detail 이 객체로 내려오는 경우의 형태
type UnsupportedScriptDetail = {
  message: string;
  detected_script: string | null;
  script_counts: Record<string, number>;
  supported_scripts: string[];
};

export class FontGenerationError extends Error {
  status: number;
  detail?: UnsupportedScriptDetail;

  constructor(message: string, status: number, detail?: UnsupportedScriptDetail) {
    super(message);
    this.name = "FontGenerationError";
    this.status = status;
    this.detail = detail;
  }
}

/** 상대 경로(*_url)를 API_BASE 와 합쳐 절대 URL 로 만든다. */
export function toAbsoluteUrl(relativeUrl: string): string {
  return `${API_BASE}${relativeUrl}`;
}

/** TTF 파일을 업로드해 eco 후보 폰트들을 생성한다. */
export async function generateEcoFont(file: File): Promise<FontGenerationResponse> {
  const formData = new FormData();
  formData.append("font", file);

  // 주의: FormData 사용 시 Content-Type 을 직접 지정하지 않는다(boundary 자동 설정).
  const res = await fetch(`${API_BASE}/v1/font-generation/ttf`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let detail: UnsupportedScriptDetail | undefined;
    let message = `요청이 실패했습니다 (HTTP ${res.status})`;
    try {
      const body = await res.json();
      if (typeof body.detail === "string") {
        message = body.detail;
      } else if (body.detail && typeof body.detail === "object") {
        detail = body.detail as UnsupportedScriptDetail;
        message = detail.message;
      }
    } catch {
      // JSON 파싱 실패 시 기본 메시지 유지
    }
    throw new FontGenerationError(message, res.status, detail);
  }

  return (await res.json()) as FontGenerationResponse;
}

/** 크로스 오리진 URL 의 파일을 blob 으로 받아 지정한 파일명으로 다운로드한다. */
export async function downloadFile(url: string, fileName: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`다운로드 실패 (HTTP ${res.status})`);
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(objectUrl);
}
