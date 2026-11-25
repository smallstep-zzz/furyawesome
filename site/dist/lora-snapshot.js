window.furyLorasSnapshot = {
  "schema_version": 1,
  "adapters": [
    {
      "id": "3d-render-style-xl",
      "models": [
        "stabilityai/sdxl-turbo"
      ],
      "repo": "goofyai/3d_render_style_xl",
      "revision": "5ec74a57db5e244a2157173781a7b29045f88237",
      "filename": "3d_render_style_xl.safetensors",
      "bytes": 85450700,
      "license": "apache-2.0",
      "title": "3D 렌더 스타일",
      "benefit_ko": "앱 마스코트·제품 아이콘을 입체 렌더풍으로 통일",
      "constraints_ko": [
        "공식 카드 권장 강도 0.7–1.0. 원본 SDXL용 고해상도 권장사항을 현재 고정512 Turbo에서 재현한다고 주장하지 않음.",
        "SDXL Turbo 512×512·1스텝, 강도0.7, 시드42의 한 프롬프트에서 NPU 출력과 스타일을 확인했습니다. 모든 입력의 품질을 보장하지 않습니다. 한국어 이해를 추가하지 않습니다."
      ],
      "trigger": "3d style / 3d / 3d render",
      "example_prompt": "3d render, a friendly round robot holding a flower",
      "strength": 0.8,
      "status": "verified_npu",
      "kind": "style",
      "references": [
        "https://huggingface.co/goofyai/3d_render_style_xl/blob/5ec74a57db5e244a2157173781a7b29045f88237/README.md",
        "https://huggingface.co/api/models/goofyai/3d_render_style_xl/revision/5ec74a57db5e244a2157173781a7b29045f88237?blobs=true"
      ],
      "checked_on": "2026-11-24",
      "evidence": [
        "https://github.com/smallstep-zzz/furyawesome/blob/main/usage/lora-validation-20261124.md"
      ]
    },
    {
      "id": "mikkoani-klein4b",
      "models": [
        "black-forest-labs/FLUX.2-klein-4B"
      ],
      "repo": "mikkoph/mikkoani-klein4b",
      "revision": "2429707d188e1c366fc9fad14a88516b931c4b30",
      "filename": "klein4b-mikkoani.safetensors",
      "bytes": 92436112,
      "license": "apache-2.0",
      "title": "선화·애니메이션 일러스트",
      "benefit_ko": "복잡한 선화와 절제된 색상의 성숙한 애니메이션/패션 일러스트 스타일을 추가한다.",
      "constraints_ko": [
        "패션 스케치 예시를 그대로 붙여넣으세요. @mikkoani는 선택 사항이며, 인물·의상·배경을 바꿔도 됩니다.",
        "44장 합성 이미지 학습이므로 주제 일반화와 데이터 권리의 독립 검증은 별개다.",
        "한국어 이해·한글 렌더링·한국풍 스타일 개선 근거는 없다.",
        "구체적인 랭크/alpha/키 형식은 모델카드에 없으므로 헤더 확인과 실제 어댑터 로더 검증이 필요하다.",
        "이 게시 패키지의 LoRA 실행 연결은 아직 검증하지 않았습니다."
      ],
      "trigger": "@mikkoani",
      "example_prompt": "@mikkoani, editorial fashion illustration of a traveler in a long indigo coat on a rainy railway platform, fine ink linework, a muted rust and slate palette, reflected station lights, full-body three-quarter view",
      "strength": 1.0,
      "status": "candidate",
      "kind": "style",
      "references": [
        "https://huggingface.co/mikkoph/mikkoani-klein4b/blob/2429707d188e1c366fc9fad14a88516b931c4b30/README.md"
      ],
      "checked_on": "2026-11-25",
      "evidence": []
    },
    {
      "id": "mikkoph-klein4b",
      "models": [
        "black-forest-labs/FLUX.2-klein-4B"
      ],
      "repo": "mikkoph/mikkoph-klein4b",
      "revision": "91b044f129796e737a39301365d5a800aab0fbe0",
      "filename": "klein4b-mikkoph.safetensors",
      "bytes": 46233152,
      "license": "apache-2.0",
      "title": "스튜디오 사진 스타일",
      "benefit_ko": "인물 사진의 스튜디오 조명, 메이크업, 색보정에 작가의 사진 스타일을 더한다. 46MB 수준이라 시험 비용도 낮다.",
      "constraints_ko": [
        "스튜디오 사진 예시를 복사해 피사체와 조명을 바꿔보세요. by mikkoph는 선택 사항입니다.",
        "저자는 본인 소유 포트폴리오로 학습했다고 밝히지만 독립 감사를 수행한 것은 아니다.",
        "한국 인물 미감/한국어 이해 향상 모델로 소개할 근거가 없다.",
        "정확한 rank/alpha/키 형식은 후속 헤더 검증이 필요하다.",
        "이 게시 패키지의 LoRA 실행 연결은 아직 검증하지 않았습니다."
      ],
      "trigger": "by mikkoph",
      "example_prompt": "Studio portrait by mikkoph of a woman with short dark hair in a charcoal blazer, a warm softbox from camera left, cool rim light, muted olive backdrop, natural skin texture, close-up three-quarter view",
      "strength": 1.0,
      "status": "candidate",
      "kind": "style",
      "references": [
        "https://huggingface.co/mikkoph/mikkoph-klein4b/blob/91b044f129796e737a39301365d5a800aab0fbe0/README.md"
      ],
      "checked_on": "2026-11-25",
      "evidence": []
    },
    {
      "id": "papercut-sdxl",
      "models": [
        "stabilityai/sdxl-turbo"
      ],
      "repo": "TheLastBen/Papercut_SDXL",
      "revision": "b001f28d3913bc1e4a19f2564fa41e39049bec1c",
      "filename": "papercut.safetensors",
      "bytes": 340786114,
      "license": "creativeml-openrail-m",
      "title": "종이공예 스타일",
      "benefit_ko": "행사 배너·동화 삽화를 종이공예 느낌으로 제작",
      "constraints_ko": [
        "SDXL1.0 구조 후보. Turbo 1스텝 품질 미검증.",
        "SDXL Turbo 512×512·1스텝, 강도0.7, 시드42의 한 프롬프트에서 NPU 출력과 스타일을 확인했습니다. 모든 입력의 품질을 보장하지 않습니다. 한국어 이해를 추가하지 않습니다."
      ],
      "trigger": "papercut",
      "example_prompt": "papercut, a small hanok under a crescent moon",
      "strength": 0.8,
      "status": "verified_npu",
      "kind": "style",
      "references": [
        "https://huggingface.co/TheLastBen/Papercut_SDXL/blob/b001f28d3913bc1e4a19f2564fa41e39049bec1c/README.md",
        "https://huggingface.co/api/models/TheLastBen/Papercut_SDXL/revision/b001f28d3913bc1e4a19f2564fa41e39049bec1c?blobs=true"
      ],
      "checked_on": "2026-11-24",
      "evidence": [
        "https://github.com/smallstep-zzz/furyawesome/blob/main/usage/lora-validation-20261124.md"
      ]
    },
    {
      "id": "pixel-art-lora",
      "models": [
        "black-forest-labs/FLUX.2-klein-4B"
      ],
      "repo": "Limbicnation/pixel-art-lora",
      "revision": "0ac8e5c3400af68228811edc324721e25fc26777",
      "filename": "pytorch_lora_weights.safetensors",
      "bytes": 325280664,
      "license": "apache-2.0",
      "title": "픽셀아트 스프라이트",
      "benefit_ko": "짧은 4스텝 설정으로 게임 캐릭터·스프라이트용 픽셀아트 스타일을 추가한다.",
      "constraints_ko": [
        "게임 소품 예시에서 피사체·시점을 바꿔보세요. 픽셀 스프라이트의 투명 출력은 런타임에서 별도로 확인해야 합니다.",
        "모델카드의 RGBA/투명 배경 주장만으로 실제 알파 채널을 보장하지 않는다. 일반 Flux 파이프라인은 RGB일 수 있으므로 출력 모드/배경제거 별도 확인이 필요하다.",
        "과거 8.06GB 전체 체크포인트를 가리키는 샘플 저장소가 존재하므로 여기 고정한 새 325MB LoRA와 혼동하지 않는다.",
        "한국어 이해 개선 근거가 없다.",
        "이 게시 패키지의 LoRA 실행 연결은 아직 검증하지 않았습니다."
      ],
      "trigger": "pixel art sprite",
      "example_prompt": "pixel art sprite, a moss-green delivery robot carrying a sealed parcel, three-quarter front view, crisp single-pixel outline, limited 12-color palette, isolated centered game asset on a plain background",
      "strength": 1.0,
      "status": "candidate",
      "kind": "style",
      "references": [
        "https://huggingface.co/Limbicnation/pixel-art-lora/blob/0ac8e5c3400af68228811edc324721e25fc26777/README.md"
      ],
      "checked_on": "2026-11-25",
      "evidence": []
    },
    {
      "id": "pixel-art-xl",
      "models": [
        "stabilityai/sdxl-turbo"
      ],
      "repo": "nerijs/pixel-art-xl",
      "revision": "8bf4a4d9ea283e00a51fafda8e0539f8248ea037",
      "filename": "pixel-art-xl.safetensors",
      "bytes": 170543052,
      "license": "creativeml-openrail-m",
      "title": "픽셀아트",
      "benefit_ko": "게임 아이콘·소품을 픽셀아트로 빠르게 비교",
      "constraints_ko": [
        "카드는 SDXL 1.0, 내장 학습 메타데이터는 0.9. 카드상 양쪽 사용 가능. 트리거 필수 아님. 8배 최근접 축소 권장. LCM 예시의 스케줄러·8스텝은 Turbo에 적용하지 않음.",
        "SDXL Turbo 512×512·1스텝, 강도0.7, 시드42의 한 프롬프트에서 NPU 출력과 스타일을 확인했습니다. 모든 입력의 품질을 보장하지 않습니다. 한국어 이해를 추가하지 않습니다."
      ],
      "trigger": "pixel art",
      "example_prompt": "pixel art, a tiny hanok beside a pine tree",
      "strength": 0.8,
      "status": "verified_npu",
      "kind": "style",
      "references": [
        "https://huggingface.co/nerijs/pixel-art-xl/blob/8bf4a4d9ea283e00a51fafda8e0539f8248ea037/README.md",
        "https://huggingface.co/api/models/nerijs/pixel-art-xl/revision/8bf4a4d9ea283e00a51fafda8e0539f8248ea037?blobs=true"
      ],
      "checked_on": "2026-11-24",
      "evidence": [
        "https://github.com/smallstep-zzz/furyawesome/blob/main/usage/lora-validation-20261124.md"
      ]
    },
    {
      "id": "qwen21-polaroid",
      "models": [
        "Qwen/Qwen-Image-2.1"
      ],
      "repo": "SEEDRAAI/Qwen-Image-2.1-LoRA-Polaroid",
      "revision": "6bc9554265bd638a1167682c04a1802eb3c57ac0",
      "filename": "p0laroid_qwen_v1.safetensors",
      "bytes": 167830408,
      "license": "Qwen Research License",
      "title": "즉석필름 사진 스타일",
      "benefit_ko": "여행·카페·인물 콘텐츠를 흰 테두리·플래시·빛바랜 즉석필름 사진풍으로 통일",
      "constraints_ko": [
        "p0laroid를 유지한 채 장면을 바꾸고 강도 0.7부터 비교하세요. 원본 카드의 예시는 25스텝이며 배포 프로필과 다를 수 있습니다.",
        "카드 미리보기는 추가 realism/noise/grain/color 처리 포함; LoRA만으로 동일 결과 보장 안 됨.",
        "강도0.8 초과시 너무 부드러워짐. 복잡한 배경이 뭉개질 수 있음.",
        "Qwen Image 2.1 Non-Turbo용; 이전 Qwen Image/Edit/Turbo와 교차호환 근거 없음.",
        "스타일 변화 실증은 작성자 카드이며 RNGD 실행 미검증.",
        "비상업 연구용 라이선스입니다. 이 게시 패키지의 LoRA 실행 연결은 미검증입니다."
      ],
      "trigger": "p0laroid",
      "example_prompt": "p0laroid, a ginger cat asleep on a teal vinyl booth in a rain-soaked late-night diner, direct flash, warm tungsten light, soft film grain, faded cyan shadows, white instant-film border",
      "strength": 0.7,
      "status": "candidate",
      "kind": "style",
      "references": [
        "https://huggingface.co/SEEDRAAI/Qwen-Image-2.1-LoRA-Polaroid/blob/6bc9554265bd638a1167682c04a1802eb3c57ac0/README.md"
      ],
      "checked_on": "2026-11-25",
      "evidence": []
    },
    {
      "id": "toy-face",
      "models": [
        "stabilityai/sdxl-turbo"
      ],
      "repo": "CiroN2022/toy-face",
      "revision": "da6e6d42b49674cf43fc05d8a6a4899651ac2e9b",
      "filename": "toy_face_sdxl.safetensors",
      "bytes": 170543292,
      "license": "other",
      "title": "Toy Face 인물 스타일",
      "benefit_ko": "인물 사진을 큰 눈과 둥근 표정이 특징인 장난감 캐릭터 스타일로 바꿉니다.",
      "constraints_ko": [
        "라이선스 조건이 명확하지 않아 신규 추천 가져오기는 보류합니다. 기존 로컬 검증 파일이 있을 때만 예시를 참고하세요.",
        "toy_face를 프롬프트 앞에 두고 표정·머리·배경을 묘사합니다. SDXL Turbo 실험에서는 강도 0.8을 사용했습니다."
      ],
      "trigger": "toy_face",
      "example_prompt": "toy_face, a smiling young woman with curly red hair, studio portrait, blue background",
      "strength": 0.8,
      "status": "hold",
      "kind": "style",
      "references": [
        "https://huggingface.co/CiroN2022/toy-face/blob/da6e6d42b49674cf43fc05d8a6a4899651ac2e9b/README.md"
      ],
      "checked_on": "2026-11-25",
      "evidence": []
    }
  ]
};
