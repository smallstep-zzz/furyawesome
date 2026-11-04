# FuryAwesome

Furiosa RNGD에서 사용할 수 있는 FXBEX 모델을 모아 놓은 카탈로그입니다.  
모델명을 누르면 Hugging Face에서 다운로드, 입력·출력 예제와 상세 사용법을 확인할 수 있습니다.

아래 표에서 모델을 다운로드한 뒤, 파일명을 넣어 실행하세요.

```bash
pip install fxbex
fxbex run ./모델파일명.fxbex
```

채팅 모델은 바로 대화할 수 있습니다. 이미지 등 다른 모델의 입력 지정 방법은 표의 **사용법**을 참고하세요.

<!-- furyawesome:models:start -->

| 모델 | 용도 | 버전 | 정밀도 / SDK | 라이선스 | 사용법 | 다운로드 |
| --- | --- | --- | --- | --- | --- | --- |
| [RedHatAI/Qwen3.5-9B-FP8-dynamic](https://huggingface.co/softandsweet/redhatai-qwen3-5-9b-fp8-dynamic-rngd-fxbex) | LLM | 2026.4.0-portable1 | BF16 / 2026.4.0 | Apache-2.0 · [상세](models/ac5362c32ca10857d7958314ebf4f38ed6d198e36cebcca2c12a2025b437ff27.json) | [예제](https://huggingface.co/softandsweet/redhatai-qwen3-5-9b-fp8-dynamic-rngd-fxbex/blob/edc74fbcf3109dcd5016896183e6d92566a55e3a/releases/2026.4.0-portable1/440c02aac9e9ac679a247f9efe9eb3bc8fcc9007204c4ee697210104c54d0774/USAGE.md) | [FXBEX](https://huggingface.co/softandsweet/redhatai-qwen3-5-9b-fp8-dynamic-rngd-fxbex/resolve/edc74fbcf3109dcd5016896183e6d92566a55e3a/releases/2026.4.0-portable1/440c02aac9e9ac679a247f9efe9eb3bc8fcc9007204c4ee697210104c54d0774/model.fxbex) |
| [YOLO11n RNGD FXBEX (640, portable)](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex) | Computer Vision | 2026.4.0-opt3-minimal1 | Mixed / 2026.4.0 | AGPL-3.0 · [상세](models/8ef9cc3f3ce8dc6fda9c043e14f2fa563a5699ca23d00c4dffc9f78e870825af.json) | [예제](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex/blob/a90ba55456e501f15d0d4ec38d94f22d65fc4016/releases/2026.4.0-opt3-minimal1/cac265de482649f3aa020ceed99a3391daee10ab2d4fe7e8768ad685dc3a078d/USAGE.md) | [FXBEX](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex/resolve/a90ba55456e501f15d0d4ec38d94f22d65fc4016/releases/2026.4.0-opt3-minimal1/cac265de482649f3aa020ceed99a3391daee10ab2d4fe7e8768ad685dc3a078d/model.fxbex) |

<!-- furyawesome:models:end -->

- 호환되는 Furiosa RNGD 하드웨어·드라이버·SDK가 필요합니다. 모델별 환경과 추가 의존성은 HF 안내를 따르세요.
- 원본·패키지 라이선스와 검증 범위는 각 모델의 상세 정보에서 확인하세요.
- [FXBEX](https://github.com/smallstep-zzz/FXBEX) · [OpenFury Hub](https://openfury-hub.softandsweet5.chatgpt.site/) · [기여 안내](CONTRIBUTING.md)
