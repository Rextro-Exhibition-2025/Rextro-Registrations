import React from "react";
import "./MessagePopup.css";

const MessagePopup = ({ isOpen, type, title, message, onClose }) => {
  console.log("MessagePopup props:", { isOpen, type, title, message });
  
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'network':
        return '🌐';
      case 'server':
        return '🔧';
      default:
        return 'ℹ️';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
      case 'network':
      case 'server':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <div className="message-popup-overlay" onClick={onClose}>
      <div className="message-popup-container" onClick={(e) => e.stopPropagation()}>
        <div className={`message-popup ${type}`}>
          <div className="popup-header">
            <div className="popup-icon">{getIcon()}</div>
            <h3 className="popup-title">{title}</h3>
            <button className="popup-close" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div className="popup-content">
            <p className="popup-message">{message}</p>
          </div>
          
          <div className="popup-footer">
            <button className={`popup-button ${getButtonColor()}`} onClick={onClose}>
              {type === 'success' ? 'Great!' : 'Got it'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePopup;
