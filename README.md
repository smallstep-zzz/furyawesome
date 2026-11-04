# furyawesome

## FXBEX 설치와 실행

[FXBEX](https://github.com/smallstep-zzz/FXBEX)는 Furiosa RNGD용 사전 컴파일 모델 패키지인 `.fxbex`를 검사하고 실행하는 도구입니다. Python 3.10–3.14 환경에서 설치하세요.

```bash
python -m pip install fxbex
fxbex --help
```

실행할 `.fxbex` 패키지를 준비한 뒤, 먼저 내용을 확인하고 검증합니다. NPU 추론에는 모델과 호환되는 Furiosa SDK, PyTorch 및 필요한 모델 어댑터가 설치된 Linux 호스트가 필요합니다.

```bash
fxbex inspect model.fxbex
fxbex validate model.fxbex
```

텐서 입력 모델은 모델이 정한 입력 규격에 맞춘 JSON을 전달해 실행하고 결과를 파일로 저장할 수 있습니다.

```bash
fxbex run model.fxbex --input inputs.json -o result.json
```

YOLO 같은 이미지 모델은 이미지 전처리와 입력 텐서 형식이 모델별로 다를 수 있으므로, 해당 모델의 설명과 패키지 어댑터 계약을 확인해 `inputs.json`을 준비하세요. `validate`는 패키지와 실행 환경을 검사하며 추론 자체는 실행하지 않습니다. 상세 명령과 제한 사항은 [FXBEX README](https://github.com/smallstep-zzz/FXBEX#readme)를 참고하세요.

**Furiosa NPU 실행 패키지의 공개 메타데이터 카탈로그.**

- 모델 탐색: [OpenFury Hub](https://openfury-hub.softandsweet5.chatgpt.site/)
- 실제 FXBEX 파일: [Hugging Face](https://huggingface.co/)
- FXBEX 제작·게시 도구: [Furiosa-Hug-Anything](https://github.com/smallstep-zzz/Furiosa-Hug-Anything)

이 저장소에는 실행파일, 모델 가중치, 액세스 토큰을 업로드하지 않습니다. 모델별 원본·패키지 라이선스를 구분합니다. 목록 등록은 배포 권한이나 파일 안전성 검토를 대신하지 않습니다. 각 모델의 NPU 결과는 해당 항목에 적힌 테스트 범위만 설명하며 다른 환경에서의 동작을 보장하지 않습니다.

## 웹사이트 자동 반영

`catalog.json`은 OpenFury Hub가 읽는 공개 색인입니다. 모델 게시기는 `models/*.json`, `catalog.json`, 아래 README 목록을 **한 번의 GitHub 커밋으로** 갱신합니다. 웹사이트는 이 JSON을 주기적으로 읽으므로 모델이 추가돼도 별도 사이트 배포가 필요 없습니다.

## 등록된 모델

<!-- furyawesome:models:start -->

| Model | Version | Target / precision | Source license | Package license | Download |
| --- | --- | --- | --- | --- | --- |
| [RedHatAI/Qwen3.5-9B-FP8-dynamic](models/ac5362c32ca10857d7958314ebf4f38ed6d198e36cebcca2c12a2025b437ff27.json) | 2026.4.0-portable1 | Furiosa RNGD / BF16 | Apache-2.0 | Apache-2.0 weights; bundled adapter license undeclared | [HF](https://huggingface.co/softandsweet/redhatai-qwen3-5-9b-fp8-dynamic-rngd-fxbex/resolve/a2d7585a4291ba8d7f6710ae9ec0db09fb5284ce/releases/2026.4.0-portable1/440c02aac9e9ac679a247f9efe9eb3bc8fcc9007204c4ee697210104c54d0774/model.fxbex) |
| [YOLO11n RNGD FXBEX (640, portable)](models/8ef9cc3f3ce8dc6fda9c043e14f2fa563a5699ca23d00c4dffc9f78e870825af.json) | 2026.4.0-opt3-minimal1 | Furiosa RNGD / Mixed | AGPL-3.0 | AGPL-3.0 weights; bundled source has no separate license; SDK host terms apply | [HF](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex/resolve/e0847942d8a55175a07ad1b9a78b0163583f6550/releases/2026.4.0-opt3-minimal1/cac265de482649f3aa020ceed99a3391daee10ab2d4fe7e8768ad685dc3a078d/model.fxbex) |

<!-- furyawesome:models:end -->


자세한 내용은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고하세요.
