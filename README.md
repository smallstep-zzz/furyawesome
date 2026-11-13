# FuryAwesome

Furiosa RNGD에서 사용할 수 있는 fxbX 모델을 모아 놓은 카탈로그입니다.
모델명을 누르면 Hugging Face에서 다운로드, 입력·출력 예제와 상세 사용법을 확인할 수 있습니다.

CLI 실행을 지원하는 모델은 아래 표의 이름으로 다운로드하고 샘플을 실행할 수 있습니다. Laya Typed-Decisions는 표의 Python 예제와 별도 가중치를 사용합니다.

```bash
pip install --upgrade fxbx
fxbx run FLUX.2-klein-4B --sample
```

표에 등록한 모델은 Furiosa RNGD에서 각 패키지의 샘플 실행을 검증했습니다. 프롬프트를 지정하는 방법은 표의 **사용법**을 참고하세요.

<!-- furyawesome:models:start -->

| 모델 | 용도 | 버전 | 정밀도 / SDK | 라이선스 | 사용법 | 다운로드 |
| --- | --- | --- | --- | --- | --- | --- |
| [Julia-1](https://huggingface.co/softandsweet/supersoniclabs-julia-1-rngd-fxbex) | 의사결정 | 2026.4.0-choice40-fxbx1 | FP32 / 2026.4.0 | Apache-2.0 · [상세](models/100cf40ee9cd7d72e72a6e570e4cce8ff5580c1a62cb1b1a01090fc63ffd6901.json) | [예제](https://huggingface.co/softandsweet/supersoniclabs-julia-1-rngd-fxbex/blob/d978f8a871c2a3a3d199f64ade72a7b8c945e779/releases/2026.4.0-choice40-fxbx1/f0d220719b0366e3ab301f5fdd8cfe765f2dc76a873e553805cef4e277d0ef43/USAGE.md) | [모델 파일](https://huggingface.co/softandsweet/supersoniclabs-julia-1-rngd-fxbex/resolve/d978f8a871c2a3a3d199f64ade72a7b8c945e779/releases/2026.4.0-choice40-fxbx1/f0d220719b0366e3ab301f5fdd8cfe765f2dc76a873e553805cef4e277d0ef43/Julia-1.fxbx) |
| [TripoSR](https://huggingface.co/softandsweet/stabilityai-triposr-rngd-fxbex) | 3D 생성 | 2026.4.0-vision-fxbx1 | FP32 / 2026.4.0 | MIT · [상세](models/b9db2c69ef49fe4bae6565031be524b01c006a926bebf57522f42313d724045d.json) | [예제](https://huggingface.co/softandsweet/stabilityai-triposr-rngd-fxbex/blob/de9138f6a7d4d40a0ba29ea2f3cd24cd8bab8d24/releases/2026.4.0-vision-fxbx1/67aabf1557b7f6c82810bf33a0aa6aeb6753990b99ac74278f5cc7c5a874d8e2/USAGE.md) | [모델 파일](https://huggingface.co/softandsweet/stabilityai-triposr-rngd-fxbex/resolve/de9138f6a7d4d40a0ba29ea2f3cd24cd8bab8d24/releases/2026.4.0-vision-fxbx1/67aabf1557b7f6c82810bf33a0aa6aeb6753990b99ac74278f5cc7c5a874d8e2/TripoSR.fxbx) |
| [yolo11-onnx](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex) | 컴퓨터 비전 | 2026.4.0-opt3-fxbx1 | Mixed / 2026.4.0 | AGPL-3.0 · [상세](models/653fe2262db44fb995e5ef3c0c1dfd299ef691d44c8a63b5d9d43b5817a1beac.json) | [예제](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex/blob/2036bc00de68e753ac2c247ccae39bb4de5de8fe/releases/2026.4.0-opt3-fxbx1/d40ec9f9fc18c8cb5ad247513859ea130938ec09527bb99527d109e0899511b8/USAGE.md) | [모델 파일](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex/resolve/2036bc00de68e753ac2c247ccae39bb4de5de8fe/releases/2026.4.0-opt3-fxbx1/d40ec9f9fc18c8cb5ad247513859ea130938ec09527bb99527d109e0899511b8/yolo11-onnx.fxbx) |
| [sdxl-turbo](https://huggingface.co/softandsweet/stabilityai-sdxl-turbo-rngd-fxbex) | 이미지 생성 | 2026.4.0-sdxl-turbo-fxbx1 | BF16 / 2026.4.0 | Stability AI Community License · [상세](models/af12bc1a9b6d3a1872dbbb955a7837c60b62c1691d7907b572e3008cd9157422.json) | [예제](https://huggingface.co/softandsweet/stabilityai-sdxl-turbo-rngd-fxbex/blob/8d8ab664c484654f8edfeab2d0471648c5bd210c/releases/2026.4.0-sdxl-turbo-fxbx1/2764d996e37745e5c25991a679f3f1bbb2848547079baa4ccb9c06d5d50874f3/USAGE.md) | [모델 파일](https://huggingface.co/softandsweet/stabilityai-sdxl-turbo-rngd-fxbex/resolve/fdeb45cef8c18f92055d40df7231f3f33a56a71b/releases/2026.4.0-sdxl-turbo-fxbx1/2764d996e37745e5c25991a679f3f1bbb2848547079baa4ccb9c06d5d50874f3/SDXL-Turbo.fxbx) |
| [FLUX.2-klein-4B](https://huggingface.co/softandsweet/black-forest-labs-flux-2-klein-4b-rngd-fxbex) | 이미지 생성 | 2026.4.0-klein4b-fxbx1 | BF16 / 2026.4.0 | Apache-2.0 · [상세](models/0f7b0d97e9fb510cbe1c4d001df893e0037fa898073bc7bbc67c14e087d1df6a.json) | [예제](https://huggingface.co/softandsweet/black-forest-labs-flux-2-klein-4b-rngd-fxbex/blob/57aa0bef31f963de10edd84f803ea2f0c5475be6/releases/2026.4.0-klein4b-fxbx1/9f5377b386f2125ac087b1a858a4ab859e79abb9d2a3a2a500e6221eac1f8724/USAGE.md) | [모델 파일](https://huggingface.co/softandsweet/black-forest-labs-flux-2-klein-4b-rngd-fxbex/resolve/57aa0bef31f963de10edd84f803ea2f0c5475be6/releases/2026.4.0-klein4b-fxbx1/9f5377b386f2125ac087b1a858a4ab859e79abb9d2a3a2a500e6221eac1f8724/FLUX.2-klein-4B.fxbx) |
| [Laya Typed-Decisions](https://huggingface.co/softandsweet/convaiinnovations-laya-typed-decisions-rngd-fxbx) | 의사결정 | 2026.4.0-choice42-fxbx1 | FP32 / 2026.4.0 | Apache-2.0 · [상세](models/a04235d3e506c7813f3cc29edc0258843f840c3833c819d1dabc01bac1ac0520.json) | [Python 예제·가중치](https://huggingface.co/softandsweet/convaiinnovations-laya-typed-decisions-rngd-fxbx/blob/46163265e171c549be84893ed2d1cfc20b137dd0/README.md) | [모델 파일](https://huggingface.co/softandsweet/convaiinnovations-laya-typed-decisions-rngd-fxbx/resolve/46163265e171c549be84893ed2d1cfc20b137dd0/Laya-Typed-Decisions.fxbx) |

<!-- furyawesome:models:end -->


## 처음 사용하는 분을 위한 fxbX 빠른 시작

**준비물:** Furiosa RNGD 서버(Linux), 해당 서버에서 동작하는 Furiosa 드라이버·SDK, Python 환경, 모델을 받을 디스크 공간이 필요합니다. `fxbx`는 SDK·드라이버를 대신 설치하지 않으며, 각 모델에 필요한 어댑터와 라이선스도 확인해야 합니다.

먼저 RNGD 서버에서 설치와 모델 실행을 확인합니다.

```bash
python -m pip install --upgrade fxbx
fxbx doctor
fxbx run FLUX.2-klein-4B --sample
```

모델 이름은 위 표에서 확인합니다. 첫 실행 시 모델 다운로드 및 NPU 적재에 시간이 걸릴 수 있습니다. `fxbx run`의 `--sample`은 **등록된 샘플 입력으로 한 번 실행**하는 옵션입니다.

### 예제 1 — 이미지 생성 모델을 HTTP로 서빙하고 Python에서 호출하기

RNGD 서버에서 모델을 상주시킵니다.

```bash
fxbx serve FLUX.2-klein-4B --port 8000
```

서버에 접속한 **다른 터미널**에서 Python으로 요청합니다.

```python
import requests

response = requests.post(
    "http://127.0.0.1:8000/predict",
    json={"prompt": "A small penguin on a sunny island"},
    timeout=300,
)
response.raise_for_status()
print(response.json())  # 결과 형식과 이미지 저장 경로는 모델 어댑터별로 다릅니다.
```

기본 서버는 `127.0.0.1`에만 바인딩합니다. 원격 PC에서는 **SSH 포트 포워딩**으로 안전하게 접속할 수 있습니다.

**방법 A — 수동 연결**

1. **RNGD 서버**에서 `fxbx serve FLUX.2-klein-4B --port 8000`을 실행해 둡니다.
2. **내 PC**의 다른 터미널에서 아래 명령을 실행하고 연결을 유지합니다.

```bash
ssh -N -o ExitOnForwardFailure=yes \
  -L 127.0.0.1:8000:127.0.0.1:8000 \
  USER@RNGD_SERVER_IP
```

3. **내 PC**에서 위 Python `requests.post("http://127.0.0.1:8000/predict", ...)` 예제를 실행합니다. 요청은 SSH 터널을 통해 NPU 서버로 전달됩니다. `USER@RNGD_SERVER_IP`는 실제 SSH 계정과 서버 주소로 바꾸세요.

**방법 B — 스크립트 하나로 원격 서빙 + SSH 터널**

아래 명령을 **내 PC의 FuryAwesome 저장소 폴더**에서 실행하면 원격 `fxbx serve` 시작과 로컬 포트 연결을 한 번에 처리합니다.

```bash
bash scripts/serve-remote.sh USER@RNGD_SERVER_IP FLUX.2-klein-4B 8000
```

이후 다른 로컬 터미널에서 Python 예제를 실행하면 됩니다. 모델명을 생략하면 `FLUX.2-klein-4B`, 포트를 생략하면 `8000`을 사용합니다. `~/.ssh/config`에 설정한 SSH 별칭도 사용할 수 있습니다.

[serve-remote.sh 소스 보기](scripts/serve-remote.sh)

**사전 조건:** SSH 접속이 가능해야 하며, 원격 서버의 SSH 비대화형 실행 환경에서 `fxbx` 명령을 찾을 수 있어야 합니다. 가상환경·conda에서만 설치했다면 해당 환경을 원격 SSH 실행 환경에서 활성화하거나 `fxbx` 실행 경로를 설정하세요. 로컬 포트 8000이 비어 있어야 하고, 터미널을 닫거나 Ctrl+C를 누르면 원격 서비스와 터널도 종료됩니다. SSH 연결 문제를 해결하기 위해 호스트키 검사를 끄지 마세요.

`/predict`는 모델이 지원하는 입력 계약에 맞춰 호출해야 하며, 모든 모델에 동일한 API가 적용되는 것은 아닙니다.

### 예제 2 — Python에서 이미지 직접 생성하기

```bash
fxbx fetch FLUX.2-klein-4B
```

`fetch`가 출력하는 실제 패키지 경로를 아래에 지정합니다.

```python
from fxbx import ImageGeneration

package = "/path/to/downloaded/FLUX.2-klein-4B.fxbx"
with ImageGeneration(package) as model:
    result = model.generate(
        "A watercolor illustration of a penguin in a garden",
        seed=42,
    )
    print(result)  # 이미지 파일 또는 결과 위치는 패키지 어댑터 계약에 따릅니다.
```

이 API는 이미지 생성 파이프라인을 위한 **Python 인터페이스**입니다. 내부 NPU 계산과 이미지 디코딩·저장 작업은 모델 어댑터가 처리합니다.

### 예제 3 — PyTorch 텐서로 컴파일된 모델 호출하기

입출력이 텐서로 정의된 fxbX 패키지라면 `torch.nn.Module` 형태로도 사용할 수 있습니다.

```python
import torch
from fxbx import as_torch

package = "/path/to/tensor-model.fxbx"  # 텐서 입출력을 지원하는 패키지
with as_torch(package, output_device="cpu") as model:
    x = torch.randn(1, 3, 224, 224)  # 실제 입력 shape·dtype는 모델 계약에 맞추세요.
    output = model(x)
    print(output)
```

`as_torch()`는 **추론 전용**이며, 해당 패키지에 `predict_tensors` 어댑터가 있어야 합니다. 모델에 따라 입력이 여러 개일 수 있으므로 표의 **사용법**과 `fxbx describe <패키지>`로 입출력을 먼저 확인하세요. 일반적인 FLUX/SDXL 이미지 생성 파이프라인 전체가 이 API로 바로 실행되는 것은 아닙니다. 이미지 생성에는 위의 `ImageGeneration`을 사용하세요.

> **패키지 형식:** fxbX 패키지는 `.fxbx`(과거 `.fxbex`)이며, Furiosa의 공식 `.fxb` 파일과는 다릅니다. 공식 FXB는 `furiosa_llm` 등 해당 공식 런타임으로 실행합니다.

- 호환되는 Furiosa RNGD 하드웨어·드라이버·SDK가 필요합니다. 모델별 환경과 추가 의존성은 HF 안내를 따르세요.
- 원본·패키지 라이선스와 검증 범위는 각 모델의 상세 정보에서 확인하세요.
- [fxbX](https://github.com/smallstep-zzz/fxbX) · [OpenFury Hub](https://openfury-hub.softandsweet5.chatgpt.site/) · [기여 안내](CONTRIBUTING.md)
