"""Data-only LoRA recommendations shared by FuryAwesome and fxbX."""
import argparse
import json
from pathlib import Path, PurePosixPath
import re
import tempfile

ROOT=Path(__file__).resolve().parents[1]
REPO=re.compile(r'[A-Za-z0-9][\w.-]*/[A-Za-z0-9][\w.-]*')


def validate(row):
    required={'id','models','repo','revision','filename','bytes','license','title','benefit_ko','constraints_ko','trigger','example_prompt','strength','status','kind','references','checked_on','evidence'}
    if not isinstance(row,dict) or set(row)!=required:raise ValueError('Unknown or missing LoRA fields')
    if not re.fullmatch(r'[a-z0-9][a-z0-9-]{0,79}',row['id']):raise ValueError('Invalid ID')
    if not REPO.fullmatch(row['repo']) or not re.fullmatch(r'[0-9a-f]{40}',row['revision']):raise ValueError('Pin the exact HF repository revision')
    path=PurePosixPath(row['filename'])
    if path.is_absolute() or any(p in ('..','.') for p in path.parts) or not row['filename'].endswith('.safetensors'):raise ValueError('Use a safetensors weight path')
    if not row['models'] or any(not REPO.fullmatch(s) for s in row['models']):raise ValueError('Declare exact published base model IDs')
    if isinstance(row['bytes'],bool) or not isinstance(row['bytes'],int) or row['bytes']<=0:raise ValueError('Record weight bytes')
    if row['status'] not in ('candidate','verified_npu','hold'):raise ValueError('Unknown verification state')
    if row['kind'] not in ('style','acceleration','image_translation','domain'):raise ValueError('Unknown LoRA purpose')
    if not isinstance(row['constraints_ko'],list) or not all(isinstance(s,str) for s in row['constraints_ko']):raise ValueError('Explain restrictions')
    if not row['references'] or any(not s.startswith('https://huggingface.co/') for s in row['references']):raise ValueError('Use original HF evidence links')
    if row['status']=='verified_npu' and not row['evidence']:raise ValueError('NPU verification requires a published evidence link')
    if len(json.dumps(row,ensure_ascii=False).encode())>32000:raise ValueError('Keep metadata concise')
    return row


def read(root=ROOT):
    path=Path(root)/'lora-catalog.json'
    doc=json.loads(path.read_text()) if path.exists() else {'schema_version':1,'adapters':[]}
    if doc.get('schema_version')!=1 or not isinstance(doc.get('adapters'),list):raise ValueError('Invalid catalog')
    for row in doc['adapters']:validate(row)
    if len({r['id'] for r in doc['adapters']})!=len(doc['adapters']):raise ValueError('Duplicate ID')
    return doc


def write(doc,root):
    path=Path(root)/'lora-catalog.json'
    with tempfile.NamedTemporaryFile(mode='w',dir=path.parent,delete=False,encoding='utf8') as stream:
        json.dump(doc,stream,ensure_ascii=False,indent=2);stream.write('\n');temp=Path(stream.name)
    temp.replace(path)
    snapshot=Path(root)/'site/dist/lora-snapshot.js'
    if snapshot.parent.is_dir():snapshot.write_text('window.furyLorasSnapshot = '+path.read_text().strip()+';\n',encoding='utf8')


def upsert(row,root=ROOT):
    validate(row);doc=read(root)
    published={m['source'] for m in json.loads((Path(root)/'place-catalog.json').read_text())['models']}
    if not set(row['models'])<=published:raise ValueError('Unknown published model')
    doc['adapters']=[r for r in doc['adapters'] if r['id']!=row['id']]+[row]
    doc['adapters'].sort(key=lambda r:r['id']);write(doc,root)


def remove(identifier,root=ROOT):
    doc=read(root);rows=[r for r in doc['adapters'] if r['id']!=identifier]
    if len(rows)==len(doc['adapters']):raise ValueError('Unknown LoRA ID')
    doc['adapters']=rows;write(doc,root)


if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);sub=p.add_subparsers(dest='action',required=True)
    sub.add_parser('add').add_argument('metadata',type=Path)
    sub.add_parser('remove').add_argument('id')
    sub.add_parser('check');args=p.parse_args()
    if args.action=='add':upsert(json.loads(args.metadata.read_text()))
    elif args.action=='remove':remove(args.id)
    else:print(f"{len(read()['adapters'])} LoRA records validated")
