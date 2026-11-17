'use strict';
/* ================= utilities ================= */
const T3=THREE, PI=Math.PI;
const $=s=>document.querySelector(s);
const clamp=(x,a=0,b=1)=>x<a?a:x>b?b:x;
const lerp=(a,b,t)=>a+(b-a)*t;
const seg=(t,a,b)=>clamp((t-a)/(b-a));
const smooth=t=>t*t*(3-2*t);
const eOut=t=>1-Math.pow(1-t,3);
const eIO=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const win=(t,a,b,f=.6)=>Math.max(0,Math.min(seg(t,a,a+f),1-seg(t,b-f,b)));
function rng(seed){return()=>{seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const C=h=>new T3.Color(h).convertSRGBToLinear();
const K={red:0xC91A09,blue:0x0055BF,yellow:0xF2CD37,green:0x237841,bgreen:0x4B9F4A,orange:0xFE8A18,white:0xF4F4F4,
  lgray:0xA0A5A9,dgray:0x6C6E68,black:0x1B2A34,tan:0xE4CD9E,dtan:0x958A73,azure:0x36AEBF,sand:0x6074A1,dred:0x8A1A12,
  lime:0xA5CA18,brown:0x582A12,win:0x9FD8F5,lav:0xAC78BA,coral:0xFF698F,teal:0x008F9B,road:0x4A4F55,nougat:0xD09168,
  cream:0xF3E7C9,plan:0x8FD4FF,assist:0x36E0C2,amber:0xFFB020};

/* ================= renderer / scene ================= */
const canvas=$('#c');
let renderer;
try{renderer=new T3.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'})}
catch(e){document.body.classList.add('nogl');throw e}
const SMALL=Math.min(innerWidth,innerHeight)<700;
renderer.outputEncoding=T3.sRGBEncoding;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T3.PCFSoftShadowMap;
const MAXANI=renderer.capabilities.getMaxAnisotropy();
const scene=new T3.Scene();
scene.fog=new T3.Fog(0xd6ecff,150,640);
const camera=new T3.PerspectiveCamera(40,1,.4,1800);
const hemi=new T3.HemisphereLight(0xffffff,0x7fa070,.55);scene.add(hemi);
const sun=new T3.DirectionalLight(0xffffff,.85);sun.castShadow=true;
sun.shadow.mapSize.set(SMALL?1536:2048,SMALL?1536:2048);sun.shadow.camera.near=1;sun.shadow.camera.far=900;sun.shadow.bias=-.0004;
scene.add(sun,sun.target);
const sky=new T3.Mesh(new T3.SphereGeometry(900,24,12),new T3.ShaderMaterial({side:T3.BackSide,depthWrite:false,fog:false,
  uniforms:{top:{value:new T3.Color(0x4f9fe6)},bot:{value:new T3.Color(0xd6ecff)}},
  vertexShader:'varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'uniform vec3 top;uniform vec3 bot;varying vec3 vP;void main(){float h=normalize(vP).y;gl_FragColor=vec4(mix(bot,top,smoothstep(-.02,.55,h)),1.);}'}));
sky.frustumCulled=false;sky.renderOrder=-10;scene.add(sky);

const ENV0={top:new T3.Color(0x4f9fe6),bot:new T3.Color(0xd6ecff),sun:new T3.Color(0xfff6e6),hs:new T3.Color(0xffffff),dir:new T3.Vector3(-.45,.8,.4).normalize(),si:.85,hi:.55};
const ENV1={top:new T3.Color(0x3566b4),bot:new T3.Color(0xffd6ab),sun:new T3.Color(0xffc48c),hs:new T3.Color(0xffe6cf),dir:new T3.Vector3(-.72,.44,.52).normalize(),si:.95,hi:.46};
const sunDir=new T3.Vector3();
function setEnv(et){const k=smooth(seg(et,96,113)),u=sky.material.uniforms;
  u.top.value.copy(ENV0.top).lerp(ENV1.top,k);u.bot.value.copy(ENV0.bot).lerp(ENV1.bot,k);
  scene.fog.color.copy(u.bot.value).convertSRGBToLinear();
  sun.color.copy(ENV0.sun).lerp(ENV1.sun,k).convertSRGBToLinear();hemi.color.copy(ENV0.hs).lerp(ENV1.hs,k).convertSRGBToLinear();
  sun.intensity=lerp(ENV0.si,ENV1.si,k);hemi.intensity=lerp(ENV0.hi,ENV1.hi,k);
  sunDir.copy(ENV0.dir).lerp(ENV1.dir,k).normalize();}
const SH_LADDER=[14,22,34,52,80,120,180];
function aimShadow(tx,ty,tz,dist){let need=dist*.7,half=SH_LADDER[SH_LADDER.length-1];
  for(const s of SH_LADDER){if(s>=need){half=s;break}}
  const q=half/48;tx=Math.round(tx/q)*q;tz=Math.round(tz/q)*q;
  sun.target.position.set(tx,0,tz);sun.position.set(tx+sunDir.x*380,sunDir.y*380,tz+sunDir.z*380);
  const c=sun.shadow.camera;if(c.right!==half){c.left=-half;c.right=half;c.top=half;c.bottom=-half;c.updateProjectionMatrix();
    sun.shadow.normalBias=half/sun.shadow.mapSize.x*3.2;}}

/* ================= textures ================= */
function cnv(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);
  const t=new T3.CanvasTexture(c);t.encoding=T3.sRGBEncoding;t.anisotropy=MAXANI;return t}
const studBase=cnv(64,64,(g,s)=>{g.fillStyle='#fff';g.fillRect(0,0,s,s);
  g.fillStyle='rgba(0,0,0,.2)';g.beginPath();g.arc(s/2+2.5,s/2+3.5,s*.31,0,7);g.fill();
  g.fillStyle='#fff';g.beginPath();g.arc(s/2,s/2,s*.3,0,7);g.fill();
  g.strokeStyle='rgba(0,0,0,.13)';g.lineWidth=1.5;g.beginPath();g.arc(s/2,s/2,s*.3,0,7);g.stroke();});
studBase.wrapS=studBase.wrapT=T3.RepeatWrapping;
function slab(x0,x1,z0,z1,y0,y1,col,rough){const w=x1-x0,d=z1-z0,tex=studBase.clone();tex.needsUpdate=true;tex.repeat.set(w,d);
  const top=new T3.MeshStandardMaterial({color:C(col),map:tex,roughness:rough}),side=new T3.MeshStandardMaterial({color:C(col),roughness:rough});
  const m=new T3.Mesh(new T3.BoxGeometry(w,y1-y0,d),[side,side,top,side,side,side]);m.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);
  m.receiveShadow=true;scene.add(m);return m}
const glowTex=cnv(128,128,(g,s)=>{const r=g.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);r.addColorStop(0,'rgba(255,255,255,1)');
  r.addColorStop(.25,'rgba(255,255,255,.55)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,s,s)});
function glow(col,size){const s=new T3.Sprite(new T3.SpriteMaterial({map:glowTex,color:new T3.Color(col),blending:T3.AdditiveBlending,depthWrite:false,transparent:true}));
  s.scale.set(size,size,1);return s}
function panel(tex,w,h){const m=new T3.Mesh(new T3.PlaneGeometry(w,h),new T3.MeshBasicMaterial({map:tex,transparent:true,side:T3.DoubleSide}));return m}

/* ================= instanced brick groups ================= */
const BOX=new T3.BoxGeometry(1,1,1);
const STUD=new T3.CylinderGeometry(.3,.3,.2,10);STUD.translate(0,.1,0);
const _m=new T3.Matrix4(),_p=new T3.Vector3(),_q=new T3.Quaternion(),_s=new T3.Vector3(),_e=new T3.Euler();
const COLS=new Map();const col=h=>{let c=COLS.get(h);if(!c){c=C(h);COLS.set(h,c)}return c};
const BGS=[];
class BG{
  constructor(o){this.o=Object.assign({ghost:false,drop:7,win:.2,gcol:K.plan,gap:.03},o||{});this.B=[];this.S=[];this.p=-1;this.obj=new T3.Group();BGS.push(this)}
  /* x,z = centre; y = bottom */
  add(x,y,z,w,h,d,c,st,ord){const bi=this.B.length;this.B.push({x,y:y+h/2,z,w,h,d,c,ord:ord===undefined?y:ord,dl:0});
    if(st&&!this.o.ghost){const nx=Math.max(1,Math.round(w)),nz=Math.max(1,Math.round(d));
      for(let i=0;i<nx;i++)for(let j=0;j<nz;j++)this.S.push({b:bi,ox:(i+.5)*w/nx-w/2,oz:(j+.5)*d/nz-d/2});}
    return this}
  done(parent,p){const B=this.B,n=B.length,o=this.o;
    const mat=this.mat=o.ghost?new T3.MeshStandardMaterial({color:col(o.gcol),emissive:col(o.gcol),emissiveIntensity:.75,transparent:true,opacity:.5,depthWrite:false,roughness:.6})
      :new T3.MeshStandardMaterial({roughness:.36,metalness:0});
    const idx=B.map((_,i)=>i).sort((a,b)=>B[a].ord-B[b].ord||a-b);idx.forEach((bi,k)=>B[bi].dl=n>1?k/(n-1):0);
    this.cy=new Float32Array(n);this.cs=new Float32Array(n);
    const mb=this.mb=new T3.InstancedMesh(BOX,mat,Math.max(n,1));mb.count=n;mb.frustumCulled=false;
    if(!o.ghost){for(let i=0;i<n;i++)mb.setColorAt(i,col(B[i].c));mb.castShadow=true;mb.receiveShadow=true}
    this.obj.add(mb);
    if(this.S.length){const ms=this.ms=new T3.InstancedMesh(STUD,mat,this.S.length);ms.frustumCulled=false;
      for(let i=0;i<this.S.length;i++)ms.setColorAt(i,col(B[this.S[i].b].c));ms.castShadow=true;ms.receiveShadow=true;this.obj.add(ms)}
    (parent||scene).add(this.obj);this.set(p===undefined?1:p);return this}
  set(p){p=clamp(p);if(p===this.p)return;this.p=p;const B=this.B,S=this.S,o=this.o,w=Math.max(.01,o.win),g=o.gap,n=B.length;
    _q.identity();
    for(let i=0;i<n;i++){const b=B[i],t=p<=0?0:clamp((p-b.dl*(1-w))/w),v=t>0?1:0,y=b.y+(1-eOut(t))*o.drop;this.cy[i]=y;this.cs[i]=v;
      _p.set(b.x,y,b.z);_s.set((b.w-g)*v,(b.h-g)*v,(b.d-g)*v);_m.compose(_p,_q,_s);this.mb.setMatrixAt(i,_m)}
    this.mb.instanceMatrix.needsUpdate=true;
    if(this.ms){for(let i=0;i<S.length;i++){const s=S[i],b=B[s.b],v=this.cs[s.b];_p.set(b.x+s.ox,this.cy[s.b]+b.h/2-g/2,b.z+s.oz);_s.set(v,v,v);_m.compose(_p,_q,_s);this.ms.setMatrixAt(i,_m)}
      this.ms.instanceMatrix.needsUpdate=true}}
  fade(a){this.mat.opacity=.5*a;this.obj.visible=a>.01}
  pos(x,y,z){this.obj.position.set(x,y,z)}
  kill(){this.obj.parent&&this.obj.parent.remove(this.obj);this.mat.dispose();const i=BGS.indexOf(this);if(i>=0)BGS.splice(i,1)}
}
function merge(gs){gs=gs.map(g=>g.index?g.toNonIndexed():g);let n=0;gs.forEach(g=>n+=g.attributes.position.count);
  const P=new Float32Array(n*3),N=new Float32Array(n*3);let o=0;
  gs.forEach(g=>{P.set(g.attributes.position.array,o);N.set(g.attributes.normal.array,o);o+=g.attributes.position.count*3});
  const out=new T3.BufferGeometry();out.setAttribute('position',new T3.BufferAttribute(P,3));out.setAttribute('normal',new T3.BufferAttribute(N,3));return out}
function solid(geo,c,o){const m=new T3.Mesh(geo,new T3.MeshStandardMaterial(Object.assign({color:col(c),roughness:.36},o||{})));m.castShadow=true;m.receiveShadow=true;return m}

/* ================= film camera path ================= */
const DUR=123, SCENES=[0,14,29,46,60,80,101,111];
const CAM=[ /* t, position, look-at */
[0,   -31,2.2,.4,     -23,1,4.6],
[2.5, -24,2.4,.6,     -16,1,4.8],
[5,   -17.5,2.8,2,    -6,1.3,5.2],
[7.5, -16.5,3.3,2.6,  2,1.6,5.6],
[10.5,-24,26,44,      -8,0,2],
[13,  -26,7,33,       -29,2.2,21.5],
[14.6,-14,6,26,       -15,1.5,15],
[16.6,-7,4.6,23.5,    -13.5,.8,16],
[19.6,-19.5,4,24.5,   -13.5,.9,16],
[21.4,-15,7.5,27,     -10,2.5,10],
[23.6,-12,10,24,      -2,1.5,2],
[26,  2,7,19,         0,2.5,0],
[28,  8.5,3.2,8.5,    2,1.4,3.2],
[29.6,10.5,3.6,10.5,  14,1.4,5.5],
[31,  4,16,22,        2,2,0],
[32.6,8,30,48,        -4,2,0],
[35.5,-6,5.5,26.5,    -13.5,2,16],
[38.3,-10.5,3.4,24.5, -13.5,2.4,16.5],
[40.6,-13.5,8,30,     -13.5,2.5,16],
[43.5,-28,14,12,      -13,9,-12],
[46,  -34,26,30,      -8,6,-8],
[49.5,30,22,50,       19,0,13],
[51.4,13,18,18,       4,4,-18],
[53,  12,16,0,        0,8,-34],
[55,  8,10,-10,       -4,6,-30],
[57.5,4,74,54,        6,0,0],
[60,  36,19,45,       22,0,20],
[63,  32,11,36,       21,1,19],
[65.5,16,34,8,        2,0,-30],
[68.5,33,11,34,       22,.5,20],
[71.5,10,20,28,       2,0,-2],
[74.5,-6,9,44,        0,1,27],
[78.6,12,48,58,       6,0,10],
[80.6,-14,13,12,      -12,3,-6],
[81.6,-9.6,3.2,-3.4,  -13,2.5,-10.5],
[83.3,-10.2,3.1,-4.2, -13,2.5,-10.5],
[84.2,-37,6,10,       -30,2.5,18],
[85.3,-30.5,2.8,29.5, -29,2.4,21.5],
[86.9,-30,2.7,28.6,   -28.8,2.4,21.5],
[88.7,-20,4.5,37,     -4,1.5,27],
[90.4,-18.5,4.3,36.2, -4,1.5,27],
[92.2,-13.5,7,31,     -13.5,2.5,16],
[93.9,-13.5,6.4,29.6, -13.5,2.5,16],
[94.7,-24,9.5,24,     -14,2.5,12],
[95.7,-22,4.5,4,      -10.5,2.4,8],
[97.4,-21,4.4,4.4,    -10.5,2.4,8],
[98.3,-5,10,8.5,      8,1.5,18],
[99.2,13.5,5,33,      21,1.5,21],
[100.8,14.2,4.8,32,   21,1.5,21],
[102.6,8,24,40,       4,0,6],
[104.8,0,7,-19,       0,1.2,0],
[106.9,22,6,-9,       14,1.2,1],
[108.3,21,5.5,-8,     14.5,1.2,3],
[109.6,4,15,14,       -8,1,12],
[110.8,-11.5,5,28,    -17,1.4,19.2],
[112.2,-14,13,38,     -10,1,10],
[115,  -30,60,112,    0,0,0],
[119,  -50,118,190,   0,0,-10],
[123,  -58,132,212,   0,0,-12]];
function camAt(t,pos,look){const K_=CAM,n=K_.length;t=clamp(t,K_[0][0],K_[n-1][0]);
  let i=0;while(i<n-2&&K_[i+1][0]<=t)i++;
  const a=K_[i],b=K_[i+1],h=b[0]-a[0],u=(t-a[0])/h,u2=u*u,u3=u2*u,pm=K_[Math.max(i-1,0)],pn=K_[Math.min(i+2,n-1)];
  const h00=2*u3-3*u2+1,h10=u3-2*u2+u,h01=-2*u3+3*u2,h11=u3-u2;
  for(let c=1;c<7;c++){const p0=a[c],p1=b[c],d=(p1-p0)/h;let m0=i>0?(p1-pm[c])/(b[0]-pm[0]):d,m1=i+2<n?(pn[c]-p0)/(pn[0]-a[0]):d;
    m0=m0*d<=0?0:Math.sign(d)*Math.min(Math.abs(m0),3*Math.abs(d));m1=m1*d<=0?0:Math.sign(d)*Math.min(Math.abs(m1),3*Math.abs(d));
    const v=h00*p0+h10*h*m0+h01*p1+h11*h*m1;(c<4?pos:look).setComponent((c-1)%3,v)}
  if(pos.y<1.6)pos.y=1.6}
/* portrait screens: widen a little and step back so the same action stays in frame */
let VFOV=40,DOLLY=1;
function fitCamera(){const w=innerWidth,h=innerHeight,a=w/h;
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,SMALL?2:1.75));renderer.setSize(w,h,false);
  VFOV=clamp(2*Math.atan(.546/a)*180/PI,40,62);DOLLY=Math.max(1,.41/(Math.tan(VFOV*PI/360)*a));
  camera.fov=VFOV;camera.aspect=a;camera.updateProjectionMatrix()}
