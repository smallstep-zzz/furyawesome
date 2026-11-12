# FuryAwesome

Furiosa RNGD에서 사용할 수 있는 fxbX 모델을 모아 놓은 카탈로그입니다.
모델명을 누르면 Hugging Face에서 다운로드, 입력·출력 예제와 상세 사용법을 확인할 수 있습니다.

아래 표의 모델 이름을 복사해 넣으면 다운로드와 샘플 실행을 진행합니다.

```bash
pip install --upgrade fxbx
fxbx run FLUX.2-klein-4B --sample
fxbx run sdxl-turbo --sample
```

표에 등록한 모델은 Furiosa RNGD에서 각 패키지의 샘플 실행을 검증했습니다. 프롬프트를 지정하는 방법은 표의 **사용법**을 참고하세요.

<!-- furyawesome:models:start -->

| 모델 | 용도 | 버전 | 정밀도 / SDK | 라이선스 | 사용법 | 다운로드 |
| --- | --- | --- | --- | --- | --- | --- |
| [yolo11-onnx](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex) | 컴퓨터 비전 | 2026.4.0-opt3-fxbx1 | Mixed / 2026.4.0 | AGPL-3.0 · [상세](models/653fe2262db44fb995e5ef3c0c1dfd299ef691d44c8a63b5d9d43b5817a1beac.json) | [예제](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex/blob/2036bc00de68e753ac2c247ccae39bb4de5de8fe/releases/2026.4.0-opt3-fxbx1/d40ec9f9fc18c8cb5ad247513859ea130938ec09527bb99527d109e0899511b8/USAGE.md) | [모델 파일](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex/resolve/2036bc00de68e753ac2c247ccae39bb4de5de8fe/releases/2026.4.0-opt3-fxbx1/d40ec9f9fc18c8cb5ad247513859ea130938ec09527bb99527d109e0899511b8/yolo11-onnx.fxbx) |
| [sdxl-turbo](https://huggingface.co/softandsweet/stabilityai-sdxl-turbo-rngd-fxbex) | 이미지 생성 | 2026.4.0-sdxl-turbo-fxbx1 | BF16 / 2026.4.0 | Stability AI Community License · [상세](models/af12bc1a9b6d3a1872dbbb955a7837c60b62c1691d7907b572e3008cd9157422.json) | [예제](https://huggingface.co/softandsweet/stabilityai-sdxl-turbo-rngd-fxbex/blob/fdeb45cef8c18f92055d40df7231f3f33a56a71b/releases/2026.4.0-sdxl-turbo-fxbx1/2764d996e37745e5c25991a679f3f1bbb2848547079baa4ccb9c06d5d50874f3/USAGE.md) | [모델 파일](https://huggingface.co/softandsweet/stabilityai-sdxl-turbo-rngd-fxbex/resolve/fdeb45cef8c18f92055d40df7231f3f33a56a71b/releases/2026.4.0-sdxl-turbo-fxbx1/2764d996e37745e5c25991a679f3f1bbb2848547079baa4ccb9c06d5d50874f3/SDXL-Turbo.fxbx) |
| [FLUX.2-klein-4B](https://huggingface.co/softandsweet/black-forest-labs-flux-2-klein-4b-rngd-fxbex) | 이미지 생성 | 2026.4.0-klein4b-fxbx1 | BF16 / 2026.4.0 | Apache-2.0 · [상세](models/0f7b0d97e9fb510cbe1c4d001df893e0037fa898073bc7bbc67c14e087d1df6a.json) | [예제](https://huggingface.co/softandsweet/black-forest-labs-flux-2-klein-4b-rngd-fxbex/blob/57aa0bef31f963de10edd84f803ea2f0c5475be6/releases/2026.4.0-klein4b-fxbx1/9f5377b386f2125ac087b1a858a4ab859e79abb9d2a3a2a500e6221eac1f8724/USAGE.md) | [모델 파일](https://huggingface.co/softandsweet/black-forest-labs-flux-2-klein-4b-rngd-fxbex/resolve/57aa0bef31f963de10edd84f803ea2f0c5475be6/releases/2026.4.0-klein4b-fxbx1/9f5377b386f2125ac087b1a858a4ab859e79abb9d2a3a2a500e6221eac1f8724/FLUX.2-klein-4B.fxbx) |

<!-- furyawesome:models:end -->

- 호환되는 Furiosa RNGD 하드웨어·드라이버·SDK가 필요합니다. 모델별 환경과 추가 의존성은 HF 안내를 따르세요.
- 원본·패키지 라이선스와 검증 범위는 각 모델의 상세 정보에서 확인하세요.
- [fxbX](https://github.com/smallstep-zzz/fxbX) · [OpenFury Hub](https://openfury-hub.softandsweet5.chatgpt.site/) · [기여 안내](CONTRIBUTING.md)
