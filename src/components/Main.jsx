import React from 'react';

import styled from 'styled-components';

import { Dashboard } from './Dashboard';
import Loading from './Loading';
import { sortCollection, getFilterFieldName } from '../lib/global';
import { useOrders } from '../hooks/useOrders';

const Main = () => {
  const { loading } = useOrders();

  if (loading) {
    return <Loading />;
  } else {
    return <Dashboard />;
  }
};

export default Main;
