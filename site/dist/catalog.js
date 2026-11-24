'use strict';

const FURY_CATALOG_URL = 'https://raw.githubusercontent.com/smallstep-zzz/furyawesome/main/place-catalog.json';
const FURY_USAGE_URL = 'https://raw.githubusercontent.com/smallstep-zzz/furyawesome/main/web-usage.json';
window.furyWebUsage = window.furyWebUsageSnapshot ?? {schema_version: 1, models: {}};
const HF_REPO = /^https:\/\/huggingface\.co\/[\w.-]+\/[\w.-]+$/;
const USAGE_URL = /^https:\/\/github\.com\/smallstep-zzz\/furyawesome\/blob\/main\/usage\/[a-z0-9_.-]+\.md$/;
const SOURCE_REPO = /^[A-Za-z0-9][\w.-]*\/[A-Za-z0-9][\w.-]*$/;

window.loadFuryCatalog = async () => {
  try {
    const [response, usage] = await Promise.all([
      fetch(FURY_CATALOG_URL, {cache: 'no-store', signal: AbortSignal.timeout(5000)}),
      fetch(FURY_USAGE_URL, {cache: 'no-store', signal: AbortSignal.timeout(5000)})
        .then(r => r.ok ? r.json() : null).catch(() => null),
    ]);
    if (usage?.schema_version === 1 && usage.models && !Array.isArray(usage.models)) window.furyWebUsage = usage;
    if (!response.ok) return window.furyCatalogSnapshot ?? null;
    const catalog = await response.json();
    if (catalog.schema_version !== 1 || !catalog.categories || !Array.isArray(catalog.models)) return window.furyCatalogSnapshot ?? null;
    const categories = Object.keys(catalog.categories);
    if (!categories.length || !categories.every(key => /^[a-z0-9-]+$/.test(key))) return window.furyCatalogSnapshot ?? null;
    if (!catalog.models.every(model => SOURCE_REPO.test(model.source) && categories.includes(model.category)
      && HF_REPO.test(model.hf) && (USAGE_URL.test(model.usage) || model.usage === model.hf))) return window.furyCatalogSnapshot ?? null;
    return catalog;
  } catch {
    return window.furyCatalogSnapshot ?? null;
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
      const web = window.furyWebUsage.models?.[entry.source];
      const guide = web?.version === entry.version ? web : null;
      const legacy = window.furyRunRecipes?.[entry.source];
      const recipe = guide?.recipe ?? (legacy?.version === entry.version ? legacy : null);
      const run = 'fxbx run ' + entry.source + ' --sample';
      const generic = entry.weights_mode === 'standalone' ? {
        setup: 'python -m pip install --upgrade fxbx\n' + run,
        rerun: run,
      } : {};
      return {
        ...(example ?? generic),
        ...(recipe ?? {}),
        introduction: guide?.introduction ?? null,
        id: example?.id ?? entry.id, origin: entry.source, category: entry.category,
        precision: entry.precision, sdk: entry.sdk, license: entry.license,
        hf: entry.hf, usage: entry.usage, version: entry.version, description: entry.description,
        publishedOn: entry.published_on ?? null,
        purpose: example?.purpose ?? entry.description,
        scope: example?.scope ?? entry.version,
        warning: example?.warning ?? '모델별 설치 환경과 검증 범위는 사용법에서 확인하세요.',
      };
    });
};
