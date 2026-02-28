import React, { useState } from "react";
import { Icon } from "./UI";
import { StatusDot } from "./UI";

interface InterviewFooterProps {
  onEnd: () => void;
}

const InterviewFooter: React.FC<InterviewFooterProps> = ({ onEnd }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <footer
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 28px",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderTop: "1.5px solid var(--border)",
        flexShrink: 0,
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      {/* Left actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn-ghost">
          <Icon name="pause" size={18} />
          <span>Pause</span>
        </button>
        <button className="btn-ghost">
          <Icon name="keyboard" size={18} />
          <span>Type Answer</span>
        </button>
      </div>

      {/* Right controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "var(--muted)",
            fontWeight: 500,
          }}
        >
          <StatusDot />
          Microphone active
        </div>

        {showConfirm ? (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>
              End interview?
            </span>
            <button
              className="btn-ghost"
              style={{ padding: "8px 16px", fontSize: 13 }}
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </button>
            <button className="btn-danger" onClick={onEnd}>
              <Icon name="call_end" size={16} />
              Confirm End
            </button>
          </div>
        ) : (
          <button
            className="btn-danger"
            onClick={() => setShowConfirm(true)}
          >
            <Icon name="call_end" size={18} />
            End Interview
          </button>
        )}
      </div>
    </footer>
  );
};

export default InterviewFooter;
