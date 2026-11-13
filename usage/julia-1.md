# Julia-1 사용법

## 1. 샘플 실행

```bash
fxbx run Julia-1 --sample
```

결제 문의의 선택과 확률을 표시합니다. 첫 실행에 필요한 모델은 fxbX가 받아 캐시에 저장합니다.

## 2. 서빙하고 Python으로 호출

첫 번째 터미널에서 모델을 서빙합니다.

```bash
fxbx serve Julia-1 --port 8000
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

## 설치 및 실행 환경

```bash
python -m pip install --upgrade "fxbx[weights]>=0.8.4" requests
```

다운로드만 하려면 `fxbx fetch Julia-1`을 실행합니다.

결제 문의의 선택과 확률을 표시합니다.

Furiosa Torch/TCC 2026.4.0, Torch 2.10.0+cpu, Transformers 5.20.2가 필요합니다.

## 모델 범위

질문 하나, 선택지 세 개, 총 40토큰의 FP32 의사결정 프로필입니다. 원본 Julia-1 체크포인트와 공식 토크나이저를 사용했습니다. 5번 RNGD에서 결제 샘플이 CPU 기준과 같은 billing을 반환했고 확률 최대 절대 차이는 0.00000147이었습니다. 공식 트레이스에 Runnable 호출 2,577개와 NPU Task 5,154개, SDK CPU 폴백 0건이 기록됐습니다. 토큰화와 확률 정규화는 호스트에서 수행합니다.

## 문제 해결

`fxbx doctor`로 SDK와 NPU를 확인합니다. 입력이 길면 질문이나 선택지 설명을 줄입니다.
