"use client";
import{useState,useEffect,useCallback,useRef}from"react";
import{createClient}from"@supabase/supabase-js";

const _url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const _key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const _sb=_url&&_key?createClient(_url,_key):null;
const STATE_KEY="marathon-app-shashank";

async function loadState(){
  if(!_sb)return null;
  const{data,error}=await _sb.from("app_state").select("value").eq("key",STATE_KEY).single();
  if(error||!data)return null;
  try{return JSON.parse(data.value);}catch{return null;}
}
async function saveState(state){
  if(!_sb)return false;
  const{error}=await _sb.from("app_state").upsert({key:STATE_KEY,value:JSON.stringify(state),updated_at:new Date().toISOString()});
  return!error;
}

const CATS=[
  {id:"rg",icon:"👟",label:"Running Gear",items:[
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
  {id:"nu",icon:"⚡",label:"Race Nutrition (Pack Race Day)",items:[
    {id:"nu1",t:"Maurten Gel 160 × 5 (race belt: 4 in-race + 1 backup)"},
    {id:"nu2",t:"Maurten Gel 100 Caf 100 × 3 (pre-race + km 20 + km 32)"},
    {id:"nu3",t:"SaltStick Caps × 15+ (9 race day + training)"},
    {id:"nu4",t:"Beetroot shot × 2 (take 60 min pre-race at 7:00am)"},
    {id:"nu5",t:"Oats + banana + honey — pre-made or hotel"},
    {id:"nu6",t:"Pre-race coffee (hotel room, 6:00am)"},
  ]},
  {id:"re",icon:"💊",label:"Recovery & Health",items:[
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
  {id:"tr",icon:"🌍",label:"Travel Essentials",items:[
    {id:"tr1",t:"Universal travel adapter (UK plugs)"},
    {id:"tr2",t:"Passport + travel docs"},
    {id:"tr3",t:"Hertz rental confirmation — DL7PE6"},
    {id:"tr4",t:"Medications / prescriptions"},
    {id:"tr5",t:"Sunscreen (Las Vegas + London)"},
    {id:"tr6",t:"Race bib (from Expo — don't leave to race morning)"},
  ]},
  {id:"cl",icon:"👔",label:"Clothing",items:[
    {id:"cl1",t:"Light outfits — Las Vegas (warm)"},
    {id:"cl2",t:"Layers — London & Edinburgh (10–15°C, rainy)"},
    {id:"cl3",t:"Smart casual for dinners"},
    {id:"cl4",t:"Comfortable walking shoes — Scotland"},
  ]},
  {id:"bd",icon:"🎂",label:"Ayaansh's Birthday (Sat 25 Apr)",items:[
    {id:"bd1",t:"🎈 Birthday banner + balloons (T2 Arrivals surprise)"},
    {id:"bd2",t:"🎁 Birthday gift — buy Thu 24 Apr (LEGO / Harry Potter Shop)"},
    {id:"bd3",t:"🎬 Cinema tickets pre-booked (~2:30pm Sat 25 Apr)"},
    {id:"bd4",t:"🍝 Ristorante Olivelli dinner — pre-book 6pm Sat 25 Apr"},
    {id:"bd5",t:"🍱 OKAN lunch — pre-book 12:30pm Sat 25 Apr"},
  ]},
  {id:"bk",icon:"📋",label:"🔴 Book / Action Now!",items:[
    {id:"bk1",t:"🚨 UK ETA: gov.uk/eta — all 4 family members (£16 before 8 Apr)"},
    {id:"bk2",t:"🚂 LNER First Class: London→Edinburgh Mon 28 Apr (lner.co.uk)"},
    {id:"bk3",t:"🍱 OKAN lunch: Sat 25 Apr 12:30pm (+44 7746 025394)"},
    {id:"bk4",t:"🍝 Olivelli dinner: Sat 25 Apr 6pm (+44 20 7261 1221)"},
    {id:"bk5",t:"📲 Download TCS London Marathon App"},
    {id:"bk6",t:"📦 Check letterbox: race pack due by Tue 31 Mar"},
    {id:"bk7",t:"🛏️ Request late check-out — Park Plaza Westminster"},
  ]},
];

const GARMIN_CHECKS=[
  {id:"gc_activity",label:"Start as plain Running — NOT Runna structured workout",detail:"Critical: Runna structured workout mode overrides auto lap with segment laps. This gave you 9 laps in Berlin and Tokyo instead of 42. On race day open Garmin → Running directly. Do NOT launch via Runna.",critical:true},
  {id:"gc_autolap",label:"Auto Lap set to 1km",detail:"Hold UP → Settings → Activities & Apps → Running → Activity Settings → Auto Lap → By Distance → 1km. Sydney used this correctly (43 laps). Berlin and Tokyo didn't (9 laps each).",critical:true},
  {id:"gc_pace",label:"Pace alert: alarm if faster than 5:05/km",detail:"Activity Settings → Alerts → Add Alert → Pace → Fast → 5:05/km. London at 10°C will feel effortless in the first 5km. This is your external referee for the cold trap.",critical:true},
  {id:"gc_hr",label:"HR alert: alarm if above 162bpm",detail:"Activity Settings → Alerts → Add Alert → Heart Rate → Above → 162bpm. Your LT is 175bpm. Above 162 before km 20 = spending tomorrow's energy today.",critical:true},
  {id:"gc_tone",label:"Lap alert: vibrate + tone (not vibrate only)",detail:"Race noise is loud — 50,000 runners, crowds, bands. Vibration alone will be missed. Set to vibrate AND tone so you feel and hear every 1km beep.",critical:false},
  {id:"gc_screens",label:"4 data screens configured",detail:"Screen 1: Current pace + HR + Distance. Screen 2: Lap pace + Lap distance + Elapsed time. Screen 3: Elapsed time + Distance + Avg pace. Screen 4: Heart rate large + HR zone + Elapsed time.",critical:false},
  {id:"gc_salt",label:"35-min repeating timer for SaltStick",detail:"Menu → Timer → Countdown → 35:00 → Repeat On. Set as a separate countdown timer, not a lap alert. Fires every 35 min from km 5.",critical:false},
  {id:"gc_scroll",label:"Auto Scroll turned OFF",detail:"Settings → Activities & Apps → Running → Activity Settings → Auto Scroll → Off. You choose when to change screens. Auto scroll at the wrong moment breaks concentration.",critical:false},
  {id:"gc_charge",label:"Watch fully charged — Saturday night before race",detail:"42km with GPS + HR + alerts drains battery. Charge to 100% Saturday night. Don't leave it until race morning.",critical:false},
];

const SCHEDULE=[
  {d:"Fri 18 Apr",type:"tempo",src:"runna",loc:"Singapore SGT",label:"🏃 Tempo 4km • Last quality session",detail:"Last hard session before travel. Run 2km at exactly 4:58/km to lock marathon pace in muscle memory before leaving Singapore.\n3km warm up → 4km tempo → 1km cool down."},
  {d:"Sun 19 Apr",type:"long",src:"runna",loc:"Singapore SGT — Pre-flight",label:"🏃 13km Easy Run • PRE-FLIGHT + gel practice",detail:"5:30am start → finish 6:45am → SQ32 departs 09:15 SGT.\nConversational pace. Take gel at km 5 — dress rehearsal. Compression socks on immediately after."},
  {d:"Sun 19 Apr",type:"flight",src:"travel",loc:"SIN → SFO → LAS",label:"✈️ SQ 32 + AS 776 → Las Vegas",detail:"SIN T3 09:15 → SFO 09:10 PDT (2h17 layover) → LAS ~1:13pm PDT.\nCompression socks. 250ml water/hr. Set watch to Vegas time on landing."},
  {d:"Sun 19 Apr",type:"sleep",src:"coach",loc:"Las Vegas PDT",label:"😴 Arrive 1pm PDT — Sleep night 1 of 2",detail:"Short walk in daylight immediately after check-in — anchors body clock to PDT.\nDo NOT nap. Early dinner. Bed by 10pm PDT sharp. This is Las Vegas sleep night 1 of 2."},
  {d:"Mon 20 Apr",type:"mobility",src:"runna",loc:"Las Vegas hotel PDT",label:"🧘 Yoga Session 14 • 30 min",detail:"Hips & glutes focus. Poolside or hotel room. Perfect jet lag recovery."},
  {d:"Mon 20 Apr",type:"conference",src:"travel",loc:"The Venetian Expo, Las Vegas PDT",label:"🎯 Adobe Summit — Day 1",detail:"Expect 8–12k steps indoors. Cushioned non-running shoes.\n⚠️ Bed by 10pm PDT. Zero alcohol. This is Las Vegas sleep night 2 of 2 — both matter."},
  {d:"Tue 21 Apr",type:"conference",src:"travel",loc:"The Venetian Expo, Las Vegas PDT",label:"🎯 Adobe Summit — Day 2 → VS 156",detail:"Final Summit day. VS 156 departs 10pm PDT — your Tuesday night sleep IS the flight.\nCheck in online at 10am PDT."},
  {d:"Tue 21 Apr",type:"sleep",src:"travel",loc:"VS 156 in-flight",label:"😴 Sleep Window — VS 156 (10pm PDT → LHR 3:55pm GMT)",detail:"Board → melatonin 0.5mg 1hr after takeoff → eye mask + ear plugs → no screens → sleep the full 9.5hrs.\nNo alcohol. No films. This flight IS your Tuesday night sleep."},
  {d:"Wed 22 Apr",type:"flight",src:"travel",loc:"LHR T3 → Park Plaza Westminster (PIN 5417)",label:"✈️ Arrive London 3:55pm GMT — Check In",detail:"Drop bags → walk South Bank immediately. Natural light = jet lag reset.\nStay awake until 10pm GMT minimum."},
  {d:"Wed 22 Apr",type:"easy",src:"coach",loc:"London — South Bank GMT",label:"🏃 Easy Activation Run — South Bank",detail:"4km, Zone 1. Walk out of hotel, cross Westminster Bridge, run east.\nGoal: light exposure + circulation only."},
  {d:"Thu 24 Apr",type:"shakeout",src:"runna",loc:"St James's Park → ExCeL London GMT",label:"🏃 Race Pace Fartlek • 8km + Expo + Gift",detail:"2km warm up → 2km @ 5:00/km → 1km easy → 2km @ 5:00/km → 1km cool down\n\n🏁 EXPO: ExCeL London, Custom House (Elizabeth Line). Thu 10am–8pm = quietest day. Bring QR code + passport.\n\n🎁 GIFT: LEGO Store Leicester Sq or Harry Potter Shop Platform 9¾."},
  {d:"Fri 25 Apr",type:"birthday",src:"travel",loc:"LHR T2 → Park Plaza GMT",label:"🎂 Ayaansh's 10th! Fetch Family — T2 (SQ 322 lands 5:55am)",detail:"Leave Park Plaza by 6:30am.\n\n7:30am — 🎈 Reunite at T2!\n10:30am — Gentle walk: Westminster → Big Ben\n12:30pm — 🍱 OKAN (4 min walk)\n2:30pm — Cinema or Borough Market\n4:30pm — Hotel nap — MANDATORY FOR YOU\n6:00pm — 🍝 Ristorante Olivelli (pasta carb load + birthday dinner)\n8:00pm — Lay out race kit. Pin bib. Set 3 alarms.\n9:30pm — SLEEP. Non-negotiable."},
  {d:"Sat 26 Apr",type:"race",src:"runna",loc:"Greenwich Start → The Mall GMT",label:"🏅 TCS LONDON MARATHON",detail:"TARGET: 3h27–3h35 @ 4:55–5:05/km\nMass start 09:35. Leave Park Plaza 7:30am (FREE TfL with race bib).\n\n⌚ GARMIN: Plain Running mode (NOT Runna). 1km auto lap. Pace alert >5:05. HR alert >162bpm.\n\n7:00am: 🍇 Beetroot shots (2×, hotel room — 60 min pre-start)\n8:00am: ☕ Gel 100 Caf 100 #1 + 1x SaltStick\nKm 5: SaltStick\nKm 10: 🟠 Gel 160 #1 + SaltStick\nKm 20: 🟠 Gel 160 #2 + ☕ Gel 100 Caf 100 #2 + SaltStick\nKm 30: 🟠 Gel 160 #3 + SaltStick\nKm 32: ☕ Gel 100 Caf 100 #3 + SaltStick ⚠️ CRITICAL\nKm 35: 🟠 Gel 160 #4 + SaltStick\nKm 38: Water only. Family — Embankment north side, Hungerford Bridge.\nKm 42.2: THE MALL 🏅"},
  {d:"Sun 27 Apr",type:"recovery",src:"coach",loc:"Park Plaza Westminster GMT",label:"💆 Post-Marathon Rest",detail:"Hotel bathtub soak / ice bath. Room service. 9–10hrs sleep.\nTart cherry juice. Ibuprofen for inflammation."},
  {d:"Mon 28 Apr",type:"recovery",src:"coach",loc:"Park Plaza → LNER → Edinburgh GMT",label:"🚂 Check Out + LNER First Class → Edinburgh",detail:"Check-out 12pm. Westminster → King's Cross (4 stops, 10 min).\nLNER First Class: King's Cross Lounge + at-seat meal = recovery nutrition.\n~4h08 to Edinburgh Waverley."},
  {d:"Wed 30 Apr",type:"easy",src:"coach",loc:"Edinburgh — Holyrood Park GMT",label:"🏃 Easy Run — Arthur's Seat (if legs ready)",detail:"5km Zone 1. Hertz pickup 9am — run before then. Only if legs feel good."},
  {d:"Fri 2 May",type:"flight",src:"travel",loc:"GLA→LHR→SIN",label:"✈️ BA 1487 + SQ 317 — Return to Singapore",detail:"BA 1487 GLA→LHR 5pm T5. Renaissance Heathrow overnight.\nSQ 317 LHR T2 11:25am Sat → SIN 7:30am Sun 3 May.\nMelatonin once airborne. Compression socks."},
  {d:"Sun 3 May",type:"travel",src:"travel",loc:"SIN",label:"🏠 Home — Arrive Singapore 7:30am SGT",detail:"Full rest day. Don't run. Rest IS the training now. 🏆"},
];

const NUTRITION={
  preRace:[
    {time:"5:30am",what:"Wake up",detail:"Sip 500ml water immediately"},
    {time:"6:00am",what:"Breakfast",detail:"Oats + banana + honey (~95g carbs) · Coffee (~100mg caffeine)"},
    {time:"7:00am",what:"🍇 Beetroot Shots",detail:"2× concentrated shots · 400–800mg nitrates · 60 min pre-start · BUY: HiBAR or Beet It from Holland & Barrett"},
    {time:"7:30am",what:"Leave Park Plaza",detail:"FREE TfL with race bib. Bag drop closes 8:45am."},
    {time:"8:00am",what:"Blackheath start area",detail:"☕ Gel 100 Caf 100 #1 (100mg caffeine + 25g carbs) · 1x SaltStick · ⏱ Caffeine peaks at 9:35am gun"},
    {time:"9:20am",what:"Into start pen",detail:"Everything peaking. Belt loaded. Write on forearm: 7/14/20☕/27/32☕"},
  ],
  inRace:[
    {km:"Km 0–10",time:"0:00–0:49",gel160:"—",caf:"☕ Pre-race building",ss:"1x @ km 5",note:"HR <155. Stay behind 3:30 pacer."},
    {km:"Km 10",time:"~0:49",gel160:"🟠 #1 (40g)",caf:"—",ss:"1x",note:"Cutty Sark — first crowd surge. Hold pace."},
    {km:"Km 15",time:"~1:14",gel160:"—",caf:"—",ss:"1x",note:"Stay on 4:55–5:05/km."},
    {km:"Km 20",time:"~1:38",gel160:"🟠 #2 (40g)",caf:"☕ #2 (100mg)",ss:"1x",note:"Tower Bridge. HOLD — do not surge. Caffeine peaks km 29–30."},
    {km:"Km 25",time:"~2:03",gel160:"—",caf:"☕ building",ss:"1x",note:"Body scan checkpoint. Controlled → push slightly."},
    {km:"Km 30",time:"~2:27",gel160:"🟠 #3 (40g)",caf:"☕ PEAKING",ss:"1x",note:"Canary Wharf. 'Not tired, just cold.' NOW you race."},
    {km:"Km 32",time:"~2:37",gel160:"—",caf:"☕ #3 (100mg) ⚠️",ss:"1x CRITICAL",note:"Caffeine peaks km 40–42. Cramp prevention."},
    {km:"Km 35",time:"~2:52",gel160:"🟠 #4 (40g)",caf:"—",ss:"1x",note:"Embankment — PUSH."},
    {km:"Km 38",time:"~3:06",gel160:"—",caf:"☕☕ PEAKING",ss:"1x if needed",note:"Family — Hungerford Bridge north side. 4km to go."},
    {km:"Km 42.2",time:"3:27–3:35",gel160:"Done",caf:"Peak",ss:"Done",note:"🏅 THE MALL — FINISH LINE"},
  ],
  totals:[
    ["Gel 160","5 total (4 in-race + 1 backup)","200g carbs","—"],
    ["Gel 100 Caf 100","3 total (1 pre + 2 in-race)","75g carbs","300mg caffeine"],
    ["Breakfast","Oats + banana + coffee","~95g carbs","~100mg caffeine"],
    ["Beetroot shots","2× at 7:00am hotel","~20g carbs","400–800mg nitrates"],
    ["SaltStick Caps","~9 caps","—","~1,935mg sodium"],
    ["TOTAL","~3.5 hrs","~390g (~111g/hr) ✓","~400mg caffeine · ~2,580mg sodium ✓"],
  ],
  missed:[
    {icon:"🍇",title:"Beetroot Shots ← HIGH VALUE — SET 7AM ALARM NOW",urgency:"high",detail:"400–800mg nitrates 60 min pre-race dilate blood vessels and reduce energy cost of running by 2–3%. Take at 7:00am at the hotel before you leave for Blackheath. Buy: HiBAR or Beet It from Holland & Barrett near Park Plaza."},
    {icon:"🍒",title:"Tart Cherry Juice — Post-Race Recovery",urgency:"medium",detail:"Proven to reduce DOMS and inflammation. Drink 250ml immediately post-race and daily for 3–4 days in Edinburgh. Buy before you fly — hard to find in London on race weekend."},
    {icon:"🌊",title:"Hydration — Pre-Race Days Wed–Fri",urgency:"medium",detail:"500ml with electrolytes on waking each day. Jet lag + hotel AC + London cold masks dehydration — you won't feel thirsty but will be losing fluids."},
    {icon:"☕",title:"Coffee Timing — Correctly Spaced",urgency:"low",detail:"Coffee at 6am (90 min before 8am Caf gel) is correctly spaced. The caffeine from coffee metabolises before your Gel 100 Caf 100 kicks in. Don't have coffee AND a Caf gel simultaneously — 200mg at once risks GI distress."},
  ],
};

const HANDBOOK=[
  {icon:"🏁",title:"Start Times",items:["Elite wheelchair: 08:50","Elite women: 09:05","Mass start: 09:35 (waves to 11:30)","Your start colour/zone is in your bib packet — check it the night before","Be in your pen well before 09:35","Cut-off: 8 hours from mass start"]},
  {icon:"🎟️",title:"Expo & Bib Collection",items:["ExCeL London E16 1XL — Custom House (Elizabeth Line or DLR)","Wed–Fri: 10am–8pm | Sat: 8:30am–5:30pm","Thu is quietest — go after your morning shakeout run","Bring: confirmation email (QR code) + passport","You receive: bib, 4 safety pins, kit bag"]},
  {icon:"🚇",title:"Race Day Transport",items:["FREE TfL travel all day with race bib","Road closures from 07:00 — no driving","Bag drop closes 8:45am — leave hotel by 7:30am","DLR to Greenwich or National Rail to Blackheath — busy 6–8:30am"]},
  {icon:"👨‍👩‍👦",title:"Family Spectator Guide",items:["Download TCS London Marathon App — live GPS tracking","Best spot: Embankment km 38 — leave hotel when tracker shows km 35","Park Plaza is 1.5km from The Mall finish","Family reunion: Horse Guards Road — AGREE LETTER ZONE BEFORE RACE","⚠️ Mobile signal at finish is unreliable — screenshot meeting plan"]},
  {icon:"🗺️",title:"Course Landmarks",items:["Km 10: Cutty Sark — first big crowd surge","Km 12: Tower Bridge — emotional highlight. DO NOT SURGE.","Km 22–24: Canary Wharf loop — mentally toughest. 'Not tired, just cold.'","Km 35–40: Embankment — finish direction visible","Km 42.2: The Mall, Buckingham Palace","Flat course: only 119–138m total elevation gain. Pacers 3:00–7:30."]},
  {icon:"🎒",title:"Bag Drop & Post-Race",items:["One small kit bag per runner — collected post-race at The Mall","Bag drop closes 8:45am at start","Finisher medal + t-shirt at The Mall","Family reunion at Horse Guards Road (alphabetical zones)"]},
];

const RESERVATIONS=[
  {id:"okan",name:"🍱 OKAN — Birthday Lunch",when:"Sat 25 Apr · 12:30pm · Party of 4",addr:"County Hall, Belvedere Rd, SE1 7PB",dist:"4-min walk from Park Plaza",phone:"+44 7746 025394",web:"okanlondon.com",rating:"4.6★ · Vegetarian Japanese",why:"Vegetarian Japanese — Ayaansh's pick. Open kitchen he'll love. 4 min walk saves pre-race steps.",menu:"Ayaansh: veg gyoza · tofu okonomiyaki · edamame · miso udon\nShashank: miso soup · rice dishes (carb top-up)"},
  {id:"olivelli",name:"🍝 Ristorante Olivelli — Birthday Dinner + Carb Load",when:"Sat 25 Apr · 6:00pm SHARP · Party of 4",addr:"61 The Cut, SE1 8LL",dist:"12-min walk from Park Plaza",phone:"+44 20 7261 1221",web:"ristoranteolivelli.co.uk",rating:"4.4★ · Sicilian Italian",why:"Birthday dinner AND pasta carb load in one. Great veggie pasta for Ayaansh. Eat by 6pm for full digestion before 9:35am start.",menu:"Ayaansh: pistachio pasta · vegetarian lasagne · pomodoro\nShashank: plain pasta + tomato sauce (150–200g carbs). No cream, no alcohol."},
];

const INTEL_MODELS=[
  {name:"Riegel + heat correction",result:"3:29–3:33",conf:65,detail:"2XU half 1:51:11 in 33°C → raw Riegel 3:39 → −5% heat gain for London 10°C."},
  {name:"VO2 Max / Daniels VDOT",result:"3:24–3:30",conf:70,detail:"Garmin 50–51 heat-suppressed. True VO2 ~53–55. Daniels tables → 3:24–3:30."},
  {name:"Tempo session analysis",result:"3:24–3:32",conf:75,detail:"4:57/km at HR 166 in Jakarta 33°C. Heat-adjusted → ~4:42 effort. Marathon: 4:52–5:02/km London."},
  {name:"Long run extrapolation",result:"3:28–3:36",conf:60,detail:"34km @ 6:02 in 32°C. Heat-adj → 5:44 long run. Minus 60–75s = 4:58–5:05/km marathon."},
  {name:"HR-calibrated (anchor model)",result:"3:26–3:30",conf:85,detail:"2XU at exactly LT (175bpm). Marathon target 88% LT = 154bpm. At 10°C → 4:55–5:00/km. HIGHEST CONFIDENCE."},
];

const INTEL_RACES=[
  {name:"Sydney",date:"Sep 2024",temp:"19°C",actual:"3:53:49",predicted:"3:47–3:52",potential:"3:43",gap:"+2 min",cause:"First marathon. Model was accurate within 2 min. Small overrun from inexperience.",hrAvg:159,fade:"Modest"},
  {name:"Tokyo",date:"Mar 2025",temp:"25°C",actual:"3:51:11",predicted:"3:48",potential:"3:38",gap:"+13 min vs potential",cause:"Garmin flagged OVERREACHING (TE=5.0). 201 min in Zone 4, 19.5 min in Zone 5. Training supported 3:37–3:43.",hrAvg:165,fade:"16s/km"},
  {name:"Berlin",date:"Sep 2025",temp:"29°C",actual:"3:48:07",predicted:"3:44–3:47",potential:"3:36",gap:"+4 min",cause:"29°C heat + acute load too high in final 2 weeks (POOR readiness Sep 3–9, load >1200). Pacing: 5:09/km → faded 21s/km. Berlin block was solid: 110 runs, 83km peak weeks, HRV recovered to 84–86ms.",hrAvg:169,fade:"21s/km"},
];

const INTEL_RISKS=[
  {id:"r1",sev:"HIGH",title:"The fade — Berlin +21s/km, Tokyo +16s/km",data:"Both fades started km 22–25. Root cause: 10–15s/km too fast early.",tips:[
    {a:"Garmin pace alert at 5:05/km for first 20km",w:"Tonight — set now"},
    {a:"Sit behind 3:30 pacer until km 25. Not beside — behind.",w:"Race start corrals"},
    {a:"Check HR at km 5, 10, 15. Must be <155bpm. Above 160 before km 15 → ease off.",w:"Race km 0–20"},
    {a:"km 25 body scan: controlled → 4:55/km. Not great → hold 5:02.",w:"km 25 checkpoint"},
  ]},
  {id:"r2",sev:"HIGH",title:"The cold trap — never raced below 19°C",data:"London ~10°C. HR will be 10–15bpm lower at same pace. Will feel effortless. It lies.",tips:[
    {a:"10-min shakeout in cold air before race. Recalibrate what 'easy' feels like at 10°C.",w:"7:15am race morning"},
    {a:"Ignore pace feel for first 5km entirely. Watch only.",w:"km 0–5"},
    {a:"Throwaway layer for start corrals. Discard by km 3.",w:"Pack for London"},
    {a:"Tower Bridge km 12: crowd roars, legs beg to surge. Hold 5:02. Smile. Wave. Don't accelerate.",w:"km 12"},
    {a:"Write 'NOT TIRED' on your hand. Canary Wharf discomfort = cold, not fatigue.",w:"Race morning"},
  ]},
  {id:"r3",sev:"HIGH",title:"Las Vegas — 2 critical nights, 6 days before race",data:"Arrive LAS ~1pm Sun 19 PDT. Sleep nights: Sun 19 PDT + Mon 20 PDT. Tue 21 flight IS your sleep.",tips:[
    {a:"Sun 19 PDT arrival: walk in daylight, no nap, bed by 10pm PDT.",w:"Sun 19 Apr PDT"},
    {a:"Mon 20 PDT: bed by 10pm PDT. Zero alcohol both nights.",w:"Mon 20 Apr PDT"},
    {a:"VS 156 Tue 21 10pm PDT: melatonin 0.5mg 1hr after takeoff. 9.5hrs airborne sleep. No screens.",w:"Tue 21 Apr 10pm PDT"},
    {a:"London priority sleep: Thu 24 + Fri 25 Apr GMT nights matter most for race day.",w:"Thu 24 + Fri 25 Apr GMT"},
  ]},
  {id:"r4",sev:"MED",title:"4:58/km — never sustained at marathon distance",data:"Best marathon km ever: 5:09 (Berlin first 17km). 4:58 is 11s/km uncharted territory.",tips:[
    {a:"Fri 18 Apr SGT tempo: run 2km at exactly 4:58/km. Lock the pace feel before you leave Singapore.",w:"Fri 18 Apr SGT"},
    {a:"Write on wrist: 10k=49:50 / HM=1:44:30 / 30k=2:29:00",w:"Race morning"},
    {a:"km 0–30 = execution. km 30–42 = racing. Don't swap them.",w:"Mental framework"},
  ]},
  {id:"r5",sev:"MED",title:"Nutrition execution — 390g carbs, timing is everything",data:"Berlin fade consistent with glycogen depletion from km 22+. Gut needs rehearsal not race day debut.",tips:[
    {a:"Sun 19 Apr SGT pre-flight run: take gel at km 5 exactly as race day plan",w:"Sun 19 Apr SGT morning"},
    {a:"Beetroot shots: 7:00am race morning — SET PHONE ALARM NOW",w:"Sun 26 Apr 7:00am"},
    {a:"Write on forearm: 7 / 14 / 20☕ / 27 / 32☕",w:"Race morning"},
    {a:"SaltStick: 35-min repeating Garmin timer — set up tonight",w:"Garmin setup tonight"},
  ]},
];

const INTEL_PACING=[
  {km:"0–3km",pace:"5:08–5:12",hr:"<150",note:"Deliberately boring. Let everyone go.",col:"rgba(26,47,74,0.6)"},
  {km:"3–10km",pace:"5:02–5:05",hr:"<155",note:"Find 3:30 pacer. Sit behind them.",col:"rgba(26,47,74,0.6)"},
  {km:"10–21km",pace:"4:58–5:02",hr:"155–162",note:"Locked in. Tower Bridge km 12 — hold.",col:"rgba(26,58,42,0.6)"},
  {km:"21–30km",pace:"4:58–5:00",hr:"158–165",note:"Canary Wharf — 'not tired, just cold'.",col:"rgba(26,58,42,0.6)"},
  {km:"30–37km",pace:"4:55–5:00",hr:"162–170",note:"Caffeine gel km 32. NOW racing.",col:"rgba(58,42,10,0.6)"},
  {km:"37–42.2km",pace:"Whatever's left",hr:"Max",note:"Family at km 38. Empty the tank.",col:"rgba(58,26,26,0.6)"},
];

const TM={
  race:{c:"#f59e0b",l:"RACE DAY"},tempo:{c:"#ef4444",l:"TEMPO"},long:{c:"#3b82f6",l:"LONG RUN"},
  easy:{c:"#10b981",l:"EASY RUN"},shakeout:{c:"#6366f1",l:"SHAKEOUT"},strength:{c:"#a855f7",l:"STRENGTH"},
  mobility:{c:"#06b6d4",l:"MOBILITY"},rest:{c:"#4a5568",l:"REST"},recovery:{c:"#ec4899",l:"RECOVERY"},
  flight:{c:"#8b5cf6",l:"FLIGHT"},travel:{c:"#8b5cf6",l:"TRAVEL"},reminder:{c:"#f59e0b",l:"⚡ ACTION"},
  sleep:{c:"#6366f1",l:"SLEEP"},birthday:{c:"#f472b6",l:"BIRTHDAY 🎂"},conference:{c:"#f59e0b",l:"SUMMIT"},
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
  const[openI,setOpenI]=useState({});
  const[intelSub,setIntelSub]=useState("prediction");
  const timer=useRef(null);

  useEffect(()=>{
    (async()=>{
      setSync("saving");
      try{
        const s=await loadState();
        if(s){if(s.cats)setCats(s.cats);if(s.chk)setChk(s.chk);}
        setSync("saved");setTimeout(()=>setSync("idle"),1500);
      }catch(_){setSync("error");}
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

  const packItems=cats.reduce((s,c)=>s+c.items.length,0);
  const packDone=cats.reduce((s,c)=>s+c.items.filter(i=>chk[i.id]).length,0);
  const pct=packItems>0?Math.round((packDone/packItems)*100):0;

  const garminDone=GARMIN_CHECKS.filter(c=>chk[c.id]).length;
  const garminCritical=GARMIN_CHECKS.filter(c=>c.critical);
  const garminCritDone=garminCritical.filter(c=>chk[c.id]).length;
  const allGarminCrit=garminCritDone===garminCritical.length;

  const dot={display:"inline-block",width:6,height:6,borderRadius:"50%",marginRight:4,
    background:sync==="saved"?"#4ade80":sync==="saving"?"#f59e0b":sync==="error"?"#f87171":"#2a2448"};

  const vis=filter==="all"?SCHEDULE:filter==="runna"?SCHEDULE.filter(s=>s.src==="runna"):SCHEDULE.filter(s=>s.type===filter);
  const TABS=[["schedule","📅"],["nutrition","⚡"],["handbook","📖"],["reservations","🍽️"],["pack","📦"],["intelligence","🧠"]];
  const M={fontFamily:"monospace"};

  return(
    <div style={{minHeight:"100vh",background:"#08070f",fontFamily:"Georgia,serif",color:"#e2ddd6"}}>

      {/* ── Header ── */}
      <div style={{background:"linear-gradient(160deg,#0f0c1a,#130e22 60%,#0c0f18)",borderBottom:"1px solid #1c1830",padding:"18px 16px 0",position:"sticky",top:0,zIndex:10}}>
        <div style={{maxWidth:740,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:9,...M,color:"#42d692",letterSpacing:"0.2em",marginBottom:3}}>⚡ LIVE RUNNA · LONDON MARATHON 2026</div>
              <h1 style={{margin:0,fontSize:20,fontWeight:"normal",color:"#f0ebe2"}}>Race-Ready <span style={{color:"#c8a45e",fontStyle:"italic"}}>Travel App</span></h1>
              <div style={{fontSize:9,...M,color:"#3e3660",marginTop:2}}>SIN→LAS→LHR · Park Plaza · 🏅 26 APR 09:35 · 🎂 Ayaansh 10th · EDI→SIN</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:22,fontWeight:"bold",color:pct===100?"#4ade80":"#c8a45e",...M,lineHeight:1}}>{pct}%</div>
              <div style={{fontSize:9,color:"#3e3660",...M}}>{packDone}/{packItems}</div>
              <div style={{fontSize:9,...M,color:"#3e3660",marginTop:2}}><span style={dot}/>{sync==="saving"?"SYNCING…":sync==="saved"?"SYNCED ✓":"MULTI-DEVICE"}</div>
            </div>
          </div>
          <div style={{display:"flex",marginTop:14}}>
            {TABS.map(([k,l])=>(
              <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"8px 0",border:"none",background:"none",cursor:"pointer",fontSize:tab===k?11:10,...M,color:tab===k?"#c8a45e":"#3e3660",borderBottom:tab===k?"2px solid #c8a45e":"2px solid transparent",transition:"all 0.2s"}}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:740,margin:"0 auto",padding:"16px 14px 56px"}}>

        {/* ════ SCHEDULE ════ */}
        {tab==="schedule"&&<>
          <div style={{marginBottom:12,padding:"8px 12px",background:"rgba(239,68,68,0.09)",border:"1px solid rgba(239,68,68,0.4)",borderRadius:7}}>
            <div style={{fontSize:9,...M,color:"#ef4444",letterSpacing:"0.2em",marginBottom:5}}>🚨 DO THESE TODAY</div>
            <div style={{fontSize:12,color:"#e0b0b0",lineHeight:1.9}}>
              🇬🇧 <strong style={{color:"#f0ebe2"}}>UK ETA</strong> — all 4 family members · <a href="https://www.gov.uk/eta" target="_blank" rel="noreferrer" style={{color:"#42d692",fontSize:11}}>gov.uk/eta →</a><br/>
              🚂 <strong style={{color:"#f0ebe2"}}>LNER First Class</strong> — Mon 28 Apr · <a href="https://www.lner.co.uk" target="_blank" rel="noreferrer" style={{color:"#42d692",fontSize:11}}>lner.co.uk →</a><br/>
              🍱 <strong style={{color:"#f0ebe2"}}>OKAN</strong> — Sat 25 Apr 12:30pm · +44 7746 025394<br/>
              🍝 <strong style={{color:"#f0ebe2"}}>Olivelli</strong> — Sat 25 Apr 6pm · +44 20 7261 1221
            </div>
          </div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
            {[["all","ALL","#c8a45e"],["runna","RUNNA","#42d692"],["race","RACE","#f59e0b"],["birthday","BDAY","#f472b6"],["easy","EASY","#10b981"],["flight","FLIGHTS","#8b5cf6"],["sleep","SLEEP","#6366f1"],["recovery","RECOVERY","#ec4899"]].map(([k,l,c])=>(
              <button key={k} onClick={()=>setFilter(k)} style={{padding:"2px 8px",borderRadius:20,border:`1px solid ${filter===k?c:"#1a1530"}`,background:filter===k?c+"18":"transparent",color:filter===k?c:"#3e3660",fontSize:8,...M,cursor:"pointer"}}>{l}</button>
            ))}
          </div>
          {vis.map((s,i)=>{
            const m=TM[s.type]||TM.rest,isO=open[i],isR=s.type==="race",isB=s.type==="birthday";
            return(
              <div key={i} onClick={()=>setOpen(p=>({...p,[i]:!p[i]}))} style={{marginBottom:isR||isB?14:5,border:`1px solid ${isR?"rgba(245,158,11,0.5)":isB?"rgba(244,114,182,0.4)":m.c+"22"}`,borderRadius:7,overflow:"hidden",cursor:"pointer",background:isR?"rgba(245,158,11,0.08)":isB?"rgba(244,114,182,0.07)":"rgba(255,255,255,0.015)",boxShadow:isR?"0 0 20px rgba(245,158,11,0.1)":"none"}}>
                <div style={{padding:"9px 12px",display:"flex",alignItems:"center",gap:10}}>
                  <div style={{minWidth:52,fontSize:8,...M,color:"#4a4260",lineHeight:1.5}}>{s.d.split(" ").map((w,j)=><div key={j}>{w}</div>)}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap",marginBottom:2}}>
                      <span style={{fontSize:7,...M,color:m.c,border:`1px solid ${m.c}44`,borderRadius:3,padding:"1px 4px"}}>{m.l}</span>
                      {s.src==="runna"&&<span style={{fontSize:7,...M,color:"#42d692",border:"1px solid rgba(66,214,146,0.4)",borderRadius:3,padding:"1px 4px"}}>RUNNA</span>}
                      <span style={{fontSize:isR||isB?13:12,color:isR?"#f59e0b":isB?"#f472b6":"#e2ddd6",fontWeight:isR||isB?"bold":"normal"}}>{s.label}</span>
                    </div>
                    <div style={{fontSize:9,color:"#4a4260",...M}}>📍 {s.loc}</div>
                  </div>
                  <span style={{fontSize:8,color:"#3e3660",transform:isO?"rotate(180deg)":"none",display:"inline-block",transition:"transform 0.2s"}}>▼</span>
                </div>
                {isO&&<div style={{padding:"0 12px 10px 74px",borderTop:`1px solid ${m.c}18`}}>
                  <div style={{paddingTop:8,fontSize:11,color:"#9a9090",lineHeight:1.7,whiteSpace:"pre-line"}}>{s.detail}</div>
                </div>}
              </div>
            );
          })}
        </>}

        {/* ════ NUTRITION ════ */}
        {tab==="nutrition"&&<>
          <div style={{marginBottom:14,padding:"10px 14px",background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:8}}>
            <div style={{fontSize:9,...M,color:"#f59e0b",letterSpacing:"0.2em",marginBottom:4}}>⚡ RACE DAY NUTRITION — GEL-ONLY STRATEGY</div>
            <div style={{fontSize:11,color:"#9a8060"}}>Maurten Gel 160 + Caf 100 + SaltStick + Beetroot · ~111g carbs/hr · 400mg caffeine · 400–800mg nitrates</div>
          </div>
          {[{e:"🟠",n:"Maurten Gel 160",p:"40g carbs · 30mg sodium · take WITHOUT water"},{e:"☕",n:"Maurten Gel 100 Caf 100",p:"25g carbs · 100mg caffeine · take WITHOUT water"},{e:"🔵",n:"SaltStick Caps",p:"215mg sodium · take WITH water"},{e:"🍇",n:"Beetroot Shot — 7:00am hotel room",p:"400–800mg nitrates · 60 min pre-start · 2–3% performance boost · Buy: HiBAR or Beet It"}].map((p,i)=>(
            <div key={i} style={{marginBottom:6,padding:"10px 12px",border:"1px solid #1a1530",borderRadius:7,background:"rgba(255,255,255,0.02)",display:"flex",gap:10,alignItems:"center"}}>
              <span style={{fontSize:20,flexShrink:0}}>{p.e}</span>
              <div><div style={{fontSize:13,color:"#f0ebe2",marginBottom:2}}>{p.n}</div><div style={{fontSize:11,color:"#6b6580"}}>{p.p}</div></div>
            </div>
          ))}
          <div style={{fontSize:9,...M,color:"#c8a45e",letterSpacing:"0.2em",margin:"14px 0 8px"}}>PRE-RACE MORNING</div>
          <div style={{marginBottom:14,border:"1px solid #1a1530",borderRadius:8,overflow:"hidden"}}>
            {NUTRITION.preRace.map((r,i)=>(
              <div key={i} style={{display:"flex",padding:"9px 12px",borderTop:i>0?"1px solid #100e1c":"none"}}>
                <div style={{minWidth:60,fontSize:9,...M,color:"#c8a45e",flexShrink:0,paddingTop:1}}>{r.time}</div>
                <div><div style={{fontSize:12,color:"#e2ddd6",marginBottom:2}}>{r.what}</div><div style={{fontSize:11,color:"#6b6580",lineHeight:1.5}}>{r.detail}</div></div>
              </div>
            ))}
          </div>
          <div style={{fontSize:9,...M,color:"#c8a45e",letterSpacing:"0.2em",marginBottom:8}}>IN-RACE KM BY KM</div>
          <div style={{marginBottom:14,border:"1px solid #1a1530",borderRadius:8,overflow:"hidden"}}>
            {NUTRITION.inRace.map((r,i)=>{
              const isF=r.km==="Km 42.2",isC=r.ss.includes("CRITICAL");
              return(
                <div key={i} style={{display:"flex",padding:"8px 12px",borderTop:i>0?"1px solid #100e1c":"none",background:isF?"rgba(245,158,11,0.07)":isC?"rgba(239,68,68,0.04)":"transparent"}}>
                  <div style={{minWidth:52,flexShrink:0,paddingTop:1}}>
                    <div style={{fontSize:9,...M,color:isF?"#f59e0b":isC?"#ef4444":"#c8a45e"}}>{r.km}</div>
                    <div style={{fontSize:8,...M,color:"#3e3660"}}>{r.time}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:3}}>
                      {r.gel160!=="—"&&r.gel160!=="Done"&&<span style={{fontSize:9,...M,color:"#fb923c",background:"rgba(251,146,60,0.12)",padding:"1px 5px",borderRadius:3}}>{r.gel160}</span>}
                      {r.caf!=="—"&&<span style={{fontSize:9,...M,color:r.caf.includes("PEAKING")?"#ef4444":"#fb923c",background:r.caf.includes("PEAKING")?"rgba(239,68,68,0.12)":"rgba(251,146,60,0.1)",padding:"1px 5px",borderRadius:3}}>{r.caf}</span>}
                      {r.ss!=="—"&&r.ss!=="Done"&&<span style={{fontSize:9,...M,color:isC?"#ef4444":"#42d692",background:isC?"rgba(239,68,68,0.1)":"rgba(66,214,146,0.1)",padding:"1px 5px",borderRadius:3}}>🔵 {r.ss}</span>}
                    </div>
                    <div style={{fontSize:11,color:"#6b6580",lineHeight:1.4}}>{r.note}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{marginBottom:14,padding:"12px 14px",background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:8}}>
            <div style={{fontSize:9,...M,color:"#10b981",letterSpacing:"0.2em",marginBottom:8}}>RACE DAY TOTALS</div>
            {NUTRITION.totals.map(([prod,qty,carbs,extra],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderTop:i>0?"1px solid rgba(16,185,129,0.1)":"none",flexWrap:"wrap",gap:4}}>
                <span style={{fontSize:11,color:i===NUTRITION.totals.length-1?"#f0ebe2":"#6b9e80",fontWeight:i===NUTRITION.totals.length-1?"bold":"normal"}}>{prod}</span>
                <div style={{display:"flex",gap:10}}>
                  <span style={{fontSize:11,...M,color:"#10b981"}}>{carbs}</span>
                  {extra&&<span style={{fontSize:11,...M,color:"#f59e0b"}}>{extra}</span>}
                </div>
              </div>
            ))}
          </div>
          <div style={{fontSize:9,...M,color:"#c8a45e",letterSpacing:"0.2em",marginBottom:8}}>💡 WHAT YOU MAY HAVE MISSED</div>
          {NUTRITION.missed.map((m,i)=>{
            const isO=openR["m"+i];
            const bc=m.urgency==="high"?"rgba(239,68,68,0.3)":m.urgency==="medium"?"rgba(245,158,11,0.3)":"rgba(74,85,104,0.3)";
            const cc=m.urgency==="high"?"#ef4444":m.urgency==="medium"?"#f59e0b":"#4a5568";
            return(
              <div key={i} onClick={()=>setOpenR(p=>({...p,["m"+i]:!p["m"+i]}))} style={{marginBottom:6,padding:"10px 12px",border:`1px solid ${bc}`,borderRadius:7,cursor:"pointer",background:"rgba(255,255,255,0.02)"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{m.icon}</span><span style={{fontSize:12,color:cc,fontWeight:"bold"}}>{m.title}</span></div>
                  <span style={{fontSize:8,color:"#3e3660",transform:isO?"rotate(180deg)":"none",display:"inline-block",transition:"transform 0.2s"}}>▼</span>
                </div>
                {isO&&<div style={{marginTop:8,fontSize:12,color:"#9a9090",lineHeight:1.65,paddingLeft:26}}>{m.detail}</div>}
              </div>
            );
          })}
        </>}

        {/* ════ HANDBOOK ════ */}
        {tab==="handbook"&&<>
          {/* Garmin checklist */}
          <div style={{marginBottom:14,border:"1px solid #1a1530",borderRadius:8,overflow:"hidden"}}>
            <div style={{background:"rgba(255,255,255,0.02)",padding:"10px 14px",borderBottom:"1px solid #1a1530",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:16}}>⌚</span>
                  <span style={{fontSize:13,color:"#f0ebe2"}}>Garmin race setup</span>
                </div>
                <div style={{fontSize:9,...M,color:"#4a4260",marginTop:2}}>Do tonight — not race morning</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:13,fontWeight:"bold",...M,color:allGarminCrit?"#4ade80":"#f59e0b"}}>{garminDone}/{GARMIN_CHECKS.length}</div>
                <div style={{fontSize:9,...M,color:"#4a4260"}}>{garminCritDone}/{garminCritical.length} critical</div>
              </div>
            </div>
            <div style={{height:3,background:"#100e1c"}}>
              <div style={{height:"100%",background:allGarminCrit?"#4ade80":"#f59e0b",width:`${(garminDone/GARMIN_CHECKS.length)*100}%`,transition:"width 0.4s"}}/>
            </div>
            <div style={{padding:"8px 14px",background:"rgba(245,158,11,0.06)",borderBottom:"1px solid #1a1530",fontSize:11,color:"#9a8060",lineHeight:1.6}}>
              <strong style={{color:"#f59e0b"}}>Why this matters:</strong> Berlin and Tokyo both recorded 9 laps over 42km — Runna structured mode overrode distance-based laps. You had almost no per-km data. London needs 42 laps — one per km.
            </div>
            {GARMIN_CHECKS.map((c,idx)=>{
              const isO=openH["g"+idx];
              return(
                <div key={c.id} style={{borderTop:idx>0?"1px solid #100e1c":"none",background:chk[c.id]?"rgba(74,222,128,0.02)":"transparent"}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 14px"}}>
                    <button onClick={()=>tick(c.id)} style={{width:16,height:16,minWidth:16,borderRadius:3,border:`1.5px solid ${chk[c.id]?"#4ade80":"#2e2848"}`,background:chk[c.id]?"#4ade80":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2,transition:"all 0.15s"}}>
                      {chk[c.id]&&<span style={{color:"#08070f",fontSize:9,fontWeight:"bold"}}>✓</span>}
                    </button>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                        <span style={{fontSize:12,color:chk[c.id]?"#3d3d50":"#e2ddd6",textDecoration:chk[c.id]?"line-through":"none"}}>{c.label}</span>
                        {c.critical&&!chk[c.id]&&<span style={{fontSize:7,...M,color:"#ef4444",border:"1px solid rgba(239,68,68,0.4)",borderRadius:3,padding:"1px 4px"}}>CRITICAL</span>}
                      </div>
                    </div>
                    <button onClick={()=>setOpenH(p=>({...p,["g"+idx]:!p["g"+idx]}))} style={{background:"none",border:"none",cursor:"pointer",fontSize:8,color:"#3e3660",marginTop:2}}>{isO?"▲":"▼"}</button>
                  </div>
                  {isO&&<div style={{padding:"0 14px 10px 40px",background:"rgba(0,0,0,0.15)",borderTop:"1px solid #100e1c"}}>
                    <div style={{paddingTop:6,fontSize:11,color:"#9a9090",lineHeight:1.6}}>{c.detail}</div>
                  </div>}
                </div>
              );
            })}
            <div style={{padding:"8px 14px",borderTop:"1px solid #1a1530",background:allGarminCrit?"rgba(74,222,128,0.04)":"rgba(255,255,255,0.01)",fontSize:9,...M,color:allGarminCrit?"#4ade80":"#4a4260",textAlign:"center"}}>
              {allGarminCrit?"✓ ALL CRITICAL DONE — GARMIN IS RACE READY":`${garminCritical.length-garminCritDone} CRITICAL ITEM${garminCritical.length-garminCritDone!==1?"S":""} REMAINING — DO TONIGHT`}
            </div>
          </div>
          {/* Official handbook */}
          <div style={{padding:"8px 12px",background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.25)",borderRadius:7,marginBottom:12}}>
            <div style={{fontSize:9,...M,color:"#f59e0b",letterSpacing:"0.2em",marginBottom:3}}>📖 TCS LONDON MARATHON 2026</div>
            <div style={{fontSize:11,color:"#9a8060"}}>Mass start 09:35 · Expo Wed–Sat · Free TfL with bib · Pacers 3:00–7:30</div>
          </div>
          {HANDBOOK.map((s,i)=>{
            const isO=openH["h"+i];
            return(
              <div key={i} style={{marginBottom:8,border:"1px solid #1a1530",borderRadius:7,overflow:"hidden"}}>
                <button onClick={()=>setOpenH(p=>({...p,["h"+i]:!p["h"+i]}))} style={{width:"100%",background:"rgba(255,255,255,0.02)",padding:"10px 12px",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",textAlign:"left"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:17}}>{s.icon}</span><span style={{fontSize:13,color:"#e2ddd6"}}>{s.title}</span></div>
                  <span style={{fontSize:9,color:"#3e3660",transform:isO?"rotate(180deg)":"none",display:"inline-block",transition:"transform 0.2s"}}>▼</span>
                </button>
                {isO&&<div style={{padding:"4px 0 8px",borderTop:"1px solid #1a1530"}}>
                  {s.items.map((it,j)=>(
                    <div key={j} style={{display:"flex",gap:8,padding:"6px 12px",borderTop:j>0?"1px solid #0f0d1a":"none"}}>
                      <span style={{color:"#c8a45e",fontSize:10,marginTop:2,flexShrink:0}}>›</span>
                      <span style={{fontSize:12,color:"#b0a898",lineHeight:1.5}}>{it}</span>
                    </div>
                  ))}
                </div>}
              </div>
            );
          })}
        </>}

        {/* ════ RESERVATIONS ════ */}
        {tab==="reservations"&&<>
          <div style={{marginBottom:12,padding:"8px 12px",background:"rgba(244,114,182,0.07)",border:"1px solid rgba(244,114,182,0.28)",borderRadius:7}}>
            <div style={{fontSize:9,...M,color:"#f472b6",letterSpacing:"0.2em",marginBottom:3}}>🍽️ RACE EVE RESTAURANTS — SAT 25 APR</div>
            <div style={{fontSize:11,color:"#9a7090"}}>Book both TODAY — Saturday is one of London's busiest dining nights.</div>
          </div>
          {RESERVATIONS.map((r,i)=>{
            const booked=chk["res-"+r.id],isO=openR[r.id];
            return(
              <div key={i} style={{marginBottom:14,border:`1px solid ${booked?"rgba(74,222,128,0.3)":"rgba(244,114,182,0.4)"}`,borderRadius:8,overflow:"hidden",background:booked?"rgba(74,222,128,0.04)":"rgba(244,114,182,0.05)"}}>
                <div style={{padding:"12px 14px"}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                        {booked?<span style={{fontSize:8,...M,color:"#4ade80",border:"1px solid rgba(74,222,128,0.4)",borderRadius:3,padding:"1px 5px"}}>✓ BOOKED</span>:<span style={{fontSize:8,...M,color:"#ef4444",border:"1px solid rgba(239,68,68,0.4)",borderRadius:3,padding:"1px 5px"}}>BOOK NOW</span>}
                        <span style={{fontSize:14,color:"#f0ebe2",fontWeight:"bold"}}>{r.name}</span>
                      </div>
                      <div style={{fontSize:10,...M,color:"#c8a45e",marginBottom:3}}>{r.when}</div>
                      <div style={{fontSize:11,color:"#6b6580"}}>{r.addr} · {r.dist}</div>
                      <div style={{fontSize:11,color:"#42d692",marginTop:2}}>{r.rating}</div>
                    </div>
                    <button onClick={e=>{e.stopPropagation();tick("res-"+r.id);}} style={{padding:"6px 10px",borderRadius:6,border:`1.5px solid ${booked?"#4ade80":"rgba(244,114,182,0.5)"}`,background:"transparent",color:booked?"#4ade80":"#f472b6",fontSize:9,...M,cursor:"pointer",flexShrink:0}}>{booked?"✓ BOOKED":"MARK BOOKED"}</button>
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
                    <a href={"tel:"+r.phone} style={{fontSize:10,...M,color:"#6366f1",border:"1px solid rgba(99,102,241,0.3)",borderRadius:4,padding:"3px 8px",textDecoration:"none"}}>📞 {r.phone}</a>
                    <a href={"https://"+r.web} target="_blank" rel="noreferrer" style={{fontSize:10,...M,color:"#42d692",border:"1px solid rgba(66,214,146,0.3)",borderRadius:4,padding:"3px 8px",textDecoration:"none"}}>🌐 {r.web}</a>
                    <button onClick={()=>setOpenR(p=>({...p,[r.id]:!p[r.id]}))} style={{fontSize:10,...M,color:"#c8a45e",border:"1px solid rgba(200,164,94,0.3)",borderRadius:4,padding:"3px 8px",background:"none",cursor:"pointer"}}>{isO?"▲ LESS":"▼ DETAILS"}</button>
                  </div>
                </div>
                {isO&&<div style={{padding:"0 14px 12px",borderTop:"1px solid #1a1530",background:"rgba(0,0,0,0.15)"}}>
                  <div style={{marginTop:10,fontSize:11,color:"#9a9090"}}><strong style={{color:"#c8a45e",fontSize:9,...M}}>WHY: </strong>{r.why}</div>
                  <div style={{marginTop:8,fontSize:11,color:"#9a9090",whiteSpace:"pre-line"}}><strong style={{color:"#42d692",fontSize:9,...M}}>ORDER: </strong>{r.menu}</div>
                </div>}
              </div>
            );
          })}
          <div style={{padding:"10px 14px",background:"rgba(200,164,94,0.05)",border:"1px solid rgba(200,164,94,0.2)",borderRadius:8}}>
            <div style={{fontSize:9,...M,color:"#c8a45e",letterSpacing:"0.15em",marginBottom:8}}>RACE EVE TIMELINE — SAT 25 APR</div>
            {[["7:30am","🎈 Reunite at T2 — birthday!"],["10:30am","Gentle walk: Westminster → Big Ben"],["12:30pm","🍱 OKAN lunch (4 min walk)"],["2:30pm","Cinema / Borough Market"],["4:30pm","🛌 Hotel nap — MANDATORY"],["6:00pm","🍝 Olivelli dinner (pasta carb load)"],["8:00pm","Lay out race kit. Pin bib. Set 3 alarms."],["9:30pm","😴 SLEEP — non-negotiable"]].map(([t,a],i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"5px 0",borderTop:i>0?"1px solid #110f1e":"none"}}>
                <span style={{fontSize:9,...M,color:t==="9:30pm"?"#ef4444":"#c8a45e",minWidth:52,flexShrink:0}}>{t}</span>
                <span style={{fontSize:12,color:t==="9:30pm"?"#ef4444":"#e2ddd6"}}>{a}</span>
              </div>
            ))}
          </div>
        </>}

        {/* ════ PACKING ════ */}
        {tab==="pack"&&<>
          <div style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{fontSize:9,...M,color:"#3e3660",letterSpacing:"0.2em"}}>PACKING PROGRESS</div>
              {packDone>0&&<button onClick={()=>{const k={...chk};cats.forEach(c=>c.items.forEach(i=>{delete k[i.id];}));setChk(k);persist(cats,k);}} style={{fontSize:9,color:"#3e3660",background:"none",border:"1px solid #1a1530",borderRadius:4,padding:"2px 8px",cursor:"pointer",...M}}>RESET PACKING</button>}
            </div>
            <div style={{height:2,background:"#1a1630",borderRadius:2}}>
              <div style={{height:"100%",borderRadius:2,background:pct===100?"#4ade80":"linear-gradient(90deg,#7c5fff,#c8a45e)",width:`${pct}%`,transition:"width 0.4s"}}/>
            </div>
            {pct===100&&<div style={{marginTop:6,fontSize:11,color:"#4ade80",...M}}>✓ ALL PACKED — YOU'RE RACE READY!</div>}
          </div>
          {cats.map(cat=>{
            const cd=cat.items.filter(i=>chk[i.id]).length,done2=cd===cat.items.length&&cat.items.length>0,isColl=coll[cat.id];
            const isB=cat.id==="bd",isBk=cat.id==="bk";
            const bc=isBk?"rgba(245,158,11,0.35)":isB?"rgba(244,114,182,0.3)":done2?"rgba(74,222,128,0.18)":"#1a1530";
            return(
              <div key={cat.id} style={{marginBottom:8}}>
                <button onClick={()=>setColl(p=>({...p,[cat.id]:!p[cat.id]}))} style={{width:"100%",background:done2?"rgba(74,222,128,0.03)":isBk?"rgba(245,158,11,0.04)":isB?"rgba(244,114,182,0.04)":"rgba(255,255,255,0.02)",border:`1px solid ${bc}`,borderRadius:isColl?6:"6px 6px 0 0",padding:"9px 12px",cursor:"pointer",color:"#e2ddd6",display:"flex",alignItems:"center",justifyContent:"space-between",textAlign:"left"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>{cat.icon}</span><span style={{fontSize:12,...M}}>{cat.label}</span></div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:9,...M,color:done2?"#4ade80":"#3e3660"}}>{cd}/{cat.items.length}</span><span style={{color:"#3e3660",fontSize:9,transform:isColl?"rotate(-90deg)":"none",display:"inline-block",transition:"transform 0.2s"}}>▼</span></div>
                </button>
                {!isColl&&<div style={{border:`1px solid ${bc}`,borderTop:"none",borderRadius:"0 0 6px 6px",overflow:"hidden"}}>
                  {cat.items.map((item,idx)=>(
                    <div key={item.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderTop:idx>0?"1px solid #100e1c":"none",background:chk[item.id]?"rgba(74,222,128,0.02)":"transparent"}}>
                      <button onClick={()=>tick(item.id)} style={{width:16,height:16,minWidth:16,borderRadius:3,border:`1.5px solid ${chk[item.id]?"#4ade80":"#2e2848"}`,background:chk[item.id]?"#4ade80":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}}>
                        {chk[item.id]&&<span style={{color:"#08070f",fontSize:9,fontWeight:"bold"}}>✓</span>}
                      </button>
                      <span style={{fontSize:11,color:chk[item.id]?"#3d3d50":"#c0b9af",flex:1,textDecoration:chk[item.id]?"line-through":"none",lineHeight:1.4}}>{item.t}</span>
                      <button onClick={()=>del(cat.id,item.id)} style={{background:"none",border:"none",color:"#2e2848",cursor:"pointer",fontSize:13,padding:"0 2px"}} onMouseOver={e=>e.currentTarget.style.color="#e05050"} onMouseOut={e=>e.currentTarget.style.color="#2e2848"}>×</button>
                    </div>
                  ))}
                  <div style={{display:"flex",gap:6,padding:"6px 10px",borderTop:"1px solid #100e1c"}}>
                    <input placeholder="Add item…" value={newT[cat.id]||""} onChange={e=>setNewT(p=>({...p,[cat.id]:e.target.value}))} onKeyDown={e=>{if(e.key==="Enter")add(cat.id);}} style={{flex:1,background:"transparent",border:"none",borderBottom:"1px solid #1e1838",color:"#a09890",fontSize:11,padding:"2px 2px",outline:"none",fontFamily:"Georgia,serif"}}/>
                    <button onClick={()=>add(cat.id)} style={{background:"rgba(124,95,255,0.1)",border:"1px solid rgba(124,95,255,0.3)",color:"#9a7fff",borderRadius:4,padding:"2px 8px",cursor:"pointer",fontSize:9,...M}}>+ADD</button>
                  </div>
                </div>}
              </div>
            );
          })}
        </>}

        {/* ════ INTELLIGENCE ════ */}
        {tab==="intelligence"&&<>
          <div style={{marginBottom:14,padding:"10px 14px",background:"rgba(16,185,129,0.07)",border:"1px solid rgba(16,185,129,0.3)",borderRadius:8}}>
            <div style={{fontSize:9,...M,color:"#10b981",letterSpacing:"0.2em",marginBottom:4}}>🧠 RACE INTELLIGENCE — GARMIN DATA ANALYSIS · 14 APR 2026</div>
            <div style={{fontSize:11,color:"#6b9e80"}}>Full Garmin export · 5 prediction models · Sydney + Tokyo + Berlin race data</div>
          </div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:14}}>
            {[["prediction","🎯 Prediction"],["history","📊 History"],["risks","⚠️ Risks"],["pacing","⏱️ Pacing"]].map(([k,l])=>(
              <button key={k} onClick={()=>setIntelSub(k)} style={{padding:"4px 10px",borderRadius:20,border:`1px solid ${intelSub===k?"#10b981":"#1a1530"}`,background:intelSub===k?"rgba(16,185,129,0.15)":"transparent",color:intelSub===k?"#10b981":"#3e3660",fontSize:9,...M,cursor:"pointer"}}>{l}</button>
            ))}
          </div>

          {intelSub==="prediction"&&<>
            <div style={{padding:"16px 14px",background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.3)",borderRadius:8,textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:9,...M,color:"#10b981",letterSpacing:"0.2em",marginBottom:6}}>PREDICTION — TCS LONDON MARATHON 26 APR 2026</div>
              <div style={{fontSize:40,fontWeight:"bold",color:"#10b981",...M}}>3:28–3:32</div>
              <div style={{fontSize:11,color:"#6b9e80",marginTop:4}}>Ceiling: 3:24 &nbsp;·&nbsp; Floor: 3:35 &nbsp;·&nbsp; Target pace: 4:55–5:02/km</div>
            </div>
            <div style={{fontSize:9,...M,color:"#c8a45e",letterSpacing:"0.2em",marginBottom:8}}>5 INDEPENDENT MODELS</div>
            {INTEL_MODELS.map((m,i)=>(
              <div key={i} style={{marginBottom:8,padding:"10px 12px",border:"1px solid #1a1530",borderRadius:7,background:"rgba(255,255,255,0.02)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                  <span style={{fontSize:12,color:"#e2ddd6",flex:1,paddingRight:8}}>{m.name}</span>
                  <span style={{fontSize:17,fontWeight:"bold",color:"#10b981",...M,flexShrink:0}}>{m.result}</span>
                </div>
                <div style={{fontSize:11,color:"#6b6580",lineHeight:1.5,marginBottom:5}}>{m.detail}</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{flex:1,height:3,background:"#100e1c",borderRadius:2}}><div style={{height:"100%",background:"#10b981",width:`${m.conf}%`,borderRadius:2}}/></div>
                  <span style={{fontSize:9,...M,color:"#4a4260"}}>{m.conf}% conf</span>
                </div>
              </div>
            ))}
            <div style={{marginTop:10,padding:"10px 14px",background:"rgba(200,164,94,0.05)",border:"1px solid rgba(200,164,94,0.2)",borderRadius:8}}>
              <div style={{fontSize:9,...M,color:"#c8a45e",letterSpacing:"0.2em",marginBottom:8}}>PROBABILITY DISTRIBUTION</div>
              {[["Sub 3:24",5,"#4ade80","Perfect execution"],["3:24–3:28",22,"#10b981","Aggressive + disciplined"],["3:28–3:32",40,"#10b981","TARGET — most likely"],["3:32–3:36",22,"#f59e0b","Modest fade km 30+"],["3:36+",11,"#ef4444","Cold trap or travel disruption"]].map(([l,p,c,d],i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                  <div style={{width:56,fontSize:9,...M,color:"#6b6580",flexShrink:0}}>{l}</div>
                  <div style={{flex:1,height:14,background:"#100e1c",borderRadius:2,overflow:"hidden"}}>
                    <div style={{height:"100%",background:c,width:`${p*2}%`,display:"flex",alignItems:"center",paddingLeft:4}}>
                      <span style={{fontSize:8,color:"#08070f",fontWeight:"bold",...M}}>{p}%</span>
                    </div>
                  </div>
                  <div style={{width:120,fontSize:9,color:"#4a4260"}}>{d}</div>
                </div>
              ))}
            </div>
          </>}

          {intelSub==="history"&&<>
            <div style={{padding:"10px 14px",background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:8,marginBottom:14,display:"flex",gap:14,flexWrap:"wrap"}}>
              {[["~36 min","Left on table — 3 races"],["13 min","Tokyo gap vs potential"],["100%","All execution gaps"]].map(([v,l],i)=>(
                <div key={i} style={{flex:1,minWidth:80}}>
                  <div style={{fontSize:20,fontWeight:"bold",color:"#ef4444",...M}}>{v}</div>
                  <div style={{fontSize:9,color:"#9a7070"}}>{l}</div>
                </div>
              ))}
            </div>
            {INTEL_RACES.map((r,i)=>(
              <div key={i} style={{marginBottom:10,border:`1px solid ${r.name==="London"?"rgba(16,185,129,0.4)":"#1a1530"}`,borderRadius:8,overflow:"hidden",background:r.name==="London"?"rgba(16,185,129,0.04)":"rgba(255,255,255,0.02)"}}>
                <div style={{padding:"10px 14px",borderBottom:"1px solid #100e1c",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <span style={{fontSize:14,fontWeight:"bold",color:"#f0ebe2"}}>{r.name}</span>
                    <span style={{fontSize:9,...M,color:"#4a4260",marginLeft:8}}>{r.date} · {r.temp}</span>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:16,fontWeight:"bold",...M,color:"#f0ebe2"}}>{r.actual}</div>
                    <div style={{fontSize:9,...M,color:r.gap.includes("13")?"#ef4444":"#f59e0b"}}>{r.gap}</div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",padding:"8px 14px",borderBottom:"1px solid #100e1c",gap:4}}>
                  {[["Actual",r.actual,"#e2ddd6"],["Predicted",r.predicted,"#f59e0b"],["Potential",r.potential,"#10b981"]].map(([l,v,c])=>(
                    <div key={l} style={{textAlign:"center"}}>
                      <div style={{fontSize:8,...M,color:"#4a4260",marginBottom:2}}>{l}</div>
                      <div style={{fontSize:12,fontWeight:"bold",...M,color:c}}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{padding:"8px 14px"}}>
                  <div style={{fontSize:11,color:"#9a9090",lineHeight:1.6}}>{r.cause}</div>
                  {r.hrAvg&&<div style={{display:"flex",gap:10,marginTop:4,fontSize:9,...M,color:"#3e3660"}}><span>Avg HR: {r.hrAvg}</span><span>2nd half fade: {r.fade}</span></div>}
                </div>
              </div>
            ))}
            <div style={{padding:"10px 14px",background:"rgba(16,185,129,0.05)",borderLeft:"3px solid #10b981",borderRadius:"0 8px 8px 0",fontSize:11,color:"#9a9090",lineHeight:1.7}}>
              <strong style={{color:"#10b981"}}>The pattern:</strong> Your fitness has consistently supported faster times. The gap was always external — conditions, overreaching, or pacing. London is the first race where you've addressed all three simultaneously.
            </div>
          </>}

          {intelSub==="risks"&&<>
            {INTEL_RISKS.map((r,i)=>{
              const isO=openI["r"+i],isH=r.sev==="HIGH";
              return(
                <div key={i} style={{marginBottom:8,border:`1px solid ${isH?"rgba(239,68,68,0.3)":"rgba(245,158,11,0.3)"}`,borderRadius:7,overflow:"hidden"}}>
                  <button onClick={()=>setOpenI(p=>({...p,["r"+i]:!p["r"+i]}))} style={{width:"100%",background:"rgba(255,255,255,0.02)",padding:"10px 12px",border:"none",cursor:"pointer",display:"flex",alignItems:"flex-start",gap:8,textAlign:"left"}}>
                    <span style={{fontSize:7,...M,color:isH?"#ef4444":"#f59e0b",border:`1px solid ${isH?"rgba(239,68,68,0.4)":"rgba(245,158,11,0.4)"}`,borderRadius:3,padding:"1px 4px",marginTop:2,flexShrink:0}}>{r.sev}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,color:"#e2ddd6",marginBottom:2}}>{r.title}</div>
                      <div style={{fontSize:10,color:"#4a4260"}}>{r.data}</div>
                    </div>
                    <span style={{fontSize:8,color:"#3e3660",transform:isO?"rotate(180deg)":"none",display:"inline-block",transition:"transform 0.2s",flexShrink:0}}>▼</span>
                  </button>
                  {isO&&<div style={{borderTop:`1px solid ${isH?"rgba(239,68,68,0.15)":"rgba(245,158,11,0.15)"}`}}>
                    {r.tips.map((t,j)=>(
                      <div key={j} style={{display:"flex",gap:8,padding:"7px 12px",borderTop:j>0?"1px solid #0f0d1a":"none"}}>
                        <span style={{color:"#10b981",fontSize:11,flexShrink:0,marginTop:1}}>→</span>
                        <div>
                          <div style={{fontSize:11,color:"#e2ddd6",lineHeight:1.5}}>{t.a}</div>
                          <div style={{fontSize:9,...M,color:"#10b981",marginTop:2}}>📍 {t.w}</div>
                        </div>
                      </div>
                    ))}
                  </div>}
                </div>
              );
            })}
          </>}

          {intelSub==="pacing"&&<>
            <div style={{padding:"12px 14px",background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.3)",borderRadius:8,textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:9,...M,color:"#10b981",letterSpacing:"0.2em",marginBottom:4}}>TARGET FINISH</div>
              <div style={{fontSize:32,fontWeight:"bold",color:"#10b981",...M}}>3:30:00</div>
              <div style={{fontSize:11,color:"#6b9e80",marginTop:2}}>4:58/km average pace</div>
            </div>
            <div style={{fontSize:9,...M,color:"#c8a45e",letterSpacing:"0.2em",marginBottom:8}}>RACE PHASE STRATEGY</div>
            {INTEL_PACING.map((p,i)=>(
              <div key={i} style={{marginBottom:6,padding:"10px 12px",border:"1px solid #1a1530",borderRadius:7,background:p.col}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                  <span style={{fontSize:12,fontWeight:"bold",color:"#f0ebe2"}}>{p.km}</span>
                  <div style={{display:"flex",gap:10,fontSize:9,...M}}>
                    <span style={{color:"#10b981"}}>{p.pace}/km</span>
                    <span style={{color:"#4a4260"}}>HR {p.hr}</span>
                  </div>
                </div>
                <div style={{fontSize:11,color:"#9a9090"}}>{p.note}</div>
              </div>
            ))}
            <div style={{fontSize:9,...M,color:"#c8a45e",letterSpacing:"0.2em",marginTop:14,marginBottom:8}}>KEY CHECKPOINTS — WRITE ON WRIST</div>
            {[["km 5","Write on forearm: 7/14/20☕/27/32☕"],["km 10","49:50 — HR check. Above 160? Ease off."],["km 12","Tower Bridge. HOLD. Do not surge."],["km 21","1:44:30 — halfway. Stay disciplined."],["km 25","2:04:30 — body scan. Controlled → 4:55. Not great → 5:02."],["km 30","2:29:00 — NOW YOU RACE."],["km 32","2:38:36 — caffeine gel #3. Last boost."],["km 38","3:08:44 — family at Hungerford Bridge. 4km to go."]].map(([km,a],i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderTop:i>0?"1px solid #100e1c":"none"}}>
                <div style={{flexShrink:0,minWidth:44}}>
                  <div style={{fontSize:9,...M,fontWeight:"bold",color:km==="km 30"?"#10b981":"#e2ddd6"}}>{km}</div>
                </div>
                <div style={{fontSize:11,color:km==="km 30"?"#10b981":"#9a9090",lineHeight:1.5,fontWeight:km==="km 30"?"bold":"normal"}}>{a}</div>
              </div>
            ))}
            <div style={{marginTop:14,padding:"10px 12px",background:"rgba(16,185,129,0.05)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:7,fontSize:11,color:"#6b9e80",lineHeight:1.7}}>
              <strong style={{color:"#10b981"}}>Nutrition on forearm:</strong> 7 / 14 / 20☕ / 27 / 32☕ · SaltStick: 35-min Garmin timer · Beetroot: 7:00am hotel room
            </div>
          </>}
        </>}

      </div>
    </div>
  );
}
