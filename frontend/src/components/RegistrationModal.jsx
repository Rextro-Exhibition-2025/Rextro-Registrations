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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="modal-header">
          <img src={event.image} alt={event.title} className="modal-image" />
          <h2 className="modal-title">{event.title}</h2>
        </div>

        <div className="modal-body">
          <div className="event-details">
            <h3>Event Details</h3>
            <p className="long-description">{event.longDescription}</p>
            
            <div className="date-info">
              <div className="date-item">
                <strong>Registration Opens:</strong> {formatDate(event.registrationOpenDate)}
              </div>
              <div className="date-item">
                <strong>Registration Closes:</strong> {formatDate(event.registrationCloseDate)}
              </div>
              <div className="date-item">
                <strong>Event Date:</strong> {formatDate(event.eventDate)}
              </div>
            </div>

            <div className="event-meta">
              <span><strong>Type:</strong> {event.type}</span>
              <span><strong>Department:</strong> {event.department}</span>
              <span><strong>Society:</strong> {event.society}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="register-btn" onClick={onRegister}>
            Proceed to Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
