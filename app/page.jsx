"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";

// ─── APP REGISTRY ─────────────────────────────────────────────────────────────
// To add a new app: copy a block, set status:"live", add href route.
// Categories: "health" | "travel" | "finance" | "productivity" | "family"
// ─────────────────────────────────────────────────────────────────────────────
const APPS = [
  {
    id:"marathon", href:"/marathon", emoji:"🏅",
    title:"Marathon Coach", subtitle:"TCS London Marathon 2026",
    desc:"Training · Nutrition · Race handbook · Family plan",
    category:"health", status:"live", updated:"Mar 2026",
    color:"#c8a45e", accent:"rgba(200,164,94,0.12)", border:"rgba(200,164,94,0.3)",
    tags:["running","nutrition","travel","race"],
  },
  // ── Add future apps below ─────────────────────────────────────────────────
  {
    id:"finance", href:"/finance", emoji:"📊",
    title:"Finance Dashboard", subtitle:"Coming soon",
    desc:"Portfolio · Spending · Goals",
    category:"finance", status:"soon",
    color:"#6366f1", accent:"rgba(99,102,241,0.08)", border:"rgba(99,102,241,0.2)",
    tags:["money","investing"],
  },
  {
    id:"travel", href:"/travel", emoji:"✈️",
    title:"Travel Planner", subtitle:"Coming soon",
    desc:"Itineraries · Hotels · Flights",
    category:"travel", status:"soon",
    color:"#06b6d4", accent:"rgba(6,182,212,0.08)", border:"rgba(6,182,212,0.2)",
    tags:["travel","trips"],
  },
  {
    id:"family", href:"/family", emoji:"👨‍👩‍👦",
    title:"Family Hub", subtitle:"Coming soon",
    desc:"Shared calendar · Kids · Milestones",
    category:"family", status:"soon",
    color:"#f472b6", accent:"rgba(244,114,182,0.08)", border:"rgba(244,114,182,0.2)",
    tags:["family","kids"],
  },
];

const CATS = {
  all:{label:"ALL",icon:"◈"},
  health:{label:"HEALTH",icon:"🏃"},
  travel:{label:"TRAVEL",icon:"✈️"},
  finance:{label:"FINANCE",icon:"📊"},
  family:{label:"FAMILY",icon:"🏠"},
};

export default function Home() {
  const { data: session } = useSession();
  const [hov,    setHov]    = useState(null);
  const [q,      setQ]      = useState("");
  const [cat,    setCat]    = useState("all");
  const [rec,    setRec]    = useState([]);
  const [ready,  setReady]  = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setReady(true);
    try { setRec(JSON.parse(localStorage.getItem("sa_rec") || "[]")); } catch(_) {}
  }, []);

  const touch = (id) => {
    const next = [id, ...rec.filter(r => r !== id)].slice(0, 3);
    setRec(next);
    try { localStorage.setItem("sa_rec", JSON.stringify(next)); } catch(_) {}
  };

  useEffect(() => {
    const h = (e) => { if (e.key === "/" && document.activeElement?.tagName !== "INPUT") { e.preventDefault(); ref.current?.focus(); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const filt = APPS.filter(a => {
    const mc = cat === "all" || a.category === cat;
    const ql = q.toLowerCase();
    const ms = !ql || a.title.toLowerCase().includes(ql) || a.tags.some(t => t.includes(ql));
    return mc && ms;
  });

  const live = filt.filter(a => a.status === "live");
  const soon = filt.filter(a => a.status === "soon");
  const recApps = rec.map(id => APPS.find(a => a.id === id)).filter(Boolean);

  const S = { // shared styles
    mono: { fontFamily: "monospace" },
    label: { fontSize: 9, fontFamily: "monospace", color: "#3e3660", letterSpacing: "0.2em", marginBottom: 12 },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07060e", fontFamily: "Georgia,serif", color: "#e2ddd6", display: "flex", flexDirection: "column", backgroundImage: "radial-gradient(rgba(200,164,94,0.05) 1px,transparent 1px)", backgroundSize: "28px 28px" }}>

      {/* ── HEADER ── */}
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(7,6,14,0.9)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 20, padding: "0 20px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: "linear-gradient(135deg,#c8a45e,#9a6f30)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold", color: "#07060e", ...S.mono }}>S</div>
            <span style={{ fontSize: 11, ...S.mono, color: "#c8a45e", letterSpacing: "0.18em" }}>SHASHANK.APP</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {session?.user?.image && <img src={session.user.image} alt="" style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid rgba(200,164,94,0.3)" }} />}
            <button onClick={() => signOut({ callbackUrl: "/auth/signin" })} style={{ fontSize: 9, ...S.mono, color: "#3e3660", background: "none", border: "1px solid #1c1830", borderRadius: 4, padding: "4px 10px", cursor: "pointer", letterSpacing: "0.1em", transition: "all 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.color = "#c8a45e"; e.currentTarget.style.borderColor = "rgba(200,164,94,0.4)"; }}
              onMouseOut={e => { e.currentTarget.style.color = "#3e3660"; e.currentTarget.style.borderColor = "#1c1830"; }}>
              SIGN OUT
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "52px 20px 32px", width: "100%" }}>
        <div style={{ fontSize: 9, ...S.mono, color: "#42d692", letterSpacing: "0.25em", marginBottom: 8 }}>PERSONAL WORKSPACE</div>
        <h1 style={{ margin: "0 0 8px", fontSize: 32, fontWeight: "normal", color: "#f0ebe2", lineHeight: 1.2 }}>
          Hi, <span style={{ color: "#c8a45e", fontStyle: "italic" }}>Shashank</span>
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: "#4a4260", lineHeight: 1.7, maxWidth: 400 }}>
          Personal apps built with Claude — each one solving something specific.
        </p>
      </div>

      {/* ── SEARCH + FILTER ── */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 20px 24px", width: "100%" }}>
        <div style={{ position: "relative", marginBottom: 12 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#3e3660", pointerEvents: "none" }}>⌕</span>
          <input ref={ref} placeholder='Search…   press "/" to focus' value={q} onChange={e => setQ(e.target.value)}
            style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.03)", border: "1px solid #1c1830", borderRadius: 8, padding: "10px 36px 10px 34px", color: "#e2ddd6", fontSize: 13, fontFamily: "Georgia,serif", outline: "none", transition: "border 0.2s" }}
            onFocus={e => e.target.style.borderColor = "rgba(200,164,94,0.5)"}
            onBlur={e => e.target.style.borderColor = "#1c1830"} />
          {q && <button onClick={() => setQ("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#3e3660", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Object.entries(CATS).map(([k, m]) => {
            const on = cat === k;
            return (
              <button key={k} onClick={() => setCat(k)} style={{ padding: "4px 12px", borderRadius: 20, fontSize: 9, ...S.mono, cursor: "pointer", border: `1px solid ${on ? "rgba(200,164,94,0.6)" : "#1c1830"}`, background: on ? "rgba(200,164,94,0.1)" : "transparent", color: on ? "#c8a45e" : "#3e3660", transition: "all 0.2s", letterSpacing: "0.1em" }}
                onMouseOver={e => { if (!on) { e.currentTarget.style.color = "#c8a45e"; e.currentTarget.style.borderColor = "rgba(200,164,94,0.3)"; }}}
                onMouseOut={e => { if (!on) { e.currentTarget.style.color = "#3e3660"; e.currentTarget.style.borderColor = "#1c1830"; }}}>
                {m.icon} {m.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 20px 80px", width: "100%", flex: 1 }}>

        {/* ── RECENTS ── */}
        {ready && recApps.length > 0 && !q && cat === "all" && (
          <div style={{ marginBottom: 28 }}>
            <div style={S.label}>RECENTLY USED</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {recApps.map(app => (
                <Link key={app.id} href={app.href} style={{ textDecoration: "none" }} onClick={() => touch(app.id)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", border: `1px solid ${app.border}`, borderRadius: 20, background: app.accent, cursor: "pointer", transition: "border-color 0.2s" }}
                    onMouseOver={e => e.currentTarget.style.borderColor = app.color}
                    onMouseOut={e => e.currentTarget.style.borderColor = app.border}>
                    <span style={{ fontSize: 14 }}>{app.emoji}</span>
                    <span style={{ fontSize: 10, ...S.mono, color: app.color }}>{app.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── LIVE APPS ── */}
        {live.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={S.label}>{q ? `${live.length} RESULT${live.length !== 1 ? "S" : ""}` : "YOUR APPS"}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {live.map(app => (
                <Link key={app.id} href={app.href} style={{ textDecoration: "none" }} onClick={() => touch(app.id)}>
                  <div onMouseEnter={() => setHov(app.id)} onMouseLeave={() => setHov(null)}
                    style={{ padding: "18px 20px", border: `1px solid ${hov === app.id ? app.color : app.border}`, borderRadius: 10, background: hov === app.id ? app.accent : "rgba(255,255,255,0.02)", cursor: "pointer", transition: "all 0.18s", display: "flex", alignItems: "center", gap: 16, boxShadow: hov === app.id ? `0 0 28px ${app.accent}` : "none" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0, background: app.accent, border: `1px solid ${app.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, transform: hov === app.id ? "scale(1.08)" : "scale(1)", transition: "transform 0.18s" }}>
                      {app.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 15, color: "#f0ebe2" }}>{app.title}</span>
                        <span style={{ fontSize: 7, ...S.mono, color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 3, padding: "1px 5px", letterSpacing: "0.15em" }}>LIVE</span>
                      </div>
                      <div style={{ fontSize: 10, ...S.mono, color: app.color, marginBottom: 3 }}>{app.subtitle}</div>
                      <div style={{ fontSize: 12, color: "#4a4260", lineHeight: 1.4 }}>{app.desc}</div>
                    </div>
                    <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                      <span style={{ fontSize: 16, color: app.color, transition: "all 0.18s", transform: hov === app.id ? "translateX(4px)" : "none", opacity: hov === app.id ? 1 : 0.4 }}>→</span>
                      {app.updated && <span style={{ fontSize: 8, ...S.mono, color: "#2a2448" }}>{app.updated}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── COMING SOON ── */}
        {soon.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={S.label}>COMING SOON</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 8 }}>
              {soon.map(app => (
                <div key={app.id} style={{ padding: "14px 16px", border: `1px solid ${app.border}`, borderRadius: 10, background: "rgba(255,255,255,0.01)", opacity: 0.45, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{app.emoji}</span>
                  <div>
                    <div style={{ fontSize: 12, color: "#4a4260", marginBottom: 2 }}>{app.title}</div>
                    <div style={{ fontSize: 8, ...S.mono, color: "#2a2448", letterSpacing: "0.1em" }}>SOON</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {q && live.length === 0 && soon.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 24px", color: "#3e3660" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>◎</div>
            <div style={{ fontSize: 11, ...S.mono, letterSpacing: "0.1em" }}>NO APPS MATCH "{q.toUpperCase()}"</div>
          </div>
        )}

        {/* ── ADD NEW APP HINT ── */}
        <div style={{ padding: "14px 18px", border: "1px dashed #1c1830", borderRadius: 10, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, border: "1px dashed #2a2448", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#2a2448" }}>+</div>
          <div>
            <div style={{ fontSize: 12, color: "#3e3660", marginBottom: 3 }}>Add a new app</div>
            <div style={{ fontSize: 11, color: "#2a2448", lineHeight: 1.6 }}>
              Create <code style={{ ...S.mono, background: "#0f0d1a", padding: "1px 5px", borderRadius: 3, fontSize: 10 }}>app/your-app/page.jsx</code> → add an entry to the <code style={{ ...S.mono, background: "#0f0d1a", padding: "1px 5px", borderRadius: 3, fontSize: 10 }}>APPS</code> array in <code style={{ ...S.mono, background: "#0f0d1a", padding: "1px 5px", borderRadius: 3, fontSize: 10 }}>page.jsx</code> → commit → done.
            </div>
          </div>
        </div>

      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "16px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 9, ...S.mono, color: "#2a2448", letterSpacing: "0.2em" }}>
          SHASHANK.APP · BUILT WITH CLAUDE · {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
