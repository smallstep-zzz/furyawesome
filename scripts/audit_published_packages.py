"""Read bounded public FXBX metadata over HTTP Range; never execute package code.

Counts describe retained declarations, not measured Runnable calls, minimum
partitions, EDF-internal tiles, NPU execution or correctness acceptance.
"""
import argparse
import importlib.metadata
import io
import json
from pathlib import Path
import re
import struct
import urllib.request
import zipfile


class RangeFile(io.RawIOBase):
    def __init__(self, url, *, base=0, size=None, budget=None):
        self.url, self.base, self.position = url, base, 0
        self.budget = budget if budget is not None else [8*1024**2]
        if size is None:
            _, size = self.fetch(0, 1)
        self.size = size

    def fetch(self, start, count):
        if count > self.budget[0]:
            raise ValueError('Metadata byte budget exceeded; full local inspection pending')
        request = urllib.request.Request(self.url, headers={
            'Range': f'bytes={start}-{start+count-1}', 'Accept-Encoding': 'identity'})
        with urllib.request.urlopen(request, timeout=30) as response:
            span = re.fullmatch(r'bytes (\d+)-(\d+)/(\d+)', response.headers.get('Content-Range', ''))
            if response.status != 206 or not span or tuple(map(int, span.groups()[:2])) != (start,start+count-1):
                raise ValueError('Exact HTTP Range unavailable; full local inspection pending')
            data = response.read(count+1)
            if len(data) != count:
                raise ValueError('HTTP Range length differs')
            self.budget[0] -= len(data)
            return data, int(span[3])

    def seekable(self):return True
    def readable(self):return True
    def tell(self):return self.position

    def seek(self, offset, whence=0):
        self.position = offset+(0 if whence==0 else self.position if whence==1 else self.size)
        if not 0 <= self.position <= self.size:
            raise ValueError('Archive seek outside its declared range')
        return self.position

    def read(self, count=-1):
        count = min(self.size-self.position, self.size if count < 0 else count)
        if count <= 0:return b''
        data,_ = self.fetch(self.base+self.position,count)
        self.position += len(data)
        return data

    def nested(self, member):
        if member.compress_type != zipfile.ZIP_STORED or member.compress_size != member.file_size:
            raise ValueError('Compressed nested archive needs bounded local inspection')
        header,_ = self.fetch(self.base+member.header_offset,30)
        if header[:4] != b'PK\x03\x04':raise ValueError('Nested ZIP header differs')
        name,extra = struct.unpack_from('<HH',header,26)
        start = member.header_offset+30+name+extra
        if start+member.file_size > self.size:raise ValueError('Nested archive exceeds parent')
        return RangeFile(self.url,base=self.base+start,size=member.file_size,budget=self.budget)


def document(archive, name):
    if archive.getinfo(name).file_size > 4*1024**2:
        raise ValueError('JSON metadata exceeds inspection bound')
    return json.loads(archive.read(name))


def plan_counts(plan):
    result = {}
    if isinstance(plan.get('steps'),list):
        result['recorded_compile_requests' if plan.get('format')=='sdk-runnable' else 'logical_steps'] = len(plan['steps'])
    if isinstance(plan.get('entries'),dict):
        result['logical_entry_steps'] = {name:len(value.get('steps',[])) for name,value in plan['entries'].items()}
    if isinstance(plan.get('kernels'),dict):result['declared_kernels'] = len(plan['kernels'])
    return result


def inspect_archive(source, prefix='', depth=0):
    if depth > 3:raise ValueError('Nested metadata depth exceeded')
    with zipfile.ZipFile(source) as archive:
        names = archive.namelist()
        if len(names)>100000 or len(set(names))!=len(names):raise ValueError('Archive member count/identity invalid')
        row = {'component':prefix or 'root','edf_members':sum(n.endswith('.edf') for n in names),
               'tensor_members':sum(n.endswith('.safetensors') for n in names),
               'source_graph_members':sum(n.endswith('.pt2') for n in names),
               'binary_history_members':[n for n in names if 'lineage' in n.lower() or 'adaptive' in n.lower()][:8]}
        manifest = document(archive,'manifest.json')
        row['manifest_fields'] = sorted(manifest)
        row['compatibility'] = manifest.get('compatibility')
        if 'execution_plan.json' in names:
            row.update(plan_counts(document(archive,'execution_plan.json')))
        if 'fxbex.provenance.json' in names:
            provenance = document(archive,'fxbex.provenance.json')
            if isinstance(provenance.get('execution_plan'),dict):row.update(plan_counts(provenance['execution_plan']))
            if provenance.get('graph_plan'):row['declared_graph_roots']=1
        result = [row]
        for info in archive.infolist():
            if info.filename.endswith(('.fxbx','.fxbex')):
                try:result += inspect_archive(source.nested(info),prefix+info.filename+'/',depth+1)
                except (ValueError,zipfile.BadZipFile) as error:
                    result.append({'component':prefix+info.filename,'status':'nested_inspection_pending','reason':str(error)})
        return result


def audit(record):
    model,release = record['model'],record['release']
    result = {'source_repo':model['source_repo'],'version':release['version'],
              'artifact_url':release['artifact_url'],'declared_sdk':release.get('sdk_version'),
              'scope':'public metadata only; no package/model code execution',
              'minimum_partitions':None,'numerical_acceptance':'not_run','npu_execution':'not_run'}
    try:
        if not result['artifact_url'].startswith('https://'):raise ValueError('HTTPS artifact required')
        result.update(status='metadata_inspected',components=inspect_archive(RangeFile(result['artifact_url'])))
    except Exception as error:
        result.update(status='inspection_pending',reason=type(error).__name__+': '+str(error))
    return result


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--catalog',type=Path,required=True);parser.add_argument('--output',type=Path,required=True)
    parser.add_argument('--shard-index',type=int,default=0);parser.add_argument('--shard-count',type=int,default=1)
    args=parser.parse_args()
    if not 0<=args.shard_index<args.shard_count:parser.error('Invalid shard')
    records=json.loads(args.catalog.read_text())['models'][args.shard_index::args.shard_count]
    args.output.mkdir(parents=True,exist_ok=False);results=[]
    versions={}
    for package in ['torch','furiosa-torch','furiosa-tcc','fxbx']:
        try:versions[package]=importlib.metadata.version(package)
        except importlib.metadata.PackageNotFoundError:versions[package]=None
    for record in records:
        result=audit(record);results.append(result)
        path=args.output/'result.json';tmp=path.with_suffix('.tmp')
        tmp.write_text(json.dumps({'schema':'furyawesome.package-audit.v1','host_packages':versions,
            'completed':len(results),'total':len(records),'results':results},ensure_ascii=False,indent=2)+'\n');tmp.replace(path)
        print(json.dumps({k:result[k] for k in ['source_repo','version','status']}) ,flush=True)


if __name__=='__main__':main()
