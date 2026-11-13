# all-MiniLM-L6-v2 실행 방법

## 1. 샘플 실행

Linux RNGD 서버의 Python 3.11 전용 환경에서 실행합니다. 호환 RNGD 드라이버가 필요합니다.

```bash
python -m pip install --index-url https://download.pytorch.org/whl/cpu torch==2.10.0+cpu
python -m pip install 'fxbx[weights] @ git+https://github.com/smallstep-zzz/fxbX.git@9cfc771' \
  furiosa-torch==2026.4.0 furiosa-tcc==2026.4.0 transformers==5.20.2
python -m pip check
hf download softandsweet/sentence-transformers-all-minilm-l6-v2-rngd-fxbx --revision 2720858d12c28d73aedb6b78e9a23b2518b81d43 --local-dir .
tar -xf weights.tar
python run.py
```

배치 1, 최대 16토큰 입력의 BF16 문장 임베딩 예제입니다. NPU에서 은닉 상태를 계산하고 호스트에서 마스크 평균과 L2 정규화를 적용합니다.
