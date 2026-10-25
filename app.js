const $=s=>document.querySelector(s);
const S={mode:'pic',diff:'easy',time:60,teams:1,names:[],scores:[],cur:0,turns:0,cat:null};
const COLORS=['#ff5c8a','#ff9a3c','#2fbf71','#3fa9f5','#a259ff','#f5b700','#00b3a4','#e53935'];
try{Object.assign(S,JSON.parse(localStorage.hu||'{}'))}catch(e){}
const save=()=>localStorage.hu=JSON.stringify({mode:S.mode,diff:S.diff,time:S.time,teams:S.teams,names:S.names,scores:S.scores,cur:S.cur,turns:S.turns});
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id))}
function seg(id,key,num,cb){const el=$(id);el.querySelectorAll('button').forEach(b=>{b.classList.toggle('on',String(S[key])===b.dataset.v);
 b.onclick=()=>{S[key]=num?+b.dataset.v:b.dataset.v;el.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));save();cb&&cb()}})}
function ui(){ $('#diffBox').style.display=S.mode==='word'?'':'none';$('#labelBox').style.display=S.mode==='pic'?'':'none';
 const tn=$('#teamNames');tn.innerHTML='';if(S.teams>1)for(let i=0;i<S.teams;i++){const inp=document.createElement('input');
  inp.value=S.names[i]||('קבוצה '+(i+1));inp.oninput=()=>{S.names[i]=inp.value;save();board()};S.names[i]=inp.value;tn.appendChild(inp)}
 while(S.scores.length<S.teams)S.scores.push(0);S.scores.length=S.teams;if(S.cur>=S.teams)S.cur=0;board();save()}
function leaders(){const m=Math.max(...S.scores.slice(0,S.teams));return m>0?S.scores.map((v,i)=>v===m?i:-1).filter(i=>i>=0):[]}
function board(){let h='';if(S.teams>1){const L=leaders();
 h='<div class="board">'+S.names.slice(0,S.teams).map((n,i)=>`<div class="${i===S.cur?'cur':''} ${L.includes(i)?'lead':''}" data-t="${i}">${L.includes(i)?'👑 ':''}${esc(n)}<b>${S.scores[i]}</b>${i===S.cur?'<small>בתור ▶</small>':''}</div>`).join('')+'</div>'+
 `<div class="rnd">סיבוב ${Math.floor(S.turns/S.teams)+1} · תורות ששוחקו: ${S.turns}</div>`}
 $('#board').innerHTML=h;$('#board2').innerHTML=h;$('#endGame').style.display=S.teams>1&&S.turns>0?'':'none'}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
seg('#modeSeg','mode',0,ui);seg('#diffSeg','diff',0);seg('#timeSeg','time',1);seg('#teamSeg','teams',1,ui);
function resetGame(){S.scores=S.scores.map(()=>0);S.cur=0;S.turns=0;ui()}
$('#resetScores').onclick=resetGame;
function winner(){const L=leaders(),names=S.names.slice(0,S.teams);
 $('#winTitle').textContent=L.length===0?'אין עדיין נקודות':L.length>1?'תיקו! 🤝 '+L.map(i=>names[i]).join(' ו'):'🏆 '+names[L[0]]+' ניצחו!';
 const order=names.map((n,i)=>i).sort((a,b)=>S.scores[b]-S.scores[a]);
 $('#winList').innerHTML=order.map((i,r)=>`<li class="${L.includes(i)?'lead':''}"><span>${['🥇','🥈','🥉','4️⃣'][r]} ${esc(names[i])}</span><b>${S.scores[i]}</b></li>`).join('');
 if(L.length===1)[0,300,600].forEach(t=>setTimeout(()=>beep(880+t,.2,'square',.12),t));show('win')}
$('#endGame').onclick=winner;$('#endGame2').onclick=winner;
$('#newGame').onclick=()=>{resetGame();show('home')};$('#winHome').onclick=()=>{ui();show('home')};
$('#invert').checked=localStorage.huInv==='1';$('#invert').onchange=e=>localStorage.huInv=e.target.checked?'1':'0';
const mixB=document.createElement('button');mixB.className='mix';mixB.innerHTML='<b>🎲</b>ערבוב הכול';mixB.onclick=()=>pick('mix');$('#cats').appendChild(mixB);
Object.entries(CATS).forEach(([k,c],i)=>{const b=document.createElement('button');b.style.background=COLORS[i%COLORS.length];
 b.innerHTML=`<b>${c.icon}</b>${c.name}`;b.onclick=()=>pick(k);$('#cats').appendChild(b)});
ui();
// audio
let ac;function beep(f,d=.12,t='sine',v=.25){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();
 o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}
const vib=p=>navigator.vibrate&&navigator.vibrate(p);
const sndOk=()=>{beep(660);setTimeout(()=>beep(990,.18),90);vib(60)}, sndSkip=()=>{beep(300,.2,'triangle');vib([30,40,30])};
const sndEnd=()=>{[523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,.25,'square',.15),i*150));vib(400)};
// motion
let motionOK=false;
async function askMotion(){try{if(window.DeviceMotionEvent&&typeof DeviceMotionEvent.requestPermission==='function'){motionOK=(await DeviceMotionEvent.requestPermission())==='granted'}else motionOK='DeviceMotionEvent' in window}catch(e){motionOK=false}}
async function lockLand(){try{await document.documentElement.requestFullscreen?.();await screen.orientation?.lock?.('landscape')}catch(e){}}
function pick(k){S.cat=k;const ci=k==='mix'?'🎲':CATS[k].icon;$('#readyTeam').textContent=(S.teams>1?'תור של: '+S.names[S.cur]:'מוכנים?')+' '+ci;show('ready');askMotion()}
$('#back1').onclick=()=>show('home');
$('#go').onclick=async()=>{beep(1);await askMotion();lockLand();countdown()};
function countdown(){show('count');let n=3;const el=$('#countNum');const step=()=>{if(n===0){el.textContent='צא!';beep(880,.4);setTimeout(start,600);return}
 el.textContent=n;el.style.animation='none';el.offsetHeight;el.style.animation='';beep(440);vib(50);n--;setTimeout(step,1000)};step()}
let deck=[],idx=0,ok=[],skip=[],tLeft=0,tick,armed=false,busy=false,playing=false;
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
function buildDeck(){const cs=S.cat==='mix'?Object.values(CATS):[CATS[S.cat]];const seen=new Set(),out=[];
 const add=(e,w)=>{if(!seen.has(w)){seen.add(w);out.push({e,w})}};
 cs.forEach(c=>{if(S.mode==='pic')c.pic.forEach(([e,w])=>add(e,w));else(S.diff==='all'?[...c.word.easy,...c.word.medium,...c.word.hard]:c.word[S.diff]).forEach(w=>add('',w))});return shuffle(out)}
function start(){deck=buildDeck();idx=0;ok=[];skip=[];tLeft=S.time;playing=true;armed=false;busy=false;
 const p=$('#play');p.className='screen active '+(S.mode==='pic'?'pic':'wordm');show('play');$('#scoreLive').textContent=0;render();upd();
 tick=setInterval(()=>{tLeft--;upd();if(tLeft<=5&&tLeft>0)beep(1200,.08);if(tLeft<=0)end()},1000)}
function upd(){$('#timer').textContent=tLeft;$('#timer').classList.toggle('low',tLeft<=10)}
function render(){if(idx>=deck.length){deck=deck.concat(shuffle(skip.map(w=>deck.find(d=>d.w===w)).filter(Boolean)));if(idx>=deck.length){end();return}}
 const it=deck[idx];$('#emoji').textContent=it.e;$('#emoji').style.display=it.e?'':'none';
 $('#word').textContent=(S.mode==='pic'&&!$('#showLabel').checked)?'':it.w}
function answer(good){if(!playing||busy)return;busy=true;const it=deck[idx];(good?ok:skip).push(it.e?it.e+' '+it.w:it.w);good?sndOk():sndSkip();
 $('#scoreLive').textContent=ok.length;const f=$('#flash');f.className=good?'g':'s';f.textContent=good?'✅':'⏭️';
 setTimeout(()=>{f.className='';idx++;render();busy=false},650)}
$('#bOk').onclick=()=>answer(true);$('#bSkip').onclick=()=>answer(false);
$('#quit').onclick=()=>{clearInterval(tick);playing=false;show('home')};
window.addEventListener('devicemotion',e=>{if(!playing||busy)return;const g=e.accelerationIncludingGravity;if(!g||g.z==null)return;
 let z=g.z;const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 if(ios)z=-z;if(localStorage.huInv==='1')z=-z;
 if(Math.abs(z)<3.5){armed=true;return}if(!armed)return;
 if(z<-7){armed=false;answer(true)}else if(z>7){armed=false;answer(false)}});
function end(){if(!playing)return;playing=false;clearInterval(tick);sndEnd();const played=S.cur;if(S.teams>1){S.scores[played]+=ok.length;S.turns++}
 $('#sumTitle').textContent=(S.teams>1?S.names[played]+' – ':'')+'נגמר הזמן! ⏰';$('#sumSub').textContent=S.teams>1?'+'+ok.length+' נקודות ל'+S.names[played]+' · סה"כ '+S.scores[played]:'';$('#sumScore').textContent=ok.length;
 $('#lOk').innerHTML=ok.map(x=>`<li>${esc(x)}</li>`).join('')||'<li>—</li>';$('#lSkip').innerHTML=skip.map(x=>`<li>${esc(x)}</li>`).join('')||'<li>—</li>';
 if(S.teams>1)S.cur=(S.cur+1)%S.teams;board();save();$('#nextUp').textContent=S.teams>1?'הבא בתור: '+S.names[S.cur]:'';$('#endGame2').style.display=S.teams>1?'':'none';$('#next').textContent=S.teams>1?'תור של '+S.names[S.cur]+' ▶':'סיבוב נוסף ▶';show('sum')}
$('#next').onclick=()=>pick(S.cat);$('#toHome').onclick=()=>{ui();show('home')};
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
