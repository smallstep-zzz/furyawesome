# RF-DETR Nano · Furiosa RNGD

사진 한 장에서 물체 이름과 위치를 찾습니다. 모델은 고정 384×384 입력을 사용합니다.

## 샘플 실행

```bash
python -m venv fury
source fury/bin/activate
python -m pip install fxbx
fxbx run Roboflow/rf-detr-nano --sample -o result.safetensors
```

파일은 현재 폴더에 저장됩니다. `linear_99`는 `[1,300,91]` FP32 logits이고 `cat_13`은 `[1,300,4]` FP32 정규화 중심점·너비·높이입니다.

## 내 사진과 HTTP 호출

```bash
hf download softandsweet/roboflow-rf-detr-nano-rngd-fxbx rf-detr-nano.fxbx predict.py sample.png --local-dir .
python predict.py rf-detr-nano.fxbx --port 8000
```

같은 서버의 다른 터미널에서 호출합니다. `sample.png`를 내 사진 경로로 바꿀 수 있습니다.

```python
import json
from pathlib import Path
from urllib.request import Request, urlopen

request = Request(
    'http://127.0.0.1:8000/predict',
    json.dumps({'image': str(Path('sample.png').resolve())}).encode(),
    {'Content-Type': 'application/json'},
)
with urlopen(request, timeout=300) as response:
    detections = json.load(response)
result = Path('result.json')
result.write_text(json.dumps(detections, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(result.resolve())
```

서버 없이 사진 한 장을 처리할 때는 `python predict.py rf-detr-nano.fxbx sample.png -o result.json`을 실행합니다. 이미지 전·후처리는 CPU에서 수행하며 JSON에는 물체 이름·점수·원본 픽셀 좌표가 들어갑니다.

원격 서버는 `ssh -L 8000:127.0.0.1:8000 <서버>`로 연결할 수 있습니다. 요청의 `image`에는 서버에 이미 저장한 사진의 절대 경로를 사용합니다.

## SDK와 검증 범위

`fxbx doctor`로 SDK Python을 확인하세요. 검증 환경은 Furiosa SDK 2026.4.0, `fxbx==0.9.9`, `torch==2.10.0+cpu`, `transformers==5.20.2`입니다. 모델명 조회를 사용할 수 없으면 고정 리비전에서 FXBX와 `rf-detr-nano.fxbx.sample.safetensors`를 같은 폴더에 내려받아 `fxbx run ./rf-detr-nano.fxbx --sample -o result.safetensors`를 실행합니다. FXBX SHA-256은 `4130f5abf20c0415c9e5e0ded4e080107af48c059b148a2dfa1a3ab7d2782492`입니다. [Furiosa SDK 안내](https://developer.furiosa.ai/v2026.4.0/en/) · [fxbX](https://github.com/smallstep-zzz/fxbX)

실제 사진 두 장의 신뢰도 0.5 이상 검출 수와 클래스가 CPU 기준과 같았고 최소 박스 IoU는 0.999999였습니다. NPU 실행 계획 49,521단계에서 CPU 폴백과 실행 중 컴파일은 0건이었습니다. 적재는 7.31초, 전처리·후처리를 제외한 30회 반복 추론은 P50 0.920초, P95 0.927초였습니다. 이 버전은 여러 실행 단계를 개별 호출합니다.

체크포인트 `Roboflow/rf-detr-nano@9f201577d9415f0378084748d27e68586e6b3600`와 함께 사용합니다. `sample.png`는 scikit-image에서 배포한 NASA 퍼블릭 도메인 사진입니다. [원본 모델](https://huggingface.co/Roboflow/rf-detr-nano) · [사진 출처](https://scikit-image.org/docs/stable/api/skimage.data.html#skimage.data.astronaut)
