export type Page = "login" | "instructions" | "interview";

export interface Question {
  id: number;
  label: string;
  done: boolean;
  active?: boolean;
}

export interface ChecklistItem {
  label: string;
  sub: string;
  defaultChecked: boolean;
}

export interface ResumeFile {
  file: File;
  fileName: string;
}

/** Carries resume data through all stages */
export interface ResumeData {
  file: File;
  fileName: string;
  extractedText: string;
}
