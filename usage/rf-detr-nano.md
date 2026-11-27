# RF-DETR Nano · BF16 고속 / FP32

사진에서 물체의 종류와 원본 픽셀 좌표를 찾습니다. 최신 기본 릴리스는 **BF16 고속 프로필**이며 기존 FP32 릴리스는 보존합니다. 배치1, 신경망 입력384×384이며 CPU에서 사진 크기를 변환합니다.

| 비교 | FP32 | BF16 |
| --- | ---: | ---: |
| 신경망 반복 실행 |207.55ms|18.79ms|
| COCO2017 검증5,000장 AP |48.0233|47.9804|

신경망 약11.04배, AP −0.0429점입니다. 첫 호출과3회 워밍업을 제외한4프로세스×24회 ABBA 비교이며 모델 적재·사진 전후처리·프로파일링은 제외합니다. 원본 기본 top300 후처리와 COCOeval maxDets100을 사용했습니다. BF16은 FP32 원시 텐서와 동일하지 않습니다.

검증 환경은 **Python3.11.18, Furiosa Torch/TCC2026.4.0, Torch2.10.0+cpu, fxbX0.10.2**입니다. 호환 SDK가 이미 설치된 Python에서 다음을 실행합니다. SDK를 새로 설치하거나 업그레이드하는 명령은 아닙니다.

## 설치와 샘플

```bash
python -m venv --system-site-packages fury
source fury/bin/activate
python -m pip install --upgrade fxbx==0.10.2 requests Pillow==13.0.0 huggingface_hub==1.33.0 numpy==2.4.6 safetensors==0.8.0 tokenizers==0.23.3 torchvision==0.25.0+cpu transformers==5.20.2
fxbx run RF-DETR-Nano-BF16 --sample
```

기존 fxbX 설정이 다른 SDK Python을 가리키는 경우, 위에서 만든 환경을 활성화한 뒤 아래 설정을 적용하고 다시 실행하세요.

```bash
export FXBEX_WORKER_PYTHON="$(python -c 'import sys; print(sys.executable)')"
fxbx run RF-DETR-Nano-BF16 --sample
```

원본 체크포인트 약122MB를 고정 revision에서 별도로 내려받아 SHA256을 검사합니다. 공개 FXBX에는 컴파일 결과, 파생 버퍼, 처리 설정, 어댑터와 샘플이 들어 있습니다.

## HTTP 서버

```bash
source fury/bin/activate
fxbx serve RF-DETR-Nano-BF16 --port 8000
```

같은 서버의 다른 터미널에서 동봉 샘플로 호출합니다. 내 사진을 쓰려면 아래 image 값을 서버에 있는 파일의 절대 경로로 바꾸세요.

```python
from pathlib import Path
import json
import requests
from zipfile import ZipFile
from fxbex.hub import resolve_package

with ZipFile(resolve_package('RF-DETR-Nano-BF16')) as package:
    Path('input-1-sample.png').write_bytes(package.read('assets/sample.png'))

payload = {'image': str(Path('input-1-sample.png').resolve()), 'threshold': 0.3}

response = requests.post(
    "http://127.0.0.1:8000/predict", json=payload, timeout=600,
)
response.raise_for_status()
result = response.json()
text = json.dumps(result, ensure_ascii=False, indent=2)
filename = "result.json"
if len(text) > 2000:
    Path(filename).write_text(text + "\n", encoding="utf-8")
    print(Path(filename).resolve())
else:
    print(text)
```

threshold는0..1, top_k는1..300입니다. 결과는 detections(class_id,label,score,box_xyxy), image_size(높이,너비), precision입니다. 사진 전처리·후처리는 CPU, 신경망은 NPU입니다.

로컬 상주 HTTP 샘플20회 중앙값49.05ms, 범위27.92–89.17ms였습니다. 첫 관측 호출과3회 워밍업 및 적재를 제외했으며 CPU 사진 처리·NPU·JSON을 포함합니다. 이 수치를 신경망 시간이나 고정 처리량으로 해석하지 마세요. 잘못된 threshold 요청은400으로 거부되고 다음 정상 호출이 성공했습니다.

## FP32를 유지하려면

```bash
fxbx run Roboflow/rf-detr-nano --version 2026.4.0-nano384-fxbx2-grouped --sample -o result.safetensors
```

[기존 FP32 모델 및 사진 처리 예제](https://huggingface.co/softandsweet/roboflow-rf-detr-nano-rngd-fxbx/tree/55afc6938902e883826014b8aec73839d9e089e5). FP32 패키지는 원시 logits와 boxes를 반환하는 기존 계약을 유지하며 BF16의 JSON 응답 계약과 다릅니다.

## 다운로드와 검증

[BF16 모델 카드](https://huggingface.co/softandsweet/roboflow-rf-detr-nano-bf16-rngd-fxbx) · [고정 파일](https://huggingface.co/softandsweet/roboflow-rf-detr-nano-bf16-rngd-fxbx/resolve/cdc01a8ad888126e97a66f2d36926403189638fd/releases/2026.4.0-bf16-384-merged86-fxbx1/ccf62616012ae4264da6a5eddc8e3a7ed39e5452c1d2aa02888186ac6b880e02/RF-DETR-Nano-BF16.fxbx) · [전체 검증 보고서](https://huggingface.co/softandsweet/roboflow-rf-detr-nano-bf16-rngd-fxbx/blob/main/validation.json)

버전: `2026.4.0-bf16-384-merged86-fxbx1`. SHA256: `ccf62616012ae4264da6a5eddc8e3a7ed39e5452c1d2aa02888186ac6b880e02`.

최종 파일의 새 소비자 프로세스에서 샘플2회, CPU 폴백0, 재컴파일0을 확인했습니다. 별도 공식 trace는 NPU Task200개, CPU route0개이며 원본 연산별 완전한 귀속을 의미하지 않습니다. 사진 처리의 정상 CPU 사용은 별도입니다.

원본: `Roboflow/rf-detr-nano@9f201577d9415f0378084748d27e68586e6b3600`. 원본·FuryNo5 어댑터는 Apache-2.0, SDK 라이브러리는 포함하지 않습니다. 샘플은 scikit-image 배포 NASA 퍼블릭 도메인 사진입니다. 이 탐지 패키지에는 적용 가능한 LoRA 실행 훅이 없습니다.
