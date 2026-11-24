import copy
import json
from pathlib import Path
import tempfile
import unittest
from lora_store import read,upsert,remove,validate,ROOT


class StoreTests(unittest.TestCase):
    def test_add_remove_and_no_false_verification(self):
        row=copy.deepcopy(read()['adapters'][0])
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);(root/'place-catalog.json').write_text(json.dumps({'models':[{'source':m} for m in row['models']]}))
            (root/'site/dist').mkdir(parents=True)
            upsert(row,root);upsert(row,root)
            self.assertEqual(len(read(root)['adapters']),1)
            self.assertTrue((root/'site/dist/lora-snapshot.js').read_text().startswith('window.furyLorasSnapshot'))
            row['status']='verified_npu';row['evidence']=[]
            with self.assertRaises(ValueError):upsert(row,root)
            self.assertEqual(len(read(root)['adapters']),1)
            remove(row['id'],root);self.assertFalse(read(root)['adapters'])

    def test_unknown_model_and_revision(self):
        row=copy.deepcopy(read()['adapters'][0]);row['revision']='main'
        with self.assertRaises(ValueError):validate(row)
        row=copy.deepcopy(read()['adapters'][0]);row['models']=['unknown/base']
        with self.assertRaises(ValueError):upsert(row)


if __name__=='__main__':unittest.main()
