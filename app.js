const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
// PAYWALL_ENABLED: false = web build (everything open, no locks/unlock UI). Set true for the Android/Google Play build.
const PAYWALL_ENABLED=false;
const FREE=['animals','food','colors','toys','kids','games','social','slang','idioms','nostalgia','act','sound','who'];
const COLORS=['#ff5c8a','#ff9a3c','#2fbf71','#3fa9f5','#a259ff','#f5b700','#00b3a4','#e53935'];
const S={mode:'word',age:'family',time:60,teams:1,names:[],scores:[],cur:0,turns:0,cat:null,lang:'he',mute:false,onboarded:false,cam:false,tourn:false,rounds:3};
try{Object.assign(S,JSON.parse(localStorage.hu||'{}'))}catch(e){}
const save=()=>{const{cat,...o}=S;localStorage.hu=JSON.stringify(o)};
const getJ=(k,d)=>{try{return JSON.parse(localStorage[k])||d}catch(e){return d}};
let BEST=getJ('huBest',{}),CUSTOM=getJ('huCustom',[]);
const T={he:{pause:'⏸ עצירה',resume:'▶ המשך',exit:'✖ יציאה',exitQ:'לצאת מהסבב?',paused:'המשחק בהפסקה',
 title:'על המצח!',sub:'משחק ניחושים משפחתי',mode:'מצב משחק',pic:'🖼️ תמונות',kids:'לקטנים',word:'🔤 מילים',age:'קבוצת גיל',modesT:'🎭 מצבי משחק',catsT:'📚 קטגוריות',
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
 obNext:'הבא ▶',obDone:'יאללה, משחקים! 🎉',privacy:'מדיניות פרטיות',cam:'🎥 צילום המנחש במצלמה הקדמית',camHelp:'הסרטון נשמר רק בטלפון, לא עולה לשום מקום',camNo:'אין גישה למצלמה – משחקים בלי צילום',videoT:'🎬 הסרטון של הסיבוב',dl:'⬇️ שמירה',share:'📤 שיתוף',tournT:'🏆 מצב טורניר',tournOn:'טורניר (כמה סיבובים, מנצח בסוף)',rounds:'סיבובים',of:' מתוך ',toResults:'🏆 לתוצאות הטורניר',champ:'אלופי הטורניר!',addW:'הוספה',wordPh:'מילה חדשה...',del:'מחיקה',seasonB:'🌟 עכשיו בעונה!',recCel:'🎉 שיא חדש! 🎉',holT:'🕎 חגים',needTeams:'טורניר צריך לפחות 2 קבוצות'},
en:{
 title:'Heads Up Family!',sub:'A family guessing game',mode:'Game mode',pic:'🖼️ Pictures',kids:'for little ones',word:'🔤 Words',age:'Age group',modesT:'🎭 Game modes',catsT:'📚 Categories',
 showLabel:'Show word under the picture',time:'Round time',sec:'s',teams:'Teams',solo:'Single player',endGame:'🏆 End game & announce winner',reset:'Reset scores',
 pickCat:'Pick a category',settings:'Settings',lang:'Language',sound:'🔊 Sound & vibration',invert:'Reverse tilt direction',tutorial:'❓ How to play',restore:'Restore purchases',
 pause:'⏸ Pause',resume:'▶ Resume',exit:'✖ Exit',exitQ:'Exit this round?',paused:'Paused',help:'Hold the phone sideways on your forehead. Tilt down = ✅ correct, tilt up = ⏭️ skip. You can also tap the buttons.',
 placeOn:'Put the phone on your forehead and tap',go:'Start! ▶',back:'Back',gogo:'GO!',skip:'Skip',ok:'Correct',
 guessed:'✅ Guessed',skipped:'⏭️ Skipped',next:'Next turn ▶',again:'Play again ▶',endShort:'🏆 End game',menu:'Menu',
 newGame:'New game (reset) 🔄',winHome:'Back to menu without reset',timeUp:"Time's up! ⏰",ready:'Ready?',turnOf:'Turn: ',nextUp:'Next up: ',
 team:'Team ',round:'Round',turnsPlayed:'turns played',inTurn:'playing ▶',pts:'points for ',total:'total',noPts:'No points yet',tie:"It's a tie! 🤝 ",and:' & ',won:' win!',
 mix:'Mix everything',custom:'My category',customT:'✏️ My category',customHelp:'Type one word per line (family names, teachers, inside jokes...). At least 5 words.',
 saveB:'Save ▶ Play',needWords:'Need at least 5 words',edit:'✏️ Edit',words:'words',
 best:'Best',newBest:'🎉 New record!',lockedT:'🔓 Unlock all categories',buyB:'Unlock all categories – {p} one-time',buyNote:'One payment, no subscription, no ads. Includes every future category.',
 onlyApp:'Available in the Google Play app',unlocked:'✅ All categories unlocked! Thank you ❤️',restored:'Purchase restored ✅',noPurchase:'No purchase found',buyErr:'Purchase not completed',
 ob:[['📱','Hold the phone sideways on your forehead, screen facing your friends.'],['🗣️','Friends describe, explain or act it out – you guess!'],['⬇️✅','Got it? Tilt the phone down (screen to the floor).'],['⬆️⏭️','Want to skip? Tilt it up (screen to the ceiling).'],['🏆','At the end see what you got, and earn stars and records!']],
 obNext:'Next ▶',obDone:"Let's play! 🎉",privacy:'Privacy policy',cam:'🎥 Record the guesser (front camera)',camHelp:'The video stays on this phone only, never uploaded',camNo:'No camera access – playing without video',videoT:'🎬 Your round video',dl:'⬇️ Save',share:'📤 Share',tournT:'🏆 Tournament',tournOn:'Tournament (several rounds, winner at the end)',rounds:'Rounds',of:' of ',toResults:'🏆 Tournament results',champ:'Tournament champions!',addW:'Add',wordPh:'New word...',del:'Delete',seasonB:'🌟 In season now!',recCel:'🎉 New record! 🎉',holT:'🕎 Holidays',needTeams:'A tournament needs at least 2 teams'}};
const t=k=>T[S.lang][k];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const imgOf=e=>{if(!e)return '';const c=[...e].map(x=>x.codePointAt(0));return 'img/'+(c.includes(0x200d)?c:c.filter(x=>x!==0xfe0f)).map(x=>x.toString(16)).join('-')+'.svg'};
const LI=()=>S.lang==='en'?1:0;
const catName=k=>{if(k==='mix')return t('mix');if(k==='custom')return t('custom');const o=(NAME_OVR[S.age]||{})[k];if(o)return o[LI()];
 if(MODES[k])return LI()?MODES[k].en:MODES[k].he;if(NC[k])return LI()?NC[k].en:NC[k].he;return S.lang==='en'?EN[k].name:CATS[k].name};
const catIcon=k=>k==='mix'?'🎲':k==='custom'?'✏️':MODES[k]?MODES[k].icon:NC[k]?NC[k].icon:CATS[k].icon;
const ageCats=()=>AGES[S.age].cats;
const isLocked=k=>PAYWALL_ENABLED&&!PAY.owned&&k!=='custom'&&k!=='mix'&&!FREE.includes(k);
const defName=i=>t('team')+(i+1);
function show(id){$$('.screen').forEach(s=>s.classList.toggle('active',s.id===id));scrollTo(0,0)}
function toast(m){const el=$('#toast');el.textContent=m;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),2200)}
function seg(id,key,num,cb){const el=$(id);el.querySelectorAll('button').forEach(b=>{b.classList.toggle('on',String(S[key])===b.dataset.v);
 b.onclick=()=>{S[key]=num?+b.dataset.v:b.dataset.v;el.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));save();cb&&cb()}})}
function applyLang(){const h=document.documentElement;h.lang=S.lang;h.dir=S.lang==='he'?'rtl':'ltr';document.title=t('title');
 $$('[data-i]').forEach(el=>el.textContent=t(el.dataset.i));ageSeg();$$('[data-s]').forEach(el=>el.textContent=el.dataset.s+' '+t('sec'));
 S.names=S.names.map((n,i)=>/^(קבוצה|Team) \d+$/.test(n)?defName(i):n);ui();cats();payUI()}
function ui(){$('#roundRow').style.display=S.tourn?'':'none';if(S.tourn&&S.teams<2){S.tourn=false;$('#tourn').checked=false}$$('.paid').forEach(el=>el.style.display=PAYWALL_ENABLED?'':'none');$('#labelBox').style.display=S.mode==='pic'?'':'none';
 const tn=$('#teamNames');tn.innerHTML='';if(S.teams>1)for(let i=0;i<S.teams;i++){const inp=document.createElement('input');
  inp.value=S.names[i]||defName(i);inp.oninput=()=>{S.names[i]=inp.value;save();board()};S.names[i]=inp.value;tn.appendChild(inp)}
 while(S.scores.length<S.teams)S.scores.push(0);S.scores.length=S.teams;if(S.cur>=S.teams)S.cur=0;board();save()}
function leaders(){const m=Math.max(...S.scores.slice(0,S.teams));return m>0?S.scores.map((v,i)=>v===m?i:-1).filter(i=>i>=0):[]}
function board(){let h='';if(S.teams>1){const L=leaders();
 h='<div class="board">'+S.names.slice(0,S.teams).map((n,i)=>`<div class="${i===S.cur?'cur':''} ${L.includes(i)?'lead':''}">${L.includes(i)?'👑 ':''}${esc(n)}<b>${S.scores[i]}</b>${i===S.cur?'<small>'+t('inTurn')+'</small>':''}</div>`).join('')+'</div>'+
 `<div class="rnd">${S.tourn?'🏆 ':''}${t('round')} ${Math.min(Math.floor(S.turns/S.teams)+1,S.tourn?S.rounds:1e9)}${S.tourn?t('of')+S.rounds:''} · ${t('turnsPlayed')}: ${S.turns}</div>`}
 $('#board').innerHTML=h;$('#board2').innerHTML=h;$('#endGame').style.display=S.teams>1&&S.turns>0?'':'none'}
const starsOf=n=>n>=10?3:n>=6?2:n>=3?1:0;
const starStr=n=>'\u2066'+'★'.repeat(n)+'☆'.repeat(3-n)+'\u2069';
const bestKey=k=>k+'|'+S.age+'|'+S.mode+'|'+S.lang+'|'+S.time;
function tile(k,i,box){const b=document.createElement('button');const L=isLocked(k);
  const SE=typeof seasonal==='function'&&seasonal().includes(k);b.className=(k==='mix'?'mix ':'')+(MODES[k]?'modeT ':'')+(SE?'season ':'')+(L?'locked':'');if(k!=='mix')b.style.background=k==='custom'?'#444':COLORS[i%COLORS.length];
  const best=BEST[bestKey(k)];const hint=MODES[k]?`<small class="hint">${esc(MODES[k].hint[LI()])}</small>`:'';
  b.innerHTML=`<b>${catIcon(k)}</b>${esc(catName(k))}${hint}${SE?`<small class="sb">${t('seasonB')}</small>`:''}${L?'<i class="lock">🔒</i>':''}${best?`<small class="bst">${starStr(starsOf(best))} ${t('best')} ${best}</small>`:''}`+(k==='custom'&&CUSTOM.length?`<small class="bst">${CUSTOM.length} ${t('words')}</small>`:'');
  b.dataset.k=k;b.onclick=()=>L?openUnlock():k==='custom'?openCustom():pick(k);box.appendChild(b)}
function cats(){const box=$('#cats');box.innerHTML='';const mb=$('#modes');mb.innerHTML='';
 Object.keys(MODES).forEach((k,i)=>tile(k,i+3,mb));
 const se=seasonal();['mix','custom',...se,...ageCats().filter(k=>!se.includes(k))].forEach((k,i)=>tile(k,i,box));
 const hb=$('#hols');hb.innerHTML='';HOLI.filter(k=>!se.includes(k)).forEach((k,i)=>tile(k,i+2,hb))}
function ageSeg(){const el=$('#ageSeg');el.innerHTML=Object.entries(AGES).map(([k,a])=>`<button data-v="${k}" class="${S.age===k?'on':''}">${a.icon}<br>${esc(LI()?a.en:a.he)}</button>`).join('');
 el.querySelectorAll('button').forEach(b=>b.onclick=()=>{S.age=b.dataset.v;if(S.age==='kids')S.mode='pic';else if(S.age==='family')S.mode='word';else if(S.mode==='pic'&&S.age!=='mid')S.mode='word';
  el.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));$$('#modeSeg button').forEach(x=>x.classList.toggle('on',x.dataset.v===S.mode));save();ui();cats()})}
// settings
seg('#modeSeg','mode',0,()=>{ui();cats()});seg('#timeSeg','time',1,cats);seg('#teamSeg','teams',1,ui);seg('#langSeg','lang',0,applyLang);seg('#roundSeg','rounds',1,ui);
$('#mute').checked=!S.mute;$('#mute').onchange=e=>{S.mute=!e.target.checked;save();if(!S.mute)sndOk()};
$('#cam').checked=!!S.cam;$('#cam').onchange=e=>{S.cam=e.target.checked;save();if(S.cam)camOpen().then(ok=>{if(!ok){S.cam=false;$('#cam').checked=false;save()}camClose()})};
$('#tourn').checked=!!S.tourn;$('#tourn').onchange=e=>{S.tourn=e.target.checked;if(S.tourn&&S.teams<2){S.teams=2;$$('#teamSeg button').forEach(x=>x.classList.toggle('on',x.dataset.v==='2'));toast(t('needTeams'))}resetGame();save()};
$('#invert').checked=localStorage.huInv==='1';$('#invert').onchange=e=>localStorage.huInv=e.target.checked?'1':'0';
function resetGame(){S.scores=S.scores.map(()=>0);S.cur=0;S.turns=0;ui()}
$('#resetScores').onclick=resetGame;
function winner(){const L=leaders(),names=S.names.slice(0,S.teams);
 $('#winTitle').textContent=L.length===0?t('noPts'):L.length>1?t('tie')+L.map(i=>names[i]).join(t('and')):'🏆 '+names[L[0]]+t('won');
 const order=names.map((n,i)=>i).sort((a,b)=>S.scores[b]-S.scores[a]);
 $('#winList').innerHTML=order.map((i,r)=>`<li class="${L.includes(i)?'lead':''}"><span>${['🥇','🥈','🥉','4️⃣'][r]} ${esc(names[i])}</span><b>${S.scores[i]}</b></li>`).join('');
 $('#winCrown').textContent=L.length===1?'👑':'🏆';if(S.tourn&&L.length)$('#winTitle').textContent=t('champ')+' '+L.map(i=>names[i]).join(t('and'))+' 👑';
 show('win');if(L.length){sndWin();confetti(160)}}
$('#endGame').onclick=winner;$('#endGame2').onclick=winner;
$('#newGame').onclick=()=>{resetGame();show('home')};$('#winHome').onclick=()=>{ui();show('home')};
// onboarding
let obI=0;function onboard(){obI=0;obRender();show('onboard')}
function obRender(){const s=t('ob')[obI];$('#obIcon').textContent=s[0];$('#obText').textContent=s[1];
 $('#obDots').innerHTML=t('ob').map((x,i)=>`<i class="${i===obI?'on':''}"></i>`).join('');$('#obNext').textContent=obI<t('ob').length-1?t('obNext'):t('obDone')}
$('#obNext').onclick=()=>{if(obI<t('ob').length-1){obI++;obRender()}else{S.onboarded=true;save();show('home')}};
$('#obSkip').onclick=()=>{S.onboarded=true;save();show('home')};$('#tutorial').onclick=onboard;
// custom category
function saveCustom(){CUSTOM=[...new Set(CUSTOM.map(x=>x.trim()).filter(Boolean))];localStorage.huCustom=JSON.stringify(CUSTOM);cats()}
function renderCustom(){$('#cCount').textContent=CUSTOM.length+' '+t('words');const ul=$('#cList');ul.innerHTML='';CUSTOM.forEach((w,i)=>{const li=document.createElement('li');const inp=document.createElement('input');inp.value=w;
 inp.onchange=()=>{const v=inp.value.trim();if(v)CUSTOM[i]=v;else CUSTOM.splice(i,1);saveCustom();renderCustom()};const d=document.createElement('button');d.textContent='🗑️';d.title=t('del');d.className='del';
 d.onclick=()=>{CUSTOM.splice(i,1);saveCustom();renderCustom()};li.append(inp,d);ul.appendChild(li)})}
function addCustom(){const el=$('#cNew');el.value.split(/\n|,/).map(x=>x.trim()).filter(Boolean).forEach(v=>{if(!CUSTOM.includes(v))CUSTOM.push(v)});el.value='';saveCustom();renderCustom();el.focus()}
function openCustom(){$('#cNew').placeholder=t('wordPh');$('#cAdd').textContent=t('addW');renderCustom();show('customScr')}
$('#cAdd').onclick=addCustom;$('#cNew').onkeydown=e=>{if(e.key==='Enter')addCustom()};
$('#customSave').onclick=()=>{saveCustom();if(CUSTOM.length<5){toast(t('needWords'));return}pick('custom')};
$('#customBack').onclick=()=>show('home');
// unlock
function openUnlock(){if(!PAYWALL_ENABLED)return;payUI();show('unlockScr')}
function payUI(){if(!PAYWALL_ENABLED){$('#lockList').innerHTML='';return}$('#buy').textContent=t('buyB').replace('{p}',PAY.price);const av=PAY.available();
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
const sndEnd=()=>{beep(180,.7,'sawtooth',.3);setTimeout(()=>beep(140,.6,'sawtooth',.25),120);vib([300,100,300])};
const sndWin=()=>{[523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,.25,'square',.15),i*150));vib(400)};
function confetti(n=120){const box=document.createElement('div');box.className='confetti';for(let i=0;i<n;i++){const p=document.createElement('i');p.style.left=Math.random()*100+'%';p.style.background=COLORS[i%COLORS.length];p.style.animationDelay=Math.random()*.8+'s';p.style.animationDuration=1.8+Math.random()*1.6+'s';p.style.transform='rotate('+Math.random()*360+'deg)';box.appendChild(p)}document.body.appendChild(box);setTimeout(()=>box.remove(),4200)}
// camera (opt-in, local only — nothing is uploaded)
let camStream=null,rec=null,recChunks=[],vidURL=null,vidBlob=null;
const camSupported=()=>!!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&window.MediaRecorder);
async function camOpen(){if(!camSupported()){toast(t('camNo'));return false}if(camStream)return true;
 try{camStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:640},height:{ideal:480}},audio:true})}catch(e){try{camStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}})}catch(e2){camStream=null;toast(t('camNo'));return false}}return true}
function camClose(){if(camStream){camStream.getTracks().forEach(x=>x.stop());camStream=null}}
function recStart(){recChunks=[];rec=null;if(!camStream)return;try{const ty=['video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'].find(x=>MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(x));
 rec=new MediaRecorder(camStream,ty?{mimeType:ty}:undefined);rec.ondataavailable=e=>{if(e.data&&e.data.size)recChunks.push(e.data)};rec.start(1000);$('#recDot').style.display='block'}catch(e){rec=null}}
function recPause(on){try{if(rec&&rec.state!=='inactive')on?rec.pause():rec.resume()}catch(e){}}
function recStop(keep){$('#recDot').style.display='none';return new Promise(res=>{if(!rec||rec.state==='inactive'){camClose();res(null);return}
 rec.onstop=()=>{const b=keep&&recChunks.length?new Blob(recChunks,{type:rec.mimeType||'video/webm'}):null;camClose();rec=null;res(b)};try{rec.stop()}catch(e){camClose();res(null)}})}
function showVideo(b){const box=$('#vidBox');if(vidURL){URL.revokeObjectURL(vidURL);vidURL=null}vidBlob=b;if(!b){box.style.display='none';return}
 vidURL=URL.createObjectURL(b);const v=$('#vid');v.src=vidURL;box.style.display='';const ext=/mp4/.test(b.type)?'mp4':'webm';const a=$('#vidDl');a.href=vidURL;a.download='al-hametzach-'+Date.now()+'.'+ext;
 const f=new File([b],'al-hametzach.'+ext,{type:b.type});$('#vidShare').style.display=navigator.canShare&&navigator.canShare({files:[f]})?'':'none';
 $('#vidShare').onclick=()=>navigator.share({files:[f],title:t('title')}).catch(()=>{})}
// motion
let motionOK=false;
async function askMotion(){try{if(window.DeviceMotionEvent&&typeof DeviceMotionEvent.requestPermission==='function'){motionOK=(await DeviceMotionEvent.requestPermission())==='granted'}else motionOK='DeviceMotionEvent' in window}catch(e){motionOK=false}}
async function lockLand(){try{await document.documentElement.requestFullscreen?.();await screen.orientation?.lock?.('landscape')}catch(e){}}
function pick(k){S.cat=k;$('#readyTeam').textContent=(S.teams>1?t('turnOf')+S.names[S.cur]:t('ready'))+' '+catIcon(k);$('#readyCat').textContent=catName(k);$('#readyHint').textContent=MODES[k]?MODES[k].hint[LI()]:'';show('ready')}
$('#back1').onclick=()=>show('home');
$('#go').onclick=async()=>{beep(1,.01);await askMotion();if(S.cam)await camOpen();lockLand();countdown()};
let cdT=null,paused=false,phase='';
function countdown(){show('count');phase='count';paused=false;ctl(true);let n=3;const el=$('#countNum');clearTimeout(cdT);const step=()=>{if(paused)return;if(n===0){el.textContent=t('gogo');beep(880,.4);cdT=setTimeout(start,600);return}
 el.textContent=n;el.style.animation='none';el.offsetHeight;el.style.animation='';beep(440);vib(50);n--;cdT=setTimeout(step,1000)};step()}
function ctl(on){$('#ctl').style.display=on?'flex':'none'}
function runTick(){clearInterval(tick);tick=setInterval(()=>{if(paused)return;tLeft--;upd();if(tLeft<=10&&tLeft>0)sndTick();if(tLeft<=0)end()},1000)}
function pauseGame(){if(paused||(phase!=='count'&&!playing))return;paused=true;clearTimeout(cdT);clearInterval(tick);$('#pauseCd').textContent='';$('#pauseBtns').style.display='';$('#pauseOv').classList.add('on');recPause(true)}
function resumeGame(){if(!paused)return;if(phase==='count'){$('#pauseOv').classList.remove('on');countdown();return}
 $('#pauseBtns').style.display='none';let n=3;const el=$('#pauseCd');const st=()=>{if(n===0){$('#pauseOv').classList.remove('on');paused=false;armed=false;busy=false;recPause(false);runTick();return}el.textContent=n;beep(440);n--;cdT=setTimeout(st,800)};st()}
function exitRound(){const wasP=paused;if(!wasP)pauseGame();if(!confirm(t('exitQ'))){if(!wasP)resumeGame();return}
 clearTimeout(cdT);clearInterval(tick);playing=false;paused=false;phase='';recStop(false);$('#pauseOv').classList.remove('on');ctl(false);show('home')}
let deck=[],idx=0,ok=[],skip=[],tLeft=0,tick,armed=false,busy=false,playing=false,curMode='pic';
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
function itemsOf(k){const en=S.lang==='en',ag=S.age,out=[];
 if(MODES[k]){const m=MODES[k],tr=AGES[ag].tier;const l=tr==='t'?[...m.m,...m.a]:tr==='f'?[...m.k,...m.m]:(m[tr]||m.a);l.forEach(([e,h,n])=>out.push([e,en?n:h]));return out}
 if(NC[k]&&NC[k].byAge){(NC[k].byAge[ag]||NC[k].byAge.family).forEach(([e,h,n])=>out.push([e,en?n:h]));return out}
 if(NC[k]){NC[k].items.forEach(([e,h,n])=>out.push([e,en?n:h]));return out}
 const c=CATS[k],src=en?EN[k]:null;
 if(S.mode==='pic'||ag==='kids'||ag==='family')c.pic.forEach(([e,w],i)=>out.push([S.mode==='pic'?e:'',src?src.pic[i]:w]));
 if(S.mode!=='pic'){const wb=src?src.word:c.word;AGE_LEVELS[ag].forEach(l=>wb[l].forEach(w=>out.push(['',w])))}
 return out}
function buildDeck(){const seen=new Set(),out=[];const pics=MODES[S.cat]&&MODES[S.cat].pics;const add=(e,w)=>{if(w&&!seen.has(w)){seen.add(w);out.push({e:(S.mode==='pic'||pics)?e:'',w})}};
 curMode=pics?'pic':S.mode;if(S.cat==='custom'){curMode='word';CUSTOM.forEach(w=>add('',w));return shuffle(out)}
 const keys=S.cat==='mix'?ageCats().filter(k=>!isLocked(k)):[S.cat];
 keys.forEach(k=>itemsOf(k).forEach(([e,w])=>add(e,w)));return shuffle(out)}
function start(){phase='play';paused=false;deck=buildDeck();idx=0;ok=[];skip=[];tLeft=S.time;playing=true;armed=false;busy=false;
 $('#play').className='screen active '+(curMode==='pic'?'pic':'wordm');show('play');$('#scoreLive').textContent=0;render();upd();
 recStart();runTick()}
function upd(){$('#timer').textContent=tLeft;$('#timer').classList.toggle('low',tLeft<=10)}
function render(){if(idx>=deck.length){const again=shuffle(deck.filter(d=>skip.some(s=>s.w===d.w)));deck=deck.concat(again);if(idx>=deck.length){end();return}}
 const it=deck[idx];$('#item').classList.toggle('noimg',!it.e);const im=$('#pimg');if(it.e&&!HAVE.has(imgOf(it.e))){im.style.display='none';$('#emoji').textContent=it.e;$('#emoji').style.display=''}else if(it.e){im.src=imgOf(it.e);im.alt=it.w;im.style.display='';im.onerror=()=>{im.style.display='none';$('#emoji').textContent=it.e;$('#emoji').style.display=''};$('#emoji').style.display='none'}else{im.style.display='none';$('#emoji').style.display='none'}
 $('#word').dir=/[\u0590-\u05FF]/.test(it.w)?'rtl':'ltr';$('#word').textContent=(curMode==='pic'&&it.e&&!$('#showLabel').checked)?'':it.w;$('#hintP').textContent=MODES[S.cat]?MODES[S.cat].hint[LI()]:''}
function answer(good){if(!playing||busy)return;busy=true;const it=deck[idx];(good?ok:skip).push(it);good?sndOk():sndSkip();
 $('#scoreLive').textContent=ok.length;const f=$('#flash');f.className=good?'g':'s';f.textContent=good?'✅':'⏭️';
 setTimeout(()=>{f.className='';idx++;render();busy=false},650)}
$('#bOk').onclick=()=>answer(true);$('#bSkip').onclick=()=>answer(false);
$('#quit').onclick=exitRound;$('#pauseB').onclick=pauseGame;$('#exitB').onclick=exitRound;$('#resumeB').onclick=resumeGame;$('#exitB2').onclick=exitRound;
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseGame()});
window.addEventListener('devicemotion',e=>{if(!playing||busy||paused)return;const g=e.accelerationIncludingGravity;if(!g||g.z==null)return;
 let z=g.z;const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 if(ios)z=-z;if(localStorage.huInv==='1')z=-z;
 if(Math.abs(z)<3.5){armed=true;return}if(!armed)return;
 if(z<-7){armed=false;answer(true)}else if(z>7){armed=false;answer(false)}});
const li=x=>`<li dir="auto">${x.e?(HAVE.has(imgOf(x.e))?`<img src="${imgOf(x.e)}" alt="">`:`<span class="em">${x.e}</span>`):''}${esc(x.w)}</li>`;
function end(){if(!playing)return;playing=false;phase='';ctl(false);clearInterval(tick);sndEnd();showVideo(null);recStop(true).then(showVideo);const played=S.cur;if(S.teams>1){S.scores[played]+=ok.length;S.turns++}
 const bk=bestKey(S.cat),prev=BEST[bk]||0,rec=ok.length>prev&&ok.length>0;$('#recBanner').style.display=rec?'':'none';if(rec){$('#recBanner').textContent=t('recCel');setTimeout(()=>{confetti(110);sndWin()},700)}if(rec){BEST[bk]=ok.length;localStorage.huBest=JSON.stringify(BEST)}
 $('#sumTitle').textContent=(S.teams>1?S.names[played]+' – ':'')+t('timeUp');
 $('#sumStars').textContent=starStr(starsOf(ok.length));
 $('#sumSub').textContent=(S.teams>1?'+'+ok.length+' '+t('pts')+S.names[played]+' · '+t('total')+' '+S.scores[played]+' · ':'')+(rec&&prev>0?t('newBest'):t('best')+': '+Math.max(prev,ok.length));
 $('#sumScore').textContent=ok.length;
 $('#lOk').innerHTML=ok.map(li).join('')||'<li>—</li>';$('#lSkip').innerHTML=skip.map(li).join('')||'<li>—</li>';
 if(S.teams>1)S.cur=(S.cur+1)%S.teams;board();save();cats();$('#nextUp').textContent=S.teams>1?t('nextUp')+S.names[S.cur]:'';$('#endGame2').style.display=S.teams>1?'':'none';$('#next').textContent=S.teams>1?t('turnOf')+S.names[S.cur]+' ▶':t('again');
 tDone=S.tourn&&S.teams>1&&S.turns>=S.rounds*S.teams;if(tDone){$('#next').textContent=t('toResults');$('#nextUp').textContent='';$('#endGame2').style.display='none'}show('sum')}
let tDone=false;
$('#next').onclick=()=>tDone?winner():pick(S.cat);$('#toHome').onclick=()=>{ui();show('home')};
if(!AGES[S.age])S.age='family';applyLang();if(PAYWALL_ENABLED)PAY.init();if(!S.onboarded)onboard();
if('serviceWorker' in navigator){let rl=false;const had=!!navigator.serviceWorker.controller;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(had&&!rl){rl=true;location.reload()}});navigator.serviceWorker.register('sw.js').then(r=>r.update()).catch(()=>{})}
