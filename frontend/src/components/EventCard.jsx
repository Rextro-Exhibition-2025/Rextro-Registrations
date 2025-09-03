import React from "react";
import "./EventCard.css";

// Helper function to get image source
const getImageSrc = (imageUrl) => {
  // If it's just a filename (local image), construct the path
  if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
    // For local images, use the public path
    return `/events/${imageUrl}`;
  }

  // If it's a full URL, return as is
  return imageUrl;
};

// Helper function to get event status
const getEventStatus = (eventDate) => {
  if (!eventDate) return null;

  try {
    const today = new Date();
    const evDate = new Date(eventDate);
    today.setHours(0, 0, 0, 0);
    evDate.setHours(0, 0, 0, 0);

    const diffTime = evDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "ended";
    if (diffDays === 0) return "live";
    return "upcoming";
  } catch {
    return null;
  }
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "TBA";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

// Helper function to format time
const formatTime = (timeString) => {
  if (!timeString) return "TBA";
  return timeString;
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
  const eventStatus = getEventStatus(eventDate);

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
      const msDiff = evDate.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
      const daysDiff = msDiff / (1000 * 60 * 60 * 24);
      return daysDiff <= 2 && daysDiff >= 0;
    } catch {
      return false;
    }
  })();

  const meetingButtonLabel =
    String(type).toLowerCase() === "workshop"
      ? "Workshop Link"
      : "Webinar Link";

  return (
    <div className="event-card">
      {/* Event Image with Overlay */}
      <div className="event-image-container">
        <img
          src={getImageSrc(image)}
          alt={title}
          className="event-image"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="event-image-overlay"></div>

        {/* Event Type Badge */}
        <div className="event-type-badge">{type || "Event"}</div>

        {/* Event Status Badge */}
        {eventStatus && (
          <div className={`event-status ${eventStatus}`}>
            {eventStatus === "live"
              ? "🔴 LIVE NOW"
              : eventStatus === "upcoming"
              ? "🟢 UPCOMING"
              : "EVENT ENDED"}
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className="event-content">
        <h3 className="event-title">{title}</h3>

        <div className="event-details">
          <div className="event-detail-item">
            <span className="event-detail-icon">📅</span>
            <span>
              <strong>Date:</strong> {formatDate(eventDate)}
            </span>
          </div>

          <div className="event-detail-item">
            <span className="event-detail-icon">🕒</span>
            <span>
              <strong>Time:</strong> {formatTime(eventTime)}
            </span>
          </div>

          <div className="event-detail-item">
            <span className="event-detail-icon">📍</span>
            <span>
              <strong>Venue:</strong> {venue || "To Be Announced"}
            </span>
          </div>

          {speakers && (
            <div className="event-detail-item">
              <span className="event-detail-icon">👥</span>
              <span>
                <strong>Speakers:</strong> {speakers}
              </span>
            </div>
          )}
        </div>

        {/* Society Tag */}
        {society && (
          <div className="event-society-tag">
            <span className="society-icon">🏛️</span>
            <span>Organized by {society}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="event-buttons">
          <button
            className="event-button event-button-primary"
            onClick={onRegisterClick}
          >
            Learn More & Register
          </button>

          {canShowMeetingLink && (
            <button
              className="event-button event-button-meeting"
              onClick={() =>
                onMeetingLinkClick &&
                onMeetingLinkClick({ link: meetingLink, title })
              }
            >
              <span >🔗 </span>
              Join {meetingButtonLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
