// Unit 1b에서 실 API 호출로 교체
export async function convertFont(file: File): Promise<Blob> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  // 원본 바이트 그대로 반환
  return new Blob([await file.arrayBuffer()], { type: "font/ttf" });
}
