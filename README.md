# FuryAwesome

Furiosa RNGD에서 사용할 수 있는 fxbX 모델을 모아 놓은 카탈로그입니다.
모델명을 누르면 Hugging Face에서 다운로드, 입력·출력 예제와 상세 사용법을 확인할 수 있습니다.

아래 표의 모델 이름을 복사해 넣으면 다운로드와 샘플 실행을 진행합니다.

```bash
pip install --upgrade fxbx
fxbx run yolo11-onnx
```

채팅 모델은 바로 대화할 수 있습니다. 이미지 등 다른 모델의 입력 지정 방법은 표의 **사용법**을 참고하세요.

<!-- furyawesome:models:start -->

| 모델 | 용도 | 버전 | 정밀도 / SDK | 라이선스 | 사용법 | 다운로드 |
| --- | --- | --- | --- | --- | --- | --- |
| [sdxl-turbo](https://huggingface.co/softandsweet/stabilityai-sdxl-turbo-rngd-fxbex) | 이미지 생성 | 2026.4.0-sdxl-turbo-fxbx1 | BF16 / 2026.4.0 | Stability AI Community License · [상세](models/af12bc1a9b6d3a1872dbbb955a7837c60b62c1691d7907b572e3008cd9157422.json) | [예제](https://huggingface.co/softandsweet/stabilityai-sdxl-turbo-rngd-fxbex/blob/fdeb45cef8c18f92055d40df7231f3f33a56a71b/releases/2026.4.0-sdxl-turbo-fxbx1/2764d996e37745e5c25991a679f3f1bbb2848547079baa4ccb9c06d5d50874f3/USAGE.md) | [모델 파일](https://huggingface.co/softandsweet/stabilityai-sdxl-turbo-rngd-fxbex/resolve/fdeb45cef8c18f92055d40df7231f3f33a56a71b/releases/2026.4.0-sdxl-turbo-fxbx1/2764d996e37745e5c25991a679f3f1bbb2848547079baa4ccb9c06d5d50874f3/SDXL-Turbo.fxbx) |
| [FLUX.2-klein-4B](https://huggingface.co/softandsweet/black-forest-labs-flux-2-klein-4b-rngd-fxbex) | 이미지 생성 | 2026.4.0-klein4b-fxbx1 | BF16 / 2026.4.0 | Apache-2.0 · [상세](models/0f7b0d97e9fb510cbe1c4d001df893e0037fa898073bc7bbc67c14e087d1df6a.json) | [예제](https://huggingface.co/softandsweet/black-forest-labs-flux-2-klein-4b-rngd-fxbex/blob/57aa0bef31f963de10edd84f803ea2f0c5475be6/releases/2026.4.0-klein4b-fxbx1/9f5377b386f2125ac087b1a858a4ab859e79abb9d2a3a2a500e6221eac1f8724/USAGE.md) | [모델 파일](https://huggingface.co/softandsweet/black-forest-labs-flux-2-klein-4b-rngd-fxbex/resolve/57aa0bef31f963de10edd84f803ea2f0c5475be6/releases/2026.4.0-klein4b-fxbx1/9f5377b386f2125ac087b1a858a4ab859e79abb9d2a3a2a500e6221eac1f8724/FLUX.2-klein-4B.fxbx) |
| [Qwen3.5-9B-FP8-dynamic](https://huggingface.co/softandsweet/redhatai-qwen3-5-9b-fp8-dynamic-rngd-fxbex) | 대규모 언어 모델 | ctx262k-prefix-v1 | BF16 / 2026.4.0 | Apache-2.0 · [상세](models/219661cac8d837fa5f5ee9b71133e4d2912b33a89b9fa44b78dd6ee1ae7ed533.json) | [예제](https://huggingface.co/softandsweet/redhatai-qwen3-5-9b-fp8-dynamic-rngd-fxbex/blob/5246087b3c4135600ed65132d764f89ee576b2be/releases/ctx262k-prefix-v1/e90007707da70915ca59571805b22b8cb885f77a759725eb425a54064424f201/USAGE.md) | [모델 파일](https://huggingface.co/softandsweet/redhatai-qwen3-5-9b-fp8-dynamic-rngd-fxbex/resolve/5246087b3c4135600ed65132d764f89ee576b2be/releases/ctx262k-prefix-v1/e90007707da70915ca59571805b22b8cb885f77a759725eb425a54064424f201/model.fxbex) |
| [TripoSR](https://huggingface.co/softandsweet/stabilityai-triposr-rngd-fxbex) | 3D 생성 | 0.2.0-experimental-textured | FP32 / 2026.4.0 | MIT · [상세](models/f6674a554ffc5aaf7c1f09687923cf9876c8e4d1c604fc00217d9a27927d433e.json) | [예제](https://huggingface.co/softandsweet/stabilityai-triposr-rngd-fxbex/blob/c2f9a8cb81cd0df85f7105192bf85678c968dd34/releases/0.2.0-experimental-textured/bb4a82470e43f293c01add8b08e698aca45ed14cb882fbea9eb6dcae73f3543f/USAGE.md) | [모델 파일](https://huggingface.co/softandsweet/stabilityai-triposr-rngd-fxbex/resolve/c2f9a8cb81cd0df85f7105192bf85678c968dd34/releases/0.2.0-experimental-textured/bb4a82470e43f293c01add8b08e698aca45ed14cb882fbea9eb6dcae73f3543f/model.fxbex) |
| [yolo11-onnx](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex) | 컴퓨터 비전 | 2026.4.0-opt3-sample1 | Mixed / 2026.4.0 | AGPL-3.0 · [상세](models/e54beb719f8ec6fd9d6caa9d5bedfbba1a038c9fc5bbac973a987310d2becebb.json) | [예제](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex/blob/5b6604c64477d3d518ab6a15070ab78d6005998c/releases/2026.4.0-opt3-sample1/4d52ac8d4f672be214505866b0e6129b4d17642194fbd49e2a9ce1989d46d55b/USAGE.md) | [모델 파일](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex/resolve/5b6604c64477d3d518ab6a15070ab78d6005998c/releases/2026.4.0-opt3-sample1/4d52ac8d4f672be214505866b0e6129b4d17642194fbd49e2a9ce1989d46d55b/yolo11-onnx.fxbex) |

<!-- furyawesome:models:end -->

- 호환되는 Furiosa RNGD 하드웨어·드라이버·SDK가 필요합니다. 모델별 환경과 추가 의존성은 HF 안내를 따르세요.
- 원본·패키지 라이선스와 검증 범위는 각 모델의 상세 정보에서 확인하세요.
- [fxbX](https://github.com/smallstep-zzz/fxbX) · [OpenFury Hub](https://openfury-hub.softandsweet5.chatgpt.site/) · [기여 안내](CONTRIBUTING.md)
