"""Maintain category sources and generate FuryAwesome's public views."""

import argparse
import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit

REPOSITORY = 'smallstep-zzz/furyawesome'
START = '<!-- furyawesome:models:start -->'
END = '<!-- furyawesome:models:end -->'
CATEGORIES = {
    'image': '이미지 생성',
    'vision': '컴퓨터 비전',
    '3d': '3D 생성',
    'decision': '의사결정',
    'embedding': '임베딩',
    'text': '텍스트',
    'audio': '오디오',
    'upscale': '초해상화',
    'other': '기타',
}
PREFIX = 'model-catalog/'


class CatalogError(RuntimeError):
    pass


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False)


def record(payload):
    """Strict metadata allowlist; no binary or token fields, even nested."""
    if not isinstance(payload, dict) or set(payload) != {'schema_version', 'model', 'release'} or payload['schema_version'] != 1:
        raise CatalogError('Expected publication schema_version=1 with model and release only.')
    model_fields = {'name','short_description','readme','category','source_repo','source_revision','source_license','package_license','cover_url'}
    release_fields = {'version','target','precision','sdk_version','runtime_version','adapter','weights_mode','artifact_url','author_sha256'}
    m, r = payload['model'], payload['release']
    if not isinstance(m,dict) or not isinstance(r,dict) or set(m) != model_fields or set(r) != release_fields:
        raise CatalogError('Unknown or missing model/release metadata fields.')
    if not all(isinstance(x,str) for x in [*m.values(),*r.values()]):
        raise CatalogError('Metadata values must be strings.')
    if len(canonical(payload).encode()) > 24000:
        raise CatalogError('Metadata exceeds 24KB.')
    if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_.-]*/[A-Za-z0-9][A-Za-z0-9_.-]*', m['source_repo']):
        raise CatalogError('Invalid source repository.')
    if not re.fullmatch(r'[0-9a-f]{40}',m['source_revision']) or not re.fullmatch(r'[0-9a-f]{64}',r['author_sha256']):
        raise CatalogError('Pinned source commit and package SHA256 are required.')
    if not m['source_license'].strip() or not m['package_license'].strip():
        raise CatalogError('Separate source and package licenses are required.')
    if not re.fullmatch(r'https://huggingface\.co/[A-Za-z0-9][A-Za-z0-9_.-]*/[A-Za-z0-9][A-Za-z0-9_.-]*/resolve/[0-9a-f]{40}/[A-Za-z0-9_./-]+\.fxb(?:x|ex)', r['artifact_url']):
        raise CatalogError('An immutable HTTPS Hugging Face FXBEX resolve URL is required.')
    if any(p in ('','.','..') for p in urlsplit(r['artifact_url']).path.split('/')[1:]):
        raise CatalogError('Invalid artifact path.')
    if re.search(r'(?:hf_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|gh[pousr]_[A-Za-z0-9]{20,}|ofh_[a-f0-9]{64})',canonical(payload)):
        raise CatalogError('Credentials must never be included in catalog metadata.')
    artifact_repo='/'.join(urlsplit(r['artifact_url']).path.split('/')[1:3])
    identity=[artifact_repo,m['source_repo'],r['version'],r['target'],r['precision']]
    key=hashlib.sha256(canonical(identity).encode()).hexdigest()
    return 'models/'+key+'.json', json.loads(canonical(payload))


def md(text):
    text=' '.join(text.split())
    return re.sub(r'([\\`*_\[\]<>|])',r'\\\1',text)


def json_text(value):
    return json.dumps(value, ensure_ascii=False, indent=2) + '\n'


def release_key(entry):
    model, release = entry['model'], entry['release']
    return f"{model['source_repo']}@{release['version']}#{release['author_sha256']}"


def classify(entry):
    model, release = entry['model'], entry['release']
    category = model['category'].strip().lower()
    for key, label in CATEGORIES.items():
        if category in (key, label) and key != 'other':
            return key
    text = ' '.join((category, model['name'], model['source_repo'], release['adapter'])).lower()
    for key, pattern in (
        ('decision', r'decision|julia_rngd'),
        ('embedding', r'embedding|sentence-transformers'),
        ('upscale', r'upscal|super.resolution'),
        ('3d', r'3d|image.to.mesh'),
        ('audio', r'audio|speech|asr|tts'),
        ('image', r'image.generation|text.to.image|image.to.image'),
        ('vision', r'computer.vision|image.classification|object.detection|segmentation'),
        ('text', r'\bllm\b|text.generation|language.model|chat'),
    ):
        if re.search(pattern, text):
            return key
    return 'other'


def category_files():
    return [f'{PREFIX}{key}.json' for key in CATEGORIES]


def read_categories(files):
    groups = {}
    seen = set()
    for category, path in zip(CATEGORIES, category_files()):
        group = json.loads(files.get(path, '[]'))
        if not isinstance(group, list):
            raise CatalogError(f'{path} must contain a list.')
        for row in group:
            if set(row) != {'entry', 'published_on'}:
                raise CatalogError(f'Unexpected fields in {path}.')
            path_id, _ = record(row['entry'])
            if path_id in seen:
                raise CatalogError(f'Duplicate release in {path}.')
            seen.add(path_id)
            date = row['published_on']
            if date is not None and datetime.strptime(date, '%Y-%m-%d').date().isoformat() != date:
                raise CatalogError(f'Invalid publication date in {path}.')
        groups[category] = group
    return groups


def artifact_page(entry):
    path = urlsplit(entry['release']['artifact_url']).path
    return 'https://huggingface.co/' + '/'.join(path.split('/')[1:3])


def render_views(files, groups, paths):
    previous = json.loads(files['catalog.json'])
    if (previous.get('schema_version') != 1 or previous.get('source') != REPOSITORY
            or not isinstance(previous.get('candidates'), list)):
        raise CatalogError('Invalid existing catalog.json.')
    rows = {record(row['entry'])[0]: (category, row)
            for category, group in groups.items() for row in group}
    entries = {path: row['entry'] for path, (_, row) in rows.items()}
    # Preserve the public index's existing order; new releases append.
    previous_paths = [record(entry)[0] for entry in previous.get('models', [])]
    paths_in_order = dict.fromkeys(previous_paths + list(entries))
    entries = {path: entries[path] for path in paths_in_order if path in entries}
    current = {release_key(entry): path for path, entry in entries.items()}
    order = list(dict.fromkeys(k for k in previous.get('release_order', []) if k in current))
    order.extend(k for k in current if k not in order)
    latest = {}
    for key in order:
        path = current[key]
        latest[entries[path]['model']['source_repo']] = path

    readme = files['README.md']
    if readme.count(START) != 1 or readme.count(END) != 1 or readme.index(START) > readme.index(END):
        raise CatalogError('Expected one managed README block.')
    short_counts = {}
    for source in latest:
        short = source.split('/')[-1].casefold()
        short_counts[short] = short_counts.get(short, 0) + 1
    table = ['| 모델 | 용도 | 버전 | 정밀도 / SDK | 라이선스 | 사용법 | 다운로드 |',
             '| --- | --- | --- | --- | --- | --- | --- |']
    place_models = []
    for source, path in sorted(latest.items(), key=lambda item: item[0].split('/')[-1].casefold()):
        category, row = rows[path]
        entry = row['entry']
        m, r = entry['model'], entry['release']
        short = source.split('/')[-1]
        name = short if short_counts[short.casefold()] == 1 else source
        page = artifact_page(entry)
        guide = 'usage/' + short.lower() + '.md'
        if guide not in paths:
            guide = page
        table.append(f"| [{md(name)}]({page}) | {CATEGORIES[category]} | {md(r['version'])} | "
                     f"{md(r['precision'])} / {md(r['sdk_version'])} | {md(m['source_license'])} · [상세]({path}) | "
                     f"[예제]({guide}) | [모델 파일]({r['artifact_url']}) |")
        place_models.append({
            'id': name, 'source': source, 'category': category,
            'version': r['version'], 'precision': r['precision'], 'sdk': r['sdk_version'],
            'license': m['source_license'], 'description': m['short_description'],
            'published_on': row['published_on'], 'hf': page,
            'usage': f'https://github.com/{REPOSITORY}/blob/main/{guide}' if guide in paths else guide,
            'weights_mode': r['weights_mode'],
        })
    block = START + '\n\n' + '\n'.join(table) + '\n\n' + END
    index = {**previous, 'release_order': order, 'models': list(entries.values())}
    outputs = {path: json_text(entry) for path, entry in entries.items()}
    outputs.update({
        'README.md': readme[:readme.index(START)] + block + readme[readme.index(END) + len(END):],
        'catalog.json': json_text(index),
        'place-catalog.json': json_text({'schema_version': 1, 'categories': CATEGORIES, 'models': place_models}),
        **{f'{PREFIX}{key}.json': json_text(group) for key, group in groups.items()},
    })
    return outputs


def changes_for(files, paths, *, add=None, remove=None, category=None):
    """Return path -> text (None means delete), without modifying the checkout."""
    groups = read_categories(files)
    if add is not None:
        new_path, entry = record(add)
        existing = next(((key, row) for key, group in groups.items() for row in group
                         if record(row['entry'])[0] == new_path), None)
        category = category or (existing[0] if existing else classify(entry))
        if category not in CATEGORIES:
            raise CatalogError(f'Unknown category: {category}.')
        published_on = datetime.now(timezone.utc).date().isoformat()
        if existing:
            old_category, row = existing
            old = row['entry']
            old_release, new_release = old['release'].copy(), entry['release'].copy()
            old_url = urlsplit(old_release.pop('artifact_url')).path.split('/')
            new_url = urlsplit(new_release.pop('artifact_url')).path.split('/')
            if (old['model'] != entry['model'] or old_release != new_release
                    or old_url[:4] + old_url[5:] != new_url[:4] + new_url[5:]):
                raise CatalogError('Release identity is immutable. Use a new version.')
            published_on = row['published_on']
            if old_category == category:
                row['entry'] = entry
            else:
                groups[old_category].remove(row)
        if existing is None or existing[0] != category:
            groups[category].append({'entry': entry, 'published_on': published_on})
    if remove is not None:
        if not re.fullmatch(r'models/[a-f0-9]{64}\.json', remove):
            raise CatalogError('Remove expects the release metadata path from the README.')
        for group in groups.values():
            for row in group:
                if record(row['entry'])[0] == remove:
                    group.remove(row)
                    break
            else:
                continue
            break
        else:
            raise CatalogError(f'Unknown release: {remove}.')

    output = render_views(files, groups, paths)
    changes = {path: value for path, value in output.items()
               if (not path.startswith('models/') or path in files or path not in paths)
               and files.get(path) != value}
    changes.update({path: None for path in paths if path.startswith('models/') and path not in output})
    return changes


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='action', required=True)
    add = commands.add_parser('add')
    add.add_argument('metadata', type=Path)
    add.add_argument('--category', choices=CATEGORIES)
    commands.add_parser('remove').add_argument('entry_path')
    commands.add_parser('generate')
    commands.add_parser('check')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    paths = {p.relative_to(root).as_posix() for glob in ('models/*.json', 'usage/*.md')
             for p in root.glob(glob)}
    read = paths | set(category_files()) | {'README.md', 'catalog.json', 'place-catalog.json'}
    files = {p: (root / p).read_text(encoding='utf-8') for p in read if (root / p).is_file()}
    add_entry = json.loads(args.metadata.read_text(encoding='utf-8')) if args.action == 'add' else None
    changes = changes_for(files, paths, add=add_entry, remove=getattr(args, 'entry_path', None),
                          category=getattr(args, 'category', None))
    if args.action == 'check':
        if changes:
            parser.exit(1, 'Out of sync: ' + ', '.join(sorted(changes)) + '\n')
        return
    for path, value in changes.items():
        destination = root / path
        if value is None:
            destination.unlink()
        else:
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_text(value, encoding='utf-8')
    print(f'{len(changes)} catalog files updated.')


if __name__ == '__main__':
    main()
