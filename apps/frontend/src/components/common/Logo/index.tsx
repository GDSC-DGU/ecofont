export function Logo() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        userSelect: "none",
      }}
    >
      {/* 아이콘 마크: 구멍 뚫린 F — Font 이니셜 + 에코폰트(잉크 절약 빈 글자) 개념 */}
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8.5" fill="#1A73E8" />
        <rect x="8" y="6" width="5" height="20" rx="2" fill="white" />
        <rect x="8" y="6" width="16" height="5" rx="2" fill="white" />
        <rect x="8" y="14.5" width="11" height="5" rx="2" fill="white" />
        <circle cx="19" cy="8.5" r="1.6" fill="#1A73E8" />
        <circle cx="15.5" cy="17" r="1.6" fill="#1A73E8" />
      </svg>

      {/* 워드마크 */}
      <span
        style={{
          fontFamily:
            "var(--font-roboto), -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
          fontSize: "20px",
          letterSpacing: "-0.025em",
          lineHeight: 1,
        }}
        aria-label="ecofont"
      >
        <span style={{ fontWeight: 700, color: "#1A73E8" }}>eco</span>
        <span style={{ fontWeight: 300, color: "#1C2B3A" }}>font</span>
      </span>
    </span>
  );
}
