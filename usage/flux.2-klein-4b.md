# FLUX.2 Klein 4B 사용법

문장으로 512×512 이미지를 생성합니다. 채팅 템플릿을 포함해 최대 2,048토큰을 받으며 각 요청은 들어갈 수 있는 가장 작은 검증 프로필을 사용합니다.

fxbX 0.10.2, Furiosa SDK 2026.4.0의 RNGD fusion 8에서 검증했습니다. 2,049토큰 요청은 실행 전에 거부되며, 같은 작업자로 다음 요청을 처리합니다.

## 샘플 실행

```bash
python -m venv fury
source fury/bin/activate
python -m pip install --upgrade fxbx
fxbx run black-forest-labs/FLUX.2-klein-4B@2026.4.0-klein4b-fxbx1-ctx2048 --sample -o result.png
```

## 서빙하고 Python으로 호출

```bash
fxbx serve black-forest-labs/FLUX.2-klein-4B@2026.4.0-klein4b-fxbx1-ctx2048 --port 8000
```

서버가 준비되면 같은 호스트의 다른 터미널에서 실행합니다. Python 예제에는 `requests`가 필요합니다.

```python
from pathlib import Path
import json
import requests
from shutil import copyfile

payload = {'height': 512,
 'prompt': 'A small red fox beside a mountain lake at sunrise, golden autumn trees',
 'seed': 20261102,
 'steps': 4,
 'width': 512}

response = requests.post(
    "http://127.0.0.1:8000/predict", json=payload, timeout=600,
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

5번 RNGD에서 모델 적재 후 첫 짧은 요청은 74.4초, 이어서 보낸 2,048토큰 요청은 24.3초가 걸렸습니다. 캐시 상태가 다른 개별 관측값입니다.

[고정 릴리스와 설치 안내](https://huggingface.co/softandsweet/black-forest-labs-flux-2-klein-4b-rngd-fxbex/resolve/f56496ff2f7e62f0746010584a3b326a0290e19d/releases/2026.4.0-klein4b-fxbx1-ctx2048/e07d750065f2ec16e8a83db36fe9e6564e1b948100966b8ee2a3e12c288a552f/USAGE.md)
