import React, { useState } from "react";
import globalStyles from "./styles/global";
import LoginPage from "./pages/LoginPage";
import InstructionsPage from "./pages/InstructionsPage";
import InterviewPage from "./pages/InterviewPage";
import type { Page, ResumeData } from "./types";


const App: React.FC = () => {
  const [page, setPage] = useState<Page>("login");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  const onSuccess = (data: ResumeData | null) => {
    setResumeData(data);
    setPage("instructions");
  }

  const handleLogout = () => {
    setResumeData(null);
    setPage("login");
  }

  return (
    <>
      <style>{globalStyles}</style>

      {page === "login" && (
        <LoginPage onSuccess={onSuccess} />
      )}

      {page === "instructions" && (
        <InstructionsPage
          resumeData={resumeData}
          onStart={() => setPage("interview")}
        />
      )}

      {page === "interview" && (
        <InterviewPage resumeData={resumeData} onEnd={handleLogout} />
      )}
    </>
  );
};

export default App;
