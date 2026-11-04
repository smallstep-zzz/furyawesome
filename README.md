# furyawesome

## FXBEX 설치와 실행

[FXBEX](https://github.com/smallstep-zzz/FXBEX)는 Furiosa RNGD용 사전 컴파일 모델 패키지인 `.fxbex`를 검사하고 실행하는 도구입니다. Python 3.10–3.14 환경에서 설치하세요.

```bash
python -m pip install "git+https://github.com/smallstep-zzz/FXBEX.git@main"
python -m pip install huggingface_hub
fxbex --help
```

현재 등록된 YOLO11 패키지는 Furiosa SDK 2026.4.0과 PyTorch 2.10.0+cpu가 설치된 호스트를 대상으로 합니다. Python 어댑터용 추가 의존성은 같은 환경에 설치하세요. 아래 예시는 Python 3.11.18에서 검증했으며, `--no-deps`로 SDK와 PyTorch 의존성을 바꾸지 않습니다.

```bash
python -m pip install --no-deps onnx==1.17.0 onnx2torch==1.5.15 protobuf==5.29.5 numpy==2.4.6 Pillow==13.0.0
python -m pip install --no-deps --force-reinstall torchvision==0.25.0 --index-url https://download.pytorch.org/whl/cpu
```

실행할 `.fxbex` 패키지를 준비한 뒤, 먼저 내용을 확인하고 검증합니다. NPU 추론에는 모델과 호환되는 Furiosa SDK, PyTorch 및 필요한 모델 어댑터가 설치된 Linux 호스트가 필요합니다.

```bash
fxbex inspect model.fxbex
fxbex validate model.fxbex
```

채팅 모델은 `fxbex chat`, 비채팅 모델은 모델 어댑터 계약에 맞는 JSON과 `fxbex predict`로 실행합니다. 현재 YOLO11 패키지는 이미지 경로를 받습니다.

```json
{"image":"/absolute/path/to/bus.jpg"}
```

```bash
fxbex predict model.fxbex --input inputs.json -o result.json
```

YOLO11의 `result.json`에는 감지 상자·클래스·점수가 포함되고, 결과 이미지 경로도 반환됩니다. `validate`는 패키지와 실행 환경을 검사하며 추론 자체는 실행하지 않습니다. 상세 명령과 제한 사항은 [FXBEX README](https://github.com/smallstep-zzz/FXBEX#readme)를 참고하세요.

**Furiosa NPU 실행 패키지의 공개 메타데이터 카탈로그.**

- 모델 탐색: [OpenFury Hub](https://openfury-hub.softandsweet5.chatgpt.site/)
- 실제 FXBEX 파일: [Hugging Face](https://huggingface.co/)
- FXBEX 제작·게시 도구: [Furiosa-Hug-Anything](https://github.com/smallstep-zzz/Furiosa-Hug-Anything)

이 저장소에는 실행파일, 모델 가중치, 액세스 토큰을 업로드하지 않습니다. 모델별 원본·패키지 라이선스를 구분합니다. 목록 등록은 배포 권한이나 파일 안전성 검토를 대신하지 않습니다. 각 모델의 NPU 결과는 해당 항목에 적힌 테스트 범위만 설명하며 다른 환경에서의 동작을 보장하지 않습니다.

## 웹사이트 자동 반영

`catalog.json`은 OpenFury Hub가 읽는 공개 색인입니다. 모델 게시기는 `models/*.json`, `catalog.json`, 아래 README 목록을 **한 번의 GitHub 커밋으로** 갱신합니다. 웹사이트는 이 JSON을 주기적으로 읽으므로 모델이 추가돼도 별도 사이트 배포가 필요 없습니다.

## 등록된 모델

YOLO11 릴리스의 해시 확인, 입력 예시와 실행 안내는 [Hugging Face USAGE.md](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex/blob/ebc4c12cb75be1e778bc44c929a966145cb7b1ee/releases/2026.4.0-opt3-minimal1/cac265de482649f3aa020ceed99a3391daee10ab2d4fe7e8768ad685dc3a078d/USAGE.md)를 참고하세요.

<!-- furyawesome:models:start -->

| Model | Version | Target / precision | Source license | Package license | Download |
| --- | --- | --- | --- | --- | --- |
| [RedHatAI/Qwen3.5-9B-FP8-dynamic](models/ac5362c32ca10857d7958314ebf4f38ed6d198e36cebcca2c12a2025b437ff27.json) | 2026.4.0-portable1 | Furiosa RNGD / BF16 | Apache-2.0 | Apache-2.0 weights; bundled adapter license undeclared | [HF](https://huggingface.co/softandsweet/redhatai-qwen3-5-9b-fp8-dynamic-rngd-fxbex/resolve/edc74fbcf3109dcd5016896183e6d92566a55e3a/releases/2026.4.0-portable1/440c02aac9e9ac679a247f9efe9eb3bc8fcc9007204c4ee697210104c54d0774/model.fxbex) |
| [YOLO11n RNGD FXBEX (640, portable)](models/8ef9cc3f3ce8dc6fda9c043e14f2fa563a5699ca23d00c4dffc9f78e870825af.json) | 2026.4.0-opt3-minimal1 | Furiosa RNGD / Mixed | AGPL-3.0 | AGPL-3.0 weights; bundled source has no separate license; SDK host terms apply | [HF](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex/resolve/a90ba55456e501f15d0d4ec38d94f22d65fc4016/releases/2026.4.0-opt3-minimal1/cac265de482649f3aa020ceed99a3391daee10ab2d4fe7e8768ad685dc3a078d/model.fxbex) |

<details><summary>YOLO11n RNGD FXBEX (640, portable) — download and run</summary>

Use a compatible RNGD host. Copy the code block using GitHub’s copy button.

[Step-by-step usage and expected outputs](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex/blob/a90ba55456e501f15d0d4ec38d94f22d65fc4016/releases/2026.4.0-opt3-minimal1/cac265de482649f3aa020ceed99a3391daee10ab2d4fe7e8768ad685dc3a078d/USAGE.md)

```bash
python -m pip install git+https://github.com/smallstep-zzz/FXBEX.git@main
curl --fail --location https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex/resolve/a90ba55456e501f15d0d4ec38d94f22d65fc4016/releases/2026.4.0-opt3-minimal1/cac265de482649f3aa020ceed99a3391daee10ab2d4fe7e8768ad685dc3a078d/model.fxbex --output model.fxbex
printf '%s  model.fxbex
' cac265de482649f3aa020ceed99a3391daee10ab2d4fe7e8768ad685dc3a078d | sha256sum --check
fxbex doctor
fxbex validate model.fxbex
# Follow the linked usage guide for the model-specific input.
```

</details>

<details><summary>RedHatAI/Qwen3.5-9B-FP8-dynamic — download and run</summary>

Use a compatible RNGD host. Copy the code block using GitHub’s copy button.

[Step-by-step usage and expected outputs](https://huggingface.co/softandsweet/redhatai-qwen3-5-9b-fp8-dynamic-rngd-fxbex/blob/edc74fbcf3109dcd5016896183e6d92566a55e3a/releases/2026.4.0-portable1/440c02aac9e9ac679a247f9efe9eb3bc8fcc9007204c4ee697210104c54d0774/USAGE.md)

```bash
python -m pip install git+https://github.com/smallstep-zzz/FXBEX.git@main
curl --fail --location https://huggingface.co/softandsweet/redhatai-qwen3-5-9b-fp8-dynamic-rngd-fxbex/resolve/edc74fbcf3109dcd5016896183e6d92566a55e3a/releases/2026.4.0-portable1/440c02aac9e9ac679a247f9efe9eb3bc8fcc9007204c4ee697210104c54d0774/model.fxbex --output model.fxbex
printf '%s  model.fxbex
' 440c02aac9e9ac679a247f9efe9eb3bc8fcc9007204c4ee697210104c54d0774 | sha256sum --check
fxbex doctor
fxbex validate model.fxbex
fxbex chat model.fxbex
```

</details>

<!-- furyawesome:models:end -->


자세한 내용은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고하세요.


<!-- fxbex:examples:start -->

## 모델별 전체 실행 예제

호환 SDK가 준비된 RNGD 호스트에서 코드 블록의 복사 버튼을 사용하세요.



### YOLO11n RNGD FXBEX (640, portable)

[상세 입력·출력 및 검증 범위](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex/blob/a90ba55456e501f15d0d4ec38d94f22d65fc4016/releases/2026.4.0-opt3-minimal1/cac265de482649f3aa020ceed99a3391daee10ab2d4fe7e8768ad685dc3a078d/USAGE.md)

YOLO는 image.jpg가 없으면 단색 테스트 이미지를 생성합니다. 이 경우 검출 목록은 비어 있을 수 있습니다.

```bash
python -m pip install "git+https://github.com/smallstep-zzz/FXBEX.git@main"
python -m pip install huggingface_hub
python - <<'PYTHON'
from huggingface_hub import hf_hub_download
import hashlib, shutil, json
p = hf_hub_download('softandsweet/giangndm-yolo11-onnx-rngd-fxbex', 'releases/2026.4.0-opt3-minimal1/cac265de482649f3aa020ceed99a3391daee10ab2d4fe7e8768ad685dc3a078d/model.fxbex', revision='ebc4c12cb75be1e778bc44c929a966145cb7b1ee')
h = hashlib.sha256()
with open(p,"rb") as f:
    for b in iter(lambda:f.read(1024*1024),b""): h.update(b)
if h.hexdigest() != 'cac265de482649f3aa020ceed99a3391daee10ab2d4fe7e8768ad685dc3a078d': raise RuntimeError("Checksum mismatch")
shutil.copyfile(p,"model.fxbex")
from pathlib import Path
from PIL import Image
image=Path("image.jpg").resolve()
if not image.exists(): Image.new("RGB",(640,640),(120,150,180)).save(image)
with open("inputs.json","w") as f: json.dump({"image":str(image)},f)
PYTHON
fxbex doctor
fxbex validate model.fxbex
fxbex predict model.fxbex --input inputs.json -o result.json
cat result.json
```



### RedHatAI/Qwen3.5-9B-FP8-dynamic

[상세 입력·출력 및 검증 범위](https://huggingface.co/softandsweet/redhatai-qwen3-5-9b-fp8-dynamic-rngd-fxbex/blob/edc74fbcf3109dcd5016896183e6d92566a55e3a/releases/2026.4.0-portable1/440c02aac9e9ac679a247f9efe9eb3bc8fcc9007204c4ee697210104c54d0774/USAGE.md)

첫 다운로드 약 13.5 GB. 결과 JSON의 text에 답변이 표시됩니다.

```bash
python -m pip install "git+https://github.com/smallstep-zzz/FXBEX.git@main"
python -m pip install huggingface_hub
python - <<'PYTHON'
from huggingface_hub import hf_hub_download
import hashlib, shutil, json
p = hf_hub_download('softandsweet/redhatai-qwen3-5-9b-fp8-dynamic-rngd-fxbex', 'releases/2026.4.0-portable1/440c02aac9e9ac679a247f9efe9eb3bc8fcc9007204c4ee697210104c54d0774/model.fxbex', revision='a2d7585a4291ba8d7f6710ae9ec0db09fb5284ce')
h = hashlib.sha256()
with open(p,"rb") as f:
    for b in iter(lambda:f.read(1024*1024),b""): h.update(b)
if h.hexdigest() != '440c02aac9e9ac679a247f9efe9eb3bc8fcc9007204c4ee697210104c54d0774': raise RuntimeError("Checksum mismatch")
shutil.copyfile(p,"model.fxbex")
with open("inputs.json","w") as f: json.dump({"messages":[{"role":"user","content":"What is 2+2? Reply briefly."}]},f)
PYTHON
fxbex doctor
fxbex validate model.fxbex
fxbex chat model.fxbex --input inputs.json -o result.json
cat result.json
```

<!-- fxbex:examples:end -->
