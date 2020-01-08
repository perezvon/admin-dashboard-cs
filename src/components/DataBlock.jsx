import React from "react";
import styled from "styled-components";

const DataContainer = styled.div`
  border-radius: 5px;
  margin: 10px;
  width: 300px;
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #eaeaea;
`;

const LabelText = styled.h2``;

const ValueText = styled.h2`
  color: green;
`;

const DataBlock = ({ label, value }) => {
  return (
    <DataContainer>
      <LabelText>{label}</LabelText>
      <ValueText>{value}</ValueText>
    </DataContainer>
  );
};

export default DataBlock;
