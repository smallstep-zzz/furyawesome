# TripoSR 실행 방법

## 1. 샘플 실행

```bash
fxbx run TripoSR --sample
```

동봉된 이미지로 3D 모델을 만들고 결과 경로를 표시합니다. 첫 실행에 필요한 모델은 fxbX가 받아 캐시에 저장합니다.

## 2. 서빙하고 Python으로 호출

첫 번째 터미널에서 모델을 서빙합니다.

```bash
fxbx serve TripoSR --port 8000
```

서버가 준비되면 같은 서버의 다른 터미널에서 아래 Python 코드를 실행합니다. `requests`가 필요합니다. 짧은 응답은 터미널에 표시하고, 2,000자를 넘으면 현재 폴더에 저장합니다.

```python
from pathlib import Path
import json
import requests
from shutil import copyfile
from zipfile import ZipFile
from fxbex.hub import resolve_package

with ZipFile(resolve_package('TripoSR')) as package:
    Path('input-1-robot.png').write_bytes(package.read('samples/robot.png'))

payload = {'image': str(Path('input-1-robot.png').resolve()), 'output': './triposr-output'}
from tempfile import mkdtemp
payload["output"] = mkdtemp(prefix="model-output-", dir=Path.cwd())

response = requests.post(
    "http://127.0.0.1:8000/predict", json=payload, timeout=300,
)
response.raise_for_status()
result = response.json()
source = Path(result['mesh'])
output = Path('model.glb')
if source.resolve() != output.resolve():
    copyfile(source, output)
print(output.resolve())
source = Path(result['texture'])
output = Path('texture.png')
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

다운로드만 하려면 `fxbx fetch TripoSR`을 실행합니다.

VisionModel 컴파일러 힌트를 적용한 이미지→3D 실험용 모델입니다. 배포 파일에서 텍스처를 포함한 샘플 GLB 생성을 검증했습니다. 실행 환경에는 Transformers 4.35.0, xatlas 0.0.11, moderngl, glcontext 및 EGL이 필요합니다. CPU 기준의 엄격한 중간 텐서 오차 검증에는 알려진 편차가 있습니다.

### Furiosa SDK 준비

- SDK가 없으면 RNGD 서버에서 모델에 명시된 버전에 맞춰 드라이버와 Python SDK를 설치합니다. [Furiosa 공식 안내](https://developer.furiosa.ai/latest/en/get_started/upgrade_guide.html)
- SDK가 설치된 Python에 `python -m pip install --upgrade 'fxbx[weights]'`로 fxbX를 설치합니다. 다른 환경에서 fxbX를 호출할 경우 SDK Python의 절대 경로를 지정합니다.

```bash
export FXBEX_WORKER_PYTHON=/path/to/sdk/bin/python
fxbx doctor
```

`Missing required packages in Python`에 표시된 경로와 누락 목록을 확인합니다. 필요한 패키지가 모두 설치되어 있고 버전만 다르면 `--allow-sdk-mismatch`로 실행을 시도할 수 있습니다.
