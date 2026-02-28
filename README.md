# AIRA - AI Interviewer Assistant

**AIRA** (AI Interviewer Assistant) is a premium, voice-enabled web application designed to help candidates prepare for technical interviews. By leveraging the **Mistral AI** engine and the **Web Speech API**, AIRA conducts realistic, conversational interviews tailored to a candidate's specific resume and the target role.

---

## ✨ Key Features

- 🎙️ **Voice-First Interaction**: Conducts interviews using high-quality text-to-speech and real-time speech recognition for a natural conversational experience.
- 📄 **Resume-Tailored Questions**: Analyzes uploaded resume text to generate personalized technical and behavioral questions using the **Mistral-Small** model.
- ⏱️ **Real-time Interview Flow**: A structured 15-minute interview process including an introduction, technical deep-dives, and behavioral questions.
- 📜 **Live Transcription**: Displays a rolling transcript and captions of the conversation for better accessibility and review.
- 📊 **Progressive Difficulty**: Questions are dynamically generated to be increasingly challenging as the interview progresses.
- 🔒 **Secure Access**: Simple 8-digit passcode authentication to ensure interview sessions are controlled.

---

## 🚀 Tech Stack

- **Frontend**: [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **AI Engine**: [Mistral AI API](https://mistral.ai/) (Mistral-Small-Latest)
- **Voice Services**: [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) (SpeechSynthesis & SpeechRecognition)
- **Styling**: Vanilla CSS with modern Glassmorphism aesthetics
- **Routing**: [React Router 7](https://reactrouter.com/)

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A browser that supports the Web Speech API (Chrome/Edge recommended)
- A Mistral AI API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd aira-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API Key**:
   The application currently uses a hardcoded Mistral API key in `src/services/aiInterviewer.ts` for demonstration purposes. For production, it is recommended to use environment variables (`.env`).

4. **Run the development server**:
   ```bash
   npm run dev
   ```

### Credentials

For the demonstration, you can use the following passcode:
- **Passcode**: `AIRA2024`

---

## 📖 Project Structure

```text
aira-app/
├── src/
│   ├── components/       # Reusable UI components (Waveform, Sidebar, etc.)
│   ├── pages/            # Main application views (Login, Instructions, Interview)
│   ├── services/         # AI and Voice logic (Mistral integration, Speech API)
│   ├── styles/           # Global styles and design system
│   ├── types/            # TypeScript interfaces
│   ├── App.tsx           # Root component and routing
│   └── main.tsx          # Application entry point
├── public/               # Static assets
└── vite.config.ts        # Vite configuration
```

---

## 🚦 Usage Flow

1. **Login**: Enter the 8-digit passcode to access the system.
2. **Setup**: Read the interview instructions and ensure your microphone/speakers are working.
3. **The Interview**:
   - The AI will greet you and ask questions based on your resume.
   - Speak naturally; the system will detect your speech and provide the next question.
   - Monitor the progress bar and timer on the dashboard.
4. **Conclusion**: After 15 minutes or 10 questions, the interview will automatically conclude.

---

## 📄 License

This project is developed for hackathon/educational purposes. See the license file for more details.

---

*Built with ❤️ for better interview preparation.*
