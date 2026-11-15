# RF-DETR Seg Nano RNGD 실행 검증

25번 RNGD 서버에서 fxbX 0.9.1의 고정 입력 샘플을 검증했습니다.
환경별 표는 릴리스 후보로 작성했고, 이미지 검증 환경에서는 공개 PyPI wheel을
새로 설치해 NPU 실행과 출력 수치 비교를 다시 통과했습니다.
패키지와 외부 가중치, 샘플 텐서는 같은 디렉터리에 둡니다.
이 페이지는 실행 검증 기록이며 FuryAwesome 모델명 다운로드 등록은 아직 없습니다.

```bash
python -m pip install 'fxbx==0.9.1' safetensors
fxbx run ./rf-detr-seg.fxbx --sample -o outputs.safetensors
```

필요한 파일은 `rf-detr-seg.fxbx`, `rf-detr-seg.fxbx.weights/`,
`rf-detr-seg.fxbx.sample.safetensors`입니다. 통과 환경은
Torch 2.10.0+cpu, Furiosa Torch 2026.4.0, Furiosa TCC 2026.4.0,
safetensors 0.8.0을 사용했습니다.

| 25번 서버 환경 | Python | 샘플 실행 |
| --- | --- | --- |
| TCLMachine SDK | 3.10.12 | 통과 |
| 이미지 검증 SDK | 3.11.18 | 통과 |
| fury | 3.11.18 | 통과 |
| conda base | 3.14.9 | safetensors 누락 |
| furiosa02 | 3.11.18 | Furiosa Torch 누락 |
| py311-tcc441 | 3.11.18 | Furiosa Torch 백엔드 가져오기 실패 |
| fresh310 | 3.10.12 | PyTorch 누락 |
| fresh311 | 3.11.18 | PyTorch 누락 |
| triposr-doc | 3.11.18 | Furiosa Torch 백엔드 가져오기 실패 |
| minilm-doc | 3.11.18 | Furiosa Torch 누락 |

통과한 세 환경에서 클래스 점수 `[1,100,91]`, 박스 `[1,100,4]`,
마스크 `[1,100,78,78]`를 저장하고 CPU 기준값과 비교했습니다.
세 출력 모두 `atol=0.02, rtol=0.02`를 통과했습니다.
누락된 의존성과 백엔드 로딩 실패는 해당 환경에서 관찰한 결과입니다.

원본 모델은 Apache-2.0으로 제공됩니다. [Roboflow RF-DETR Seg Nano](https://huggingface.co/Roboflow/rf-detr-seg-nano)
