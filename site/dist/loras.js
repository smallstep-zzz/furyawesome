'use strict';
window.furyLoras=window.furyLorasSnapshot ?? {schema_version:1,adapters:[]};
window.renderFuryLoras=(model,esc)=>{
 const rows=window.furyLoras.adapters.filter(row=>row.models?.includes(model.origin));
 if(!rows.length)return '';
 return '<details class="lora-recommendations"><summary>선별한 LoRA · 추가 옵션 '+rows.length+'개</summary><p>기본 모델은 LoRA 없이 실행합니다. 필요한 스타일만 선택하세요.</p>'+rows.map(row=>'<section><h3>'+esc(row.title)+'</h3><p>'+esc(row.benefit_ko)+'</p><p>'+esc(row.status==='verified_npu'?'NPU 실행 확인':'후보 · NPU 품질 미검증')+' · '+esc(row.license)+' · '+(row.bytes/1048576).toFixed(1)+' MiB</p><details><summary>호환 조건·예시</summary>'+row.constraints_ko.map(s=>'<p>'+esc(s)+'</p>').join('')+'<p>프롬프트 예: '+esc(row.example_prompt)+'</p><p>권장 시작 강도: '+esc(String(row.strength))+'</p></details><a href="https://huggingface.co/'+esc(row.repo)+'/blob/'+esc(row.revision)+'/README.md" target="_blank" rel="noopener noreferrer">원본·라이선스 ↗</a></section>').join('')+'<p>실제 가져오기·선택은 fxbX 서빙 화면의 추가 옵션에서 합니다. 해당 패키지의 LoRA 연결과 호환 검사가 필요합니다. 한국풍 스타일과 한국어 이해 능력은 다릅니다.</p></details>';
};
fetch('https://raw.githubusercontent.com/smallstep-zzz/furyawesome/main/lora-catalog.json',{cache:'no-store',signal:AbortSignal.timeout(5000)}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(doc=>{if(doc.schema_version!==1||!Array.isArray(doc.adapters))return;window.furyLoras=doc;window.dispatchEvent(new Event('fury-loras-ready'));}).catch(()=>{});
