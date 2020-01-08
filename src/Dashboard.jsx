import React from 'react';
import moment from 'moment';
import {Button, Grid, Row, Col, Tabs, Tab, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import './Dashboard.css';
import {Table} from './Table'
import {UserSpendChart} from './UserSpendChart'
import {Logo} from './Logo'
import {DetailModal} from './DetailModal'
import {FilterDropdown} from './FilterDropdown'
import ApproveDeny from './ApproveDeny'

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
  logout}) => {
const formattedYear = moment.isMoment(year) ? moment(year).format('YYYY') : year;
const yearSelect = <FormGroup controlId="formControlsSelect">
  <ControlLabel>Filter by Year:</ControlLabel>
  <FormControl style={{width: '200px'}} value={formattedYear} onChange={e => handleYear(e.target.value)} componentClass="select" placeholder="select">
    <option value='all'>all</option>
    <option value={'2020'}>2020</option>
    <option value={'2019'}>2019</option>
    <option value={'2018'}>2018</option>
  </FormControl>
  </FormGroup>
if (approve) {
  const activeKey = orderData.length > 0 ? 2 : 1
  
  return (
    <Grid>
      <Row>
       <Col md={10}>
         <h1><Logo logo={logo}/> {companyName}</h1>
      </Col>
        <Col md={2}>
        <Button bsStyle='warning' onClick={logout}>Logout</Button>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {yearSelect}
          <Tabs defaultActiveKey={activeKey} id="qm-tabs" style={{marginTop: '20px'}}>
            <Tab eventKey={1} title="Orders Summary">
              {userData &&
                <div>
                <div className='row'>
                  <div className='col-md-6'>
                    {totalSpend}
                    {spendRemaining}
                    {totalOrders}
                    {productsPurchased}
                    </div>
                  <div className='col-md-6'>
                    <UserSpendChart chartData={chartData} tooltipContent={tooltipContent} />
                  </div>
                </div>
                { filter &&
                  <FilterDropdown filter={filter} dropdownItems={dropdownItems} handleFilter={handleFilter}/>
                }
                <div className='col-md-6'>
                <Table headers={userHeaders} tableData={userSpendData} />
                </div>
               <Table headers={headers} tableData={tableData} />
               <DetailModal
                 modalTitle={modalTitle}
                 modalData={modalData}
                 userDetails={userDetails}
                 showModal={showModal}
                 openModal={openModal}
                 closeModal={closeModal} />
                </div>
               }
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
        </Col>
      </Row>
    </Grid>
  )
}
else {
  return (
      <Grid>
          <Row>
           <Col md={10}>
          <h1><Logo logo={logo}/> {companyName}</h1>
          </Col>
            <Col md={2}>
              <Button bsStyle='warning' onClick={logout}>Logout</Button>
            </Col>
          </Row>
          {userData &&
            <div>
            <Row>
              <Col md={6}>
                {yearSelect}
                {totalSpend}
                {spendRemaining}
                {totalOrders}
                {productsPurchased}
              </Col>
              <Col md={6}>
                <UserSpendChart chartData={chartData} tooltipContent={tooltipContent} />
              </Col>
            </Row>
            { filter &&
              <FilterDropdown filter={filter} dropdownItems={dropdownItems} handleFilter={handleFilter}/>
            }
            <Col md={6}>
            <Table headers={userHeaders} tableData={userSpendData} />
            </Col>
           <Table headers={headers} tableData={tableData} />
           <DetailModal modalTitle={modalTitle} modalData={modalData} userDetails={userDetails} showModal={showModal} openModal={openModal} closeModal={closeModal} />
            </div>
           }
      </Grid>
    )
  }
}
