# Laya Typed-Decisions 실행 방법

## 1. 샘플 실행

Linux RNGD 서버의 SDK Python 환경에서 아래 명령을 실행합니다. 예제는 동봉된 고정 입력을 처리하고 선택지 로짓을 출력합니다.

```bash
hf download softandsweet/convaiinnovations-laya-typed-decisions-rngd-fxbx --revision e8703c9d2af850dce1d23ac125441e95cf9668bb --local-dir .
tar -xf weights.tar
python run.py
```

## 처음 설치할 때

호환 RNGD 드라이버, Furiosa Torch/TCC 2026.4.0과 PyTorch 2.10.0+cpu가 설치된 Python 환경을 사용합니다.

```bash
python -m pip install 'fxbx[weights]==0.8.4'
```

## 모델 범위

현재 릴리스는 FP32, 배치 1, 42토큰, 선택지 3개의 고정 입력 프로필입니다. 공개 예제는 `run.py`와 별도 가중치 파일을 사용합니다. [릴리스의 검증 기록](https://huggingface.co/softandsweet/convaiinnovations-laya-typed-decisions-rngd-fxbx/blob/e8703c9d2af850dce1d23ac125441e95cf9668bb/USAGE.md)
