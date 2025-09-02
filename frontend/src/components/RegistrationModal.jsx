import React from "react";
import "./RegistrationModal.css";

// Helper function to get image source
const getImageSrc = (imageUrl) => {
  // If it's just a filename (local image), construct the path
  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
    // For local images, use the public path
    return `/events/${imageUrl}`;
  }
  
  // If it's a full URL, return as is
  return imageUrl;
};

const RegistrationModal = ({ event, isOpen, onClose, onRegister }) => {
  if (!isOpen || !event) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Not specified";
    return timeString;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="modal-header">
          <img src={getImageSrc(event.image)} alt={event.title} className="modal-image" />
          <h2 className="modal-title">{event.title}</h2>
        </div>

        <div className="modal-body">
          <div className="event-details">
            <div className="event-info-grid">
              <div className="info-item">
                <span className="info-label">📅 Date:</span>
                <span className="info-value">{formatDate(event.eventDate)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">🕒 Time:</span>
                <span className="info-value">{formatTime(event.eventTime)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">📍 Venue:</span>
                <span className="info-value">{event.venue || "Not specified"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">🏛️ Society:</span>
                <span className="info-value">{event.society}</span>
              </div>
            </div>

            <div className="speakers-section">
              <h3>👥 Speakers</h3>
              <p className="speakers-names">{event.speakers || "Not specified"}</p>
              {event.speakerDescriptions && (
                <div className="speaker-descriptions">
                  <h4>About the Speakers:</h4>
                  <p>{event.speakerDescriptions}</p>
                </div>
              )}
            </div>

            <div className="description-section">
              <h3>📝 Event Description</h3>
              <p className="long-description">{event.longDescription || "No description available"}</p>
            </div>
            
            {event.type && event.type.toLowerCase() === "competition" && (
              <div className="registration-info">
                <h3>📋 Registration Information</h3>
                <div className="date-info">
                  <div className="date-item">
                    <strong>Registration Opens:</strong> {formatDate(event.registrationOpenDate)}
                  </div>
                  <div className="date-item">
                    <strong>Registration Closes:</strong> {formatDate(event.registrationCloseDate)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="register-btn" onClick={onRegister}>
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
