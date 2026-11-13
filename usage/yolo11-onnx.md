# yolo11-onnx 실행 방법

## 1. 샘플 실행

```bash
fxbx run yolo11-onnx --sample
```

동봉된 버스 이미지의 탐지 결과와 결과 경로를 표시합니다. 첫 실행에 필요한 모델은 fxbX가 받아 캐시에 저장합니다.

## 2. 서빙하고 Python으로 호출

첫 번째 터미널에서 모델을 서빙합니다.

```bash
fxbx serve yolo11-onnx --port 8000
```

서버가 준비되면 같은 서버의 다른 터미널에서 아래 Python 코드를 실행합니다. `requests`가 필요합니다. 짧은 응답은 터미널에 표시하고, 2,000자를 넘으면 현재 폴더에 저장합니다.

```python
from pathlib import Path
import json
import requests
from shutil import copyfile
from zipfile import ZipFile
from fxbex.hub import resolve_package

with ZipFile(resolve_package('yolo11-onnx')) as package:
    Path('input-1-bus.jpg').write_bytes(package.read('bus.jpg'))

payload = {'image': str(Path('input-1-bus.jpg').resolve())}

response = requests.post(
    "http://127.0.0.1:8000/predict", json=payload, timeout=300,
)
response.raise_for_status()
result = response.json()
source = Path(result['output'])
source = source / 'detections.png'
output = Path('detections.png')
if source.resolve() != output.resolve():
    copyfile(source, output)
print(output.resolve())
text = json.dumps(result, ensure_ascii=False, indent=2)
filename = "result.json"
if len(text) > 2000:
    Path(filename).write_text(text + "\n", encoding="utf-8")
    print(Path(filename).resolve())
else:
    print(text)
```

## 설치 및 실행 환경

```bash
python -m pip install --upgrade "fxbx[weights]>=0.8.4" requests
```

다운로드만 하려면 `fxbx fetch yolo11-onnx`을 실행합니다.

합성곱과 활성화 융합, 연속 입력 레이아웃을 적용한 YOLO11n입니다. 640×640 단일 이미지의 탐지 결과를 검증했습니다.

### Furiosa SDK 준비

- SDK가 없으면 RNGD 서버에서 모델에 명시된 버전에 맞춰 드라이버와 Python SDK를 설치합니다. [Furiosa 공식 안내](https://developer.furiosa.ai/latest/en/get_started/upgrade_guide.html)
- SDK가 설치된 Python에 `python -m pip install --upgrade 'fxbx[weights]'`로 fxbX를 설치합니다. 다른 환경에서 fxbX를 호출할 경우 SDK Python의 절대 경로를 지정합니다.

```bash
export FXBEX_WORKER_PYTHON=/path/to/sdk/bin/python
fxbx doctor
```

`Missing required packages in Python`에 표시된 경로와 누락 목록을 확인합니다. 필요한 패키지가 모두 설치되어 있고 버전만 다르면 `--allow-sdk-mismatch`로 실행을 시도할 수 있습니다.
