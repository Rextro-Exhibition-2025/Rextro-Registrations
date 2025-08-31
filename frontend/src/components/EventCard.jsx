import React from "react";
import "./EventCard.css";

const EventCard = ({
  image,
  title,
  shortDescription,
  eventDate,
  department,
  society,
  onRegisterClick,
}) => {
  return (
    <div className="event-card">
      <img src={image} alt={title} className="event-image" />
      <div className="event-content">
        <h2 className="event-title">{title}</h2>
        <p className="event-desc">{shortDescription}</p>
        <p className="event-meta">
          <strong>Dept:</strong> {department}
        </p>
        <p className="event-meta">
          <strong>Society:</strong> {society}
        </p>
        <p className="event-date">📅 {eventDate}</p>
        <button className="event-button" onClick={onRegisterClick}>
          Register Now
        </button>
      </div>
    </div>
  );
};

export default EventCard;
