import React from "react";

const FilterBar = ({ filters, setFilters }) => {
  return (
    <div className="filter-bar">
      <select
        value={filters.society}
        onChange={(e) => setFilters({ ...filters, society: e.target.value })}
      >
        <option value="">All Societies</option>
        <option value="IEEE">IEEE</option>
        <option value="Robotics Club">Robotics Club</option>
        <option value="AI Society">AI Society</option>
        <option value="CSE Society">CSE Society</option>
        <option value="Mechanical Society">Mechanical Society</option>
        <option value="Biomedical Society">Biomedical Society</option>
      </select>

      <select
        value={filters.eventStatus}
        onChange={(e) => setFilters({ ...filters, eventStatus: e.target.value })}
      >
        <option value="">All Events</option>
        <option value="upcoming">Upcoming Events</option>
        <option value="ended">Ended Events</option>
      </select>
    </div>
  );
};

export default FilterBar;
