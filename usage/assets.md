# YOLO26n 객체 탐지

SDK 2026.4.0이 준비된 RNGD 서버에서 실행하세요. `ultralytics/assets`는 이 릴리스의 공식 GitHub 원본 저장소를 가리키는 카탈로그 실행명입니다.

## 샘플 실행

```bash
python -m venv fury
source fury/bin/activate
python -m pip install fxbx
fxbx run ultralytics/assets --sample -o result.json
```

버스 사진에서 버스·사람·정지 표지판 등 6개 검출 결과를 저장합니다. 객체 탐지 결과이므로 JSON에 위치·점수·클래스가 들어갑니다.

## 서빙

```bash
fxbx serve ultralytics/assets --port 8000
```

같은 서버의 다른 터미널에서 호출합니다. 결과가 길면 현재 폴더의 `result.json`에 저장합니다.

```python
import json
from pathlib import Path
from urllib.request import Request, urlopen

request = Request("http://127.0.0.1:8000/predict",
                  data=json.dumps({"image": "sample"}).encode(),
                  headers={"Content-Type": "application/json"})
with urlopen(request, timeout=120) as response:
    text = json.dumps(json.load(response), ensure_ascii=False, indent=2)
if len(text) > 2000:
    Path("result.json").write_text(text, encoding="utf-8")
    print(Path("result.json").resolve())
else:
    print(text)
```

원격 서버에는 로컬 PC에서 터널을 열고 같은 코드를 사용하세요.

```bash
ssh -L 8000:127.0.0.1:8000 YOUR_SERVER
```

<details>
<summary>처음 설치하기 · 직접 만든 사진 · 성능과 검증 범위</summary>

- Linux, RNGD 1장, fusion8/Single, Python3.11, Furiosa Torch·TCC2026.4.0, Torch2.10.0, fxbX0.9.9에서 확인했습니다. SDK가 없는 PC에는 `pip install fxbx`만으로 NPU 환경이 생기지 않습니다.
- SDK Python에서 실행하거나 `FXBEX_WORKER_PYTHON`에 SDK Python의 절대 경로를 지정하세요. `fxbx doctor`와 [환경 안내](https://github.com/smallstep-zzz/fxbX#readme)를 참고하세요. 일반 가상환경에서 SDK를 찾지 못하면 기존 SDK 환경을 활성화하거나 해당 Python으로 가상환경을 준비하세요.
- NumPy·Pillow·Safetensors와 검증한 정확한 버전은 `requirements.txt`에 있습니다. 드라이버·SDK 바이너리는 포함하지 않습니다.
- JSON 요청은 `{"image_base64":"..."}`도 받습니다. JPEG·PNG·WebP 한 장, 최대45KiB·400만 화소입니다. 임의 서버 파일 경로는 받지 않습니다. `mirror:true`는 좌우 반전 요청입니다.
- 입력은 **640×640 중앙크롭**입니다. 좌표는 원본 사진이 아닌 중앙크롭 후 이미지 기준이며 범위를 약간 벗어날 수 있습니다. 신뢰도0.25 이상인 COCO80종 검출을 반환합니다. 다른 해상도·분할·포즈·깊이 모델은 이 패키지에 포함하지 않습니다.
- 원본 버스 사진과 반전 사진에서 CPU 기준 점수·상자·클래스를 검증했습니다. 신경망7276단계와 순위head1281단계 전부 공식 NPU Task로 확인됐으며, 미추적 단계·모델 CPU폴백·실행 중 컴파일은0건입니다. 원본 데이터셋 전체의 정확도 평가 결과는 아닙니다.
- **따뜻한 전체 NPU 파이프라인0.979–0.981초, HTTP1.020–1.032초**입니다. CLI 새 프로세스는 약7.3초였습니다. 보관된 원래 CPU 기준 약0.079초보다 느립니다. 가속을 보장하는 릴리스가 아닌 기능 포트이며, 많은 세부 실행단계를 줄이는 최적화가 남아 있습니다.
- 이미지 디코딩·크롭·정규화와 신뢰도 필터·라벨 정리는 명시적 CPU 작업입니다. 백본부터 순위head까지의 모델 계산은 NPU에서 실행합니다.
- fxbX0.9.9에서 직접 JSON을 전달할 때는 `fxbx predict MODEL --input request.json`을 사용하세요. `run --input`의 사용자 어댑터 분기에는 알려진 오류가 있어 샘플 실행과 구분합니다.
- 원본은 [Ultralytics 공식 GitHub v8.4.0의 yolo26n.onnx](https://github.com/ultralytics/assets/releases/tag/v8.4.0)입니다. GitHub tag commit과 ONNX SHA를 함께 보존했습니다. 다른 HF 체크포인트에서 빌드했다고 주장하지 않습니다. AGPL-3.0 조건과 동봉 라이선스를 확인하세요. 원본 ONNX·가중치·소스 재현 자료·샘플이 패키지 안에 있습니다.

</details>
