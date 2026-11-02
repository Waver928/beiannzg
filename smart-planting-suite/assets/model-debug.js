(function(){
  function $(s,p){return (p||document).querySelector(s)}
  function $$(s,p){return Array.prototype.slice.call((p||document).querySelectorAll(s))}
  function metric(label,value,note,klass){return '<div class="metric"><div class="metric-label">'+label+'</div><strong class="'+(klass||'')+'">'+value+'</strong><small>'+note+'</small></div>'}
  function table(head,rows){return '<div style="overflow:auto"><table><thead><tr>'+head.map(function(x){return '<th>'+x+'</th>'}).join('')+'</tr></thead><tbody>'+rows.map(function(row){return '<tr>'+row.map(function(x){return '<td>'+x+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div>'}
  function steps(items){return '<div class="stepper">'+items.map(function(x,i){return '<div class="step '+(i===0?'active':'')+'"><span class="step-num">0'+(i+1)+'</span><b>'+x[0]+'</b><p>'+x[1]+'</p></div>'}).join('')+'</div>'}
  function tags(items){return items.map(function(x){return '<span class="tag">'+x+'</span>'}).join('')}
  var models={
    variety:{
      name:'品种筛选决策子模型',version:'v2.6.1',scope:'大豆、玉米、水稻',owner:'王立新',
      desc:'结合地块条件、寒地环境和历史产量，完成候选品种过滤、评分、排序与推荐报告输出。',
      features:[
        {name:'品种特性因子',desc:'维护粮食品种的熟期、积温、抗性、产量潜力、品质和适宜区域等特性。',fields:[['作物类型','select',['大豆','玉米','水稻'],'大豆'],['品种关键字','text',null,'黑河'],['熟期类型','select',['早熟','中早熟','中熟'],'早熟'],['适宜区域','select',['黑龙江第四积温带','第三至第四积温带','第四至第五积温带'],'黑龙江第四积温带']],result:function(){return table(['品种','熟期','需积温','主要抗性','产量潜力','适宜区域'],[['黑河43','早熟','2,090℃','耐低温、抗倒伏','215kg/亩','第四积温带'],['北豆40','中早熟','2,150℃','稳产、高蛋白','208kg/亩','第三至第四积温带'],['黑科59','早熟','2,080℃','抗灰斑病','212kg/亩','第四积温带']])}},
        {name:'地块适配因子',desc:'读取地块土壤、地力、地形、灌排和历史种植等条件，形成品种适配指标。',fields:[['目标地块','select',['北岗1号地 · 1,286亩','主星2号地 · 936亩','赵光3号地 · 1,105亩'],'北岗1号地 · 1,286亩'],['土壤数据版本','select',['2026年秋季测土','2025年秋季测土'],'2026年秋季测土'],['历史种植年限','select',['近3年','近5年','近10年'],'近5年'],['灌排条件','select',['旱能灌、涝能排','仅排水','雨养农业'],'旱能灌、涝能排']],result:function(){return '<div class="grid-4">'+metric('土壤适配','91.8','黑土层 31cm','yellow')+metric('地力指数','86.5','有机质 4.2%')+metric('灌排能力','A级','排水时效 7.5h')+metric('轮作适宜度','94.0','前茬玉米')+'</div>'}},
        {name:'寒地环境因子',desc:'使用积温、无霜期、降水、极端低温和灾害风险等寒地环境参数。',fields:[['生产年度','select',['2027','2026','2025'],'2027'],['区域','select',['北安市','赵光镇','通北镇'],'北安市'],['气象情景','select',['常年情景','偏冷情景','偏湿情景'],'常年情景'],['数据来源','select',['气象实况＋季节预测','仅历史气象'],'气象实况＋季节预测']],result:function(){return '<div class="grid-4">'+metric('活动积温','2,238℃','预测区间 2,185—2,292℃','yellow')+metric('无霜期','119天','较常年 +2天')+metric('生育期降水','418mm','满足率 87%')+metric('早霜风险','中低','概率 18%')+'</div>'}},
        {name:'历史产量因子',desc:'分析地块或相似区域不同品种的历史产量、稳定性和灾害年份表现。',fields:[['参考品种','select',['黑河43','北豆40','黑科59'],'黑河43'],['参考区域','select',['目标地块＋5km相似区','北安市全域','第四积温带'],'目标地块＋5km相似区'],['统计区间','select',['近5年','近3年','近10年'],'近5年'],['灾害年份','select',['纳入对比','剔除异常年'],'纳入对比']],result:function(){return table(['年度','平均亩产','区域排名','稳定性','主要影响'],[['2022','198.6kg','第3','良好','低温春涝'],['2023','217.2kg','第1','优秀','气象适宜'],['2024','211.8kg','第2','优秀','局地干旱'],['2025','214.6kg','第1','优秀','早霜偏晚'],['2026','209.7kg','第2','良好','结荚期高温']])}},
        {name:'生产约束因子',desc:'结合生产目标和约束配置品种筛选规则，排除不满足熟期、抗性或区域要求的品种。',fields:[['目标地块','select',['北岗1号地','主星2号地','赵光3号地'],'北岗1号地'],['生产目标','select',['稳产抗逆','高产优先','高蛋白品质'],'稳产抗逆'],['风险偏好','select',['稳健','保守','进取'],'稳健'],['硬性约束','select',['熟期＋区域＋抗性','熟期＋区域','仅熟期'],'熟期＋区域＋抗性']],result:function(){return table(['规则','输入值','判定','影响候选'],[['活动积温阈值','≥2,050℃','<span class="status ok">通过</span>','保留 28 个'],['无霜期约束','≥112天','<span class="status ok">通过</span>','保留 23 个'],['区域审定要求','第四积温带','<span class="status ok">通过</span>','保留 18 个'],['倒伏与低温抗性','中等以上','<span class="status warn">过滤</span>','保留 12 个']])}},
        {name:'综合评价因子',desc:'对候选品种进行适宜性、产量潜力、风险和品质评分并形成排序。',fields:[['候选集','select',['推荐规则输出 · 12个','全部启用品种 · 326个'],'推荐规则输出 · 12个'],['权重方案','select',['稳产抗逆型','高产型','品质型'],'稳产抗逆型'],['产量权重','number',null,'30'],['风险权重','number',null,'25']],result:function(){return table(['排名','候选品种','适宜性','产量潜力','抗逆风险','品质','综合分'],[['1','<b>黑河43</b>','96','91','94','89','<b class="yellow">92.6</b>'],['2','北豆40','92','89','90','93','<b class="yellow">89.4</b>'],['3','黑科59','88','94','86','82','<b class="yellow">86.8</b>'],['4','垦豆94','86','87','84','85','<b>85.5</b>']])}},
        {name:'推荐输出因子',desc:'输出推荐品种、适宜地块、主要依据、风险提示和备选方案，支持打印和导出。',fields:[['推荐任务','select',['北岗1号地 · 2027春播','主星2号地 · 2027春播'],'北岗1号地 · 2027春播'],['报告模板','select',['完整决策报告','简版生产建议'],'完整决策报告'],['导出格式','select',['PDF','Word','Excel'],'PDF'],['包含备选方案','select',['是','否'],'是']],result:function(){return '<div class="report-preview"><div><span class="status ok">报告已生成</span><h3>北岗1号地 2027年大豆品种推荐报告</h3><p><b>首选品种：</b>黑河43。综合评分 92.6，预计亩产 214.8kg。</p><p><b>主要依据：</b>熟期与积温匹配度 96%，抗低温与抗倒伏能力适合当前地块。</p><p class="yellow"><b>风险提示：</b>播期低温概率 18%，建议在 5cm 地温稳定通过 8℃后播种。</p><p><b>备选方案：</b>北豆40、黑科59。</p></div><button class="btn primary" data-action="export" data-file="品种推荐报告.pdf">导出报告</button></div>'}}
      ]
    },
    seed:{
      name:'种子处理决策子模型',version:'v1.8.3',scope:'大豆、玉米、水稻',owner:'赵海英',
      desc:'依据种子状态、土壤与播期条件，生成播前处理、药剂包衣、风险提示和标准化作业建议。',
      features:[
        {name:'处理参数因子',desc:'维护不同作物、品种和病虫害风险对应的种子处理方式、药剂和技术参数。',fields:[['作物类型','select',['大豆','玉米','水稻'],'大豆'],['品种','select',['黑河43','北豆40','黑科59'],'黑河43'],['防治对象','select',['根腐病＋地下害虫','灰斑病','低温粉种'],'根腐病＋地下害虫'],['参数状态','select',['已启用','草稿','全部'],'已启用']],result:function(){return table(['处理方式','适用风险','推荐参数','作业窗口','状态'],[['复合种衣剂包衣','根腐病、地下害虫','种子量 0.3%','播前1—2天','<span class="status ok">启用</span>'],['晒种精选','低温播种','晴天 1—2天','播前5—7天','<span class="status ok">启用</span>'],['钼酸铵拌种','缺钼地块','20g/100kg种子','播前1天','<span class="status ok">启用</span>']])}},
        {name:'种子状态因子',desc:'记录种子批次、品种、发芽率、含水率、包衣状态和检测结果。',fields:[['种子批次','text',null,'2027-DD-BA-018'],['品种','select',['黑河43','北豆40','黑科59'],'黑河43'],['发芽率（%）','number',null,'92'],['含水率（%）','number',null,'12.4'],['包衣状态','select',['未包衣','已包衣','需复检'],'未包衣'],['检测结果','select',['合格','需精选','不合格'],'合格']],result:function(){return '<div class="grid-4">'+metric('种子批次','018','档案已建立')+metric('发芽率','92%','高于标准 7%','yellow')+metric('含水率','12.4%','处于安全范围')+metric('综合判定','合格','可进入处理决策')+'</div>'}},
        {name:'播前处理因子',desc:'根据种子状态、土壤条件和播期生成晒种、精选、浸种或催芽等建议。',fields:[['种子批次','select',['2027-DD-BA-018','2027-DD-BA-016'],'2027-DD-BA-018'],['土壤5cm地温','number',null,'7.6'],['计划播期','date',null,'2027-05-08'],['土壤墒情','select',['适宜','偏湿','偏旱'],'适宜']],result:function(){return steps([['晒种精选','晴天摊晒 1—2 天，剔除破损和病斑种子。'],['包衣处理','播前 1—2 天完成复合种衣剂包衣。'],['阴干待播','通风阴凉处阴干，避免阳光暴晒。'],['适温播种','地温稳定通过 8℃ 后开始播种。']])}},
        {name:'药剂包衣因子',desc:'按防治对象推荐药剂或包衣方式、用量范围、配比和安全注意事项。',fields:[['防治对象','select',['根腐病＋地下害虫','灰斑病','丝黑穗病'],'根腐病＋地下害虫'],['种子重量（kg）','number',null,'14000'],['包衣方式','select',['机械包衣','人工拌种'],'机械包衣'],['安全等级','select',['低毒优先','常规方案'],'低毒优先']],result:function(){return table(['推荐药剂','有效成分','参考用量','预计用量','安全事项'],[['复合种衣剂 A','精甲霜灵＋咯菌腈','种子量 0.30%','42.0kg','佩戴防护用品'],['微量元素剂 B','钼＋硼','种子量 0.05%','7.0kg','不得与碱性药剂混用']])}},
        {name:'风险约束因子',desc:'提示低温、药害、发芽率和病害传播等风险及不适用条件。',fields:[['种子批次','select',['2027-DD-BA-018','2027-DD-BA-016'],'2027-DD-BA-018'],['未来3日天气','select',['低温阴雨','晴好升温','大风干燥'],'低温阴雨'],['播种间隔（天）','number',null,'2'],['风险等级阈值','select',['中风险以上提醒','高风险提醒'],'中风险以上提醒']],result:function(){return table(['风险项','等级','触发原因','处置建议'],[['低温粉种','<span class="status warn">中风险</span>','未来48小时最低 2℃','推迟播种 1—2 天'],['药害','<span class="status ok">低风险</span>','用量处于推荐范围','包衣后充分阴干'],['病害传播','<span class="status warn">中风险</span>','批次有 1.8% 病斑粒','精选剔除后再处理']])}},
        {name:'作业规范因子',desc:'输出处理步骤、环境要求、作业时长和质量检查要点。',fields:[['处理方案','select',['复合种衣剂包衣方案','晒种精选方案'],'复合种衣剂包衣方案'],['处理规模（kg）','number',null,'14000'],['作业班组','select',['种子处理一组','种子处理二组'],'种子处理一组'],['设备状态','select',['已校准','待校准'],'已校准']],result:function(){return steps([['设备检查','校准计量泵与滚筒转速，空机运行 3 分钟。'],['药液配制','按 42kg 药剂用量分 4 批配制。'],['均匀包衣','控制包衣均匀率不低于 95%。'],['质量检查','抽检 5 个样本，阴干后分批入库。']])}},
        {name:'处理追溯因子',desc:'记录实际处理方式、药剂用量、作业人员、时间和结果，供后续追溯。',fields:[['种子批次','select',['2027-DD-BA-018','2027-DD-BA-016'],'2027-DD-BA-018'],['处理方式','select',['复合种衣剂包衣','晒种精选','浸种催芽'],'复合种衣剂包衣'],['实际用量（kg）','number',null,'42'],['作业人员','text',null,'王建国'],['处理时间','date',null,'2027-05-06'],['质量结果','select',['合格','需复检'],'合格']],result:function(){return table(['追溯编号','种子批次','处理方式','药剂用量','作业人员','时间','质量结果'],[['CL-2027-018-01','2027-DD-BA-018','复合种衣剂包衣','42kg','王建国','2027-05-06','<span class="status ok">合格</span>']])}}
      ]
    },
    nursery:{
      name:'育苗管理决策子模型',version:'v2.2.0',scope:'水稻、玉米及设施育苗',owner:'陈志强',
      desc:'围绕育苗阶段、环境阈值和苗情变化生成管理措施、异常提醒、农事节点与全程追溯记录。',
      features:[
        {name:'育苗阶段因子',desc:'按作物和播栽计划划分播种、出苗、苗期管理和移栽准备等阶段。',fields:[['作物类型','select',['水稻','玉米'],'水稻'],['播种日期','date',null,'2027-04-08'],['目标移栽期','date',null,'2027-05-20'],['育苗方式','select',['大棚盘育','温室育苗','小拱棚育苗'],'大棚盘育']],result:function(){return steps([['播种期','04-08 至 04-13，完成播种与覆土。'],['出苗期','04-14 至 04-21，重点控制温湿度。'],['苗期管理','04-22 至 05-09，通风、控水和追肥。'],['移栽准备','05-10 至 05-20，炼苗、控水与起秧。']])}},
        {name:'环境阈值因子',desc:'配置各阶段温度、湿度、光照、水分和通风等适宜范围及告警阈值。',fields:[['育苗阶段','select',['出苗期','苗期管理','移栽准备'],'出苗期'],['设施','select',['1号育苗棚','2号育苗棚','3号育苗棚'],'1号育苗棚'],['阈值方案','select',['水稻大棚标准','耐冷强化方案'],'水稻大棚标准'],['告警灵敏度','select',['标准','灵敏','宽松'],'标准']],result:function(){return table(['环境指标','适宜范围','预警阈值','当前值','状态'],[['昼温','25—28℃','>30℃ 或 <20℃','26.4℃','<span class="status ok">正常</span>'],['夜温','15—18℃','<12℃','14.7℃','<span class="status warn">关注</span>'],['空气湿度','65—80%','>85%','86%','<span class="status bad">预警</span>'],['光照','≥18klx','<12klx','20.6klx','<span class="status ok">正常</span>']])}},
        {name:'苗情特征因子',desc:'记录出苗率、株高、叶龄、长势、病害和缺素等苗情指标及图片。',fields:[['育苗批次','select',['YM-2027-006','YM-2027-004'],'YM-2027-006'],['出苗率（%）','number',null,'92'],['平均株高（cm）','number',null,'8.6'],['平均叶龄','number',null,'2.5'],['长势评价','select',['良好','一般','偏弱'],'良好'],['病害/缺素','select',['未发现','立枯病疑似','缺氮','缺铁'],'未发现']],result:function(){return '<div class="grid-4">'+metric('出苗率','92%','较上次 +3%','yellow')+metric('平均株高','8.6cm','符合 7—10cm')+metric('平均叶龄','2.5叶','阶段匹配')+metric('长势评价','良好','未发现病害')+'</div>'}},
        {name:'管理措施因子',desc:'根据育苗阶段、环境和苗情生成浇水、通风、控温、补光和追肥建议。',fields:[['育苗批次','select',['YM-2027-006','YM-2027-004'],'YM-2027-006'],['当前阶段','select',['出苗期','苗期管理','移栽准备'],'出苗期'],['棚内温度（℃）','number',null,'26.4'],['空气湿度（%）','number',null,'86'],['苗情问题','select',['无明显异常','轻度徒长','叶色偏淡'],'无明显异常']],result:function(){return '<div class="cards-list"><div class="resource-card"><h3>通风降湿</h3><p>10:00—11:30 开启顶部通风口 30%，将湿度降至 80% 以下。</p><div class="resource-meta"><span class="status warn">优先执行</span><b>45分钟</b></div></div><div class="resource-card"><h3>控温管理</h3><p>昼温保持 25—27℃，夜间覆盖保温，最低不低于 14℃。</p><div class="resource-meta"><span class="status ok">今日</span><b>持续监测</b></div></div><div class="resource-card"><h3>水分管理</h3><p>基质含水率适宜，今日暂不浇水，明晨复测。</p><div class="resource-meta"><span class="status ok">无需操作</span><b>复测</b></div></div></div>'}},
        {name:'异常风险因子',desc:'对低温、高湿、徒长、缺苗和病害风险生成提醒并给出处置建议。',fields:[['监测范围','select',['全部育苗棚','1号育苗棚','2号育苗棚'],'全部育苗棚'],['数据时间窗','select',['最近24小时','最近12小时','最近3天'],'最近24小时'],['提醒级别','select',['一般及以上','严重及以上'],'一般及以上'],['处置状态','select',['全部','待处置','已处置'],'待处置']],result:function(){return table(['时间','区域','异常类型','级别','持续时长','处置建议'],[['11-02 09:15','1号育苗棚','空气湿度 86%','<span class="status bad">较重</span>','95分钟','立即通风降湿'],['11-02 04:30','2号育苗棚','夜温 11.8℃','<span class="status warn">一般</span>','40分钟','检查保温层'],['11-01 16:20','YM-2027-004','局部缺苗','<span class="status warn">一般</span>','—','查苗补苗']])}},
        {name:'农事节点因子',desc:'结合目标移栽期和天气条件提示炼苗、控水、移栽准备等关键节点。',fields:[['育苗批次','select',['YM-2027-006','YM-2027-004'],'YM-2027-006'],['目标移栽期','date',null,'2027-05-20'],['天气情景','select',['未来10天常规','低温过程','连续阴雨'],'未来10天常规'],['节点提前量','select',['标准','提前2天','延后2天'],'标准']],result:function(){return '<div class="timeline"><div class="timeline-item"><time>05-10</time><b>开始炼苗</b><p>逐日增加通风时长，降低夜间温度。</p></div><div class="timeline-item"><time>05-14</time><b>控水促根</b><p>减少浇水频次，保持基质见干见湿。</p></div><div class="timeline-item"><time>05-18</time><b>移栽前检查</b><p>复核苗龄、根系、病害与缺苗情况。</p></div><div class="timeline-item"><time>05-20</time><b>计划移栽</b><p>预计气温 12—23℃，天气条件适宜。</p></div></div>'}},
        {name:'过程反馈因子',desc:'记录建议执行、实际操作和苗情变化，对育苗过程形成可追溯档案。',fields:[['育苗批次','select',['YM-2027-006','YM-2027-004'],'YM-2027-006'],['跟踪节点','select',['全部节点','播种','出苗检查','苗期管理','炼苗'],'全部节点'],['执行状态','select',['全部','已完成','进行中','待执行'],'全部'],['责任班组','select',['育苗一组','育苗二组'],'育苗一组']],result:function(){return table(['日期','农事节点','模型建议','实际操作','苗情变化','执行状态'],[['04-08','播种','覆土 0.8—1.0cm','覆土 0.9cm','—','<span class="status ok">已完成</span>'],['04-18','出苗检查','出苗率应 ≥85%','实测 92%','长势整齐','<span class="status ok">已完成</span>'],['05-02','苗期管理','通风降湿','开口 30%/45分钟','湿度降至 78%','<span class="status ok">已完成</span>'],['05-10','炼苗','逐日增加通风','尚未开始','待观察','<span class="status run">待执行</span>']])}}
      ]
    }
  };

  var modelKey='variety',featureIndex=0,running=false;
  function fieldHtml(f,i){
    var label=f[0],type=f[1],options=f[2],value=f[3],id='debugField'+i,control='';
    if(type==='select')control='<select id="'+id+'">'+options.map(function(x){return '<option'+(x===value?' selected':'')+'>'+x+'</option>'}).join('')+'</select>';
    else control='<input id="'+id+'" type="'+type+'" value="'+value+'">';
    return '<div class="form-item"><label>'+label+'<span>可编辑</span></label>'+control+'</div>'
  }
  function current(){return models[modelKey]}
  function renderModel(){
    var m=current(),f=m.features[featureIndex];
    document.title=m.name+'在线调试｜寒地粮食作物智慧种植决策模型';
    $('#modelSelector').value=modelKey;$('#debugModelName').textContent=m.name;$('#debugModelDesc').textContent=m.desc;$('#debugModelVersion').textContent=m.version;$('#debugFeatureCount').textContent=m.features.length;
    $('#debugModelTags').innerHTML=tags(['适用范围：'+m.scope,'负责人：'+m.owner,'因子配置完整']);
    $('#featureTabs').innerHTML=m.features.map(function(x,i){return '<button class="debug-tab '+(i===featureIndex?'active':'')+'" data-feature="'+i+'"><i>'+(i+1)+'</i><span>'+x.name+'</span></button>'}).join('');
    $('#featureCoverage').innerHTML=m.features.map(function(x,i){return '<button class="coverage-item '+(i===featureIndex?'active':'')+'" data-feature="'+i+'"><i>'+(i+1)+'</i><div><b>'+x.name+'</b><p>'+x.desc+'</p></div><span>进入调试</span></button>'}).join('');
    renderFeature();
  }
  function renderFeature(){
    var m=current(),f=m.features[featureIndex];
    $('#activeFeatureNo').textContent='模型因子 '+(featureIndex+1)+' / '+m.features.length;$('#featureTitle').textContent=f.name+' · 参数配置';$('#featureDesc').textContent=f.desc;$('#debugForm').innerHTML=f.fields.map(fieldHtml).join('');
    $('#debugResultCard').style.display='none';$('#debugProgress').style.setProperty('--p','0%');$('#debugStage').textContent='等待开始调试';$('#debugRunStatus').className='status';$('#debugRunStatus').textContent='等待执行';
    $$('.debug-pipe').forEach(function(x,i){x.classList.toggle('active',i===0);x.classList.remove('done')});
    $$('.debug-tab').forEach(function(x,i){x.classList.toggle('active',i===featureIndex)});$$('.coverage-item').forEach(function(x,i){x.classList.toggle('active',i===featureIndex)});
  }
  function buildLog(){
    var f=current().features[featureIndex],params={};
    f.fields.forEach(function(x,i){var el=$('#debugField'+i);params[x[0]]=el?el.value:''});
    return JSON.stringify({model:modelKey,version:current().version,factor:f.name,params:params,simulation:true},null,2)
  }
  function runDebug(){
    if(running)return;running=true;var btn=$('#runDebug'),pipes=$$('.debug-pipe'),p=0,stage=0,labels=['正在校验参数完整性','正在调用气象、土壤与业务数据','正在执行规则与模型计算','正在生成标准化输出'];
    btn.disabled=true;btn.textContent='运行中…';$('#debugResultCard').style.display='none';$('#debugRunStatus').className='status run';$('#debugRunStatus').textContent='执行中';
    var timer=setInterval(function(){p=Math.min(100,p+8+Math.floor(Math.random()*11));stage=Math.min(3,Math.floor(p/25));$('#debugProgress').style.setProperty('--p',p+'%');$('#debugStage').textContent=labels[stage]+' · '+p+'%';pipes.forEach(function(x,i){x.classList.toggle('active',i===stage);x.classList.toggle('done',i<stage)});if(p>=100){clearInterval(timer);finishDebug()}},180)
  }
  function finishDebug(){
    var m=current(),f=m.features[featureIndex],runtime=96+Math.floor(Math.random()*210);running=false;$('#runDebug').disabled=false;$('#runDebug').textContent='▶ 重新运行';$('#debugRunStatus').className='status ok';$('#debugRunStatus').textContent='执行成功';$('#debugStage').textContent='调试完成 · 100%';$$('.debug-pipe').forEach(function(x){x.classList.remove('active');x.classList.add('done')});
    $('#resultTitle').textContent=f.name+' · 调试结果';$('#resultMeta').textContent='模型 '+m.version+' · 响应耗时 '+runtime+'ms · '+new Date().toLocaleTimeString('zh-CN',{hour12:false});$('#debugResult').innerHTML=f.result();$('#requestLog').textContent=buildLog();$('#debugResultCard').style.display='block';$('#debugResultCard').scrollIntoView({behavior:'smooth',block:'start'});
  }
  document.addEventListener('click',function(e){var target=e.target.closest('[data-feature]');if(target&&!running){featureIndex=Number(target.dataset.feature)||0;renderFeature()} });
  $('#modelSelector').addEventListener('change',function(){if(running)return;modelKey=models[this.value]?this.value:'variety';featureIndex=0;history.replaceState(null,'','model-debug.html?model='+modelKey);renderModel()});
  $('#runDebug').addEventListener('click',runDebug);
  $('#copyResult').addEventListener('click',function(){var text=$('#requestLog').textContent;navigator.clipboard&&navigator.clipboard.writeText(text);this.textContent='已复制';var btn=this;setTimeout(function(){btn.textContent='复制结果'},1200)});
  var initial=new URLSearchParams(location.search).get('model');modelKey=models[initial]?initial:'variety';renderModel();
})();
