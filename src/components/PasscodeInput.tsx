import React, { useRef, type KeyboardEvent, type ClipboardEvent } from "react";

interface PasscodeInputProps {
  digits: string[];
  onChange: (digits: string[]) => void;
  error?: boolean;
}

const PasscodeInput: React.FC<PasscodeInputProps> = ({ digits, onChange, error = false }) => {
  // Create refs for all 8 inputs
  const refs = Array.from({ length: 8 }, () => useRef<HTMLInputElement>(null));

  const focusNext = (i: number) => refs[i + 1]?.current?.focus();
  const focusPrev = (i: number) => refs[i - 1]?.current?.focus();

  const handleChange = (i: number, val: string) => {
    // Accept alphanumeric only, take the last typed character
    const char = val.replace(/[^a-zA-Z0-9]/g, "").slice(-1).toUpperCase();
    const next = [...digits];
    next[i] = char;
    onChange(next);
    if (char && i < 7) focusNext(i);
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[i]) {
        // Clear current cell
        const next = [...digits];
        next[i] = "";
        onChange(next);
      } else if (i > 0) {
        // Move to previous and clear it
        const next = [...digits];
        next[i - 1] = "";
        onChange(next);
        focusPrev(i);
      }
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && i > 0) {
      focusPrev(i);
    } else if (e.key === "ArrowRight" && i < 7) {
      focusNext(i);
    } else if (e.key === "Enter") {
      // Bubble up via form / parent
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 8);
    const next = Array(8).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    onChange(next);
    const focusIdx = Math.min(pasted.length, 7);
    refs[focusIdx].current?.focus();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
      }}
    >
      {digits.map((d, i) => (
        <React.Fragment key={i}>
          {/* Visual separator between 4th and 5th digit */}
          {i === 4 && (
            <span
              style={{
                color: "var(--muted)",
                fontWeight: 700,
                fontSize: 22,
                margin: "0 4px",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              –
            </span>
          )}
          <input
            ref={refs[i]}
            value={d}
            maxLength={2} // allow 2 so onChange can grab last char
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="characters"
            spellCheck={false}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            onFocus={(e) => e.target.select()}
            style={{
              width: 44,
              height: 54,
              textAlign: "center",
              fontSize: 20,
              fontWeight: 700,
              fontFamily: "var(--mono)",
              letterSpacing: 0,
              textTransform: "uppercase",
              border: "none",
              borderBottom: `2.5px solid ${
                error
                  ? "var(--danger)"
                  : d
                  ? "var(--primary)"
                  : "#c0d4e4"
              }`,
              background: "transparent",
              outline: "none",
              color: "var(--text)",
              borderRadius: 0,
              transition: "border-color 0.2s",
              caretColor: "var(--primary)",
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default PasscodeInput;
