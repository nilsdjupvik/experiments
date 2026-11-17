/* ================= the film as a function of time ================= */
function filmW(t){const w={},comb=win(t,76.2,84,.5);
  w.blueprint=eOut(seg(t,10.3,11));
  w.bridgeGhost=Math.min(seg(t,12.2,13.6),1-seg(t,21.5,26));w.bridge=seg(t,14.5,27.5);
  w.g1=seg(t,29.5,36);w.g2=seg(t,46,52.5);
  w.fab=seg(t,32.3,34.8);w.spec=win(t,34.2,41.5,.6);w.tower=seg(t,35.5,46);
  w.crane=seg(t,50.8,53.4)*(1-seg(t,80,83));w.craneAng=.53+.5*Math.sin(.9*(Math.min(t,54)-51));
  w.b2Ghost=seg(t,50,52.5)*(1-seg(t,76,78.5));w.b2=0;
  w.jam=seg(t,57.8,58.8)*(1-seg(t,89.5,91))*(1-.8*win(t,67.2,70,.4))*(1-.8*comb);
  w.scan=seg(t,60.6,63.8);w.talk=win(t,60.2,64.2,.4);w.talkers=win(t,58,66,.5);w.pause=win(t,54,57.2,.3);
  w.roundGhost=seg(t,67,67.6)*(1-seg(t,86.5,88.5));w.tramGhost=seg(t,70,70.6)*(1-seg(t,93,96));w.footGhost=seg(t,73,73.6)*(1-seg(t,86,88));
  w.fB2=win(t,64,67,.4);w.fRb=Math.max(win(t,67,70,.4),comb);w.fTram=Math.max(win(t,70,73,.4),comb);w.fFoot=Math.max(win(t,73,76,.4),comb);
  w.round=seg(t,86,90);w.signals=seg(t,45.5,47)*(1-w.round);w.foot=seg(t,85.6,89.6);w.shelter=seg(t,90.4,94);w.rails=seg(t,93,97);
  w.tram=eOut(seg(t,98.3,98.9));w.tramT=t-99.7;
  w.staff=eOut(seg(t,77.5,78.5));w.collab=win(t,75,81.5,.5);w.designGhost=win(t,82.5,88,.6);w.orb=eOut(seg(t,82.5,83.3));
  w.drones=seg(t,92.5,93.5);w.arcs=win(t,101.4,105.4,.7);w.hand=seg(t,108.6,111.4);
  w.outerGhost=seg(t,112,117);w.outerSolid=seg(t,114.5,122);return w}
function filmScenario(t){const D=t<27.3?0:t<29?.15:t<45?lerp(.15,.5,seg(t,29,44)):lerp(.5,1,seg(t,45,50));
  scenario({D,bridge:t>=27.3,b2:false,junction:t>=90,tram:t>=98.4,foot:t>=89.6,jam:t>=46.5?1:0});SIM.cross=t>105.4&&t<108.3}
const EXPLORE_W=()=>({blueprint:1,bridgeGhost:0,bridge:1,g1:1,g2:1,fab:1,spec:0,tower:1,crane:0,craneAng:.5,b2Ghost:0,b2:0,jam:0,scan:0,talk:0,talkers:0,pause:0,
  signals:0,roundGhost:0,tramGhost:0,footGhost:0,fB2:0,fRb:0,fTram:0,fFoot:0,round:1,foot:1,shelter:1,rails:1,tram:1,tramT:0,staff:1,collab:0,designGhost:1,orb:1,drones:1,arcs:0,hand:1,outerGhost:1,outerSolid:1});

const NAMES=['A problem worth solving','The familiar way of building','A new level of abstraction','The unexpected question','Exploring better possibilities','Many ways to contribute','A living system','Beyond the original city'];
/* The film stops on these beats so each line can be read: [film time, line]. */
const BEATS=[[12.9,'Every solution begins with a problem.'],[26.6,'Building solutions, piece by piece.'],[45.9,'What if we could build at different levels?'],
  [59.6,'But is another bridge the answer?'],[78.4,'From implementing answers to exploring possibilities.'],[102.7,'Different skills. Different tools. Shared purpose.'],
  [108.2,'The goal was never just to build.'],[115,'AI changes how we build.'],[121,'More importantly, it changes what we can imagine solving.']];
/* shorter stops on each set, while its label is up */
const STOPS_AT=[52.4,65.6,68.6,71.6,74.6,82.5,86.1,89.6,93.1,96.6,100.1];
const HOLDS=BEATS.map(([at,cap])=>({at,cap,d:2.4+cap.split(' ').length*.36,amb:.06})).concat(STOPS_AT.map(at=>({at,d:2.8,amb:.45}))).sort((x,y)=>x.at-y.at);
/* wall-clock time <-> film time. Holds are exact, so the film always lasts WDUR seconds and stays in step with the soundtrack. */
{let acc=0;for(const h of HOLDS){h.w0=h.at+acc;acc+=h.d}}
const WDUR=DUR+HOLDS.reduce((a,h)=>a+h.d,0);
function tOf(w){let acc=0;for(const h of HOLDS){if(w<h.w0)return w-acc;if(w<h.w0+h.d){G.amb=h.amb;return h.at}acc+=h.d}return Math.min(DUR,w-acc)}
const wOf=t=>t+HOLDS.reduce((a,h)=>a+(h.at<t?h.d:0),0);
const CHIPS=[[49.4,55.2,'A request arrives: “Build another bridge.”',''],
  [64.2,66.9,'A second bridge','Traffic crosses, but the junction stays blocked. Illustrative simulation.'],
  [67.2,69.9,'A redesigned junction','The queue clears at its source. Illustrative simulation.'],
  [70.2,72.9,'A tram line','Fewer cars need the junction at all. Illustrative simulation.'],
  [73.2,75.9,'A footbridge and paths','Short trips move off the road. Illustrative simulation.'],
  [80.4,83.6,'Refining an intricate mechanism',''],[83.9,87.1,'Designing a new component with AI',''],[87.4,90.6,'Connecting prefabricated assemblies',''],
  [90.9,94.1,'Building a tool for repeated work',''],[94.4,97.6,'Coordinating delegated activities',''],[97.9,101,'Evaluating outcomes together','']];
const NARR=['A town split by a river. Getting across means taking the long way round.','Developers have always built with bricks, tools and ready-made assemblies.',
  'With AI assistance, the same builder can work with bricks, modules or whole systems.','A request arrives. Before building it, the developer looks at the whole network.',
  'When experiments are cheap, several answers can be compared before one is chosen.','Specialists, designers, engineers and domain experts contribute side by side.',
  'Success is the journey getting easier. Detailed craft still matters.','Projects that were once impractical start to look possible.'];

/* ================= HUD ================= */
const G={mode:'film',t:0,playing:false,idle:true,tab:null,w:0,rate:1,amb:1};
const elDim=$('#dim'),elCap=$('#cap'),elChip=$('#chip'),elBar=$('#bar'),elName=$('#sname'),elClock=$('#clock'),elNarr=$('#narr');
const barFill=[];
SCENES.forEach((s,i)=>{const li=document.createElement('li'),b=document.createElement('button'),f=document.createElement('i');
  li.style.flex=((SCENES[i+1]||DUR)-s)+' 1 0';b.setAttribute('aria-label','Scene '+(i+1)+': '+NAMES[i]);b.appendChild(f);li.appendChild(b);elBar.appendChild(li);barFill.push(f);
  b.addEventListener('click',()=>seek(s+.01))});
let capTxt='',chipTxt='',sceneI=-1;
function drawHud(){const t=G.t;
  let ct='',ca=0;for(const h of HOLDS){if(!h.cap)continue;const a=Math.min(seg(t,h.at-.9,h.at-.15),1-seg(t,h.at+.45,h.at+1.15));if(a>ca){ca=a;ct=h.cap}}
  if(G.mode!=='film'||G.idle){ca=0}
  if(ct&&ct!==capTxt){capTxt=ct;elCap.textContent=ct}elCap.style.opacity=ca.toFixed(2);
  elCap.style.transform='translate(-50%,-50%) scale('+(.95+.05*ca).toFixed(3)+')';elDim.style.opacity=(ca*.6).toFixed(2);
  let ht='',hs='',ha=0;if(G.mode==='film'&&!G.idle)for(const c of CHIPS)if(t>=c[0]&&t<c[1]){ht=c[2];hs=c[3];ha=win(t,c[0],c[1],.35)}
  if(ht&&ht!==chipTxt){chipTxt=ht;elChip.textContent=ht;if(hs){const s=document.createElement('small');s.textContent=hs;elChip.appendChild(s)}}
  elChip.style.opacity=ha.toFixed(2);
  let si=0;for(let i=0;i<SCENES.length;i++)if(t>=SCENES[i])si=i;
  if(si!==sceneI){sceneI=si;elName.textContent=NAMES[si];elNarr.textContent=NARR[si]}
  barFill.forEach((f,i)=>f.style.width=(100*seg(t,SCENES[i],SCENES[i+1]||DUR)).toFixed(1)+'%');
}
const ICON={pause:'<svg viewBox="0 0 20 20"><path d="M5 3h4v14H5zM11 3h4v14h-4z"/></svg>',play:'<svg viewBox="0 0 20 20"><path d="M5 3l12 7-12 7z"/></svg>'};
const snd=$('#snd');
function setPlaying(p){G.playing=p;if(p&&G.mode==='film'&&!G.idle){if(Math.abs(snd.currentTime-G.w)>.3)try{snd.currentTime=G.w}catch(e){}const q=snd.play();q&&q.catch(()=>{})}else snd.pause();const b=$('#bPlay');b.innerHTML=p?ICON.pause:ICON.play;b.setAttribute('aria-label',p?'Pause':'Play')}
function seek(t){G.t=clamp(t,0,DUR-.01);G.w=wOf(G.t);G.rate=1;try{snd.currentTime=G.w}catch(e){}W=filmW(G.t);filmScenario(G.t);simReset();capTxt=chipTxt=''}
function startFilm(){G.mode='film';G.idle=false;G.t=0;X.exT=X.exB=0;document.body.className='film';seek(0);setPlaying(true);camera.clearViewOffset()}
$('#bSnd').addEventListener('click',e=>{snd.muted=!snd.muted;e.currentTarget.setAttribute('aria-pressed',!snd.muted)});
document.addEventListener('visibilitychange',()=>{if(document.hidden)snd.pause();else if(G.playing&&G.mode==='film'&&!G.idle){const q=snd.play();q&&q.catch(()=>{})}});
$('#bPlay').addEventListener('click',()=>setPlaying(!G.playing));
$('#bStart').addEventListener('click',startFilm);$('#again').addEventListener('click',startFilm);
$('#bSkip').addEventListener('click',()=>enterExplore(true));$('#bStartX').addEventListener('click',()=>enterExplore(true));
addEventListener('keydown',e=>{if(G.mode!=='film'||G.idle||e.target.closest('button'))return;
  if(e.key===' '){e.preventDefault();setPlaying(!G.playing)}else if(e.key==='ArrowRight')seek(G.t+5);else if(e.key==='ArrowLeft')seek(G.t-5)});

/* ================= explore: orbit camera ================= */
const O={tx:0,ty:0,tz:0,r:170,th:-.35,ph:.95,g:{tx:0,ty:0,tz:0,r:170,th:-.35,ph:.95},last:0};
const OK=['tx','ty','tz','r','th','ph'];
function orbitGo(a){OK.forEach((k,i)=>O.g[k]=a[i]);while(O.g.th-O.th>PI)O.g.th-=2*PI;while(O.th-O.g.th>PI)O.g.th+=2*PI}
function orbitClamp(){const g=O.g;g.ph=clamp(g.ph,.12,1.5);g.r=clamp(g.r,2.2,330);g.tx=clamp(g.tx,-220,220);g.tz=clamp(g.tz,-220,220);g.ty=clamp(g.ty,0,34)}
const ptrs=new Map();let pinch=0,pmx=0,pmy=0;
canvas.addEventListener('pointerdown',e=>{if(G.mode!=='explore')return;canvas.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,[e.clientX,e.clientY,e.button||e.shiftKey?1:0]);
  if(ptrs.size===2){const[a,b]=[...ptrs.values()];pinch=Math.hypot(a[0]-b[0],a[1]-b[1]);pmx=(a[0]+b[0])/2;pmy=(a[1]+b[1])/2}
  document.body.classList.remove('fresh')});
canvas.addEventListener('pointermove',e=>{const p=ptrs.get(e.pointerId);if(!p||G.mode!=='explore')return;const dx=e.clientX-p[0],dy=e.clientY-p[1];p[0]=e.clientX;p[1]=e.clientY;O.last=clk;const g=O.g;
  const pan=(mx,my)=>{const s=O.r*.0016;g.tx-=(Math.cos(O.th)*mx+Math.sin(O.th)*my)*s;g.tz-=(-Math.sin(O.th)*mx+Math.cos(O.th)*my)*s};
  if(ptrs.size===1){if(p[2])pan(dx,dy);else{g.th-=dx*.006;g.ph-=dy*.005}}
  else if(ptrs.size===2){const[a,b]=[...ptrs.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]),mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
    if(pinch>0)g.r*=pinch/d;pinch=d;pan(mx-pmx,my-pmy);pmx=mx;pmy=my}
  orbitClamp()});
const pup=e=>{ptrs.delete(e.pointerId);pinch=0};canvas.addEventListener('pointerup',pup);canvas.addEventListener('pointercancel',pup);
canvas.addEventListener('wheel',e=>{if(G.mode!=='explore')return;e.preventDefault();O.g.r*=Math.exp(e.deltaY*.0012);O.last=clk;orbitClamp();document.body.classList.remove('fresh')},{passive:false});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
const wide=matchMedia('(min-width:860px) and (min-height:520px)');let voff=0;
function orbitCam(dt){const k=1-Math.exp(-dt*3.4);for(const key of OK)O[key]+=(O.g[key]-O[key])*k;
  if(!G.tab&&clk-O.last>4&&!ptrs.size)O.g.th+=dt*.025;
  const sp=Math.sin(O.ph);camera.position.set(O.tx+O.r*sp*Math.sin(O.th),O.ty+O.r*Math.cos(O.ph),O.tz+O.r*sp*Math.cos(O.th));
  _p.set(O.tx,O.ty,O.tz);camera.lookAt(_p);
  const sh=$('#sheet').getBoundingClientRect(),w=innerWidth,h=innerHeight;voff+=(1-voff)*k;
  if(wide.matches)camera.setViewOffset(w,h,-(sh.width+16)/2*voff,0,w,h);else camera.setViewOffset(w,h,0,sh.height/2*voff,w,h);
  aimShadow(O.tx,O.ty,O.tz,O.r)}

/* ================= explore: panels ================= */
const ALT={b2:false,junction:true,tram:true,foot:true};
let EW=EXPLORE_W(),sysKey='tower',lvl=0,role=-1,GEN={len:8,style:1,rail:true},genG=null,genP=1;
const CITY=[0,0,0,165,-.35,.95];
const SYS={tower:{name:'Works tower',lv:[
    {n:'City',c:CITY,t:'The whole city: many systems, built by many people, serving the journeys that cross it.'},
    {n:'System',c:[-13,11,-12,54,.5,1.15],t:'One system: the works tower, made of four stacked modules.'},
    {n:'Component',c:[-13,16,-12,66,.75,1.2],ex:1,t:'Pulled apart, each module is a reusable unit with one job. Swap one without rebuilding the rest.'},
    {n:'Mechanism',c:[-13,3.5,-10.4,10,.12,1.38],t:'Inside the first module: a gear train. Detailed construction still lives here, and it still matters.'},
    {n:'Brick',c:[-13.9,3.25,-10.5,2.7,.5,1.25],t:'A single part. Every level above is made of these.'}]},
  bridge:{name:'Bridge',lv:[
    {n:'City',c:CITY,t:'The whole city: many systems, built by many people, serving the journeys that cross it.'},
    {n:'System',c:[0,4,0,46,.45,1.12],t:'One system: the bridge that first joined the two neighbourhoods.'},
    {n:'Component',c:[0,7,0,54,.5,1.1],ex:1,t:'Deck segments, towers and cables are prefabricated assemblies, built on the pad and lifted into place.'},
    {n:'Mechanism',c:[-8.4,3.2,1,12,.9,1.1],ex:1,t:'One deck segment: plates, road tiles, kerbs and a railing.'},
    {n:'Brick',c:[-9.9,3.5,3.8,2.7,.6,1.2],ex:1,t:'A single railing post, placed by hand.'}]}};
const ROLES=[
  {n:'Specialist',h:'Refining an intricate mechanism',c:[-13,3,-10,16,.35,1.25],tools:'Individual bricks, gears and a close eye.',ai:'Asks an assistant to check fits and suggest variations, then decides what ships.',resp:'The mechanism works, and keeps working.',links:'The tool builder, who packages it as a module, and the domain expert, who says what it must do.'},
  {n:'Designer',h:'Designing a new component with AI',c:[-28.8,2.6,22.6,13,.3,1.25],tools:'Specs, sketches and the plan board.',ai:'Describes a component and reviews generated candidates. Most are discarded.',resp:'The component suits the people who will use it.',links:'The tool builder, who turns the design into parts, and the domain expert.'},
  {n:'Engineer',h:'Connecting prefabricated assemblies',c:[-3,2,27,25,-.45,1.1],tools:'Ready-made assemblies and the joints between them.',ai:'Generates the joining pieces, then tests each joint.',resp:'The assembled whole holds together.',links:'The tool builder, who supplies the assemblies, and the orchestrator.'},
  {n:'Tool builder',h:'Building a tool for repeated work',c:[PAD[0],3,PAD[2],27,0,1.02],tools:'The fabricator, a generator for bridge components.',ai:'Wraps AI assistance in a repeatable recipe with checks built in.',resp:'Repeated work gets faster and stays consistent for everyone.',links:'The specialist, the designer and the engineer all feed it and draw from it.'},
  {n:'Orchestrator',h:'Coordinating delegated activities',c:[-10.5,2.5,7,17,-1.6,1.0],tools:'A queue of delegated tasks and a view of the whole site.',ai:'Several helpers work in parallel. The orchestrator sets goals, reviews results and settles conflicts.',resp:'Delegated work adds up to the intended outcome.',links:'The engineer, whose assemblies the helpers carry, and the domain expert.'},
  {n:'Domain expert',h:'Evaluating outcomes together',c:[19.5,2,23,21,-.5,1.1],tools:'Observation, feedback from citizens and before-and-after measurements.',ai:'Analysis tools summarise the traffic. People judge whether the journey is better.',resp:'The result solves the real problem.',links:'The designer, the specialist and the orchestrator, alongside an engineer.'}];
const PINS=ROLES.map((r,i)=>{const s=STN[i],l=label(r.n,s[0],s[1]+1.2,s[2],true);l.el.addEventListener('click',()=>{role=i;render()});return l});
const TABS=[['abs','Abstraction'],['roles','Working'],['alts','Alternatives'],['tools','Tools']];
const elTabs=$('#tabs'),elBody=$('#body');
TABS.forEach(([id,n])=>{const b=document.createElement('button');b.textContent=n;b.dataset.tab=id;b.setAttribute('role','tab');elTabs.appendChild(b);
  b.addEventListener('click',()=>{G.tab=id;if(id==='abs')lvl=Math.max(lvl,1);if(id==='roles'&&role<0)role=3;render()})});
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const NOTE='<p class="note">An authored demonstration. ';
function render(){const t=G.tab;[...elTabs.children].forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===t));let h='';
  if(!t){h='<h2>Explore the city</h2><p>The world from the film is still running. Pick a way in above, or drag to look around.</p>';orbitGo(CITY)}
  else if(t==='abs'){const s=SYS[sysKey],L=s.lv[lvl];
    h='<div class="opts">'+Object.keys(SYS).map(k=>'<button class="opt" data-sys="'+k+'" aria-pressed="'+(k===sysKey)+'">'+SYS[k].name+'</button>').join('')+'</div>'+
      '<div class="steps">'+s.lv.map((l,i)=>'<button class="opt" data-lvl="'+i+'" aria-pressed="'+(i===lvl)+'">'+l.n+'</button>').join('')+'</div>'+
      '<h2>'+L.n+'</h2><p class="say">'+esc(L.t)+'</p>';orbitGo(L.c)}
  else if(t==='roles'){const r=ROLES[role];
    h='<div class="opts scroll">'+ROLES.map((x,i)=>'<button class="opt" data-role="'+i+'" aria-pressed="'+(i===role)+'">'+x.n+'</button>').join('')+'</div>'+
      '<h2>'+esc(r.h)+'</h2><dl><dt>Tools</dt><dd>'+esc(r.tools)+'</dd><dt>AI assistance</dt><dd>'+esc(r.ai)+'</dd><dt>Responsible for</dt><dd>'+esc(r.resp)+'</dd><dt>Works with</dt><dd>'+esc(r.links)+'</dd></dl>'+
      '<p class="note" style="border-color:var(--line)">These roles work at the same time. None ranks above another.</p>';orbitGo(r.c)}
  else if(t==='alts'){const sw=(k,n,d)=>'<button class="sw" data-alt="'+k+'" aria-pressed="'+ALT[k]+'"><i></i><span>'+n+'<small>'+d+'</small></span></button>';
    h='<h2>The transport problem</h2>'+
      '<div class="meter"><span>Traffic flow</span><b id="mFlow"></b><div class="track"><i id="mFlowB"></i></div><span>Cars queuing at the junction</span><b id="mQ"></b><span>Bricks used</span><b id="mB"></b></div>'+
      sw('b2','A second bridge','The original request')+sw('junction','A redesigned junction','A roundabout at the market')+sw('tram','A tram line','Public transport across the river')+sw('foot','A footbridge and paths','Short trips on foot')+
      '<p style="margin-top:10px">Switch options on and off and give the traffic a few seconds to settle. The film chose three small changes over one big one.</p>'+
      NOTE+'The traffic is a small simulation written for this film, not a live AI analysis.</p>';orbitGo([10,0,4,104,-.25,.82])}
  else{h='<h2>The bridge-component generator</h2><p>A tool the developer built so that a repeated job takes seconds and comes out consistent. Set a specification, then generate.</p>'+
      '<div class="field"><label for="gLen">Length</label><input id="gLen" type="range" min="4" max="12" step="2" value="'+GEN.len+'"><b id="gLenV">'+GEN.len+' studs</b></div>'+
      '<div class="opts">'+['Flat','Arch','Truss'].map((n,i)=>'<button class="opt" data-style="'+i+'" aria-pressed="'+(i===GEN.style)+'">'+n+'</button>').join('')+
      '<button class="opt" data-rail="1" aria-pressed="'+GEN.rail+'">Railing</button></div>'+
      '<button class="tile go" data-gen="1">Generate component</button><p id="gOut" style="margin-top:10px"></p>'+
      NOTE+'The generator is a procedural recipe, not a live AI model. A real one would also need review: generated parts are not automatically right.</p>';orbitGo([PAD[0]+1,2.5,PAD[2],25,.3,.8])}
  elBody.innerHTML=h;elBody.scrollTop=0;
  PINS.forEach((p,i)=>p.el.classList.toggle('on',i===role&&t==='roles'));if(t==='tools')genInfo()}
function genInfo(){const o=$('#gOut');if(o)o.textContent=genG?genG.B.length+' bricks, assembled on the pad. Change the specification and generate again.':'Nothing generated yet.'}
elBody.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.sys){sysKey=d.sys;lvl=Math.max(1,lvl)}else if(d.lvl)lvl=+d.lvl;else if(d.role)role=+d.role;
  else if(d.alt){ALT[d.alt]=!ALT[d.alt];exploreScenario()}
  else if(d.style)GEN.style=+d.style;else if(d.rail)GEN.rail=!GEN.rail;else if(d.gen){generate();return}else return;
  render()});
elBody.addEventListener('input',e=>{if(e.target.id==='gLen'){GEN.len=+e.target.value;$('#gLenV').textContent=GEN.len+' studs'}});
function generate(){if(genG)genG.kill();const g=genG=new BG({win:.14,drop:6}),n=GEN.len,h=n/2,st=GEN.style,c=[K.red,K.azure,K.orange][st],dy=st===1?3.2:st===2?.4:1.2;
  const x0=PAD[0]+1,z0=PAD[2]-1,y0=.3;
  if(st===0)for(const sx of[-1,1])for(const sz of[-1,1])g.add(x0+sx*(h-.5),y0,z0+sz*2,1,1.2,1,K.lgray,0,0);
  if(st===1)for(let i=0;i<n;i++){const x=-h+.5+i,a=Math.abs(x)/h,ya=dy*(1-a*a)*.9,hh=dy-ya;for(const sz of[-1,1])if(hh>.25)g.add(x0+x,y0+ya,z0+sz*2.5,1,hh,1,c,0,ya*.3)}
  for(let i=0;i<h;i++){const x=x0-h+1+2*i;g.add(x,y0+dy,z0,2,.4,6,K.lgray,1,2+i*.1);g.add(x,y0+dy+.4,z0,2,.2,4,K.road,0,3+i*.1)}
  if(st===2){for(const sz of[-1,1]){for(let i=0;i<=h;i++){const x=x0-h+2*i+(i===0?.25:i===h?-.25:0);g.add(x,y0+dy+.4,z0+sz*2.6,.5,2.8,.5,c,0,4+i*.1);
        if(i<h)for(let k=0;k<3;k++)g.add(x0-h+2*i+.4+k*.6,y0+dy+.5+(i%2?2-k:k)*.9,z0+sz*2.6,.6,.9,.4,c,0,4.5+i*.1)}
      g.add(x0,y0+dy+3.2,z0+sz*2.6,n,.6,1,c,1,6)}}
  else if(GEN.rail)for(const sz of[-1,1]){for(let i=0;i<=h;i++)g.add(x0-h+2*i+(i===0?.2:i===h?-.2:0),y0+dy+.4,z0+sz*2.75,.3,1,.3,K.white,0,5+i*.1);g.add(x0,y0+dy+1.4,z0+sz*2.75,n,.2,.3,c,0,6)}
  g.done(scene,0);genP=0;genInfo()}
function exploreScenario(){SIM.cross=false;scenario({D:1,bridge:true,b2:ALT.b2,junction:ALT.junction,tram:ALT.tram,foot:ALT.foot,jam:1})}
function enterExplore(snap){G.mode='explore';G.idle=false;G.tab=null;setPlaying(false);document.body.className='explore fresh';
  const d=_p.copy(camera.position).sub(camLook),r=d.length();O.tx=camLook.x;O.ty=camLook.y;O.tz=camLook.z;O.r=r;O.th=Math.atan2(d.x,d.z);O.ph=Math.acos(clamp(d.y/r,-1,1));O.last=clk;voff=0;
  ALT.b2=false;ALT.junction=ALT.tram=ALT.foot=true;exploreScenario();
  if(snap){EW=EXPLORE_W();W=EW;simReset()}else{EW=Object.assign(EXPLORE_W(),W)}
  render()}
function exploreUpdate(dt){const T=EXPLORE_W(),ab=G.tab==='abs',L=ab?SYS[sysKey].lv[lvl]:null;
  T.b2=ALT.b2?1:0;T.round=ALT.junction?1:0;T.signals=1-T.round;T.rails=T.shelter=ALT.tram?1:0;T.foot=ALT.foot?1:0;T.tram=ALT.tram&&EW.rails>.98?1:0;
  T.jam=SIM.queue>5?1:0;T.tramT=clk;
  const RATE={b2:.3,round:.5,rails:.5,shelter:.5,foot:.5,outerSolid:.2,outerGhost:.3};
  for(const k in T){const cur=EW[k]===undefined?T[k]:EW[k];if(k==='tramT'||k==='craneAng'||k==='scan'){EW[k]=T[k];continue}const r=(RATE[k]||1.2)*dt;EW[k]=cur+clamp(T[k]-cur,-r,r)}
  W=EW;
  const tx=ab&&L.ex&&sysKey==='tower'?1:0,bx=ab&&L.ex&&sysKey==='bridge'?1:0,k=1-Math.exp(-dt*4);X.exT+=(tx-X.exT)*k;X.exB+=(bx-X.exB)*k;
  fArc.forEach((f,i)=>{const on=G.tab==='roles'&&(PAIRS[i][0]===role||PAIRS[i][1]===role)?1:0;f.a+=(on-f.a)*k});
  PINS.forEach(p=>p.a+=((G.tab==='roles'?1:0)-p.a)*k);
  if(genG){genP=Math.min(1,genP+dt/2.6);genG.set(genP);X.gen=genP<1?1:0}
  if(G.tab==='alts'){const f=$('#mFlow');if(f){const v=Math.round(clamp(SIM.flow)*100);f.textContent=v+'%';const b=$('#mFlowB');b.style.width=v+'%';b.style.background=v<55?'var(--signal)':'var(--assist)';
      $('#mQ').textContent=Math.round(SIM.queue);$('#mB').textContent=(ALT.b2?b2.B.length:0)+(ALT.junction?rb.B.length:0)+(ALT.tram?rails.B.length+SHEL.length*SHEL[0].B.length:0)+(ALT.foot?FOOT.reduce((a,g)=>a+g.B.length,0)+footPath.B.length:0)}}}

/* ================= main loop ================= */
const camPos=new T3.Vector3(),camLook=new T3.Vector3();
let lastT=0,envT=0;
function frame(now){requestAnimationFrame(frame);const dt=clamp((now-lastT)/1000||0,0,.05);lastT=now;if(document.hidden)return;
  const film=G.mode==='film',adv=!film||G.playing||G.idle;
  if(film){if(G.playing){G.w+=dt;if(!snd.paused&&!snd.ended&&Math.abs(snd.currentTime-G.w)>.3)G.w=snd.currentTime;
      if(G.w>=WDUR){G.t=DUR;enterExplore(false)}}
    if(G.mode==='film'&&!G.idle){const p0=G.t;G.t+=(tOf(G.w)-G.t)*Math.min(1,dt*7);if(dt>0)G.rate=clamp((G.t-p0)/dt)}
    if(G.mode==='film'){W=filmW(G.t);filmScenario(G.t)}}
  if(G.mode==='explore')exploreUpdate(dt);
  if(adv){const a=film&&!G.idle?lerp(G.amb,1,G.rate):1;clk+=dt*a;simStep(dt*a)}
  applyWorld(W,dt);
  if(G.mode==='film'){scriptFigs(G.t);fArc.forEach(f=>f.a=W.arcs)}
  else{hero.x=15;hero.z=5.8;hero.y=.4;hero.sc=1;hero.walk=0;dev.x=-19.9;dev.z=17;dev.y=0;dev.walk=0;dev.sc=1}
  drawFigs(dt);drawCars(dt);drawFlows();
  if(G.mode==='film'){camAt(G.t+(G.idle?Math.sin(clk*.25)*.35+.4:0),camPos,camLook);
    camPos.sub(camLook).multiplyScalar(DOLLY).add(camLook);if(camPos.y<1.8)camPos.y=1.8;camera.position.copy(camPos);camera.lookAt(camLook);
    aimShadow(camLook.x,camLook.y,camLook.z,camPos.distanceTo(camLook));envT=G.t;setEnv(envT)}
  else{orbitCam(dt);envT+=(105-envT)*Math.min(1,dt*.8);setEnv(envT)}
  sky.position.copy(camera.position);
  drawLabels();drawHud();renderer.render(scene,camera)}
addEventListener('resize',fitCamera);fitCamera();
W=filmW(0);filmScenario(0);simReset();
if(location.hash==='#explore'){camAt(DUR,camPos,camLook);camera.position.copy(camPos);enterExplore(true)}
requestAnimationFrame(frame);
