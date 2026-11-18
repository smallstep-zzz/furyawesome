# RF-DETR Seg Nano RNGD 사용법

FuryAwesome에 `rf-detr-seg-nano`로 등록했습니다. 패키지, 외부 가중치, 고정 입력 샘플과 기준값은
[softandsweet/roboflow-rf-detr-seg-nano-rngd-fxbx](https://huggingface.co/softandsweet/roboflow-rf-detr-seg-nano-rngd-fxbx/tree/a9da25af1027ec9730599f29a1f3037db3d2ad5c)에 있습니다.

```bash
hf download softandsweet/roboflow-rf-detr-seg-nano-rngd-fxbx --revision a9da25af1027ec9730599f29a1f3037db3d2ad5c --local-dir .
tar -xf weights.tar
python -m pip install 'fxbx[weights]>=0.9.2'
python run.py
```

이 다운로드·샘플 실행 절차는 2026-11-18에 25번 RNGD 서버의 새 폴더에서 공개 fxbx 0.9.1로 검증했으며 CPU 기준값(`atol=0.02, rtol=0.02`)을 통과했습니다.

## 병합 실행 파일 (fxbX 0.9.2 이상)

같은 커밋의 `rf-detr-seg.fxbx.merged.zip`은 실행 횟수를 22,968번에서 596번으로 줄입니다.
25번 서버에서 병합 전 517 ms, 병합 후 73 ms(7.0배)였습니다. fxbX 0.9.2부터 지원합니다.
위 `hf download` 후 다음과 같이 압축을 풀면 `python run.py`가 병합 실행물을 사용합니다.

```bash
python -m zipfile -e rf-detr-seg.fxbx.merged.zip rf-detr-seg.fxbx.merged
python run.py
```

카탈로그에서 다운로드할 때는 병합 파일도 자동으로 받습니다. 이전 캐시가 있으면 갱신하세요.
외부 가중치와 샘플은 위 다운로드 절차로 별도로 준비해야 합니다.

```bash
fxbx fetch Roboflow/rf-detr-seg-nano --refresh
```

실행 계획·SDK·파일 해시·입출력 연결이 일치할 때 병합 실행물을 사용하며,
호환되지 않으면 기존 실행 경로를 사용합니다. 위 성능은 기존 25번 서버 측정치이며 환경에 따라 달라집니다.

## 이전 실행 검증 기록 (2026-11-15)

25번 RNGD 서버에서 fxbX 0.9.1의 고정 입력 샘플을 검증했습니다.

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
