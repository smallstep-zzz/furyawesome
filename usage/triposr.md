# TripoSR 실행 방법

이미지 한 장에서 텍스처가 입혀진 3D 메시(GLB)를 만듭니다. Linux의 Furiosa RNGD 서버에서 실행합니다.

## 1. 설치

텍스처 베이킹에 Mesa EGL이 필요합니다. 없다면 시스템에 설치합니다.

```bash
sudo apt-get install libegl1-mesa-dev libegl-mesa0 libgl1-mesa-dri
```

Python 3.11로 전용 환경을 만듭니다.

```bash
python -m venv .venv-triposr
source .venv-triposr/bin/activate
python -m pip install --index-url https://download.pytorch.org/whl/cpu torch==2.10.0+cpu
python -m pip install --upgrade "fxbx[weights]==0.9.5" furiosa-torch==2026.4.0 furiosa-tcc==2026.4.0 \
  huggingface-hub trimesh scikit-image xatlas moderngl pillow
```

## 2. 샘플 실행

```bash
fxbx run TripoSR --sample -o result.json
```

동봉된 로봇 이미지로 `triposr-output/` 아래에 다음 파일을 만듭니다.

- `model.glb`: 2048 px UV 텍스처를 입힌 메시
- `model_vertex.glb`: 꼭짓점 색 메시
- `texture.png`: 텍스처 이미지

첫 실행 때 원본 가중치 `stabilityai/TripoSR`의 `model.ckpt`(약 1.6 GB)를 Hugging Face 캐시로 내려받습니다. 내려받은 파일은 SHA-256으로 확인합니다.

## 3. 내 이미지로 실행

이미지 경로를 넘깁니다. 결과는 샘플과 같이 `triposr-output/`에 저장됩니다. RGBA 이미지는 배경을 50% 회색으로 합성합니다. 배경을 미리 지운 물체 이미지가 가장 잘 나옵니다.

```bash
fxbx run TripoSR --image my_object.png -o result.json
```

출력 폴더를 직접 정하려면 입력 JSON을 `fxbx predict`에 넘깁니다.

```bash
echo '{"image": "my_object.png", "output": "my-output"}' > input.json
fxbx predict TripoSR --input input.json
```

## 동작 방식

- `packages/triposr-scene.fxbx`: 이미지 → triplane 장면 코드. 512×512 입력 기준 약 45 ms이며, 병합 실행 묶음 164개를 씁니다.
- `packages/triposr-query.fxbx`: 3D 좌표 16,384개 → 밀도와 색. 호출당 약 2 ms입니다.
- 256³ 격자로 밀도를 구하고, marching cubes로 메시를 만든 뒤 꼭짓점과 텍스처 색을 NPU에서 계산합니다.
- 두 패키지의 가중치는 모두 원본 `model.ckpt`에 연결되어 있습니다. 실행할 때 BF16으로 변환합니다.
- 장면 패키지에는 원본에서 한 번 계산해 둔 텐서 3개만 들어 있습니다.
  - 512 px용으로 보간한 위치 임베딩
  - 2×2 ConvTranspose 가중치와 bias를 Linear 형태로 배치한 것
- 호스트(CPU)는 이미지 합성·크기 조정, 격자 좌표, marching cubes, UV 아틀라스와 래스터화, PNG/GLB 저장만 합니다.

## 검증 (2026-11-20, 서버 3)

- **조건:** fxbx 0.9.5(PyPI), Furiosa Torch/TCC 2026.4.0, PyTorch 2.10.0+cpu, Python 3.11
- **설치와 샘플 실행:** 새 가상환경에서 위 설치 명령만으로 샘플 실행에 성공했습니다. 원본 체크포인트 다운로드를 포함해 85초 걸렸습니다.
- **정확도:** 원본 TripoSR(CPU FP32, 같은 전처리, 256 격자)와 비교했습니다.

  | 항목 | 이 패키지 | 원본 |
  |---|---|---|
  | 꼭짓점 | 52,873 | 53,002 |
  | 면 | 105,730 | 105,996 |

  - chamfer 거리는 대각선의 0.33%입니다.
  - 바운딩 박스는 0.001 이내로 같습니다.
  - 장면 코드의 상대 오차는 0.0098입니다.
- **시간:** 장면 0.3초, 메시 9.2초, 2048 px 텍스처 71초가 걸렸습니다.

## 릴리스 기록

- `2026.4.0-mesh256-fxbx6`: `fxbx5`와 같은 실행 계획과 병합 실행 묶음에, 빠져 있던 묶음 목록(`packages/triposr-scene.fxbx.merged/manifest.json`)을 넣었습니다. `fxbx5`에서는 이 목록이 없어 fxbx가 묶음을 쓰지 않았습니다. 같은 RNGD에서 장면 패키지 한 번 실행이 290 ms(3,830회 실행)에서 44.5 ms(292회 실행)로 줄었고, 출력 차이는 0.8%(BF16 반올림 순서 차이)입니다.
