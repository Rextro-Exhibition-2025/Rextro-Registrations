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

  const formatTime = (timeString, startTime, endTime) => {
    if (timeString) return timeString;
    if (startTime && endTime) return `${startTime} - ${endTime}`;
    if (startTime) return startTime;
    return "Not specified";
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        
        <div className="modal-header">
          <img src={getImageSrc(event.image)} alt={event.title} className="modal-image" />
        </div>
        
        <div className="modal-title-section">
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
                <span className="info-value">{formatTime(event.eventTime, event.startTime, event.endTime)}</span>
              </div>
            </div>

            <div className="speakers-section">
              <h3>👥 Speakers</h3>
              <p className="speakers-names">{event.speakers || "Not specified"}</p>
              {event.speakerDescriptions && (
                <div className="speaker-descriptions">
                  <h4>About the Speakers:</h4>
                  <div className="speaker-details">
                    {event.speakerDescriptions.split(" | ").map((desc, index) => {
                      const lines = desc.split('\n');
                      const name = lines[0];
                      const qualification = lines[1] || '';
                      
                      return (
                        <div key={index} className="speaker-detail-item">
                          <div className="speaker-name">{name}</div>
                          {qualification && <div className="speaker-qualification">{qualification}</div>}
                        </div>
                      );
                    })}
                  </div>
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
