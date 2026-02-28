import React, { useState } from "react";
import { AppHeader, AppFooter } from "../components/Layout";
import ChecklistItem from "../components/ChecklistItem";
import { ResumeCard, SessionStats } from "../components/ResumeSidebar";
import { Icon } from "../components/UI";
import type { ChecklistItem as ChecklistItemType, ResumeData } from "../types";

const CHECKLIST_ITEMS: ChecklistItemType[] = [
  {
    label: "Ensure your microphone is on",
    sub: "Audio feedback is required for the AI to respond.",
    defaultChecked: true,
  },
  {
    label: "Your resume has been analyzed by our AI",
    sub: "The questions will be tailored to your specific experience.",
    defaultChecked: true,
  },
  {
    label: "The session will last exactly 15 minutes",
    sub: "A timer will be visible throughout the conversation.",
    defaultChecked: true,
  },
  {
    label: "Speak clearly for the captions",
    sub: "Real-time transcription helps analyze your technical accuracy.",
    defaultChecked: false,
  },
];

interface InstructionsPageProps {
  resumeData: ResumeData | null;
  onStart: () => void;
}

const InstructionsPage: React.FC<InstructionsPageProps> = ({ resumeData, onStart }) => {
  const [checked, setChecked] = useState<boolean[]>(
    CHECKLIST_ITEMS.map((c) => c.defaultChecked)
  );

  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppHeader />

      <main
        style={{
          flex: 1,
          maxWidth: 960,
          width: "100%",
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        {/* Hero */}
        <div className="anim-fade-up" style={{ marginBottom: 36 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "var(--primary-dim)",
              color: "var(--primary)",
              padding: "6px 14px",
              borderRadius: 99,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            <Icon name="verified" size={14} />
            Ready to Start
          </div>
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 44px)",
              fontWeight: 800,
              letterSpacing: -1,
              marginBottom: 10,
              lineHeight: 1.1,
            }}
          >
            Interview for
            <br />
            Senior Frontend Engineer
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 17 }}>
            Professional AI-driven simulation for your dream role.
          </p>
          {resumeData && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginTop: 12,
                padding: "6px 14px",
                borderRadius: 99,
                fontSize: 13,
                fontWeight: 600,
                background: "rgba(34,197,94,0.12)",
                color: "var(--success)",
              }}
            >
              <Icon name="check_circle" size={14} />
              Resume analyzed: {resumeData.fileName}
            </div>
          )}
        </div>

        {/* Content grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr minmax(220px, 280px)",
            gap: 28,
            alignItems: "start",
          }}
        >
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Checklist card */}
            <div className="card anim-fade-up-1" style={{ padding: 32 }}>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Icon
                  name="assignment"
                  size={20}
                  style={{ color: "var(--primary)" }}
                />
                Instructions & Setup
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {CHECKLIST_ITEMS.map((item, i) => (
                  <ChecklistItem
                    key={i}
                    label={item.label}
                    sub={item.sub}
                    checked={checked[i]}
                    onToggle={() => toggle(i)}
                  />
                ))}
              </div>
            </div>

            {/* Pro tip */}
            <div
              className="anim-fade-up-2"
              style={{
                display: "flex",
                gap: 16,
                padding: "20px 24px",
                borderRadius: 16,
                background: "var(--primary-dim)",
                border: "1.5px solid rgba(5,68,104,0.15)",
              }}
            >
              <Icon
                name="lightbulb"
                size={28}
                style={{
                  color: "var(--primary)",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />
              <div>
                <p style={{ fontWeight: 700, marginBottom: 4 }}>Pro Tip</p>
                <p
                  style={{
                    fontSize: 13,
                    color: "#3a607d",
                    lineHeight: 1.5,
                  }}
                >
                  Focus on technical depth and mention specific frameworks like
                  React or Vue when discussing your past projects.
                </p>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div
            className="anim-fade-up-2"
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            <ResumeCard resumeFile={resumeData?.file || null} />
            <SessionStats />
          </div>
        </div>

        {/* CTA */}
        <div
          className="anim-fade-up-4"
          style={{
            marginTop: 48,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              className="btn-ghost"
              style={{
                padding: "16px 24px",
                fontSize: 16,
                borderRadius: 16,
                border: "1px solid var(--primary)",
                color: "var(--primary)",
              }}
              onClick={async () => {
                const { speakText } = await import("../services/aiInterviewer");
                speakText("Hello! This is a test of my voice. Can you hear me clearly?");
              }}
            >
              <Icon name="volume_up" size={22} />
              Test Voice
            </button>
            <button
              className="btn-primary"
              style={{
                padding: "16px 48px",
                fontSize: 16,
                borderRadius: 16,
                minWidth: 240,
                justifyContent: "center",
              }}
              onClick={() => {
                // prime the speech synthesis engine on user gesture
                if ('speechSynthesis' in window) {
                  const utterance = new SpeechSynthesisUtterance("");
                  window.speechSynthesis.speak(utterance);
                }
                onStart();
              }}
            >
              <Icon name="play_arrow" size={22} />
              Start AI Interview
            </button>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>
            By starting, you agree to our recording terms for evaluation.
          </p>
        </div>
      </main>

      <AppFooter />
    </div>
  );
};

export default InstructionsPage;
