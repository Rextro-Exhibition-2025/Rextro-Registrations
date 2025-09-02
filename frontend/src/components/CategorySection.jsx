import React from "react";
import EventCard from "./EventCard";

const CategorySection = ({ title, events, onRegisterClick, onMeetingLinkClick }) => {
  if (events.length === 0) return null;

  return (
    <div className="category-section">
      <h2 className="category-title">{title}</h2>
      <div className="event-list">
        {events.map((ev) => (
          <EventCard 
            key={ev.id} 
            {...ev} 
            onRegisterClick={() => onRegisterClick(ev)}
            onMeetingLinkClick={(payload) => onMeetingLinkClick && onMeetingLinkClick(ev, payload)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
