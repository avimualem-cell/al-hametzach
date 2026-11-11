/* v10 — host-authoritative PeerJS race. No recording, accounts or persistent room data. */
(() => {
'use strict';
const CDN='https://unpkg.com/peerjs@1.5.5/dist/peerjs.min.js', PREFIX='alhametzach-v9-';
let peer=null, link=null, host=false, code='', me='', state=null, connections=new Map();
let rejoinTries=0,myName='',ghosts=new Map(),netT=null;
let pulse=null, timeout=null, lastSeen=0, generation=0, pack=[], pos=0, lastWord='', lastPhase='', lastEvent='', motionArmed=false, localSkip='', loadPromise=null;
const cleanName=v=>String(v||'').replace(/[\u0000-\u001f\u202a-\u202e\u2066-\u2069]/g,'').trim().slice(0,24);
function send(c,m){if(c?.open)try{c.send(m)}catch(e){/* close/watchdog handles loss */}}
function dispose(){generation++;clearInterval(pulse);clearTimeout(timeout);pulse=null;timeout=null;
 const old=peer;peer=null;link=null;connections.clear();state=null;host=false;me='';lastWord=lastPhase=lastEvent='';motionArmed=false;try{old?.destroy()}catch(e){} }
function net(text){const el=$('#raceNet');if(!el)return;clearTimeout(netT);if(!text){el.hidden=true;return}el.textContent=text;el.hidden=false}
function fail(text){net('');rejoinTries=0;dispose();$('#raceErrorText').textContent=text;show('raceError');toast(text)}
function leave(){net('');rejoinTries=0;myName='';ghosts.clear();if(host)connections.forEach(c=>send(c,{type:'closed'}));else send(link,{type:'leave'});dispose();show('home')}
function loadPeer(){if(window.Peer)return Promise.resolve();if(loadPromise)return loadPromise;
 loadPromise=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=CDN;s.async=true;const timer=setTimeout(()=>{s.remove();reject(Error('timeout'))},12000);s.onload=()=>{clearTimeout(timer);window.Peer?resolve():reject(Error('missing'))};s.onerror=()=>{clearTimeout(timer);s.remove();reject(Error('cdn'))};document.head.append(s)}).catch(e=>{loadPromise=null;throw e});return loadPromise}
const offline='לא הצלחנו להתחבר לשירות החדרים. בדקו אינטרנט ונסו שוב 💜';
function connecting(){show('raceLobby');$('#raceCode').textContent='…';$('#raceLobbyStatus').textContent='מתחברים לחדר…';$('#racePlayers').innerHTML='';$('#raceStart').hidden=true;$('#raceShare').hidden=true;$('#raceSetup').textContent='';}
function snapshot(){return {...state,remaining:remaining()}}
function remaining(){return state?.phase==='play'&&!state.paused?Math.max(0,state.deadline-Date.now()):state?.remaining||0}
function publish(){if(!host||!state)return;const s=snapshot();connections.forEach(c=>send(c,{type:'state',state:s}));paint(s)}
function beginWatch(){lastSeen=Date.now();pulse=setInterval(()=>{
 if(!state)return;
 if(host){if(state.phase==='play'&&!state.paused){if(remaining()<=0){finish();return}if(state.advanceAt&&Date.now()>=state.advanceAt)nextWord()}for(const [id,c] of connections){if(Date.now()-(c._seen||0)>15000)drop(id)}publish()}
 else {send(link,{type:'ping'});const gap=Date.now()-lastSeen;if(gap>4000&&gap<=15000)net('📡 החיבור חלש — מנסים להתחבר מחדש…');if(gap>15000){if(!tryRejoin())fail('הקשר עם המארח נותק. החדר נסגר — אפשר לפתוח חדר חדש 💜')}}
 },250)}
async function create(){if(!S.cat)return;dispose();connecting();const gen=generation;host=true;
 try{await loadPeer()}catch(e){if(gen===generation)fail(offline);return}if(gen!==generation)return;
 let tries=0;const tried=new Set();const attempt=()=>{if(gen!==generation)return;let n;do{n=String(1000+Math.floor(Math.random()*9000))}while(tried.has(n));tried.add(n);code=n;const p=new Peer(PREFIX+code,{debug:0});peer=p;
 clearTimeout(timeout);timeout=setTimeout(()=>{if(gen===generation)fail(offline)},14000);
 p.on('open',id=>{if(gen!==generation||peer!==p)return;clearTimeout(timeout);if(state)return;me=id;const name=cleanName($('#raceName').value)||'קבוצה 1';state={phase:'lobby',players:[{id:me,name,score:0}],cat:catName(S.cat),age:LI()?AGES[S.age].en:AGES[S.age].he,mode:S.mode,showLabel:$('#showLabel').checked,hint:MODES[S.cat]?MODES[S.cat].hint[LI()]:'',duration:S.time*1000,remaining:S.time*1000,round:0,seq:0,event:null,paused:false};beginWatch();publish()});
 p.on('connection',c=>accept(c,gen));
 p.on('error',e=>{if(gen!==generation||peer!==p)return;if(e.type==='unavailable-id'&&tries++<12){peer=null;p.destroy();attempt()}else fail(offline)});
 let hostRetry=0;p.on('disconnected',()=>{if(gen!==generation||peer!==p)return;if(hostRetry++<3){net('📡 מתחברים מחדש לשירות החדרים…');setTimeout(()=>{try{if(gen===generation&&peer===p&&!p.destroyed)p.reconnect()}catch(e){}},1000*hostRetry)}else fail('שירות החדרים התנתק. פתחו חדר חדש ונסו שוב 💜')});p.on('open',()=>{hostRetry=0;net('')});
 };attempt()}
function tryRejoin(){if(host||!code||rejoinTries>=3||!myName&&!state)return false;rejoinTries++;const c=code,n=myName;net('📡 החיבור נפל — מתחברים מחדש ('+rejoinTries+'/3)…');setTimeout(()=>join(null,c,n,true),600);return true}
async function join(e,rc,rn,re){e?.preventDefault();if(!re)rejoinTries=0;const value=rc||$('#roomCode').value.trim();if(!/^\d{4}$/.test(value)){toast('הקלידו קוד של 4 ספרות');return}
 beep(1,.01);const name=rn!=null?rn:cleanName($('#raceName').value);const keep=re?rejoinTries:0;dispose();rejoinTries=keep;myName=name;if(!re)connecting();code=value;const gen=generation;
 try{await askMotion();await loadPeer()}catch(e){if(gen===generation)fail(offline);return}if(gen!==generation)return;
 const p=new Peer({debug:0});peer=p;timeout=setTimeout(()=>{if(gen===generation)fail('לא מצאנו את החדר. בדקו את הקוד ושהמארח עדיין כאן')},16000);
 p.on('open',id=>{if(gen!==generation)return;if(link?.open){net('');return}me=id;const c=p.connect(PREFIX+code,{reliable:true,serialization:'json'});link=c;
 c.on('open',()=>send(c,{type:'join',name,rejoin:!!re}));c.on('data',m=>{if(gen!==generation||!m||typeof m!=='object')return;
 if(m.type==='closed'){fail('המארח יצא והחדר נסגר. נתראה במירוץ הבא 💜');return}
 if(m.type==='reject'){fail(m.reason==='full'?'החדר מלא (עד 8 קבוצות). נסו חדר אחר':'המירוץ כבר התחיל. הצטרפו לחדר חדש');return}
 if(m.type==='state'&&m.state&&Array.isArray(m.state.players)){clearTimeout(timeout);if(rejoinTries){rejoinTries=0;net('✅ חזרנו לחדר!');netT=setTimeout(()=>net(''),1800)}else if(!$('#raceNet').hidden&&Date.now()-lastSeen>3000)net('');lastSeen=Date.now();if(!myName){const mine=m.state.players.find(x=>x.id===me);if(mine)myName=mine.name}state=m.state;if(!pulse)beginWatch();paint(state)}});
 c.on('close',()=>{if(gen===generation&&!tryRejoin())fail('הקשר עם המארח נותק והחדר נסגר 💜')});c.on('error',()=>{if(gen===generation&&!tryRejoin())fail(offline)});
 });p.on('error',e=>{if(gen!==generation)return;if(e&&e.type==='peer-unavailable'&&!re){fail('לא מצאנו את החדר. בדקו את הקוד ושהמארח עדיין כאן');return}if(!tryRejoin())fail(offline)});
 p.on('disconnected',()=>{if(gen!==generation)return;if(link?.open){try{p.reconnect()}catch(e){}return}if(!tryRejoin())fail(offline)});
}
function accept(c,gen){let admitted=false;const pending=setTimeout(()=>{if(!admitted)c.close()},10000);
 c.on('data',m=>{if(gen!==generation||!host||!state||!m||typeof m!=='object')return;c._seen=Date.now();
 if(m.type==='join'&&!admitted){const nm=cleanName(m.name),g=nm&&ghosts.get(nm);if(g&&state.phase!=='lobby'&&state.players.length<8&&!connections.has(c.peer)&&Date.now()-g.t<90000){ghosts.delete(nm);admitted=true;clearTimeout(pending);connections.set(c.peer,c);state.players.push({id:c.peer,name:nm,score:state.round===g.round?g.score:0});toast('🔄 '+nm+' חזרו למירוץ');net('');publish();return}
 if(state.phase!=='lobby'||state.players.length>=8||connections.has(c.peer)){send(c,{type:'reject',reason:state.players.length>=8?'full':'started'});setTimeout(()=>c.close(),500);return}
 admitted=true;clearTimeout(pending);connections.set(c.peer,c);state.players.push({id:c.peer,name:cleanName(m.name)||'קבוצה '+(state.players.length+1),score:0});publish();return}
 if(admitted){if(m.type==='leave'){c.close();drop(c.peer)}else if(m.type!=='ping')command(c.peer,m)} });
 c.on('close',()=>{clearTimeout(pending);if(gen===generation&&admitted)drop(c.peer)});c.on('error',()=>{clearTimeout(pending);if(gen===generation&&admitted)drop(c.peer)})}
function drop(id){if(!host||!state||!connections.has(id))return;connections.delete(id);const gone=state.players.find(p=>p.id===id);if(gone){ghosts.set(gone.name,{score:gone.score,round:state.round,t:Date.now()});if(state.phase==='play')toast('📡 '+gone.name+' התנתקו — יכולים לחזור עם אותו כינוי')}state.players=state.players.filter(p=>p.id!==id);
 if(state.phase==='play'&&state.players.length<2){const wait=Date.now();const chk=setInterval(()=>{if(!state||state.phase!=='play'){clearInterval(chk);return}if(state.players.length>=2){clearInterval(chk);return}if(Date.now()-wait>20000){clearInterval(chk);finish();toast('נשארה קבוצה אחת — המירוץ הסתיים')}},500);net('⏳ מחכים שהקבוצה תתחבר מחדש…');setTimeout(()=>net(''),20000)}publish()}
async function startRace(){if(!host||!state||state.phase!=='lobby'||state.players.length<2)return;beep(1,.01);await askMotion();if(!host||!state||state.phase!=='lobby'||state.players.length<2)return;
 pack=buildDeck();if(!pack.length){toast('אין מילים בקטגוריה — בחרו אחרת');return}pos=0;
 state.players.forEach(p=>p.score=0);state.round++;state.seq=0;state.phase='play';state.paused=false;state.event=null;state.advanceAt=0;state.remaining=state.duration;state.deadline=Date.now()+state.duration;nextWord();publish()}
function nextWord(){if(!host||!state)return;if(pos>=pack.length){shuffle(pack);pos=0}state.item=pack[pos++];state.mode=curMode;state.seq++;state.advanceAt=0;state.event=null;publish()}
function finish(){if(!host||!state||state.phase!=='play')return;state.phase='results';state.remaining=0;state.paused=false;state.advanceAt=0;publish()}
function request(type){if(!state)return;beep(1,.01);const msg={type,round:state.round,seq:state.seq};if(host)command(me,msg);else send(link,msg)}
function command(id,m){if(!host||!state||!state.players.some(p=>p.id===id))return;
 if(m.type==='end'&&id===me){finish();return}
 if(state.phase!=='play'||m.round!==state.round)return;
 if(!state.paused&&remaining()<=0){finish();return}
 if(m.type==='pause'&&!state.paused){state.remaining=remaining();state.paused=true;state.advanceLeft=state.advanceAt?Math.max(0,state.advanceAt-Date.now()):0;publish();return}
 if(m.type==='resume'&&state.paused){state.deadline=Date.now()+state.remaining;state.paused=false;if(state.advanceAt)state.advanceAt=Date.now()+state.advanceLeft;publish();return}
 if(state.paused||state.advanceAt||m.seq!==state.seq)return;
 if(m.type==='correct'){const winner=state.players.find(p=>p.id===id);winner.score++;state.event={id:state.round+':'+state.seq,name:winner.name};state.advanceAt=Date.now()+850;publish()}
 if(m.type==='globalSkip'&&id===me){state.event={id:state.round+':'+state.seq,name:'דילוג לכולם',skip:true};state.advanceAt=Date.now()+650;publish()}
}
function paint(s){if(!s)return;const screen=s.phase==='lobby'?'raceLobby':s.phase==='play'?'racePlay':'raceResults';
 if(lastPhase!==s.phase){show(screen);lastPhase=s.phase;motionArmed=false;if(s.phase==='results'){sndEnd();const top=Math.max(...s.players.map(p=>p.score));if(s.players.some(p=>p.id===me&&p.score===top)){confetti(100);sndWin()}}}
 if(s.phase==='lobby'){$('#raceCode').textContent=code;$('#raceSetup').textContent=s.cat+' · '+s.age+' · '+s.duration/1000+' שניות';$('#raceShare').hidden=false;$('#racePlayers').innerHTML=s.players.map((p,i)=>`<li>🎈 ${esc(p.name)} ${i===0?'👑 מארח':''}${p.id===me?' (אתם)':''}</li>`).join('');$('#raceStart').hidden=!host;$('#raceStart').disabled=s.players.length<2;$('#raceLobbyStatus').textContent=host?(s.players.length<2?'מחכים לעוד קבוצה…':s.players.length+' קבוצות מוכנות!'):'נכנסתם! מחכים למארח שיתחיל';return}
 const sorted=[...s.players].sort((a,b)=>b.score-a.score),top=sorted[0]?.score||0;
 if(s.phase==='results'){$('#raceWinner').textContent=sorted.filter(p=>p.score===top).map(p=>p.name).join(' ו')+(sorted.filter(p=>p.score===top).length>1?' — תיקו! 🤝':' — ניצחו! 👑');$('#raceRanks').innerHTML=sorted.map((p,i)=>`<li><span>${['🥇','🥈','🥉'][i]||String(i+1)+'.'} ${esc(p.name)}</span><b>${p.score}</b></li>`).join('');$('#raceAgain').hidden=!host;$('#raceAgainWait').hidden=host;return}
 $('#raceTimer').textContent=Math.ceil(s.remaining/1000);$('#raceTimer').classList.toggle('low',s.remaining<=10000);
 $('#raceBoard').innerHTML=sorted.map(p=>`<span class="${p.score===top?'lead':''}" title="${esc(p.name)}"><span class="race-player-name">${p.score===top?'👑 ':''}${esc(p.name)}</span><b>${p.score}</b></span>`).join('');
 $('#raceGlobalSkip').hidden=!host;$('#raceEnd').hidden=!host;$('#racePaused').classList.toggle('on',s.paused);
 const key=s.round+':'+s.seq;if(key!==lastWord){lastWord=key;localSkip='';motionArmed=false;const it=s.item||{w:'',e:''};const im=$('#raceImage'),em=$('#raceEmoji');im.hidden=true;em.hidden=true;
 if(it.e){if(HAVE.has(imgOf(it.e))){im.src=imgOf(it.e);im.alt=it.w;im.hidden=false;im.onerror=()=>{im.hidden=true;em.textContent=it.e;em.hidden=false}}else {em.textContent=it.e;em.hidden=false}}
 $('#raceWord').textContent=s.mode==='pic'&&it.e&&!s.showLabel?'':it.w;$('#raceHint').textContent=s.hint;$('#raceSkip').disabled=false;}
 const f=$('#raceFlash');f.classList.toggle('on',!!s.event);f.textContent=s.event?(s.event.skip?'⏭️ דילוג לכולם':'✅ '+s.event.name+' זכו בנקודה!'):'';
 if(s.event&&lastEvent!==s.event.id){lastEvent=s.event.id;s.event.skip?sndSkip():sndOk()}
 $('#raceCorrect').disabled=!!s.event||s.paused;$('#raceSkip').disabled=localSkip===key||!!s.event||s.paused;
}
function skipLocal(){if(!state||state.phase!=='play'||state.paused||state.event)return;if(localSkip===state.round+':'+state.seq)return;localSkip=state.round+':'+state.seq;$('#raceSkip').disabled=true;sndSkip();toast('לא יודעים? חכו — אולי קבוצה אחרת תנחש!')}
window.HURace={active:()=>!!state&&state.phase==='play',motion(e){if(!state||state.phase!=='play'||state.paused||state.event)return;let z=e.accelerationIncludingGravity?.z;if(z==null)return;
 if(/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1))z=-z;if(localStorage.huInv==='1')z=-z;const[a,tr]=window.HUtilt?window.HUtilt.thr():[3.5,7];
 if(Math.abs(z)<a){motionArmed=true;return}if(!motionArmed)return;if(z<-tr){motionArmed=false;request('correct')}else if(z>tr){motionArmed=false;skipLocal()}}};
$('#raceHost').onclick=create;$('#raceJoinForm').onsubmit=join;$('#raceStart').onclick=startRace;
$('#raceCorrect').onclick=()=>request('correct');$('#raceSkip').onclick=skipLocal;$('#raceGlobalSkip').onclick=()=>request('globalSkip');$('#racePause').onclick=()=>request('pause');$('#raceResume').onclick=()=>request('resume');$('#raceEnd').onclick=()=>{if(confirm('לסיים את המירוץ ולראות תוצאות?'))request('end')};
['raceExit','racePausedExit','raceLobbyExit'].forEach(id=>$('#'+id).onclick=()=>{if(confirm(host?'לצאת? החדר ייסגר לכולם':'לצאת מהחדר?'))leave()});
['raceHome','raceErrorHome'].forEach(id=>$('#'+id).onclick=leave);
$('#raceAgain').onclick=()=>{if(!host||!state)return;state.phase='lobby';state.event=null;publish()};
$('#raceShare').onclick=async()=>{const u=new URL(location.href);u.search='';u.searchParams.set('room',code);u.hash='';const b=$('#raceShare'),msg=$('#raceShareMsg');const done=t=>{b.classList.add('copied');b.textContent='✅ הועתק!';msg.textContent=t;clearTimeout(b._t);b._t=setTimeout(()=>{b.classList.remove('copied');b.textContent='🔗 העתקת קישור לחדר';msg.textContent=''},2600)};
 let okc=false;try{await navigator.clipboard.writeText(u.href);okc=true}catch(e){try{const ta=document.createElement('textarea');ta.value=u.href;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.append(ta);ta.select();okc=document.execCommand('copy');ta.remove()}catch(e2){}}
 if(okc){done('הקישור הועתק — שלחו לחברים (קוד '+code+')');toast('הקישור הועתק! שלחו לחברים')}else if(navigator.share){navigator.share({title:'על המצח! מירוץ',text:'בואו למירוץ! קוד חדר '+code,url:u.href}).then(()=>done('הקישור נשלח')).catch(()=>{})}else{prompt('העתיקו את הקישור לחברים:',u.href)}};
window.addEventListener('pagehide',()=>{if(host)connections.forEach(c=>send(c,{type:'closed'}));dispose()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&host&&state?.phase==='play')request('pause')});
window.addEventListener('offline',()=>{if(!peer)return;net('📡 אין אינטרנט — מחכים לחיבור…')});
window.addEventListener('online',()=>{if(!peer)return;net('📶 האינטרנט חזר — מתחברים…');try{if(peer.disconnected&&!peer.destroyed)peer.reconnect()}catch(e){}setTimeout(()=>{if($('#raceNet').textContent.startsWith('📶'))net('')},3000)});
const room=new URLSearchParams(location.search).get('room');if(/^\d{4}$/.test(room||'')){show('home');$('#roomCode').value=room;$('#roomCode').focus();toast('הקוד כבר כאן! בחרו שם ולחצו כניסה לחדר')}
})();
