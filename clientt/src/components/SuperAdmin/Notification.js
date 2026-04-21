import React from "react";

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconAlert = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const Notification = ({ message, onClose }) => {
  if (!message?.text) return null;

  return (
    <div className={`nt-toast nt-toast--${message.type}`} role="alert">
      {message.type === "success" ? <IconCheck /> : <IconAlert />}
      <span>{message.text}</span>
      {onClose && (
        <button className="nt-close" onClick={onClose} aria-label="Close">×</button>
      )}
    </div>
  );
};

export default Notification;