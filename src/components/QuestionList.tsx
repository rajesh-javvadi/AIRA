import React from "react";
import { Icon } from "./UI";
import { Card } from "./UI";
import type { Question } from "../types";

interface QuestionListProps {
  questions: Question[];
}

const QuestionList: React.FC<QuestionListProps> = ({ questions }) => (
  <Card style={{ padding: "20px", minWidth: 200 }}>
    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Questions</p>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {questions.map((q) => (
        <div
          key={q.id}
          style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}
        >
          {q.done ? (
            <Icon
              name="check_circle"
              size={16}
              style={{ color: "var(--success)", flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                flexShrink: 0,
                border: `2px solid ${q.active ? "var(--primary)" : "#c0d4e4"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: q.active ? "var(--primary-dim)" : "transparent",
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: q.active ? "var(--primary)" : "var(--muted)",
                }}
              >
                {q.id}
              </span>
            </div>
          )}
          <span
            style={{
              color: q.done
                ? "var(--muted)"
                : q.active
                ? "var(--text)"
                : "#9bbdd4",
              fontWeight: q.active ? 700 : 400,
            }}
          >
            {q.label}
          </span>
        </div>
      ))}
    </div>
  </Card>
);

export default QuestionList;
