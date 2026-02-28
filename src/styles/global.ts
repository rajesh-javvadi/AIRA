const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --primary: #054468;
    --primary-light: #0a6fa8;
    --primary-dim: rgba(5,68,104,0.12);
    --bg: #f0f7ff;
    --surface: #ffffff;
    --border: rgba(5,68,104,0.12);
    --text: #0d1f2d;
    --muted: #6b8fa8;
    --danger: #e53e3e;
    --success: #22c55e;
    --font: 'DM Sans', sans-serif;
    --mono: 'DM Mono', monospace;
  }

  html, body, #root { height: 100%; }

  body {
    font-family: var(--font);
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-smoothing: antialiased;
    user-select: none;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .anim-fade-up   { animation: fadeUp 0.5s 0.00s ease both; }
  .anim-fade-up-1 { animation: fadeUp 0.5s 0.06s ease both; }
  .anim-fade-up-2 { animation: fadeUp 0.5s 0.12s ease both; }
  .anim-fade-up-3 { animation: fadeUp 0.5s 0.18s ease both; }
  .anim-fade-up-4 { animation: fadeUp 0.5s 0.24s ease both; }
  .anim-fade-up-5 { animation: fadeUp 0.5s 0.30s ease both; }
  .anim-fade      { animation: fadeIn 0.3s ease both; }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--primary); color: #fff;
    border: none; border-radius: 12px;
    font-family: var(--font); font-size: 16px; font-weight: 600;
    padding: 14px 32px; cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(5,68,104,0.25);
  }
  .btn-primary:hover  { background: #065480; box-shadow: 0 6px 28px rgba(5,68,104,0.35); }
  .btn-primary:active { transform: scale(0.97); }
  .btn-primary:disabled { background: rgba(5,68,104,0.3); cursor: not-allowed; box-shadow: none; transform: none; }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--surface); color: var(--text);
    border: 1.5px solid var(--border); border-radius: 12px;
    font-family: var(--font); font-size: 14px; font-weight: 500;
    padding: 10px 20px; cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }
  .btn-ghost:hover { background: var(--bg); border-color: var(--primary-light); }

  .btn-danger {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--danger); color: #fff;
    border: none; border-radius: 12px;
    font-family: var(--font); font-size: 14px; font-weight: 700;
    padding: 10px 24px; cursor: pointer;
    transition: background 0.2s;
    box-shadow: 0 4px 16px rgba(229,62,62,0.3);
  }
  .btn-danger:hover { background: #c53030; }

  .card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 20px;
    box-shadow: 0 2px 24px rgba(5,68,104,0.06);
  }

  .check-item {
    display: flex; align-items: flex-start; gap: 16px;
    padding: 16px 20px; border-radius: 14px; cursor: pointer;
    border: 1.5px solid transparent;
    transition: background 0.2s, border-color 0.2s;
  }
  .check-item:hover { background: var(--bg); border-color: var(--border); }

  .check-box {
    width: 22px; height: 22px; flex-shrink: 0;
    border: 2px solid #c0d4e4; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, border-color 0.2s;
    margin-top: 2px;
  }
  .check-box.checked { background: var(--primary); border-color: var(--primary); }
`;

export default globalStyles;
