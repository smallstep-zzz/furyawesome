# FLUX.2 Klein 4B 사용법

## 1. 샘플 실행

```bash
fxbx run FLUX.2-klein-4B --sample -o result.png
```

현재 폴더에 `result.png`를 저장합니다. 첫 실행에 필요한 모델은 fxbX가 받아 캐시에 저장합니다.

## 2. 서빙하고 Python으로 호출

첫 번째 터미널에서 모델을 서빙합니다.

```bash
fxbx serve FLUX.2-klein-4B --port 8000
```

서버가 준비되면 같은 서버의 다른 터미널에서 아래 Python 코드를 실행합니다. `requests`가 필요합니다. 짧은 응답은 터미널에 표시하고, 2,000자를 넘으면 현재 폴더에 저장합니다.

```python
from pathlib import Path
import json
import requests
from shutil import copyfile

payload = {'prompt': 'A small penguin on a sunny island'}

response = requests.post(
    "http://127.0.0.1:8000/predict", json=payload, timeout=300,
)
response.raise_for_status()
result = response.json()
source = Path(result['image_path'])
output = Path('result.png')
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

다운로드만 하려면 `fxbx fetch FLUX.2-klein-4B`을 실행합니다.

Furiosa RNGD에서 512×512 이미지를 만드는 FLUX.2 Klein 4B 패키지입니다. BF16·4단계·시퀀스 길이 128·fusion 8 / Single 프로필입니다.

25번 서버에서 새로 캡처한 SDK 실행물 205개를 담았습니다. 별도 오프라인 프로세스에서 이 파일을 열어 512×512 PNG를 생성했고, 같은 프롬프트와 시드의 빌드 이미지와 SHA-256이 일치했습니다. 공식 NPU 트레이스는 Task 9,708개를 기록했습니다. SDK CPU 폴백, 런타임 컴파일 호출, 외부 Hugging Face 모델 캐시 접근은 각각 0건이었습니다.

### Furiosa SDK 준비

- SDK가 없으면 RNGD 서버에서 모델에 명시된 버전에 맞춰 드라이버와 Python SDK를 설치합니다. [Furiosa 공식 안내](https://developer.furiosa.ai/latest/en/get_started/upgrade_guide.html)
- SDK가 설치된 Python에 `python -m pip install --upgrade 'fxbx[weights]'`로 fxbX를 설치합니다. 다른 환경에서 fxbX를 호출할 경우 SDK Python의 절대 경로를 지정합니다.

```bash
export FXBEX_WORKER_PYTHON=/path/to/sdk/bin/python
fxbx doctor
```

`Missing required packages in Python`에 표시된 경로와 누락 목록을 확인합니다. 필요한 패키지가 모두 설치되어 있고 버전만 다르면 `--allow-sdk-mismatch`로 실행을 시도할 수 있습니다.
