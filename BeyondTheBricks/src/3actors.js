/* ================= state ================= */
let W={},clk=0;const X={exT:0,exB:0,gen:0};

/* ================= routes ================= */
function mkRoute(pts,rad){const P=[],n=pts.length;
  for(let i=0;i<n;i++){const b=pts[i];if(i===0||i===n-1||!rad){P.push(b);continue}
    const a=pts[i-1],c=pts[i+1],l1=Math.hypot(b[0]-a[0],b[1]-a[1]),l2=Math.hypot(c[0]-b[0],c[1]-b[1]);
    const p1=[b[0]-(b[0]-a[0])/l1*rad,b[1]-(b[1]-a[1])/l1*rad],p2=[b[0]+(c[0]-b[0])/l2*rad,b[1]+(c[1]-b[1])/l2*rad];
    for(let k=0;k<=6;k++){const u=k/6,v=1-u;P.push([v*v*p1[0]+2*v*u*b[0]+u*u*p2[0],v*v*p1[1]+2*v*u*b[1]+u*u*p2[1]])}}
  const cum=[0];for(let i=1;i<P.length;i++)cum.push(cum[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));
  const L=cum[cum.length-1],st=.5,D=[];let j=0;
  for(let s=0;s<L;s+=st){while(j<P.length-2&&cum[j+1]<s)j++;const u=(s-cum[j])/((cum[j+1]-cum[j])||1);D.push([lerp(P[j][0],P[j+1][0],u),lerp(P[j][1],P[j+1][1],u)])}
  D.push(P[P.length-1]);
  return{D,L,st,at(u,o){u=clamp(u,0,L-.01);const f=u/st,i=Math.min(f|0,D.length-2),k=Math.min(1,f-i),a=D[i],b=D[i+1];
    o.x=lerp(a[0],b[0],k);o.z=lerp(a[1],b[1],k);const tx=b[0]-a[0],tz=b[1]-a[1],l=Math.hypot(tx,tz)||1;o.tx=tx/l;o.tz=tz/l}}}
const _o={x:0,z:0,tx:0,tz:0},_a={x:0,z:0},_b={x:0,z:0};
function lanePose(r,s,lane,out){const L=r.L;let u=s,dir=1;if(s>=L){u=2*L-s;dir=-1}
  r.at(u,_o);let lat=lane;
  if(r.jS!==undefined&&W.round>0){const dd=u-r.jS,RR=4.2;if(Math.abs(dd)<RR)lat=lerp(lane,Math.max(lane,Math.sqrt(RR*RR-dd*dd)),W.round)}
  out.x=_o.x-_o.tz*dir*lat;out.z=_o.z+_o.tx*dir*lat}

/* ================= traffic: a small car-following model ================= */
const SIM={v0:7,jam:0,clk:0,flow:1,queue:0,R:[]};
const CARCOL=[K.red,K.blue,K.yellow,K.white,K.orange,K.azure,K.lime,K.coral,K.black,K.sand];
{const R=rng(3);const add=(pts,rad,max,j)=>{const r=mkRoute(pts,rad);r.n=0;r.cars=[];
    if(j){let bd=1e9;r.D.forEach((p,i)=>{const d=Math.hypot(p[0]-JX,p[1]-JZ);if(d<bd){bd=d;r.jS=i*r.st}})}
    for(let i=0;i<max;i++)r.cars.push({s:0,v:0,on:false,sc:0,ang:0,fresh:true,c:CARCOL[R()*CARCOL.length|0]});SIM.R.push(r)};
  add([[-20,-30],[-20,0],[22,0],[22,34]],3,28,1);add([[8.5,20],[38,20]],0,10,1);SIM.R[1].sig=1;{const r=SIM.R[0];let bd=1e9;r.D.forEach((p,i)=>{const d=Math.hypot(p[0]-14.5,p[1]);if(d<bd){bd=d;r.xS=i*r.st}})}
  add([[-38,-34],[-9,-34]],0,3,0);add([[38,-34],[9,-34]],0,3,0);add([[-38,-34],[38,-34]],0,8,0)}
function simStep(dt){let sv=0,nc=0,q=0;SIM.clk+=dt;const ph=SIM.clk%8;
  for(const r of SIM.R){const L2=2*r.L,act=r.cars.filter(c=>c.on).sort((a,b)=>a.s-b.s),m=act.length;
    if(m<r.n){for(const s0 of[.3,r.L+.3]){let ok=true;for(const c of act){let d=Math.abs(c.s-s0);d=Math.min(d,L2-d);if(d<5){ok=false;break}}
        if(ok){const c=r.cars.find(c=>!c.on);if(c){c.on=true;c.s=s0;c.v=0;c.fresh=true}break}}}
    else if(m>r.n){let best=act[0],bd=1e9;for(const c of act){const d=Math.min(c.s%r.L,r.L-c.s%r.L);if(d<bd){bd=d;best=c}}best.on=false}
    for(let i=0;i<m;i++){const c=act[i];if(!c.on)continue;let tv=SIM.v0;
      if(m>1){const nx=act[(i+1)%m];let d=(nx.s-c.s+L2)%L2;if(d<1e-6&&i===m-1)d=L2;tv=SIM.v0*clamp((d-2.9)/4.5)}
      if(r.jS!==undefined){const u=c.s<r.L?c.s:L2-c.s,ds=c.s<r.L?r.jS-u:u-r.jS,d=Math.abs(ds);
        if(SIM.jam){if(d<4.2)tv=Math.min(tv,5);else if(ds>4.2&&ds<6.8&&!(r.sig?ph>=4&&ph<6.4:ph<2.4))tv=0}else if(d<5.5)tv=Math.min(tv,5.4);
        if(c.v<2&&d<26)q++}
      if(SIM.cross&&r.xS!==undefined&&c.s<r.L){const ds=r.xS-c.s;if(ds>2.3&&ds<5.6)tv=0}
      c.v+=(tv-c.v)*Math.min(1,dt*4);c.s=(c.s+c.v*dt)%L2;sv+=c.v;nc++}}
  if(nc)SIM.flow+=(sv/nc/SIM.v0-SIM.flow)*Math.min(1,dt*1.2);SIM.queue+=(q-SIM.queue)*Math.min(1,dt*2)}
function scenario(o){const r=SIM.R;let n1=o.bridge?Math.round(26*o.D):0;if(o.b2)n1-=3;if(o.tram)n1=Math.round(n1*.6);if(o.foot)n1-=2;
  r[0].n=Math.max(0,n1);let n2=Math.max(3,Math.round(10*o.D));if(o.foot)n2=Math.max(3,Math.round(n2*.5));r[1].n=n2;
  r[2].n=r[3].n=o.b2?0:3;r[4].n=o.b2?8:0;SIM.jam=o.junction?0:o.jam}
function simReset(){for(const r of SIM.R){const L2=2*r.L;r.cars.forEach((c,i)=>{c.on=i<r.n;c.s=i/Math.max(1,r.n)*L2;c.v=SIM.v0*.5;c.sc=c.on?1:0;c.fresh=true})}
  for(let i=0;i<170;i++)simStep(.1)}
const NCAR=SIM.R.reduce((a,r)=>a+r.cars.length,0);
const carGeo=(w,h,d,x,y)=>{const g=new T3.BoxGeometry(w,h,d);g.translate(x,y,0);return g};
const carMat=new T3.MeshStandardMaterial({roughness:.34});
const carBody=new T3.InstancedMesh(carGeo(2.3,.5,1.3,0,.5),carMat,NCAR),carCab=new T3.InstancedMesh(carGeo(1.15,.5,1.12,-.15,1),carMat,NCAR),carBase=new T3.InstancedMesh(carGeo(2,.3,1.44,0,.15),carMat,NCAR);
{let k=0;for(const r of SIM.R)for(const c of r.cars){carBody.setColorAt(k,col(c.c));carCab.setColorAt(k,col(c.c===K.white?K.azure:K.white));carBase.setColorAt(k,col(K.black));k++}
  for(const m of[carBody,carCab,carBase]){m.frustumCulled=false;m.castShadow=true;m.receiveShadow=true;scene.add(m)}}
function drawCars(dt){let k=0;for(const r of SIM.R)for(const c of r.cars){c.sc+=((c.on?1:0)-c.sc)*Math.min(1,dt*8);
    if(c.sc<.01)_m.makeScale(0,0,0);else{lanePose(r,c.s,1.75,_a);lanePose(r,(c.s+.9)%(2*r.L),1.75,_b);const a=Math.atan2(-(_b.z-_a.z),_b.x-_a.x);
      if(c.fresh){c.ang=a;c.fresh=false}else{const d=a-c.ang;c.ang+=Math.atan2(Math.sin(d),Math.cos(d))*Math.min(1,dt*10)}
      _p.set(_a.x,.3,_a.z);_e.set(0,c.ang,0);_q.setFromEuler(_e);_s.setScalar(c.sc);_m.compose(_p,_q,_s)}
    carBody.setMatrixAt(k,_m);carCab.setMatrixAt(k,_m);carBase.setMatrixAt(k,_m);k++}
  carBody.instanceMatrix.needsUpdate=carCab.instanceMatrix.needsUpdate=carBase.instanceMatrix.needsUpdate=true}

/* ================= citizens ================= */
const FIG=[];const FR=rng(21);
function fig(c,hat,x,y,z){const f={x:x||0,y:y||0,z:z||0,sc:1,walk:0,c,hat:hat||0,ph:FR()*6.28};FIG.push(f);return f}
const hero=fig(K.red,K.yellow),dev=fig(K.blue,K.white),collab=[fig(K.lav,0,-.6,.4,-3.4),fig(K.orange,K.black,.9,.4,-3.4)];
const STAFF=[fig(K.lav,K.black,-13,0,-7.6),fig(K.coral,0,-29.6,0,24),fig(K.orange,K.white,-9.8,.2,28.4),null,fig(K.lime,K.dgray,-11,1.2,7.9),fig(K.sand,0,16.6,0,26.2),fig(K.orange,K.white,18.4,0,26.6)];
const TALK=[fig(K.yellow,0,16,.4,15.4),fig(K.azure,K.red,27.6,.4,25.4),fig(K.white,0,26.6,.4,14.6)];
const WALKS=[{p:[[-36,4.6],[-10.6,4.6]],n:4,y:.4,on:()=>1},{p:[[10.6,4.6],[17.4,4.6]],n:2,y:.4,on:()=>1},{p:[[26.8,4.6],[36,4.6]],n:2,y:.4,on:()=>1},
  {p:[[-9.6,-8],[-9.6,-62],[9.6,-62],[9.6,-8]],n:5,y:.2,on:i=>i<2||W.bridge<1},
  {p:[[-15.4,-4.6],[-9,-4.6],[-8,-3.4],[8,-3.4],[9,-4.6],[17.4,-4.6]],n:5,y:.4,on:()=>W.bridge>=1},
  {p:[[-31,27],[15.5,27]],n:5,y:0,on:()=>W.foot>=1},{p:[[-24.4,-30],[-24.4,-6]],n:3,y:.4,on:()=>1}];
const BODYC=[K.red,K.blue,K.green,K.orange,K.white,K.azure,K.lav,K.coral,K.lime,K.sand,K.black];
for(const w of WALKS){w.r=mkRoute(w.p,0);for(let i=0;i<w.n;i++){const f=fig(BODYC[FR()*BODYC.length|0],FR()<.3?BODYC[FR()*BODYC.length|0]:0);f.w=w;f.i=i;f.sc=0;f.walk=1}}
const figBody=new T3.InstancedMesh((()=>{const g=new T3.CylinderGeometry(.25,.42,1,12);g.translate(0,.5,0);return g})(),new T3.MeshStandardMaterial({roughness:.36}),FIG.length);
const figHead=new T3.InstancedMesh((()=>{const g=new T3.SphereGeometry(.31,14,10);g.translate(0,1.27,0);return g})(),figBody.material,FIG.length);
const figHat=new T3.InstancedMesh((()=>{const a=new T3.CylinderGeometry(.27,.33,.24,12);a.translate(0,1.56,0);const b=new T3.CylinderGeometry(.42,.42,.06,12);b.translate(0,1.46,0);return merge([a,b])})(),figBody.material,FIG.length);
FIG.forEach((f,i)=>{figBody.setColorAt(i,col(f.c));figHead.setColorAt(i,col(K.cream));figHat.setColorAt(i,col(f.hat||K.white))});
for(const m of[figBody,figHead,figHat]){m.frustumCulled=false;m.castShadow=true;scene.add(m)}
function drawFigs(dt){FIG.forEach((f,i)=>{
    if(f.w){const r=f.w.r,L2=2*r.L,s=(clk*1.5+f.i/f.w.n*L2)%L2;lanePose(r,s,.4,_a);f.x=_a.x;f.z=_a.z;f.y=f.w.y||footY(f.x);f.sc+=((f.w.on(f.i)?1:0)-f.sc)*Math.min(1,dt*5)}
    const b=f.walk?Math.abs(Math.sin(clk*9+f.ph))*.14:0;
    _p.set(f.x,f.y+b,f.z);_e.set(0,0,f.walk?Math.sin(clk*9+f.ph)*.1:0);_q.setFromEuler(_e);_s.setScalar(f.sc<.01?0:f.sc);_m.compose(_p,_q,_s);
    figBody.setMatrixAt(i,_m);figHead.setMatrixAt(i,_m);if(!f.hat)_m.makeScale(0,0,0);figHat.setMatrixAt(i,_m)});
  figBody.instanceMatrix.needsUpdate=figHead.instanceMatrix.needsUpdate=figHat.instanceMatrix.needsUpdate=true}
function keyPos(Kf,t,o){let i=0;while(i<Kf.length-2&&Kf[i+1][0]<=t)i++;const a=Kf[i],b=Kf[i+1],u=seg(t,a[0],b[0]);
  o.x=lerp(a[1],b[1],u);o.z=lerp(a[2],b[2],u);o.walk=u>0&&u<1&&(a[1]!==b[1]||a[2]!==b[2])?1:0}
const HEROK=[[0,-25,4.6],[5,-9.6,4.6],[7.6,-9.6,4.6],[13.6,-9.6,-10],[16,-9.6,-10],[23,-10.5,3.4],[26.4,-10.5,3.4],[29.2,9.6,3.4],[31,15,5.8],[81,15,5.8]];
const HEROK2=[[81,-27,-5.2],[101.5,-27,-5.2],[102.2,-27,-1.2],[106.6,-27,-1.2],[106.61,14,1.3],[108.4,15,5.8],[200,15,5.8]];
const DEVK=[[0,-26.5,13],[9.2,-26.5,13],[10.1,-24.3,18.6],[11.2,-28.4,24],[14,-28.4,24],[15.6,-19.9,17],[49.5,-19.9,17],[52.5,-15.5,-24.5],[60,-15.5,-24.5],[63.5,-9.6,-8],[64.3,-9,-4.6],[64.6,-8,-3.4],[66,-2,-3.4],[80.5,-2,-3.4],[87,-19.9,17],[108,-19.9,17],[109.6,-17,21.8],[200,-17,21.8]];
function scriptFigs(t){keyPos(t<81?HEROK:HEROK2,t,hero);hero.y=.4;hero.sc=t>=102.2&&t<106.62?0:t>=81&&t<82?0:1;
  keyPos(DEVK,t,dev);dev.y=dev.z<-2.6&&dev.z>-5.4&&Math.abs(dev.x)<10?.4:0;dev.sc=(t>49.7&&t<52.4)||(t>80.7&&t<86.9)?0:1}

/* ================= flow dots (simulated routes, relationships) ================= */
const DOTS=new T3.InstancedMesh(new T3.SphereGeometry(.34,8,6),new T3.MeshBasicMaterial({transparent:true,opacity:.95,depthWrite:false,fog:false}),500);
DOTS.frustumCulled=false;DOTS.renderOrder=5;scene.add(DOTS);
const FLOWS=[];let dotN=0;
function flow(fn,n,c,speed,size){const f={fn,n,i0:dotN,speed,size:size||1,a:0},cc=C(c);for(let i=0;i<n;i++)DOTS.setColorAt(dotN+i,cc);dotN+=n;FLOWS.push(f);return f}
const line=(a,b)=>(u,o)=>o.set(lerp(a[0],b[0],u),lerp(a[1],b[1],u),lerp(a[2],b[2],u));
const fB2=flow(line([-36,1,-34],[36,1,-34]),26,K.amber,.2,1.2);
const fRb=[flow((u,o)=>o.set(JX+Math.sin(u*2*PI)*4.2,1.1,JZ+Math.cos(u*2*PI)*4.2),16,K.assist,.3),flow(line([JX-1.5,1,2],[JX-1.5,1,35]),12,K.assist,.25),flow(line([37,1,JZ-1.5],[9,1,JZ-1.5]),12,K.assist,.25)];
const fTram=flow(line([-36,1.3,0],[38,1.3,0]),28,K.assist,.2,1.2);
const fFoot=flow((u,o)=>{const x=lerp(-30,15,u);o.set(x,footY(x)+1.1,27)},20,K.assist,.2);
const STN=[[-13,3.5,-9],[-29,3,23],[-2,2.5,27],[PAD[0],4,PAD[2]],[-11,3.2,7.5],[18,2.5,25]];
const PAIRS=[[0,3],[1,3],[2,3],[3,4],[4,2],[4,5],[5,1],[0,5]];
const fArc=PAIRS.map(([i,j])=>{const a=STN[i],b=STN[j],h=4+Math.hypot(a[0]-b[0],a[2]-b[2])*.22;
  return flow((u,o)=>o.set(lerp(a[0],b[0],u),lerp(a[1],b[1],u)+h*Math.sin(PI*u),lerp(a[2],b[2],u)),22,0xFFD84A,.1,.7)});
function drawFlows(){_q.identity();for(const f of FLOWS)for(let k=0;k<f.n;k++){const u=(k/f.n+clk*f.speed)%1;
    if(f.a<.02)_m.makeScale(0,0,0);else{f.fn(u,_p);_s.setScalar(f.a*f.size*(.55+.45*Math.sin(PI*u)));_m.compose(_p,_q,_s)}DOTS.setMatrixAt(f.i0+k,_m)}
  for(let i=dotN;i<500;i++){_m.makeScale(0,0,0);DOTS.setMatrixAt(i,_m)}DOTS.instanceMatrix.needsUpdate=true}

/* ================= labels pinned to the world ================= */
const LBL=[];
function label(text,x,y,z,pin){const el=document.createElement(pin?'button':'div');el.className='lb'+(pin?' pin':'');el.textContent=text;el.style.visibility='hidden';
  $('#labels').appendChild(el);const l={el,p:new T3.Vector3(x,y,z),a:0,vis:false};LBL.push(l);return l}
function drawLabels(){const w=innerWidth,h=innerHeight;for(const l of LBL){_p.copy(l.p).project(camera);
    if(l.a<.03||_p.z>1||_p.z<-1){if(l.vis){l.el.style.visibility='hidden';l.vis=false}continue}
    l.el.style.transform='translate('+((_p.x*.5+.5)*w).toFixed(1)+'px,'+((-_p.y*.5+.5)*h).toFixed(1)+'px) translate(-50%,-115%)';
    l.el.style.opacity=l.a.toFixed(2);if(!l.vis){l.el.style.visibility='visible';l.vis=true}}}
const SAY=[label('This junction is always stuck.',16,2.4,15.4),label('I only cross for the market.',27.6,2.4,25.4),label('There’s no tram to the east side.',26.6,2.4,14.6)];
const pauseL=label('Paused',-12,17,-27);

/* ================= apply a world state ================= */
let busyK=0;
function applyWorld(w,dt){padBusy=X.gen?1:0;
  board.visible=w.blueprint>.01;board.scale.setScalar(Math.max(.001,w.blueprint));
  brGhost.fade(w.bridgeGhost);bridgeAnim(w.bridge,X.exB);
  town[1].set(w.g1);town[2].set(w.g2);
  fab.set(w.fab);fabHead.visible=w.fab>.97;
  spec.visible=w.spec>.01;spec.material.opacity=w.spec;spec.position.y=4.6+.15*Math.sin(clk*1.4);
  towerAnim(w.tower,X.exT);
  crane.set(w.crane);jib.set(w.crane);jib.obj.rotation.y=w.craneAng;
  b2Ghost.fade(w.b2Ghost*(.8+.2*Math.sin(clk*3)));b2.set(w.b2);
  jamRing.material.opacity=w.jam*(.5+.3*Math.sin(clk*5));jamRing.scale.setScalar(1+.05*Math.sin(clk*5));jamRing.visible=w.jam>.01;
  scanRing.visible=w.scan>0&&w.scan<1;scanRing.scale.setScalar(2+w.scan*64);scanRing.material.opacity=.85*(1-w.scan);
  rbGhost.fade(w.roundGhost);rb.set(w.round);signals.set(w.signals);
  railGhost.fade(w.tramGhost);tramGhost.visible=w.tramGhost>.05;tramGhostMat.opacity=.6*w.tramGhost;tramGhost.position.x=tramX(clk*2.4);
  rails.set(w.rails);shelterAnim(w.shelter);
  tram.visible=w.tram>.01;tram.scale.setScalar(Math.max(.001,w.tram));tram.position.x=tramX(w.tramT);
  footGhost.fade(w.footGhost);footAnim(w.foot);
  staff.set(w.staff);chart.visible=w.staff>.95;
  shelGhost.fade(w.designGhost);shelGhost.obj.rotation.y=clk*.8;
  orb.visible=w.orb>.01;orb.scale.setScalar(Math.max(.001,w.orb)*(1+.12*Math.sin(clk*4)));orb.position.y=3.6+.2*Math.sin(clk*2);
  const tg=[[-36+72*w.rails,2.2,0],[-27,4,-7],[14,5,-4]];
  DRONES.forEach((d,k)=>{d.visible=w.drones>.01;let u=(clk*.26+k/3)%1;u=smooth(u<.5?u*2:2-u*2);const t=tg[k];
    d.position.set(lerp(PAD[0],t[0],u),lerp(5,t[1],u)+3*Math.sin(PI*u),lerp(PAD[2],t[2],u));d.scale.setScalar(Math.max(.001,w.drones));d.rotation.y=clk*2});
  hand.set(w.hand);
  outGhostA.set(w.outerGhost);outGhostB.set(w.outerGhost);outSolid.set(w.outerSolid);
  beacon.material.opacity=.55+.25*Math.sin(clk*2.2);
  fB2.a=w.fB2;fRb.forEach(f=>f.a=w.fRb);fTram.a=w.fTram;fFoot.a=w.fFoot;
  busyK+=((padBusy?1:0)-busyK)*Math.min(1,dt*6);
  fabHead.position.z=16+3.4*Math.sin(clk*2.6)*busyK;fabHead.userData.gl.material.opacity=.25+.75*busyK;
  for(const g of GEARS)g.rotation.z=clk*1.6*g.userData.w+g.userData.ph;rotor.rotation.z=clk*1.1;
  river.material[2].map.offset.y=clk*.012;
  SAY.forEach(l=>l.a=w.talk);pauseL.a=w.pause;
  STAFF.forEach(f=>{if(f)f.sc=w.staff});collab.forEach(f=>f.sc=w.collab);TALK.forEach(f=>f.sc=w.talkers)}
