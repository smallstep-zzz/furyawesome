# Depth Anything V2 Small RNGD 사용법

FuryAwesome에 `depth-anything/Depth-Anything-V2-Small-hf`로 등록했습니다. 패키지, 고정 입력 샘플, CPU 기준값, 병합 실행 파일, 가중치 변환 규칙은
[softandsweet/depth-anything-depth-anything-v2-small-hf-rngd-fxbx](https://huggingface.co/softandsweet/depth-anything-depth-anything-v2-small-hf-rngd-fxbx/tree/0328da59549019bcd6c628f07ae07f5516e56daa)에 있습니다.

가중치 사본은 올리지 않았습니다. 처음 `fxbx run`이나 `fxbx fetch`를 실행할 때 fxbx가 원본 체크포인트를 내려받아 변환합니다.

- 원본: [depth-anything/Depth-Anything-V2-Small-hf@5426e4f0](https://huggingface.co/depth-anything/Depth-Anything-V2-Small-hf/tree/5426e4f0f36572d16453bbda7a8389317b1bef99)의 `model.safetensors`
- 변환 절차: SHA-256을 확인하고, 어텐션 키 이름을 바꾸고, BF16으로 바꿔 `.fxbx.weights/`에 저장합니다.
- 변환 규칙: `depth-anything-v2-small-bf16.fxbx.weights.json`
- 변환한 가중치는 검증에 쓴 가중치와 비트 단위로 같습니다.
- 변환은 1초 안에 끝나고, 다음 실행부터는 저장된 폴더를 다시 씁니다.
- 이 기능은 가중치 변환 규칙을 지원하는 fxbx(smallstep-zzz/fxbX `fetch-companions`, 다음 배포 예정)에서 동작합니다.

카탈로그 이름으로 실행하면 패키지, 병합 파일, 샘플을 받고 가중치를 변환한 뒤 실행합니다.

```bash
fxbx run depth-anything/Depth-Anything-V2-Small-hf --sample -o result.safetensors
```

저장소를 직접 받아 실행할 수도 있습니다.

```bash
hf download softandsweet/depth-anything-depth-anything-v2-small-hf-rngd-fxbx --revision 0328da59549019bcd6c628f07ae07f5516e56daa --local-dir .
python -m zipfile -e depth-anything-v2-small-bf16.fxbx.merged.zip depth-anything-v2-small-bf16.fxbx.merged
fxbx run ./depth-anything-v2-small-bf16.fxbx --sample -o result.safetensors
python run.py
```

입력은 정규화된 518×518 RGB 이미지 `x` `[1,3,518,518]` BF16, 출력은 상대 깊이 `[1,518,518]`입니다.
`run.py`는 CPU PyTorch 기준값과 비교하며 상대 L2 오차 1e-2 이하이면 통과합니다.

2026-11-19에 5번 RNGD 서버의 새 폴더에서 공개 fxbx 0.9.2와 미리 변환한 가중치로 검증했습니다. 상대 L2 오차는 0.0043이었고, `fxbx run --sample`은 적재를 포함해 3.8초 걸렸습니다. 원본을 변환하는 방식은 5번 서버에서 상대 L2 오차 0.0041로 통과했습니다.

| 실행 방식 | 요청당 시간 | NPU 실행 횟수 |
| --- | --- | --- |
| 이전 단계별 패키지(FP32 벡터 연산) | 55.9 s | 246,669 |
| 이 패키지, 단계별 | 63 ms | 1,404 |
| 이 패키지 + 병합 실행 파일 | 32 ms | 268 |

병합 실행 파일은 실행 계획 해시, Furiosa Torch·TCC 버전, 데이터 흐름이 맞을 때만 쓰이고, 다르면 단계별 실행으로 돌아갑니다.

원본 모델은 Apache-2.0으로 제공됩니다. [depth-anything/Depth-Anything-V2-Small-hf](https://huggingface.co/depth-anything/Depth-Anything-V2-Small-hf)
