# Julia-1 사용법

## 1. 샘플 실행

```bash
fxbx run SupersonicLabs/Julia-1 --sample
```

결제 문의의 선택과 확률을 표시합니다. 첫 실행에 필요한 모델은 fxbX가 받아 캐시에 저장합니다.

## 2. 서빙하고 Python으로 호출

첫 번째 터미널에서 모델을 서빙합니다.

```bash
fxbx serve SupersonicLabs/Julia-1 --port 8000
```

서버가 준비되면 같은 서버의 다른 터미널에서 아래 Python 코드를 실행합니다. `requests`가 필요합니다. 짧은 응답은 터미널에 표시하고, 2,000자를 넘으면 현재 폴더에 저장합니다.

```python
from pathlib import Path
import json
import requests

payload = {'state': 'I was charged twice for the same order.',
 'questions': {'team': {'type': 'choice',
                        'instructions': 'Which team should handle this request?',
                        'criteria': {'billing': 'Billing and payment disputes',
                                     'shipping': 'Shipping and delivery',
                                     'access': 'Account access and login'}}}}

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

## 처음 설치할 때

Linux RNGD 서버에서 호환 드라이버와 Furiosa Torch/TCC 2026.4.0, PyTorch 2.10.0+cpu를 준비합니다. Python 3.11 전용 환경에서 아래 명령을 실행합니다.

```bash
python -m pip install --upgrade "fxbx[weights]>=0.9.4" "transformers==5.20.2" requests
```

다운로드만 하려면 `fxbx fetch SupersonicLabs/Julia-1`을 실행합니다. 현재 카탈로그 릴리스는 `2026.4.0-choice40-fxbx2`입니다.

## 모델 범위

질문 하나, 선택지 세 개, 총 40토큰 이하의 의사결정 프로필입니다. 토큰화와 확률 정규화는 호스트에서 수행합니다.

furiosa-llm의 `.fxb`처럼 패키지에는 가중치 사본이 없습니다. 안의 실행 계획이 각 가중치를 원본 체크포인트 [SupersonicLabs/Julia-1@9c4e0c58](https://huggingface.co/SupersonicLabs/Julia-1/tree/9c4e0c5870f7841fb74a23033eab723b3fea7bd7)의 `model.safetensors` 텐서 이름에 연결합니다. fxbx는 적재할 때 이 파일을 Hugging Face 캐시로 받아 SHA-256을 확인하고 BF16으로 바꿔 NPU에 올립니다.

2026-11-19에 5번 RNGD 서버에서 공개 fxbx 0.9.4로 이전 FP32 릴리스와 문의 6개를 비교했습니다. 모두 같은 선택이었고 확률 차이는 최대 0.012였습니다. 병합 실행 파일이 패키지에 들어 있어 NPU 실행 횟수가 2,047번에서 162번으로, 요청당 시간(중앙값)이 245 ms에서 16.5 ms로 줄었습니다.

## 문제 해결

`fxbx doctor`로 SDK와 NPU를 확인합니다. 입력이 길면 질문이나 선택지 설명을 줄입니다.
