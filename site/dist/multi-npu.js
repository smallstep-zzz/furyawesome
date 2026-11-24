(() => {
  const section = document.querySelector('#multi-npu');
  const list = section.querySelector('ul');
  const source = 'https://raw.githubusercontent.com/smallstep-zzz/furyawesome/main/multi-npu.json';
  const topology = {
    same_host_tensor_parallel: '한 서버 · 텐서 병렬',
    same_host_pipeline_parallel: '한 서버 · 파이프라인 병렬',
    cross_host_pipeline: '여러 서버 · 단계 분산',
  };
  const publicUrl = /^https:\/\/(huggingface\.co|github\.com)\/[a-z0-9_./#-]+$/i;

  function element(tag, label, className) {
    const node = document.createElement(tag);
    node.textContent = label;
    if (className) node.className = className;
    return node;
  }

  function link(label, url) {
    const node = element('a', label);
    node.href = url;
    return node;
  }

  async function readCatalog(url) {
    const response = await fetch(url, {cache: 'no-store', signal: AbortSignal.timeout(5000)});
    if (!response.ok) throw new Error('Catalog unavailable');
    return response.json();
  }

  async function loadProfiles() {
    const cacheKey = Math.floor(Date.now() / 60_000);
    const catalog = await readCatalog(`${source}?v=${cacheKey}`).catch(async () => {
      const snapshot = await readCatalog('multi-npu-snapshot.json');
      const note = link('게시 시점 목록 · 최신 상태 보기',
        'https://github.com/smallstep-zzz/furyawesome/blob/main/MULTI_NPU.md');
      section.append(note);
      return snapshot;
    });
    if (catalog.schema_version !== 1 || !Array.isArray(catalog.profiles)) return;
    for (const profile of catalog.profiles) {
      const placement = topology[profile.topology];
      const verification = profile.verification;
      if (typeof placement !== 'string' || !Number.isInteger(profile.npu_count) || profile.npu_count < 2 ||
          !publicUrl.test(profile.artifact_url) || !publicUrl.test(profile.usage_url) ||
          !['verified', 'unverified'].includes(verification?.state)) continue;

      const item = element('li', '');
      const info = element('div', '');
      info.append(element('strong', profile.source_repo), element('small',
        `RNGD ${profile.npu_count}장 · ${placement} · SDK ${profile.sdk} · ${profile.version}`));
      const actions = element('div', '', 'multi-npu-actions');
      if (verification.state === 'unverified') {
        actions.append(element('span', '실행 미검증', 'multi-npu-pending'));
      } else if (publicUrl.test(verification.evidence_url)) {
        actions.append(link('실행 검증 기록', verification.evidence_url));
      } else {
        actions.append(element('span', '실행 검증 완료'));
      }
      actions.append(link('사용법', profile.usage_url), link('다운로드', profile.artifact_url));
      item.append(info, actions);
      list.append(item);
    }
    section.hidden = list.childElementCount === 0;
  }

  loadProfiles().catch(() => {});
})();
