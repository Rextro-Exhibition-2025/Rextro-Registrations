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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-title-section">
          <h2 className="modal-title">{event.title}</h2>
        </div>

        <div className="modal-body">
          <div className="event-details">
            <div className="event-info-grid">
              <div className="info-item">
                <span className="info-label">📅 Date:</span>
                <span className="info-value">
                  {formatDate(event.eventDate)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">🕒 Time:</span>
                <span className="info-value">
                  {formatTime(event.eventTime, event.startTime, event.endTime)}
                </span>
              </div>
              {event.speakers && (
                <div className="info-item">
                  <span className="info-label">👥 Speaker:</span>
                  <span className="info-value">{event.speakers}</span>
                </div>
              )}
            </div>

            {event.longDescription && (
              <div className="description-section">
                <h3>📝 About This Event</h3>
                <p className="long-description">{event.longDescription}</p>
              </div>
            )}

            {event.speakerDescriptions && (
              <div className="speakers-section">
                <h3>👥 About the Speaker</h3>
                <div className="speaker-details">
                  {event.speakerDescriptions.split(" | ").map((desc, index) => {
                    const lines = desc.split("\n");
                    const name = lines[0];
                    const qualification = lines[1] || "";

                    return (
                      <div key={index} className="speaker-detail-item">
                        <div className="speaker-name">{name}</div>
                        {qualification && (
                          <div className="speaker-qualification">
                            {qualification}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {event.type && event.type.toLowerCase() === "competition" && (
              <div className="registration-info">
                <h3>📋 Registration Information</h3>
                <div className="date-info">
                  <div className="date-item">
                    <strong>Registration Opens:</strong>{" "}
                    {formatDate(event.registrationOpenDate)}
                  </div>
                  <div className="date-item">
                    <strong>Registration Closes:</strong>{" "}
                    {formatDate(event.registrationCloseDate)}
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
