# FuryAwesome 웹사이트

같은 정적 파일(`dist/`)을 GitHub Pages와 기존 ChatGPT Sites에서 사용할 수 있습니다.
기존 Sites 주소와 `.openai/hosting.json` 설정은 유지합니다. Pages 배포는 기존 Sites를 재배포하거나 변경하지 않습니다.

- GitHub Pages: https://smallstep-zzz.github.io/furyawesome/
- 기존 사이트: https://furyawesome.softandsweet5.chatgpt.site/
- 카탈로그와 사용법은 FuryAwesome `main`의 공개 JSON을 읽으며, 연결 실패 시 포함된 스냅샷을 표시합니다.
- 포팅 요청은 GitHub Issue 작성창으로 연결합니다. GitHub 로그인 후 사용자가 최종 등록합니다.
- 모델 파일은 기존 Hugging Face 다운로드 링크를 사용합니다.
- Garage Grid는 No5 서명을 눌러 실행합니다. 같은 게임 소스가 접속 주소를 확인하여 `github.io`에서는 공용 순위표·이니셜 등록·점수 API 호출을 끕니다. 현재 게임의 점수·단계는 계속 표시합니다. 기존 Sites에서는 Worker와 D1으로 순위표를 제공합니다.

## 배포

저장소 Settings → Pages → Source를 **GitHub Actions**로 설정합니다.
`main` 갱신 또는 `Deploy GitHub Pages` 수동 실행으로 `dist/`를 게시합니다.
Sites에는 `node site/scripts/build-arcade-worker.mjs`로 Worker를 만든 뒤 기존 배포 절차를 사용합니다. Pages에는 Worker를 빌드하지 않습니다. 기존에 게시된 게임과 순위표는 Pages 배포의 영향을 받지 않습니다.

## 로컬 확인

```sh
node site/tests/static-site.mjs
python3 -m http.server 8080 --directory site/dist
```

http://localhost:8080/ 및 /arcade/에서 확인할 수 있습니다.
모든 내부 경로는 상대 경로이므로 GitHub Pages의 `/furyawesome/` 하위 경로에서도 동작합니다.
