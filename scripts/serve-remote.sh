#!/usr/bin/env bash
# Run fxbX on a remote RNGD server and open a local-only SSH tunnel.
set -euo pipefail

usage() {
  cat <<'HELP'
Usage: bash scripts/serve-remote.sh SSH_HOST [MODEL] [PORT]

Examples:
  bash scripts/serve-remote.sh rngd-server
  bash scripts/serve-remote.sh user@203.0.113.10 FLUX.2-klein-4B 8000

Requirements:
  - SSH access to the remote RNGD server
  - fxbx, compatible Furiosa SDK, and model dependencies installed on that server
  - Local port is available; keep this terminal open while using the service
HELP
}
if [[ $# -lt 1 || $# -gt 3 || "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
  if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then exit 0; fi
  exit 2
fi

host=$1
model=${2:-FLUX.2-klein-4B}
port=${3:-8000}

# Keep remote command arguments restricted rather than interpolating arbitrary shell.
if [[ ! $host =~ ^[A-Za-z0-9_][A-Za-z0-9._@-]*$ ]]; then
  echo "Invalid SSH host or alias: $host" >&2; exit 2
fi
if [[ ! $model =~ ^[A-Za-z0-9_][A-Za-z0-9._/+@-]*$ ]]; then
  echo "Invalid model name: $model" >&2; exit 2
fi
if [[ ! $port =~ ^[0-9]{1,5}$ ]] || ((10#$port < 1024 || 10#$port > 65535)); then
  echo "PORT must be a number from 1024 to 65535" >&2; exit 2
fi
port=$((10#$port))

command -v ssh >/dev/null || { echo 'OpenSSH client (ssh) is required' >&2; exit 1; }

echo "Remote RNGD host: $host"
echo "Model: $model"
echo "Local endpoint: http://127.0.0.1:$port/predict"
echo "Use another local terminal to send requests. Press Ctrl-C here to stop."

# Remote fxbx binds to 127.0.0.1; no public-facing listener is created.
# The SSH host key is checked by OpenSSH's normal configuration.
exec ssh -tt -o ExitOnForwardFailure=yes \
  -L "127.0.0.1:${port}:127.0.0.1:${port}" \
  "$host" "exec fxbx serve '$model' --port '$port'"
