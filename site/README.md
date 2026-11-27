# FuryAwesome 웹사이트

같은 정적 파일(`dist/`)을 GitHub Pages와 기존 ChatGPT Sites에서 사용할 수 있습니다.
기존 Sites 주소와 `.openai/hosting.json` 설정은 유지합니다. Pages 배포는 기존 Sites를 재배포하거나 변경하지 않습니다.

- GitHub Pages: https://smallstep-zzz.github.io/furyawesome/
- 기존 사이트: https://furyawesome.softandsweet5.chatgpt.site/
- 카탈로그와 사용법은 FuryAwesome `main`의 공개 JSON을 읽으며, 연결 실패 시 포함된 스냅샷을 표시합니다.
- 포팅 요청은 GitHub Issue 작성창으로 연결합니다. GitHub 로그인 후 사용자가 최종 등록합니다.
- 모델 파일은 기존 Hugging Face 다운로드 링크를 사용합니다.
- Garage Grid는 No5 서명을 눌러 실행합니다. 같은 게임 소스에서 `arcade/config.js`의 공개 API 주소가 설정되어 있으면 GitHub Pages에서도 공용 점수판을 사용합니다. 설정 전에는 기존처럼 점수판을 숨깁니다. 기존 Sites의 같은 출처 API도 계속 지원합니다.

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

## Cloudflare 무료 점수판

Worker 진입점은 `worker/cloudflare.mjs`이며, 게임 엔진과 검증 API를 기존 Sites와 공유합니다.
`wrangler.jsonc`에는 공개 Pages·Sites 출처만 허용합니다. API는 로그인·쿠키·결제 정보를 사용하지 않습니다.
사이트 전체를 옮기지 않고 점수 API와 D1만 사용자 Cloudflare 계정에서 운영합니다.

`site/`에서 공식 Wrangler 4.168.0을 사용합니다. Workers **Free**를 유지하고 유료 업그레이드는 하지 않습니다.

```sh
npm exec --yes --package=wrangler@4.168.0 -- wrangler login --scopes account:read user:read workers:write d1:write
npm exec --yes --package=wrangler@4.168.0 -- wrangler d1 create furyawesome-arcade --location apac --binding DB --update-config
npm exec --yes --package=wrangler@4.168.0 -- wrangler d1 migrations apply furyawesome-arcade --remote
# 이전 점수 내보내기 파일이 있는 경우에만 실행합니다. 기존 행은 덮어쓰지 않습니다.
npm exec --yes --package=wrangler@4.168.0 -- wrangler d1 execute furyawesome-arcade --remote --file .cloudflare/scores.sql
npm exec --yes --package=wrangler@4.168.0 -- wrangler deploy
```

DB가 이미 생성되어 있다면 다시 만들지 않고 해당 DB의 `database_id`를 유지합니다.
배포 후 응답으로 받은 실제 `https://…workers.dev/api/arcade/`를 `dist/arcade/config.js`에 설정하고 Pages를 배포합니다.
비밀 토큰은 이 파일이나 Git에 저장하지 않습니다. 기존 Sites는 별도로 재배포하기 전까지 기존 DB를 사용합니다.

검증:

```sh
node site/tests/static-site.mjs --cloudflare
node site/scripts/build-arcade-worker.mjs
node site/tests/arcade-worker.mjs
```

무료 한도: Workers 하루 10만 요청·요청당 CPU 10ms, D1 하루 500만 행 읽기·10만 행 쓰기·총 5GB.
실제 무료 환경에서 긴 플레이 기록의 CPU 사용량은 배포 후 확인해야 합니다.
