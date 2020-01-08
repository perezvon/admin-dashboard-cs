import React from "react";
import styled from "styled-components";

const DataContainer = styled.div`
  border-radius: 5px;
  margin: 10px;
  width: 200px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
`;

const LabelText = styled.h3`
  text-align: center;
  `;

const ValueText = styled.h1`
text-align: center;
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
