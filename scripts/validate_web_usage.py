"""Reject missing/stale website guides for the current catalog releases."""
import ast
import json
import re
from pathlib import Path
import subprocess


def validate(root):
    catalog=json.loads((root/'catalog.json').read_text())
    current=json.loads((root/'place-catalog.json').read_text())
    usage=json.loads((root/'web-usage.json').read_text())
    if usage.get('schema_version')!=1:raise ValueError('Invalid web usage schema')
    for model in current['models']:
        source,version=model['source'],model['version']
        entry=next(e for e in catalog['models'] if e['model']['source_repo']==source and e['release']['version']==version)
        guide=usage['models'][source];recipe=guide['recipe'];intro=guide['introduction']
        if not all(v==version for v in [guide['version'],recipe['version'],intro['version']]):
            raise ValueError('Website guide version mismatch: '+source)
        if guide['author_sha256']!=entry['release']['author_sha256']:
            raise ValueError('Website guide package hash mismatch: '+source)
        if not all(intro.get(k,'').strip() for k in ['title','about','use','performance']):
            raise ValueError('Incomplete model introduction: '+source)
        for key,command in recipe.items():
            if isinstance(command,str) and re.search(r'\bpython[23](?:\.\d+)?\s+-m\s+(?:venv|pip)\b',command):
                raise ValueError('Use python for environment/install commands: '+source+' '+key)
        for key in ['setup','rerun']:
            if not recipe.get(key):raise ValueError('Missing sample command: '+source)
            subprocess.run(['bash','-n'],input=recipe[key],text=True,check=True)
        if recipe.get('serve'):
            ast.parse(recipe['python'])
            for key in ['serveSetup','serveQuick']:
                subprocess.run(['bash','-n'],input=recipe[key],text=True,check=True)
    return {'status':'passed','current_models':len(current['models'])}


if __name__=='__main__':
    print(json.dumps(validate(Path(__file__).resolve().parents[1])))
