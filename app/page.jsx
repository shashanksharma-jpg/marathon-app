"use client";
import{useState,useEffect,useCallback,useRef}from"react";
import{createClient}from"@supabase/supabase-js";
// ── Persistence: localStorage (instant) + Supabase (cross-device backup) ─────
const _url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const _key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const _sb = _url && _url.startsWith("https://") && _key ? createClient(_url, _key) : const LS_KEY = "marathon-shashank-v1";
const STATE_KEY = "marathon-app-shashank";
null;
function lsLoad(){
try{const v=localStorage.getItem(LS_KEY);return v?JSON.parse(v):null;}catch{return null;}
}
function lsSave(state){
try{localStorage.setItem(LS_KEY,JSON.stringify(state));}catch{}
}
async function loadState(){
const local=lsLoad();
if(_sb){
try{
const{data,error}=await _sb.from("app_state").select("value").eq("key",STATE_KEY).singl
if(!error&&data){
const remote=JSON.parse(data.value);
const localCount=local?Object.values(local.chk||{}).filter(Boolean).length:0;
const remoteCount=Object.values(remote.chk||{}).filter(Boolean).length;
if(remoteCount>=localCount){lsSave(remote);return remote;}
}
}catch{}
}
return local;
}
async function saveState(state){
lsSave(state);
if(!_sb) return true;
try{
const{error}=await _sb.from("app_state").upsert({key:STATE_KEY,value:JSON.stringify(state
return !error;
}catch{return true;}
}
const CATS=[
{id:"rg",icon:" ",label:"Running Gear",items:[
{id:"rg1",t:"Running shoes (worn-in, nothing new race day)"},
{id:"rg2",t:"Backup trainers / lightweight shoes"},
{id:"rg3",t:"Running socks — 5–7 pairs moisture-wicking"},
{id:"rg4",t:"Running shorts — 3–4 pairs"},
{id:"rg5",t:"Running singlets/shirts — 3–4"},
{id:"rg6",t:"Long-sleeve top (London & Edinburgh)"},
{id:"rg7",t:"Running tights (Edinburgh)"},
{id:"rg8",t:"Wind jacket / shell (Scotland rain)"},
{id:"rg9",t:"Cap or visor"},
{id:"rg10",t:"Sunglasses"},
{id:"rg11",t:"RACE: bib belt + 4 safety pins from Expo"},
{id:"rg12",t:"RACE: outfit laid out night before (nothing new!)"},
{id:"rg13",t:"RACE: throwaway warm layer for cold start pen"},
]},
{id:"nu",icon:" ",label:"Race Nutrition (Pack Race Day)",items:[
{id:"nu1",t:"Maurten Gel 160 × 5 (race belt: 4 in-race + 1 backup)"},
{id:"nu2",t:"Maurten Gel 100 Caf 100 × 3 (pre-race + km 20 + km 32)"},
{id:"nu3",t:"SaltStick Caps × 15+ (9 race day + training)"},
{id:"nu4",t:"Beetroot shot × 2 (take 60 min pre-race at start area)"},
{id:"nu5",t:"Oats + banana + honey — pre-made or hotel"},
{id:"nu6",t:"Pre-race coffee (hotel room, 90 min before start)"},
]},
{id:"re",icon:" ",label:"Recovery & Health",items:[
{id:"re1",t:"Foam roller (travel size) or massage ball"},
{id:"re2",t:"KT tape / blister plasters"},
{id:"re3",t:"Anti-chafe balm (Body Glide / Vaseline)"},
{id:"re4",t:"Compression socks (flights + recovery)"},
{id:"re5",t:"Ibuprofen / paracetamol"},
{id:"re6",t:"Melatonin 0.5mg (flights + jet lag)"},
{id:"re7",t:"Eye mask + ear plugs (red-eye flights)"},
{id:"re8",t:"Post-marathon: compression tights / ice packs"},
{id:"re9",t:"Tart cherry juice × 4 (post-race recovery)"},
]},
{id:"tr",icon:" ",label:"Travel Essentials",items:[
{id:"tr1",t:"Universal travel adapter (UK plugs)"},
{id:"tr2",t:"Passport + travel docs"},
{id:"tr3",t:"Hertz rental confirmation — DL7PE6"},
{id:"tr4",t:"Medications / prescriptions"},
{id:"tr5",t:"Sunscreen (Las Vegas + London)"},
{id:"tr6",t:"Race bib (from Expo — don't leave to race morning)"},
]},
{id:"cl",icon:" ",label:"Clothing",items:[
{id:"cl1",t:"Light outfits — Las Vegas (warm)"},
{id:"cl2",t:"Layers — London & Edinburgh (10–15°C, rainy)"},
{id:"cl3",t:"Smart casual for dinners"},
{id:"cl4",t:"Comfortable walking shoes — Scotland"},
]},
{id:"bd",icon:" ",label:"Ayaansh's Birthday (Sat 25 Apr)",items:[
{id:"bd1",t:" {id:"bd2",t:" {id:"bd3",t:" {id:"bd4",t:" {id:"bd5",t:" Birthday banner + balloons (T2 Arrivals surprise)"},
Birthday gift — buy Fri 24 Apr (LEGO / Harry Potter Shop)"},
Cinema tickets pre-booked (~2:30pm Sat 25 Apr)"},
Ristorante Olivelli dinner — pre-book 6pm Sat 25 Apr"},
OKAN lunch — pre-book 12:30pm Sat 25 Apr"},
]},
{id:"bk",icon:" ",label:" Book / Action Now!",items:[
{id:"bk1",t:" {id:"bk2",t:" {id:"bk3",t:" {id:"bk4",t:" {id:"bk5",t:" {id:"bk6",t:" {id:"bk7",t:" ]},
UK ETA: gov.uk/eta — all 4 family members (£16 before 8 Apr)"},
LNER First Class: London→Edinburgh Mon 28 Apr (lner.co.uk)"},
OKAN lunch: Sat 25 Apr 12:30pm (+44 7746 025394)"},
Olivelli dinner: Sat 25 Apr 6pm (+44 20 7261 1221)"},
Download TCS London Marathon App (~mid-April)"},
Check letterbox: race pack due by Tue 31 Mar"},
Request late check-out — Park Plaza Westminster"},
];
const SCHEDULE=[
{d:"Sun 19 Apr",type:"reminder",src:"action",loc:"gov.uk/eta",label:" {d:"Sat 12 Apr",type:"long",src:"runna",loc:"Singapore",label:" UK ETA — Apply TODA
21.1km — 7km Easy / 7km M
{d:"Fri 17 Apr",type:"tempo",src:"runna",loc:"Singapore",label:" Tempo 4km • 8km",detail:
{d:"Sat 18 Apr",type:"strength",src:"runna",loc:"Singapore",label:" Light(er) Work • Legs
{d:"Sun 19 Apr",type:"long",src:"runna",loc:"Singapore — Pre-flight",label:" 13km Long Ru
{d:"Sun 19 Apr",type:"flight",src:"travel",loc:"SIN → SFO → LAS",label:" SQ 32 + AS 776",
{d:"Mon 20 Apr",type:"mobility",src:"runna",loc:"Las Vegas hotel",label:" Yoga Session 14
{d:"Mon 20 Apr",type:"conference",src:"travel",loc:"The Venetian Expo, Las Vegas",label:"
{d:"Tue 21 Apr",type:"easy",src:"runna",loc:"Las Vegas Strip",label:" 7.5km Easy Run • PR
{d:"Tue 21 Apr",type:"reminder",src:"travel",loc:"Virgin Atlantic App",label:" 10:00am PD
{d:"Tue 21 Apr",type:"sleep",src:"travel",loc:"VS 156 in-flight",label:" Sleep Window — V
{d:"Wed 22 Apr",type:"flight",src:"travel",loc:"LHR T3 → Park Plaza Westminster",label:"
{d:"Wed 22 Apr",type:"easy",src:"coach",loc:"London — South Bank",label:" Easy Activation
{d:"Fri 24 Apr",type:"shakeout",src:"runna",loc:"St James's Park → ExCeL London",label:"
{d:"Sat 25 Apr",type:"birthday",src:"travel",loc:"LHR T2 → Park Plaza Westminster",label:"
{d:"Sat 25 Apr",type:"rest",src:"coach",loc:"Park Plaza Westminster",label:" Complete Res
{d:"Sun 26 Apr",type:"race",src:"runna",loc:"Green Assembly → Blackheath → The Mall",label:
{d:"Mon 27 Apr",type:"recovery",src:"coach",loc:"Park Plaza Westminster",label:" Post-Mar
{d:"Mon 28 Apr",type:"recovery",src:"coach",loc:"Park Plaza → LNER → Edinburgh",label:" C
{d:"Tue 29 Apr",type:"recovery",src:"coach",loc:"Edinburgh",label:" Family Day — Edinburg
{d:"Wed 30 Apr",type:"easy",src:"coach",loc:"Edinburgh — Holyrood Park",label:" Easy Run
{d:"Thu 1 May",type:"rest",src:"coach",loc:"Scotland → Glasgow",label:" Family Road Trip
{d:"Fri 2 May",type:"flight",src:"travel",loc:"GLA→LHR→SIN",label:" BA 1487 + SQ 317 — Re
{d:"Sun 3 May",type:"travel",src:"travel",loc:"SIN",label:" Home — Arrive Singapore 7:30a
];
const NUTRITION={
preRace:[
{time:"5:30am",what:"Wake up",detail:"Sip 500ml water immediately"},
{time:"6:00am",what:"Breakfast — Hotel Room",detail:"Oats + banana + honey (slow + fast c
{time:"7:30am",what:"Leave Park Plaza",detail:"FREE TfL with race bib. Bag drop closes 8:
{time:"8:00am",what:"Start area (Blackheath)",detail:" Gel 100 Caf 100 #1 (100mg caffei
{time:"9:20am",what:"Into start pen",detail:"Everything peaking. Belt loaded. Throwaway w
],
inRace:[
{km:"Km 0–10",time:"0:00–0:49",gel160:"—",caf:" Pre-race gel building",ss:"1x @ km 5",n
{km:"Km 10",time:"~0:49",gel160:" #1 (40g)",caf:"—",ss:"1x",note:"Cutty Sark — first
{km:"Km 15",time:"~1:14",gel160:"—",caf:"—",ss:"1x",note:"Stay on 4:55–5:05/km."},
{km:"Km 20",time:"~1:38",gel160:" #2 (40g)",caf:" #2 (100mg)",ss:"1x",note:"Tower Bri
{km:"Km 21",time:"~1:43",gel160:"—",caf:"—",ss:"—",note:"HALFWAY Soak it in."},
{km:"Km 25",time:"~2:03",gel160:"—",caf:" building",ss:"1x",note:"Canary Wharf approach
{km:"Km 30",time:"~2:27",gel160:" #3 (40g)",caf:" PEAKING",ss:"1x",note:"Canary Wharf
{km:"Km 32",time:"~2:37",gel160:"—",caf:" #3 (100mg) ",ss:"1x CRITICAL",note:"Caffein
{km:"Km 35",time:"~2:52",gel160:" #4 (40g)",caf:"—",ss:"1x",note:"Embankment — PUSH
{km:"Km 38",time:"~3:06",gel160:"—",caf:" PEAKING",ss:"1x if needed",note:"Water only
{km:"Km 42.2",time:"3:27–3:35",gel160:"Done",caf:"Peak ",ss:"Done",note:" FINISH
],
totals:[
["Gel 160","5 total (4 in-race + 1 backup)","200g carbs","—"],
["Gel 100 Caf 100","3 total (1 pre + 2 in-race)","75g carbs","300mg caffeine"],
["Oats + banana + coffee","Breakfast","~95g carbs","~100mg caffeine"],
["Beetroot shots","2× pre-race (60min before)","~20g carbs","400–800mg nitrates"],
["SaltStick Caps","~9 caps","—","~1,935mg sodium"],
["TOTAL","~3.5 hrs","~390g (~111g/hr) ✓","~400mg caffeine · ~2,580mg sodium ✓"],
],
missed:[
{icon:" {icon:" {icon:" {icon:" {icon:" ",title:"Beetroot Shots ← YOU MISSED THIS",urgency:"high",detail:"400–800mg nitr
",title:"Tart Cherry Juice — Post-Race Recovery",urgency:"medium",detail:"Proven
",title:"Hydration Tracking — Pre-Race Days",urgency:"medium",detail:"Aim for cl
",title:"Oats vs Toast — You Updated Correctly",urgency:"low",detail:"Oats + ban
",title:"Coffee Timing — Important Detail",urgency:"medium",detail:"Coffee at 6a
],
};
const HANDBOOK=[
{icon:" ",title:"Your Start Info — Wave 6 GREEN",items:[
"Bib: 78722 · Assembly: GREEN · Wave: 6",
"Wave start time: 10:00am",
"Nearest station: Blackheath (10-min walk to Green Assembly)",
"Recommended trains: 08:18 / 08:23 / 08:29 → arrive assembly by 08:38",
"All start lines close: 11:30am",
" NO bag drop in Green Assembly — drop small bag at St James's Park on SAT 25 APR",
"Bib is non-transferable · Green background = opted for medal",
"Complete medical info on the BACK of your bib — it could save your life",
]},
{icon:" ",title:"Expo & Bib Collection — ExCeL London",items:[
" ExCeL London, Custom House (Elizabeth Line / DLR)",
"Fri 24 Apr: 10am–8pm (quietest — go after morning run )",
"Sat 25 Apr: 8:30am–5:30pm — DEADLINE 17:30",
"Bring: QR code (from email or TCS App) + passport/photo ID",
"You receive: bib, timing chip, safety pins, kitbag sticker",
" Team Green: NO official kitbag/sticker — bring your own small bag",
"Someone can collect for you: they need your QR code + signed letter + copy of your ID +
"Name printing: visit printmyeventtop.com to pre-order, then get it done at the expo",
]},
{icon:" ",title:"Race Day Transport",items:[
"FREE travel to start: Southeastern trains, DLR, Elizabeth Line, Tube, Overground, " DO NOT tap in/out — just show your bib",
"Leave Park Plaza by 7:30am → London Bridge → Blackheath (Southeastern)",
"DLR starts ~05:30 from Tower Gateway / Lewisham, ~07:00 from Bank",
"Thames Clippers: every 20min to Greenwich Pier → short walk to assembly areas",
" Spectators: do NOT go to the Start — go straight to Cutty Sark (km 10)",
"Post-race: FREE on TfL (Tube/DLR/Elizabeth Line/bus) until 20:00",
" Westminster station: EXIT ONLY after the race",
" Southeastern trains do NOT offer free post-race travel",
]},
{icon:" ",title:"Bag Drop — Team Green Special Rules",items:[
" CRITICAL: No bag drop facility at Green Assembly on race day",
" Drop small bag at St James's Park on SATURDAY 25 APRIL (day before)",
"Look for Team Green bag drop signage on the map (page 16 of guide)",
"Pack a snack in your bag to eat after finishing — pack this on Friday night",
"Do NOT put valuables (phone, cash) in your kitbag",
"After finish: look for Team Green marquee signage to retrieve your bag",
"Only official event kitbags accepted for those who have them",
]},
{icon:" ",title:"The Course",items:[
"Start: Blackheath (Green, Blue, Pink lines merge after ~3 miles)",
"Mile 3–12: Water every 3 miles (Buxton Natural Mineral Water)",
"Mile 7: Lucozade Sport · Mile 13: Lucozade Gel",
"Mile 12–24: Water every 2 miles",
"Mile 15: Lucozade Sport · Mile 19: Lucozade Gel",
"Mile 21 + 23: Lucozade Sport",
"Water Refill Stations at Miles 5, 10, 14, 17, 20 (bring reusable bottle)",
"Toilets: every mile 1–24 + accessible toilets at Mile 1, 2, then every even mile",
"Vaseline: Miles 14, 17, 20, 22",
"Headphones: non-noise-cancelling or bone conduction only — must hear instructions",
"Blue line on road = shortest route. Move left if you need to walk.",
"Km 10: Cutty Sark · Km 21: Tower Bridge · Km 30: Canary Wharf · Km 35: Embankment "Pacers available from 3:00 to 7:30 — bright flag with finish time on their back",
]},
buses"
· Km 4
{icon:" ",title:"Family — Spectator Guide",items:[
" Download TCS London Marathon App — live GPS tracking + split times + predicted finish
"Best spectator spots: Cutty Sark (km 10) · Tower Bridge (km 21) · Embankment (km 35) · T
" Spectators do NOT go to the Start — go straight to Cutty Sark from hotel",
"Park Plaza Westminster is 1.5km from The Mall finish line ",
"Family reunion: Horse Guards Road / Whitehall / Horse Guards Parade — lettered zones A–Z
" AGREE your meeting letter BEFORE race — mobile signal at finish is unreliable",
"Take a screenshot of the meeting plan — don't rely on phone signal",
]},
{icon:" ",title:"Finish Area",items:[
"You receive: finisher medal · Buxton water · GetPRO yoghurt pouch · Lucozade Sport",
"Keep moving after crossing — seek medical help at First Aid if needed",
"Team Green bag collection: look for designated Team Green marquee with signage",
"T-shirt exchange (if wrong size): Information Point at Horse Guards Parade",
"Sensory Calm Tent + Parent & Child Tent + Multi-Faith Prayer Tent available",
"Results online within 24hrs · Race photos within 48hrs via Sportograf",
"Also in the TCS App: finisher selfie frame + virtual medal",
"Post-race free TfL travel until 20:00 · Westminster exit only",
]},
{icon:"⚕ ",title:"Safety & Medical",items:[
"Only race if you are fit and well — running with illness or injury is dangerous",
"Complete medical info on BACK of bib — emergency services will check this",
"Emergency: call 999",
"Drop out: tell staff at nearest First Aid Point — sweep minibus will collect you",
"Free public transport if you drop out — show your bib",
"Dropping out deadline for deferral to 2027: 23:59 Sat 25 Apr",
"Period products available at Start, Finish, and all Drinks Stations",
]},
];
const RESERVATIONS=[
{id:"okan",name:" {id:"olivelli",name:" OKAN — Birthday Lunch",when:"Sat 25 Apr · 12:30pm · Party of 4",addr:"C
Ristorante Olivelli — Birthday Dinner",when:"Sat 25 Apr · 6:00pm SH
];
const TM={
race:{c:"#f59e0b",l:"RACE DAY"},tempo:{c:"#ef4444",l:"TEMPO"},long:{c:"#3b82f6",l:"LONG RUN
easy:{c:"#10b981",l:"EASY RUN"},shakeout:{c:"#6366f1",l:"SHAKEOUT"},strength:{c:"#a855f7",l
mobility:{c:"#06b6d4",l:"MOBILITY"},rest:{c:"#4a5568",l:"REST"},recovery:{c:"#ec4899",l:"RE
flight:{c:"#8b5cf6",l:"FLIGHT"},travel:{c:"#8b5cf6",l:"TRAVEL"},reminder:{c:"#f59e0b",l:"
sleep:{c:"#6366f1",l:"SLEEP"},birthday:{c:"#f472b6",l:"BIRTHDAY "},conference:{c:"#f59e0b
};
export default function App(){
const[tab,setTab]=useState("schedule");
const[cats,setCats]=useState(CATS);
const[chk,setChk]=useState({});
const[coll,setColl]=useState({});
const[newT,setNewT]=useState({});
const[sync,setSync]=useState("idle");
const[filter,setFilter]=useState("all");
const[open,setOpen]=useState({});
const[openH,setOpenH]=useState({});
const[openR,setOpenR]=useState({});
const timer=useRef(null);
useEffect(()=>{
(async()=>{
try{
const s=await loadState();
if(s){if(s.cats)setCats(s.cats);if(s.chk)setChk(s.chk);}
}catch(_){}
setSync("idle");
})();
},[]);
const persist=useCallback((c,k)=>{
setSync("saving");
if(timer.current)clearTimeout(timer.current);
timer.current=setTimeout(async()=>{
const ok=await saveState({cats:c,chk:k});
setSync(ok?"saved":"error");if(ok)setTimeout(()=>setSync("idle"),2000);
},800);
},[]);
const tick=id=>{const k={...chk,[id]:!chk[id]};setChk(k);persist(cats,k);};
const add=cid=>{
const t=(newT[cid]||"").trim();if(!t)return;
const id="c"+Date.now();
const c=cats.map(x=>x.id===cid?{...x,items:[...x.items,{id,t}]}:x);
setCats(c);persist(c,chk);setNewT(p=>({...p,[cid]:""}));
};
const del=(cid,id)=>{
const c=cats.map(x=>x.id===cid?{...x,items:x.items.filter(i=>i.id!==id)}:x);
const k={...chk};delete k[id];setCats(c);setChk(k);persist(c,k);
};
const total=cats.reduce((s,c)=>s+c.items.length,0);
const done=Object.values(chk).filter(Boolean).length;
const pct=total>0?Math.round((done/total)*100):0;
const dot={display:"inline-block",width:6,height:6,borderRadius:"50%",marginRight:4,
background:sync==="saved"?"#4ade80":sync==="saving"?"#f59e0b":sync==="error"?"#f87171":"#
const vis=filter==="all"?SCHEDULE:filter==="runna"?SCHEDULE.filter(s=>s.src==="runna"):SCHE
const TABS=[["schedule"," "],["nutrition"," "],["handbook"," "],["reservations"," "],[
return(
<div style={{minHeight:"100vh",background:"#08070f",fontFamily:"Georgia,serif",color:"#e2
{/* Header */}
<div style={{background:"linear-gradient(160deg,#0f0c1a,#130e22 60%,#0c0f18)",borderBot
<div style={{maxWidth:740,margin:"0 auto"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}
<div>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
<a href="https://shashank.app" style={{display:"flex",alignItems:"center",gap
<div style={{fontSize:9,fontFamily:"monospace",color:"#42d692",letterSpacing:
</div>
<h1 style={{margin:0,fontSize:20,fontWeight:"normal",color:"#f0ebe2"}}>Race-Rea
<div style={{fontSize:9,fontFamily:"monospace",color:"#42d692",marginTop:1}}>FI
<div style={{fontSize:9,fontFamily:"monospace",color:"#3e3660",marginTop:2}}>SI
</div>
<div style={{textAlign:"right"}}>
<div style={{fontSize:22,fontWeight:"bold",color:pct===100?"#4ade80":"#c8a45e",
<div style={{fontSize:9,color:"#3e3660",fontFamily:"monospace"}}>{done}/{total}
<div style={{fontSize:9,fontFamily:"monospace",color:"#3e3660",marginTop:2}}><s
</div>
</div>
<div style={{display:"flex",marginTop:14}}>
{TABS.map(([k,l])=>(
<button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"8px 0",border:"
))}
</div>
</div>
</div>
<div style={{maxWidth:740,margin:"0 auto",padding:"16px 14px 56px"}}>
{/* ── SCHEDULE ── */}
{tab==="schedule"&&<>
<div style={{marginBottom:12,padding:"8px 12px",background:"rgba(239,68,68,0.09)",b
<div style={{fontSize:9,fontFamily:"monospace",color:"#ef4444",letterSpacing:"0.2
<div style={{fontSize:12,color:"#e0b0b0",lineHeight:1.9}}>
<strong style={{color:"#f0ebe2"}}>UK ETA</strong> — all 4 family members · £
<strong style={{color:"#f0ebe2"}}>LNER First Class</strong> — London→Edinbur
<strong style={{color:"#f0ebe2"}}>Book OKAN</strong> — Sat 25 Apr 12:30pm ·
<strong style={{color:"#f0ebe2"}}>Book Olivelli</strong> — Sat 25 Apr 6pm ·
</div>
</div>
<div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
{[["all","ALL","#c8a45e"],["runna","RUNNA","#42d692"],["race","RACE","#f59e0b"],[
<button key={k} onClick={()=>setFilter(k)} style={{padding:"2px 8px",borderRadi
))}
</div>
{vis.map((s,i)=>{
const m=TM[s.type]||TM.rest,isO=open[i],isR=s.type==="race",isB=s.type==="birthda
return(
<div key={i} onClick={()=>setOpen(p=>({...p,[i]:!p[i]}))} style={{marginBottom:
<div style={{padding:"9px 12px",display:"flex",alignItems:"center",gap:10}}>
<div style={{minWidth:52,fontSize:8,fontFamily:"monospace",color:"#4a4260",
{s.d.split(" ").map((w,j)=><div key={j}>{w}</div>)}
</div>
<div style={{flex:1}}>
<div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap",mar
<span style={{fontSize:7,fontFamily:"monospace",color:m.c,border:`1px s
{s.src==="runna"&&<span style={{fontSize:7,fontFamily:"monospace",color
<span style={{fontSize:isR||isB?13:12,color:isR?"#f59e0b":isB?"#f472b6"
</div>
<div style={{fontSize:9,color:"#4a4260",fontFamily:"monospace"}}> </div>
<span style={{fontSize:8,color:"#3e3660",transform:isO?"rotate(180deg)":"no
</div>
{isO&&<div style={{padding:"0 12px 10px 74px",borderTop:`1px solid ${m.c}18`}
<div style={{paddingTop:8,fontSize:11,color:"#9a9090",lineHeight:1.7,whiteS
</div>}
</div>
{s.lo
);
})}
</>}
{/* ── NUTRITION ── */}
{tab==="nutrition"&&<>
<div style={{marginBottom:14,padding:"10px 14px",background:"rgba(245,158,11,0.07)"
<div style={{fontSize:9,fontFamily:"monospace",color:"#f59e0b",letterSpacing:"0.2
<div style={{fontSize:11,color:"#9a8060"}}>Maurten Gel 160 + Gel 100 Caf 100 + Sa
</div>
{/* Products */}
<div style={{fontSize:9,fontFamily:"monospace",color:"#c8a45e",letterSpacing:"0.2em
<div style={{marginBottom:16,display:"flex",flexDirection:"column",gap:6}}>
{[
{e:" ",n:"Maurten Gel 160",p:"40g carbs · 30mg sodium · ~160 kcal · take WITHO
{e:" ",n:"Maurten Gel 100 Caf 100",p:"25g carbs · 100mg caffeine · 22mg sodium
{e:" ",n:"SaltStick Caps",p:"215mg sodium · 63mg K · 22mg Ca · 11mg Mg · take
{e:" ",n:"Beetroot Shot (NEW)",p:"400–800mg nitrates · 60 min pre-race · dilat
].map((p,i)=>(
<div key={i} style={{padding:"10px 12px",border:"1px solid #1a1530",borderRadiu
<span style={{fontSize:20,flexShrink:0}}>{p.e}</span>
<div><div style={{fontSize:13,color:"#f0ebe2",marginBottom:2}}>{p.n}</div><di
</div>
))}
</div>
{/* Pre-race */}
<div style={{fontSize:9,fontFamily:"monospace",color:"#c8a45e",letterSpacing:"0.2em
<div style={{marginBottom:16,border:"1px solid #1a1530",borderRadius:8,overflow:"hi
{NUTRITION.preRace.map((r,i)=>(
<div key={i} style={{display:"flex",gap:0,padding:"9px 12px",borderTop:i>0?"1px
<div style={{minWidth:60,fontSize:9,fontFamily:"monospace",color:"#c8a45e",fl
<div><div style={{fontSize:12,color:"#e2ddd6",marginBottom:2}}>{r.what}</div>
</div>
))}
</div>
{/* In-race */}
<div style={{fontSize:9,fontFamily:"monospace",color:"#c8a45e",letterSpacing:"0.2em
<div style={{marginBottom:16,border:"1px solid #1a1530",borderRadius:8,overflow:"hi
{NUTRITION.inRace.map((r,i)=>{
const isF=r.km==="Km 42.2",isC=r.ss.includes("CRITICAL");
return(
<div key={i} style={{display:"flex",gap:0,padding:"8px 12px",borderTop:i>0?"1
<div style={{minWidth:52,flexShrink:0,paddingTop:1}}>
<div style={{fontSize:9,fontFamily:"monospace",color:isF?"#f59e0b":isC?"#
<div style={{fontSize:8,fontFamily:"monospace",color:"#3e3660"}}>{r.time}
</div>
<div style={{flex:1}}>
<div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:3}}>
{r.gel160!=="—"&&r.gel160!=="Done"&&<span style={{fontSize:9,fontFamily
{r.caf!=="—"&&<span style={{fontSize:9,fontFamily:"monospace",color:r.c
{r.ss!=="—"&&r.ss!=="Done"&&<span style={{fontSize:9,fontFamily:"monosp
</div>
<div style={{fontSize:11,color:"#6b6580",lineHeight:1.4}}>{r.note}</div>
</div>
</div>
);
})}
</div>
{/* Totals */}
<div style={{marginBottom:16,padding:"12px 14px",background:"rgba(16,185,129,0.06)"
<div style={{fontSize:9,fontFamily:"monospace",color:"#10b981",letterSpacing:"0.2
{NUTRITION.totals.map(([prod,qty,carbs,extra],i)=>(
<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px
<span style={{fontSize:11,color:i===NUTRITION.totals.length-1?"#f0ebe2":"#6b9
<div style={{display:"flex",gap:10}}>
<span style={{fontSize:11,fontFamily:"monospace",color:"#10b981"}}>{carbs}<
{extra&&<span style={{fontSize:11,fontFamily:"monospace",color:"#f59e0b"}}>
</div>
</div>
))}
</div>
{/* What you missed */}
<div style={{fontSize:9,fontFamily:"monospace",color:"#c8a45e",letterSpacing:"0.2em
<div style={{display:"flex",flexDirection:"column",gap:8}}>
{NUTRITION.missed.map((m,i)=>{
const isO=openR["m"+i];
const bc=m.urgency==="high"?"rgba(239,68,68,0.3)":m.urgency==="medium"?"rgba(24
const cc=m.urgency==="high"?"#ef4444":m.urgency==="medium"?"#f59e0b":"#4a5568";
return(
<div key={i} onClick={()=>setOpenR(p=>({...p,["m"+i]:!p["m"+i]}))} style={{pa
<div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"space
<div style={{display:"flex",alignItems:"center",gap:8}}>
<span style={{fontSize:18}}>{m.icon}</span>
<span style={{fontSize:12,color:cc,fontWeight:"bold"}}>{m.title}</span>
</div>
<span style={{fontSize:8,color:"#3e3660",transform:isO?"rotate(180deg)":"
</div>
{isO&&<div style={{marginTop:8,fontSize:12,color:"#9a9090",lineHeight:1.65,
</div>
);
})}
</div>
</>}
{/* ── HANDBOOK ── */}
{tab==="handbook"&&<>
<div style={{marginBottom:12,padding:"8px 12px",background:"rgba(245,158,11,0.07)",
<div style={{fontSize:9,fontFamily:"monospace",color:"#f59e0b",letterSpacing:"0.2
<div style={{fontSize:11,color:"#9a8060"}}>Wave 6 Green · Bib 78722 · Start 10:00
</div>
{HANDBOOK.map((s,i)=>{
const isO=openH[i];
return(
<div key={i} style={{marginBottom:8,border:"1px solid #1a1530",borderRadius:7,o
<button onClick={()=>setOpenH(p=>({...p,[i]:!p[i]}))} style={{width:"100%",ba
<div style={{display:"flex",alignItems:"center",gap:10}}><span style={{font
<span style={{fontSize:9,color:"#3e3660",transform:isO?"rotate(180deg)":"no
</button>
{isO&&<div style={{padding:"4px 0 8px",borderTop:"1px solid #1a1530"}}>
{s.items.map((it,j)=>(
<div key={j} style={{display:"flex",gap:8,padding:"6px 12px",borderTop:j>
<span style={{color:"#c8a45e",fontSize:10,marginTop:2,flexShrink:0}}>›<
<span style={{fontSize:12,color:"#b0a898",lineHeight:1.5}}>{it}</span>
</div>
))}
</div>}
</div>
);
})}
<div style={{marginTop:10,padding:"10px 12px",background:"rgba(66,214,146,0.06)",bo
tcslondonmarathon.com · TCS Marathon App (iOS/Android) · Road closures:
</div>
</>}
{/* ── RESERVATIONS ── */}
{tab==="reservations"&&<>
<div style={{marginBottom:12,padding:"8px 12px",background:"rgba(244,114,182,0.07)"
<div style={{fontSize:9,fontFamily:"monospace",color:"#f472b6",letterSpacing:"0.2
<div style={{fontSize:11,color:"#9a7090"}}>Book both TODAY — Saturday is one of L
</div>
{RESERVATIONS.map((r,i)=>{
const booked=chk["res-"+r.id];
const isO=openR[r.id];
return(
<div key={i} style={{marginBottom:14,border:`1px solid ${booked?"rgba(74,222,12
<div style={{padding:"12px 14px"}}>
<div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-b
<div style={{flex:1}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,fl
{booked?<span style={{fontSize:8,fontFamily:"monospace",color:"#4ade8
<span style={{fontSize:14,color:"#f0ebe2",fontWeight:"bold"}}>{r.name
</div>
<div style={{fontSize:10,fontFamily:"monospace",color:"#c8a45e",marginB
<div style={{fontSize:11,color:"#6b6580"}}>{r.addr} · {r.dist}</div>
<div style={{fontSize:11,color:"#42d692",marginTop:2}}>{r.rating}</div>
</div>
<button onClick={e=>{e.stopPropagation();tick("res-"+r.id);}} style={{pad
{booked?"✓ BOOKED":"MARK BOOKED"}
</button>
</div>
<div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
<a href={"tel:"+r.phone} style={{fontSize:10,fontFamily:"monospace",color
<a href={"https://"+r.web} target="_blank" rel="noreferrer" style={{fontS
<button onClick={()=>setOpenR(p=>({...p,[r.id]:!p[r.id]}))} style={{fontS
</div>
</div>
{isO&&<div style={{padding:"0 14px 12px",borderTop:"1px solid #1a1530",backgr
<div style={{marginTop:10,fontSize:11,color:"#9a9090"}}><strong style={{col
<div style={{marginTop:8,fontSize:11,color:"#9a9090",whiteSpace:"pre-line"}
</div>}
</div>
);
})}
<div style={{padding:"10px 14px",background:"rgba(200,164,94,0.05)",border:"1px sol
<div style={{fontSize:9,fontFamily:"monospace",color:"#c8a45e",letterSpacing:"0.1
{[["7:30am"," Reunite at T2 — birthday!"],["10:30am","Gentle walk: Westminster
<div key={i} style={{display:"flex",gap:10,padding:"5px 0",borderTop:i>0?"1px s
<span style={{fontSize:9,fontFamily:"monospace",color:t==="9:30pm"?"#ef4444":
<span style={{fontSize:12,color:t==="9:30pm"?"#ef4444":"#e2ddd6"}}>{a}</span>
</div>
))}
</div>
</>}
{/* ── PACKING ── */}
{tab==="pack"&&<>
<div style={{marginBottom:14}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",ma
<div style={{fontSize:9,fontFamily:"monospace",color:"#3e3660",letterSpacing:"0
{done>0&&<button onClick={()=>{setChk({});persist(cats,{});}} style={{fontSize:
</div>
<div style={{height:2,background:"#1a1630",borderRadius:2}}>
<div style={{height:"100%",borderRadius:2,background:pct===100?"#4ade80":"linea
</div>
{pct===100&&<div style={{marginTop:6,fontSize:11,color:"#4ade80",fontFamily:"mono
</div>
{cats.map(cat=>{
const cd=cat.items.filter(i=>chk[i.id]).length;
const done2=cd===cat.items.length&&cat.items.length>0;
const isColl=coll[cat.id];
const isB=cat.id==="bd",isBk=cat.id==="bk";
const bc=isBk?"rgba(245,158,11,0.35)":isB?"rgba(244,114,182,0.3)":done2?"rgba(74,
return(
<div key={cat.id} style={{marginBottom:8}}>
<button onClick={()=>setColl(p=>({...p,[cat.id]:!p[cat.id]}))} style={{width:
<div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontS
<div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontS
</button>
{!isColl&&<div style={{border:`1px solid ${bc}`,borderTop:"none",borderRadius
{cat.items.map((item,idx)=>(
<div key={item.id} style={{display:"flex",alignItems:"center",gap:10,padd
<button onClick={()=>tick(item.id)} style={{width:16,height:16,minWidth
{chk[item.id]&&<span style={{color:"#08070f",fontSize:9,fontWeight:"b
</button>
<span style={{fontSize:11,color:chk[item.id]?"#3d3d50":"#c0b9af",flex:1
<button onClick={()=>del(cat.id,item.id)} style={{background:"none",bor
</div>
))}
<div style={{display:"flex",gap:6,padding:"6px 10px",borderTop:"1px solid #
<input placeholder="Add item…" value={newT[cat.id]||""} onChange={e=>setN
<button onClick={()=>add(cat.id)} style={{background:"rgba(124,95,255,0.1
</div>
</div>}
</div>
);
})}
</>}
</div>
</div>
);
}
