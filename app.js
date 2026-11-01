const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const FREE=['animals','food','kids','home','sport','jobs'];
const COLORS=['#ff5c8a','#ff9a3c','#2fbf71','#3fa9f5','#a259ff','#f5b700','#00b3a4','#e53935'];
const S={mode:'pic',diff:'easy',time:60,teams:1,names:[],scores:[],cur:0,turns:0,cat:null,lang:'he',mute:false,onboarded:false};
try{Object.assign(S,JSON.parse(localStorage.hu||'{}'))}catch(e){}
const save=()=>{const{cat,...o}=S;localStorage.hu=JSON.stringify(o)};
const getJ=(k,d)=>{try{return JSON.parse(localStorage[k])||d}catch(e){return d}};
let BEST=getJ('huBest',{}),CUSTOM=getJ('huCustom',[]);
const T={he:{
 title:'על המצח!',sub:'משחק ניחושים משפחתי',mode:'מצב משחק',pic:'🖼️ תמונות',kids:'לקטנים',word:'🔤 מילים',diff:'רמת קושי',easy:'קל',medium:'בינוני',hard:'קשה',all:'הכול',
 showLabel:'להציג מילה מתחת לתמונה',time:'זמן לסיבוב',sec:"שנ'",teams:'קבוצות',solo:'שחקן יחיד',endGame:'🏆 סיום משחק והכרזת מנצח',reset:'איפוס ניקוד',
 pickCat:'בחרו קטגוריה',settings:'הגדרות',lang:'שפה',sound:'🔊 צלילים ורטט',invert:'הפוך כיוון הטיה',tutorial:'❓ איך משחקים',restore:'שחזור רכישות',
 help:'החזיקו את הטלפון לרוחב על המצח. הטו קדימה = ✅ נכון, הטו אחורה = ⏭️ דלג. אפשר גם ללחוץ על הכפתורים.',
 placeOn:'שימו את הטלפון על המצח ולחצו',go:'מתחילים! ▶',back:'חזרה',gogo:'צא!',skip:'דלג',ok:'נכון',
 guessed:'✅ ניחשו',skipped:'⏭️ דילגו',next:'התור הבא ▶',again:'סיבוב נוסף ▶',endShort:'🏆 סיום משחק',menu:'לתפריט',
 newGame:'משחק חדש (איפוס) 🔄',winHome:'חזרה לתפריט בלי איפוס',timeUp:'נגמר הזמן! ⏰',ready:'מוכנים?',turnOf:'תור של: ',nextUp:'הבא בתור: ',
 team:'קבוצה ',round:'סיבוב',turnsPlayed:'תורות ששוחקו',inTurn:'בתור ▶',pts:'נקודות ל',total:'סה"כ',noPts:'אין עדיין נקודות',tie:'תיקו! 🤝 ',and:' ו',won:' ניצחו!',
 mix:'ערבוב הכול',custom:'הקטגוריה שלי',customT:'✏️ הקטגוריה שלי',customHelp:'כתבו מילה בכל שורה (שמות של בני משפחה, מורים, בדיחות פנימיות...). לפחות 5 מילים.',
 saveB:'שמירה ▶ למשחק',needWords:'צריך לפחות 5 מילים',edit:'✏️ עריכה',words:'מילים',
 best:'שיא',newBest:'🎉 שיא חדש!',lockedT:'🔓 פתיחת כל הקטגוריות',buyB:'פתיחת כל הקטגוריות – {p} חד־פעמי',buyNote:'תשלום אחד, בלי מנוי ובלי פרסומות. כולל כל קטגוריה שתתווסף בעתיד.',
 onlyApp:'זמין באפליקציה מגוגל פליי',unlocked:'✅ כל הקטגוריות פתוחות! תודה ❤️',restored:'הרכישה שוחזרה ✅',noPurchase:'לא נמצאה רכישה',buyErr:'הרכישה לא הושלמה',
 ob:[['📱','מחזיקים את הטלפון לרוחב על המצח, עם המסך כלפי החברים.'],['🗣️','החברים מתארים, מסבירים או עושים פנטומימה – אתם מנחשים!'],['⬇️✅','ניחשתם? הטו את הטלפון קדימה (מסך לרצפה).'],['⬆️⏭️','רוצים לדלג? הטו אחורה (מסך לתקרה).'],['🏆','בסוף רואים מה ניחשתם, וצוברים כוכבים ושיאים!']],
 obNext:'הבא ▶',obDone:'יאללה, משחקים! 🎉',privacy:'מדיניות פרטיות'},
en:{
 title:'Heads Up Family!',sub:'A family guessing game',mode:'Game mode',pic:'🖼️ Pictures',kids:'for little ones',word:'🔤 Words',diff:'Difficulty',easy:'Easy',medium:'Medium',hard:'Hard',all:'All',
 showLabel:'Show word under the picture',time:'Round time',sec:'s',teams:'Teams',solo:'Single player',endGame:'🏆 End game & announce winner',reset:'Reset scores',
 pickCat:'Pick a category',settings:'Settings',lang:'Language',sound:'🔊 Sound & vibration',invert:'Reverse tilt direction',tutorial:'❓ How to play',restore:'Restore purchases',
 help:'Hold the phone sideways on your forehead. Tilt down = ✅ correct, tilt up = ⏭️ skip. You can also tap the buttons.',
 placeOn:'Put the phone on your forehead and tap',go:'Start! ▶',back:'Back',gogo:'GO!',skip:'Skip',ok:'Correct',
 guessed:'✅ Guessed',skipped:'⏭️ Skipped',next:'Next turn ▶',again:'Play again ▶',endShort:'🏆 End game',menu:'Menu',
 newGame:'New game (reset) 🔄',winHome:'Back to menu without reset',timeUp:"Time's up! ⏰",ready:'Ready?',turnOf:'Turn: ',nextUp:'Next up: ',
 team:'Team ',round:'Round',turnsPlayed:'turns played',inTurn:'playing ▶',pts:'points for ',total:'total',noPts:'No points yet',tie:"It's a tie! 🤝 ",and:' & ',won:' win!',
 mix:'Mix everything',custom:'My category',customT:'✏️ My category',customHelp:'Type one word per line (family names, teachers, inside jokes...). At least 5 words.',
 saveB:'Save ▶ Play',needWords:'Need at least 5 words',edit:'✏️ Edit',words:'words',
 best:'Best',newBest:'🎉 New record!',lockedT:'🔓 Unlock all categories',buyB:'Unlock all categories – {p} one-time',buyNote:'One payment, no subscription, no ads. Includes every future category.',
 onlyApp:'Available in the Google Play app',unlocked:'✅ All categories unlocked! Thank you ❤️',restored:'Purchase restored ✅',noPurchase:'No purchase found',buyErr:'Purchase not completed',
 ob:[['📱','Hold the phone sideways on your forehead, screen facing your friends.'],['🗣️','Friends describe, explain or act it out – you guess!'],['⬇️✅','Got it? Tilt the phone down (screen to the floor).'],['⬆️⏭️','Want to skip? Tilt it up (screen to the ceiling).'],['🏆','At the end see what you got, and earn stars and records!']],
 obNext:'Next ▶',obDone:"Let's play! 🎉",privacy:'Privacy policy'}};
const t=k=>T[S.lang][k];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const imgOf=e=>{if(!e)return '';const c=[...e].map(x=>x.codePointAt(0));return 'img/'+(c.includes(0x200d)?c:c.filter(x=>x!==0xfe0f)).map(x=>x.toString(16)).join('-')+'.svg'};
const catName=k=>k==='mix'?t('mix'):k==='custom'?t('custom'):S.lang==='en'?EN[k].name:CATS[k].name;
const catIcon=k=>k==='mix'?'🎲':k==='custom'?'✏️':CATS[k].icon;
const isLocked=k=>!PAY.owned&&k!=='custom'&&k!=='mix'&&!FREE.includes(k);
const defName=i=>t('team')+(i+1);
function show(id){$$('.screen').forEach(s=>s.classList.toggle('active',s.id===id));scrollTo(0,0)}
function toast(m){const el=$('#toast');el.textContent=m;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),2200)}
function seg(id,key,num,cb){const el=$(id);el.querySelectorAll('button').forEach(b=>{b.classList.toggle('on',String(S[key])===b.dataset.v);
 b.onclick=()=>{S[key]=num?+b.dataset.v:b.dataset.v;el.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));save();cb&&cb()}})}
function applyLang(){const h=document.documentElement;h.lang=S.lang;h.dir=S.lang==='he'?'rtl':'ltr';document.title=t('title');
 $$('[data-i]').forEach(el=>el.textContent=t(el.dataset.i));$$('[data-s]').forEach(el=>el.textContent=el.dataset.s+' '+t('sec'));
 S.names=S.names.map((n,i)=>/^(קבוצה|Team) \d+$/.test(n)?defName(i):n);ui();cats();payUI()}
function ui(){$('#diffBox').style.display=S.mode==='word'?'':'none';$('#labelBox').style.display=S.mode==='pic'?'':'none';
 const tn=$('#teamNames');tn.innerHTML='';if(S.teams>1)for(let i=0;i<S.teams;i++){const inp=document.createElement('input');
  inp.value=S.names[i]||defName(i);inp.oninput=()=>{S.names[i]=inp.value;save();board()};S.names[i]=inp.value;tn.appendChild(inp)}
 while(S.scores.length<S.teams)S.scores.push(0);S.scores.length=S.teams;if(S.cur>=S.teams)S.cur=0;board();save()}
function leaders(){const m=Math.max(...S.scores.slice(0,S.teams));return m>0?S.scores.map((v,i)=>v===m?i:-1).filter(i=>i>=0):[]}
function board(){let h='';if(S.teams>1){const L=leaders();
 h='<div class="board">'+S.names.slice(0,S.teams).map((n,i)=>`<div class="${i===S.cur?'cur':''} ${L.includes(i)?'lead':''}">${L.includes(i)?'👑 ':''}${esc(n)}<b>${S.scores[i]}</b>${i===S.cur?'<small>'+t('inTurn')+'</small>':''}</div>`).join('')+'</div>'+
 `<div class="rnd">${t('round')} ${Math.floor(S.turns/S.teams)+1} · ${t('turnsPlayed')}: ${S.turns}</div>`}
 $('#board').innerHTML=h;$('#board2').innerHTML=h;$('#endGame').style.display=S.teams>1&&S.turns>0?'':'none'}
const starsOf=n=>n>=10?3:n>=6?2:n>=3?1:0;
const starStr=n=>'\u2066'+'★'.repeat(n)+'☆'.repeat(3-n)+'\u2069';
const bestKey=k=>k+'|'+S.mode+(S.mode==='word'?'|'+S.diff:'')+'|'+S.lang+'|'+S.time;
function cats(){const box=$('#cats');box.innerHTML='';
 ['mix','custom',...Object.keys(CATS)].forEach((k,i)=>{const b=document.createElement('button');const L=isLocked(k);
  b.className=(k==='mix'?'mix ':'')+(L?'locked':'');if(k!=='mix')b.style.background=k==='custom'?'#444':COLORS[i%COLORS.length];
  const best=BEST[bestKey(k)];
  b.innerHTML=`<b>${catIcon(k)}</b>${esc(catName(k))}${L?'<i class="lock">🔒</i>':''}${best?`<small class="bst">${starStr(starsOf(best))} ${t('best')} ${best}</small>`:''}`+(k==='custom'&&CUSTOM.length?`<small class="bst">${CUSTOM.length} ${t('words')}</small>`:'');
  b.onclick=()=>L?openUnlock():k==='custom'?openCustom():pick(k);box.appendChild(b)})}
// settings
seg('#modeSeg','mode',0,()=>{ui();cats()});seg('#diffSeg','diff',0,cats);seg('#timeSeg','time',1,cats);seg('#teamSeg','teams',1,ui);seg('#langSeg','lang',0,applyLang);
$('#mute').checked=!S.mute;$('#mute').onchange=e=>{S.mute=!e.target.checked;save();if(!S.mute)sndOk()};
$('#invert').checked=localStorage.huInv==='1';$('#invert').onchange=e=>localStorage.huInv=e.target.checked?'1':'0';
function resetGame(){S.scores=S.scores.map(()=>0);S.cur=0;S.turns=0;ui()}
$('#resetScores').onclick=resetGame;
function winner(){const L=leaders(),names=S.names.slice(0,S.teams);
 $('#winTitle').textContent=L.length===0?t('noPts'):L.length>1?t('tie')+L.map(i=>names[i]).join(t('and')):'🏆 '+names[L[0]]+t('won');
 const order=names.map((n,i)=>i).sort((a,b)=>S.scores[b]-S.scores[a]);
 $('#winList').innerHTML=order.map((i,r)=>`<li class="${L.includes(i)?'lead':''}"><span>${['🥇','🥈','🥉','4️⃣'][r]} ${esc(names[i])}</span><b>${S.scores[i]}</b></li>`).join('');
 if(L.length===1)sndEnd();show('win')}
$('#endGame').onclick=winner;$('#endGame2').onclick=winner;
$('#newGame').onclick=()=>{resetGame();show('home')};$('#winHome').onclick=()=>{ui();show('home')};
// onboarding
let obI=0;function onboard(){obI=0;obRender();show('onboard')}
function obRender(){const s=t('ob')[obI];$('#obIcon').textContent=s[0];$('#obText').textContent=s[1];
 $('#obDots').innerHTML=t('ob').map((x,i)=>`<i class="${i===obI?'on':''}"></i>`).join('');$('#obNext').textContent=obI<t('ob').length-1?t('obNext'):t('obDone')}
$('#obNext').onclick=()=>{if(obI<t('ob').length-1){obI++;obRender()}else{S.onboarded=true;save();show('home')}};
$('#obSkip').onclick=()=>{S.onboarded=true;save();show('home')};$('#tutorial').onclick=onboard;
// custom category
function openCustom(){$('#customText').value=CUSTOM.join('\n');show('customScr')}
$('#customSave').onclick=()=>{const w=[...new Set($('#customText').value.split(/\n|,/).map(x=>x.trim()).filter(Boolean))];
 if(w.length<5){toast(t('needWords'));return}CUSTOM=w;localStorage.huCustom=JSON.stringify(w);cats();pick('custom')};
$('#customBack').onclick=()=>show('home');
// unlock
function openUnlock(){payUI();show('unlockScr')}
function payUI(){$('#buy').textContent=t('buyB').replace('{p}',PAY.price);const av=PAY.available();
 $('#buy').style.display=PAY.owned?'none':'';$('#buy').disabled=!av;$('#payNote').textContent=PAY.owned?t('unlocked'):av?t('buyNote'):t('onlyApp')+' · '+t('buyNote');
 $('#lockList').innerHTML=Object.keys(CATS).filter(k=>!FREE.includes(k)).map(k=>`<span>${CATS[k].icon} ${esc(catName(k))}</span>`).join('')}
window.onPayChange=()=>{cats();payUI()};
$('#buy').onclick=async()=>{const r=await PAY.buy();if(r==='ok'){toast(t('unlocked'));show('home')}else if(r==='unavailable')toast(t('onlyApp'));else if(r==='error')toast(t('buyErr'))};
const doRestore=async()=>{if(!PAY.svc){toast(t('onlyApp'));return}toast(await PAY.restore(false)?t('restored'):t('noPurchase'))};
$('#restore').onclick=doRestore;$('#restore2').onclick=doRestore;$('#unlockBack').onclick=()=>show('home');
// audio
let ac;function beep(f,d=.12,ty='sine',v=.25){if(S.mute)return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();const o=ac.createOscillator(),g=ac.createGain();
 o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(v,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}
const vib=p=>{if(!S.mute&&navigator.vibrate)try{navigator.vibrate(p)}catch(e){}};
const sndOk=()=>{beep(660);setTimeout(()=>beep(990,.18),90);vib(60)}, sndSkip=()=>{beep(300,.2,'triangle');vib([30,40,30])};
const sndTick=()=>{beep(1200,.06,'square',.12);vib(20)};
const sndEnd=()=>{[523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,.25,'square',.15),i*150));vib(400)};
// motion
let motionOK=false;
async function askMotion(){try{if(window.DeviceMotionEvent&&typeof DeviceMotionEvent.requestPermission==='function'){motionOK=(await DeviceMotionEvent.requestPermission())==='granted'}else motionOK='DeviceMotionEvent' in window}catch(e){motionOK=false}}
async function lockLand(){try{await document.documentElement.requestFullscreen?.();await screen.orientation?.lock?.('landscape')}catch(e){}}
function pick(k){S.cat=k;$('#readyTeam').textContent=(S.teams>1?t('turnOf')+S.names[S.cur]:t('ready'))+' '+catIcon(k);$('#readyCat').textContent=catName(k);show('ready')}
$('#back1').onclick=()=>show('home');
$('#go').onclick=async()=>{beep(1,.01);await askMotion();lockLand();countdown()};
function countdown(){show('count');let n=3;const el=$('#countNum');const step=()=>{if(n===0){el.textContent=t('gogo');beep(880,.4);setTimeout(start,600);return}
 el.textContent=n;el.style.animation='none';el.offsetHeight;el.style.animation='';beep(440);vib(50);n--;setTimeout(step,1000)};step()}
let deck=[],idx=0,ok=[],skip=[],tLeft=0,tick,armed=false,busy=false,playing=false,curMode='pic';
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
function buildDeck(){const seen=new Set(),out=[];const add=(e,w)=>{if(w&&!seen.has(w)){seen.add(w);out.push({e,w})}};
 curMode=S.mode;if(S.cat==='custom'){curMode='word';CUSTOM.forEach(w=>add('',w));return shuffle(out)}
 const keys=S.cat==='mix'?Object.keys(CATS).filter(k=>!isLocked(k)):[S.cat];
 keys.forEach(k=>{const c=CATS[k],src=S.lang==='en'?EN[k]:null;
  if(S.mode==='pic')c.pic.forEach(([e,w],i)=>add(e,src?src.pic[i]:w));
  else{const wb=src?src.word:c.word;(S.diff==='all'?[...wb.easy,...wb.medium,...wb.hard]:wb[S.diff]).forEach(w=>add('',w))}});return shuffle(out)}
function start(){deck=buildDeck();idx=0;ok=[];skip=[];tLeft=S.time;playing=true;armed=false;busy=false;
 $('#play').className='screen active '+(curMode==='pic'?'pic':'wordm');show('play');$('#scoreLive').textContent=0;render();upd();
 tick=setInterval(()=>{tLeft--;upd();if(tLeft<=5&&tLeft>0)sndTick();if(tLeft<=0)end()},1000)}
function upd(){$('#timer').textContent=tLeft;$('#timer').classList.toggle('low',tLeft<=10)}
function render(){if(idx>=deck.length){const again=shuffle(deck.filter(d=>skip.some(s=>s.w===d.w)));deck=deck.concat(again);if(idx>=deck.length){end();return}}
 const it=deck[idx];const im=$('#pimg');if(it.e){im.src=imgOf(it.e);im.alt=it.w;im.style.display='';im.onerror=()=>{im.style.display='none';$('#emoji').textContent=it.e;$('#emoji').style.display=''};$('#emoji').style.display='none'}else{im.style.display='none';$('#emoji').style.display='none'}
 $('#word').textContent=(curMode==='pic'&&!$('#showLabel').checked)?'':it.w}
function answer(good){if(!playing||busy)return;busy=true;const it=deck[idx];(good?ok:skip).push(it);good?sndOk():sndSkip();
 $('#scoreLive').textContent=ok.length;const f=$('#flash');f.className=good?'g':'s';f.textContent=good?'✅':'⏭️';
 setTimeout(()=>{f.className='';idx++;render();busy=false},650)}
$('#bOk').onclick=()=>answer(true);$('#bSkip').onclick=()=>answer(false);
$('#quit').onclick=()=>{clearInterval(tick);playing=false;show('home')};
window.addEventListener('devicemotion',e=>{if(!playing||busy)return;const g=e.accelerationIncludingGravity;if(!g||g.z==null)return;
 let z=g.z;const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 if(ios)z=-z;if(localStorage.huInv==='1')z=-z;
 if(Math.abs(z)<3.5){armed=true;return}if(!armed)return;
 if(z<-7){armed=false;answer(true)}else if(z>7){armed=false;answer(false)}});
const li=x=>`<li>${x.e?`<img src="${imgOf(x.e)}" alt="">`:''}${esc(x.w)}</li>`;
function end(){if(!playing)return;playing=false;clearInterval(tick);sndEnd();const played=S.cur;if(S.teams>1){S.scores[played]+=ok.length;S.turns++}
 const bk=bestKey(S.cat),prev=BEST[bk]||0,rec=ok.length>prev;if(rec){BEST[bk]=ok.length;localStorage.huBest=JSON.stringify(BEST)}
 $('#sumTitle').textContent=(S.teams>1?S.names[played]+' – ':'')+t('timeUp');
 $('#sumStars').textContent=starStr(starsOf(ok.length));
 $('#sumSub').textContent=(S.teams>1?'+'+ok.length+' '+t('pts')+S.names[played]+' · '+t('total')+' '+S.scores[played]+' · ':'')+(rec&&prev>0?t('newBest'):t('best')+': '+Math.max(prev,ok.length));
 $('#sumScore').textContent=ok.length;
 $('#lOk').innerHTML=ok.map(li).join('')||'<li>—</li>';$('#lSkip').innerHTML=skip.map(li).join('')||'<li>—</li>';
 if(S.teams>1)S.cur=(S.cur+1)%S.teams;board();save();cats();$('#nextUp').textContent=S.teams>1?t('nextUp')+S.names[S.cur]:'';$('#endGame2').style.display=S.teams>1?'':'none';$('#next').textContent=S.teams>1?t('turnOf')+S.names[S.cur]+' ▶':t('again');show('sum')}
$('#next').onclick=()=>pick(S.cat);$('#toHome').onclick=()=>{ui();show('home')};
applyLang();PAY.init();if(!S.onboarded)onboard();
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
