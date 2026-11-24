"""Maintain compiled multi-RNGD profiles and their release-bound runtime evidence."""
import argparse
from datetime import date
from hashlib import sha256
import json
from pathlib import Path
import re
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[1]
DATA = 'multi-npu.json'
PAGE = 'MULTI_NPU.md'
SHA256 = re.compile(r'[0-9a-f]{64}')
IDENTIFIER = re.compile(r'[A-Za-z0-9][A-Za-z0-9_.-]*')
REPOSITORY = re.compile(r'[A-Za-z0-9][A-Za-z0-9_.-]*/[A-Za-z0-9][A-Za-z0-9_.-]*')
ARTIFACT = re.compile(r'https://huggingface\.co/[\w.-]+/[\w.-]+/resolve/[0-9a-f]{40}/[A-Za-z0-9_./-]+\.(?:fxbx?|zip)')
TOPOLOGIES = {'same_host_tensor_parallel': '한 서버 · 텐서 병렬',
              'cross_host_pipeline': '여러 서버 · 단계 분산'}


def public_link(value):
    return isinstance(value, str) and re.fullmatch(r'https://(?:huggingface\.co|github\.com)/[A-Za-z0-9_./#-]+', value) is not None


def validate_profile(profile):
    fields = {'id', 'source_repo', 'source_revision', 'version', 'sdk', 'npu_count', 'topology',
              'artifact_url', 'artifact_sha256', 'usage_url', 'verification'}
    if not isinstance(profile, dict) or set(profile) != fields:
        raise ValueError('Invalid multi-NPU profile fields')
    for key in fields - {'npu_count', 'verification'}:
        if not isinstance(profile[key], str):
            raise ValueError(f'Invalid {key}')
    for key in ('id', 'version', 'sdk'):
        if not IDENTIFIER.fullmatch(profile[key]):
            raise ValueError(f'Invalid {key}')
    if not REPOSITORY.fullmatch(profile['source_repo']) or not re.fullmatch('[0-9a-f]{40}', profile['source_revision']):
        raise ValueError('Original model repository and commit must be pinned')
    if type(profile['npu_count']) is not int or profile['npu_count'] < 2 or profile['topology'] not in TOPOLOGIES:
        raise ValueError('A multi-NPU profile needs at least two physical devices and a known topology')
    url = profile['artifact_url']
    if not ARTIFACT.fullmatch(url) or any(s in ('', '.', '..') for s in urlsplit(url).path[1:].split('/')):
        raise ValueError('Compiled artifact must use an immutable Hugging Face URL')
    if not SHA256.fullmatch(profile['artifact_sha256']) or not public_link(profile['usage_url']):
        raise ValueError('Artifact SHA-256 and a public usage link are required')
    verification = profile['verification']
    if verification == {'state': 'unverified'}:
        return
    if (not isinstance(verification, dict)
            or set(verification) != {'state', 'verified_on', 'receipt_sha256', 'evidence_url'}
            or verification['state'] != 'verified'
            or not isinstance(verification['receipt_sha256'], str)
            or not SHA256.fullmatch(verification['receipt_sha256'])
            or not isinstance(verification['verified_on'], str)
            or date.fromisoformat(verification['verified_on']).isoformat() != verification['verified_on']
            or (verification['evidence_url'] is not None and not public_link(verification['evidence_url']))):
        raise ValueError('Invalid runtime verification record')


def confirm(profile, receipt_bytes):
    receipt = json.loads(receipt_bytes)
    for key in ('artifact_sha256', 'npu_count', 'topology', 'sdk'):
        if receipt.get(key) != profile[key] or type(receipt[key]) is not type(profile[key]):
            raise ValueError(f'Runtime receipt differs from the compiled profile on {key}')
    if receipt.get('passed') is not True:
        raise ValueError('Runtime receipt must record a passing execution')
    verification = {'state': 'verified', 'verified_on': receipt.get('verified_on'),
                    'receipt_sha256': sha256(receipt_bytes).hexdigest(),
                    'evidence_url': receipt.get('evidence_url')}
    validate_profile(dict(profile, verification=verification))
    profile['verification'] = verification


def render(profiles):
    lines = ['# 다중 NPU 릴리스', '',
             '장치 수와 연결 방식은 각 프로필의 조건입니다. 실제 실행 상태는 릴리스별 검증 기록을 따릅니다.', '',
             '| 모델 | 물리 RNGD | 배치 | SDK / 버전 | 실행 | 파일 | 사용법 |',
             '| --- | ---: | --- | --- | --- | --- | --- |']
    for profile in profiles:
        v = profile['verification']
        status = '미검증' if v['state'] == 'unverified' else '검증 완료'
        if v.get('evidence_url'):
            status = f'[{status}]({v["evidence_url"]})'
        lines.append(f'| {profile["source_repo"]} | {profile["npu_count"]} | {TOPOLOGIES[profile["topology"]]} | '
                     f'{profile["sdk"]} / {profile["version"]} | {status} | [다운로드]({profile["artifact_url"]}) | '
                     f'[예제]({profile["usage_url"]}) |')
    return '\n'.join(lines) + '\n'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='action', required=True)
    commands.add_parser('add').add_argument('profile', type=Path)
    verify = commands.add_parser('verify')
    verify.add_argument('id')
    verify.add_argument('receipt', type=Path)
    commands.add_parser('generate')
    commands.add_parser('check')
    args = parser.parse_args()
    data_path, page_path = ROOT / DATA, ROOT / PAGE
    catalog = json.loads(data_path.read_text(encoding='utf-8'))
    if set(catalog) != {'schema_version', 'profiles'} or catalog['schema_version'] != 1:
        parser.error('Invalid multi-NPU catalog schema')
    profiles = catalog['profiles']
    by_id = {profile['id']: profile for profile in profiles}
    if len(by_id) != len(profiles):
        parser.error('Duplicate multi-NPU profile IDs')
    if args.action == 'add':
        profile = json.loads(args.profile.read_text(encoding='utf-8'))
        validate_profile(profile)
        if profile['verification']['state'] != 'unverified':
            parser.error('Use verify to record a completed runtime check')
        if profile['id'] in by_id:
            if by_id[profile['id']] != profile:
                parser.error('Profile ID already belongs to a published artifact')
        else:
            profiles.append(profile)
    if args.action == 'verify':
        confirm(by_id[args.id], args.receipt.read_bytes())
    for profile in profiles:
        validate_profile(profile)
    page = render(profiles)
    if args.action == 'check':
        if page_path.read_text(encoding='utf-8') != page:
            parser.error(f'{PAGE} is out of sync with {DATA}')
        return
    if args.action in ('add', 'verify'):
        data_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    page_path.write_text(page, encoding='utf-8')


if __name__ == '__main__':
    main()
