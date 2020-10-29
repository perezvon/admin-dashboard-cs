import React, { useState } from 'react';
import moment from 'moment';
import { Table } from './Table';
import { Logo } from './Logo';
import { DetailModal } from './DetailModal';
import { FilterDropdown } from './FilterDropdown';
import ApproveDeny from './ApproveDeny';
import { Header, Grid, Button, Tabs, Tab, Box, Select } from 'grommet';
import { Logout } from 'grommet-icons';
import styled from 'styled-components';

import { useAuth } from '../hooks/useAuth';
import useFilter from '../hooks/useFilter';

import SummaryData from './SummaryData';
import Orders from './Orders';

const StyledHeader = styled(Header)`
  padding: 0 20px;
`;

const DashboardContainer = styled(Box)`
  background: #f2f2f2;
  min-height: 100vh;
`;

const ResponsiveBox = styled(Box)`
  @media (max-width: 732px) {
    flex-flow: wrap;
  }
`;

const StyledSelect = styled(Select)`
  max-width: 300px;
`;

export const Dashboard = () => {
  const {
    state: { year, filterType },
    setYear,
    setFilterType,
  } = useFilter();
  const {
    user: { logo, companyName },
    logout,
  } = useAuth();
  const yearSelect = (
    <StyledSelect
      value={year}
      onChange={({ option }) => setYear(option)}
      options={['all', '2020', '2019', '2018']}
      placeholder="select"
    />
  );
  return (
    <Grid>
      <StyledHeader>
        <h1>{logo ? <Logo logo={logo} height="65px" /> : { companyName }}</h1>
        <Box direction="row">
          <p>Filter by Year:</p>
          {yearSelect}
          {/* {filterType && dropdownItems.length > 0 && <p>{filterType}</p>}
          {filterType && dropdownItems.length > 0 && (
            <FilterDropdown
              filter={filterType}
              dropdownItems={dropdownItems}
              handleFilter={setFilterType}
            />
          )} */}
        </Box>
        <Button icon={<Logout />} onClick={logout} />
      </StyledHeader>
      <DashboardContainer>
        <div>
          <Tabs id="qm-tabs" style={{ marginTop: '20px' }}>
            <Tab title="Summary">
              <SummaryData />
            </Tab>
            <Tab title="Orders">
              <Orders />
            </Tab>
            {/* {approve && (
              <Tab title="Approve/Deny Orders">
                <ApproveDeny
                  data={orderData}
                  approveOrDenyOrders={approveOrDenyOrders}
                  modalTitle={modalTitle}
                  modalData={modalData}
                  userDetails={userDetails}
                  setShowModal={setShowModal}
                  showModal={showModal}
                  modalLoading={modalLoading}
                  setActiveOrder={setActiveOrder}
                />
              </Tab>
            )} */}
          </Tabs>
        </div>
      </DashboardContainer>
    </Grid>
  );
};

// {
//   logo,
//   companyName,
//   totalSpend,
//   spendRemaining,
//   userData,
//   userHeaders,
//   userSpendData,
//   totalOrders,
//   averageOrderTotal,
//   chartData,
//   tooltipContent,
//   headers,
//   tableData,
//   modalLoading,
//   modalTitle,
//   modalData,
//   userDetails,
//   showModal,
//   setShowModal,
//   filter,
//   approve,
//   orderData,
//   dropdownItems,
//   handleFilter,
//   year,
//   handleYear,
//   approveOrDenyOrders,
//   setActiveOrder,
//   logout,
// }
