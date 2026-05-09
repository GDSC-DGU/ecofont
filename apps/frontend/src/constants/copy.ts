export const copy = {
  brand: {
    name: "EcoFont",
    slogan: "지속 가능한 타이포그래피와 모든 언어를 위한 잉크 다이어트",
    metadataDescription:
      "지속 가능한 타이포그래피와 모든 언어를 위한 잉크 다이어트",
  },
  home: {
    description:
      "TTF 폰트를 업로드하면 글자의 인상은 유지하고 잉크 사용량은 줄이는 친환경 폰트 변환 흐름을 시작합니다.",
  },
  upload: {
    title: "잉크 다이어트를 시작할 폰트 업로드",
    description:
      "다양한 언어의 타이포그래피가 더 적은 잉크로 인쇄될 수 있도록 원본 TTF 파일을 선택해 주세요.",
    badge: "TTF only",
    dropzonePrimary: "파일 선택 또는 드래그 앤 드롭",
    dropzoneSecondary: "최대 20MB .ttf 파일",
    action: "잉크 다이어트 시작",
    guideSteps: [
      {
        title: "폰트 업로드",
        description: "잉크 사용량을 줄이고 싶은 원본 TTF 파일을 선택합니다.",
      },
      {
        title: "잉크 다이어트",
        description:
          "글자의 구조를 분석해 가독성을 유지하면서 절감 여지를 찾습니다.",
      },
      {
        title: "지속 가능성 확인",
        description:
          "변환 파일과 잉크 절약률, 원본/변환 미리보기를 비교합니다.",
      },
    ],
  },
  loading: {
    title: "폰트에 잉크 다이어트를 적용하는 중입니다",
    description:
      "모든 언어의 글자 형태를 최대한 보존하면서 더 적은 잉크로 인쇄될 수 있는 구조를 찾고 있습니다.",
    action: "결과 화면 보기",
  },
  result: {
    title: "잉크 다이어트 결과",
    description:
      "지속 가능한 타이포그래피를 위해 줄어든 잉크 사용량과 원본/변환 미리보기를 확인합니다.",
    downloadAction: "다이어트 TTF 다운로드",
    metrics: {
      title: "잉크 다이어트 지표",
      inkSavingLabel: "잉크 절약률",
      carbonSavingLabel: "예상 탄소 절감량",
      note: "실제 변환이 연결되면 폰트별 잉크 절약률과 환경 지표를 이 영역에 표시합니다.",
    },
    comparison: {
      title: "원본 및 다이어트 폰트 미리보기",
      sample: "지속 가능한 타이포그래피 EcoFont",
      originalLabel: "원본",
      optimizedLabel: "다이어트 적용",
    },
  },
} as const;
