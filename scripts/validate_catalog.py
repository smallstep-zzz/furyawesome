"""Validate public data and ensure catalog.json mirrors models/*.json."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
REPO=re.compile(r'[A-Za-z0-9][A-Za-z0-9_.-]*/[A-Za-z0-9][A-Za-z0-9_.-]*')
HF=re.compile(r'https://huggingface\.co/[A-Za-z0-9][A-Za-z0-9_.-]*/[A-Za-z0-9][A-Za-z0-9_.-]*/resolve/[0-9a-f]{40}/[A-Za-z0-9_./-]+\.fxb(?:x|ex)')
SHA40=re.compile(r'[0-9a-f]{40}')
SHA64=re.compile(r'[0-9a-f]{64}')
START='<!-- furyawesome:models:start -->'
END='<!-- furyawesome:models:end -->'
def validate(root=ROOT):
    readme=(root/'README.md').read_text()
    if readme.count(START)!=1 or readme.count(END)!=1:raise ValueError('README markers absent or repeated')
    data=json.loads((root/'catalog.json').read_text())
    if set(data)-{'release_order'}!={'schema_version','source','models','candidates'} or data['schema_version']!=1 or data['source']!='smallstep-zzz/furyawesome':raise ValueError('Invalid catalog contract')
    entries=[json.loads(p.read_text()) for p in sorted((root/'models').glob('*.json'))]
    for x in entries:
        if set(x)!={'schema_version','model','release'} or x['schema_version']!=1:raise ValueError('Invalid model entry schema')
        m,r=x['model'],x['release']
        if not REPO.fullmatch(m.get('source_repo','')) or not SHA40.fullmatch(m.get('source_revision','')):raise ValueError('Unpinned original model')
        if not m.get('source_license') or not m.get('package_license'):raise ValueError('Missing license')
        if not HF.fullmatch(r.get('artifact_url','')) or not SHA64.fullmatch(r.get('author_sha256','')):raise ValueError('Invalid artifact URL or SHA256')
    def stable(entries):return sorted(entries,key=lambda e:(e['model']['source_repo'],e['release']['version'],e['release']['target'],e['release']['precision']))
    if stable(data['models'])!=stable(entries):raise ValueError('catalog.json does not mirror models/*.json')
    for c in data['candidates']:
        if c.get('status')!='pending_metadata' or not REPO.fullmatch(c.get('hf_repo','')):raise ValueError('Invalid candidate')
    return {'models':len(entries),'candidates':len(data['candidates'])}
if __name__=='__main__':
    try:print(json.dumps({'status':'ok',**validate()},ensure_ascii=False))
    except (OSError,ValueError,KeyError,TypeError) as e:print('Catalog invalid:',e,file=sys.stderr);sys.exit(1)
