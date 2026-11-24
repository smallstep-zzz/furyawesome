# SigLIP Base Patch16-224 사용법

사진 한 장에 어울리는 설명을 찾습니다. 샘플은 골든 리트리버 사진을 세 후보 설명과 비교합니다. `best_index`는 0부터 시작하는 후보 번호이고 `results`는 입력 순서의 설명과 점수입니다.

```bash
python -m venv fury
source fury/bin/activate
python -m pip install fxbx
fxbx run siglip-base-patch16-224 --sample
```

결과를 현재 폴더에 저장하려면 마지막 명령에 `-o result.json`을 붙입니다.

## HTTP 서빙과 Python 호출

첫 번째 터미널에서 모델을 서빙합니다.

```bash
fxbx serve siglip-base-patch16-224 --port 8000
```

서버가 준비되면 같은 서버의 다른 터미널에서 아래 Python 코드를 실행합니다. `requests`가 필요합니다. 짧은 응답은 터미널에 표시하고, 2,000자를 넘으면 현재 폴더에 저장합니다.

```python
from pathlib import Path
import json
import requests

payload = {'image': 'sample',
 'texts': ['a photo of two cats lying on a couch',
           'a photo of a golden retriever dog',
           'a photo of an airplane']}

response = requests.post(
    "http://127.0.0.1:8000/predict", json=payload, timeout=300,
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

직접 보낸 사진은 `image` 대신 `image_base64`에 JPEG, PNG 또는 WebP의 Base64 값을 넣습니다. fxbX 0.9.9의 요청 본문 상한은 64 KiB입니다. 이미지 원본은 45 KiB 이하로 압축하고 `texts`에 후보를 1–8개 전달하세요. 텍스트는 토크나이저 기준 최대 64토큰이며 긴 입력은 잘립니다.

## SDK 환경 준비

Furiosa RNGD 한 장과 호환 드라이버, Furiosa SDK 2026.4.0이 필요합니다. SDK가 설치된 Python 경로를 알고 있으면 `FXBEX_WORKER_PYTHON`에 지정합니다. 없음으로 표시되는 Python 패키지는 해당 SDK 환경의 `python -m pip`로 설치합니다. 이 릴리스의 원래 Hugging Face 가중치는 첫 실행에 공식 캐시에 받습니다. [Furiosa SDK 설치 안내](https://developer.furiosa.ai/v2026.4.0/en/get_started/prerequisites.html)

```bash
/path/to/sdk/python -m pip install 'fxbx==0.9.9' 'transformers==5.22.1' 'pillow==13.0.0' 'safetensors==0.8.0' 'sentencepiece==0.2.1' 'protobuf==6.33.5'
FXBEX_WORKER_PYTHON=/path/to/sdk/python fxbx run siglip-base-patch16-224 --sample
```
