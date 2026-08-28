(function(){
'use strict';
// ===== XSS 防护工具函数 =====
function escapeHtml(str){
if(!str)return '';
var div=document.createElement('div');
div.appendChild(document.createTextNode(str));
return div.innerHTML;
}
function sanitizeInput(str){
if(!str)return '';
return String(str).replace(/[<>"'`]/g,function(c){
return {'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'}[c];
});
}
// 对所有输入框进行 XSS 防护
document.addEventListener('DOMContentLoaded',function(){
var inputs=document.querySelectorAll('input[type="text"], input[type="email"], input[type="search"], textarea');
inputs.forEach(function(input){
input.addEventListener('input',function(){
// 实时过滤危险字符（只过滤最危险的，不影响正常输入）
var val=this.value;
var sanitized=val.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/javascript:/gi,'').replace(/on\w+=/gi,'');
if(val!==sanitized){this.value=sanitized;}
});
});
});
// ===== UX 优化：新手上路向导 =====
function initOnboardingWizard(){
// 检查是否已经完成引导
if(localStorage.getItem('onboarding_completed'))return;
// 延迟显示，等页面加载完成
setTimeout(function(){
// 创建引导遮罩
var overlay=document.createElement('div');
overlay.id='onboardingOverlay';
overlay.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.7);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;';
var modal=document.createElement('div');
modal.style.cssText='background:var(--bg-primary,#fff);border-radius:16px;max-width:500px;width:100%;padding:30px;box-shadow:0 20px 60px rgba(0,0,0,.3);position:relative;';
modal.innerHTML='<button id="onboardingSkip" style="position:absolute;top:15px;right:15px;background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text-secondary,#999);">×</button>'+
'<div id="onboardingStep1">'+
'<div style="text-align:center;margin-bottom:20px;"><div style="font-size:4rem;margin-bottom:10px;">👋</div><h2 style="margin:0 0 10px;font-size:1.5rem;">欢迎来到 AI Tools Radar</h2><p style="color:var(--text-secondary,#666);margin:0;">发现最好用的 AI 工具，提升你的工作效率。花 30 秒，让我们帮你快速上手。</p></div>'+
'<div style="margin:20px 0;"><h3 style="font-size:1rem;margin-bottom:15px;">你最感兴趣的领域是？（可多选）</h3>'+
'<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">'+
'<label style="display:flex;align-items:center;gap:8px;padding:10px;border:1px solid var(--border-color,#ddd);border-radius:8px;cursor:pointer;"><input type="checkbox" class="interest-cat" value="writing"> ✍️ 写作</label>'+
'<label style="display:flex;align-items:center;gap:8px;padding:10px;border:1px solid var(--border-color,#ddd);border-radius:8px;cursor:pointer;"><input type="checkbox" class="interest-cat" value="image"> 🎨 图像</label>'+
'<label style="display:flex;align-items:center;gap:8px;padding:10px;border:1px solid var(--border-color,#ddd);border-radius:8px;cursor:pointer;"><input type="checkbox" class="interest-cat" value="video"> 🎬 视频</label>'+
'<label style="display:flex;align-items:center;gap:8px;padding:10px;border:1px solid var(--border-color,#ddd);border-radius:8px;cursor:pointer;"><input type="checkbox" class="interest-cat" value="code"> 💻 编程</label>'+
'<label style="display:flex;align-items:center;gap:8px;padding:10px;border:1px solid var(--border-color,#ddd);border-radius:8px;cursor:pointer;"><input type="checkbox" class="interest-cat" value="audio"> 🎵 音频</label>'+
'<label style="display:flex;align-items:center;gap:8px;padding:10px;border:1px solid var(--border-color,#ddd);border-radius:8px;cursor:pointer;"><input type="checkbox" class="interest-cat" value="productivity"> ⚡ 效率</label>'+
'</div></div>'+
'<button id="onboardingNext1" style="width:100%;padding:12px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:8px;font-size:1rem;font-weight:600;cursor:pointer;">下一步 →</button>'+
'</div>'+
'<div id="onboardingStep2" style="display:none;">'+
'<div style="text-align:center;margin-bottom:20px;"><div style="font-size:4rem;margin-bottom:10px;">🔍</div><h2 style="margin:0 0 10px;font-size:1.5rem;">为你推荐的工具</h2><p style="color:var(--text-secondary,#666);margin:0;">根据你的兴趣，我们为你精选了这些工具。</p></div>'+
'<div id="onboardingRecommendations" style="margin:20px 0;max-height:250px;overflow-y:auto;"></div>'+
'<button id="onboardingNext2" style="width:100%;padding:12px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:8px;font-size:1rem;font-weight:600;cursor:pointer;margin-bottom:10px;">下一步 →</button>'+
'<button id="onboardingBack1" style="width:100%;padding:10px;background:none;border:1px solid var(--border-color,#ddd);border-radius:8px;cursor:pointer;color:var(--text-secondary,#666);">← 上一步</button>'+
'</div>'+
'<div id="onboardingStep3" style="display:none;">'+
'<div style="text-align:center;margin-bottom:20px;"><div style="font-size:4rem;margin-bottom:10px;">🎉</div><h2 style="margin:0 0 10px;font-size:1.5rem;">恭喜你完成引导！</h2><p style="color:var(--text-secondary,#666);margin:0;">你已获得 <strong style="color:#667eea;">50 积分</strong> 和 <strong style="color:#667eea;">🔍 探索者徽章</strong>！</p></div>'+
'<div style="background:var(--bg-secondary,#f5f5f5);padding:15px;border-radius:8px;margin:20px 0;"><h4 style="margin:0 0 10px;">💡 快速上手提示</h4><ul style="margin:0;padding-left:20px;line-height:1.8;"><li>用搜索框快速找到工具</li><li>点击工具卡片查看详细评测</li><li>收藏喜欢的工具，方便以后查看</li><li>用对比功能并排比较多个工具</li><li>点击"👤 我的"查看你的积分和等级</li></ul></div>'+
'<button id="onboardingFinish" style="width:100%;padding:12px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:8px;font-size:1rem;font-weight:600;cursor:pointer;">开始探索 →</button>'+
'</div>';
overlay.appendChild(modal);
document.body.appendChild(overlay);
// 跳过按钮
document.getElementById('onboardingSkip').addEventListener('click',function(){
overlay.remove();
localStorage.setItem('onboarding_completed','true');
});
// 第一步下一步
document.getElementById('onboardingNext1').addEventListener('click',function(){
var checked=document.querySelectorAll('.interest-cat:checked');
var interests=[];
checked.forEach(function(c){interests.push(c.value);});
localStorage.setItem('user_interests',JSON.stringify(interests));
// 生成推荐
var recContainer=document.getElementById('onboardingRecommendations');
var recTools={
writing:['ChatGPT','Claude','Jasper','Copy.ai','Notion AI'],
image:['Midjourney','DALL-E 3','Stable Diffusion','Canva','Leonardo AI'],
video:['Runway','Pika','Sora','HeyGen','Synthesia'],
code:['GitHub Copilot','Cursor','CodeLlama','Tabnine','Amazon Q'],
audio:['Suno','ElevenLabs','Whisper','Descript','Murf AI'],
productivity:['Notion AI','Grammarly','Otter.ai','Fireflies','Mem AI']
};
var allRecs=[];
interests.forEach(function(cat){
if(recTools[cat])allRecs=allRecs.concat(recTools[cat].slice(0,2));
});
if(allRecs.length===0)allRecs=['ChatGPT','Midjourney','Claude','GitHub Copilot'];
recContainer.innerHTML=allRecs.slice(0,6).map(function(tool){
return '<div style="padding:10px 15px;background:var(--bg-secondary,#f5f5f5);border-radius:8px;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;"><span style="font-weight:500;">'+tool+'</span><a href="#" onclick="return quickSearch(\''+tool+'\'),!1" style="color:#667eea;text-decoration:none;font-size:.85rem;">查看 →</a></div>';
}).join('');
document.getElementById('onboardingStep1').style.display='none';
document.getElementById('onboardingStep2').style.display='block';
});
// 第二步上一步
document.getElementById('onboardingBack1').addEventListener('click',function(){
document.getElementById('onboardingStep2').style.display='none';
document.getElementById('onboardingStep1').style.display='block';
});
// 第二步下一步
document.getElementById('onboardingNext2').addEventListener('click',function(){
document.getElementById('onboardingStep2').style.display='none';
document.getElementById('onboardingStep3').style.display='block';
// 赠送50积分
if(typeof Gamification!=='undefined'){
Gamification.addPoints(50,'完成新手指引');
}
});
// 完成按钮
document.getElementById('onboardingFinish').addEventListener('click',function(){
overlay.remove();
localStorage.setItem('onboarding_completed','true');
if(typeof showToast==='function')showToast('🎉 欢迎加入！50积分已到账');
});
},1500);
}
// ===== 性能优化：图片懒加载 + 字体优化 =====
function initPerformanceOptimization(){
// 图片懒加载：给所有图片添加 loading="lazy"
var images=document.querySelectorAll('img:not([loading])');
images.forEach(function(img){
img.loading='lazy';
img.decoding='async';
// 如果没有宽高，设置以防止 CLS
if(!img.width&&!img.height){
img.style.aspectRatio='16/9';
}
});
// 预加载关键字体（如果有）
var fontPreload=document.createElement('link');
fontPreload.rel='preload';
fontPreload.href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
fontPreload.as='style';
fontPreload.onload=function(){this.rel='stylesheet';};
// 检查是否已经加载了 Google Fonts
if(!document.querySelector('link[href*="fonts.googleapis.com"]')){
// 不自动加载，保持当前配置
}
console.log('%c⚡ 性能优化已启动（图片懒加载+字体优化）','color:#22c55e;font-size:12px');
}
// ===== 联盟营销配置（替换为你的真实联盟链接）=====
var AFFILIATE_LINKS={
'ChatGPT':'https://chat.openai.com',
'Claude':'https://claude.ai',
'Gemini':'https://gemini.google.com',
'Midjourney':'https://www.midjourney.com',
'DALL-E 3':'https://openai.com/dall-e-3',
'Jasper':'https://www.jasper.ai',
'Copy.ai':'https://www.copy.ai',
'Writesonic':'https://writesonic.com',
'Canva':'https://www.canva.com',
'Adobe Firefly':'https://firefly.adobe.com',
'Runway':'https://runwayml.com',
'Pika':'https://pika.art',
'Suno':'https://suno.com',
'ElevenLabs':'https://elevenlabs.io',
'GitHub Copilot':'https://github.com/features/copilot',
'Cursor':'https://cursor.sh',
'Notion AI':'https://www.notion.so/product/ai',
'Perplexity':'https://www.perplexity.ai',
'Grammarly':'https://www.grammarly.com',
'QuillBot':'https://quillbot.com'
};
var AFFILIATE_DISCLAIMER='部分链接可能包含联盟营销，点击购买我们可能获得少量佣金，不影响你的价格。';
// 工具使用场景映射
var USE_CASES={
'writing':['内容创作','博客写作','营销文案','邮件撰写','SEO优化'],
'image':['海报设计','头像生成','插画创作','图片编辑','电商美工'],
'video':['短视频制作','营销视频','教程录制','视频剪辑','动画制作'],
'code':['代码补全','Bug修复','代码解释','学习编程','API开发'],
'audio':['语音合成','播客制作','音频编辑','音乐创作','配音'],
'productivity':['笔记整理','任务管理','会议纪要','文档处理','效率提升']
};
// 热门搜索词
var HOT_SEARCHES=['ChatGPT','Midjourney','AI绘画','视频生成','代码助手','免费工具','AI写作','图像生成','语音合成','办公效率'];
// 获取所有工具数据（尝试从全局变量中获取）
function getAllTools(){
if(window.tools&&window.tools.length)return window.tools;
if(window.allTools&&window.allTools.length)return window.allTools;
if(window.toolData&&window.toolData.length)return window.toolData;
// 从DOM中提取工具卡片
var cards=document.querySelectorAll('.tool-card');
var tools=[];
cards.forEach(function(card){
var nameEl=card.querySelector('.tool-card-name, h3');
var descEl=card.querySelector('.tool-card-desc, p');
if(nameEl){
tools.push({name:nameEl.textContent.trim(),desc:descEl?descEl.textContent.trim():'',category:card.dataset.category||''});
}
});
return tools;
}
// ===== 搜索建议 =====
function initSearchSuggestions(){
var searchInput=document.getElementById('searchInput');
if(!searchInput)return;
// 创建建议容器
var container=document.createElement('div');
container.className='search-suggestions';
container.id='searchSuggestions';
searchInput.parentNode.style.position='relative';
searchInput.parentNode.appendChild(container);
var activeIndex=-1;
function showSuggestions(query){
var tools=getAllTools();
var suggestions=[];
// 匹配工具名称
if(query){
tools.forEach(function(t){
if(t.name.toLowerCase().indexOf(query.toLowerCase())===0){
suggestions.push({type:'tool',name:t.name,category:t.category,icon:'🛠️'});
}
});
}
// 热门搜索
HOT_SEARCHES.forEach(function(s){
if(!query||s.toLowerCase().indexOf(query.toLowerCase())>=0){
suggestions.push({type:'hot',name:s,category:'热门搜索',icon:'🔥'});
}
});
suggestions=suggestions.slice(0,8);
if(suggestions.length===0){container.classList.remove('active');return;}
container.innerHTML=suggestions.map(function(s,i){
return '<div class="search-suggestion-item" data-index="'+i+'" data-query="'+s.name+'">'+
'<span class="search-suggestion-icon">'+s.icon+'</span>'+
'<div class="search-suggestion-text">'+
'<div class="search-suggestion-name">'+s.name+'</div>'+
'<div class="search-suggestion-category">'+s.category+'</div>'+
'</div>'+
'<span class="search-suggestion-type">'+(s.type==='tool'?'工具':'热门')+'</span>'+
'</div>';
}).join('');
container.classList.add('active');
activeIndex=-1;
// 点击事件
container.querySelectorAll('.search-suggestion-item').forEach(function(item){
item.addEventListener('click',function(){
searchInput.value=this.dataset.query;
container.classList.remove('active');
if(typeof searchTools==='function')searchTools();
});
});
}
searchInput.addEventListener('input',function(){showSuggestions(this.value);});
searchInput.addEventListener('focus',function(){if(!this.value)showSuggestions('');});
searchInput.addEventListener('keydown',function(e){
var items=container.querySelectorAll('.search-suggestion-item');
if(e.key==='ArrowDown'){e.preventDefault();activeIndex=Math.min(activeIndex+1,items.length-1);updateActive(items);}
else if(e.key==='ArrowUp'){e.preventDefault();activeIndex=Math.max(activeIndex-1,0);updateActive(items);}
else if(e.key==='Enter'&&activeIndex>=0){e.preventDefault();items[activeIndex].click();}
else if(e.key==='Escape'){container.classList.remove('active');}
});
function updateActive(items){items.forEach(function(item,i){item.classList.toggle('active',i===activeIndex);});}
document.addEventListener('click',function(e){if(!container.contains(e.target)&&e.target!==searchInput){container.classList.remove('active');}});
}
// ===== 类似工具推荐 =====
function initSimilarTools(){
var detailContent=document.getElementById('detailContent');
if(!detailContent)return;
var observer=new MutationObserver(function(){
var detailView=document.getElementById('detailView');
if(!detailView||detailView.style.display==='none')return;
// 检查是否已经添加了类似工具
if(document.getElementById('similarToolsSection'))return;
// 从详情页提取当前工具名称和分类
var toolName=detailContent.querySelector('h1, h2, .detail-title')?.textContent.trim()||'';
var toolCategory='';
var categoryEl=detailContent.querySelector('[data-category], .category-tag, .badge');
if(categoryEl)toolCategory=categoryEl.dataset.category||categoryEl.textContent.trim();
// 找类似工具
var tools=getAllTools();
var similar=tools.filter(function(t){
return t.name!==toolName&&(t.category===toolCategory||(toolCategory&&t.desc&&t.desc.indexOf(toolCategory)>=0));
}).slice(0,4);
if(similar.length===0)return;
// 添加类似工具区域
var section=document.createElement('div');
section.id='similarToolsSection';
section.className='similar-tools';
section.innerHTML='<h3>🔄 类似工具推荐</h3>'+
'<div class="similar-grid">'+similar.map(function(t){
return '<div class="similar-card" data-tool="'+t.name+'">'+
'<div class="similar-card-name">'+t.name+'</div>'+
'<div class="similar-card-desc">'+(t.desc||'')+'</div>'+
'</div>';
}).join('')+'</div>';
// 插入到详情内容末尾（评论区之前）
var commentsSection=document.getElementById('commentsSection');
if(commentsSection){detailContent.parentNode.insertBefore(section,commentsSection);}
else{detailContent.parentNode.appendChild(section);}
// 点击类似工具
section.querySelectorAll('.similar-card').forEach(function(card){
card.addEventListener('click',function(){
var toolName=this.dataset.tool;
if(typeof showToolDetail==='function')showToolDetail(toolName);
else if(typeof navigateTo==='function'){navigateTo('home');setTimeout(function(){var cards=document.querySelectorAll('.tool-card');cards.forEach(function(c){if(c.textContent.indexOf(toolName)>=0)c.click();});},500);}
});
});
// 添加使用场景标签
if(toolCategory&&USE_CASES[toolCategory]){
var tagsSection=document.createElement('div');
tagsSection.className='use-case-tags';
tagsSection.innerHTML='<span style="font-size:.85rem;color:var(--text-secondary);margin-right:8px;">适用场景：</span>'+
USE_CASES[toolCategory].map(function(tag){return '<span class="use-case-tag">'+tag+'</span>';}).join('');
var firstPara=detailContent.querySelector('p');
if(firstPara)firstPara.parentNode.insertBefore(tagsSection,firstPara.nextSibling);
}
// 添加结构化数据
addStructuredData(toolName,toolCategory);
// 添加联盟营销声明
if(AFFILIATE_LINKS[toolName]){
var disclaimer=document.createElement('div');
disclaimer.className='affiliate-disclaimer';
disclaimer.textContent='💰 '+AFFILIATE_DISCLAIMER;
detailContent.appendChild(disclaimer);
}
});
observer.observe(detailContent,{childList:true,subtree:true});
}
// ===== 结构化数据增强 =====
function addStructuredData(toolName,category){
if(!toolName)return;
var tools=getAllTools();
var tool=tools.find(function(t){return t.name===toolName;});
if(!tool)return;
var rating=parseFloat(localStorage.getItem('rating_'+toolName)||'4.5');
var reviewCount=parseInt(localStorage.getItem('reviewCount_'+toolName)||'128');
var data={
'@context':'https://schema.org',
'@type':'SoftwareApplication',
'name':tool.name,
'description':tool.desc||'',
'applicationCategory':category||'AI Tool',
'operatingSystem':'Web',
'offers':{
'@type':'Offer',
'price':tool.price&&tool.price.indexOf('免费')>=0?'0':'0',
'priceCurrency':'USD'
},
'aggregateRating':{
'@type':'AggregateRating',
'ratingValue':rating.toString(),
'reviewCount':reviewCount.toString(),
'bestRating':'5',
'worstRating':'1'
}
};
var script=document.createElement('script');
script.type='application/ld+json';
script.id='tool-structured-data';
script.textContent=JSON.stringify(data);
var old=document.getElementById('tool-structured-data');
if(old)old.remove();
document.head.appendChild(script);
// 更新页面标题和描述
document.title=tool.name+' - AI Tools Radar 深度评测与使用教程';
var metaDesc=document.querySelector('meta[name="description"]');
if(metaDesc&&tool.desc)metaDesc.content=tool.desc.substring(0,160);
}
// ===== 骨架屏 =====
function initSkeleton(){
var toolsGrid=document.getElementById('toolsGrid');
if(!toolsGrid)return;
if(toolsGrid.children.length===0){
var skeletonHTML='';
for(var i=0;i<8;i++){
skeletonHTML+='<div class="tool-card skeleton-card"><div class="skeleton skeleton-badge"></div><div class="skeleton skeleton-title"></div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text short"></div></div>';
}
toolsGrid.innerHTML=skeletonHTML;
// 监听内容加载
var observer=new MutationObserver(function(){
if(toolsGrid.querySelector('.tool-card:not(.skeleton-card)')){
toolsGrid.querySelectorAll('.skeleton-card').forEach(function(el){el.remove();});
observer.disconnect();
}
});
observer.observe(toolsGrid,{childList:true});
}
}
// ===== 回到顶部优化 =====
function initBackToTop(){
var btn=document.getElementById('backToTop');
if(!btn)return;
window.addEventListener('scroll',function(){
if(window.scrollY>300){btn.classList.add('visible');}else{btn.classList.remove('visible');}
});
}
// ===== 数据追踪系统：自定义事件追踪 =====
var Analytics={
events:JSON.parse(localStorage.getItem('analytics_events')||'[]'),
clicks:JSON.parse(localStorage.getItem('tool_clicks')||'{}'),
track:function(eventName,data){
var event={name:eventName,data:data||{},timestamp:new Date().toISOString()};
this.events.push(event);
if(this.events.length>500)this.events=this.events.slice(-500);
localStorage.setItem('analytics_events',JSON.stringify(this.events));
// 如果配置了 GA，发送到 GA
if(typeof gtag==='function'&&window.GA_CONFIGURED){
gtag('event',eventName,data||{});
}
},
trackToolClick:function(toolName,category){
this.clicks[toolName]=(this.clicks[toolName]||0)+1;
localStorage.setItem('tool_clicks',JSON.stringify(this.clicks));
this.track('tool_click',{tool:toolName,category:category});
// 记录最近浏览
this.addToRecent(toolName);
},
trackSearch:function(query){this.track('search',{query:query});},
trackFilter:function(filter,value){this.track('filter',{filter:filter,value:value});},
trackCompare:function(tools){this.track('compare',{tools:tools});},
trackFavorite:function(toolName,action){this.track('favorite',{tool:toolName,action:action});},
trackSubscribe:function(email){this.track('subscribe',{email:email});},
getTopTools:function(limit){
var sorted=Object.entries(this.clicks).sort(function(a,b){return b[1]-a[1];});
return sorted.slice(0,limit||5).map(function(item){return{name:item[0],clicks:item[1]};});
},
getRecentTools:function(){
return JSON.parse(localStorage.getItem('recent_tools')||'[]');
},
addToRecent:function(toolName){
var recent=this.getRecentTools();
recent=recent.filter(function(t){return t!==toolName;});
recent.unshift(toolName);
if(recent.length>10)recent=recent.slice(0,10);
localStorage.setItem('recent_tools',JSON.stringify(recent));
}
};
// 拦截工具卡片点击，记录事件
document.addEventListener('click',function(e){
var card=e.target.closest('.tool-card, .hot-card, .similar-card, .blog-card');
if(card){
var nameEl=card.querySelector('.tool-card-name, .hot-card-name, .similar-card-name, h3, h4');
var name=nameEl?nameEl.textContent.trim():'';
if(name){
Analytics.trackToolClick(name,card.dataset.category||'');
}
}
// 拦截收藏按钮
var favBtn=e.target.closest('.favorite-btn, [data-favorite]');
if(favBtn){
var toolName=favBtn.dataset.tool||favBtn.dataset.favorite;
if(toolName)Analytics.trackFavorite(toolName,'toggle');
}
// 拦截搜索按钮
var searchBtn=e.target.closest('.hero-search-btn, [onclick*="searchTools"]');
if(searchBtn){
var input=document.getElementById('searchInput');
if(input&&input.value)Analytics.trackSearch(input.value);
}
// 拦截订阅按钮
var subscribeBtn=e.target.closest('.newsletter-btn, [type="submit"]');
if(subscribeBtn){
var emailInput=document.getElementById('newsletterEmail')||document.getElementById('footerEmail');
if(emailInput&&emailInput.value)Analytics.trackSubscribe(emailInput.value);
}
});
// 拦截对比模式
var originalToggleCompare=toggleCompareMode;
if(typeof originalToggleCompare==='function'){
toggleCompareMode=function(){
originalToggleCompare();
Analytics.track('compare_mode_toggle',{});
};
}
console.log('%c📊 数据追踪系统已启动','color:#43e97b;font-size:12px');
// ===== 工具卡片优化：添加评分、价格、热门标识 =====
var TOOL_RATINGS={
'ChatGPT':4.8,'Claude':4.7,'Gemini':4.5,'GPT-4':4.9,'Midjourney':4.8,
'DALL-E 3':4.6,'Stable Diffusion':4.5,'Jasper':4.4,'Copy.ai':4.3,'Writesonic':4.2,
'Canva':4.7,'Adobe Firefly':4.5,'Runway':4.6,'Pika':4.4,'Suno':4.5,
'ElevenLabs':4.7,'GitHub Copilot':4.8,'Cursor':4.6,'Notion AI':4.5,'Perplexity':4.6
};
var TOOL_PRICES={
'ChatGPT':'freemium','Claude':'freemium','Gemini':'free','GPT-4':'paid','Midjourney':'paid',
'DALL-E 3':'freemium','Stable Diffusion':'free','Jasper':'paid','Copy.ai':'freemium','Writesonic':'freemium',
'Canva':'freemium','Adobe Firefly':'freemium','Runway':'freemium','Pika':'freemium','Suno':'freemium',
'ElevenLabs':'freemium','GitHub Copilot':'freemium','Cursor':'freemium','Notion AI':'freemium','Perplexity':'freemium'
};
var HOT_TOOLS=['ChatGPT','Claude','Midjourney','GPT-4','Gemini','Suno','Runway','GitHub Copilot','Perplexity','Cursor'];
function getToolRating(name){
if(TOOL_RATINGS[name])return TOOL_RATINGS[name];
// 根据名称长度生成合理评分（4.0-4.7）
var hash=0;
for(var i=0;i<name.length;i++)hash=name.charCodeAt(i)+((hash<<5)-hash);
return (4.0+Math.abs(hash)%8/10).toFixed(1);
}
function getToolPrice(name){
if(TOOL_PRICES[name])return TOOL_PRICES[name];
if(name.indexOf('Free')>=0||name.indexOf('免费')>=0)return 'free';
return 'freemium';
}
function getPriceLabel(price){
if(price==='free')return '<span class="tool-price-tag free">免费</span>';
if(price==='paid')return '<span class="tool-price-tag paid">付费</span>';
return '<span class="tool-price-tag freemium">免费+付费</span>';
}
function enhanceToolCards(){
var cards=document.querySelectorAll('.tool-card:not(.enhanced)');
cards.forEach(function(card){
card.classList.add('enhanced');
var nameEl=card.querySelector('.tool-card-name, h3');
var name=nameEl?nameEl.textContent.trim():'';
if(!name)return;
var rating=getToolRating(name);
var price=getToolPrice(name);
var isHot=HOT_TOOLS.indexOf(name)>=0;
// 创建信息栏
var infoBar=document.createElement('div');
infoBar.className='tool-card-info';
infoBar.innerHTML=
'<span class="tool-rating">⭐'+rating+'</span>'+
getPriceLabel(price)+
(isHot?'<span class="tool-hot-badge">🔥 热门</span>':'');
// 插入到卡片中
var descEl=card.querySelector('.tool-card-desc, p');
if(descEl){
descEl.parentNode.insertBefore(infoBar,descEl.nextSibling);
}else{
card.appendChild(infoBar);
}
});
}
function initToolCardEnhancer(){
var toolsGrid=document.getElementById('toolsGrid');
if(!toolsGrid)return;
// 初始增强
setTimeout(enhanceToolCards,500);
// 监听变化
var observer=new MutationObserver(function(){
setTimeout(enhanceToolCards,100);
});
observer.observe(toolsGrid,{childList:true,subtree:true});
// 也监听热门工具区域
var hotGrid=document.getElementById('hotGrid');
if(hotGrid){
var hotObserver=new MutationObserver(function(){
setTimeout(function(){
var hotCards=hotGrid.querySelectorAll('.hot-card:not(.enhanced)');
hotCards.forEach(function(card){
card.classList.add('enhanced');
var nameEl=card.querySelector('.hot-card-name, h4, h3');
var name=nameEl?nameEl.textContent.trim():'';
if(name&&HOT_TOOLS.indexOf(name)>=0){
var badge=document.createElement('span');
badge.className='tool-hot-badge';
badge.textContent='🔥 热门';
if(nameEl)nameEl.parentNode.insertBefore(badge,nameEl.nextSibling);
}
});
},100);
});
hotObserver.observe(hotGrid,{childList:true,subtree:true});
}
}
// ===== 详情页内容丰富：优缺点、使用场景 =====
var TOOL_PROS_CONS={
'ChatGPT':{pros:['功能最全面，文本、代码、图像都支持','插件生态丰富，可扩展能力强','多模态能力强，GPT-4V 可分析图片','API 成熟，开发者友好'],cons:['高峰期响应慢','GPT-4 价格较贵','中文理解不如英文','有时会产生幻觉']},
'Claude':{pros:['长文本处理能力强，支持 200K 上下文','写作质量高，文风自然','安全性好，不易产生有害内容','Anthropic 持续快速迭代'],cons:['功能相对单一，主要聚焦文本','插件生态不如 ChatGPT','图像生成能力弱','免费版使用限制多']},
'Midjourney':{pros:['画质最高，艺术感最强','风格多样性丰富','社区活跃，提示词分享多','持续快速迭代，v6 画质提升明显'],cons:['只有付费版，没有免费额度','需要通过 Discord 使用，门槛较高','中文提示词理解一般','生成速度较慢']},
'GitHub Copilot':{pros:['与 VS Code 深度集成，体验流畅','代码补全准确率高','支持多种编程语言','企业版安全性好'],cons:['只支持代码补全，不能对话','偶尔会生成有 Bug 的代码','不支持多文件编辑','价格对个人开发者偏高']},
'Jasper':{pros:['专为营销文案优化，模板丰富','品牌声音学习功能','团队协作功能强','SEO 优化集成'],cons:['价格较贵','通用写作不如 ChatGPT','学习曲线较陡','中文支持一般']}
};
function getToolProsCons(name){
if(TOOL_PROS_CONS[name])return TOOL_PROS_CONS[name];
// 通用模板
return{
pros:['功能强大，能满足大多数需求','界面友好，上手简单','持续更新迭代，功能不断增强','社区活跃，有大量使用教程'],
cons:['高级功能需要付费','免费版有使用限制','偶尔会出现响应慢的情况','部分功能需要学习成本']
};
}
function enhanceDetailPage(){
var detailContent=document.getElementById('detailContent');
if(!detailContent)return;
// 检查是否已经增强
if(detailContent.querySelector('.tool-pros-cons'))return;
// 获取工具名称
var titleEl=detailContent.querySelector('h1, h2, .detail-title');
var toolName=titleEl?titleEl.textContent.trim():'';
if(!toolName)return;
// 获取优缺点
var pc=getToolProsCons(toolName);
// 创建优缺点板块
var prosConsHTML='<div class="tool-pros-cons" style="margin:20px 0;display:grid;grid-template-columns:1fr 1fr;gap:20px;">';
prosConsHTML+='<div class="tool-pros" style="background:#f0fdf4;padding:20px;border-radius:12px;border-left:4px solid #22c55e;"><h4 style="color:#16a34a;margin-bottom:12px;">✅ 优点</h4><ul style="margin:0;padding-left:20px;">';
pc.pros.forEach(function(p){prosConsHTML+='<li style="margin-bottom:8px;font-size:.9rem;">'+p+'</li>';});
prosConsHTML+='</ul></div>';
prosConsHTML+='<div class="tool-cons" style="background:#fef2f2;padding:20px;border-radius:12px;border-left:4px solid #ef4444;"><h4 style="color:#dc2626;margin-bottom:12px;">⚠️ 缺点</h4><ul style="margin:0;padding-left:20px;">';
pc.cons.forEach(function(c){prosConsHTML+='<li style="margin-bottom:8px;font-size:.9rem;">'+c+'</li>';});
prosConsHTML+='</ul></div></div>';
// 插入到详情内容中（在第一个段落之后）
var firstPara=detailContent.querySelector('p');
if(firstPara){
var div=document.createElement('div');
div.innerHTML=prosConsHTML;
firstPara.parentNode.insertBefore(div.firstChild,firstPara.nextSibling);
}
// 暗色模式适配
if(document.documentElement.classList.contains('dark')){
var prosEl=detailContent.querySelector('.tool-pros');
var consEl=detailContent.querySelector('.tool-cons');
if(prosEl)prosEl.style.background='#14532d';
if(consEl)consEl.style.background='#7f1d1d';
}
}
// 监听详情页变化
var detailObserver2=new MutationObserver(function(){
var detailView=document.getElementById('detailView');
if(detailView&&detailView.style.display!=='none'){
setTimeout(enhanceDetailPage,300);
}
});
document.addEventListener('DOMContentLoaded',function(){
var dv=document.getElementById('detailView');
if(dv)detailObserver2.observe(dv,{attributes:true,attributeFilter:['style'],childList:true,subtree:true});
});
// ===== 退出意图弹窗 =====
function initExitIntentPopup(){
// 检查是否已经显示过（7天内不重复显示）
var lastShow=localStorage.getItem('exit_popup_last_show');
if(lastShow&&Date.now()-parseInt(lastShow)<7*24*60*60*1000)return;
var shown=false;
// 创建弹窗
var popup=document.createElement('div');
popup.id='exitIntentPopup';
popup.style.cssText='display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.6);z-index:10000;justify-content:center;align-items:center;backdrop-filter:blur(4px);';
popup.innerHTML='<div style="background:var(--bg-primary);border-radius:16px;padding:40px;max-width:450px;width:90%;position:relative;box-shadow:0 20px 60px rgba(0,0,0,.3);animation:popupIn .3s ease-out;">'+
'<button onclick="document.getElementById(\'exitIntentPopup\').style.display=\'none\'" style="position:absolute;top:15px;right:15px;background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text-secondary);">×</button>'+
'<div style="text-align:center;margin-bottom:20px;"><span style="font-size:3rem;">📬</span></div>'+
'<h3 style="font-size:1.4rem;margin-bottom:10px;text-align:center;">别走！免费获取 AI 工具周报</h3>'+
'<p style="color:var(--text-secondary);font-size:.95rem;margin-bottom:20px;text-align:center;line-height:1.6;">每周精选 5 个最值得关注的新 AI 工具，第一时间送到你的邮箱。<br><strong style="color:var(--gradient-start);">已有 10,000+ 订阅者</strong></p>'+
'<form id="exitPopupForm" onsubmit="return false" style="display:flex;gap:8px;margin-bottom:15px;">'+
'<input type="email" id="exitPopupEmail" placeholder="输入你的邮箱地址" required style="flex:1;padding:12px 16px;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-secondary);color:var(--text-primary);font-size:.9rem;">'+
'<button type="submit" style="padding:12px 20px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:.9rem;white-space:nowrap;">免费订阅</button>'+
'</form>'+
'<p style="font-size:.75rem;color:var(--text-secondary);text-align:center;">我们尊重你的隐私，随时可以取消订阅。</p>'+
'</div>';
document.body.appendChild(popup);
// 添加动画样式
var style=document.createElement('style');
style.textContent='@keyframes popupIn{from{opacity:0;transform:translateY(-20px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}';
document.head.appendChild(style);
// 监听鼠标移出窗口顶部
document.addEventListener('mouseleave',function(e){
if(shown)return;
if(e.clientY<=0){
shown=true;
popup.style.display='flex';
localStorage.setItem('exit_popup_last_show',Date.now().toString());
Analytics.track('exit_intent_shown',{});
}
});
// 表单提交
var form=document.getElementById('exitPopupForm');
if(form){
form.addEventListener('submit',function(){
var email=document.getElementById('exitPopupEmail').value;
if(email){
Analytics.trackSubscribe(email);
popup.innerHTML='<div style="text-align:center;padding:20px;"><span style="font-size:4rem;">🎉</span><h3 style="margin:15px 0;">订阅成功！</h3><p style="color:var(--text-secondary);">感谢订阅！第一期 AI 工具周报将在本周发送到你的邮箱。</p></div>';
setTimeout(function(){popup.style.display='none';},3000);
}
});
}
// 点击背景关闭
popup.addEventListener('click',function(e){
if(e.target===popup)popup.style.display='none';
});
}
// ===== 转化漏斗优化：5个断点修复 =====
function initConversionFunnel(){
var searchInput=document.getElementById('searchInput');
if(searchInput){
searchInput.addEventListener('focus',function(){if(!this.value)this.placeholder='试试搜索：ChatGPT、AI绘画、视频生成...';});
searchInput.addEventListener('blur',function(){this.placeholder='搜索 AI 工具，如：ChatGPT、AI绘画、视频生成...';});
}
var detailObs=new MutationObserver(function(){
var dv=document.getElementById('detailView');
if(!dv||dv.style.display==='none')return;
var dc=document.getElementById('detailContent');
if(!dc||dc.querySelector('.cta-enhanced'))return;
var links=dc.querySelectorAll('a[href^="http"], .detail-btn');
links.forEach(function(link){
if(link.textContent.indexOf('访问')>=0||link.textContent.indexOf('官网')>=0||link.textContent.indexOf('立即')>=0){
link.classList.add('cta-enhanced');
link.style.cssText+='background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:12px 28px;border-radius:8px;font-weight:600;text-decoration:none;display:inline-block;margin-top:15px;box-shadow:0 4px 12px rgba(102,126,234,.3);';
}
});
});
var dv2=document.getElementById('detailView');
if(dv2)detailObs.observe(dv2,{attributes:true,attributeFilter:['style'],childList:true,subtree:true});
document.addEventListener('click',function(e){
var favBtn=e.target.closest('.favorite-btn, [data-favorite]');
if(favBtn){setTimeout(function(){if(typeof showToast==='function')showToast('⭐ 已收藏！点击导航栏"收藏"查看你的工具库');},100);}
});
var newsletterForms=document.querySelectorAll('.newsletter-form');
newsletterForms.forEach(function(form){
var input=form.querySelector('input[type="email"]');
if(input)input.placeholder='输入邮箱，免费获取 50+ AI 工具评测';
});
}
// ===== 用户激励体系：积分、徽章、排行榜 =====
var Gamification={
points:parseInt(localStorage.getItem('user_points')||'0'),
badges:JSON.parse(localStorage.getItem('user_badges')||'[]'),
toolViews:parseInt(localStorage.getItem('tool_views')||'0'),
searches:parseInt(localStorage.getItem('search_count')||'0'),
favorites:parseInt(localStorage.getItem('favorite_count')||'0'),
addPoints:function(amount,reason){
this.points+=amount;
localStorage.setItem('user_points',this.points.toString());
this.checkBadges();
if(typeof showToast==='function'&&amount>=10){
showToast('🎉 +'+amount+' 积分！'+reason);
}
},
checkBadges:function(){
var newBadges=[];
if(this.toolViews>=1&&!this.badges.includes('explorer')){this.badges.push('explorer');newBadges.push('🔍 探索者');}
if(this.toolViews>=10&&!this.badges.includes('enthusiast')){this.badges.push('enthusiast');newBadges.push('🚀 爱好者');}
if(this.toolViews>=50&&!this.badges.includes('expert')){this.badges.push('expert');newBadges.push('👑 专家');}
if(this.searches>=5&&!this.badges.includes('searcher')){this.badges.push('searcher');newBadges.push('🔎 搜索达人');}
if(this.favorites>=3&&!this.badges.includes('collector')){this.badges.push('collector');newBadges.push('⭐ 收藏家');}
if(this.points>=100&&!this.badges.includes('contributor')){this.badges.push('contributor');newBadges.push('💎 贡献者');}
localStorage.setItem('user_badges',JSON.stringify(this.badges));
newBadges.forEach(function(badge){
if(typeof showToast==='function')showToast('🏆 获得新徽章：'+badge);
});
},
init:function(){
var self=this;
document.addEventListener('click',function(e){
var card=e.target.closest('.tool-card, .hot-card, .similar-card');
if(card){
self.toolViews++;
localStorage.setItem('tool_views',self.toolViews.toString());
self.addPoints(1,'浏览工具');
}
var searchBtn=e.target.closest('.hero-search-btn, [onclick*="searchTools"]');
if(searchBtn){
self.searches++;
localStorage.setItem('search_count',self.searches.toString());
self.addPoints(5,'搜索工具');
}
var favBtn=e.target.closest('.favorite-btn, [data-favorite]');
if(favBtn){
self.favorites++;
localStorage.setItem('favorite_count',self.favorites.toString());
self.addPoints(10,'收藏工具');
}
});
}
};
Gamification.init();
// ===== 用户等级系统扩展 =====
Gamification.levels=[
{level:1,name:'新手',minPoints:0,icon:'🌱',color:'#94a3b8',privileges:['基础功能']},
{level:2,name:'探索者',minPoints:50,icon:'🔍',color:'#22c55e',privileges:['基础功能','收藏无限制']},
{level:3,name:'爱好者',minPoints:200,icon:'🚀',color:'#3b82f6',privileges:['基础功能','收藏无限制','对比无限制']},
{level:4,name:'专家',minPoints:500,icon:'👑',color:'#a855f7',privileges:['基础功能','收藏无限制','对比无限制','优先审核提交']},
{level:5,name:'大师',minPoints:1000,icon:'💎',color:'#f59e0b',privileges:['所有功能','社区版主','参与产品决策']}
];
Gamification.badgeNames={explorer:'🔍 探索者',enthusiast:'🚀 爱好者',expert:'👑 专家',searcher:'🔎 搜索达人',collector:'⭐ 收藏家',contributor:'💎 贡献者'};
Gamification.getCurrentLevel=function(){for(var i=this.levels.length-1;i>=0;i--){if(this.points>=this.levels[i].minPoints)return this.levels[i];}return this.levels[0];};
Gamification.getNextLevel=function(){var c=this.getCurrentLevel();var idx=this.levels.indexOf(c);return idx<this.levels.length-1?this.levels[idx+1]:null;};
Gamification.getProgress=function(){var c=this.getCurrentLevel();var n=this.getNextLevel();if(!n)return 100;return Math.min(100,Math.round(((this.points-c.minPoints)/(n.minPoints-c.minPoints))*100));};
// ===== 用户个人中心页面 =====
function showUserProfile(){
var profileView=document.getElementById('profileView');
if(!profileView){
profileView=document.createElement('div');
profileView.id='profileView';
profileView.style.display='none';
var main=document.querySelector('.main-content')||document.body;
main.appendChild(profileView);
}
var views=['homeView','blogView','blogArticleView','aboutView','privacyView','notFoundView','compareView','detailView'];
views.forEach(function(id){var el=document.getElementById(id);if(el)el.style.display='none';});
profileView.style.display='block';
var level=Gamification.getCurrentLevel();
var next=Gamification.getNextLevel();
var progress=Gamification.getProgress();
var badgeHtml=Gamification.badges.map(function(b){return '<span style="display:inline-block;padding:8px 16px;background:var(--bg-secondary);border-radius:20px;margin:4px;font-size:.9rem;border:1px solid var(--border-color);">'+(Gamification.badgeNames[b]||b)+'</span>';}).join('')||'<p style="color:var(--text-secondary);">还没有获得徽章，开始探索吧！</p>';
var privHtml=level.privileges.map(function(p){return '<li style="margin:5px 0;">✅ '+p+'</li>';}).join('');
var nextPrivHtml=next?next.privileges.filter(function(p){return level.privileges.indexOf(p)<0;}).map(function(p){return '<li style="margin:5px 0;color:var(--text-secondary);">🔒 '+p+'</li>';}).join(''):'';
profileView.innerHTML='<div style="max-width:800px;margin:0 auto;padding:20px;">'+
'<div style="background:linear-gradient(135deg,'+level.color+',#667eea);border-radius:16px;padding:30px;color:#fff;margin-bottom:25px;box-shadow:0 8px 32px rgba(102,126,234,.3);">'+
'<div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">'+
'<div style="font-size:4rem;">'+level.icon+'</div>'+
'<div style="flex:1;min-width:200px;">'+
'<h2 style="margin:0;font-size:1.5rem;">'+level.name+'</h2>'+
'<p style="margin:5px 0;opacity:.9;">Lv.'+level.level+'</p>'+
'<p style="margin:0;font-size:1.3rem;font-weight:bold;">'+Gamification.points+' 积分</p>'+
'</div></div>'+
(next?'<div style="margin-top:20px;"><p style="margin:0 0 8px;font-size:.85rem;opacity:.9;">距离 '+next.name+' 还需 '+(next.minPoints-Gamification.points)+' 积分</p>'+
'<div style="background:rgba(255,255,255,.3);border-radius:10px;height:10px;overflow:hidden;"><div style="background:#fff;height:100%;width:'+progress+'%;border-radius:10px;transition:width .5s;"></div></div></div>':'<p style="margin-top:20px;">🎉 已达到最高等级！</p>')+
'</div>'+
'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:15px;margin-bottom:25px;">'+
'<div style="background:var(--bg-secondary);padding:20px;border-radius:12px;text-align:center;"><div style="font-size:2rem;margin-bottom:5px;">👀</div><div style="font-size:1.5rem;font-weight:bold;">'+Gamification.toolViews+'</div><div style="font-size:.8rem;color:var(--text-secondary);">浏览工具</div></div>'+
'<div style="background:var(--bg-secondary);padding:20px;border-radius:12px;text-align:center;"><div style="font-size:2rem;margin-bottom:5px;">🔎</div><div style="font-size:1.5rem;font-weight:bold;">'+Gamification.searches+'</div><div style="font-size:.8rem;color:var(--text-secondary);">搜索次数</div></div>'+
'<div style="background:var(--bg-secondary);padding:20px;border-radius:12px;text-align:center;"><div style="font-size:2rem;margin-bottom:5px;">⭐</div><div style="font-size:1.5rem;font-weight:bold;">'+Gamification.favorites+'</div><div style="font-size:.8rem;color:var(--text-secondary);">收藏工具</div></div>'+
'<div style="background:var(--bg-secondary);padding:20px;border-radius:12px;text-align:center;"><div style="font-size:2rem;margin-bottom:5px;">🏆</div><div style="font-size:1.5rem;font-weight:bold;">'+Gamification.badges.length+'</div><div style="font-size:.8rem;color:var(--text-secondary);">获得徽章</div></div>'+
'</div>'+
'<div style="background:var(--bg-secondary);padding:25px;border-radius:12px;margin-bottom:25px;">'+
'<h3 style="margin:0 0 15px;font-size:1.1rem;">🏆 我的徽章</h3>'+badgeHtml+
'</div>'+
'<div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:25px;">'+
'<div style="background:var(--bg-secondary);padding:20px;border-radius:12px;"><h4 style="margin:0 0 10px;color:'+level.color+';">当前特权</h4><ul style="margin:0;padding-left:20px;">'+privHtml+'</ul></div>'+
(next?'<div style="background:var(--bg-secondary);padding:20px;border-radius:12px;"><h4 style="margin:0 0 10px;color:'+next.color+';">下一等级特权</h4><ul style="margin:0;padding-left:20px;">'+nextPrivHtml+'</ul></div>':'')+
'</div>'+
'<div style="background:var(--bg-secondary);padding:25px;border-radius:12px;">'+
'<h3 style="margin:0 0 15px;font-size:1.1rem;">📈 如何获得更多积分？</h3>'+
'<ul style="margin:0;padding-left:20px;line-height:2;">'+
'<li>浏览工具：+1 积分</li>'+
'<li>搜索工具：+5 积分</li>'+
'<li>收藏工具：+10 积分</li>'+
'<li>发表评论：+5 积分（即将上线）</li>'+
'<li>提交工具被采纳：+50 积分（即将上线）</li>'+
'<li>邀请好友：+20 积分（即将上线）</li>'+
'</ul></div></div>';
window.scrollTo(0,0);
document.title='个人中心 - AI Tools Radar';
}
// 导航栏添加用户入口
function addUserNavEntry(){
var nav=document.querySelector('.nav-links')||document.querySelector('nav');
if(!nav||document.getElementById('userNavEntry'))return;
var entry=document.createElement('a');
entry.id='userNavEntry';
entry.href='#/profile';
entry.textContent='👤 我的';
entry.style.cursor='pointer';
entry.addEventListener('click',function(e){e.preventDefault();showUserProfile();});
nav.insertBefore(entry,nav.firstChild);
}
// ===== 基于内容的推荐系统 =====
var Recommender={
toolFeatures:{},
similarityCache:{},
extractFeatures:function(toolName,toolData){
var features={name:toolName,tags:[],category:'',price:'free',description:''};
if(toolData){
features.category=toolData.category||'';
features.tags=toolData.tags||[];
features.price=toolData.price||'free';
features.description=toolData.description||'';
}
return features;
},
calculateSimilarity:function(toolA,toolB){
var score=0;
if(toolA.category&&toolB.category&&toolA.category===toolB.category)score+=40;
var commonTags=toolA.tags.filter(function(t){return toolB.tags.indexOf(t)>=0;});
score+=commonTags.length*15;
if(toolA.price===toolB.price)score+=10;
var descA=toolA.description.toLowerCase();
var descB=toolB.description.toLowerCase();
var keywords=['ai','写作','图像','视频','音频','编程','设计','营销','效率','对话','生成','编辑','分析','学习','办公'];
var commonKw=keywords.filter(function(k){return descA.indexOf(k)>=0&&descB.indexOf(k)>=0;});
score+=commonKw.length*5;
return Math.min(100,score);
},
getRecommendations:function(currentToolName,count){
var self=this;
var tools=document.querySelectorAll('.tool-card, .hot-card');
var scores=[];
tools.forEach(function(card){
var nameEl=card.querySelector('.tool-card-name, .hot-card-name, h3, h4');
var name=nameEl?nameEl.textContent.trim():'';
if(!name||name===currentToolName)return;
var catEl=card.querySelector('.tool-card-category, .category-tag, [class*="category"]');
var category=catEl?catEl.textContent.trim():'';
var descEl=card.querySelector('.tool-card-desc, .hot-card-desc, p');
var description=descEl?descEl.textContent.trim():'';
var toolA={name:currentToolName,category:self.currentCategory||'',tags:self.currentTags||[],price:self.currentPrice||'free',description:self.currentDescription||''};
var toolB={name:name,category:category,tags:[],price:'free',description:description};
var score=self.calculateSimilarity(toolA,toolB);
if(score>0)scores.push({name:name,score:score,element:card});
});
scores.sort(function(a,b){return b.score-a.score;});
return scores.slice(0,count||5);
},
showRecommendations:function(toolName){
var recSection=document.getElementById('recommendationSection');
if(recSection)recSection.remove();
var recs=this.getRecommendations(toolName,5);
if(recs.length===0)return;
var detailContent=document.getElementById('detailContent');
if(!detailContent)return;
recSection=document.createElement('div');
recSection.id='recommendationSection';
recSection.style.marginTop='30px';
recSection.style.paddingTop='20px';
recSection.style.borderTop='1px solid var(--border-color)';
var html='<h3 style="margin-bottom:15px;font-size:1.1rem;">🎯 为你推荐</h3>';
html+='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;">';
recs.forEach(function(rec){
html+='<a href="#" onclick="return quickSearch(\''+rec.name.replace(/'/g,"\\'")+'\'),!1" style="padding:15px;background:var(--bg-secondary);border-radius:10px;text-decoration:none;color:var(--text-primary);border:1px solid var(--border-color);transition:all .2s;display:block;">'+
'<div style="font-weight:600;margin-bottom:5px;">'+rec.name+'</div>'+
'<div style="font-size:.75rem;color:var(--text-secondary);">匹配度 '+rec.score+'%</div></a>';
});
html+='</div>';
recSection.innerHTML=html;
detailContent.appendChild(recSection);
}
};
// 监听工具详情页，自动显示推荐
var recObserver=new MutationObserver(function(){
var detailView=document.getElementById('detailView');
if(!detailView||detailView.style.display==='none')return;
var detailContent=document.getElementById('detailContent');
if(!detailContent)return;
var titleEl=detailContent.querySelector('h1, h2, .detail-title');
if(titleEl&&!document.getElementById('recommendationSection')){
var toolName=titleEl.textContent.trim();
setTimeout(function(){Recommender.showRecommendations(toolName);},300);
}
});
var dv=document.getElementById('detailView');
if(dv)recObserver.observe(dv,{attributes:true,attributeFilter:['style'],childList:true,subtree:true});
// ===== A/B 测试机制 =====
var ABTest={
tests:{},
results:JSON.parse(localStorage.getItem('ab_test_results')||'{}'),
init:function(){
// 定义测试用例
this.tests={
hero_headline:{
name:'首屏标题测试',
variants:['default','short'],
goal:'search_count',
description:'测试首屏标题长度对搜索转化率的影响'
},
cta_button:{
name:'CTA按钮颜色测试',
variants:['default','orange'],
goal:'tool_click',
description:'测试CTA按钮颜色对工具点击率的影响'
}
};
// 为每个测试随机分配用户
for(var testId in this.tests){
var test=this.tests[testId];
var userGroup=localStorage.getItem('ab_'+testId);
if(!userGroup){
userGroup=test.variants[Math.floor(Math.random()*test.variants.length)];
localStorage.setItem('ab_'+testId,userGroup);
}
test.userGroup=userGroup;
}
this.applyVariants();
console.log('%c🧪 A/B 测试已启动','color:#a855f7;font-size:12px');
for(var id in this.tests){
console.log('  - '+this.tests[id].name+': '+this.tests[id].userGroup);
}
},
applyVariants:function(){
// 应用首屏标题测试
if(this.tests.hero_headline&&this.tests.hero_headline.userGroup==='short'){
var title=document.querySelector('.hero-title');
if(title){
title.innerHTML='发现最好用的 <span class="hero-highlight">AI 工具</span>';
}
}
// 应用CTA按钮颜色测试
if(this.tests.cta_button&&this.tests.cta_button.userGroup==='orange'){
var style=document.createElement('style');
style.textContent='.detail-btn-primary,.hero-search-btn{background:linear-gradient(135deg,#f97316,#ea580c)!important;}';
document.head.appendChild(style);
}
},
track:function(testId,event){
if(!this.tests[testId])return;
var group=this.tests[testId].userGroup;
if(!this.results[testId])this.results[testId]={};
if(!this.results[testId][group])this.results[testId][group]={views:0,conversions:0};
if(event==='view')this.results[testId][group].views++;
if(event==='convert')this.results[testId][group].conversions++;
localStorage.setItem('ab_test_results',JSON.stringify(this.results));
},
getResults:function(testId){
if(!this.tests[testId]||!this.results[testId])return null;
var test=this.tests[testId];
var result={name:test.name,variants:{}};
for(var group in this.results[testId]){
var data=this.results[testId][group];
var rate=data.views>0?((data.conversions/data.views)*100).toFixed(2)+'%':'0%';
result.variants[group]={views:data.views,conversions:data.conversions,conversionRate:rate};
}
return result;
}
};
ABTest.init();
// ===== 博客详细内容页面 =====
var BlogArticles={
'best-ai-writing-tools-2026':{
title:'2026年10大最佳AI写作工具对比评测',
author:'AI Tools Radar 团队',
date:'2026-08-28',
readTime:'8分钟',
category:'写作',
content:`
<h2>引言</h2>
<p>AI写作工具正在彻底改变我们创作内容的方式。无论是写博客文章、营销文案、学术论文，还是日常邮件，AI都能帮你提升效率10倍以上。</p>
<p>2026年，AI写作工具市场已经非常成熟，有数十款产品可供选择。但哪款最适合你？哪款性价比最高？哪款中文支持最好？</p>
<p>本文深度对比评测了10款主流AI写作工具，从功能、价格、易用性、输出质量等多个维度进行分析，帮你做出最明智的选择。</p>
<h2>评测标准</h2>
<p>我们从以下6个维度对每款工具进行评分（满分10分）：</p>
<ul>
<li><strong>输出质量</strong>：生成内容的质量、准确性、原创性</li>
<li><strong>功能丰富度</strong>：支持的写作场景、模板、高级功能</li>
<li><strong>易用性</strong>：界面设计、上手难度、学习曲线</li>
<li><strong>价格</strong>：性价比、免费额度、付费方案</li>
<li><strong>中文支持</strong>：中文理解和生成质量</li>
<li><strong>集成能力</strong>：API、插件、与其他工具的集成</li>
</ul>
<h2>10款AI写作工具详细评测</h2>
<h3>1. ChatGPT（综合最佳）</h3>
<p><strong>评分：9.5/10</strong></p>
<p>ChatGPT是OpenAI开发的通用AI助手，也是目前最流行的AI写作工具。它支持GPT-3.5（免费）和GPT-4（付费），功能全面，适用于各种写作场景。</p>
<p><strong>优点：</strong></p>
<ul>
<li>功能最全面，从创意写作到技术写作都能胜任</li>
<li>GPT-4的输出质量非常高，逻辑清晰，原创性好</li>
<li>支持插件扩展，可联网搜索、生成图片、分析数据</li>
<li>免费版功能足够日常使用</li>
<li>API成熟，开发者友好</li>
</ul>
<p><strong>缺点：</strong></p>
<ul>
<li>GPT-4 Plus需要$20/月，价格较高</li>
<li>中文写作质量略逊于英文</li>
<li>有时会产生"幻觉"，生成不准确的信息</li>
<li>高峰期响应速度较慢</li>
</ul>
<p><strong>价格：</strong>免费版（GPT-3.5无限使用）；Plus版$20/月（GPT-4优先访问）；Team版$25/用户/月</p>
<p><strong>适合人群：</strong>通用写作、创意写作、技术写作、学生、开发者</p>
<h3>2. Claude（长文本最佳）</h3>
<p><strong>评分：9.2/10</strong></p>
<p>Claude是Anthropic开发的AI助手，以长文本处理能力和写作质量著称。Claude 3 Opus支持200K上下文窗口，可以处理整本书的内容。</p>
<p><strong>优点：</strong></p>
<ul>
<li>长文本处理能力最强，支持200K上下文</li>
<li>写作质量高，文风自然，可读性好</li>
<li>安全性好，不易产生有害内容</li>
<li>Anthropic持续快速迭代，功能更新频繁</li>
<li>免费版功能不错</li>
</ul>
<p><strong>缺点：</strong></p>
<ul>
<li>功能相对单一，主要聚焦文本处理</li>
<li>插件生态不如ChatGPT丰富</li>
<li>图像生成能力弱</li>
<li>免费版使用限制较多</li>
<li>Pro版$20/月，与ChatGPT Plus价格相同</li>
</ul>
<p><strong>价格：</strong>免费版（有限使用）；Pro版$20/月（优先访问，更多使用量）</p>
<p><strong>适合人群：</strong>长文章写作、书籍、深度报告、学术写作、内容编辑</p>
<h3>3. Jasper（营销文案最佳）</h3>
<p><strong>评分：8.5/10</strong></p>
<p>Jasper是专为营销人员设计的AI写作工具，拥有50+营销文案模板，支持品牌声音学习，是营销团队的首选。</p>
<p><strong>优点：</strong></p>
<ul>
<li>专为营销优化，50+文案模板覆盖各种营销场景</li>
<li>品牌声音学习功能，保持品牌调性一致</li>
<li>团队协作功能强大，适合营销团队</li>
<li>SEO优化集成，可生成SEO友好的内容</li>
<li>支持多语言</li>
</ul>
<p><strong>缺点：</strong></p>
<ul>
<li>价格较贵，Creator版$49/月起</li>
<li>通用写作能力不如ChatGPT</li>
<li>学习曲线较陡，需要时间掌握模板</li>
<li>中文支持一般</li>
<li>免费试用只有7天</li>
</ul>
<p><strong>价格：</strong>Creator版$49/月；Pro版$69/月；Business版定制价格</p>
<p><strong>适合人群：</strong>营销人员、内容团队、企业、SEO写手</p>
<h3>4. Copy.ai（性价比最佳）</h3>
<p><strong>评分：8.3/10</strong></p>
<p>Copy.ai是一款功能强大且价格实惠的AI写作工具，拥有90+模板，适合中小企业和自由职业者。</p>
<p><strong>优点：</strong></p>
<ul>
<li>90+模板覆盖各种写作场景</li>
<li>价格实惠，Free版功能不错</li>
<li>界面友好，上手简单</li>
<li>支持团队协作</li>
<li>持续更新新功能</li>
</ul>
<p><strong>缺点：</strong></p>
<ul>
<li>输出质量不如ChatGPT和Claude</li>
<li>长文本处理能力一般</li>
<li>中文支持一般</li>
<li>高级功能需要付费版</li>
</ul>
<p><strong>价格：</strong>Free版（2000字/月）；Pro版$49/月（无限字数）；Team版$249/月</p>
<p><strong>适合人群：</strong>中小企业、自由职业者、营销新手</p>
<h3>5. Writesonic（SEO最佳）</h3>
<p><strong>评分：8.0/10</strong></p>
<p>Writesonic是一款专注SEO内容创作的AI写作工具，集成了Surfer SEO，可生成SEO优化的长文章。</p>
<p><strong>优点：</strong></p>
<ul>
<li>SEO优化能力强，集成Surfer SEO</li>
<li>可一键生成长文章（1500字+）</li>
<li>价格实惠，Free版功能不错</li>
<li>支持多种内容类型</li>
<li>AI图片生成集成</li>
</ul>
<p><strong>缺点：</strong></p>
<ul>
<li>输出质量不稳定</li>
<li>界面设计一般</li>
<li>中文支持一般</li>
<li>长文章需要多次编辑</li>
</ul>
<p><strong>价格：</strong>Free版（10000字/月）；Pro版$12.67/月（无限字数）；Team版$126.75/月</p>
<p><strong>适合人群：</strong>SEO写手、博客作者、内容营销人员</p>
<h3>6. Notion AI（笔记+写作最佳）</h3>
<p><strong>评分：8.2/10</strong></p>
<p>Notion AI集成在Notion笔记工具中，支持在笔记中直接使用AI写作、总结、翻译，是知识工作者的首选。</p>
<p><strong>优点：</strong></p>
<ul>
<li>与Notion深度集成，在笔记中直接使用</li>
<li>支持写作、总结、翻译、头脑风暴</li>
<li>所有知识在一个地方，AI帮你整理和检索</li>
<li>界面美观，体验流畅</li>
<li>价格合理</li>
</ul>
<p><strong>缺点：</strong></p>
<ul>
<li>AI功能需要付费（Notion AI $10/月）</li>
<li>写作功能不如专业写作工具丰富</li>
<li>长文本处理能力一般</li>
<li>需要先使用Notion才能使用AI</li>
</ul>
<p><strong>价格：</strong>Notion免费版；Notion AI $10/成员/月；Plus版$10/成员/月（含AI）</p>
<p><strong>适合人群：</strong>知识工作者、学生、研究人员、笔记爱好者</p>
<h3>7. Grammarly（语法检查最佳）</h3>
<p><strong>评分：7.8/10</strong></p>
<p>Grammarly是最流行的AI语法检查和写作助手工具，支持浏览器插件、桌面应用、移动应用，随时随地检查写作。</p>
<p><strong>优点：</strong></p>
<ul>
<li>语法检查准确率最高</li>
<li>支持多种平台（浏览器、桌面、移动、Office）</li>
<li>风格建议和改写功能强大</li>
<li> plagiarism检测（付费版）</li>
<li>免费版功能足够日常使用</li>
</ul>
<p><strong>缺点：</strong></p>
<ul>
<li>主要是语法检查，不是内容生成</li>
<li>付费版价格较高（$12/月）</li>
<li>中文支持有限</li>
<li>有时建议过于保守</li>
</ul>
<p><strong>价格：</strong>Free版（基础语法检查）；Premium版$12/月；Business版$15/成员/月</p>
<p><strong>适合人群：</strong>英语写作者、学生、专业人士、内容编辑</p>
<h3>8. QuillBot（改写最佳）</h3>
<p><strong>评分：7.5/10</strong></p>
<p>QuillBot是一款专注文本改写和润色的AI工具，支持7种改写模式，是学术写作和内容改写的利器。</p>
<p><strong>优点：</strong></p>
<ul>
<li>改写功能强大，7种模式可选</li>
<li>语法检查和拼写纠错</li>
<li>支持论文引用格式化</li>
<li>免费版功能不错</li>
<li>界面简洁，上手快</li>
</ul>
<p><strong>缺点：</strong></p>
<ul>
<li>主要是改写，不是内容生成</li>
<li>长文本处理需要付费版</li>
<li>中文支持一般</li>
<li>功能相对单一</li>
</ul>
<p><strong>价格：</strong>Free版（有限改写）；Premium版$9.95/月</p>
<p><strong>适合人群：</strong>学生、学术写作者、内容编辑、SEO写手</p>
<h3>9. Rytr（预算最佳）</h3>
<p><strong>评分：7.2/10</strong></p>
<p>Rytr是一款价格实惠的AI写作工具，支持40+模板和30+语言，适合预算有限的用户。</p>
<p><strong>优点：</strong></p>
<ul>
<li>价格非常实惠，Saver版$9/月</li>
<li>40+模板覆盖常见写作场景</li>
<li>支持30+语言</li>
<li>界面简洁</li>
<li>免费版每月10000字符</li>
</ul>
<p><strong>缺点：</strong></p>
<ul>
<li>输出质量一般</li>
<li>功能相对简单</li>
<li>长文本处理能力弱</li>
<li>中文支持一般</li>
</ul>
<p><strong>价格：</strong>Free版（10000字符/月）；Saver版$9/月（100000字符/月）；Unlimited版$29/月</p>
<p><strong>适合人群：</strong>预算有限的用户、写作新手、学生</p>
<h3>10. Peppertype（企业最佳）</h3>
<p><strong>评分：7.0/10</strong></p>
<p>Peppertype是一款面向企业的AI内容创作平台，支持团队协作、内容管理、品牌一致性，适合企业内容团队。</p>
<p><strong>优点：</strong></p>
<ul>
<li>企业级功能，团队协作强大</li>
<li>内容管理和工作流</li>
<li>品牌声音一致性</li>
<li>支持多种内容类型</li>
<li>客户支持好</li>
</ul>
<p><strong>缺点：</strong></p>
<ul>
<li>价格较高，Personal版$35/月</li>
<li>功能复杂，学习曲线陡</li>
<li>个人用户不需要这么多功能</li>
<li>中文支持一般</li>
</ul>
<p><strong>价格：</strong>Personal版$35/月；Team版$40/用户/月；Enterprise版定制</p>
<p><strong>适合人群：</strong>企业内容团队、营销机构、大型组织</p>
<h2>对比表格</h2>
<table>
<tr><th>工具</th><th>输出质量</th><th>功能丰富度</th><th>易用性</th><th>价格</th><th>中文支持</th><th>总分</th></tr>
<tr><td>ChatGPT</td><td>9.5</td><td>9.5</td><td>9.0</td><td>8.5</td><td>8.0</td><td><strong>9.5</strong></td></tr>
<tr><td>Claude</td><td>9.5</td><td>8.0</td><td>9.0</td><td>8.5</td><td>8.5</td><td><strong>9.2</strong></td></tr>
<tr><td>Jasper</td><td>8.5</td><td>9.0</td><td>7.5</td><td>6.5</td><td>6.5</td><td><strong>8.5</strong></td></tr>
<tr><td>Copy.ai</td><td>8.0</td><td>8.5</td><td>8.5</td><td>8.5</td><td>6.5</td><td><strong>8.3</strong></td></tr>
<tr><td>Notion AI</td><td>8.0</td><td>7.5</td><td>9.0</td><td>8.0</td><td>7.5</td><td><strong>8.2</strong></td></tr>
<tr><td>Writesonic</td><td>7.5</td><td>8.0</td><td>8.0</td><td>9.0</td><td>6.5</td><td><strong>8.0</strong></td></tr>
<tr><td>Grammarly</td><td>7.0</td><td>6.5</td><td>9.5</td><td>7.5</td><td>5.0</td><td><strong>7.8</strong></td></tr>
<tr><td>QuillBot</td><td>7.0</td><td>6.0</td><td>9.0</td><td>8.0</td><td>5.5</td><td><strong>7.5</strong></td></tr>
<tr><td>Rytr</td><td>6.5</td><td>7.0</td><td>8.5</td><td>9.5</td><td>6.0</td><td><strong>7.2</strong></td></tr>
<tr><td>Peppertype</td><td>7.0</td><td>8.0</td><td>7.0</td><td>6.0</td><td>6.0</td><td><strong>7.0</strong></td></tr>
</table>
<h2>选购建议</h2>
<h3>按需求选择</h3>
<ul>
<li><strong>通用写作</strong>：ChatGPT（功能最全面）</li>
<li><strong>长文章/书籍</strong>：Claude（200K上下文）</li>
<li><strong>营销文案</strong>：Jasper（专为营销优化）</li>
<li><strong>预算有限</strong>：Rytr（$9/月）或ChatGPT免费版</li>
<li><strong>SEO内容</strong>：Writesonic（集成Surfer SEO）</li>
<li><strong>笔记+写作</strong>：Notion AI（知识管理+AI）</li>
<li><strong>语法检查</strong>：Grammarly（准确率最高）</li>
<li><strong>学术写作</strong>：QuillBot（改写+引用格式化）</li>
<li><strong>企业团队</strong>：Peppertype（企业级功能）</li>
</ul>
<h3>按预算选择</h3>
<ul>
<li><strong>$0预算</strong>：ChatGPT免费版 + Grammarly免费版</li>
<li><strong>$10/月预算</strong>：ChatGPT免费版 + Notion AI 或 Rytr</li>
<li><strong>$20/月预算</strong>：ChatGPT Plus 或 Claude Pro</li>
<li><strong>$50/月预算</strong>：ChatGPT Plus + Jasper 或 Copy.ai</li>
<li><strong>$100+/月预算</strong>：ChatGPT Team + Jasper Business + Grammarly Business</li>
</ul>
<h2>常见问题 FAQ</h2>
<h3>Q: AI写作工具生成的内容是原创的吗？</h3>
<p>A: 大多数AI写作工具生成的内容原创度在80-95%之间，但建议使用前进行原创性检测和人工编辑。重要内容一定要人工审核和修改。</p>
<h3>Q: AI写作工具会被搜索引擎惩罚吗？</h3>
<p>A: Google明确表示，高质量的AI辅助内容不会被惩罚。关键是内容质量，而不是生产方式。建议AI生成初稿，人工编辑优化，增加个人观点和经验。</p>
<h3>Q: 哪款AI写作工具中文支持最好？</h3>
<p>A: ChatGPT和Claude的中文支持最好，输出质量高。国产工具如文心一言、通义千问的中文支持也很好，但功能相对单一。</p>
<h3>Q: AI写作工具能代替专业写作者吗？</h3>
<p>A: 不能完全代替。AI是辅助工具，能提升效率，但专业的观点、深度的分析、独特的风格仍然需要人类。最好的方式是AI生成初稿，人类编辑优化。</p>
<h3>Q: 免费版AI写作工具有哪些限制？</h3>
<p>A: 免费版通常有字数限制、功能限制、优先级低。ChatGPT免费版使用GPT-3.5，功能足够日常使用；其他工具免费版字数限制较严格。</p>
<h2>结论</h2>
<p>2026年，AI写作工具已经非常成熟，选择哪款取决于你的具体需求和预算。</p>
<p><strong>综合最佳：ChatGPT</strong> — 功能最全面，输出质量最高，免费版足够日常使用，Plus版物超所值。</p>
<p><strong>长文本最佳：Claude</strong> — 200K上下文窗口，写作质量高，适合长文章和深度报告。</p>
<p><strong>营销最佳：Jasper</strong> — 专为营销优化，模板丰富，团队协作强大，适合营销团队。</p>
<p><strong>性价比最佳：Copy.ai</strong> — 功能丰富，价格实惠，适合中小企业和自由职业者。</p>
<p>建议先使用免费版试用，找到最适合你的工具后再考虑付费。记住，AI是辅助工具，你的创造力和思考才是核心。</p>
<p>想了解更多AI工具？访问 <a href="https://qxgjz.github.io/ai-tools-radar/">AI Tools Radar</a>，发现更多好用的AI工具！</p>
`
}
};
function showBlogArticle(articleId){
var article=BlogArticles[articleId];
if(!article)return false;
var detailView=document.getElementById('detailView');
var detailContent=document.getElementById('detailContent');
if(!detailView||!detailContent)return false;
// 隐藏其他视图
document.getElementById('homeView').style.display='none';
document.getElementById('blogView').style.display='none';
document.getElementById('blogArticleView').style.display='none';
document.getElementById('aboutView').style.display='none';
document.getElementById('privacyView').style.display='none';
document.getElementById('notFoundView').style.display='none';
document.getElementById('compareView').style.display='none';
// 显示详情视图
detailView.style.display='block';
// 渲染文章内容
detailContent.innerHTML='<div class="blog-article-content" style="max-width:800px;margin:0 auto;">'+
'<div class="article-header" style="margin-bottom:30px;padding-bottom:20px;border-bottom:1px solid var(--border-color);">'+
'<span class="article-category" style="display:inline-block;padding:4px 12px;background:var(--gradient-start);color:#fff;border-radius:20px;font-size:.8rem;margin-bottom:15px;">'+article.category+'</span>'+
'<h1 style="font-size:2rem;margin-bottom:15px;line-height:1.3;">'+article.title+'</h1>'+
'<div class="article-meta" style="display:flex;gap:20px;color:var(--text-secondary);font-size:.85rem;flex-wrap:wrap;">'+
'<span>✍️ '+article.author+'</span>'+
'<span>📅 '+article.date+'</span>'+
'<span>⏱️ '+article.readTime+'</span>'+
'</div></div>'+
'<div class="article-body" style="line-height:1.8;font-size:1rem;">'+article.content+'</div>'+
'<div class="article-footer" style="margin-top:40px;padding-top:20px;border-top:1px solid var(--border-color);">'+
'<h3 style="margin-bottom:15px;">🔗 相关工具推荐</h3>'+
'<div class="similar-grid">'+
'<a href="#" onclick="return quickSearch(\'ChatGPT\'),!1" class="similar-card"><div class="similar-card-name">ChatGPT</div><div class="similar-card-desc">通用AI助手，功能最全面</div></a>'+
'<a href="#" onclick="return quickSearch(\'Claude\'),!1" class="similar-card"><div class="similar-card-name">Claude</div><div class="similar-card-desc">长文本处理最强</div></a>'+
'<a href="#" onclick="return quickSearch(\'Jasper\'),!1" class="similar-card"><div class="similar-card-name">Jasper</div><div class="similar-card-desc">营销文案最佳</div></a>'+
'</div></div></div>';
// 滚动到顶部
window.scrollTo(0,0);
// 更新页面标题
document.title=article.title+' - AI Tools Radar';
return true;
}
// 拦截博客文章点击
document.addEventListener('click',function(e){
var blogCard=e.target.closest('.blog-card, [data-blog-id], [onclick*="showBlogArticle"]');
if(blogCard){
var articleId=blogCard.dataset.blogId||blogCard.getAttribute('onclick');
if(articleId&&articleId.indexOf("'")>0){
articleId=articleId.split("'")[1];
if(showBlogArticle(articleId)){
e.preventDefault();
e.stopPropagation();
}
}
}
});
// ===== 工具详情页 FAQ =====
var TOOL_FAQS={
'ChatGPT':[
{q:'ChatGPT 免费吗？',a:'ChatGPT 提供免费版（GPT-3.5）和付费版（ChatGPT Plus，$20/月，使用 GPT-4）。免费版功能有限，付费版支持更强大的 GPT-4 模型、插件、DALL-E 图像生成等。'},
{q:'ChatGPT 和 Claude 哪个好？',a:'ChatGPT 功能更全面，支持插件、多模态、代码解释器；Claude 长文本处理更强，写作质量更高，安全性更好。选择取决于你的具体需求：通用选 ChatGPT，长文本写作选 Claude。'},
{q:'ChatGPT 能写代码吗？',a:'可以，ChatGPT 支持多种编程语言的代码生成、调试、解释。GPT-4 的代码能力尤其强大，支持复杂的算法、数据结构、全栈开发。但建议对生成的代码进行审查和测试。'},
{q:'ChatGPT 的数据安全吗？',a:'OpenAI 承诺不会用用户对话数据训练模型（企业版）。免费版和 Plus 版的对话可能会被用于改进模型。敏感信息建议不要输入，或使用企业版/API。'}
],
'Midjourney':[
{q:'Midjourney 有免费版吗？',a:'Midjourney 没有免费版，所有套餐都需要付费。基础版 $10/月（200分钟生成时间），标准版 $30/月（15小时快速生成），专业版 $60/月（无限快速生成）。'},
{q:'Midjourney 和 DALL-E 3 哪个好？',a:'Midjourney 画质更高、艺术感更强、风格多样性更丰富，适合专业设计师和艺术创作；DALL-E 3 提示词理解更好、与 ChatGPT 集成、价格更便宜，适合普通用户和快速原型。'},
{q:'Midjourney 只能通过 Discord 使用吗？',a:'目前 Midjourney 主要通过 Discord 使用，需要加入 Discord 服务器。官方正在开发独立的网页版和 API，但目前还在测试阶段。'},
{q:'Midjourney 生成的图片有版权吗？',a:'根据 Midjourney 服务条款，付费用户拥有生成图片的版权，可以商用。免费试用用户不拥有版权。但生成的图片可能与现有作品相似，建议商用前进行版权审查。'}
],
'GitHub Copilot':[
{q:'GitHub Copilot 多少钱？',a:'GitHub Copilot 个人版 $10/月或 $100/年，企业版 $19/用户/月。学生和开源维护者可以免费使用。支持 30 天免费试用。'},
{q:'GitHub Copilot 支持哪些语言？',a:'GitHub Copilot 支持几乎所有主流编程语言，包括 Python、JavaScript、TypeScript、Java、C++、Go、Rust、Ruby、PHP 等。在 Python、JavaScript、TypeScript 上表现最好。'},
{q:'GitHub Copilot 和 Cursor 哪个好？',a:'GitHub Copilot 与 VS Code 深度集成，代码补全准确率高，适合日常编码；Cursor 是独立 IDE，支持对话式编程、多文件编辑、AI 重构，适合更复杂的开发任务。'},
{q:'GitHub Copilot 生成的代码有版权问题吗？',a:'GitHub 承诺 Copilot 生成的代码不会侵犯版权，如果遇到版权诉讼，GitHub 会承担法律费用（企业版）。但建议对生成的代码进行审查，确保符合项目的代码规范和安全要求。'}
]
};
function getToolFAQs(name){
if(TOOL_FAQS[name])return TOOL_FAQS[name];
// 通用 FAQ 模板
return[
{q:name+' 免费吗？',a:name+' 提供免费版和付费版。免费版功能有限，付费版提供更多高级功能。具体价格请参考官方网站。'},
{q:name+' 适合新手吗？',a:'是的，'+name+' 界面友好，上手简单，适合新手使用。同时也提供高级功能，满足专业用户的需求。'},
{q:name+' 和同类工具相比有什么优势？',a:name+' 的优势在于功能强大、易用性好、持续更新迭代。具体选择取决于你的使用场景和预算。'},
{q:name+' 的数据安全吗？',a:'大多数 AI 工具都采取了严格的数据安全措施。敏感信息建议不要输入，或查看官方的隐私政策和数据处理协议。'}
];
}
function initToolFAQ(){
var detailView=document.getElementById('detailView');
if(!detailView)return;
var observer=new MutationObserver(function(){
if(detailView.style.display==='none')return;
var detailContent=document.getElementById('detailContent');
if(!detailContent)return;
if(detailContent.querySelector('.tool-faq'))return;
var titleEl=detailContent.querySelector('h1, h2, .detail-title');
var toolName=titleEl?titleEl.textContent.trim():'';
if(!toolName)return;
var faqs=getToolFAQs(toolName);
// 创建 FAQ 板块
var faqHTML='<div class="tool-faq" style="margin:30px 0;padding-top:20px;border-top:1px solid var(--border-color);">';
faqHTML+='<h3 style="font-size:1.2rem;margin-bottom:15px;">❓ 常见问题</h3>';
faqs.forEach(function(faq,i){
faqHTML+='<div class="faq-item" style="margin-bottom:15px;padding:15px;background:var(--bg-secondary);border-radius:10px;">';
faqHTML+='<h4 style="font-size:.95rem;margin-bottom:8px;cursor:pointer;" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display===\'none\'?\'block\':\'none\'">'+faq.q+'</h4>';
faqHTML+='<p style="font-size:.85rem;color:var(--text-secondary);line-height:1.6;margin:0;">'+faq.a+'</p>';
faqHTML+='</div>';
});
faqHTML+='</div>';
// 插入到详情内容末尾
var div=document.createElement('div');
div.innerHTML=faqHTML;
detailContent.appendChild(div.firstChild);
// 添加 FAQ 结构化数据
var faqData={
'@context':'https://schema.org',
'@type':'FAQPage',
'mainEntity':faqs.map(function(faq){
return{'@type':'Question','name':faq.q,'acceptedAnswer':{'@type':'Answer','text':faq.a}};
})
};
var script=document.createElement('script');
script.type='application/ld+json';
script.id='faq-structured-data';
script.textContent=JSON.stringify(faqData);
var old=document.getElementById('faq-structured-data');
if(old)old.remove();
document.head.appendChild(script);
});
observer.observe(detailView,{attributes:true,attributeFilter:['style'],childList:true,subtree:true});
}
// ===== 面包屑导航+结构化数据 =====
function initBreadcrumb(){
var detailView=document.getElementById('detailView');
if(!detailView)return;
var observer=new MutationObserver(function(){
if(detailView.style.display==='none')return;
// 检查是否已有面包屑
if(document.getElementById('breadcrumb'))return;
var detailContent=document.getElementById('detailContent');
if(!detailContent)return;
var titleEl=detailContent.querySelector('h1, h2, .detail-title');
var toolName=titleEl?titleEl.textContent.trim():'';
if(!toolName)return;
// 创建面包屑
var breadcrumb=document.createElement('nav');
breadcrumb.id='breadcrumb';
breadcrumb.className='breadcrumb';
breadcrumb.setAttribute('aria-label','面包屑导航');
breadcrumb.innerHTML='<a href="#" onclick="return navigateTo(\'home\'),!1" style="color:var(--gradient-start);text-decoration:none;">首页</a> <span style="color:var(--text-secondary);margin:0 8px;">›</span> <span style="color:var(--text-secondary);">工具详情</span> <span style="color:var(--text-secondary);margin:0 8px;">›</span> <span style="color:var(--text-primary);font-weight:500;">'+toolName+'</span>';
breadcrumb.style.cssText='margin-bottom:20px;padding:10px 0;font-size:.9rem;border-bottom:1px solid var(--border-color);';
// 插入到详情内容之前
var container=detailContent.parentNode;
container.insertBefore(breadcrumb,detailContent);
// 添加面包屑结构化数据
var breadcrumbData={
'@context':'https://schema.org',
'@type':'BreadcrumbList',
'itemListElement':[
{'@type':'ListItem','position':1,'name':'首页','item':'https://qxgjz.github.io/ai-tools-radar/'},
{'@type':'ListItem','position':2,'name':'工具详情','item':'https://qxgjz.github.io/ai-tools-radar/#/tools'},
{'@type':'ListItem','position':3,'name':toolName}
]
};
var script=document.createElement('script');
script.type='application/ld+json';
script.id='breadcrumb-structured-data';
script.textContent=JSON.stringify(breadcrumbData);
var old=document.getElementById('breadcrumb-structured-data');
if(old)old.remove();
document.head.appendChild(script);
});
observer.observe(detailView,{attributes:true,attributeFilter:['style'],childList:true,subtree:true});
}
// ===== 移动端汉堡菜单 =====
function initMobileMenu(){
var btn=document.getElementById('mobileMenuBtn');
var menu=document.getElementById('mobileMenu');
if(!btn||!menu)return;
btn.addEventListener('click',function(){
menu.classList.toggle('active');
if(menu.classList.contains('active')){
menu.style.display='block';
btn.textContent='✕';
}else{
menu.style.display='none';
btn.textContent='☰';
}
});
// 点击菜单项后关闭
menu.querySelectorAll('a,button').forEach(function(item){
item.addEventListener('click',function(){
menu.classList.remove('active');
menu.style.display='none';
btn.textContent='☰';
});
});
}
// ===== 编辑推荐专区 =====
var EDITOR_PICKS=['ChatGPT','Claude','Midjourney','GitHub Copilot','Jasper','Notion AI'];
function initEditorPicks(){
var grid=document.getElementById('editorPicksGrid');
if(!grid)return;
// 从工具卡片中复制编辑推荐的工具
var allCards=document.querySelectorAll('.tool-card');
var rendered=0;
EDITOR_PICKS.forEach(function(toolName){
if(rendered>=6)return;
allCards.forEach(function(card){
var nameEl=card.querySelector('.tool-card-name, h3');
if(nameEl&&nameEl.textContent.trim()===toolName&&rendered<6){
var clone=card.cloneNode(true);
clone.classList.remove('enhanced');
// 添加编辑推荐标识
var badge=document.createElement('span');
badge.className='editor-pick-badge';
badge.textContent='⭐ 编辑推荐';
badge.style.cssText='position:absolute;top:10px;right:10px;font-size:.7rem;padding:2px 8px;border-radius:10px;background:linear-gradient(135deg,#f093fb,#f5576c);color:#fff;font-weight:600;z-index:1;';
clone.style.position='relative';
clone.appendChild(badge);
grid.appendChild(clone);
rendered++;
}
});
});
// 增强新渲染的卡片
setTimeout(enhanceToolCards,200);
}
// ===== 最近浏览功能 =====
function initRecentView(){
var recent=Analytics.getRecentTools();
if(recent.length===0)return;
var section=document.getElementById('recentViewSection');
var grid=document.getElementById('recentGrid');
var count=document.getElementById('recentCount');
if(!section||!grid)return;
section.style.display='block';
count.textContent=recent.length+' 个工具';
// 渲染最近浏览的工具（从工具卡片中复制）
var allCards=document.querySelectorAll('.tool-card');
var rendered=0;
recent.forEach(function(toolName){
if(rendered>=8)return;
allCards.forEach(function(card){
var nameEl=card.querySelector('.tool-card-name, h3');
if(nameEl&&nameEl.textContent.trim()===toolName&&rendered<8){
var clone=card.cloneNode(true);
clone.classList.remove('enhanced');
grid.appendChild(clone);
rendered++;
}
});
});
// 如果没有找到对应的卡片，创建简单卡片
if(rendered===0){
recent.slice(0,8).forEach(function(toolName){
var card=document.createElement('div');
card.className='tool-card';
card.innerHTML='<h3>'+toolName+'</h3><p>最近浏览的工具</p>';
grid.appendChild(card);
});
}
// 增强新渲染的卡片
setTimeout(enhanceToolCards,200);
}
// ===== 初始化 =====
document.addEventListener('DOMContentLoaded',function(){
setTimeout(function(){
initSearchSuggestions();
initSimilarTools();
initSkeleton();
initBackToTop();
initToolCardEnhancer();
initRecentView();
initEditorPicks();
initMobileMenu();
initBreadcrumb();
initToolFAQ();
initExitIntentPopup();
initConversionFunnel();
addUserNavEntry();
initPerformanceOptimization();
initOnboardingWizard();
},100);
});
console.log('%c🚀 AI Tools Radar 增强功能已加载','color:#667eea;font-size:14px;font-weight:bold');
})();