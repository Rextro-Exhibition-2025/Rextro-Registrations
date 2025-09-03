import React, { useEffect } from "react";
import "./SuccessModal.css";

const SuccessModal = ({ isOpen, onClose, title, message }) => {
  useEffect(() => {
    if (isOpen) {
      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">
          <div className="success-checkmark">
            <div className="check-icon">
              <span className="icon-line line-tip"></span>
              <span className="icon-line line-long"></span>
              <div className="icon-circle"></div>
              <div className="icon-fix"></div>
            </div>
          </div>
        </div>
        
        <div className="success-content">
          <h2 className="success-title">{title || "Success!"}</h2>
          <p className="success-message">{message || "Operation completed successfully!"}</p>
        </div>
        
        <div className="success-actions">
          <button className="success-close-btn" onClick={onClose}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
