import React from "react";
import { PowerCycle } from "grommet-icons";
import styled from "styled-components";

const StyledLoadingSpinner = styled(PowerCycle)`
  animation: rotate 2s linear infinite;

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingSpinner = ({ size }) => <StyledLoadingSpinner size={size} />;

export default LoadingSpinner;
