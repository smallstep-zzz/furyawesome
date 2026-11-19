# Depth Anything V2 Small RNGD 사용법

FuryAwesome에 `depth-anything/Depth-Anything-V2-Small-hf`로 등록했습니다. 패키지, 고정 입력 샘플, CPU 기준값, 병합 실행 파일은
[softandsweet/depth-anything-depth-anything-v2-small-hf-rngd-fxbx](https://huggingface.co/softandsweet/depth-anything-depth-anything-v2-small-hf-rngd-fxbx/tree/de305a6332d57727a285671afe97859b496a863a)에 있습니다.

furiosa-llm의 `.fxb`처럼 가중치는 패키지에도 이 저장소에도 넣지 않았습니다.

- FuryNo5가 실행 계획의 각 가중치를 원본 체크포인트의 텐서 이름에 직접 연결했습니다.
- 원본 위치도 함께 기록했습니다: [depth-anything/Depth-Anything-V2-Small-hf@5426e4f0](https://huggingface.co/depth-anything/Depth-Anything-V2-Small-hf/tree/5426e4f0f36572d16453bbda7a8389317b1bef99)의 `model.safetensors`와 그 SHA-256.
- fxbx는 적재할 때 이 파일을 Hugging Face 캐시로 받고 SHA-256을 확인합니다. 그다음 FP32 텐서를 BF16으로 바꾸며 NPU에 올립니다.
- 따로 변환해 디스크에 저장하는 단계는 없습니다.
- fxbx 0.9.3 이상이 필요합니다(`pip install --upgrade "fxbx[weights]"`).

```bash
fxbx run depth-anything/Depth-Anything-V2-Small-hf --sample -o result.safetensors
```

저장소를 직접 받아 실행할 수도 있습니다.

```bash
hf download softandsweet/depth-anything-depth-anything-v2-small-hf-rngd-fxbx --revision de305a6332d57727a285671afe97859b496a863a --local-dir .
python -m zipfile -e depth-anything-v2-small-bf16.fxbx.merged.zip depth-anything-v2-small-bf16.fxbx.merged
python run.py
```

입력은 정규화된 518×518 RGB 이미지 `x` `[1,3,518,518]` BF16, 출력은 상대 깊이 `[1,518,518]`입니다.
`run.py`는 CPU PyTorch 기준값과 비교하며 상대 L2 오차 1e-2 이하이면 통과합니다.

2026-11-19에 5번 RNGD 서버의 새 폴더에서 원본 체크포인트로 검증했습니다. 상대 L2 오차는 0.0043이었고, 병합 실행으로 요청당 31.9 ms였습니다.

| 실행 방식 | 요청당 시간 | NPU 실행 횟수 |
| --- | --- | --- |
| 이전 단계별 패키지(FP32 벡터 연산) | 55.9 s | 246,669 |
| 이 패키지, 단계별 | 63 ms | 1,404 |
| 이 패키지 + 병합 실행 파일 | 32 ms | 268 |

병합 실행 파일은 실행 계획 해시, Furiosa Torch·TCC 버전, 데이터 흐름이 맞을 때만 쓰이고, 다르면 단계별 실행으로 돌아갑니다.

원본 모델은 Apache-2.0으로 제공됩니다. [depth-anything/Depth-Anything-V2-Small-hf](https://huggingface.co/depth-anything/Depth-Anything-V2-Small-hf)
