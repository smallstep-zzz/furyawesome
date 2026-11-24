# MobileNetV3 Small · Furiosa RNGD

사진 한 장을 ImageNet-1k의 1,000개 범주로 분류합니다. 고정 입력은 224×224입니다.

## 샘플 실행

```bash
python -m venv fury
source fury/bin/activate
python -m pip install fxbx
fxbx run timm/mobilenetv3_small_100.lamb_in1k --sample -o scores.safetensors
```

`scores.safetensors`는 현재 폴더에 저장되며 FP32 로짓 `[1,1000]`을 담습니다.

## 내 사진과 HTTP 호출

```bash
python -m pip install pillow
hf download softandsweet/timm-mobilenetv3-small-100-lamb-in1k-rngd-fxbx mobilenetv3-small-224.fxbx predict.py sample.png --local-dir .
python predict.py mobilenetv3-small-224.fxbx --port 8000
```

다른 터미널의 Python에서 사진을 전달해 상위 5개 클래스 번호와 점수를 받습니다.

```python
import base64
import json
from pathlib import Path
from urllib.request import Request, urlopen

photo = base64.b64encode(Path('sample.png').read_bytes()).decode()
req = Request('http://127.0.0.1:8000/predict', json.dumps({'image_base64': photo}).encode(),
              {'Content-Type': 'application/json'})
with urlopen(req, timeout=30) as response:
    print(json.load(response))
```

이미지 한 장을 직접 실행하려면 `python predict.py mobilenetv3-small-224.fxbx sample.png -o result.json`을 사용합니다. 사진 전처리와 결과의 softmax 및 Top-5 계산은 CPU에서 수행합니다. Hugging Face 원본 체크포인트는 FXBX가 지정한 리비전에서 자동으로 읽습니다.

원격 RNGD 서버를 이용할 때는 내 컴퓨터에서 `ssh -L 8000:127.0.0.1:8000 <서버>`를 실행한 뒤 같은 Python 코드를 호출합니다.

## SDK와 검증 범위

`fxbx doctor`에서 Furiosa SDK 2026.4.0을 사용할 수 있는 Python을 확인하세요. 런타임에는 `fxbx[weights]==0.9.9`와 호환 Furiosa SDK Python이 필요합니다. 이름 조회를 사용할 수 없으면 아래 두 파일을 같은 폴더에 받고 로컬 FXBX를 지정합니다.

```bash
hf download softandsweet/timm-mobilenetv3-small-100-lamb-in1k-rngd-fxbx mobilenetv3-small-224.fxbx mobilenetv3-small-224.fxbx.sample.safetensors --local-dir .
fxbx run ./mobilenetv3-small-224.fxbx --sample -o scores.safetensors
```

공개 FXBX SHA-256은 `c9126b9e969f9c2c1ecfdc5ff4a1d4cbba8ead4d18fb79f8ee38e3a132903004`입니다. [Furiosa SDK 설치 안내](https://developer.furiosa.ai/v2026.4.0/en/) · [fxbX](https://github.com/smallstep-zzz/fxbX)

원본 모델 리비전은 `76b303ec28c466e9df37f4745dfb7aef20ab87ae`입니다. 샘플 사진은 scikit-image에서 제공하는 NASA 공개 이미지입니다. [원본 체크포인트](https://huggingface.co/timm/mobilenetv3_small_100.lamb_in1k/tree/76b303ec28c466e9df37f4745dfb7aef20ab87ae) · [사진 출처](https://scikit-image.org/docs/stable/api/skimage.data.html#skimage.data.astronaut)

단일 RNGD의 그래프 지연은 전처리·후처리를 제외해 P50 76.36ms, P95 76.77ms입니다. 실제 사진 두 장에서 FP32 CPU 기준과 Top-5 순서가 같았습니다. NPU 실행 2,011단계에서 CPU 폴백과 실행 중 컴파일이 없었습니다.
