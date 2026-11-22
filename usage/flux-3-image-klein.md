# FLUX 3 Image Klein 실행 방법

문장(프롬프트)으로 512×512 또는 1024×1024 이미지를 만듭니다. Linux의 Furiosa RNGD 서버에서 실행합니다.

## 1. 원본 가중치 접근 권한

가중치는 이 패키지에 들어 있지 않습니다. 실행할 때 원본 저장소 [`black-forest-labs/flux-3-image-klein`](https://huggingface.co/black-forest-labs/flux-3-image-klein)에서 받습니다. 이 저장소는 동의가 필요한(gated) 저장소입니다.

1. Hugging Face에서 원본 저장소 페이지를 열고 FLUX Kommunity License에 동의합니다.
2. 같은 계정으로 로그인합니다.

```bash
hf auth login
```

## 2. 설치

Python 3.11로 전용 환경을 만듭니다.

```bash
python3.11 -m venv .venv-flux3
source .venv-flux3/bin/activate
python -m pip install --index-url https://download.pytorch.org/whl/cpu torch==2.10.0+cpu
python -m pip install "fxbx[weights]==0.9.5" furiosa-torch==2026.4.0 furiosa-tcc==2026.4.0 \
  huggingface-hub "transformers>=5.20" pillow
```

## 3. 샘플 실행

```bash
fxbx run flux-3-image-klein --sample -o result.json
```

동봉된 예제 문장(눈 속의 붉은 여우)으로 1024×1024 PNG를 `flux3.png`에 만듭니다. 첫 실행 때 원본 가중치(텍스트 인코더, 트랜스포머, VAE)를 Hugging Face 캐시로 내려받고 SHA-256을 확인합니다.

## 4. 내 문장으로 실행

입력 JSON을 `fxbx predict`에 넘깁니다.

```bash
cat > input.json <<'EOF'
{"prompt": "A cozy reading nook by a rainy window, warm lamp light, a cat asleep on a knitted blanket, film photo, soft focus background.",
 "output": "nook.png", "size": 1024, "seed": 7}
EOF
fxbx predict flux-3-image-klein --input input.json
```

- `prompt`: 장면 전체를 묘사하는 문장입니다. 원본의 프롬프트 확장기(upsampler)는 쓰지 않으므로, 짧은 키워드보다 자세한 문장이 잘 나옵니다. 채팅 템플릿을 씌운 뒤 240토큰까지 받습니다.
- `size`: `512` 또는 `1024`(기본값)
- `seed`: 초기 노이즈 시드(기본값 0)
- 결과 옆에 `nook.json`이 생기며, 단계별 시간과 병합 실행 묶음 사용 여부(`merged_runnables`)가 기록됩니다.

## 동작 방식

- `packages/flux3-klein-text.fxbx`: Qwen3-VL 텍스트 층 → 프롬프트 임베딩 [1, 240, 20480]. 512와 1024가 함께 씁니다.
- `packages/flux3-klein-transformer-{512,1024}.fxbx`: flow-map 오일러 한 스텝. 16스텝 반복합니다.
- `packages/flux3-klein-vae-{512,1024}.fxbx`: latent → RGB 이미지.
- 각 패키지 옆의 `*.fxbx.merged/`에는 연속 단계를 묶어 미리 컴파일한 실행 묶음이 들어 있습니다. 같은 내용의 묶음은 한 번만 저장합니다. SDK 버전이 맞으면 fxbx가 이 묶음을 쓰고, 다르면 단계별 실행으로 돌아갑니다.
- 모든 패키지의 가중치는 원본 `3b767ff9` 커밋의 safetensors에 연결되어 있습니다. 가중치 사본은 없습니다.
- 호스트에서는 토큰화, 초기 노이즈 생성, PNG 저장만 합니다.

## 검증

서버의 RNGD에서 새 프로세스로 이 번들을 열어, CPU 기준 실행(원본 diffusers 파이프라인)과 같은 문장·초기 노이즈로 비교했습니다.

| 해상도 | 한 장 시간(텍스트 제외) | CPU 기준 대비 PSNR | 단계별 실행(병합 없음) |
|---|---|---|---|
| 512 | 약 9.7초 | 27.31 dB | 46.7초, 27.58 dB |
| 1024 | 약 14.4초 | 29.88 dB | 35.7초, 33.0 dB |

- 두 해상도 모두 병합 실행 묶음이 쓰였고, SDK CPU 폴백은 0건이었습니다.
- 1024의 병합 실행은 BF16 반올림 위치가 단계별 실행과 달라 PSNR이 약 3 dB 낮습니다. 특정 묶음의 오류가 아니라 전체에 고르게 퍼진 차이입니다(묶음을 절반씩 빼며 확인).
- 텍스트 인코더는 첫 호출 때 토크나이저를 불러오느라 약 1.4초가 걸립니다.
