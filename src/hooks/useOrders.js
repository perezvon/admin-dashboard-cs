import React, { useState, useEffect, useContext, createContext } from 'react';
import moment from 'moment';

import { useAuth } from './useAuth';
import useFilter from './useFilter';

const orderContext = createContext();

const useOrdersProvider = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    user: {
      accessToken,
      profile: { storeID },
    },
    showLogin,
  } = useAuth();
  const {
    state: { year },
  } = useFilter();

  useEffect(() => {
    const asyncLoadData = async () => {
      console.log('loading the data...');
      const res = await fetch(`/api/orders/${storeID}`);
      const { orders } = await res.json();
      const formattedYear = moment(`01/01/${year}`);
      console.log('orders', orders);
      setAllOrders(orders);
      setOrders(
        orders.filter((o) =>
          moment.unix(+o.timestamp).isSame(formattedYear, 'year')
        )
      );
      setLoading(false);
    };
    if (accessToken) asyncLoadData();
    else showLogin();
  }, [accessToken]);

  useEffect(() => {
    if (year === 'all') setOrders(allOrders);
    else {
      const formattedYear = moment(`01/01/${year}`);
      setOrders(
        allOrders.filter((o) =>
          moment.unix(+o.timestamp).isSame(formattedYear, 'year')
        )
      );
    }
  }, [allOrders, year]);

  return { orders, loading, setOrders };
};

export function OrdersProvider({ children }) {
  const orders = useOrdersProvider();
  return (
    <orderContext.Provider value={orders}>{children}</orderContext.Provider>
  );
}

export const useOrders = () => {
  return useContext(orderContext);
};
