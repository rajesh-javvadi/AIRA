import React, { type CSSProperties } from "react";

// ─── Icon ─────────────────────────────────────────────────────────────────────
interface IconProps {
  name: string;
  size?: number;
  style?: CSSProperties;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, style = {} }) => (
  <span
    className="material-symbols-outlined"
    style={{ fontSize: size, ...style }}
  >
    {name}
  </span>
);

// ─── AiraLogo ─────────────────────────────────────────────────────────────────
interface AiraLogoProps {
  size?: number;
}

export const AiraLogo: React.FC<AiraLogoProps> = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="#054468">
    <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" />
  </svg>
);

// ─── Spinner ──────────────────────────────────────────────────────────────────
export const Spinner: React.FC = () => (
  <span
    style={{
      width: 18,
      height: 18,
      border: "2.5px solid rgba(255,255,255,0.35)",
      borderTopColor: "#fff",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
      display: "block",
      flexShrink: 0,
    }}
  />
);

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  style?: CSSProperties;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, style, className = "" }) => (
  <div className={`card ${className}`} style={style}>
    {children}
  </div>
);

// ─── StatusDot ────────────────────────────────────────────────────────────────
interface StatusDotProps {
  color?: string;
  pulse?: boolean;
}

export const StatusDot: React.FC<StatusDotProps> = ({
  color = "var(--success)",
  pulse = true,
}) => (
  <span
    style={{
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: color,
      display: "inline-block",
      animation: pulse ? "pulse 1.5s infinite" : undefined,
      flexShrink: 0,
    }}
  />
);
