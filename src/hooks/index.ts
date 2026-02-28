import { useState, useEffect, useRef } from "react";

// ─── useCountdown ─────────────────────────────────────────────────────────────
export function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    ref.current = window.setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (ref.current !== null) clearInterval(ref.current);
    };
  }, []);

  return seconds;
}

// ─── useWaveform ──────────────────────────────────────────────────────────────
const INITIAL_HEIGHTS = [32, 60, 90, 120, 150, 192, 168, 136, 108, 76, 48, 24, 54, 100, 130, 162, 116, 70];

export function useWaveform(intervalMs = 180) {
  const [heights, setHeights] = useState<number[]>(INITIAL_HEIGHTS);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeights(INITIAL_HEIGHTS.map(() => Math.floor(Math.random() * 168) + 12));
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return heights;
}
