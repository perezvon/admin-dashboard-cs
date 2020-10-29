import React from 'react';
import styled from 'styled-components';
import { Box } from 'grommet';

import UserSpendChart from './UserSpendChart';
import DataBlock from './DataBlock';
import { useOrders } from '../hooks/useOrders';
import useFilter from '../hooks/useFilter';

const ResponsiveBox = styled(Box)`
  @media (max-width: 732px) {
    flex-flow: wrap;
  }
`;

const TotalSpend = ({ year, total = 0 }) => (
  <DataBlock label={`Total Spend ${year}`} value={`$${total.toFixed(2)}`} />
);
const SpendRemaining = ({ year, totalSpendRemaining = 0 }) => (
  <DataBlock
    label={`Amount Remaining ${year}`}
    value={`$${+totalSpendRemaining.toFixed(2)}`}
  />
);

const TotalOrders = ({ count = 0 }) => (
  <DataBlock label={'Number of Orders'} value={count} />
);

const AverageOrderValue = ({ total = 0, count = 0 }) => (
  <DataBlock
    label={'Average Order Value'}
    value={`$${
      isNaN((total / count).toFixed(2)) ? ' --' : (total / count).toFixed(2)
    }`}
  />
);

const SummaryData = () => {
  const { orders } = useOrders();
  const {
    state: { year },
  } = useFilter();

  const total = orders.reduce((a, c) => a + +c.total, 0);
  const count = orders.length;
  const yearString = year === 'all' ? 'all-time' : year;
  return (
    <Box>
      <ResponsiveBox direction="row" align="center">
        <Box direction="row" wrap={true} justify="center">
          <TotalSpend year={yearString} total={total} />
          <SpendRemaining year={yearString} />
          <TotalOrders count={count} />
          <AverageOrderValue total={total} count={count} />
        </Box>
        <UserSpendChart />
      </ResponsiveBox>
    </Box>
  );
};

export default SummaryData;
