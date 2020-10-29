import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Box, Select, TableRow, TableCell } from 'grommet';

import { useOrders } from '../hooks/useOrders';
import Table from './Table';

const PaddedSelectContainer = styled.div`
  padding-left: 20px;
`;

const PaddedBox = styled(Box)`
  padding: 20px;
`;

const StyledSelect = styled(Select)`
  max-width: 300px;
`;

const ClickableTableRow = styled(TableRow)`
  cursor: pointer;
  &:hover {
    background: white;
  }
`;

const Orders = () => {
  const { orders, setOrders } = useOrders();
  const [showOrders, setShowOrders] = useState('all');
  const [sortBy, setSortBy] = useState('');

  const headers = ['Order Number', 'Order Date', 'Employee', 'Total'].map(
    (item, index) => (
      <TableCell key={index} onClick={() => setSortBy(item)}>
        {item}
      </TableCell>
    )
  );
  const tableData = orders.map((order) => (
    <ClickableTableRow key={order.order_id} onClick={() => console.log(order)}>
      {Object.entries(order).map(
        ([key, value]) =>
          key !== 'user_id' && <TableCell key={key}>{value}</TableCell>
      )}
    </ClickableTableRow>
  ));
  console.log(tableData);
  return (
    <div>
      <PaddedSelectContainer>
        <p>View by:</p>
        <StyledSelect
          value={showOrders}
          onChange={({ option }) => setShowOrders(option)}
          options={['all', 'employee']}
          placeholder="select"
        />
      </PaddedSelectContainer>
      <PaddedBox>
        {/* {showOrders === 'employee' && (
          <Table headers={userHeaders} tableData={userSpendData} />
        )} */}
        {showOrders === 'all' &&
          (tableData.length ? (
            <Table headers={headers} tableData={tableData} />
          ) : (
            <h2>no orders</h2>
          ))}
      </PaddedBox>
      {/* <DetailModal
        modalTitle={modalTitle}
        modalData={modalData}
        userDetails={userDetails}
        showModal={showModal}
        setShowModal={setShowModal}
        modalLoading={modalLoading}
      /> */}
    </div>
  );
};

export default Orders;
