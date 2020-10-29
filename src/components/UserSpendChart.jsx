import React from 'react';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from 'recharts';

import { useOrders } from '../hooks/useOrders';

const UserSpendChart = () => {
  const { orders } = useOrders();
  const userTotals = orders;
  const chartData = userTotals.map((user) => {
    return { name: user.name, total: user.total };
  });
  // const tooltipContent = chartData.map((item) => {
  //   return { name: item.name, total: '$' + item.total.toFixed(2) };
  // });
  return (
    <BarChart
      width={500}
      height={300}
      data={chartData}
      margin={{ top: 5, right: 100, left: 20, bottom: 15 }}
    >
      <XAxis dataKey="name" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Bar dataKey="total" fill={'green'} isAnimationActive={false} />
    </BarChart>
  );
};

export default UserSpendChart;
