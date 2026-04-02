"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const APPS = [
  { id:"marathon", href:"/marathon", emoji:"🏅", label:"Marathon", status:"live" },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [pressed, setPressed] = useState(null);
  useEffect(() => { setMounted(true); }, []);

  const days = Math.ceil((new Date("2026-04-26T09:35:00+01:00") - new Date()) / 86400000);
  const today = mounted ? new Date().toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long" }) : "";

  return (
    <div style={{ minHeight:"100vh", background:"#08070f", fontFamily:"-apple-system,Georgia,serif", color:"#e2ddd6", display:"flex", flexDirection:"column", maxWidth:430, margin:"0 auto", padding:"0 0 40px" }}>
      <div style={{ height:12 }} />
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 24px 0" }}>
        <span style={{ fontSize:11, fontFamily:"monospace", color:"#3e3660", letterSpacing:"0.2em" }}>SHASHANK.APP</span>
        <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#c8a45e,#9a6f30)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:"bold", color:"#07060e" }}>S</div>
      </div>
      <div style={{ padding:"28px 24px 0" }}>
        <h1 style={{ margin:0, fontSize:28, fontWeight:"normal", color:"#f0ebe2" }}>{mounted ? getGreeting() : "Welcome"}</h1>
        <p style={{ margin:"6px 0 0", fontSize:13, color:"#4a4260" }}>
          {today}
          {days > 0 && days < 60 && <span style={{ marginLeft:10, background:"rgba(200,164,94,0.15)", color:"#c8a45e", fontSize:11, fontFamily:"monospace", padding:"2px 8px", borderRadius:20, border:"1px solid rgba(200,164,94,0.3)" }}>{days}d to race</span>}
        </p>
      </div>
      <div style={{ padding:"36px 20px 0" }}>
        <div style={{ fontSize:10, fontFamily:"monospace", color:"#3e3660", letterSpacing:"0.18em", marginBottom:16, paddingLeft:4 }}>APPS</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6 }}>
          {APPS.map(app => (
            <Link key={app.id} href={app.href} style={{ textDecoration:"none" }}>
              <div onPointerDown={()=>setPressed(app.id)} onPointerUp={()=>setPressed(null)} onPointerLeave={()=>setPressed(null)}
                style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, cursor:"pointer" }}>
                <div style={{ width:"100%", aspectRatio:"1", borderRadius:20, background:"rgba(200,164,94,0.12)", border:"1px solid rgba(200,164,94,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, transform:pressed===app.id?"scale(0.90)":"scale(1)", transition:"transform 0.1s" }}>{app.emoji}</div>
                <span style={{ fontSize:11, color:"#9a9090", textAlign:"center" }}>{app.label}</span>
              </div>
            </Link>
          ))}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, opacity:0.3 }}>
            <div style={{ width:"100%", aspectRatio:"1", borderRadius:20, border:"1.5px dashed #2a2448", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, color:"#2a2448" }}>+</div>
            <span style={{ fontSize:11, color:"#3e3660", textAlign:"center" }}>Add app</span>
          </div>
        </div>
      </div>
      <div style={{ height:"0.5px", background:"#1a1530", margin:"32px 24px 0" }} />
      <div style={{ padding:"24px 20px 0" }}>
        <div style={{ fontSize:10, fontFamily:"monospace", color:"#3e3660", letterSpacing:"0.18em", marginBottom:12, paddingLeft:4 }}>QUICK ACCESS</div>
        {APPS.map(app => (
          <Link key={app.id} href={app.href} style={{ textDecoration:"none" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, padding:"12px", borderRadius:12, cursor:"pointer" }}>
              <div style={{ width:40, height:40, borderRadius:12, flexShrink:0, background:"rgba(200,164,94,0.12)", border:"1px solid rgba(200,164,94,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{app.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, color:"#f0ebe2", fontWeight:"500" }}>{app.label}</div>
                <div style={{ fontSize:12, color:"#4a4260", marginTop:1 }}>Schedule · Nutrition · Race day</div>
              </div>
              <span style={{ fontSize:16, color:"#3e3660" }}>›</span>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ marginTop:"auto", paddingTop:40, textAlign:"center" }}>
        <div style={{ fontSize:9, fontFamily:"monospace", color:"#1e1830", letterSpacing:"0.2em" }}>BUILT WITH CLAUDE</div>
      </div>
    </div>
  );
}
