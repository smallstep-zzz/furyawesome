import unittest
from catalog_store import runnable_name


class CatalogIdentityTests(unittest.TestCase):
    def entry(self,name,source):
        return {'model':{'name':name,'source_repo':source}}

    def test_shared_upstream_assets_keep_an_explicit_runnable_model_name(self):
        row=self.entry('YOLO26n','ultralytics/assets')
        self.assertEqual(runnable_name(row,[row]),'YOLO26n')
        self.assertEqual(row['model']['source_repo'],'ultralytics/assets')

    def test_name_and_short_alias_collisions_use_the_full_source(self):
        row=self.entry('Same','a/model')
        other=self.entry('Same','b/model')
        self.assertEqual(runnable_name(row,[row,other]),'a/model')

    def test_long_display_labels_keep_the_unique_short_source(self):
        row=self.entry('A reviewed human description','a/model')
        self.assertEqual(runnable_name(row,[row]),'model')


if __name__=='__main__':unittest.main()
