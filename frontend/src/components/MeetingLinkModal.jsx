import React, { useState } from "react";
import "./MeetingLinkModal.css";

const MeetingLinkModal = ({ isOpen, onClose, title, link }) => {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
      alert("Failed to copy link");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
        </div>
        <div className="modal-body">
          <div className="meeting-icon">🎥</div>
          <p className="long-description">Ready to join? Copy the meeting link below:</p>
          <div className="link-box">
            <input className="link-input" readOnly value={link || "No link provided"} />
            <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingLinkModal;
