# RF-DETR Seg Nano RNGD 사용법

FuryAwesome에 `Roboflow/rf-detr-seg-nano`로 등록했습니다. 패키지, 고정 입력 샘플, FP32 CPU 기준값, 병합 실행 파일은
[softandsweet/roboflow-rf-detr-seg-nano-rngd-fxbx](https://huggingface.co/softandsweet/roboflow-rf-detr-seg-nano-rngd-fxbx/tree/3a35fdc077d8b8badee55cc5e7b30a47740c44bf)에 있습니다.

furiosa-llm의 `.fxb`처럼 가중치는 패키지에도 이 저장소에도 넣지 않았습니다.

- FuryNo5가 실행 계획의 각 가중치를 원본 체크포인트의 텐서 이름에 직접 연결했습니다. 묶인 q/k/v처럼 원본 텐서의 일부만 쓰는 가중치 24개는 행 범위까지 기록했습니다.
- 원본 위치도 함께 기록했습니다: [Roboflow/rf-detr-seg-nano@472badbc](https://huggingface.co/Roboflow/rf-detr-seg-nano/tree/472badbc863609789ce1f69311244c670bdfd2b9)의 `model.safetensors`와 그 SHA-256.
- fxbx는 적재할 때 이 파일을 Hugging Face 캐시로 받고 SHA-256을 확인합니다. 그다음 텐서 524개를 BF16으로 바꾸며 NPU에 올립니다.
- 원본에 없는 상수 버퍼 하나(`pixel_mask`)만 패키지 안에 들어 있습니다.
- fxbx 0.9.4 이상이 필요합니다(`pip install --upgrade "fxbx[weights]"`).

```bash
fxbx run Roboflow/rf-detr-seg-nano --sample -o result.safetensors
```

저장소를 직접 받아 실행할 수도 있습니다.

```bash
hf download softandsweet/roboflow-rf-detr-seg-nano-rngd-fxbx --revision 3a35fdc077d8b8badee55cc5e7b30a47740c44bf --local-dir .
python -m zipfile -e rf-detr-seg.fxbx.merged.zip rf-detr-seg.fxbx.merged
python run.py
```

입력은 `pixels` `[1,3,312,312]`(float32)입니다. 출력은 클래스 점수 `[1,100,91]`, 박스 `[1,100,4]`(cx, cy, w, h), 마스크 로짓 `[1,100,78,78]`입니다. BF16에서는 100개 쿼리 칸의 순서가 바뀔 수 있어서, `run.py`는 FP32 CPU 기준값과 검출 단위로 비교합니다. FP32 검출이 모두 짝지어지고, 박스 IoU 0.75 이상, 마스크 IoU 0.9 이상, 점수 차이 0.05 이하여야 합니다.

2026-11-20에 5번 RNGD 서버의 새 폴더에서 공개 fxbx 0.9.4와 원본 체크포인트로 검증했습니다. FP32 검출 7개가 모두 짝지어졌고, 최소 박스 IoU 0.940, 마스크 IoU 0.997(전체 픽셀)·0.987(마스크별 최소), 점수 차이 최대 0.011입니다. 이전 릴리스와 같은 세션에서 번갈아 잰 요청당 시간은 이전 73 ms, 이번 25 ms입니다.

원본 모델은 Apache-2.0으로 제공됩니다. [Roboflow/rf-detr-seg-nano](https://huggingface.co/Roboflow/rf-detr-seg-nano)
