import React from "react";

const FilterBar = ({ filters, setFilters }) => {
  const societies = [
    "IEEE",
    "Robotics Club", 
    "AI Society",
    "CSE Society",
    "Mechanical Society",
    "Biomedical Society"
  ];

  const handleSocietyChange = (e) => {
    setFilters({ ...filters, society: e.target.value });
  };

  const handleStatusChange = (e) => {
    setFilters({ ...filters, eventStatus: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ society: "", eventStatus: "" });
  };

  const hasActiveFilters = filters.society || filters.eventStatus;

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label className="filter-label">
          <span className="filter-icon">🏛️</span>
          Society
        </label>
        <select
          value={filters.society}
          onChange={handleSocietyChange}
          className="filter-select"
        >
          <option value="">All Societies</option>
          {societies.map(society => (
            <option key={society} value={society}>
              {society}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <span className="filter-icon">📅</span>
          Status
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