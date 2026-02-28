import React from "react";
import { Icon } from "./UI";
import { Card } from "./UI";

// ─── ResumeCard ───────────────────────────────────────────────────────────────
interface ResumeCardProps {
  resumeFile: File | null;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({ resumeFile }) => (
  <Card style={{ padding: 22 }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <h3 style={{ fontWeight: 700, fontSize: 15 }}>Resume Preview</h3>
      <button
        style={{
          color: "var(--primary)",
          fontSize: 13,
          fontWeight: 600,
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        Edit
      </button>
    </div>

    <div
      style={{
        aspectRatio: "3/4",
        borderRadius: 12,
        border: "2px dashed #c0d4e4",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(5,68,104,0.05) 0%, transparent 60%)",
        }}
      />
      <Icon name="description" size={36} style={{ color: "#9bbdd4" }} />
      <p style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>
        {resumeFile ? resumeFile.name : "No resume uploaded"}
      </p>
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 12,
          right: 12,
          height: 3,
          borderRadius: 99,
          background: "#e0eaf0",
        }}
      >
        <div
          style={{
            width: resumeFile ? "100%" : "0%",
            height: "100%",
            borderRadius: 99,
            background: "var(--primary)",
            transition: "width 0.5s ease",
          }}
        />
      </div>
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        marginTop: 12,
        fontSize: 12,
        color: "var(--muted)",
      }}
    >
      {resumeFile ? (
        <>
          <Icon name="check_circle" size={14} style={{ color: "var(--success)" }} />
          AI Analysis Complete
        </>
      ) : (
        <>
          <Icon name="info" size={14} style={{ color: "var(--muted)" }} />
          Awaiting resume
        </>
      )}
    </div>
  </Card>
);

// ─── SessionStats ─────────────────────────────────────────────────────────────
interface StatRow {
  label: string;
  value: string;
  color?: string;
}

const stats: StatRow[] = [
  { label: "Est. Duration", value: "15 Minutes" },
  { label: "Difficulty", value: "Senior Level", color: "#f97316" },
  { label: "Focus Area", value: "System Design" },
];

export const SessionStats: React.FC = () => (
  <Card style={{ padding: 22 }}>
    <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
      Session Stats
    </h3>
    {stats.map(({ label, value, color }) => (
      <div
        key={label}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 0",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span style={{ fontSize: 13, color: "var(--muted)" }}>{label}</span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: color || "var(--text)",
          }}
        >
          {value}
        </span>
      </div>
    ))}
  </Card>
);
