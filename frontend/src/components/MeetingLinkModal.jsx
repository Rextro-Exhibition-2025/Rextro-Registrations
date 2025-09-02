import React from "react";
import "./MeetingLinkModal.css";

const MeetingLinkModal = ({ isOpen, onClose, title, link }) => {
  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link || "");
      alert("Link copied to clipboard");
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
          <p className="long-description">Use the link below to join:</p>
          <div className="link-box">
            <input className="link-input" readOnly value={link || "No link provided"} />
            <button className="copy-btn" onClick={handleCopy}>Copy</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingLinkModal;
