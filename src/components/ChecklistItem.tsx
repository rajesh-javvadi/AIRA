import React from "react";
import { Icon } from "./UI";

interface ChecklistItemProps {
  label: string;
  sub: string;
  checked: boolean;
  onToggle: () => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  label,
  sub,
  checked,
  onToggle,
}) => (
  <label className="check-item" onClick={onToggle}>
    <div className={`check-box ${checked ? "checked" : ""}`}>
      {checked && (
        <Icon name="check" size={14} style={{ color: "#fff" }} />
      )}
    </div>
    <div>
      <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 13, color: "var(--muted)" }}>{sub}</p>
    </div>
  </label>
);

export default ChecklistItem;
