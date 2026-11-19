# Depth Anything V2 Small RNGD 사용법

FuryAwesome에 `depth-anything/Depth-Anything-V2-Small-hf`로 등록했습니다. 패키지, 외부 가중치, 고정 입력 샘플, CPU 기준값과 병합 실행 파일은
[softandsweet/depth-anything-depth-anything-v2-small-hf-rngd-fxbx](https://huggingface.co/softandsweet/depth-anything-depth-anything-v2-small-hf-rngd-fxbx/tree/23e843bda54a5d1910ef2b414566e6fec22d1290)에 있습니다.

```bash
hf download softandsweet/depth-anything-depth-anything-v2-small-hf-rngd-fxbx --revision 23e843bda54a5d1910ef2b414566e6fec22d1290 --local-dir .
python -m zipfile -e depth-anything-v2-small-bf16.fxbx.weights.zip depth-anything-v2-small-bf16.fxbx.weights
python -m zipfile -e depth-anything-v2-small-bf16.fxbx.merged.zip depth-anything-v2-small-bf16.fxbx.merged
python -m pip install 'fxbx[weights]>=0.9.2'
python run.py
fxbx run ./depth-anything-v2-small-bf16.fxbx --sample -o result.safetensors
```

입력은 정규화된 518×518 RGB 이미지 `x` `[1,3,518,518]` BF16, 출력은 상대 깊이 `[1,518,518]`입니다.
`run.py`는 CPU PyTorch 기준값과 비교하며 상대 L2 오차 1e-2 이하이면 통과합니다.

2026-11-19에 5번 RNGD 서버의 새 폴더에서 공개 fxbx 0.9.2로 위 절차를 검증했습니다(상대 L2 오차 0.0043, `fxbx run --sample` 3.8초, 적재 포함).

| 실행 방식 | 요청당 시간 | NPU 실행 횟수 |
| --- | --- | --- |
| 이전 단계별 패키지(FP32 벡터 연산) | 55.9 s | 246,669 |
| 이 패키지, 단계별 | 63 ms | 1,404 |
| 이 패키지 + 병합 실행 파일 | 32 ms | 268 |

병합 실행 파일은 실행 계획 해시, Furiosa Torch·TCC 버전, 데이터 흐름이 맞을 때만 쓰이고, 다르면 단계별 실행으로 돌아갑니다.
카탈로그 이름으로 받는 `fxbx fetch depth-anything/Depth-Anything-V2-Small-hf`는 패키지와 병합 파일만 받으므로, 가중치와 샘플은 위 다운로드 절차로 준비합니다.

원본 모델은 Apache-2.0으로 제공됩니다. [depth-anything/Depth-Anything-V2-Small-hf](https://huggingface.co/depth-anything/Depth-Anything-V2-Small-hf)
