import React from "react";
import EventCard from "./EventCard";

const CategorySection = ({ title, events, onRegisterClick, onMeetingLinkClick }) => {
  if (events.length === 0) {
    return (
      <div className="category-section">
        <h2 className="category-title">{title}</h2>
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <p>No events found in this category.</p>
          <p className="empty-state-subtitle">
            Check back later or adjust your filters to see more events.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-section">
      <h2 className="category-title">{title}</h2>
      <div className="event-list">
        {events.map((ev, index) => (
          <EventCard 
            key={ev.id} 
            {...ev} 
            onRegisterClick={() => onRegisterClick(ev)}
            onMeetingLinkClick={(payload) => onMeetingLinkClick && onMeetingLinkClick(ev, payload)}
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;