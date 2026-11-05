import * as THREE from 'three';
import { runSim } from 'teardown-kit/runtime.js';
import {pose, DIMENSIONS, clamp} from './model.js';

// build-demo.mjs replaces these two markers with verified canonical Robo data.
const theme = __R3D_THEME_JSON__;
const logo = __R3D_LOGO_DATA_URI__;
const root = document.documentElement;
const cssRoles = {
  '--r3d-bg': theme.stage.background,
  '--r3d-floor': theme.stage.floor,
  '--r3d-panel': theme.hud.panel,
  '--r3d-text': theme.hud.text,
  '--r3d-muted': theme.hud.muted,
  '--r3d-border': theme.hud.border,
  '--r3d-accent': theme.stage.activePart,
  '--r3d-accent-text': theme.hud.action,
  '--r3d-action': theme.hud.action,
  '--r3d-on-action': theme.hud.onAction,
  '--r3d-focus': theme.hud.focus,
  '--r3d-sunken': theme.stage.floor,
};
for (const [role,value] of Object.entries(cssRoles)) root.style.setProperty(role,value);
root.lang = 'ja';
root.dataset.brand='robo-lab';
root.dataset.roboTheme=theme.theme;

const material = (color, opacity=1, metalness=.1) =>
  new THREE.MeshStandardMaterial({color, metalness, roughness:.43, transparent:opacity<1, opacity, side:THREE.DoubleSide});
const mutedMat = material(theme.stage.passivePart,.65);
const metalMat = material('#647fa1',1,.75);
const activeMat = material(theme.stage.activePart,1,.4);
const rodMat = material('#337bb2',1,.72);
const pistonMat = material('#dbeafe',1,.54);
const cylinderMat = material('#519ed7',.18,.18);

const show = (node, label) => {
  node.name = label;
  return node;
};
function mesh(geometry, mat, name) {return show(new THREE.Mesh(geometry,mat),name)}
function tube(r,h,mat,name) {return mesh(new THREE.CylinderGeometry(r,r,h,48),mat,name)}
function outline(geometry, color='#4877a7') {
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({color,transparent:true,opacity:.55}));
  return edges;
}
function textElement(tag,className,txt) {
  const node=document.createElement(tag); node.className=className; if(txt) node.textContent=txt; return node;
}

await runSim({
  duration:3600,
  fps:60,
  theme:'light',
  accent:theme.stage.activePart,
  hud:{enabled:false,title:'ROBO 3D',subtitle:' / LAB DEMO'},
  director:{enabled:false}
}, async ({canvas})=>{
  let renderer;
  try {
    renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:true});
  } catch(error) {
    const fail=textElement('p','r3d-error','3D rendering is not available on this device. Please enable WebGL.');
    fail.style.cssText='position:absolute;left:20px;top:55%;z-index:9;color:#20305B;background:#fff;padding:20px';
    document.getElementById('app').appendChild(fail);
    throw error;
  }
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(theme.stage.background);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.25;
  const camera=new THREE.PerspectiveCamera(33,1,.1,150);
  scene.add(new THREE.HemisphereLight('#f6fbff','#6f91b0',3.3));
  const key=new THREE.DirectionalLight('#ffffff',4);
  key.position.set(-7,11,16);scene.add(key);
  const rim=new THREE.DirectionalLight('#45aafb',2.1);
  rim.position.set(7,4,-9);scene.add(rim);

  const grid=new THREE.GridHelper(35,35,'#a0cbea','#cde4f7');
  grid.position.y=-4.7;
  scene.add(grid);
  const underlay=mesh(new THREE.PlaneGeometry(200,200),material(theme.stage.floor,1),'studio-floor');
  underlay.rotation.x=-Math.PI/2;underlay.position.y=-4.73;scene.add(underlay);

  const assembly=new THREE.Group();
  scene.add(assembly);
  const backMat=material('#a6c4df',.24);
  for (const side of [-1,1]){
    const rail=mesh(new THREE.BoxGeometry(.13,8.6,.14),backMat,'guide-rail');
    rail.position.set(side*2.02,2.15,-1.55);assembly.add(rail);
  }
  for (const y of [-2.4,6.4]){
    const beam=mesh(new THREE.BoxGeometry(4.2,.14,.16),backMat,'support-bar');
    beam.position.set(0,y,-1.55);assembly.add(beam);
  }

  const crankGroup=new THREE.Group(); crankGroup.position.y=DIMENSIONS.originY;assembly.add(crankGroup);
  const flywheel=tube(2.42,.35,metalMat,'flywheel');
  flywheel.rotation.x=Math.PI/2;crankGroup.add(flywheel);
  const frontRing=mesh(new THREE.TorusGeometry(2.18,.1,12,88),activeMat,'flywheel-rim');
  frontRing.position.z=.24;crankGroup.add(frontRing);
  const crankStem=mesh(new THREE.BoxGeometry(.32,1.8,.39),activeMat,'crank-arm');
  crankStem.position.set(0,.87,.28);crankGroup.add(crankStem);
  const pin=mesh(new THREE.SphereGeometry(.27,24,16),activeMat,'crank-pin');
  pin.position.set(0,1.8,.48);crankGroup.add(pin);
  for(let i=0;i<6;i++){
    const spoke=mesh(new THREE.BoxGeometry(.12,3.55,.09),material('#9bc1dd',1,.4),'flywheel-spoke');
    spoke.rotation.z=i*Math.PI/3;spoke.position.z=.22;crankGroup.add(spoke);
  }
  const shaft=tube(.34,.86,metalMat,'drive-shaft');
  shaft.rotation.x=Math.PI/2;shaft.position.z=.48;crankGroup.add(shaft);

  const rod=tube(.17,DIMENSIONS.connectingRodMm/10,rodMat,'connecting-rod');
  rod.geometry.translate(0,0,0);rod.position.z=.52;assembly.add(rod);
  const lowerEye=mesh(new THREE.SphereGeometry(.25,24,16),metalMat,'rod-lower-eye');assembly.add(lowerEye);
  const upperEye=mesh(new THREE.SphereGeometry(.25,24,16),metalMat,'rod-upper-eye');assembly.add(upperEye);
  const pistonGroup=new THREE.Group();assembly.add(pistonGroup);
  const piston=tube(DIMENSIONS.pistonDiameterMm/20,1.45,pistonMat,'piston');
  piston.position.y=.39;pistonGroup.add(piston);
  for(let y of [-.1,.24,.59]){
    const ring=mesh(new THREE.TorusGeometry(1.405,.045,9,66),rodMat,'piston-ring');
    ring.rotation.x=Math.PI/2;ring.position.y=y+.35;pistonGroup.add(ring);
  }
  const wrist=tube(.16,2.9,metalMat,'wrist-pin');wrist.rotation.x=Math.PI/2;wrist.position.y=-.1;pistonGroup.add(wrist);

  const housingGroup=new THREE.Group();assembly.add(housingGroup);
  const housing=mesh(new THREE.CylinderGeometry(1.59,1.59,6.25,72,1,true,Math.PI*.08,Math.PI*1.55),cylinderMat,'glass-cylinder');
  housing.position.y=4.25;housing.rotation.y=1.12;housingGroup.add(housing);
  const bottomRim=mesh(new THREE.TorusGeometry(1.59,.075,12,72),mutedMat,'housing-bottom-rim');bottomRim.rotation.x=Math.PI/2;bottomRim.position.y=1.125;housingGroup.add(bottomRim);
  const topRim=mesh(new THREE.TorusGeometry(1.59,.075,12,72),mutedMat,'housing-top-rim');topRim.rotation.x=Math.PI/2;topRim.position.y=7.375;housingGroup.add(topRim);
  for(const x of [-1.59,1.59]){
    const edge=mesh(new THREE.BoxGeometry(.055,6.25,.055),mutedMat,'housing-guide');
    edge.position.set(x,4.25,0);housingGroup.add(edge);
  }

  const app=document.getElementById('app');
  const ui=textElement('div','r3d-ui'); ui.setAttribute('aria-label','Robo Lab 3D simulation controls');
  ui.innerHTML=`
    <header class="mast"><img id="robo-logo" alt="Robo Lab" /><span class="edition">Robo Lab / Interactive 3D</span></header>
    <section class="intro" aria-label="Introduction">
      <span class="tag">01 / MECHANISM LAB</span>
      <h1>機構を、<br>触って理解する。</h1>
      <p>クランクの回転が、ピストンの往復運動へ。分解して、構造と動きを確かめよう。</p>
      <div class="spec"><span class="pulse"></span><span>REFERENCE-DRIVEN · THREE.JS</span></div>
    </section>
    <aside class="inspector" aria-label="Measurements">
      <h2>LIVE MEASUREMENTS</h2>
      <div class="metric highlight"><span>ピストン変位</span><strong id="metric-stroke">0.0</strong><em>mm</em></div>
      <div class="metric"><span>クランク角</span><strong id="metric-angle">0</strong><em>deg</em></div>
      <div class="metric"><span>連接棒の傾き</span><strong id="metric-rod">0.0</strong><em>deg</em></div>
      <div class="metric"><span>選択中の部品</span><strong id="metric-part" style="font-size:15px">全部品</strong></div>
    </aside>
    <div class="status">DRAG TO ROTATE · SCROLL TO ZOOM</div>
    <div class="viewhint" id="state-label">回転 → 往復運動</div>
    <nav class="controls" aria-label="3D controls">
      <div class="control-unit"><label>操作 / VIEW MODE</label>
        <div class="button-row">
          <button id="play" class="primary" type="button" aria-pressed="true">一時停止</button>
          <button id="cut" type="button" aria-pressed="false">断面表示</button>
          <button id="explode" type="button" aria-pressed="false">分解表示</button>
          <button id="tour" type="button" aria-pressed="false">自動ツアー</button>
          <button id="reset" type="button">リセット</button>
        </div>
      </div>
      <div class="control-unit"><label>部品選択 / INSPECT</label>
        <div class="button-row">
          <button id="part-all" type="button" aria-pressed="true">すべて</button>
          <button id="part-crank" type="button" aria-pressed="false">クランク</button>
          <button id="part-rod" type="button" aria-pressed="false">連接棒</button>
          <button id="part-piston" type="button" aria-pressed="false">ピストン</button>
          <button id="part-cylinder" type="button" aria-pressed="false">シリンダー</button>
        </div>
      </div>
      <div class="control-unit speed-unit"><label for="speed">回転速度 / RPM</label><div class="speed">
        <input id="speed" type="range" min="10" max="160" step="10" value="60" aria-label="回転速度（RPM）" /><output id="speed-value">60 rpm</output>
      </div></div>
      <p class="footnote"><span>教材用の概念モデル。内部寸法は実機の計測値ではありません。</span><a href="https://github.com/elvarofficial/teardown" target="_blank" rel="noreferrer">Upstream MIT</a></p>
    </nav>`;
  ui.querySelector('#robo-logo').src=logo;
  app.appendChild(ui);

  const $=id=>ui.querySelector('#'+id);
  const btn=(id,fn)=>$(id).addEventListener('click',fn);
  const displayNames={all:'全部品',crank:'クランク',rod:'連接棒',piston:'ピストン',cylinder:'シリンダー'};
  const states={playing:!matchMedia('(prefers-reduced-motion: reduce)').matches, cut:false, exploded:false, tour:false, selected:'all',rpm:60};
  const cam={az:0.32,el:0.15,d:25};
  let frameTime=0, startTime=0, anchorAngle=0, frozenAngle=0, liveAngle=0;
  let explosionLevel=0,drag=null,firstFrame=true;

  function setPlaying(p){
    if(states.playing===p)return;
    anchorAngle=liveAngle;startTime=frameTime;
    states.playing=p;
    frozenAngle=liveAngle;
    updateControls();
  }
  function relinquish(){if(states.tour){states.tour=false;updateControls()}}
  function updateControls(){
    $('play').textContent=states.playing?'一時停止':'再生';
    $('play').setAttribute('aria-pressed',String(states.playing));
    $('cut').setAttribute('aria-pressed',String(states.cut));
    $('explode').setAttribute('aria-pressed',String(states.exploded));
    $('tour').setAttribute('aria-pressed',String(states.tour));
    for(const k of Object.keys(displayNames)) $('part-'+k).setAttribute('aria-pressed',String(states.selected===k));
    $('speed-value').textContent=states.rpm+' rpm';
    $('metric-part').textContent=displayNames[states.selected];
  }
  btn('play',()=>{relinquish();setPlaying(!states.playing)});
  btn('cut',()=>{relinquish();states.cut=!states.cut;updateControls()});
  btn('explode',()=>{relinquish();states.exploded=!states.exploded;updateControls()});
  btn('tour',()=>{
    states.tour=!states.tour;startTime=frameTime;
    if(states.tour)setPlaying(true);
    updateControls();
  });
  btn('reset',()=>{
    Object.assign(states,{playing:!matchMedia('(prefers-reduced-motion: reduce)').matches,cut:false,exploded:false,tour:false,selected:'all',rpm:60});
    Object.assign(cam,{az:.32,el:.15,d:25});anchorAngle=0;frozenAngle=0;startTime=frameTime;updateControls();
  });
  for(const k of Object.keys(displayNames)){
    btn('part-'+k,()=>{relinquish();states.selected=k;updateControls()});
  }
  $('speed').addEventListener('input',()=>{
    relinquish();anchorAngle=liveAngle;startTime=frameTime;
    states.rpm=Number($('speed').value);updateControls();
  });
  canvas.tabIndex=0;
  canvas.setAttribute('role','application');
  canvas.setAttribute('aria-label','Interactive 3D slider crank, drag to rotate view, use the controls below');
  canvas.addEventListener('pointerdown',e=>{
    relinquish();drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);canvas.classList.add('dragging');
  });
  canvas.addEventListener('pointermove',e=>{
    if(!drag)return;
    cam.az=clamp(cam.az+(e.clientX-drag.x)*.006,-1.5,1.5);
    cam.el=clamp(cam.el+(e.clientY-drag.y)*-.006,-.9,.9);
    drag={x:e.clientX,y:e.clientY};
  });
  const endDrag=()=>{drag=null;canvas.classList.remove('dragging')};
  canvas.addEventListener('pointerup',endDrag);
  canvas.addEventListener('pointercancel',endDrag);
  canvas.addEventListener('wheel',e=>{e.preventDefault();relinquish();cam.d=clamp(cam.d+e.deltaY*.02,15,41)},{passive:false});
  document.addEventListener('keydown',e=>{
    if(e.target?.matches('button,input'))return;
    const key=e.key.toLowerCase();
    if([' ','e','c','r','arrowleft','arrowright'].includes(key)){
      e.preventDefault();
      relinquish();
      if(key===' ')setPlaying(!states.playing);
      if(key==='e')states.exploded=!states.exploded;
      if(key==='c')states.cut=!states.cut;
      if(key==='r')$('reset').click();
      if(key==='arrowleft'||key==='arrowright'){
        setPlaying(false);
        frozenAngle+=key==='arrowleft'?-Math.PI/12:Math.PI/12;
        liveAngle=frozenAngle;
      }
      updateControls();
    }
  });
  function resize(){
    const w=canvas.clientWidth||innerWidth,h=canvas.clientHeight||innerHeight;
    const pr=Math.min(devicePixelRatio||1,w<700?1.35:1.8);
    renderer.setPixelRatio(pr);
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    camera.updateProjectionMatrix();
  }
  updateControls();
  function render(t){
    frameTime=t;
    if(states.tour){
      const part=(t-startTime)%21;
      states.cut=part>=6;
      states.exploded=part>=12&&part<18;
      states.selected=part>=12&&part<18?'rod':'all';
      cam.az=.2+Math.sin(part*.35)*.35;
      updateControls();
    }
    const th=states.playing?anchorAngle+(t-startTime)*states.rpm*Math.PI*2/60:frozenAngle;
    liveAngle=th;
    const p=pose(th);
    explosionLevel+=(Number(states.exploded)-explosionLevel)*.16;
    crankGroup.rotation.z=-th;
    crankGroup.position.x=-3.2*explosionLevel;
    pistonGroup.position.set(1.45*explosionLevel,p.sliderY,0);
    housingGroup.position.x=4.0*explosionLevel;
    housing.visible=!states.cut;
    topRim.visible=!states.cut;
    bottomRim.visible=!states.cut;
    const a=new THREE.Vector3(p.crankX,p.crankY,.56);
    const b=new THREE.Vector3(0,p.sliderY,.56);
    rod.position.copy(a.clone().add(b).multiplyScalar(.5));
    rod.position.x+=-1.15*explosionLevel;
    const v=b.sub(a);
    rod.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.clone().normalize());
    lowerEye.position.set(p.crankX-1.15*explosionLevel,p.crankY,.56);
    upperEye.position.set(-1.15*explosionLevel,p.sliderY,.56);
    rod.scale.y=v.length()/(DIMENSIONS.connectingRodMm/10);
    const partColors=[
      [metalMat,'crank'],[activeMat,'crank'],
      [rodMat,'rod'],[pistonMat,'piston'],[cylinderMat,'cylinder'],
    ];
    for (const [m,k] of partColors) {
      const on=states.selected==='all'||states.selected===k;
      m.opacity=(m===cylinderMat?(.12*(on?1:.5)):(on?1:.28));
      m.transparent=true;
      m.depthWrite=m!==cylinderMat;
    }
    camera.position.set(Math.sin(cam.az)*cam.d,2.2+Math.sin(cam.el)*cam.d,Math.cos(cam.az)*cam.d);
    camera.lookAt(0,1.2,0);
    renderer.render(scene,camera);
    $('metric-stroke').textContent=p.strokeMm.toFixed(1);
    $('metric-angle').textContent=(((th*180/Math.PI)%360)+360)%360|0;
    $('metric-rod').textContent=p.rodTiltDeg.toFixed(1);
    $('state-label').textContent=states.exploded?'部品を分解して構造を確認':states.cut?'シリンダーを断面表示中':'回転 → 往復運動';
    if(firstFrame){firstFrame=false;root.dataset.robo3dReady='true'}
    window.__ROBO3D_LASTPOSE__={strokeMm:p.strokeMm,crankDeg:th*180/Math.PI,rodLengthMm:p.rodLength*10};
    return {};
  }
  window.ROBO_3D={getState:()=>({...states,angle:liveAngle,theme}),poseAt:pose,setAngle:(theta)=>{setPlaying(false);frozenAngle=theta;liveAngle=theta},setExploded:(v)=>{states.exploded=!!v;updateControls()},setCutaway:(v)=>{states.cut=!!v;updateControls()}};
  return {resize,render};
});
