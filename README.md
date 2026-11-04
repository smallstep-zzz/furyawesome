# furyawesome

**Furiosa NPU 실행 패키지의 공개 메타데이터 카탈로그.**

- 모델 탐색: [OpenFury Hub](https://openfury-hub.softandsweet5.chatgpt.site/)
- 실제 FXBEX 파일: [Hugging Face](https://huggingface.co/)
- FXBEX 제작·게시 도구: [Furiosa-Hug-Anything](https://github.com/smallstep-zzz/Furiosa-Hug-Anything)

이 저장소에는 실행파일, 모델 가중치, 액세스 토큰을 업로드하지 않습니다. 모델별 원본·패키지 라이선스를 구분합니다. **목록 등록은 배포 권한·파일 안전성·NPU 실행 검증을 의미하지 않습니다.**

## 웹사이트 자동 반영

`catalog.json`은 OpenFury Hub가 읽는 공개 색인입니다. 모델 게시기는 `models/*.json`, `catalog.json`, 아래 README 목록을 **한 번의 GitHub 커밋으로** 갱신합니다. 웹사이트는 이 JSON을 주기적으로 읽으므로 모델이 추가돼도 별도 사이트 배포가 필요 없습니다.

## 등록된 모델

<!-- furyawesome:models:start -->

| Model | Version | Target / precision | Source license | Package license | Download |
| --- | --- | --- | --- | --- | --- |
| [YOLO11n RNGD FXBEX (640, portable)](models/8ef9cc3f3ce8dc6fda9c043e14f2fa563a5699ca23d00c4dffc9f78e870825af.json) | 2026.4.0-opt3-minimal1 | Furiosa RNGD / Mixed | AGPL-3.0 | AGPL-3.0 weights; bundled source has no separate license; SDK host terms apply | [HF](https://huggingface.co/softandsweet/giangndm-yolo11-onnx-rngd-fxbex/resolve/e0847942d8a55175a07ad1b9a78b0163583f6550/releases/2026.4.0-opt3-minimal1/cac265de482649f3aa020ceed99a3391daee10ab2d4fe7e8768ad685dc3a078d/model.fxbex) |

<!-- furyawesome:models:end -->


자세한 내용은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고하세요.
