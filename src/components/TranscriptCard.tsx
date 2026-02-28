import React from "react";
import { Icon } from "./UI";
import { StatusDot } from "./UI";
import { Card } from "./UI";

interface TranscriptCardProps {
  question: string;
  answer: string;
}

const TranscriptCard: React.FC<TranscriptCardProps> = ({ question, answer }) => (
  <Card style={{ width: "100%", padding: 32 }}>
    {/* AI Question */}
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
        }}
      >
        <Icon name="smart_toy" size={14} style={{ color: "var(--primary)" }} />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--primary)",
            textTransform: "uppercase",
            letterSpacing: 1.5,
          }}
        >
          AI Interviewer
        </span>
      </div>
      <p style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.6 }}>
        "{question}"
      </p>
    </div>

    {/* User Answer */}
    <div style={{ paddingTop: 24, borderTop: "1.5px solid var(--border)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
        }}
      >
        <StatusDot />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: 1.5,
          }}
        >
          Listening…
        </span>
      </div>
      <p
        style={{
          fontSize: 16,
          color: "var(--muted)",
          lineHeight: 1.7,
          fontStyle: "italic",
        }}
      >
        "{answer}"
      </p>
    </div>
  </Card>
);

export default TranscriptCard;
