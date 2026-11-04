# furyawesome 기여 안내

모델 목록의 **원본은 `models/<identity-sha256>.json`** 입니다. `catalog.json`과 README 관리 영역은 `Furiosa-Hug-Anything`의 게시기가 같은 커밋으로 생성합니다.

- 메타데이터만 등록하고, 실제 .fxbex·가중치·토큰은 업로드하지 마세요.
- 모델의 원본 저장소, 정확한 40자리 원본 commit, 개별 원본/패키지 라이선스 및 정확한 artifact SHA256을 확인합니다.
- 다운로드는 공개 Hugging Face `/resolve/<40-hex-sha>/...fxbex` 주소를 사용합니다.
- 카탈로그 등록은 라이선스 준수, 패키지 무결성 또는 NPU 성공 인증이 아닙니다.
- GitHub 이슈의 본문을 검증된 모델로 자동 처리하지 않습니다. 외부 기여는 PR로 검토합니다.
- README의 `furyawesome:models` 마커는 삭제하거나 중복시키지 마세요.

[OpenFury Hub](https://openfury-hub.softandsweet5.chatgpt.site/)는 이 공개 JSON 색인을 읽기 전용으로 표시합니다. 새 모델을 커밋하면 사이트 재배포 없이 갱신됩니다. 인증·권한 관리·파일 게시 작업은 웹사이트에서 하지 않습니다.
