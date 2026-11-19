# Laya Typed-Decisions RNGD 사용법

FuryAwesome에 `convaiinnovations/laya-typed-decisions`로 등록했습니다. 패키지, 고정 입력 샘플, FP32 CPU 기준값, 병합 실행 파일은
[softandsweet/convaiinnovations-laya-typed-decisions-rngd-fxbx](https://huggingface.co/softandsweet/convaiinnovations-laya-typed-decisions-rngd-fxbx/tree/b0df150ff8ad54a114807a5c1f81f808d5a8dd95)에 있습니다.

furiosa-llm의 `.fxb`처럼 가중치는 패키지에도 이 저장소에도 넣지 않았습니다.

- FuryNo5가 실행 계획의 각 가중치를 원본 체크포인트의 텐서 이름에 직접 연결했습니다. 묶인 q/k/v처럼 원본 텐서의 일부만 쓰는 가중치는 행 범위까지 기록했습니다.
- 원본 위치도 함께 기록했습니다: [convaiinnovations/laya-typed-decisions@e929ae5c](https://huggingface.co/convaiinnovations/laya-typed-decisions/tree/e929ae5cf69bc34259cd2f95c9e91145b818b1f0)의 `model.safetensors`와 그 SHA-256.
- fxbx는 적재할 때 이 파일을 Hugging Face 캐시로 받고 SHA-256을 확인합니다. 그다음 FP16 텐서를 BF16으로 바꾸며 NPU에 올립니다.
- 원본에 없는 회전 위치 임베딩 주파수 4개만 패키지 안에 들어 있습니다.
- fxbx 0.9.4 이상이 필요합니다(`pip install --upgrade "fxbx[weights]"`).

```bash
fxbx run convaiinnovations/laya-typed-decisions --sample -o result.safetensors
```

저장소를 직접 받아 실행할 수도 있습니다.

```bash
hf download softandsweet/convaiinnovations-laya-typed-decisions-rngd-fxbx --revision b0df150ff8ad54a114807a5c1f81f808d5a8dd95 --local-dir .
python -m zipfile -e Laya-Typed-Decisions.fxbx.merged.zip Laya-Typed-Decisions.fxbx.merged
python run.py
```

입력은 `ids`, `attention` `[1,42]`, `positions`, `keep` `[1,3]`, `qtype` `[1]`(모두 int32)입니다. 출력은 선택지 로짓 `[1,3]`과 질문 유형 로짓 `[1,2]`입니다. `run.py`는 FP32 CPU 기준값과 비교합니다(상대 L2 오차 2e-2 이하).

2026-11-19에 5번 RNGD 서버의 새 폴더에서 공개 fxbx 0.9.4와 원본 체크포인트로 검증했습니다. 상대 L2 오차는 0.0049(선택지)와 0.0020(질문 유형)이고 FP32와 같은 선택을 냅니다. 장치에 올려 둔 입력으로 잰 병합 실행 시간은 요청당 8.3 ms입니다.

원본 모델은 Apache-2.0으로 제공됩니다. [convaiinnovations/laya-typed-decisions](https://huggingface.co/convaiinnovations/laya-typed-decisions)
