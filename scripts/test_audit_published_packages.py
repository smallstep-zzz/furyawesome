import io
import json
import unittest
from unittest.mock import patch
import zipfile

from audit_published_packages import RangeFile,inspect_archive,plan_counts,audit


class PackageMetadataAudit(unittest.TestCase):
    def package(self, **files):
        data=io.BytesIO()
        with zipfile.ZipFile(data,'w',compression=zipfile.ZIP_STORED) as archive:
            for name,value in {'manifest.json':{},**files}.items():
                archive.writestr(name,json.dumps(value))
        return data.getvalue()

    def test_remote_ranges_and_nested_stored_metadata_without_weight_read(self):
        nested=self.package(**{'fxbex.provenance.json':{'execution_plan':{'entries':{'forward':{'steps':[{},{}]}},'kernels':{'a':{},'b':{}}}}})
        data=io.BytesIO()
        with zipfile.ZipFile(data,'w',compression=zipfile.ZIP_STORED) as archive:
            archive.writestr('manifest.json','{}');archive.writestr('model.fxbx',nested)
            archive.writestr('weights.safetensors',b'x'*1000000)
        raw=data.getvalue();read=[0]
        def fetch(self,start,count):read[0]+=count;return raw[start:start+count],len(raw)
        with patch.object(RangeFile,'fetch',fetch):
            result=inspect_archive(RangeFile('https://example.invalid/package'))
        self.assertEqual(result[1]['logical_entry_steps'],{'forward':2})
        self.assertEqual(result[0]['tensor_members'],1);self.assertLess(read[0],100000)

    def test_counts_and_failures_are_not_runtime_or_minimum_partition_claims(self):
        self.assertEqual(plan_counts({'format':'sdk-runnable','steps':[{},{}]}),{'recorded_compile_requests':2})
        with patch('audit_published_packages.RangeFile',side_effect=ValueError('range unavailable')):
            row=audit({'model':{'source_repo':'test/model'},'release':{'version':'v1','artifact_url':'https://example.invalid/a'}})
        self.assertEqual(row['status'],'inspection_pending');self.assertIsNone(row['minimum_partitions'])
        self.assertEqual(row['npu_execution'],'not_run')


if __name__=='__main__':unittest.main()
