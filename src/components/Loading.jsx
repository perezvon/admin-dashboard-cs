import React, { useState } from 'react';
import styled from 'styled-components';
import LoadingSpinner from './LoadingSpinner';
import { Box, Button } from 'grommet';

const LoadingContainer = styled(Box)`
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

const Loading = () => {
  const [takingTooLongToLoad, setTakingTooLongToLoad] = useState(false);
  setTimeout(() => setTakingTooLongToLoad(true), 4000);
  return (
    <LoadingContainer>
      <LoadingSpinner size="xlarge" />
      <h1>Loading, please wait...</h1>
      {takingTooLongToLoad && (
        <p>
          taking too long?{' '}
          <Button onClick={() => window.location.reload()}>Try again</Button>
        </p>
      )}
    </LoadingContainer>
  );
};

export default Loading;
