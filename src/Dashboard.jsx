import React from "react";
import moment from "moment";
import "./Dashboard.css";
import { Table } from "./components/Table";
import { UserSpendChart } from "./UserSpendChart";
import { Logo } from "./Logo";
import { DetailModal } from "./DetailModal";
import { DataBlock } from "./components/DataBlock";
import { FilterDropdown } from "./components/FilterDropdown";
import ApproveDeny from "./ApproveDeny";
import { Grid, Button, Tabs, Tab, Box, Select } from "grommet";
import { Logout } from "grommet-icons";

export const Dashboard = ({
  logo,
  companyName,
  totalSpend,
  spendRemaining,
  userData,
  userHeaders,
  userSpendData,
  totalOrders,
  productsPurchased,
  chartData,
  tooltipContent,
  headers,
  tableData,
  modalTitle,
  modalData,
  userDetails,
  showModal,
  openModal,
  closeModal,
  filter,
  approve,
  orderData,
  dropdownItems,
  handleFilter,
  year,
  handleYear,
  approveOrDenyOrders,
  setActiveOrder,
  logout
}) => {
  const formattedYear = moment.isMoment(year)
    ? moment(year).format("YYYY")
    : year;
  const yearSelect = (
    <Select
      label={"Filter by Year:"}
      style={{ width: "200px" }}
      value={formattedYear}
      onChange={e => handleYear(e.target.value)}
      options={["all", 2020, 2019, 2018]}
      placeholder="select"
    />
  );
  if (approve) {
    const activeKey = orderData.length > 0 ? 2 : 1;

    return (
      <Grid>
        <Box>
          <Box>
            <h1>{logo ? <Logo logo={logo} /> : { companyName }}</h1>
          </Box>
          <Box>
            <Button color="warning" onClick={logout}>
              Logout
            </Button>
          </Box>
        </Box>
        <Box>
          <Box>
            {yearSelect}
            <Tabs
              defaultActiveKey={activeKey}
              id="qm-tabs"
              style={{ marginTop: "20px" }}
            >
              <Tab eventKey={1} title="Orders Summary">
                {userData && (
                  <div>
                    <Box>
                      <Box direction="row">
                        {totalSpend}
                        {spendRemaining}
                        {totalOrders}
                        {productsPurchased}
                      </Box>
                      <Box>
                        <UserSpendChart
                          chartData={chartData}
                          tooltipContent={tooltipContent}
                        />
                      </Box>
                    </Box>
                    {filter && (
                      <FilterDropdown
                        filter={filter}
                        dropdownItems={dropdownItems}
                        handleFilter={handleFilter}
                      />
                    )}
                    <Box>
                      <Table headers={userHeaders} tableData={userSpendData} />
                    </Box>
                    <Table headers={headers} tableData={tableData} />
                    <DetailModal
                      modalTitle={modalTitle}
                      modalData={modalData}
                      userDetails={userDetails}
                      showModal={showModal}
                      openModal={openModal}
                      closeModal={closeModal}
                    />
                  </div>
                )}
              </Tab>
              <Tab eventKey={2} title="Approve/Deny Orders">
                <ApproveDeny
                  data={orderData}
                  approveOrDenyOrders={approveOrDenyOrders}
                  modalTitle={modalTitle}
                  modalData={modalData}
                  userDetails={userDetails}
                  openModal={openModal}
                  closeModal={closeModal}
                  showModal={showModal}
                  setActiveOrder={setActiveOrder}
                />
              </Tab>
            </Tabs>
          </Box>
        </Box>
      </Grid>
    );
  } else {
    return (
      <Grid>
        <Box>
          <Box>
            <h1>{logo ? <Logo logo={logo} /> : { companyName }}</h1>
          </Box>
          <Box>
            <Button icon={<Logout />} onClick={logout}>
              Logout
            </Button>
          </Box>
        </Box>
        {userData && (
          <div>
            <Box>
              {yearSelect}
              <Box direction="row" align="center">
                <Box direction="row" wrap={true} justify="center">
                  {totalSpend}
                  {spendRemaining}
                  {totalOrders}
                  {productsPurchased}
                </Box>
                <UserSpendChart
                  chartData={chartData}
                  tooltipContent={tooltipContent}
                />
              </Box>
            </Box>
            {filter && (
              <FilterDropdown
                filter={filter}
                dropdownItems={dropdownItems}
                handleFilter={handleFilter}
              />
            )}
            <Table headers={userHeaders} tableData={userSpendData} />
            <Table headers={headers} tableData={tableData} />
            <DetailModal
              modalTitle={modalTitle}
              modalData={modalData}
              userDetails={userDetails}
              showModal={showModal}
              openModal={openModal}
              closeModal={closeModal}
            />
          </div>
        )}
      </Grid>
    );
  }
};
