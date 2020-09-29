import React, { useState, useEffect } from 'react';
import { Box, TableRow, TableCell } from 'grommet';
import styled from 'styled-components';

import { Dashboard } from './Dashboard';
import DataBlock from './DataBlock';
import Loading from './Loading';
import { sortCollection, getFilterFieldName } from '../lib/global';
import { useAuth } from '../hooks/useAuth';

const ClickableTableRow = styled(TableRow)`
  cursor: pointer;
  &:hover {
    background: white;
  }
`;

const Main = () => {
  const [loading, setLoading] = useState(true);
  const {
    user: {
      accessToken,
      profile: { storeID },
    },
    showLogin,
  } = useAuth();
  const [orders, setOrders] = useState([]);

  console.log(accessToken);

  useEffect(() => {
    const asyncLoadData = async () => {
      console.log('loading the data...');
      const res = await fetch(`/api/orders/${storeID}`);
      const { orders } = await res.json();
      setOrders(orders);
      setLoading(false);
    };
    if (accessToken) asyncLoadData();
    else showLogin();
  }, [accessToken]);

  if (loading) {
    return <Loading />;
  } else {
    return <Dashboard />;
  }
};

export default Main;
