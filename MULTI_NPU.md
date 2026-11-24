# 다중 NPU 릴리스

장치 수와 연결 방식은 각 프로필의 조건입니다. 실제 실행 상태는 릴리스별 검증 기록을 따릅니다.

| 모델 | 물리 RNGD | 배치 | SDK / 버전 | 실행 | 파일 | 사용법 |
| --- | ---: | --- | --- | --- | --- | --- |
| furiosa-ai/Qwen3-Embedding-0.6B | 2 | 한 서버 · 파이프라인 병렬 | 2026.4.0 / 2026.4.0-pp2-ctx128-o0 | 미검증 | [다운로드](https://huggingface.co/softandsweet/qwen-qwen3-embedding-0-6b-rngd-pp2-fxb/resolve/00d525f4b963c8c0063db9cd7a76435acce85ff0/qwen3-embedding-0.6b-tp8-pp2.fxb) | [예제](https://huggingface.co/softandsweet/qwen-qwen3-embedding-0-6b-rngd-pp2-fxb/blob/a9fb976014e85046ed611b174748b4dc8e50f4af/README.md) |
| black-forest-labs/flux-3-image-klein | 2 | 여러 서버 · 단계 분산 | 2026.4.0 / 2026.4.0-512-cross-host1 | [검증 완료](https://huggingface.co/softandsweet/black-forest-labs-flux-3-image-klein-rngd-fxbex/blob/debb8fd291e3ca8857f1840de3753245c273faf2/examples/two-rngd/validation.json) | [다운로드](https://huggingface.co/softandsweet/black-forest-labs-flux-3-image-klein-rngd-fxbex/resolve/56ba7b2ce4c2e886498e0f022d65586b6ac9be9a/releases/2026.4.0-flux3-fxbx1/2924f79ead2de03c4aa1a64a62dc5231fd4dd604334e7e6676df3493d9eb8f51/flux3-image-klein.fxbx) | [예제](https://huggingface.co/softandsweet/black-forest-labs-flux-3-image-klein-rngd-fxbex/blob/debb8fd291e3ca8857f1840de3753245c273faf2/examples/two-rngd/README.md) |
