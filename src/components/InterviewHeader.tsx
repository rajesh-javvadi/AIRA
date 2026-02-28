import React from "react";
import { Icon } from "./UI";

interface InterviewHeaderProps {
  timeLeft: number;
  currentQuestion: number;
  totalQuestions: number;
}

const InterviewHeader: React.FC<InterviewHeaderProps> = ({
  timeLeft,
  currentQuestion,
  totalQuestions,
}) => {
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const progress = ((currentQuestion - 1) / totalQuestions) * 100;

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 28px",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1.5px solid var(--border)",
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      {/* Brand */}
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
          <Icon name="graphic_eq" size={22} style={{ color: "#fff" }} />
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>
            AIRA (Artificial Intelligence Recruitment Assistant)
          </p>
          <p
            style={{
              fontSize: 11,
              color: "var(--success)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Session Active
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Progress */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4, fontWeight: 500 }}>
            Progress
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 110,
                height: 5,
                borderRadius: 99,
                background: "#daeaf5",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "var(--primary)",
                  borderRadius: 99,
                  transition: "width 0.5s",
                }}
              />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700 }}>
              {currentQuestion}/{totalQuestions}
            </span>
          </div>
        </div>

        {/* Timer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            padding: "8px 16px",
            borderRadius: 12,
          }}
        >
          <Icon name="schedule" size={18} style={{ color: "var(--primary)" }} />
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            {mins}:{secs}
          </span>
        </div>

        {/* Settings */}
        <button className="btn-ghost" style={{ padding: 10, borderRadius: 10 }}>
          <Icon name="settings" size={20} />
        </button>

        {/* Avatar */}
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7ec8e3, #054468)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid rgba(5,68,104,0.2)",
          }}
        >
          <Icon name="person" size={20} style={{ color: "#fff" }} />
        </div>
      </div>
    </header>
  );
};

export default InterviewHeader;
