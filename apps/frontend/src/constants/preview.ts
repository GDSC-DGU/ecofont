// 서버 응답의 script 값에 따라 미리보기 UI 를 분기하기 위한 설정.
// - cherokee: IME 가 없으므로 문자 팔레트 + 체로키 샘플/placeholder 제공
// - 그 외(한국어 등): 기존 자유 입력 UI 만으로 충분
import { CHEROKEE_SAMPLE, CHEROKEE_PALETTE } from "./cherokee";

export type ScriptPreviewConfig = {
  showPalette: boolean; // 문자 팔레트 노출 여부
  palette: readonly string[]; // 팔레트 문자 목록
  inputDefault: string; // 변환 직후 미리보기 입력 초기값
  fallbackSample: string; // 입력이 비었을 때 카드에 표시할 샘플
  placeholder: string; // 입력칸 placeholder
};

const CHEROKEE: ScriptPreviewConfig = {
  showPalette: true,
  palette: CHEROKEE_PALETTE,
  inputDefault: CHEROKEE_SAMPLE,
  fallbackSample: CHEROKEE_SAMPLE,
  placeholder: "체로키 문자를 입력하거나 아래에서 선택하세요",
};

const DEFAULT: ScriptPreviewConfig = {
  showPalette: false,
  palette: [],
  inputDefault: "",
  fallbackSample: "지속 가능한 타이포그래피",
  placeholder: "미리보기 텍스트를 입력하세요",
};

export function getScriptPreviewConfig(
  script: string | undefined
): ScriptPreviewConfig {
  return script === "cherokee" ? CHEROKEE : DEFAULT;
}
