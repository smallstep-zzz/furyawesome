"""A verification receipt can only clear the badge for its own compiled profile."""
import json
import unittest

from multi_npu import confirm, render


class MultiNpuVerificationTest(unittest.TestCase):
    def setUp(self):
        self.profile = {
            'id': 'example-model', 'source_repo': 'example/model',
            'source_revision': '0' * 40, 'version': 'test-v1', 'sdk': '2026.4.0',
            'npu_count': 2, 'topology': 'same_host_tensor_parallel',
            'artifact_url': 'https://huggingface.co/example/model/resolve/' + '1' * 40 + '/model.fxb',
            'artifact_sha256': '2' * 64, 'usage_url': 'https://huggingface.co/example/model',
            'verification': {'state': 'unverified'},
        }
        self.receipt = {key: self.profile[key] for key in ('artifact_sha256', 'npu_count', 'topology', 'sdk')}
        self.receipt.update(passed=True, verified_on='2026-11-24')

    def test_success_clears_pending_badge(self):
        self.assertIn('미검증', render([self.profile]))
        confirm(self.profile, json.dumps(self.receipt).encode())
        self.assertNotIn('미검증', render([self.profile]))
        self.assertIn('검증 완료', render([self.profile]))

    def test_unrelated_or_failed_receipt_keeps_pending_badge(self):
        for change in ({'topology': 'cross_host_pipeline'}, {'npu_count': 1}, {'npu_count': 2.0},
                       {'artifact_sha256': '3' * 64}, {'passed': False}):
            with self.subTest(change=change), self.assertRaises(ValueError):
                confirm(self.profile, json.dumps(dict(self.receipt, **change)).encode())
            self.assertEqual(self.profile['verification'], {'state': 'unverified'})


if __name__ == '__main__':
    unittest.main()
