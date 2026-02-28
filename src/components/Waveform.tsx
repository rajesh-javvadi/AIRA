import React from "react";

interface WaveformProps {
  heights: number[];
  maxHeight?: number;
}

const Waveform: React.FC<WaveformProps> = ({ heights, maxHeight = 192 }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      gap: 5,
      height: 120,
      width: "100%",
    }}
  >
    {heights.map((h, i) => {
      const normalized = (h / maxHeight) * 110 + 4;
      const opacity = 0.3 + (h / maxHeight) * 0.7;
      const isLoud = h > 150;
      return (
        <div
          key={i}
          style={{
            width: 8,
            height: normalized,
            background: `rgba(5,68,104,${opacity})`,
            borderRadius: 99,
            transition: "height 0.18s ease",
            boxShadow: isLoud ? "0 0 14px rgba(5,68,104,0.4)" : "none",
            flexShrink: 0,
          }}
        />
      );
    })}
  </div>
);

export default Waveform;
