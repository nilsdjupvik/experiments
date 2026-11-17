/* ================= ground ================= */
slab(-420,-7,-420,420,-1.6,0,0x4B9F4A,.6);slab(7,420,-420,420,-1.6,0,0x4B9F4A,.6);
const river=slab(-7,7,-420,420,-2,-.6,0x2F86D6,.18);

/* ================= placement helpers ================= */
const RES=[];const reserve=(x0,x1,z0,z1)=>RES.push([x0,x1,z0,z1]);
const isFree=(x0,x1,z0,z1)=>{for(const r of RES)if(x0<r[1]&&x1>r[0]&&z0<r[3]&&z1>r[2])return false;return true};
const camPts=[];{const p=new T3.Vector3(),l=new T3.Vector3();
  for(let t=0;t<=DUR;t+=.2){camAt(t,p,l);for(const s of[1,1.3,1.65])camPts.push([l.x+(p.x-l.x)*s,l.y+(p.y-l.y)*s,l.z+(p.z-l.z)*s])}}
const camClear=(x0,x1,z0,z1,h)=>{for(const p of camPts)if(p[1]<h+4&&p[0]>x0-3.5&&p[0]<x1+3.5&&p[2]>z0-3.5&&p[2]<z1+3.5)return false;return true};
const JX=22,JZ=20;                       /* the market junction */
const PAD=[-13.5,.3,16];                 /* the workshop build pad */
reserve(-9,9,-400,400);                  /* river */
reserve(-36,-6,6.5,31);                  /* workshop yard */
reserve(-19,-7,-18,-6);                  /* works tower */
reserve(-18,-6,-32,-22);                 /* crane */
reserve(JX-9,JX+9,JZ-9,JZ+9);
reserve(8,21.5,5.5,14.5);                  /* destination shop */
reserve(-34,18,24.5,29.5);               /* footpath */
reserve(-12,-7,-66,8);reserve(7,12,-66,8);reserve(-12,12,-66,-58); /* riverside path + ford */
for(const x of[-27,14,32])reserve(x-3,x+3,-9,-5);

/* ================= roads ================= */
const ROADS=[{a:'x',c:0,s:-38,e:-8},{a:'x',c:0,s:8,e:38},{a:'x',c:20,s:8,e:38},{a:'x',c:-34,s:-38,e:-8},{a:'x',c:-34,s:8,e:38},
  {a:'z',c:-20,s:-34,e:0},{a:'z',c:22,s:-34,e:36}];
function onRoad(x,z,skip,m){for(const r of ROADS){if(r===skip)continue;const along=r.a==='x'?x:z,across=r.a==='x'?z:x;
  if(Math.abs(across-r.c)<m&&along>r.s-m&&along<r.e+m)return true}return false}
const roads=new BG();
for(const r of ROADS){const X=r.a==='x';
  if(X)reserve(r.s-1,r.e+1,r.c-5.6,r.c+5.6);else reserve(r.c-5.6,r.c+5.6,r.s-1,r.e+1);
  for(let u=r.s;u<r.e;u+=2){const m=u+1;
    X?roads.add(m,0,r.c,2,.3,7,K.road,0):roads.add(r.c,0,m,7,.3,2,K.road,0);
    for(const sd of[-4.25,4.25]){const px=X?m:r.c+sd,pz=X?r.c+sd:m;
      if(!onRoad(px,pz,r,4.4))X?roads.add(px,0,pz,2,.4,1.5,K.lgray,0):roads.add(px,0,pz,1.5,.4,2,K.lgray,0)}
    if((u-r.s)%4===0&&!onRoad(X?m:r.c,X?r.c:m,r,3.8))X?roads.add(m,.3,r.c,1.2,.03,.2,K.white,0):roads.add(r.c,.3,m,.2,.03,1.2,K.white,0)}}
for(const z of[-2.9,-2.2,-1.5,-.85,.85,1.5,2.2,2.9])roads.add(14.5,.3,z,1.8,.03,.36,K.white,0);
roads.done();

/* ================= buildings ================= */
function house(g,cx,cz,w,d,fl,wall,roof,style,ob,hi){const od=y=>ob+y*.3;
  if(hi){for(let f=0;f<fl;f++)for(let r=0;r<3;r++){const yy=(f*3+r)*1.2,isW=r===1;
      for(let i=0;i<w/2;i++){const x=cx-w/2+1+i*2;for(const sg of[-1,1]){let c=wall;
        if(isW&&i%2===f%2)c=K.win;if(f===0&&r<2&&sg===1&&i===(w/4|0))c=K.brown;
        g.add(x,yy,cz+sg*(d/2-.5),2,1.2,1,c,0,od(yy))}}
      for(let j=0;j<(d-2)/2;j++){const z=cz-d/2+2+j*2;for(const sg of[-1,1])g.add(cx+sg*(w/2-.5),yy,z,1,1.2,2,isW&&j%2===0?K.win:wall,0,od(yy))}}}
  else for(let f=0;f<fl;f++){g.add(cx,f*3.6,cz,w,2.4,d,wall,0,od(f*3.6));g.add(cx,f*3.6+2.4,cz,w,1.2,d,f%2?wall:roof,0,od(f*3.6+2.4))}
  const y=fl*3.6;
  if(style==='flat'){g.add(cx,y,cz,w,.4,d,roof,hi?1:0,od(y));g.add(cx-w/4,y+.4,cz-d/4,2,1.2,2,K.lgray,hi?1:0,od(y+.4))}
  else if(style==='step'){for(let k=0;w-2*k>=2&&d-2*k>=2;k++)g.add(cx,y+k*1.2,cz,w-2*k,1.2,d-2*k,roof,hi?1:0,od(y+k*1.2))}
  else for(let k=0;d-2*k>=2;k++)g.add(cx,y+k*1.2,cz,w,1.2,d-2*k,roof,hi?1:0,od(y+k*1.2))}
function tree(g,x,z,ob){g.add(x,0,z,1,2.4,1,K.brown,0,ob);g.add(x,2.4,z,3,1.2,3,K.green,1,ob+.3);g.add(x,3.6,z,2,1.2,2,K.bgreen,1,ob+.5);g.add(x,4.8,z,1,.8,1,K.green,1,ob+.7)}

const deco=new BG();
const town=[new BG(),new BG({win:.1,drop:10}),new BG({win:.1,drop:12})];
{const R=rng(11),WALL=[K.tan,K.white,K.sand,K.nougat,K.cream,K.lgray,K.azure,K.coral],ROOF=[K.dred,K.red,K.blue,K.dgray,K.orange,K.green];
  const pick=a=>a[R()*a.length|0];const cnt=[0,0,0];
  for(let gx=-55;gx<=55;gx+=11)for(let gz=-55;gz<=55;gz+=11){
    const x=Math.round(gx+(R()-.5)*3),z=Math.round(gz+(R()-.5)*3),w=R()<.5?6:8,d=R()<.5?6:8,r=Math.hypot(x,z),a=R(),b=R();
    let ph=r<30?(a<.62?0:a<.85?1:2):r<50?(a<.22?0:a<.62?1:2):(a<.6?2:-1);if(ph<0)continue;
    let fl=ph===0?1+(b<.5?1:0):ph===1?2+(b*2|0):3+(b*4|0);
    const x0=x-w/2-1,x1=x+w/2+1,z0=z-d/2-1,z1=z+d/2+1;
    if(!isFree(x0,x1,z0,z1))continue;
    while(fl>1&&!camClear(x0,x1,z0,z1,fl*3.6+4))fl--;
    if(!camClear(x0,x1,z0,z1,fl*3.6+4))continue;
    reserve(x0,x1,z0,z1);
    house(town[ph],x,z,w,d,fl,pick(WALL),pick(ROOF),ph===2?'flat':R()<.6?'step':'gable',cnt[ph]++*2.4,true)}
  for(let i=0;i<260;i++){const x=Math.round((R()-.5)*150),z=Math.round((R()-.5)*150);
    if(!isFree(x-2,x+2,z-2,z+2)||!camClear(x-1.5,x+1.5,z-1.5,z+1.5,6))continue;reserve(x-2,x+2,z-2,z+2);tree(deco,x,z,0)}
}
/* riverside path, ford (the long way round), destination shop, workshop */
for(let z=-60;z<=4;z+=2)for(const x of[-9.6,9.6])deco.add(x,0,z,1.6,.2,2,K.tan,0);
for(let x=-6;x<=6;x+=3)deco.add(x,-.9,-62,2,1,2,K.lgray,1);
for(const x of[-8.6,8.6])deco.add(x,0,-62,2.4,.2,2,K.tan,0);
house(deco,15,10,6,6,2,K.cream,K.red,'step',0,true);
deco.add(15,3,6.4,4,.3,1.4,K.yellow,1);
deco.add(19,0,6.5,.4,7,.4,K.white,0);deco.add(20.2,5.6,6.5,2,1.3,.16,K.red,0);
for(let r=0;r<4;r++){deco.add(-32.5,r*1.2,13,1,1.2,8,K.tan,0);deco.add(-29,r*1.2,9.5,6,1.2,1,K.tan,0);deco.add(-29,r*1.2,16.5,6,1.2,1,K.tan,0)}
deco.add(-29,4.8,13,8,.4,8,K.orange,1);deco.add(-28.5,0,13,2,1.2,4,K.brown,1);deco.add(-29,5.2,13,1,1.2,1,K.yellow,1);
deco.add(PAD[0],0,PAD[2],10,.3,8,K.dgray,1);
deco.add(-30.8,0,21.5,.5,4.5,.5,K.brown,0);deco.add(-27.2,0,21.5,.5,4.5,.5,K.brown,0);deco.add(-29,1.5,21.4,4.3,3,.2,K.white,0);
deco.done();town.forEach((g,i)=>g.done(scene,i?0:1));
const beacon=glow(0xffd76a,7);beacon.position.set(-29,6.8,13);scene.add(beacon);

/* signage in the world */
const texPlan=cnv(512,340,(g,w,h)=>{g.fillStyle='#1c5fc2';g.fillRect(0,0,w,h);g.strokeStyle='rgba(255,255,255,.18)';g.lineWidth=1;
  for(let x=0;x<w;x+=32){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke()}for(let y=0;y<h;y+=32){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}
  g.strokeStyle='#fff';g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(50,240);g.lineTo(462,240);g.stroke();
  for(const x of[170,342]){g.beginPath();g.moveTo(x,270);g.lineTo(x,90);g.stroke()}
  g.lineWidth=3;g.beginPath();g.moveTo(170,95);g.quadraticCurveTo(256,300,342,95);g.stroke();
  g.beginPath();g.moveTo(170,95);g.lineTo(60,238);g.moveTo(342,95);g.lineTo(452,238);g.stroke();
  g.setLineDash([8,8]);g.lineWidth=2;g.beginPath();g.moveTo(50,290);g.lineTo(462,290);g.stroke();g.setLineDash([]);
  g.fillStyle='#fff';g.font='600 30px sans-serif';g.fillText('Bridge plan',40,52)});
const board=panel(texPlan,4.1,2.75);board.position.set(-29,3,21.79);scene.add(board);
const texSpec=cnv(512,340,(g,w,h)=>{g.fillStyle='rgba(12,30,52,.9)';g.fillRect(0,0,w,h);g.strokeStyle='#36E0C2';g.lineWidth=4;g.strokeRect(8,8,w-16,h-16);
  g.lineWidth=3;g.strokeRect(60,110,170,170);g.beginPath();g.arc(125,205,44,0,7);g.stroke();g.beginPath();g.arc(188,172,26,0,7);g.stroke();
  g.fillStyle='#36E0C2';for(let i=0;i<4;i++)g.fillRect(270,128+i*40,[190,150,170,110][i],14);
  g.fillStyle='#fff';g.font='600 30px sans-serif';g.fillText('Component spec',40,64)});
const spec=panel(texSpec,3.6,2.4);spec.position.set(-17.8,4.6,12.2);spec.rotation.y=.5;scene.add(spec);
const texChart=cnv(512,340,(g,w,h)=>{g.fillStyle='rgba(250,252,255,.96)';g.fillRect(0,0,w,h);g.fillStyle='#14233B';g.font='600 28px sans-serif';g.fillText('Queue at the junction',36,54);
  g.fillStyle='#D4281C';g.fillRect(90,100,110,180);g.fillStyle='#0E9C86';g.fillRect(300,235,110,45);
  g.fillStyle='#14233B';g.font='22px sans-serif';g.fillText('before',108,312);g.fillText('after',330,312);g.font='18px sans-serif';g.fillStyle='#55657D';g.fillText('illustrative',400,54)});
const chart=panel(texChart,3.6,2.4);chart.position.set(17.6,4.2,24.6);scene.add(chart);

/* ================= bridge ================= */
function deckSeg(g,ox,oz,rail){
  for(const z of[-2.5,2.5])g.add(ox,-1.4,oz+z,2,.9,2,K.lgray,0,0);
  for(let i=0;i<2;i++)for(let j=0;j<4;j++)g.add(ox-1+i*2,-.5,oz-3+j*2,2,.4,2,K.lgray,1,1+j*.1+i*.05);
  g.add(ox,-.1,oz-1.4,4,.4,2.8,K.road,0,2);g.add(ox,-.1,oz+1.4,4,.4,2.8,K.road,0,2.1);g.add(ox,.3,oz,1.2,.03,.2,K.white,0,2.2);
  for(const s of[-1,1]){g.add(ox,-.1,oz+s*3.4,4,.5,1.2,K.lgray,1,3+s*.1);
    for(const dx of[-1.5,1.5])g.add(ox+dx,.4,oz+s*3.8,.4,1,.4,K.white,0,4+dx*.1+s*.05);
    g.add(ox,1.4,oz+s*3.8,4,.25,.4,rail,0,5+s*.1)}}
function portal(g,ox,oz){for(const s of[-1,1]){g.add(ox,-1.4,oz+s*5,2,1.4,2,K.lgray,0,0);
    for(let i=0;i<8;i++)g.add(ox,i*1.2,oz+s*5,2,1.2,2,i%4===3?K.tan:K.dred,i===7?1:0,1+i);
    g.add(ox,10.8,oz+s*5,1,.6,1,K.yellow,1,11)}
  g.add(ox,9.6,oz,2,1.2,12,K.tan,1,10)}
/* suspension cables: a continuous stepped chain from tower to tower, each link resting against its neighbours,
   with a hanger from every link down to the railing */
function cables(g,oz){const cy=a=>2+5.6*Math.pow(a/4,2);
  for(const s of[-1,1])for(let k=0;k<8;k++){const x=-3.5+k,a=Math.abs(x),y0=cy(Math.max(.5,a-1)),y1=cy(a)+.6;
    g.add(x,y0,oz+s*4.3,1,y1-y0,1.4,K.white,1,4-a);g.add(x,1.65,oz+s*3.8,.2,y0-1.65,.2,K.white,0,4.5-a)}}
const BR=[];
for(let k=0;k<4;k++){const g=new BG({win:k?.3:.12,drop:5});deckSeg(g,0,0,K.red);g.done(scene,0);BR.push({g,home:[-6+4*k,0,0]})}
for(const x of[-5,5]){const g=new BG({win:.3,drop:5});portal(g,0,0);g.done(scene,0);BR.push({g,home:[x,0,0]})}
{const g=new BG({win:.3,drop:5});cables(g,0);g.done(scene,0);BR.push({g,home:[0,0,0]})}
const brGhost=new BG({ghost:true,gap:.15});for(let k=0;k<4;k++)deckSeg(brGhost,-6+4*k,0);portal(brGhost,-5,0);portal(brGhost,5,0);cables(brGhost,0);brGhost.done();
const arcTo=(o,a,b,u,h)=>o.position.set(lerp(a[0],b[0],u),lerp(a[1],b[1],u)+h*Math.sin(PI*u),lerp(a[2],b[2],u));
let padBusy=0;
function bridgeAnim(p,ex){const t=p*13,from=[PAD[0],1.7,PAD[2]];
  BR.forEach((b,i)=>{let b0,b1,f0,f1;if(i===0){b0=0;b1=5.5;f0=5.8;f1=7.6}else{b0=6+.75*(i-1);b1=b0+.7;f0=b1+.1;f1=f0+1.3}
    const bp=seg(t,b0,b1);b.g.set(i?bp:Math.pow(bp,1.5));if(bp>0&&bp<1&&i)padBusy=1;
    arcTo(b.g.obj,from,b.home,eIO(seg(t,f0,f1)),7+(i>3?4:0));
    if(ex){const o=b.g.obj.position;if(i<4){o.x+=(i-1.5)*1.6*ex;if(i===0)o.y+=2.6*ex}else if(i<6){o.y+=5*ex}else o.y+=9*ex}})}

/* ================= works tower: mechanism -> module -> system ================= */
const SITE=[-13,0,-12],MODH=5.2;
function shell(g,k){const c=[K.azure,K.orange,K.lime,K.coral][k];
  g.add(0,0,0,6,.4,6,K.dgray,0,0);
  for(const sx of[-1,1])for(const sz of[-1,1])g.add(sx*2.5,.4,sz*2.5,1,4.4,1,K.white,0,1);
  g.add(0,.4,-2.5,4,4.4,1,c,0,2);g.add(-2.5,.4,-.5,1,4.4,3,c,0,2.1);g.add(2.5,.4,-.5,1,4.4,3,c,0,2.2);
  if(k>0){g.add(0,.4,2.5,4,1.2,1,c,0,2.3);g.add(0,1.6,2.5,4,2,1,K.win,0,2.4);g.add(0,3.6,2.5,4,1.2,1,c,0,2.5)}
  g.add(0,4.8,0,6,.4,6,K.white,1,3)}
const towerBase=new BG({win:.4});towerBase.add(SITE[0],0,SITE[2],10,.6,10,K.lgray,1).add(SITE[0],.6,SITE[2],8,.6,8,K.dgray,1).done(scene,0);
const MOD=[];for(let k=0;k<4;k++){const g=new BG({win:.35,drop:5});shell(g,k);g.done(scene,0);MOD.push(g)}
const mech=new BG({win:.16,drop:4});
mech.add(0,.4,1,4,.4,1.4,K.dgray,1,0);
for(let r=0;r<3;r++)for(const sx of[-1,1])mech.add(.2+sx*.9,.8+r*1.07,.9,1.8,1.07,.6,r===1?K.lgray:K.dgray,0,1+r+sx*.1);
mech.add(-1.2,.4,-.6,1.6,1.6,1.6,K.yellow,1,.5);mech.add(.8,.4,-.6,1.6,.8,1.6,K.black,1,.6);mech.add(.8,1.2,-.6,1,.8,1,K.red,1,4.5);
mech.done(MOD[0].obj,0);
function gearGeo(r,n){const gs=[],c=new T3.CylinderGeometry(r-.12,r-.12,.4,32);c.rotateX(PI/2);gs.push(c);
  for(let i=0;i<n;i++){const b=new T3.BoxGeometry(.2,.24,.4);b.translate(0,r-.02,0);b.rotateZ(i/n*2*PI);gs.push(b)}
  const h=new T3.CylinderGeometry(.2,.2,.7,12);h.rotateX(PI/2);gs.push(h);
  const kb=new T3.CylinderGeometry(.12,.12,.56,10);kb.rotateX(PI/2);kb.translate(r*.55,0,0);gs.push(kb);return merge(gs)}
/* three meshing gears: pitch radius = teeth * .08, centres one pitch-radius sum apart, phases set so teeth meet gaps */
const GEARS=(()=>{const M=.08,g=[{x:-.9,y:2,n:12,c:K.red,w:1,ph:0}],link=(p,n,c,ang)=>{const q={n,c,x:p.x+Math.cos(ang)*(p.n+n)*M,y:p.y+Math.sin(ang)*(p.n+n)*M,w:-p.w*p.n/n};
    const a=PI/2+p.ph-ang;q.ph=ang+PI/2-a*p.n/n-PI/n;g.push(q);return q};
  const a12=25*PI/180;g[0].ph=a12-PI/2;link(link(g[0],8,K.yellow,a12),9,K.azure,-46*PI/180);
  return g.map(q=>{const m=solid(gearGeo(q.n*M,q.n),q.c);m.position.set(q.x,q.y,1.45);m.userData={w:q.w,ph:q.ph};MOD[0].obj.add(m);return m})})();
const capG=new BG({win:.5,drop:5});capG.add(0,0,0,4,.8,4,K.dgray,1);for(let i=0;i<4;i++)capG.add(0,.8+i*1.3,0,2,1.3,2,i%2?K.lgray:K.white,i===3?1:0);capG.done(scene,0);
const rotor=solid(merge([0,1,2].map(i=>{const b=new T3.BoxGeometry(.7,4.2,.14);b.translate(0,2.1,0);b.rotateZ(i*2*PI/3);return b})
  .concat([(()=>{const h=new T3.CylinderGeometry(.4,.4,.6,12);h.rotateX(PI/2);return h})()])),K.white);
rotor.position.set(0,5.3,1.28);capG.obj.add(rotor);
const slot=k=>[SITE[0],1.2+k*MODH,SITE[2]];
function towerAnim(p,ex){const t=p*10.5,pm=[PAD[0],.3,PAD[2]];
  const mp=seg(t,0,2.8);mech.set(mp);if(t>0&&t<4.8)padBusy=1;
  GEARS.forEach((g,i)=>g.scale.setScalar(eOut(seg(t,2.3+.3*i,2.7+.3*i))||.0001));
  MOD[0].set(seg(t,3.5,4.8));towerBase.set(seg(t,4,5.5));
  MOD[0].obj.visible=t>0;arcTo(MOD[0].obj,pm,slot(0),eIO(seg(t,5,6.8)),9);
  for(let k=1;k<4;k++){const b0=5.2+.9*(k-1),bp=seg(t,b0,b0+.8);MOD[k].set(bp);if(bp>0&&bp<1)padBusy=1;
    arcTo(MOD[k].obj,pm,slot(k),eIO(seg(t,b0+.9,b0+2.3)),9+3*k)}
  capG.set(seg(t,9,9.8));const L=Math.sin(PI*seg(t,9.6,10.4));MOD[3].obj.position.y+=L;const c=slot(4);capG.pos(c[0],c[1]+L,c[2]);
  if(ex){for(let k=1;k<4;k++)MOD[k].obj.position.y+=k*2.8*ex;capG.obj.position.y+=4*2.8*ex}}

/* ================= fabricator (the AI-assisted tool on the pad) ================= */
const fab=new BG({win:.2,drop:8});
for(const x of[-19.5,-7.5]){for(const z of[11.5,20.5])for(let i=0;i<6;i++)fab.add(x,i*1.2,z,2,1.2,2,i%2?K.black:K.yellow,0,i);
  fab.add(x,7.2,16,2,1.2,11,K.yellow,1,7)}
fab.done(scene,0);
const fabHead=new T3.Group();{const b=solid(new T3.BoxGeometry(14,.7,1.2),K.dgray);b.position.y=8.75;fabHead.add(b);
  const l=new T3.Mesh(new T3.BoxGeometry(10,.16,.4),new T3.MeshBasicMaterial({color:new T3.Color(K.assist)}));l.position.y=8.32;fabHead.add(l);
  const gl=glow(K.assist,9);gl.position.y=7.6;fabHead.add(gl);fabHead.userData.gl=gl;fabHead.position.set(PAD[0],0,16);scene.add(fabHead)}
const hand=new BG({win:.3,drop:3});
[[0,0,2,K.red],[2,0,2,K.blue],[1,1.2,4,K.yellow],[0,2.4,2,K.white],[2,2.4,2,K.white],[1,3.6,2,K.red]].forEach(([x,y,w,c],i)=>hand.add(PAD[0]-4.5+x,.3+y,19.2,w,1.2,2,c,1,i));
hand.done(scene,0);

/* ================= crane and the proposed second bridge ================= */
const crane=new BG({win:.25,drop:8});crane.add(-12,0,-27,4,1.2,4,K.dgray,1);
for(let i=0;i<9;i++)crane.add(-12,1.2+i*1.2,-27,2,1.2,2,i%2?K.yellow:K.orange,0);crane.add(-12,12,-27,3,1.6,3,K.yellow,1);crane.done(scene,0);
const jib=new BG({win:.4,drop:6});jib.add(5,0,0,16,.8,1.2,K.yellow,1).add(-4,-.4,0,2,1.6,2,K.dgray,1).add(11,-5,0,.15,5,.15,K.black,0).add(11,-6.2,0,2,1.2,2,K.red,1);
jib.done(scene,0);jib.pos(-12,13.6,-27);
function bridge2(g){const z=-34;for(let k=0;k<4;k++)deckSeg(g,-6+4*k,z,K.blue);
  for(const x of[-4,4]){for(const s of[-1,1]){g.add(x,-1.4,z+s*5,2,1.4,2,K.lgray,0,0);
      for(let i=0;i<13;i++)g.add(x,i*1.2,z+s*5,2,1.2,2,i%3===2?K.white:K.sand,0,1+i);
      for(let i=0;i<5;i++)g.add(x,15.6+i*1.2,z+s*(4-i*.9),1.6,1.2,1.6,K.sand,0,14+i);
      for(const dir of[-1,1])for(let i=1;i<=(dir*x<0?6:7);i++){const yb=Math.max(.4,15-(i+1)*2.05);g.add(x+dir*i,yb,z+s*4.6,1,15.6-i*2.05-yb,1,K.white,1,14+i)}}
    g.add(x,7.2,z,2,1.2,8,K.white,0,8);g.add(x,15.6,z,2,1.2,8,K.white,0,14);g.add(x,21.6,z,2,1.2,2.6,K.white,1,20);g.add(x,22.8,z,1,3.6,1,K.yellow,1,21)}}
const b2Ghost=new BG({ghost:true,gap:.2});bridge2(b2Ghost);b2Ghost.done();
const b2=new BG({win:.12,drop:9});bridge2(b2);b2.done(scene,0);

/* ================= junction redesign, tram, footbridge ================= */
function roundabout(g){g.add(JX,0,JZ,12,.34,12,K.road,0,0);g.add(JX,.34,JZ,4,.6,4,K.bgreen,1,1);g.add(JX,.94,JZ,2,.6,2,K.white,1,2);g.add(JX,1.54,JZ,1,1.6,1,K.azure,1,3);
  for(const s of[-1,1]){g.add(JX+s*7.4,.3,JZ,2.4,.22,.8,K.white,0,2);g.add(JX,.3,JZ+s*7.4,.8,.22,2.4,K.white,0,2)}}
const rbGhost=new BG({ghost:true,gap:.12});roundabout(rbGhost);rbGhost.done();rbGhost.pos(0,.3,0);
const rb=new BG({win:.4,drop:6});roundabout(rb);rb.done(scene,0);
const signals=new BG({win:.5,drop:5});for(const sx of[-1,1])for(const sz of[-1,1]){const x=JX+sx*4.4,z=JZ+sz*4.4;
  signals.add(x,0,z,.4,3.6,.4,K.black,0).add(x,3.6,z,.8,1.6,.8,K.black,0).add(x,4.3,z,.9,.5,.9,sx*sz>0?K.red:K.yellow,0)}
signals.done();
const rails=new BG({win:.12,drop:3});for(let x=-36;x<36;x+=4)for(const z of[-.45,.45])rails.add(x+2,.3,z,4,.07,.16,K.lgray,0,x);rails.done(scene,0);
const railGhost=new BG({ghost:true});for(let x=-36;x<36;x+=4)for(const z of[-.45,.45])railGhost.add(x+2,.5,z,4,.3,.3,0,0);railGhost.done();
function shelter(g,ox,oz){g.add(ox,0,oz,4,.3,2,K.lgray,0,0);for(const s of[-1,1])g.add(ox+s*1.8,.3,oz-.8,.3,2.6,.3,K.white,0,1);
  g.add(ox,.3,oz-.85,3.2,2.2,.15,K.win,0,1.5);g.add(ox,.3,oz-.3,2,.6,.6,K.brown,0,2);g.add(ox,2.9,oz,4.4,.3,2.4,K.azure,1,3);
  g.add(ox+2.4,.3,oz+.6,.25,3.4,.25,K.dgray,0,2.5);g.add(ox+2.4,3.7,oz+.6,.9,.9,.2,K.yellow,0,3.2)}
const STOPS=[[-27,0,-7],[14,0,-7],[32,0,-7]];
const SHEL=STOPS.map(()=>{const g=new BG({win:.4,drop:4});shelter(g,0,0);return g.done(scene,0)});
function shelterAnim(p){const t=p*3.6;SHEL.forEach((g,k)=>{const b0=k*1.1,bp=seg(t,b0,b0+.6);g.set(bp);if(bp>0&&bp<1)padBusy=1;arcTo(g.obj,PAD,STOPS[k],eIO(seg(t,b0+.7,b0+1.5)),9)})}
const shelGhost=new BG({ghost:true});shelter(shelGhost,0,0);shelGhost.done();shelGhost.pos(-25.6,.9,24.6);shelGhost.obj.scale.setScalar(.7);
const tramGhostMat=brGhost.mat.clone();
function makeTram(ghost){const g=new T3.Group(),mk=(w,h,d,c)=>ghost?new T3.Mesh(new T3.BoxGeometry(w,h,d),tramGhostMat):solid(new T3.BoxGeometry(w,h,d),c);
  for(const dx of[-1.85,1.85]){const a=mk(3.5,1.1,1.5,K.yellow);a.position.set(dx,1.1,0);const b=mk(3.54,.42,1.54,K.black);b.position.set(dx,1.42,0);
    const r=mk(3.3,.16,1.2,K.white);r.position.set(dx,1.73,0);const s=mk(3.2,.26,1.3,K.dgray);s.position.set(dx,.45,0);g.add(a,s,r);if(!ghost)g.add(b)}
  const j=mk(.4,.8,1,K.dgray);j.position.y=1;g.add(j);scene.add(g);return g}
const tram=makeTram(false),tramGhost=makeTram(true);
const TRK=[[0,-36],[1.5,-27],[2.7,-27],[6.7,14],[7.9,14],[10.4,38],[11,38],[13.5,14],[14.7,14],[18.7,-27],[19.9,-27],[21.4,-36],[22,-36]];
function tramX(t){t=((t%22)+22)%22;for(let i=0;i<TRK.length-1;i++)if(t<=TRK[i+1][0])return lerp(TRK[i][1],TRK[i+1][1],smooth(seg(t,TRK[i][0],TRK[i+1][0])));return -36}
const footY=x=>{if(Math.abs(x)>=8)return .2;const c=Math.floor(x+8)-7.5;return .4+1.5*(1-c*c/64)};
function footbridge(g,i0,i1){for(let i=i0;i<=i1;i++){const x=-7.5+i,y=footY(x);g.add(x,y-.4,27,1,.4,2.4,K.tan,1,i);
    for(const s of[-1,1]){g.add(x,y,27+s*1.1,.25,.9,.25,K.white,0,i+.3);g.add(x,y+.9,27+s*1.1,1,.15,.25,K.red,0,i+.5)}}
  if(i0===0)g.add(-7.45,-1.6,27,.9,1.74,2.8,K.lgray,0,-1);if(i1===15)g.add(7.45,-1.6,27,.9,1.74,2.8,K.lgray,0,16)}
const FOOT=[[0,4],[5,10],[11,15]].map(([a,b])=>{const g=new BG();footbridge(g,a,b);return g.done(scene,0)});
const footGhost=new BG({ghost:true,gap:.15});footbridge(footGhost,0,15);footGhost.done();
const footPath=new BG({win:.2,drop:2});for(let x=-31;x<=-9;x+=2)footPath.add(x,0,27,2,.2,1.6,K.tan,0,x);for(let x=9;x<=15;x+=2)footPath.add(x,0,27,2,.2,1.6,K.tan,0,x);footPath.done(scene,0);
function footAnim(p){const t=p*4;footPath.set(seg(t,0,1.2));FOOT.forEach((g,k)=>{const s=.2+1.1*k,u=seg(t,s,s+1.3),e=eOut(u);g.set(u>0?1:0);g.pos(0,(1-e)*7,(1-e)*7)})}

/* ================= staff props, markers ================= */
const staff=new BG({win:.5,drop:4});staff.add(-11,0,7.5,3,1.2,3,K.white,1).add(-11,1.2,6.4,2,.8,.6,K.dgray,0).add(17.6,0,24.6,.3,3.1,.3,K.dgray,0).done(scene,0);
const orb=new T3.Group();{const m=new T3.Mesh(new T3.OctahedronGeometry(.42,1),new T3.MeshBasicMaterial({color:new T3.Color(K.assist)}));orb.add(m,glow(K.assist,4));orb.position.set(-27,3.6,23);scene.add(orb)}
const DRONES=[0,1,2].map(()=>{const g=new T3.Group();g.add(new T3.Mesh(new T3.OctahedronGeometry(.42),new T3.MeshBasicMaterial({color:new T3.Color(K.assist)})),glow(K.assist,2.6));
  const b=solid(new T3.BoxGeometry(1.2,.5,.5),K.lgray);b.position.y=-.7;g.add(b);scene.add(g);return g});
const ringMat=c=>new T3.MeshBasicMaterial({color:new T3.Color(c),transparent:true,opacity:0,side:T3.DoubleSide,depthWrite:false});
const jamRing=new T3.Mesh(new T3.RingGeometry(6.3,7.5,56),ringMat(0xff3b2e));jamRing.rotation.x=-PI/2;jamRing.position.set(JX,.75,JZ);scene.add(jamRing);
const scanRing=new T3.Mesh(new T3.RingGeometry(.94,1,72),ringMat(K.assist));scanRing.rotation.x=-PI/2;scanRing.position.set(JX,.8,JZ);scene.add(scanRing);

/* ================= beyond the original city ================= */
const farTrees=new BG();
const outGhostA=new BG({ghost:true,win:.05,drop:0}),outGhostB=new BG({ghost:true,win:.05,drop:0,gap:.5}),outSolid=new BG({win:.06,drop:26});
{const R=rng(5),PALS=[K.white,K.sand,K.azure,K.coral,K.orange,K.lime,K.lav,K.yellow,K.tan];
  function landmark(g,ty,x,z,ob,c1,c2){const A=(X,Y,Z,W,H,D,c)=>g.add(x+X,Y,z+Z,W,H,D,c,0,ob+Y*.05);
    if(ty===0){let y=0;[[10,8],[8,10],[6,12],[4,12],[2,10],[1,8]].forEach(([w,h],i)=>{A(0,y,0,w,h,w,i%2?c2:c1);y+=h})}
    else if(ty===1){for(let i=0;i<12;i++){const a=i/12*2*PI;A(Math.round(Math.cos(a)*13),0,Math.round(Math.sin(a)*13),5,7+(i%3)*1.5,5,i%2?c1:c2)}A(0,0,0,16,.6,16,K.bgreen)}
    else if(ty===2){for(const s of[-1,1])A(s*11,0,0,6,30,6,c1);for(let i=0;i<4;i++)A(0,30+i*3,0,28-i*6,3,6,i%2?c1:c2)}
    else if(ty===3){for(let i=0;i<6;i++)A(0,i*3,0,24-i*4,3,24-i*4,i%2?c2:c1);A(0,18,0,2,6,2,K.yellow)}
    else if(ty===4){for(let i=0;i<3;i++){const px=(i-1)*12,pz=(i%2)*8;A(px,0,pz,1.6,26,1.6,K.white);A(px,22,pz+1,.6,14,.4,K.white);A(px,28.6,pz+1,14,.6,.4,K.white)}}
    else if(ty===5){[[-8,-8,14],[8,-8,22],[-8,8,18],[8,8,10]].forEach(([X,Z,h],i)=>A(X,0,Z,10,h,10,i%2?c1:c2));A(0,8,-8,6,2,4,K.win);A(-8,8,0,4,2,6,K.win)}
    else{for(let i=-3;i<=3;i++){A(i*10,0,0,2,9,3,c1)}A(0,9,0,66,1.2,5,c2);A(0,10.2,0,62,.6,1,K.yellow)}}
  let n=0;for(let k=0;k<60&&n<36;k++){const a=k*2.39996,r=98+R()*105,x=Math.round(Math.cos(a)*r),z=Math.round(Math.sin(a)*r*.92);
    if(Math.abs(x)<26)continue;const ty=k%7,c1=PALS[R()*PALS.length|0],c2=PALS[R()*PALS.length|0];
    if(!isFree(x-17,x+17,z-17,z+17))continue;reserve(x-17,x+17,z-17,z+17);
    if(n%5<2){landmark(outGhostB,ty,x,z,r*.2,c1,c2);landmark(outSolid,ty,x,z,n*2.2,c1,c2)}else landmark(outGhostA,ty,x,z,r*.2,c1,c2);n++}
  /* two great crossings further along the river */
  for(const z of[92,-118]){const g=z>0?outGhostA:outGhostB;for(const x of[-9,9]){g.add(x,0,z,3,34,3,K.white,0,18);}
    g.add(0,5,z,44,1.4,9,K.sand,0,18);g.add(0,34,z,21,2,3,K.white,0,19);
    if(z<0){for(const x of[-9,9])outSolid.add(x,0,z,3,34,3,K.white,0,60);outSolid.add(0,5,z,44,1.4,9,K.sand,0,62);outSolid.add(0,34,z,21,2,3,K.white,0,64)}}
  const R2=rng(9);for(let i=0;i<220;i++){const a=R2()*2*PI,r=80+R2()*200,x=Math.round(Math.cos(a)*r),z=Math.round(Math.sin(a)*r);
    if(!isFree(x-2,x+2,z-2,z+2))continue;tree(farTrees,x,z,0)}
}
farTrees.done();outGhostA.done(scene,0);outGhostB.done(scene,0);outSolid.done(scene,0);
