import React from "react";
import { Select } from "grommet";

export const FilterDropdown = ({ filter, dropdownItems, handleFilter }) => (
  <div>
    <Select
      title={filter}
      id="filterBy"
      onSelect={handleFilter}
      options={["all", ...dropdownItems]}
    />
  </div>
);
