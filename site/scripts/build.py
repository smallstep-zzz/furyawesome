"""Bundle the existing site and its request handler for Sites Worker hosting."""
import base64
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
dist = root / "dist"
server = dist / "server"
server.mkdir(exist_ok=True)
assets = {
    "/": dist / "index.html",
    "/catalog.js": dist / "catalog.js",
    **{f"/assets/{path.name}": path for path in (dist / "assets").iterdir() if path.is_file()},
}
types = {".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
         ".webp": "image/webp", ".svg": "image/svg+xml"}
encoded = {
    route: [types[path.suffix], base64.b64encode(path.read_bytes()).decode("ascii")]
    for route, path in assets.items()
}
source = (root / "worker/index.mjs").read_text()
(server / "index.js").write_text("const assets = " + json.dumps(encoded) + ";\n" + source)
