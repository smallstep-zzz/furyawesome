# Private model requests

The public FuryAwesome site sends confirmed requests to its own Worker. The
Worker opens issues only in the private `smallstep-zzz/furyawesome-requests`
repository and verifies its visibility before each write. The public response
contains only the receipt number.

1. Create the private repository with Issues enabled. Keep its collaborator
   list limited to the people who should read requests.
2. Create a private GitHub App with repository Issues read/write permission.
   Install it on that repository only and generate a private key.
3. Set these runtime values in Sites. Store the private key as a secret.

   - `GITHUB_APP_ID`
   - `GITHUB_APP_INSTALLATION_ID`
   - `GITHUB_APP_PRIVATE_KEY_PKCS8_BASE64`

   Convert the GitHub PEM to the single-line secret locally.

   ```sh
   openssl pkcs8 -topk8 -inform PEM -outform DER -nocrypt -in github-app.pem | openssl base64 -A
   ```

4. Build with `python3 scripts/build.py` from `site/`, then package and deploy
   with the existing Sites workflow. Keep the site's access mode public.

Test locally against a mocked GitHub API before enabling real submissions.
