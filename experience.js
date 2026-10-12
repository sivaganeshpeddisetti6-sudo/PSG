import * as THREE from 'three';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';
const modes=[
 {title:'A better way<br>through broken links.',description:'An AI-based application that finds alternative destinations for broken links.',metric:'3,000+',unit:'broken links removed'},
 {title:'The right access.<br>At the right time.',description:'Identity and access management across 26 departments, plus automated WordPress access removal.',metric:'26',unit:'departments · IAM managed'},
 {title:'Make the next<br>step clear.',description:'SEO, meta descriptions, and action-oriented degree-page content for prospective students.',metric:'SEO',unit:'with a student-first perspective'},
 {title:'One command.<br>Institutional scale.',description:'A workflow that deploys configuration changes across approximately 200 university websites.',metric:'200+',unit:'websites updated through one workflow'}
];
const host=document.querySelector('#scene'),spread=document.querySelector('#spread');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let mode=0,amount=.48,rotationY=-.22,rotationX=0,dirty=true;
function setMode(n){mode=n;const m=modes[n];document.querySelector('#scene-title').innerHTML=m.title;document.querySelector('#scene-description').textContent=m.description;document.querySelector('#scene-metric').textContent=m.metric;document.querySelector('#scene-unit').textContent=m.unit;for(const b of document.querySelectorAll('[data-mode]'))b.setAttribute('aria-pressed',String(+b.dataset.mode===n));dirty=true;}
for(const b of document.querySelectorAll('[data-mode]'))b.addEventListener('click',()=>setMode(+b.dataset.mode));
spread.addEventListener('input',()=>{amount=+spread.value/100;dirty=true;});
document.querySelector('#reset-scene').addEventListener('click',()=>{rotationX=0;rotationY=-.22;amount=.48;spread.value=48;dirty=true;});
host.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();if(e.key==='ArrowLeft')rotationY-=.2;if(e.key==='ArrowRight')rotationY+=.2;if(e.key==='ArrowUp')rotationX=Math.max(-.5,rotationX-.12);if(e.key==='ArrowDown')rotationX=Math.min(.5,rotationX+.12);dirty=true;}});
let drag=null;
host.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY};host.setPointerCapture(e.pointerId);});
host.addEventListener('pointermove',e=>{if(!drag)return;rotationY+=(e.clientX-drag.x)*.008;rotationX=Math.max(-.5,Math.min(.5,rotationX+(e.clientY-drag.y)*.003));drag={x:e.clientX,y:e.clientY};dirty=true;});
for(const event of ['pointerup','pointercancel','lostpointercapture'])host.addEventListener(event,()=>drag=null);
try{
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0x000000,0);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,80);camera.position.set(5.7,5.3,7.3);camera.lookAt(0,.2,0);
 const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();const env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xffffff,0xb3b0a8,2));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(-3,8,5);light.castShadow=true;light.shadow.mapSize.set(1024,1024);light.shadow.camera.left=-6;light.shadow.camera.right=6;light.shadow.camera.top=6;light.shadow.camera.bottom=-6;light.shadow.normalBias=.035;scene.add(light);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.16}));floor.rotation.x=-Math.PI/2;floor.position.y=-2.0;floor.receiveShadow=true;scene.add(floor);
 const group=new THREE.Group();scene.add(group);
 const orange=new THREE.MeshStandardMaterial({color:0xff5100,metalness:.12,roughness:.3});
 const silver=new THREE.MeshStandardMaterial({color:0xe5e5e1,metalness:.6,roughness:.2});
 const black=new THREE.MeshStandardMaterial({color:0x232323,metalness:.25,roughness:.35});
 function rounded(w,h,r){const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);return s;}
 function label(text,sub,dark){const c=document.createElement('canvas');c.width=512;c.height=320;const x=c.getContext('2d');x.fillStyle=dark?'#ffffff':'#171717';x.font='bold 116px Arial';x.textAlign='center';x.fillText(text,256,156);x.font='24px Arial';x.fillText(sub,256,218);const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;return new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false});}
 const labels=[['AI','BROKEN LINKS'],['IAM','IDENTITY / ACCESS'],['SEO','DEGREE PAGES'],['OPS','AUTOMATION'],['SG.','SYSTEMS ENGINEERING']];
 const modules=[];
 for(let i=0;i<5;i++){
  const mod=new THREE.Group();const w=i===4?2.1:2.05,h=i===4?1.55:1.45;
  const geo=new THREE.ExtrudeGeometry(rounded(w,h,.14),{depth:.48,bevelEnabled:true,bevelThickness:.045,bevelSize:.045,bevelSegments:3,steps:1,curveSegments:10});geo.rotateX(-Math.PI/2);geo.translate(0,-.24,0);
  const body=new THREE.Mesh(geo,i===4?orange:i===1?black:silver);body.castShadow=true;body.receiveShadow=true;mod.add(body);
  const face=new THREE.Mesh(new THREE.PlaneGeometry(w*.85,h*.85),label(labels[i][0],labels[i][1],i===1));face.rotation.x=-Math.PI/2;face.position.y=.295;mod.add(face);
  for(const x of [-.8,.8])for(const z of [-.49,.49]){const bolt=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.035,10),i===1?silver:black);bolt.position.set(x,.28,z);mod.add(bolt);}
  group.add(mod);modules.push(mod);
 }
 const rods=[];for(let i=0;i<4;i++){const rod=new THREE.Mesh(new THREE.CylinderGeometry(.028,.028,1,12),orange);rod.castShadow=true;group.add(rod);rods.push(rod);}
 const layouts=[[[1.15,1.05,-.5],[-1.25,.1,-.55],[1.1,-.7,.9],[-1.2,-1.2,1],[0,-.1,.1]],[[0,1.5,0],[0,.75,0],[0,0,0],[0,-.75,0],[0,-1.5,0]],[[-1.5,.4,-.75],[1.3,.6,-.6],[1.3,-.7,1],[-1.4,-.65,1],[0,0,0]],[[1.4,.7,-.7],[1.4,-.6,1],[-1.3,-.6,1],[-1.3,.7,-.7],[0,.2,0]]];
 const targets=modules.map(()=>new THREE.Vector3());const up=new THREE.Vector3(0,1,0);
 function update(snap){group.rotation.set(rotationX,rotationY,0);let active=false;for(let i=0;i<5;i++){let p=layouts[mode][i],f=.58+amount*.85;targets[i].set(p[0]*f,p[1]*(.65+amount),p[2]*f);if(snap)modules[i].position.copy(targets[i]);else modules[i].position.lerp(targets[i],.13);if(modules[i].position.distanceTo(targets[i])>.004)active=true;}
  for(let i=0;i<4;i++){const a=modules[4].position,b=modules[i].position,dir=new THREE.Vector3().subVectors(b,a);rods[i].position.copy(a).add(b).multiplyScalar(.5);rods[i].scale.y=dir.length();rods[i].quaternion.setFromUnitVectors(up,dir.normalize());}
  return active;
 }
 host.appendChild(renderer.domElement);host.querySelector('.scene-fallback').hidden=true;
 function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.set(5.7,5.3,7.3).multiplyScalar(w<440?1.25:1);camera.lookAt(0,.1,0);camera.updateProjectionMatrix();dirty=true;}
 new ResizeObserver(resize).observe(host);resize();update(true);
 let visible=true,last=0;new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible)dirty=true;}).observe(host);
 function frame(time){requestAnimationFrame(frame);if(!visible||document.hidden||time-last<30)return;if(!dirty)return;last=time;dirty=update(reduced.matches);renderer.render(scene,camera);}
 requestAnimationFrame(frame);
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();renderer.domElement.hidden=true;host.querySelector('.scene-fallback').hidden=false;document.querySelector('#scene-hint').textContent='SYSTEMS / IDENTITY / CONTENT / AUTOMATION';});
}catch(error){console.warn('3D fallback:',error.message);document.querySelector('#scene-hint').textContent='SYSTEMS / IDENTITY / CONTENT / AUTOMATION';}
