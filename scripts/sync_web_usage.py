"""Refresh bundled usage examples and content-based browser cache keys."""
import hashlib
import json
from pathlib import Path
import re


def sync(root):
    dist=root/'site/dist'
    data=json.loads((root/'web-usage.json').read_text())
    for name,variable,value in (
        ('web-usage-snapshot.js','furyWebUsageSnapshot',data),
        ('run-recipes.js','furyRunRecipes',{key:row['recipe'] for key,row in data['models'].items()}),
    ):
        (dist/name).write_text('/* Generated from FuryAwesome web-usage.json. */\nwindow.'+variable+' = '+json.dumps(value,ensure_ascii=False,indent=2)+';\n')
    index=dist/'index.html'
    source=index.read_text()
    def version(match):
        name=match[1]
        digest=hashlib.sha256((dist/name).read_bytes()).hexdigest()[:12]
        return f'<script src="{name}?v={digest}"></script>'
    source=re.sub(r'<script src="([\w-]+\.js)(?:\?v=[^"]*)?"></script>',version,source)
    index.write_text(source)


if __name__=='__main__':
    sync(Path(__file__).resolve().parents[1])
