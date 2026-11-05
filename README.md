# FuryAwesome

Furiosa RNGD에서 사용할 수 있는 FXBEX 모델을 모아 놓은 카탈로그입니다.  
모델명을 누르면 Hugging Face에서 다운로드, 입력·출력 예제와 상세 사용법을 확인할 수 있습니다.

아래 표의 모델 이름을 복사해 넣으면 다운로드와 샘플 실행을 진행합니다.

```bash
pip install fxbex
fxbex run yolo11-onnx
```

채팅 모델은 바로 대화할 수 있습니다. 이미지 등 다른 모델의 입력 지정 방법은 표의 **사용법**을 참고하세요.

<!-- furyawesome:models:start -->

| 모델 | 용도 | 버전 | 정밀도 / SDK | 라이선스 | 사용법 | 다운로드 |
| --- | --- | --- | --- | --- | --- | --- |
| [FLUX.2-klein-4B](https://huggingface.co/softandsweet/black-forest-labs-flux-2-klein-4b-rngd-fxbex) | Image Generation | 2026.4.0-klein4b-portable2 | BF16 / 2026.4.0 | Apache-2.0 · [상세](models/c908fc9c2da6b74e053bf03c35f456276199b5cc991426117753af31ab017415.json) | [예제](https://huggingface.co/softandsweet/black-forest-labs-flux-2-klein-4b-rngd-fxbex/blob/09a39f3444b7e9eb7f4d9b22c335c08fcc5fb443/releases/2026.4.0-klein4b-portable2/5261d52163cfd0d6c08b5f8e0d85e4c6769af2aacb7a1b8d1230ad572d4f2666/USAGE.md) | [FXBEX](https://huggingface.co/softandsweet/black-forest-labs-flux-2-klein-4b-rngd-fxbex/resolve/09a39f3444b7e9eb7f4d9b22c335c08fcc5fb443/releases/2026.4.0-klein4b-portable2/5261d52163cfd0d6c08b5f8e0d85e4c6769af2aacb7a1b8d1230ad572d4f2666/FLUX.2-klein-4B.fxbex) |
| [Qwen3.5-9B-FP8-dynamic](https://huggingface.co/softandsweet/redhatai-qwen3-5-9b-fp8-dynamic-rngd-fxbex) | LLM | 2026.4.0-portable2 | BF16 / 2026.4.0 | Apache-2.0 · [상세](models/13dcb6f38c1dc1956c67878c57b1f82e3f95be96e5b29d5e805d1f720355a59e.json) | [예제](https://huggingface.co/softandsweet/redhatai-qwen3-5-9b-fp8-dynamic-rngd-fxbex/blob/ab0d316c4ce4f766adf34bcbf170cf3a2104faf4/releases/2026.4.0-portable2/cae0c65b4283c72778431f83c63c7ec8e0e2b64edd49f5fceeb00bf1b3bd7b32/USAGE.md) | [FXBEX](https://huggingface.co/softandsweet/redhatai-qwen3-5-9b-fp8-dynamic-rngd-fxbex/resolve/ab0d316c4ce4f766adf34bcbf170cf3a2104faf4/releases/2026.4.0-portable2/cae0c65b4283c72778431f83c63c7ec8e0e2b64edd49f5fceeb00bf1b3bd7b32/model.fxbex) |
| [yolo11-onnx](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex) | Computer Vision | 2026.4.0-opt3-sample1 | Mixed / 2026.4.0 | AGPL-3.0 · [상세](models/e54beb719f8ec6fd9d6caa9d5bedfbba1a038c9fc5bbac973a987310d2becebb.json) | [예제](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex/blob/5b6604c64477d3d518ab6a15070ab78d6005998c/releases/2026.4.0-opt3-sample1/4d52ac8d4f672be214505866b0e6129b4d17642194fbd49e2a9ce1989d46d55b/USAGE.md) | [FXBEX](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex/resolve/5b6604c64477d3d518ab6a15070ab78d6005998c/releases/2026.4.0-opt3-sample1/4d52ac8d4f672be214505866b0e6129b4d17642194fbd49e2a9ce1989d46d55b/yolo11-onnx.fxbex) |

<!-- furyawesome:models:end -->

- 호환되는 Furiosa RNGD 하드웨어·드라이버·SDK가 필요합니다. 모델별 환경과 추가 의존성은 HF 안내를 따르세요.
- 원본·패키지 라이선스와 검증 범위는 각 모델의 상세 정보에서 확인하세요.
- [FXBEX](https://github.com/smallstep-zzz/FXBEX) · [OpenFury Hub](https://openfury-hub.softandsweet5.chatgpt.site/) · [기여 안내](CONTRIBUTING.md)
