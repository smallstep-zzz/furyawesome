# 선택형 LoRA 안내

LoRA 없이 원본 모델을 실행하는 것이 기본입니다. 스타일·용도에 맞는 LoRA만 추가로 선택하세요.

추천 정보의 원본은 [`lora-catalog.json`](../lora-catalog.json)입니다. FuryAwesome 웹과 fxbX 모델 선택 화면이 같은 정보를 읽습니다. 가중치는 이 저장소에 복제하지 않고 사용자가 가져오기를 선택했을 때 원본 Hugging Face 저장소에서 받습니다.

- `candidate`: 원본 카드·베이스 모델·파일을 조사한 후보입니다. NPU 실행이나 품질을 보장하지 않습니다.
- `verified_npu`: 고정된 패키지·환경에서 실제 실행한 공개 증거가 있습니다. 다른 입력의 품질까지 보장하지 않습니다.
- `hold`: 라이선스나 실행 조건 때문에 사용을 보류합니다.

베이스 이름이 비슷해도 FLUX.1, FLUX.2/3, 4B/9B, base/distilled, Qwen Image/Edit/Turbo를 서로 바꿔 쓸 수는 없습니다. 가속 LoRA는 스케줄러·시그마 변경이 필요할 수 있어 단순 스타일 메뉴에 넣지 않았습니다. 한국풍 그림을 그리는 스타일과 한국어 프롬프트 이해·한글 생성은 다른 능력입니다. 이번 선별에서 한국어 일반 이해 개선을 입증한 드롭인 LoRA는 확인하지 못했습니다.

SDXL 후보는 SDXL 1.0용 UNet LoRA입니다. Turbo 고정 프로필의 품질은 직접 확인해야 합니다. LoRA 가져오기 기능이 있는 패키지에서만 버튼이 활성화됩니다. 다른 모델은 실행 연결이 준비되기 전까지 설명과 원본 링크만 제공합니다.

## 정보 추가·삭제

JSON을 직접 편집하지 않고 다음 함수 또는 CLI를 사용합니다.

```python
from scripts.lora_store import upsert, remove
upsert(metadata)
remove('adapter-id')
```

```bash
python scripts/lora_store.py add metadata.json
python scripts/lora_store.py remove adapter-id
python scripts/lora_store.py check
```

고정 리비전·가중치 파일·용량·라이선스·한국어 효용·호환 조건·원본 근거를 기록합니다. NPU 검증 상태로 올릴 때는 재현 가능한 공개 증거 링크가 필요합니다. 메타데이터 변경은 패키지를 다시 컴파일하는 작업과 별개입니다.

`trigger`에는 원본 카드가 안내하는 단어나 구문을, `example_prompt`에는 그대로 실행할 수 있는 장면 전체를 넣습니다. 피사체에 구도·조명·색상·배경 중 스타일을 보여주는 요소를 더하고, 필수 트리거와 권장 강도, 필요한 고정 입력을 사용 조건에 적습니다. fxbX는 가져온 가중치의 원본 저장소·리비전·파일이 모두 일치할 때 이 예시를 사용합니다.
