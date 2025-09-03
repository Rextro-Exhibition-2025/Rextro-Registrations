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
    
    if (diffDays < 0) return 'ended';
    if (diffDays === 0) return 'live';
    return 'upcoming';
  } catch {
    return null;
  }
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'TBA';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

// Helper function to format time
const formatTime = (timeString, startTime, endTime) => {
  if (timeString) return timeString; // Use formatted time if available
  if (startTime && endTime) return `${startTime} - ${endTime}`;
  if (startTime) return startTime;
  return 'TBA';
};

const EventCard = ({
  image,
  title,
  eventDate,
  eventTime,
  startTime,
  endTime,
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
      const msDiff = evDate.setHours(0,0,0,0) - today.setHours(0,0,0,0);
      const daysDiff = msDiff / (1000 * 60 * 60 * 24);
      return daysDiff <= 2 && daysDiff >= 0;
    } catch {
      return false;
    }
  })();

  const meetingButtonLabel = String(type).toLowerCase() === "workshop" ? "Workshop Link" : "Webinar Link";

  return (
    <div className="event-card">
      {/* Event Image with Overlay */}
      <div className="event-image-container">
        <img 
          src={getImageSrc(image)} 
          alt={title} 
          className="event-image"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div className="event-image-overlay"></div>
        
        {/* Event Type Badge */}
        <div className="event-type-badge">
          {type || 'Event'}
        </div>
        
        {/* Event Status Badge */}
        {eventStatus && (
          <div className={`event-status ${eventStatus}`}>
            {eventStatus === 'live' ? '🔴 Live' : 
             eventStatus === 'upcoming' ? '🟢 Upcoming' : 
             '🔴 Ended'}
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className="event-content">
        <h3 className="event-title">{title}</h3>
        
        <div className="event-details">
          <div className="event-detail-item">
            <span className="event-detail-icon">📅</span>
            <span>{formatDate(eventDate)}</span>
          </div>
          
          <div className="event-detail-item">
            <span className="event-detail-icon">🕒</span>
            <span>{formatTime(eventTime, startTime, endTime)}</span>
          </div>
          
          {speakers && (
            <div className="event-detail-item">
              <span className="event-detail-icon">👥</span>
              <span>{speakers}</span>
            </div>
          )}
        </div>



        {/* Action Buttons */}
        <div className="event-buttons">
          <button 
            className="event-button event-button-primary" 
            onClick={onRegisterClick}
          >
            View Details
          </button>
          
          {canShowMeetingLink && (
            <button
              className="event-button event-button-secondary"
              onClick={() => onMeetingLinkClick && onMeetingLinkClick({ link: meetingLink, title })}
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