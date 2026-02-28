import React from "react";
import { AiraLogo, Icon } from "./UI";

// ─── LoginHeader ──────────────────────────────────────────────────────────────
export const LoginHeader: React.FC = () => (
  <header
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 32px",
      background: "var(--surface)",
      borderBottom: "1.5px solid var(--border)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <AiraLogo size={28} />
      <span style={{ fontWeight: 700, fontSize: 18, color: "var(--text)" }}>AIRA</span>
    </div>
    <button className="btn-ghost" style={{ padding: "8px 14px" }}>
      <Icon name="help_outline" size={18} />
      <span style={{ fontSize: 13 }}>Help</span>
    </button>
  </header>
);

// ─── AppHeader ────────────────────────────────────────────────────────────────
interface AppHeaderProps {
  title?: string;
  subtitle?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = "AIRA (Artificial Intelligence Recruitment Assistant)",
  subtitle,
}) => (
  <header
    style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 32px",
      background: "rgba(255,255,255,0.9)",
      backdropFilter: "blur(12px)",
      borderBottom: "1.5px solid var(--border)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: "var(--primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name="psychology" size={22} style={{ color: "#fff" }} />
      </div>
      <div>
        <span style={{ fontWeight: 700, fontSize: 17 }}>{title}</span>
        {subtitle && (
          <p style={{ fontSize: 11, color: "var(--success)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
    <div style={{ display: "flex", gap: 10 }}>
      {["settings", "help"].map((ico) => (
        <button key={ico} className="btn-ghost" style={{ padding: 10, borderRadius: 10 }}>
          <Icon name={ico} size={20} />
        </button>
      ))}
    </div>
  </header>
);

// ─── SimpleFooter ─────────────────────────────────────────────────────────────
export const SimpleFooter: React.FC = () => (
  <footer
    style={{
      padding: "20px 32px",
      textAlign: "center",
      borderTop: "1.5px solid var(--border)",
      background: "var(--surface)",
    }}
  >
    <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 6 }}>
      {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((t) => (
        <a
          key={t}
          href="#"
          style={{ fontSize: 12, color: "var(--muted)", textDecoration: "none" }}
        >
          {t}
        </a>
      ))}
    </div>
    <p style={{ fontSize: 12, color: "var(--muted)" }}>
      © 2024 AIRA Platform. All rights reserved.
    </p>
  </footer>
);

// ─── AppFooter ────────────────────────────────────────────────────────────────
export const AppFooter: React.FC = () => (
  <footer
    style={{
      width: "100%",
      borderTop: "1.5px solid var(--border)",
      padding: "24px 32px",
      background: "var(--surface)",
    }}
  >
    <div
      style={{
        maxWidth: 960,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <p style={{ fontSize: 13, color: "var(--muted)" }}>© 2024 AIRA. All rights reserved.</p>
      <div style={{ display: "flex", gap: 20 }}>
        {["Privacy Policy", "Terms of Service", "Contact Support"].map((t) => (
          <a
            key={t}
            href="#"
            style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}
          >
            {t}
          </a>
        ))}
      </div>
    </div>
  </footer>
);
