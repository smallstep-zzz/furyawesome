# FuryAwesome

Furiosa RNGD에서 사용할 수 있는 fxbX 모델을 모아 놓은 카탈로그입니다.
모델명을 누르면 Hugging Face에서 다운로드, 입력·출력 예제와 상세 사용법을 확인할 수 있습니다.
[FuryAwesome 플레이스](https://furyawesome.softandsweet5.chatgpt.site/)에서 모델을 찾아보고 포팅을 요청할 수 있습니다.

CLI 실행을 지원하는 모델은 이름으로 샘플을 실행할 수 있습니다. 실행 계획 패키지는 표의 Python 예제와 별도 가중치를 사용합니다.

RNGD 두 장 이상을 사용하는 구성은 [다중 NPU 릴리스](MULTI_NPU.md)에서 배치 방식과 실행 검증 상태를 확인할 수 있습니다.

```bash
pip install --upgrade fxbx
fxbx run FLUX.2-klein-4B --sample
```

표에 등록한 모델은 Furiosa RNGD에서 각 패키지의 샘플 실행을 검증했습니다. 프롬프트를 지정하는 방법은 표의 **사용법**에서 샘플 실행, 서빙, Python 호출을 확인할 수 있습니다. 첫 실행 시 fxbX가 모델 이름으로 파일을 받아 캐시에 저장합니다.

<!-- furyawesome:models:start -->

게시일은 현재 배포 릴리스 기준이며 한국시간(KST)입니다.

| 모델 | 용도 | 버전 | 게시일 | 정밀도 / SDK | 라이선스 | 사용법 | 다운로드 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [all-MiniLM-L6-v2](https://huggingface.co/softandsweet/sentence-transformers-all-minilm-l6-v2-rngd-fxbx) | 임베딩 | 2026.4.0-embed16-fxbx2 | 2026-11-19 | BF16 / 2026.4.0 | Apache-2.0 · [상세](models/e87bdb72f540caf77bfa53e7a6545ef0d30c1fa54c7867adc71d41df29ae1278.json) | [예제](usage/all-minilm-l6-v2.md) | [모델 파일](https://huggingface.co/softandsweet/sentence-transformers-all-minilm-l6-v2-rngd-fxbx/resolve/b5b3e44a0a298efd65feb17c0b2c58fecf3f0bf5/all-MiniLM-L6-v2.fxbx) |
| [YOLO26n](https://huggingface.co/softandsweet/ultralytics-yolo26n-rngd-fxbx) | 컴퓨터 비전 | 2026.4.0-yolo26n-coarse10-fxbx2 | 2026-11-26 | FP32 / 2026.4.0 | AGPL-3.0 · [상세](models/91f1be5e952a98aea9f29191e60107ab0c4407abe94ef4d8025b5612e9735fc0.json) | [예제](usage/assets.md) | [모델 파일](https://huggingface.co/softandsweet/ultralytics-yolo26n-rngd-fxbx/resolve/4483810272d3732106365d7d27cec660c91ae9c4/releases/2026.4.0-yolo26n-coarse10-fxbx2/45125818ff0c85452f0af7617b1ef88c8be04be48c3bbede9f710c1aaca7b138/YOLO26n.fxbx) |
| [Depth-Anything-V2-Small-hf](https://huggingface.co/softandsweet/depth-anything-depth-anything-v2-small-hf-rngd-fxbx) | 컴퓨터 비전 | 2026.4.0-depth518-bf16-fxbx2 | 2026-11-19 | BF16 / 2026.4.0 | Apache-2.0 · [상세](models/8da2e4ae3734231064d73e8e79204d0301b7f7b87948f7dd7005a89a88db8e88.json) | [예제](usage/depth-anything-v2-small-hf.md) | [모델 파일](https://huggingface.co/softandsweet/depth-anything-depth-anything-v2-small-hf-rngd-fxbx/resolve/de305a6332d57727a285671afe97859b496a863a/depth-anything-v2-small-bf16.fxbx) |
| [flux-3-image-klein](https://huggingface.co/softandsweet/black-forest-labs-flux-3-image-klein-rngd-fxbex) | 이미지 생성 | 2026.4.0-flux3-fxbx1 | 2026-11-22 | BF16 / 2026.4.0 | FLUX Kommunity License v1.0 · [상세](models/460b2152a7ae563bf7c89d31152613e70f80bbd6cb6d7e0ee88367a3cebad1e5.json) | [예제](usage/flux-3-image-klein.md) | [모델 파일](https://huggingface.co/softandsweet/black-forest-labs-flux-3-image-klein-rngd-fxbex/resolve/56ba7b2ce4c2e886498e0f022d65586b6ac9be9a/releases/2026.4.0-flux3-fxbx1/2924f79ead2de03c4aa1a64a62dc5231fd4dd604334e7e6676df3493d9eb8f51/flux3-image-klein.fxbx) |
| [FLUX.2-klein-4B](https://huggingface.co/softandsweet/black-forest-labs-flux-2-klein-4b-rngd-fxbex) | 이미지 생성 | 2026.4.0-klein4b-fxbx1-ctx2048 | 2026-11-25 | BF16 / 2026.4.0 | Apache-2.0 · [상세](models/43805df71d9437d68e4c2e00f395ffe36a0750b3307c71633d095cb85d1cb469.json) | [예제](usage/flux.2-klein-4b.md) | [모델 파일](https://huggingface.co/softandsweet/black-forest-labs-flux-2-klein-4b-rngd-fxbex/resolve/f56496ff2f7e62f0746010584a3b326a0290e19d/releases/2026.4.0-klein4b-fxbx1-ctx2048/e07d750065f2ec16e8a83db36fe9e6564e1b948100966b8ee2a3e12c288a552f/FLUX.2-klein-4B-ctx512-2048.fxbx) |
| [Julia-1](https://huggingface.co/softandsweet/supersoniclabs-julia-1-rngd-fxbex) | 의사결정 | 2026.4.0-choice40-fxbx2 | 2026-11-19 | BF16 / 2026.4.0 | Apache-2.0 · [상세](models/a3afe409b6d34cd27f78a61c1c166cc72219150fef314a0a00077e065cbd502f.json) | [예제](usage/julia-1.md) | [모델 파일](https://huggingface.co/softandsweet/supersoniclabs-julia-1-rngd-fxbex/resolve/e22b9c73ae2d94acb89c3d3cc3b8f309096c1282/releases/2026.4.0-choice40-fxbx2/769747c36fbcccb01fbeac2666ae00b351aa9304385200a48555c13a92d8a996/Julia-1.fxbx) |
| [laya-typed-decisions](https://huggingface.co/softandsweet/convaiinnovations-laya-typed-decisions-rngd-fxbx) | 의사결정 | 2026.4.0-choice42-fxbx4 | 2026-11-20 | BF16 / 2026.4.0 | Apache-2.0 · [상세](models/54a3aca6df63218241f750ed5486c38e25598dec30f0da7eb7b27c29b7e228e3.json) | [예제](usage/laya-typed-decisions.md) | [모델 파일](https://huggingface.co/softandsweet/convaiinnovations-laya-typed-decisions-rngd-fxbx/resolve/1ee4940dbc1db8ab0ddc4eb946088cb099ca55dc/Laya-Typed-Decisions.fxbx) |
| [mobilenetv3\_small\_100.lamb\_in1k](https://huggingface.co/softandsweet/timm-mobilenetv3-small-100-lamb-in1k-rngd-fxbx) | 컴퓨터 비전 | 2026.4.0-small224-fxbx1 | 2026-11-25 | FP32 / 2026.4.0 | Apache-2.0 · [상세](models/376164958f4f8bc6403d214e21a64869aa39ee3592a02a6fc830566dc8ebbc27.json) | [예제](usage/mobilenetv3_small_100.lamb_in1k.md) | [모델 파일](https://huggingface.co/softandsweet/timm-mobilenetv3-small-100-lamb-in1k-rngd-fxbx/resolve/574a26cb2723f9df12afab8dc2ffa7e6598bb17e/mobilenetv3-small-224.fxbx) |
| [PP-OCRv5\_mobile\_det\_onnx](https://huggingface.co/softandsweet/paddlepaddle-pp-ocrv5-mobile-rngd-fxbx) | 컴퓨터 비전 | 2026.4.0-ocrv5-mobile-fxbx1 | 2026-11-25 | FP32 / 2026.4.0 | Apache-2.0 · [상세](models/f21586c2ba229de1d87f10431493d070e55bc91f6810aa5d8c79fbfb4f944bdf.json) | [예제](usage/pp-ocrv5_mobile_det_onnx.md) | [모델 파일](https://huggingface.co/softandsweet/paddlepaddle-pp-ocrv5-mobile-rngd-fxbx/resolve/596555df2444600f20a9146fc88582ad4139a188/pp-ocrv5-mobile.fxbx) |
| [Qwen-Image-2.1](https://huggingface.co/softandsweet/qwen-qwen-image-2-1-rngd-fxbex) | 이미지 생성 | 2026.4.0-qwenimage21-512-fxbx1 | 2026-11-24 | Mixed / 2026.4.0 | Qwen Research License Agreement · [상세](models/cd703847171827446af5e7be371e1062d932d7eece04d9ac8be3116132975013.json) | [예제](https://huggingface.co/softandsweet/qwen-qwen-image-2-1-rngd-fxbex) | [모델 파일](https://huggingface.co/softandsweet/qwen-qwen-image-2-1-rngd-fxbex/resolve/c7be42b4c9fa349d4e691ec1c0b0645fe4d7d4ea/releases/2026.4.0-qwenimage21-512-fxbx1/b62c95f5498b7da89b1e9774aeb9ac6c36db96b7c8bcdf5e4ebf741e5b024ee5/Fury-Image-Replay-2.1.fxbx) |
| [rf-detr-base](https://huggingface.co/softandsweet/roboflow-rf-detr-base-rngd-fxbx) | 컴퓨터 비전 | 2026.4.0-base560-fxbx1 | 2026-11-24 | Mixed/BF16 / 2026.4.0 | Apache-2.0 · [상세](models/8212a9936814db201b7b427383758ae9dd0a0a6b4c3356a531bb2660893f0dde.json) | [예제](https://huggingface.co/softandsweet/roboflow-rf-detr-base-rngd-fxbx) | [모델 파일](https://huggingface.co/softandsweet/roboflow-rf-detr-base-rngd-fxbx/resolve/7310361443ee13c22d2ef235c1953c2c4d980a46/rf-detr-base.fxbx) |
| [RF-DETR-Nano-BF16](https://huggingface.co/softandsweet/roboflow-rf-detr-nano-bf16-rngd-fxbx) | 컴퓨터 비전 | 2026.4.0-bf16-384-merged86-fxbx1 | 2026-11-27 | BF16 / 2026.4.0 | Apache-2.0 · [상세](models/cc172f1ae6ac66d8e1eaf793de66ffd326c5f196f51f98dcfb98b450feafd47a.json) | [예제](usage/rf-detr-nano.md) | [모델 파일](https://huggingface.co/softandsweet/roboflow-rf-detr-nano-bf16-rngd-fxbx/resolve/cdc01a8ad888126e97a66f2d36926403189638fd/releases/2026.4.0-bf16-384-merged86-fxbx1/ccf62616012ae4264da6a5eddc8e3a7ed39e5452c1d2aa02888186ac6b880e02/RF-DETR-Nano-BF16.fxbx) |
| [rf-detr-seg-nano](https://huggingface.co/softandsweet/roboflow-rf-detr-seg-nano-rngd-fxbx) | 컴퓨터 비전 | 2026.4.0-seg312-fxbx3 | 2026-11-20 | BF16 / 2026.4.0 | Apache-2.0 · [상세](models/a96ee48b2e2b94aaa8b91dcf8a66f5ed2e6a3de8194ec4e6928b5715f6875c89.json) | [예제](usage/rf-detr-seg-nano.md) | [모델 파일](https://huggingface.co/softandsweet/roboflow-rf-detr-seg-nano-rngd-fxbx/resolve/67172ecbe578f10d14c099933826cddb01a4b326/rf-detr-seg.fxbx) |
| [sdxl-turbo](https://huggingface.co/softandsweet/stabilityai-sdxl-turbo-rngd-fxbex) | 이미지 생성 | 2026.4.0-sdxl-turbo-merged-lora-fxbx1 | 2026-11-24 | Mixed / 2026.4.0 | Stability AI Community License Agreement · [상세](models/4e487b37bd33d2e6e159d96feb9d52f6166b65cfda28a12be001395e7878966e.json) | [예제](usage/sdxl-turbo.md) | [모델 파일](https://huggingface.co/softandsweet/stabilityai-sdxl-turbo-rngd-fxbex/resolve/3a3587fc93c05a03418c15e75c7f4ea28ee25465/releases/2026.4.0-sdxl-turbo-merged-lora-fxbx1/0d39ee1ec8e09a2385c48db884e3a6c486cf5d6f2749f8f1c1fabe2a279852f8/sdxl-turbo-lora.fxbx) |
| [siglip-base-patch16-224](https://huggingface.co/softandsweet/google-siglip-base-patch16-224-rngd-fxbx) | 임베딩 | 2026.4.0-bf16-224-fxbx1 | 2026-11-25 | BF16 / 2026.4.0 | Apache-2.0 · [상세](models/f6816c8e99ab4dc4004317effe7ac2ac87f4731f649d0a09a7e1c1021b1cb611.json) | [예제](usage/siglip-base-patch16-224.md) | [모델 파일](https://huggingface.co/softandsweet/google-siglip-base-patch16-224-rngd-fxbx/resolve/4648bae37733465cce2794888df68d661ce2679d/siglip-base-patch16-224.fxbx) |
| [TripoSR](https://huggingface.co/softandsweet/stabilityai-triposr-rngd-fxbex) | 3D 생성 | 2026.4.0-mesh256-fxbx6 | 2026-11-22 | BF16 / 2026.4.0 | MIT · [상세](models/033e5239257c76f7cab2a08fbaebd6705701339884bafed38caeed076c8d97ae.json) | [예제](usage/triposr.md) | [모델 파일](https://huggingface.co/softandsweet/stabilityai-triposr-rngd-fxbex/resolve/fef58d9b4d38068019571d3dfee589ae1cc26a80/releases/2026.4.0-mesh256-fxbx6/71cac8ac8fc3ad92d6395c1f5a906e71f426a9128bf23fcc871a0b427046ba46/TripoSR.fxbx) |
| [yolo11-onnx](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex) | 컴퓨터 비전 | 2026.4.0-opt3-fxbx1-setup1 | 2026-11-14 | Mixed / 2026.4.0 | AGPL-3.0 · [상세](models/00ca4f648c1dcd8f9994bd2940daa2c9d7371ac83df47f93cff778f195a7c559.json) | [예제](usage/yolo11-onnx.md) | [모델 파일](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex/resolve/f1eace438198884a4c020145a36d165cf1776f2e/releases/2026.4.0-opt3-fxbx1-setup1/f6e279e44345fd9510feddf62aaec448ef9d16aca08d468f6a6f90a4c8f05823/yolo11-onnx.fxbx) |

<!-- furyawesome:models:end -->

[RF-DETR Seg Nano의 RNGD 가상환경별 실행 검증](usage/rf-detr-seg-nano.md)


## 처음 사용하는 분을 위한 fxbX 빠른 시작

**준비물:** Furiosa RNGD 서버(Linux), 해당 서버에서 동작하는 Furiosa 드라이버·SDK, Python 환경, 모델을 받을 디스크 공간이 필요합니다. `fxbx`는 SDK·드라이버를 대신 설치하지 않으며, 각 모델에 필요한 어댑터와 라이선스도 확인해야 합니다.

모델별 **예제**에서 Python·SDK와 의존성을 먼저 설치합니다. FLUX.2 예제 환경에서 다음 명령으로 실행합니다.

```bash
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
from pathlib import Path
from shutil import copyfile

import requests

response = requests.post(
    "http://127.0.0.1:8000/predict",
    json={"prompt": "A small penguin on a sunny island"},
    timeout=300,
)
response.raise_for_status()
copyfile(response.json()["image_path"], "result.png")
print(Path("result.png").resolve())
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

## 선택형 LoRA

모델별 효용·호환 조건·라이선스는 [LoRA 안내](usage/loras.md)와 [공통 LoRA 카탈로그](lora-catalog.json)에서 확인하세요. 후보와 실제 NPU 검증 상태를 구분합니다.
