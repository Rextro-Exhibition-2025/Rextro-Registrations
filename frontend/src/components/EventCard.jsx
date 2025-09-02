import React from "react";
import "./EventCard.css";

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

const EventCard = ({
  image,
  title,
  eventDate,
  eventTime,
  venue,
  speakers,
  society,
  type,
  meetingLink,
  onRegisterClick,
  onMeetingLinkClick,
}) => {
  const canShowMeetingLink = (() => {
    if (!eventDate) return false;
    if (!meetingLink) return false;
    if (!type) return false;
    const lower = String(type).toLowerCase();
    if (lower !== "session" && lower !== "workshop") return false;
    try {
      const today = new Date();
      const evDate = new Date(eventDate);
      // Only show for events in the future or today, and within 2 days before the event
      const msDiff = evDate.setHours(0,0,0,0) - today.setHours(0,0,0,0);
      const daysDiff = msDiff / (1000 * 60 * 60 * 24);
      return daysDiff <= 2 && daysDiff >= 0;
    } catch {
      return false;
    }
  })();

  const meetingButtonLabel = String(type).toLowerCase() === "workshop" ? "Workshop link" : "Webinar link";

  return (
    <div className="event-card">
      <img src={getImageSrc(image)} alt={title} className="event-image" />
      <div className="event-content">
        <h2 className="event-title">{title}</h2>
        <p className="event-date">📅 {eventDate}</p>
        <p className="event-time">🕒 {eventTime}</p>
        <p className="event-venue">📍 {venue}</p>
        <p className="event-speakers">👥 {speakers}</p>
        <p className="event-society">🏛️ {society}</p>
        <div className="event-buttons">
          <button className="event-button" onClick={onRegisterClick}>
            View Event
          </button>
          {canShowMeetingLink && (
            <button
              className="event-button"
              onClick={() => onMeetingLinkClick && onMeetingLinkClick({ link: meetingLink, title })}
              style={{ backgroundColor: "#6b7280" }}
            >
              {meetingButtonLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
