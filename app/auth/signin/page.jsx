"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignIn() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.push("/");
  }, [status, router]);

  return (
    <div style={{ minHeight:"100vh", background:"#08070f", display:"flex",
      alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif", padding:"24px" }}>
      <div style={{ width:"100%", maxWidth:380, textAlign:"center" }}>

        <div style={{ marginBottom:40 }}>
          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center",
            width:48, height:48, borderRadius:12, marginBottom:20,
            background:"linear-gradient(135deg,#c8a45e,#9a6f30)" }}>
            <span style={{ fontSize:22, fontFamily:"monospace", fontWeight:"bold", color:"#07060e" }}>S</span>
          </div>
          <div style={{ fontSize:10, fontFamily:"monospace", color:"#42d692",
            letterSpacing:"0.3em", marginBottom:10 }}>SHASHANK.APP</div>
          <h1 style={{ margin:"0 0 10px", fontSize:26, fontWeight:"normal", color:"#f0ebe2" }}>
            Personal <span style={{ color:"#c8a45e", fontStyle:"italic" }}>Workspace</span>
          </h1>
          <p style={{ margin:0, fontSize:13, color:"#4a4260", lineHeight:1.6 }}>
            Sign in with your Google account to continue.
          </p>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl:"/" })}
          disabled={status === "loading"}
          style={{ width:"100%", padding:"14px 20px", background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(255,255,255,0.1)", borderRadius:10,
            cursor: status === "loading" ? "not-allowed" : "pointer",
            display:"flex", alignItems:"center", justifyContent:"center", gap:12,
            opacity: status === "loading" ? 0.6 : 1 }}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span style={{ fontSize:14, color:"#e2ddd6", fontFamily:"Georgia,serif" }}>
            {status === "loading" ? "Signing in…" : "Continue with Google"}
          </span>
        </button>

        <p style={{ marginTop:28, fontSize:10, fontFamily:"monospace",
          color:"#2a2448", letterSpacing:"0.15em" }}>PRIVATE · INVITE ONLY</p>
      </div>
    </div>
  );
}
