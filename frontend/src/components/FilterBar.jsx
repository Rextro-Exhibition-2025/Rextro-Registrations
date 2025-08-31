import React from "react";

const FilterBar = ({ filters, setFilters }) => {
  return (
    <div className="filter-bar">
      <select
        value={filters.department}
        onChange={(e) => setFilters({ ...filters, department: e.target.value })}
      >
        <option value="">All Departments</option>
        <option value="CSE">CSE</option>
        <option value="Mechanical">Mechanical</option>
        <option value="Biomedical">Biomedical</option>
      </select>

      <select
        value={filters.society}
        onChange={(e) => setFilters({ ...filters, society: e.target.value })}
      >
        <option value="">All Societies</option>
        <option value="IEEE">IEEE</option>
        <option value="Robotics Club">Robotics Club</option>
        <option value="AI Society">AI Society</option>
      </select>

      <input
        type="date"
        value={filters.date}
        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
      />
    </div>
  );
};

export default FilterBar;
