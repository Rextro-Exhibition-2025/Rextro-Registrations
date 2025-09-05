import React from "react";
import "./RegistrationModal.css";

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
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header Section */}
        <div className="modal-header">
          <div className="header-content">
            <div className="event-type-badge">
              {event.type || 'Event'}
            </div>
            <h1 className="event-title">{event.title}</h1>
          </div>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Hero Image Section */}
        {event.image && (
          <div className="hero-section">
            <div className="image-wrapper">
              <img 
                src={`/events/${event.image}`} 
                alt={event.title}
                className="hero-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="image-overlay"></div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="modal-content">
          {/* Event Info Cards */}
          <div className="info-cards">
            <div className="info-card">
              <div className="card-icon">📅</div>
              <div className="card-content">
                <div className="card-label">Date</div>
                <div className="card-value">{formatDate(event.eventDate)}</div>
              </div>
            </div>
            
            <div className="info-card">
              <div className="card-icon">🕒</div>
              <div className="card-content">
                <div className="card-label">Time</div>
                <div className="card-value">
                  {formatTime(event.eventTime, event.startTime, event.endTime)}
                </div>
              </div>
            </div>

            {event.speakers && (
              <div className="info-card">
                <div className="card-icon">👥</div>
                <div className="card-content">
                  <div className="card-label">Speaker</div>
                  <div className="card-value">{event.speakers}</div>
                </div>
              </div>
            )}
          </div>

          {/* Event Description */}
          {event.longDescription && (
            <div className="content-section">
              <div className="section-header">
                <div className="section-icon">📝</div>
                <h3 className="section-title">About This Event</h3>
              </div>
              <div className="section-content">
                <p className="event-description">{event.longDescription}</p>
              </div>
            </div>
          )}

          {/* Speaker Information */}
          {event.speakerDescriptions && (
            <div className="content-section">
              <div className="section-header">
                <div className="section-icon">👨‍🏫</div>
                <h3 className="section-title">About the Speaker</h3>
              </div>
              <div className="section-content">
                <div className="speaker-info">
                  {event.speakerDescriptions.split(" | ").map((desc, index) => {
                    const lines = desc.split("\n");
                    const name = lines[0];
                    const qualification = lines[1] || "";

                    return (
                      <div key={index} className="speaker-card">
                        <div className="speaker-avatar">
                          <span className="avatar-initial">{name.charAt(0)}</span>
                        </div>
                        <div className="speaker-details">
                          <h4 className="speaker-name">{name}</h4>
                          {qualification && (
                            <p className="speaker-qualification">{qualification}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Competition Registration Info */}
          {event.type && event.type.toLowerCase() === "competition" && (
            <div className="content-section">
              <div className="section-header">
                <div className="section-icon">📋</div>
                <h3 className="section-title">Registration Information</h3>
              </div>
              <div className="section-content">
                <div className="registration-timeline">
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <h4 className="timeline-title">Registration Opens</h4>
                      <p className="timeline-date">{formatDate(event.registrationOpenDate)}</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <h4 className="timeline-title">Registration Closes</h4>
                      <p className="timeline-date">{formatDate(event.registrationCloseDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Section */}
        <div className="modal-footer">
          <button className="register-button" onClick={onRegister}>
            <span className="button-icon">🚀</span>
            <span className="button-text">Register Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;