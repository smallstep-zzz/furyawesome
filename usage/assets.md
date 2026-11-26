# YOLO26n 사용법

## 1. 샘플 실행

SDK가 설치된 Python 환경에서 실행하세요.

```bash
python -m venv --system-site-packages fury
source fury/bin/activate
python -m pip install --upgrade fxbx requests
fxbx run YOLO26n --sample
```

첫 실행에 필요한 모델은 fxbX가 받아 캐시에 저장합니다. 다운로드만 하려면 `fxbx fetch YOLO26n`을 실행합니다.

## 2. 서빙하고 Python으로 호출

첫 번째 터미널에서 모델을 서빙합니다.

```bash
python -m venv --system-site-packages fury
source fury/bin/activate
python -m pip install --upgrade fxbx requests
fxbx serve YOLO26n --port 8000
```

서버가 준비되면 같은 서버의 다른 터미널에서 아래 Python 코드를 실행합니다. `requests`가 필요합니다. 짧은 응답은 터미널에 표시하고, 2,000자를 넘으면 현재 폴더에 저장합니다.

```python
from pathlib import Path
import json
import requests

payload = {'image': 'sample'}

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

## 설치 및 릴리스 파일 직접 다운로드

Runtime: https://github.com/smallstep-zzz/fxbX

Use a Furiosa RNGD host with the matching driver, SDK and Python dependencies. The package contains compiled kernels and bundled model code; weights are included or downloaded from the pinned original checkpoint as declared by the release. load only trusted packages.

Required SDK: 2026.4.0; runtime: 0.10.2

Install or upgrade the published fxbX runtime in the compatible SDK environment:

```bash
python -m pip install --upgrade "fxbx>=0.10.2"
fxbx --version
fxbx doctor
```

카탈로그 등록 전이거나 이 릴리스 파일을 직접 받아야 할 때만 아래 절차를 사용합니다.

```python
from huggingface_hub import hf_hub_download
import hashlib, shutil
path = hf_hub_download(repo_id='softandsweet/ultralytics-yolo26n-rngd-fxbx', filename='releases/2026.4.0-yolo26n-coarse10-fxbx2/45125818ff0c85452f0af7617b1ef88c8be04be48c3bbede9f710c1aaca7b138/YOLO26n.fxbx')
digest = hashlib.sha256()
with open(path, "rb") as stream:
    for block in iter(lambda: stream.read(1024 * 1024), b""):
        digest.update(block)
assert digest.hexdigest() == '45125818ff0c85452f0af7617b1ef88c8be04be48c3bbede9f710c1aaca7b138'
shutil.copyfile(path, "model.fxbx")
```

```bash
fxbx inspect model.fxbx
fxbx validate model.fxbx
fxbx run model.fxbx --sample
```

For non-chat models, `fxbx predict` sends named JSON inputs to the bundled adapter. Create `inputs.json` using the model-specific contract below.

## Model-specific usage

사진 속 사람·차량·동물 등 COCO 80종 물체의 위치와 점수를 찾습니다. 카메라 화면의 물체 수를 세거나 탐지 기능을 시제품에 붙일 때 사용할 수 있습니다. 고정 640×640 중앙 크롭 입력이며 좌표는 이 크롭 이미지 기준입니다. 단일 RNGD에서 신경망 본체를 10개 큰 단위로 실행합니다. 이미지 처리와 원본 TopK·정수 인덱스 순위 처리는 CPU에서 수행합니다. 연속 입력은 전처리·전송·후처리를 포함해 9번 58.18 FPS, 19번 56.44 FPS였습니다(각 640프레임, 1프레임 미리 준비, NPU 배치 1). 단일 HTTP 요청은 60–77ms로 연속 처리 FPS의 역수와 다릅니다. 원본/반전 샘플 2개의 수치 일치와 NPU 추적을 확인했으며, 전체 COCO 정확도나 임의 입력의 정확도를 새로 평가한 결과는 아닙니다. CPU 폴백·실행 중 컴파일은 0건이었습니다. 원본은 Hugging Face 체크포인트가 아니라 GitHub ultralytics/assets v8.4.0의 고정 SHA256 ONNX입니다. 모델·샘플은 AGPL-3.0, 어댑터·FuryNo5 소스는 각 Apache-2.0 고지를 유지합니다. SDK 바이너리는 포함하지 않습니다.

Static validation and publication are not NPU inference acceptance. Consult the release validation evidence.
