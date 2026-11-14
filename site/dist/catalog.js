'use strict';

const FURY_CATALOG_URL = 'https://raw.githubusercontent.com/smallstep-zzz/furyawesome/main/place-catalog.json';
const HF_REPO = /^https:\/\/huggingface\.co\/[\w.-]+\/[\w.-]+$/;
const USAGE_URL = /^https:\/\/github\.com\/smallstep-zzz\/furyawesome\/blob\/main\/usage\/[a-z0-9_.-]+\.md$/;
const SOURCE_REPO = /^[A-Za-z0-9][\w.-]*\/[A-Za-z0-9][\w.-]*$/;

window.loadFuryCatalog = async () => {
  try {
    const response = await fetch(FURY_CATALOG_URL, {cache: 'no-store', signal: AbortSignal.timeout(5000)});
    if (!response.ok) return null;
    const catalog = await response.json();
    if (catalog.schema_version !== 1 || !catalog.categories || !Array.isArray(catalog.models)) return null;
    const categories = Object.keys(catalog.categories);
    if (!categories.length || !categories.every(key => /^[a-z0-9-]+$/.test(key))) return null;
    if (!catalog.models.every(model => SOURCE_REPO.test(model.source) && categories.includes(model.category)
      && HF_REPO.test(model.hf) && (USAGE_URL.test(model.usage) || model.usage === model.hf))) return null;
    return catalog;
  } catch {
    return null;
  }
};

window.furyCategories = (design, catalog) => [
  ...design,
  ...Object.entries(catalog.categories)
    .filter(([id]) => !design.some(category => category.id === id)
      && catalog.models.some(model => model.category === id))
    .map(([id, label]) => ({id, label, ko: label, icon: 'layers', tag: label, vehicle: ''})),
];

window.furyModels = (design, catalog) => {
  const designs = new Map(design.map((model, index) => [model.origin, {model, index}]));
  return [...catalog.models]
    .sort((a, b) => (designs.get(a.source)?.index ?? Infinity) - (designs.get(b.source)?.index ?? Infinity))
    .map(entry => {
      const original = designs.get(entry.source)?.model;
      // A curated example belongs to a specific release, including any pinned weights.
      const example = original?.version === entry.version ? original : null;
      const run = 'fxbx run ' + entry.source + ' --sample';
      const generic = entry.weights_mode === 'standalone' ? {
        setup: 'python -m pip install --upgrade fxbx\n' + run,
        rerun: run,
      } : {};
      return {
        ...(example ?? generic),
        id: example?.id ?? entry.id, origin: entry.source, category: entry.category,
        precision: entry.precision, sdk: entry.sdk, license: entry.license,
        hf: entry.hf, usage: entry.usage,
        purpose: example?.purpose ?? entry.description,
        scope: example?.scope ?? entry.version,
        warning: example?.warning ?? '모델별 설치 환경과 검증 범위는 사용법에서 확인하세요.',
        status: example?.status ?? '공개 릴리스',
      };
    });
};
