# PP-OCRv5 Mobile 사용법

SDK 2026.4.0이 동작하는 RNGD 서버에서 실행합니다. 전체 페이지의 글자 영역을 찾고 줄별 텍스트와 좌표를 돌려줍니다.

## 샘플 실행

```bash
python -m venv --system-site-packages fury
source fury/bin/activate
python -m pip install fxbx==0.9.9 paddlex==3.7.2 opencv-contrib-python==4.10.0.84 pyclipper==1.4.0 shapely==2.2.0
fxbx run PaddlePaddle/PP-OCRv5_mobile_det_onnx --sample
```

샘플은 `Furiosa OCR`, `RNGD 2026`, `Text Recognition` 세 줄입니다. 결과를 저장하려면 마지막 명령에 `-o result.json`을 붙입니다. JSON에는 텍스트·신뢰도·글자 영역 좌표가 들어갑니다.

## 서빙

```bash
fxbx serve PaddlePaddle/PP-OCRv5_mobile_det_onnx --port 8000
```

같은 서버의 다른 터미널에서 호출합니다(`requests` 필요).

```python
from pathlib import Path
import requests

response = requests.post("http://127.0.0.1:8000/predict", json={"image": "sample"}, timeout=120)
response.raise_for_status()
text = response.json()["text"]
if len(text) > 2000:
    Path("result.txt").write_text(text, encoding="utf-8")
    print(Path("result.txt").resolve())
else:
    print(text)
```

직접 만든 이미지는 `{"image_base64": "..."}`로 보냅니다. JPEG·PNG·WebP 한 장, 최대 45KiB·400만 화소입니다. 서버의 임의 파일 경로는 받지 않습니다. 원격 접속은 SSH 터널을 연 뒤 같은 Python 예제를 사용하세요.

```bash
ssh -L 8000:127.0.0.1:8000 YOUR_SERVER
```

## 환경과 검증 범위

- NPU 1장, fusion 8 / Single, Furiosa Torch SDK·TCC 2026.4.0, Torch 2.10.0+cpu, fxbX 0.9.9에서 검증했습니다.
- 원본 탐지·인식 가중치와 컴파일 실행물을 패키지에 포함합니다. 실행 시 원본 HF 모델이나 FuryNo5가 필요하지 않습니다.
- 탐지는 FP32 320×320, 인식은 FP32 48×320 고정 프로필입니다. 큰 문서의 작은 글자는 잘리거나 누락될 수 있습니다. 영어 자체 샘플·원본 중국어 페이지·빈 페이지를 검사했으며 광범위한 언어/문서 정확도 평가는 아닙니다.
- 이미지 디코딩·리사이즈·정규화, DB 박스 후처리·크롭·CTC 문자열 복원은 명시적인 CPU 작업입니다. 두 신경망의 CPU 폴백과 실행 중 컴파일은 0건이었습니다.
- 전체 페이지의 따뜻한 실행 중앙값은 자체 샘플 0.880초, 원본 페이지 1.067초, 빈 페이지 0.316초입니다. 실제 요청의 전처리·NPU 호출·후처리를 포함하며 서버에 따라 달라집니다.

SDK가 없는 PC에는 `pip install fxbx`만으로 NPU 실행 환경이 생기지 않습니다. Furiosa 드라이버와 2026.4.0 SDK가 설치된 Linux RNGD 서버의 SDK Python을 사용하세요. `fxbx doctor`로 확인하고, 다른 Python에서 CLI를 실행한다면 `FXBEX_WORKER_PYTHON`에 검증한 SDK Python의 절대 경로를 지정합니다. SDK를 새로 설치해야 하면 [fxbX 환경 안내](https://github.com/smallstep-zzz/fxbX#readme)를 먼저 확인하세요.

정확한 비 SDK 의존성은 이 저장소의 `requirements.txt`, 전체 수치·NPU 추적·CLI·HTTP 검증은 `VALIDATION.json`에 기록했습니다.
