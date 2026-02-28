/**
 * AI Interviewer Service
 * Analyzes resume text and generates dynamic interview questions.
 * Uses the Gemini API (Google AI) to generate questions based on resume content.
 */

import type { Question } from "../types";

// ─── Configuration ─────────────────────────────────────────────────────────────
const MISTRAL_API_KEY ="your-api-key";
const MISTRAL_MODEL = "mistral-small-latest";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface InterviewQuestion {
    id: number;
    label: string;     // short category label
    question: string;  // the full question text
    done: boolean;
    active?: boolean;
}

export interface ResumeAnalysis {
    candidateName: string;
    skills: string[];
    experience: string;
    questions: InterviewQuestion[];
}

// ─── Question Generation ───────────────────────────────────────────────────────

/**
 * Analyze resume text and generate tailored interview questions via Ollama
 */
export async function analyzeResumeAndGenerateQuestions(
    resumeText: string,
    role: string = "Software Engineer"
): Promise<ResumeAnalysis> {
    try {
        const prompt = buildPrompt(resumeText, role);
        const responseText = await callMistralAPI(prompt);
        return parseAIResponse(responseText);
    } catch (error) {
        console.error("AI analysis failed, using fallback questions:", error);
        return generateFallbackAnalysis(resumeText);
    }
}

function buildPrompt(resumeText: string, role: string): string {
    return `You are a real, experienced technical interviewer conducting a live voice interview. You speak directly and naturally — like a human having a face-to-face conversation, NOT like a robot reading from a list.

Analyze the following resume and generate exactly 10 personalized interview questions for the role of "${role}".

RESUME:
${resumeText}

Respond ONLY with valid JSON in exactly this format:
{
  "candidateName": "Name from resume",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": "Brief summary of experience level",
  "questions": [
    {
      "id": 1,
      "label": "Introduction",
      "question": "Warm, casual ice-breaker question"
    },
    ...
  ]
}

CRITICAL RULES:
- Provide ONLY the JSON object. No markdown, no "here is the json".
- Use the candidate's name naturally in questions.
- Maintain a conversational, direct interviewer tone.
- Questions should be progressively more challenging.
- Reference specific technologies/companies from the resume.`;
}

async function callMistralAPI(prompt: string): Promise<string> {
    const response = await fetch(MISTRAL_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${MISTRAL_API_KEY}`,
            "Accept": "application/json"
        },
        body: JSON.stringify({
            model: MISTRAL_MODEL,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 2048,
        }),
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Mistral API error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
        throw new Error("Empty response from Mistral API");
    }

    return text;
}

function parseAIResponse(responseText: string): ResumeAnalysis {
    // 1. More robust JSON cleaning: find the first { and last }
    let cleaned = responseText.trim();
    const startBracket = cleaned.indexOf('{');
    const endBracket = cleaned.lastIndexOf('}');

    if (startBracket !== -1 && endBracket !== -1) {
        cleaned = cleaned.substring(startBracket, endBracket + 1);
    }

    const parsed = JSON.parse(cleaned);

    return {
        candidateName: parsed.candidateName || "Candidate",
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        experience: parsed.experience || "Not specified",
        questions: (Array.isArray(parsed.questions) ? parsed.questions : []).map(
            (q: { id: number; label: string; question: string }, idx: number) => ({
                id: q.id || idx + 1,
                label: q.label || "Question",
                question: q.question || "Tell me more about your experience.",
                done: false,
                active: idx === 0,
            })
        ),
    };
}

function generateFallbackAnalysis(resumeText: string): ResumeAnalysis {
    // Extract a rough name from the first line or use a default
    const firstLine = resumeText.split("\n")[0]?.trim() || "Candidate";
    const name = firstLine.length > 30 ? "there" : firstLine;

    const fallbackQuestions: InterviewQuestion[] = [
        {
            id: 1,
            label: "Introduction",
            question: `Hi ${name}, it's great to meet you! I've been looking over your profile and I'm really impressed with your background. To kick things off, why don't you tell me a bit about your journey in frontend engineering and what you're most passionate about building?`,
            done: false,
            active: true
        },
        {
            id: 2,
            label: "Technical Choice",
            question: "I see you've worked with a lot of modern frameworks. If you were starting a complex, high-traffic web application from scratch today, what would be your go-to tech stack, and why?",
            done: false
        },
        {
            id: 3,
            label: "Performance",
            question: "When we're talking about large-scale apps, performance and Core Web Vitals are always top of mind. What's your personal checklist for ensuring a web app stays snappy and performant as it scales?",
            done: false
        },
        {
            id: 4,
            label: "System Design",
            question: "Could you walk me through how you'd design a robust state management system for a dashboard that handles real-time data? I'd love to hear your thoughts on when to use global state versus keeping it local.",
            done: false
        },
        {
            id: 5,
            label: "Collaboration",
            question: "Engineering is a team sport. Tell me about a time you had a significant technical disagreement with a colleague. How did you handle that, and what was the eventual outcome?",
            done: false
        },
        {
            id: 6,
            label: "Accessibility",
            question: "Accessibility is often overlooked but it's crucial. How do you integrate accessibility into your development workflow? What are the key patterns you follow to ensure your UIs are usable for everyone?",
            done: false
        },
        {
            id: 7,
            label: "Testing Strategy",
            question: "What's your philosophy when it comes to testing? How do you strike the right balance between unit, integration, and end-to-end tests for a frontend project?",
            done: false
        },
        {
            id: 8,
            label: "Code Quality",
            question: "In a fast-moving environment, technical debt can pile up quickly. How do you approach code reviews and maintain high standards for code quality while still meeting tight deadlines?",
            done: false
        },
        {
            id: 9,
            label: "Future Tech",
            question: "The frontend world moves so fast. Is there a specific technology or architectural pattern that you've been keeping an eye on recently? Something you think might change the way we build web apps?",
            done: false
        },
        {
            id: 10,
            label: "Closing",
            question: "This has been a really insightful conversation. To wrap up, where do you see yourself growing over the next couple of years, and what kind of impact are you looking to make in your next role?",
            done: false
        },
    ];

    return {
        candidateName: name,
        skills: ["React", "TypeScript", "System Design", "Performance"],
        experience: "Analyzed (Fallback)",
        questions: fallbackQuestions,
    };
}

// Keep a reference to prevent garbage collection in some browsers
let currentUtterance: SpeechSynthesisUtterance | null = null;

export async function speakText(text: string): Promise<void> {
    console.log("[Voice] Request to speak:", text);

    if (!("speechSynthesis" in window)) {
        console.error("[Voice] Speech synthesis NOT supported");
        return;
    }

    // Ensure voices are loaded
    let voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
        console.log("[Voice] No voices found yet, waiting...");
        await new Promise<void>((resolve) => {
            const handler = () => {
                window.speechSynthesis.onvoiceschanged = null;
                voices = window.speechSynthesis.getVoices();
                console.log("[Voice] Voices loaded, count:", voices.length);
                resolve();
            };
            window.speechSynthesis.onvoiceschanged = handler;
            setTimeout(() => {
                console.log("[Voice] Voice load timeout (1s)");
                handler();
            }, 1000);
        });
    }

    return new Promise((resolve) => {
        console.log("[Voice] Preparing to speak...");
        window.speechSynthesis.cancel();

        // Small delay ensures previous cancel completes
        setTimeout(() => {
            currentUtterance = new SpeechSynthesisUtterance(text);
            currentUtterance.rate = 1.0;
            currentUtterance.pitch = 1.0;
            currentUtterance.volume = 1.0;

            const selectedVoice = voices.find(
                (v) =>
                    (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Premium")) &&
                    v.lang.startsWith("en")
            ) || voices.find(v => v.lang.startsWith("en")) || voices[0];

            if (selectedVoice) {
                currentUtterance.voice = selectedVoice;
            }

            // Safety timeout: if start event doesn't fire in 2s, resolve anyway
            // to prevent blocking the interview flow.
            const safetyTimer = setTimeout(() => {
                console.warn("[Voice] Speech start timeout - resolving anyway");
                resolve();
            }, 5000);

            currentUtterance.onstart = () => {
                console.log("[Voice] Speech started");
            };

            currentUtterance.onend = () => {
                console.log("[Voice] Speech ended");
                clearTimeout(safetyTimer);
                currentUtterance = null;
                resolve();
            };

            currentUtterance.onerror = (e) => {
                console.error("[Voice] Speech error:", e);
                clearTimeout(safetyTimer);
                currentUtterance = null;
                resolve();
            };

            window.speechSynthesis.speak(currentUtterance);

            // In some browsers, we need to call resume() to start
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
            }
        }, 200);
    });
}

/**
 * Stop any ongoing speech
 */
export function stopSpeaking(): void {
    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }
}

// ─── Speech Recognition (Listening) ────────────────────────────────────────────

export interface SpeechRecognitionResult {
    transcript: string;
    isFinal: boolean;
}

/**
 * Create a speech recognition instance for listening to the user
 */
export function createSpeechRecognition(
    onResult: (result: SpeechRecognitionResult) => void,
    onEnd: () => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.warn("Speech recognition not supported in this browser");
        return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        if (finalTranscript) {
            onResult({ transcript: finalTranscript, isFinal: true });
        } else if (interimTranscript) {
            onResult({ transcript: interimTranscript, isFinal: false });
        }
    };

    recognition.onend = onEnd;

    return recognition;
}

// ─── Convert Question to types/Question for QuestionList ───────────────────────
export function toDisplayQuestions(questions: InterviewQuestion[]): Question[] {
    return questions.map((q) => ({
        id: q.id,
        label: q.label,
        done: q.done,
        active: q.active,
    }));
}
