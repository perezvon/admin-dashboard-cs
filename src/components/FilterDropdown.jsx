import React from "react";
import { Select } from "grommet";
import styled from "styled-components";

const StyledSelect = styled(Select)`
  max-width: 300px;
`;

export const FilterDropdown = ({ filter, dropdownItems, handleFilter }) => (
  <div>
    <StyledSelect
      id="filterBy"
      onChange={({ option }) => handleFilter(option)}
      options={["all", ...dropdownItems]}
    />
  </div>
);
