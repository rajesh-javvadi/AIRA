import React, { useState } from "react";
import { LoginHeader, SimpleFooter } from "../components/Layout";
import PasscodeInput from "../components/PasscodeInput";
import { Icon, Spinner } from "../components/UI";
import { extractTextFromFile } from "../services/resumeParser";
import type { ResumeData } from "../types";

const VALID_PASSCODE = "AIRA2024"; // alphanumeric demo passcode

interface LoginPageProps {
  onSuccess: (resumeData: ResumeData | null) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const [digits, setDigits] = useState<string[]>(Array(8).fill(""));
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");

  const passcode = digits.join("");
  const isComplete = passcode.length === 8 && digits.every((d) => d !== "");

  const handleSubmit = async () => {
    if (!isComplete || loading) return;

    setLoading(true);
    setError(false);
    setStatusText("Verifying passcode…");

    if (passcode.toUpperCase() === VALID_PASSCODE) {
      setStatusText("Fetching resume…");
      const resumeData = await fetchAndParseResume();
      onSuccess(resumeData);
    } else {
      setError(true);
      setLoading(false);
      setStatusText("");
      setDigits(Array(8).fill(""));
    }
  };

  const fetchAndParseResume = async (): Promise<ResumeData | null> => {
    try {
      const response = await fetch(
        "/api/AIRA/getfile/01Z4J7AGYMBSFDXSTPTVAJMQHP4NHOGKAZ",
        {
          method: "GET",
          cache: "no-store" // Ensure fresh fetch 
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const blob = await response.blob();

      // Get filename from headers
      const contentDisposition = response.headers.get("content-disposition");
      let fileName = "resume.pdf";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match?.[1]) fileName = match[1];
      }

      // Create File object
      const file = new File([blob], fileName, { type: blob.type });

      // Extract text from the resume
      setStatusText("Analyzing resume…");
      const extractedText = await extractTextFromFile(file);

      return {
        file,
        fileName,
        extractedText,
      };
    } catch (err) {
      console.error("Error fetching/parsing resume:", err);
      // Still allow progression even if resume fetch fails
      return null;
    }
  };

  const handleChange = (next: string[]) => {
    setDigits(next);
    setError(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <LoginHeader />

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div
          className="card anim-fade-up"
          style={{
            width: "100%",
            maxWidth: 480,
            padding: "48px 40px",
            textAlign: "center",
          }}
        >
          {/* Lock icon */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "var(--primary-dim)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 28px",
            }}
          >
            <Icon name="lock_open" size={32} style={{ color: "var(--primary)" }} />
          </div>

          <h1
            className="anim-fade-up-1"
            style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}
          >
            Welcome to AIRA
          </h1>
          <p
            className="anim-fade-up-2"
            style={{
              color: "var(--muted)",
              fontSize: 14,
              lineHeight: 1.6,
              marginBottom: 36,
            }}
          >
            Enter the unique 8-character passcode from your invitation email to
            begin. Letters and numbers accepted.
          </p>

          {/* Passcode input */}
          <div className="anim-fade-up-3" style={{ marginBottom: 28 }}>
            <PasscodeInput
              digits={digits}
              onChange={handleChange}
              error={error}
            />
          </div>

          {/* Error */}
          {error && (
            <p
              className="anim-fade"
              style={{
                color: "var(--danger)",
                fontSize: 13,
                marginBottom: 12,
                fontWeight: 500,
              }}
            >
              Incorrect passcode. Please try again.
            </p>
          )}

          {/* Demo hint */}
          <p
            style={{
              color: "var(--muted)",
              fontSize: 12,
              marginBottom: 20,
              lineHeight: 1.5,
            }}
          >
            Demo passcode:{" "}
            <strong style={{ fontFamily: "var(--mono)", letterSpacing: 2 }}>
              AIRA-2024
            </strong>
          </p>

          {/* Submit button */}
          <button
            className="btn-primary anim-fade-up-4"
            style={{ width: "100%", justifyContent: "center", fontSize: 15 }}
            disabled={!isComplete || loading}
            onClick={handleSubmit}
          >
            {loading ? <Spinner /> : <Icon name="arrow_forward" size={18} />}
            <span>{loading ? statusText || "Verifying…" : "Join Interview"}</span>
          </button>

          <div
            style={{
              marginTop: 28,
              paddingTop: 28,
              borderTop: "1.5px solid var(--border)",
            }}
          >
            <p style={{ fontSize: 12, color: "var(--muted)" }}>
              Having trouble?{" "}
              <a
                href="#"
                style={{
                  color: "var(--primary)",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </main>

      <SimpleFooter />
    </div>
  );
};

export default LoginPage;
