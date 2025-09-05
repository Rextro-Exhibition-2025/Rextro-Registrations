import React from "react";
import "./SuccessMessage.css";

const SuccessMessage = ({ isOpen, onClose, eventTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="success-overlay" onClick={onClose}>
      <div className="success-container" onClick={(e) => e.stopPropagation()}>
        {/* Success Icon */}
        <div className="success-icon-container">
          <div className="success-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path 
                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Success Content */}
        <div className="success-content">
          <h2 className="success-title">Registration Successful!</h2>
          <p className="success-message">
            Your registration for <strong>"{eventTitle}"</strong> has been submitted successfully.
          </p>
          <p className="success-details">
            You will receive a confirmation email with further details about the event.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="success-actions">
          <button className="success-button primary" onClick={onClose}>
            <span className="button-icon">🎉</span>
            <span className="button-text">Awesome!</span>
          </button>
        </div>

        {/* Close Button */}
        <button className="success-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;
