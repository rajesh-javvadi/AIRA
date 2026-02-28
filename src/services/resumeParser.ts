/**
 * Resume Parser Service
 * Extracts text content from uploaded resume files (PDF text layer, plain text, etc.)
 */

/**
 * Extract text from a File object.
 * Supports: plain text (.txt), and basic PDF text extraction.
 * For a hackathon demo, we use the browser's built-in capabilities.
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".txt") || fileName.endsWith(".md")) {
    return await file.text();
  }

  if (fileName.endsWith(".pdf")) {
    return await extractTextFromPDF(file);
  }

  // For .doc/.docx or unknown types, try reading as text
  try {
    const text = await file.text();
    // Filter out very binary content
    const printableRatio =
      text.split("").filter((c) => c.charCodeAt(0) >= 32 && c.charCodeAt(0) < 127).length /
      text.length;
    if (printableRatio > 0.7) {
      return text;
    }
  } catch {
    // ignore
  }

  return `[Resume file: ${file.name} - Unable to extract text. File type: ${file.type}]`;
}

/**
 * Basic PDF text extraction using pdf.js loaded from CDN
 */
async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Dynamically load pdf.js from CDN
    const pdfjsLib = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const textParts: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: { str?: string }) => item.str || "")
        .join(" ");
      textParts.push(pageText);
    }

    return textParts.join("\n\n") || `[Resume: ${file.name} - No extractable text found in PDF]`;
  } catch (err) {
    console.error("PDF extraction error:", err);
    return `[Resume: ${file.name} - PDF text extraction failed]`;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pdfjsPromise: Promise<any> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadPdfJs(): Promise<any> {
  if (pdfjsPromise) return pdfjsPromise;

  pdfjsPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).pdfjsLib) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve((window as any).pdfjsLib);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lib = (window as any).pdfjsLib;
      if (lib) {
        lib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(lib);
      } else {
        reject(new Error("pdf.js failed to load"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load pdf.js from CDN"));
    document.head.appendChild(script);
  });

  return pdfjsPromise;
}
