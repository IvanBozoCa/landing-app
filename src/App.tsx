import React, { useState } from "react";
import PhoneFrame from "./components/phoneframe";

const CONDUCTOR_URL = import.meta.env.VITE_CONDUCTOR_URL as string;
const APODERADO_URL = import.meta.env.VITE_APODERADO_URL as string;
const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL as string;

export default function App() {
  const [k, setK] = useState(0); // para forzar reload de iframes

  return (
    <div style={{ minHeight: "100vh", padding: 24, background: "#0b1220", color: "#e7e9ee" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>Demo Transporte Escolar — Vistas en vivo</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setK(v => v + 1)}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #2b3450", background: "#131a2a", color: "#e7e9ee", cursor: "pointer" }}
          >
            Recargar vistas
          </button>
          <a href={CONDUCTOR_URL} target="_blank" rel="noreferrer"
             style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #2b3450", background: "#131a2a", color: "#e7e9ee", textDecoration: "none" }}>
            Abrir Conductor
          </a>
          <a href={APODERADO_URL} target="_blank" rel="noreferrer"
             style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #2b3450", background: "#131a2a", color: "#e7e9ee", textDecoration: "none" }}>
            Abrir Apoderado
          </a>
        </div>
      </header>

      <section key={k} style={{
        display: "grid", gridTemplateColumns: "repeat(2, 360px)", gap: 24,
        justifyContent: "center", margin: "16px 0 24px"
      }}>
        <PhoneFrame title="Conductor" src={CONDUCTOR_URL} />
        <PhoneFrame title="Apoderado" src={APODERADO_URL} />
      </section>

      <section style={{ maxWidth: 1120, margin: "0 auto" }}>
        <h2 style={{ fontSize: 18, margin: "12px 0" }}>Panel (provisorio)</h2>
        <div style={{
          height: 500, borderRadius: 16, overflow: "hidden",
          border: "1px solid #2b3450", boxShadow: "0 8px 24px rgba(0,0,0,.2)"
        }}>
          <iframe
            title="Dashboard / Swagger"
            src={DASHBOARD_URL}
            width="100%"
            height="100%"
            style={{ border: 0, background: "#fff" }}
          />
        </div>
      </section>

      <footer style={{ textAlign: "center", opacity: .6, marginTop: 20 }}>
        © {new Date().getFullYear()} Demo Transporte Escolar
      </footer>
    </div>
  );
}
