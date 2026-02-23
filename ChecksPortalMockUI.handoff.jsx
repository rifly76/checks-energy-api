// Handoff file (React mock - versione sintetica ma utile)
// Include dataset demo + struttura tab principale.
// Nella chat precedente esisteva una versione più ampia; questa è la base da cui ripartire.

import React, { useState } from "react";

const agency = { name: "Agenzia Energia Milano Centro", creditsAvailable: 34, role: "Responsabile Agenzia" };
const operators = [
  { id: 2003, first_name: "Luca", last_name: "Bianchi", email: "l.bianchi@agenzia-milano-demo.it", status: "active", credits_balance: 7 },
  { id: 2004, first_name: "Giulia", last_name: "Verdi", email: "g.verdi@agenzia-milano-demo.it", status: "active", credits_balance: 3 }
];
const activities = [
  { id: 5001, public_code: "AT-2026-00124", customer_reference_name: "Mario Rossi", site_city: "Milano", status: "report_available", outcome: "compatible", operator_name: "Luca Bianchi", report_available: true, error_percent: 0.42 },
  { id: 5002, public_code: "AT-2026-00125", customer_reference_name: "Condominio Aurora", site_city: "Milano", status: "completed", outcome: "to_review", operator_name: "Giulia Verdi", report_available: false, error_percent: 2.85 }
];
const reports = [
  { id: 7001, file_name: "AT-2026-00124-relazione.pdf", public_code: "AT-2026-00124", customer_reference_name: "Mario Rossi", branding_applied: true }
];
const creditMovements = [
  { id: 10010, transaction_type: "assign_to_operator", direction: "debit", amount: 1, description: "Riassegnazione a Luca Bianchi" },
  { id: 10002, transaction_type: "topup", direction: "credit", amount: 20, description: "Carico crediti agenzia" }
];

export default function ChecksPortalMockUIHandoff() {
  const [tab, setTab] = useState("dashboard");
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 16, background: "#f5f7fb", minHeight: "100vh" }}>
      <div style={{ background: "white", borderRadius: 12, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: "#666" }}>Checks Energy Portal — Handoff mock</div>
        <div style={{ fontWeight: 700 }}>{agency.name}</div>
        <div style={{ fontSize: 13, color: "#444" }}>{agency.role} • Crediti: {agency.creditsAvailable}</div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {["dashboard","activities","reports","credits","operators","branding"].map(v => (
          <button key={v} onClick={() => setTab(v)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ccc", background: tab===v ? "#2563eb" : "white", color: tab===v ? "white":"#111" }}>
            {v}
          </button>
        ))}
      </div>

      <div style={{ background: "white", borderRadius: 12, padding: 16 }}>
        {tab === "dashboard" && (
          <>
            <h3>Dashboard</h3>
            <ul>
              <li>Attività demo: {activities.length}</li>
              <li>Relazioni PDF: {reports.length}</li>
              <li>Crediti disponibili: {agency.creditsAvailable}</li>
              <li>Operatori attivi: {operators.length}</li>
            </ul>
          </>
        )}

        {tab === "activities" && (
          <>
            <h3>Attività</h3>
            <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
              <thead><tr><th align="left">Codice</th><th align="left">Cliente</th><th align="left">Operatore</th><th align="left">Stato</th><th align="left">Esito</th></tr></thead>
              <tbody>
                {activities.map(a => <tr key={a.id}><td>{a.public_code}</td><td>{a.customer_reference_name}</td><td>{a.operator_name}</td><td>{a.status}</td><td>{a.outcome}</td></tr>)}
              </tbody>
            </table>
          </>
        )}

        {tab === "reports" && (
          <>
            <h3>Relazioni PDF</h3>
            {reports.map(r => <div key={r.id}>{r.file_name} — {r.customer_reference_name} — {r.branding_applied ? "Logo agenzia" : "Standard"}</div>)}
          </>
        )}

        {tab === "credits" && (
          <>
            <h3>Crediti</h3>
            {creditMovements.map(m => <div key={m.id}>{m.transaction_type} • {m.direction === "credit" ? "+" : "-"}{m.amount} • {m.description}</div>)}
          </>
        )}

        {tab === "operators" && (
          <>
            <h3>Operatori</h3>
            {operators.map(o => <div key={o.id}>{o.first_name} {o.last_name} — {o.email} — crediti {o.credits_balance}</div>)}
          </>
        )}

        {tab === "branding" && (
          <>
            <h3>Branding agenzia</h3>
            <p>Testata PDF personalizzabile con logo agenzia.</p>
          </>
        )}
      </div>
    </div>
  );
}
