import React from "react";

const FilterBar = ({ filters, setFilters }) => {
  const handleStatusChange = (e) => {
    setFilters({ ...filters, eventStatus: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ eventStatus: "" });
  };

  const hasActiveFilters = filters.eventStatus;

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label className="filter-label">
          <span className="filter-icon">📅</span>
          Event Status
        </label>
        <select
          value={filters.eventStatus}
          onChange={handleStatusChange}
          className="filter-select"
        >
          <option value="">All Events</option>
          <option value="upcoming">Upcoming Events</option>
          <option value="ended">Ended Events</option>
        </select>
      </div>

      {hasActiveFilters && (
        <button 
          onClick={clearFilters}
          className="filter-clear-button"
          title="Clear all filters"
        >
          
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;