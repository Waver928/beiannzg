(function(){
  function $(s,p){return (p||document).querySelector(s)}
  function $$(s,p){return Array.prototype.slice.call((p||document).querySelectorAll(s))}
  function toast(title,text){
    var box=$('.toast-wrap');if(!box){box=document.createElement('div');box.className='toast-wrap';document.body.appendChild(box)}
    var el=document.createElement('div');el.className='toast';el.innerHTML='<b>'+title+'</b><span>'+text+'</span>';box.appendChild(el);
    setTimeout(function(){el.style.opacity='0';el.style.transform='translateX(18px)';setTimeout(function(){el.remove()},220)},2800)
  }
  function ensureModal(){
    var back=$('.modal-backdrop');if(back)return back;
    back=document.createElement('div');back.className='modal-backdrop';back.innerHTML='<div class="modal"><div class="modal-head"><h3 id="modalTitle">操作</h3><button class="modal-close">×</button></div><div class="modal-body" id="modalBody"></div><div class="modal-foot"><button class="btn modal-cancel">取消</button><button class="btn primary" id="modalConfirm">确认</button></div></div>';document.body.appendChild(back);
    back.addEventListener('click',function(e){if(e.target===back||e.target.closest('.modal-close')||e.target.closest('.modal-cancel'))closeModal()});return back
  }
  function openModal(title,html,confirm,onConfirm){
    var back=ensureModal();$('#modalTitle').textContent=title;$('#modalBody').innerHTML=html;$('#modalConfirm').textContent=confirm||'确认';
    $('#modalConfirm').onclick=function(){if(onConfirm)onConfirm();closeModal()};back.classList.add('show')
  }
  function closeModal(){var b=$('.modal-backdrop');if(b)b.classList.remove('show')}
  function form(fields){
    return '<div class="form-grid">'+fields.map(function(f){return '<div class="form-item '+(f.full?'full':'')+'"><label>'+f.label+'</label>'+(f.type==='select'?'<select>'+f.options.map(function(x){return '<option>'+x+'</option>'}).join('')+'</select>':f.type==='textarea'?'<textarea placeholder="'+(f.placeholder||'')+'">'+(f.value||'')+'</textarea>':'<input type="'+(f.type||'text')+'" value="'+(f.value||'')+'" placeholder="'+(f.placeholder||'')+'">')+'</div>'}).join('')+'</div>'
  }
  function tick(){var el=$('#clock');if(el){var d=new Date();el.textContent=d.toLocaleDateString('zh-CN').replace(/\//g,'-')+' '+d.toLocaleTimeString('zh-CN',{hour12:false})}}
  setInterval(tick,1000);tick();
  var menu=$('#mobileMenu');if(menu)menu.onclick=function(){$('.sidebar').classList.toggle('open')};
  $$('.switch').forEach(function(s){s.onclick=function(){s.classList.toggle('on');toast('状态已更新',s.classList.contains('on')?'已启用当前配置':'已停用当前配置')}});
  $$('.tab').forEach(function(t){t.onclick=function(){var box=t.closest('[data-tabs]');if(!box)return;$$('.tab',box).forEach(function(x){x.classList.remove('active')});t.classList.add('active');var target=t.dataset.target;if(target){$$('[data-tab-panel]',box.parentElement).forEach(function(x){x.style.display=x.dataset.tabPanel===target?'block':'none'})}}});
  $$('[data-filter-table]').forEach(function(input){input.oninput=function(){var q=input.value.toLowerCase(),table=document.getElementById(input.dataset.filterTable);if(!table)return;$$('tbody tr',table).forEach(function(tr){tr.style.display=tr.textContent.toLowerCase().indexOf(q)>-1?'':'none'})}});
  $$('.check-card').forEach(function(c){c.onclick=function(e){if(e.target.tagName!=='INPUT'){var box=$('input',c);if(box)box.checked=!box.checked}c.classList.toggle('selected',$('input',c)&&$('input',c).checked);updateSelected()}});
  function updateSelected(){var el=$('#selectedCount');if(el)el.textContent=$$('.check-card input:checked').length}
  function runProgress(){
    var btn=$('[data-action="run-compute"]'),bar=$('#computeProgress'),stage=$('#computeStage'),result=$('#computeResult');if(!btn||!bar)return;
    btn.disabled=true;btn.textContent='计算中…';if(result)result.style.display='none';var p=0,steps=['校验输入参数','调用气象与土壤数据','执行规则引擎','运行评分模型','生成解释与报告'];
    var timer=setInterval(function(){p=Math.min(100,p+Math.ceil(Math.random()*13));bar.style.setProperty('--p',p+'%');if(stage)stage.textContent=steps[Math.min(steps.length-1,Math.floor(p/21))]+' · '+p+'%';if(p>=100){clearInterval(timer);btn.disabled=false;btn.textContent='重新计算';if(result)result.style.display='block';toast('模型计算完成','耗时 1.86 秒，生成 4 个候选品种与完整解释')}},240)
  }
  function genericDetail(row){
    var title=$('td',row)?$('td',row).textContent.trim():'详情';
    openModal(title,'<div class="timeline"><div class="timeline-item"><time>2026-11-02 10:42:18</time><b>记录创建</b><p>系统已保存基础信息和配置参数。</p></div><div class="timeline-item"><time>2026-11-02 10:43:06</time><b>校验通过</b><p>字段、依赖数据和授权范围检查正常。</p></div><div class="timeline-item"><time>2026-11-02 10:44:21</time><b>状态更新</b><p>当前记录已进入业务流程。</p></div></div>','关闭')
  }
  document.addEventListener('click',function(e){
    var btn=e.target.closest('[data-action]');if(!btn)return;var a=btn.dataset.action;
    if(a==='run-compute'){runProgress();return}
    if(a==='new-model')openModal('新增模型',form([{label:'模型名称',placeholder:'例如：寒地大豆品种筛选模型'},{label:'适用作物',type:'select',options:['大豆','玉米','水稻']},{label:'责任人',value:'模型管理员'},{label:'当前版本',value:'v1.0.0'},{label:'算法与用途说明',type:'textarea',full:true,placeholder:'描述模型算法、输入输出和适用范围'}]),'保存模型',function(){toast('模型已创建','已进入待配置状态，可继续设置参数和发布版本')});
    else if(a==='publish-model')openModal('发布模型','<div class="form-section"><h3>发布检查</h3><p>✓ 输入输出参数完整</p><p>✓ 验证数据集通过</p><p>✓ 接口权限已配置</p><p class="yellow">发布后业务系统可调用当前版本。</p></div>','确认发布',function(){toast('发布成功','模型 v2.7.0 已发布并启用')});
    else if(a==='save-rules')toast('规则配置已保存','当前规则集已生成新草稿版本');
    else if(a==='simulate-rules')openModal('规则命中模拟','<table><thead><tr><th>输入条件</th><th>值</th><th>结果</th></tr></thead><tbody><tr><td>有效积温</td><td>2,215℃</td><td><span class="status ok">通过</span></td></tr><tr><td>无霜期</td><td>118天</td><td><span class="status ok">通过</span></td></tr><tr><td>早霜风险</td><td>中低</td><td><span class="status warn">降权 3%</span></td></tr></tbody></table>','关闭');
    else if(a==='new-api')openModal('发布模型接口',form([{label:'接口名称',placeholder:'品种推荐服务'},{label:'关联模型',type:'select',options:['大豆品种筛选 v2.6.1','玉米品种筛选 v1.8.0']},{label:'请求方式',type:'select',options:['POST','GET']},{label:'频率限制',value:'60 次/分钟'},{label:'接口路径',value:'/api/v1/model/variety/recommend',full:true}]),'发布接口',function(){toast('接口已发布','已生成 AppKey 授权和在线测试地址')});
    else if(a==='test-api'){btn.disabled=true;btn.textContent='测试中…';setTimeout(function(){btn.disabled=false;btn.textContent='在线测试';toast('调用成功','HTTP 200 · 响应耗时 126ms')},900)}
    else if(a==='rollback')openModal('版本回退确认','<p>将模型运行版本回退到 <b class="yellow">'+btn.dataset.version+'</b>。当前版本会保留在历史列表，可随时恢复。</p>','确认回退',function(){toast('版本已回退','运行版本已切换至 '+btn.dataset.version)});
    else if(a==='view-log')genericDetail(btn.closest('tr'));
    else if(a==='add-variety')openModal('新增品种',form([{label:'品种名称',placeholder:'请输入审定名称'},{label:'作物类型',type:'select',options:['大豆','玉米','水稻']},{label:'熟期/积温',value:'≥ 2,050℃'},{label:'适宜区域',value:'黑龙江第四积温带'},{label:'主要特性',type:'textarea',full:true,placeholder:'抗性、品质、产量潜力等'}]),'保存品种',function(){toast('品种已保存','已加入品种资源库待审核列表')});
    else if(a==='simulate-recommend')openModal('推荐规则模拟',form([{label:'地块',type:'select',options:['北岗1号地','主星2号地','赵光3号地']},{label:'目标作物',type:'select',options:['大豆','玉米','水稻']},{label:'目标产量',value:'210 kg/亩'},{label:'风险偏好',type:'select',options:['稳健','保守','进取']}]),'运行模拟',function(){toast('模拟完成','15 个品种通过硬性约束，已生成综合排序')});
    else if(a==='export')toast('文件已生成',btn.dataset.file||'演示报告已进入下载队列');
    else if(a==='compare')toast('对比方案已更新','已选择 '+($('#selectedCount')?$('#selectedCount').textContent:'0')+' 个候选品种');
    else if(a==='seed-param')openModal('新增处理参数',form([{label:'适用作物',type:'select',options:['大豆','玉米','水稻']},{label:'风险对象',value:'根腐病、地下害虫'},{label:'处理方式',type:'select',options:['复合种衣剂包衣','晒种精选','浸种催芽']},{label:'推荐用量',value:'按种子量 0.3%'},{label:'技术说明',type:'textarea',full:true}]),'保存参数',function(){toast('参数已保存','已同步到种子处理决策规则')});
    else if(a==='generate-seed'){btn.disabled=true;btn.textContent='生成中…';setTimeout(function(){btn.disabled=false;btn.textContent='重新生成方案';var r=$('#seedPlan');if(r)r.style.display='block';toast('种子处理方案已生成','已匹配参数库、药剂库和风险规则')},1200)}
    else if(a==='seed-record')openModal('新增种子处理记录',form([{label:'种子批次',value:'2027-DD-BA-018'},{label:'处理方式',type:'select',options:['复合种衣剂包衣','晒种精选','浸种催芽']},{label:'执行日期',type:'date',value:'2027-05-06'},{label:'执行人员',value:'王建国'},{label:'质量结果',type:'select',options:['合格','需复检']},{label:'实际用量',value:'42kg'}]),'保存记录',function(){toast('处理记录已保存','已形成种子批次追溯档案')});
    else if(a==='nursery-record')openModal('新增苗情记录',form([{label:'育苗批次',value:'YM-2027-006'},{label:'记录日期',type:'date',value:'2027-04-18'},{label:'出苗率',value:'92%'},{label:'平均株高',value:'8.6cm'},{label:'叶龄',value:'2.5叶'},{label:'长势评价',type:'select',options:['良好','一般','偏弱']},{label:'苗情说明',type:'textarea',full:true}]),'保存记录',function(){toast('苗情记录已保存','已触发环境阈值与异常规则检查')});
    else if(a==='ack-alert'){var tr=btn.closest('tr'),st=tr&&$('.status',tr);if(st){st.className='status ok';st.textContent='已确认'}btn.remove();toast('提醒已确认','处置过程将持续跟踪') }
    else if(a==='track-record')openModal('新增过程记录',form([{label:'农事节点',type:'select',options:['播种','出苗检查','苗期管理','炼苗','移栽准备']},{label:'执行日期',type:'date',value:'2027-05-16'},{label:'执行人员',value:'李海峰'},{label:'完成状态',type:'select',options:['已完成','进行中','待复核']},{label:'执行说明',type:'textarea',full:true}]),'保存记录',function(){toast('过程记录已保存','时间线和执行完成度已更新')});
    else if(a==='detail')genericDetail(btn.closest('tr'));
  });
})();
