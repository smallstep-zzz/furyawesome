# all-MiniLM-L6-v2 RNGD 사용법

FuryAwesome에 `sentence-transformers/all-MiniLM-L6-v2`로 등록했습니다. 패키지, 고정 입력 샘플, CPU 기준값, 병합 실행 파일, 토크나이저는
[softandsweet/sentence-transformers-all-minilm-l6-v2-rngd-fxbx](https://huggingface.co/softandsweet/sentence-transformers-all-minilm-l6-v2-rngd-fxbx/tree/b5b3e44a0a298efd65feb17c0b2c58fecf3f0bf5)에 있습니다.

furiosa-llm의 `.fxb`처럼 가중치는 패키지에도 이 저장소에도 넣지 않았습니다.

- FuryNo5가 실행 계획의 각 가중치를 원본 체크포인트의 텐서 이름에 직접 연결했습니다.
- 원본 위치도 함께 기록했습니다: [sentence-transformers/all-MiniLM-L6-v2@1110a243](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2/tree/1110a243fdf4706b3f48f1d95db1a4f5529b4d41)의 `model.safetensors`와 그 SHA-256.
- fxbx는 적재할 때 이 파일을 Hugging Face 캐시로 받고 SHA-256을 확인합니다. 그다음 FP32 텐서를 BF16으로 바꾸며 NPU에 올립니다.
- 원본에 없는 토큰 유형 ID 버퍼만 패키지 안에 들어 있습니다.
- fxbx 0.9.4 이상이 필요합니다(`pip install --upgrade "fxbx[weights]"`).

```bash
fxbx run sentence-transformers/all-MiniLM-L6-v2 --sample -o result.safetensors
```

저장소를 직접 받아 실행할 수도 있습니다. 문장 임베딩 예제에는 Transformers 5.20.2가 필요합니다.

```bash
hf download softandsweet/sentence-transformers-all-minilm-l6-v2-rngd-fxbx --revision b5b3e44a0a298efd65feb17c0b2c58fecf3f0bf5 --local-dir .
python -m zipfile -e all-MiniLM-L6-v2.fxbx.merged.zip all-MiniLM-L6-v2.fxbx.merged
python run.py "A quiet park near the river."
```

입력은 `ids`, `mask` `[1,16]` int32, 출력은 토큰별 은닉 상태 `[1,16,384]`입니다. `run.py`는 CPU 기준값과 비교하고(상대 L2 오차 2e-2 이하), 호스트에서 마스크 평균과 L2 정규화를 적용해 문장 임베딩을 출력합니다.

2026-11-19에 5번 RNGD 서버의 새 폴더에서 공개 fxbx 0.9.4와 원본 체크포인트로 검증했습니다. 상대 L2 오차는 0.0106이었습니다. 병합 실행 파일을 쓰면 NPU 실행 횟수가 300번에서 20번으로 줄고, 장치에 올려 둔 입력으로 잰 실행 시간은 요청당 1.0 ms입니다.

원본 모델은 Apache-2.0으로 제공됩니다. [sentence-transformers/all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
