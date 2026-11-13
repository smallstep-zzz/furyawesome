# TripoSR 실행 방법

## 1. 샘플 실행

Linux의 Furiosa RNGD 서버에서 실행합니다. Furiosa Torch 2026.4.0, PyTorch 2.10.0+cpu와 호환 드라이버가 필요합니다. 검증 환경은 Transformers 4.40.2와 Mesa EGL을 사용했습니다.

Ubuntu 22.04에서 EGL이 없다면 시스템에 설치합니다.

```bash
sudo apt-get install libegl1-mesa-dev libegl-mesa0 libgl1-mesa-dri
```

Python 3.11로 TripoSR 전용 환경을 만듭니다. Conda를 쓰는 경우에도 전용 환경의 Python이 3.11인지 확인하세요. Python 3.14에서는 이전 `tokenizers` wheel을 찾지 못해 소스 빌드가 시작될 수 있습니다.

```bash
python3.11 -m venv .venv-triposr
source .venv-triposr/bin/activate
python --version
python -m pip install 'fxbx @ git+https://github.com/smallstep-zzz/fxbX.git@ea2b501'
python -m pip install --only-binary=tokenizers 'transformers==4.40.2' 'huggingface-hub==0.36.2' \
  trimesh scikit-image einops omegaconf xatlas moderngl requests
fxbx run TripoSR --sample -o result.json
```

동봉된 로봇 이미지로 텍스처가 포함된 GLB를 만듭니다. GLB와 텍스처 경로는 각각 `result.json`의 `mesh`와 `texture`에 기록됩니다. 다운로드만 하려면 `fxbx fetch TripoSR`을 실행하세요.

## 2. 서빙하고 Python으로 호출

RNGD 서버의 첫 번째 터미널에서 모델을 서빙합니다.

```bash
fxbx serve TripoSR --port 8000
```

같은 서버의 두 번째 터미널에서 Python으로 호출합니다.

```python
from pathlib import Path
from tempfile import mkdtemp
from zipfile import ZipFile

import requests
from fxbex.hub import resolve_package

image = Path("robot.png").resolve()
with ZipFile(resolve_package("TripoSR")) as package:
    image.write_bytes(package.read("samples/robot.png"))

output = mkdtemp(prefix="triposr-", dir=Path.cwd())
response = requests.post(
    "http://127.0.0.1:8000/predict",
    json={"image": str(image), "output": output},
    timeout=1800,
)
response.raise_for_status()
result = response.json()
print(result["mesh"])
print(result["texture"])
```

## 검증 범위

`2026.4.0-vision-fxbx1-compat1`에 지원 범위가 포함되어 있습니다. 동일 실행물로 Python 3.10.12와 TCC 2026.4.0, Python 3.11.18과 TCC 2026.4.0 및 2026.4.1에서 256px UV 텍스처 GLB와 NPU 실행을 확인했습니다. 기본 텍스처 해상도는 2048px로 실행 시간이 길어질 수 있습니다. Transformers 5.20.2에서는 체크포인트 로드가 실패했습니다. 이 번들은 실험판이며 일부 중간 텐서에 알려진 수치 편차가 있습니다.
