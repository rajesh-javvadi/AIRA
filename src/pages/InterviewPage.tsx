import React, { useEffect, useState, useRef, useCallback } from "react";
import InterviewHeader from "../components/InterviewHeader";
import InterviewFooter from "../components/InterviewFooter";
import Waveform from "../components/Waveform";
import QuestionList from "../components/QuestionList";
import TranscriptCard from "../components/TranscriptCard";
import { useCountdown, useWaveform } from "../hooks";
import {
  analyzeResumeAndGenerateQuestions,
  speakText,
  stopSpeaking,
  createSpeechRecognition,
  toDisplayQuestions,
  type InterviewQuestion,
} from "../services/aiInterviewer";
import { Icon, Spinner } from "../components/UI";
import type { ResumeData } from "../types";

const SILENCE_TIMEOUT_MS = 20_000; // 20 seconds of silence → auto next question

interface InterviewPageProps {
  resumeData: ResumeData | null;
  onEnd: () => void;
}

const InterviewPage: React.FC<InterviewPageProps> = ({ resumeData, onEnd }) => {
  const timeLeft = useCountdown(15 * 60);
  const waveHeights = useWaveform(180);

  // ─── State ─────────────────────────────────────────────────────────────────
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState("Analyzing resume…");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [interimAnswer, setInterimAnswer] = useState("");
  const [silenceCountdown, setSilenceCountdown] = useState<number | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const silenceIntervalRef = useRef<number | null>(null);
  const questionsRef = useRef<InterviewQuestion[]>([]);
  const currentIndexRef = useRef(0);
  const isMountedRef = useRef(true);
  const isTransitioningRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => { questionsRef.current = questions; }, [questions]);
  useEffect(() => { currentIndexRef.current = currentQuestionIndex; }, [currentQuestionIndex]);
  useEffect(() => { return () => { isMountedRef.current = false; }; }, []);

  // ─── Silence timer helpers ─────────────────────────────────────────────────
  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current !== null) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (silenceIntervalRef.current !== null) {
      clearInterval(silenceIntervalRef.current);
      silenceIntervalRef.current = null;
    }
    setSilenceCountdown(null);
  }, []);

  const startSilenceTimer = useCallback(() => {
    clearSilenceTimer();

    // Visual countdown starting from 20
    let remaining = SILENCE_TIMEOUT_MS / 1000;
    setSilenceCountdown(remaining);

    silenceIntervalRef.current = window.setInterval(() => {
      remaining -= 1;
      if (remaining >= 0) {
        setSilenceCountdown(remaining);
      }
    }, 1000);

    silenceTimerRef.current = window.setTimeout(() => {
      // 20 seconds of silence — auto-advance
      if (isMountedRef.current && !isTransitioningRef.current) {
        advanceToNextQuestion();
      }
    }, SILENCE_TIMEOUT_MS);
  }, [clearSilenceTimer]);

  // ─── Auto-end when timer runs out ──────────────────────────────────────────
  useEffect(() => {
    if (timeLeft === 0) {
      cleanupAll();
      onEnd();
    }
  }, [timeLeft, onEnd]);

  // ─── Cleanup everything ────────────────────────────────────────────────────
  const cleanupAll = useCallback(() => {
    stopSpeaking();
    clearSilenceTimer();
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }
  }, [clearSilenceTimer]);

  // ─── Advance to next question (the core auto-flow) ─────────────────────────
  const advanceToNextQuestion = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const idx = currentIndexRef.current;
    const qs = questionsRef.current;

    // Stop listening & silence timer
    clearSilenceTimer();
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }
    setIsListening(false);

    if (idx >= qs.length - 1) {
      // Last question — end interview
      stopSpeaking();
      setTimeout(() => {
        if (isMountedRef.current) onEnd();
      }, 500);
      return;
    }

    const nextIndex = idx + 1;

    // Update state
    setQuestions(prev =>
      prev.map((q, i) => ({
        ...q,
        done: i <= idx,
        active: i === nextIndex,
      }))
    );
    setCurrentQuestionIndex(nextIndex);
    setCurrentAnswer("");
    setInterimAnswer("");

    // Small pause before the AI speaks the next question (feels natural)
    setTimeout(() => {
      if (isMountedRef.current) {
        const nextQ = questionsRef.current[nextIndex];
        if (nextQ) {
          askQuestion(nextQ.question);
        }
        isTransitioningRef.current = false;
      }
    }, 1200);
  }, [clearSilenceTimer, onEnd]);

  // ─── Ask a question (speak it, then auto-listen) ───────────────────────────
  const askQuestion = useCallback(async (questionText: string) => {
    if (!questionText || !isMountedRef.current) return;

    setIsSpeaking(true);
    setIsListening(false);
    setCurrentAnswer("");
    setInterimAnswer("");
    clearSilenceTimer();

    try {
      await speakText(questionText);
    } catch (err) {
      console.error("Speech failed:", err);
    }

    if (!isMountedRef.current) return;
    setIsSpeaking(false);

    // Immediately start listening — like a real interviewer waiting for your answer
    beginListening();
  }, [clearSilenceTimer]);

  // ─── Start listening with auto-restart + silence detection ─────────────────
  const beginListening = useCallback(() => {
    if (!isMountedRef.current) return;

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }

    const recognition = createSpeechRecognition(
      (result) => {
        if (!isMountedRef.current) return;

        // User is speaking — reset silence timer
        clearSilenceTimer();

        if (result.isFinal) {
          setCurrentAnswer(prev => (prev ? prev + " " + result.transcript : result.transcript));
          setInterimAnswer("");
          // Restart silence timer after each final result (user paused)
          startSilenceTimer();
        } else {
          setInterimAnswer(result.transcript);
        }
      },
      () => {
        // Recognition ended — auto-restart if we're still on this question
        if (isMountedRef.current && !isTransitioningRef.current) {
          // Small delay then restart listening
          setTimeout(() => {
            if (isMountedRef.current && !isTransitioningRef.current) {
              beginListening();
            }
          }, 300);
        }
      }
    );

    if (recognition) {
      recognitionRef.current = recognition;
      try {
        recognition.start();
        setIsListening(true);
        // Start silence timer — if user doesn't say anything for 20s, move on
        startSilenceTimer();
      } catch (err) {
        console.error("Failed to start recognition:", err);
        // Even if start fails (e.g. permission or already running), 
        // we should try to mark as listening so the UI doesn't say "Processing"
        setIsListening(true);
      }
    } else {
      // If recognition is not supported at all, we still "listen" 
      // (the user can use manual controls if we added them, but for now we unblock)
      setIsListening(true);
    }
  }, [clearSilenceTimer, startSilenceTimer]);

  const [isStuck, setIsStuck] = useState(false);

  // Detection for stuck state
  useEffect(() => {
    if (!isLoading && !isSpeaking && !isListening && questions.length > 0) {
      const timer = setTimeout(() => {
        if (!isSpeaking && !isListening) {
          setIsStuck(true);
        }
      }, 5000); // If stuck in "Processing" for 5 seconds
      return () => clearTimeout(timer);
    } else {
      setIsStuck(false);
    }
  }, [isLoading, isSpeaking, isListening, questions]);

  // ─── Load questions on mount & start the interview ─────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function loadAndStart() {
      setIsLoading(true);
      setLoadingStatus("Analyzing your resume with AI…");

      const resumeText =
        resumeData?.extractedText || "[No resume provided - use general interview questions]";

      try {
        console.log("Calling Mistral API...");
        const analysis = await analyzeResumeAndGenerateQuestions(resumeText);
        if (cancelled) return;

        setQuestions(analysis.questions);
        questionsRef.current = analysis.questions;
        setIsLoading(false);

        // Start the interview — speak the first question after a natural pause
        setTimeout(() => {
          if (!cancelled && analysis.questions[0]) {
            askQuestion(analysis.questions[0].question);
          }
        }, 1000);
      } catch (err) {
        console.error("Failed to load questions:", err);
        if (!cancelled) setIsLoading(false);
      }
    }

    loadAndStart();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAll();
    };
  }, [cleanupAll]);

  // ─── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          gap: 24,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "var(--primary-dim)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "pulse 2s infinite",
          }}
        >
          <Icon name="psychology" size={40} style={{ color: "var(--primary)" }} />
        </div>
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 8,
              animation: "fadeUp 0.5s ease both",
            }}
          >
            Preparing Your Interview
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 20 }}>
            {loadingStatus}
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Spinner />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "var(--primary)",
                opacity: 0.3,
                animation: `pulse 1.5s ${i * 0.3}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];
  const displayAnswer = currentAnswer + (interimAnswer ? " " + interimAnswer : "");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      <InterviewHeader
        timeLeft={timeLeft}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length}
      />

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          padding: "24px",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: isSpeaking
              ? "radial-gradient(circle, rgba(5,68,104,0.10) 0%, transparent 70%)"
              : isListening
                ? "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(5,68,104,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
            transition: "background 1s ease",
          }}
        />

        {/* Left: Question list */}
        <div
          style={{
            position: "absolute",
            left: 28,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <QuestionList questions={toDisplayQuestions(questions)} />
        </div>

        {/* Center */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: 660,
          }}
        >
          {/* AI Status indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
              padding: "8px 20px",
              borderRadius: 99,
              fontSize: 14,
              fontWeight: 600,
              background: isSpeaking
                ? "rgba(5,68,104,0.12)"
                : isListening
                  ? "rgba(34,197,94,0.12)"
                  : "rgba(107,143,168,0.12)",
              color: isSpeaking
                ? "var(--primary)"
                : isListening
                  ? "var(--success)"
                  : "var(--muted)",
              transition: "all 0.4s ease",
            }}
          >
            {/* Animated dot */}
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: isSpeaking
                  ? "var(--primary)"
                  : isListening
                    ? "var(--success)"
                    : "var(--muted)",
                animation: "pulse 1.5s infinite",
                flexShrink: 0,
              }}
            />
            <Icon
              name={isSpeaking ? "record_voice_over" : isListening ? "mic" : "smart_toy"}
              size={18}
            />
            {isSpeaking
              ? "Interviewer is asking…"
              : isListening
                ? "Your turn — speak now"
                : "Processing…"}
          </div>

          {/* Fallback button if stuck (e.g. browser blocked auto-speech) */}
          {isStuck && (
            <button
              onClick={() => {
                if (questions[currentQuestionIndex]) {
                  askQuestion(questions[currentQuestionIndex].question);
                }
              }}
              style={{
                marginBottom: 20,
                padding: "10px 24px",
                borderRadius: 99,
                background: "var(--primary)",
                color: "white",
                border: "none",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 4px 12px rgba(5,68,104,0.2)",
              }}
            >
              <Icon name="play_arrow" size={20} />
              Start First Question
            </button>
          )}

          <Waveform heights={waveHeights} />

          {/* Silence countdown indicator (shows only when close to auto-advance) */}
          {silenceCountdown !== null && silenceCountdown <= 10 && isListening && !isSpeaking && (
            <div
              style={{
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 600,
                background: silenceCountdown <= 5
                  ? "rgba(229,62,62,0.10)"
                  : "rgba(249,115,22,0.10)",
                color: silenceCountdown <= 5
                  ? "var(--danger)"
                  : "#f97316",
                animation: "fadeIn 0.3s ease both",
              }}
            >
              <Icon name="timer" size={14} />
              Moving to next question in {silenceCountdown}s…
            </div>
          )}

          <div style={{ marginTop: 24, width: "100%" }}>
            <TranscriptCard
              question={currentQ?.question || "Preparing question..."}
              answer={displayAnswer || (isListening ? "Listening… speak now" : "Waiting…")}
            />
          </div>
        </div>
      </main>

      <InterviewFooter onEnd={onEnd} />
    </div>
  );
};

export default InterviewPage;
