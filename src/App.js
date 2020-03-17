import React from 'react';
import './App.css';
import { Dashboard } from './Dashboard';
import Loading from 'react-loading';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import _ from 'underscore';
import Auth0Lock from 'auth0-lock';
import {
  sortCollection,
  getCompanyInfo,
  getStoreID,
  getFilterFieldName,
} from './global';
import moment from 'moment';
import { Grommet, Box, TableRow, TableCell } from 'grommet';
import DataBlock from './components/DataBlock';
import LoadingSpinner from './components/LoadingSpinner';
import styled from 'styled-components';

const ClickableTableRow = styled(TableRow)`
  cursor: pointer;
  &:hover {
    background: white;
  }
`;

const LoadingContainer = styled(Box)`
  height: 100vh;
  align-items: center;
  justify-content: center;
`;
//global grommet theming
const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '16px',
      height: '20px',
    },
  },
};

const fromUrl = window.location.href || 'https://qm-dashboard.herokuapp.com';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      filteredData: [],
      showModal: false,
      modalLoading: false,
      activeOrder: 0,
      activeUser: '',
      year: moment(),
      filter: '',
      filterBy: 'all',
      sort: 'orderNumber',
      reverse: true,
      userTotals: [],
      filterFields: {},
      currentOrderData: {},
      lock: new Auth0Lock(
        process.env.REACT_APP_AUTH0_KEY,
        'perezvon.auth0.com',
        {
          allowedConnections: ['Username-Password-Authentication'],
          languageDictionary: {
            usernameOrEmailInputPlaceholder: 'username',
            title: 'Quartermaster Dashboard',
          },
        }
      ),
      token: localStorage.getItem('accessToken'),
      username: localStorage.getItem('username'),
      currentId: getStoreID(localStorage.getItem('username'))
    };
  }

  setActiveOrder = e => {
    e.preventDefault();
    const order = e.target.attributes.getNamedItem('data-order') ? e.target.attributes.getNamedItem('data-order').value : e.target.parentNode.attributes.getNamedItem('data-order').value;
    this.asyncGetOrderDetails(order);
    this.setState({
      activeUser: 0,
    });
  };

  setActiveUser = e => {
    e.preventDefault();
    const user = e.target.parentNode.attributes.getNamedItem('data-user').value;
    this.setState({
      activeUser: user,
      currentOrderData: {},
      showModal: true,
    });
  };

  setShowModal = val => this.setState({ showModal: val });

  getWalletBalance = user => {
    let userBalance = this.state.data
      .filter(d => d.user_id === user)
      .sort((a, b) => b.timestamp - a.timestamp);
    return userBalance[0] ? userBalance[0].wallet : null;
  };

  sortFactor = e => {
    e.preventDefault();
    const sort = e.target.attributes.getNamedItem('data-sort').value;
    let reverseValue = this.state.reverse;
    switch (sort) {
      case 'Order Number':
        this.setState({
          lastSort: this.state.sort,
          sort: 'orderNumber',
          reverse: !reverseValue,
        });
        break;
      case 'Order Date':
        this.setState({
          lastSort: this.state.sort,
          sort: 'date',
          reverse: !reverseValue,
        });
        break;
      case 'Employee':
        this.setState({
          lastSort: this.state.sort,
          sort: 'name',
          reverse: !reverseValue,
        });
        break;
      case 'Subtotal':
        this.setState({
          lastSort: this.state.sort,
          sort: 'subtotal',
          reverse: !reverseValue,
        });
        break;
      case 'Tax':
        this.setState({
          lastSort: this.state.sort,
          sort: 'tax',
          reverse: !reverseValue,
        });
        break;
      case 'Total':
        this.setState({
          lastSort: this.state.sort,
          sort: 'total',
          reverse: !reverseValue,
        });
        break;
      case 'Shipping':
        this.setState({
          lastSort: this.state.sort,
          sort: 'shipping',
          reverse: !reverseValue,
        });
        break;
      default:
        this.setState({
          lastSort: this.state.sort,
          sort: '',
        });
    }
  };

  logout = () => {
    localStorage.clear();
    this.state.lock.logout({
      returnTo: fromUrl,
    });
  };

  handleFilter = eventKey => {
    if (eventKey !== 'all') {
      this.setState(prevState => {
        return {
          filterBy: eventKey,
          filteredData: prevState.orders.filter(
            i => i.fields[prevState.filter] === eventKey
          ),
        };
      });
    } else
      this.setState({
        filterBy: eventKey,
        filteredData: this.state.orders,
      });
  };

  handleYear = year => {
    if (year !== 'all') {
      const formattedYear = moment(`01/01/${year}`);
      this.setState(prevState => ({
        year: formattedYear,
        filteredData: prevState.orders.filter(d =>
          moment.unix(+d.timestamp).isSame(formattedYear, 'year')
        ),
      }));
    } else
      this.setState({
        year: 'all',
        filteredData: this.state.orders,
      });
  };

  approveOrDenyOrders = data => {
    fetch('/api/approve-deny', {
      body: JSON.stringify(data),
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
      mode: 'same-origin',
    })
      .then(res => res.json())
      .then(json => {
        alert('Order Statuses Updated!');
      })
      .catch(err => console.error(err));
  };

  asyncGetOrderDetails = order_id => {
    this.setState({
      showModal: true,
      modalLoading: true,
    });
    fetch(`/api/orders/${this.state.currentId}/${order_id}`)
      .then(res => res.json())
      .then(json => {
        this.setState({
          currentOrderData: json,
          modalLoading: false,
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  componentDidMount = () => {
    const { lock, token, currentId } = this.state;
    
    lock.on('authenticated', (authResult) => {
      // Use the token in authResult to getUserInfo() and save it to localStorage
      lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          console.log(error);
          return;
        }
        this.setState({ token: authResult.accessToken });
        localStorage.setItem('accessToken', authResult.accessToken);
        localStorage.setItem('username', profile.username);
        localStorage.setItem('profile', profile.app_metadata);
      });
    });
    
    if (token) {
      let shouldFetchUpdates = false;
      if (
        !localStorage.getItem('lastUpdate') ||
        moment() - moment(localStorage.getItem('lastUpdate')) > 3600000
      ) {
        shouldFetchUpdates = true;
      }
      if (
        !shouldFetchUpdates &&
        localStorage.getItem(`${currentId}:sessionData`)
      ) {
        this.setState({
          ...JSON.parse(localStorage.getItem(`${currentId}:sessionData`)),
          loading: false,
        });
        return this.handleYear(this.state.year.format('YYYY'));
      }
      fetch(`/api/orders/${currentId}`)
        .then(res => res.json())
        .then(json => {
          let orderData = json.orders;
          this.setState({
            orders: orderData,
            ...getCompanyInfo(currentId),
            loading: false,
          });
          localStorage.setItem('lastUpdate', moment());
          localStorage.setItem(
            `${currentId}:sessionData`,
            JSON.stringify(this.state)
          );
          this.handleYear(this.state.year.format('YYYY'));
        })
        .catch(err => {
          console.error(err);
          this.setState({ apiError: true });
        });
    }
    
  };

  render() {
    if (this.state.token) {
      if (!this.state.loading) {
        const {
          data,
          filteredData,
          userDetails,
          filter,
          filterFields,
          filterBy,
          showModal,
          modalLoading,
          approve,
          logo,
          orders,
          year,
          currentOrderData,
        } = this.state;
        let orderData, userOrderData;
        let companyName =
          filterBy !== 'all'
            ? this.state.companyName +
              ' — ' +
              getFilterFieldName(filter) +
              ' ' +
              filterFields[filterBy].split(' ')[0]
            : companyName;
        let chartData = [];
        let tooltipContent;
        let companyTotal = 0;
        let totalSpend = '';
        let userData = '';
        let userHeaders, userSpendData;
        let totalOrders = '';
        let totalProductCount = 0;
        let averageOrderTotal = '';
        let orderTotals = [];
        let tableData;
        let headers = [];
        let totalSpendRemaining = 0;
        let spendRemaining;
        let modalData, modalTitle;
        let userTotals = [];
        let dropdownItems;
        const selectedYear =
          year === 'all' ? year : moment(year).format('YYYY');
        let approvedOrders = this.state.approve
          ? filteredData.filter(i => i.status === 'P')
          : filteredData.filter(i => i.status !== 'I');
        //populate orders array
        approvedOrders.forEach(order => {
          let {
            order_id,
            user_id,
            timestamp,
            firstname,
            lastname,
            email,
            total,
          } = order;
          let orderNumber = order_id;
          let date = moment.unix(timestamp).format('MMMM DD, YYYY');
          let name = firstname ? `${firstname} ${lastname}` : email;
          total = +total;
          orderTotals.push({
            user_id,
            orderNumber,
            date,
            name,
            total,
          });
        });
        //filter menu dropdown items
        dropdownItems = [
          ...new Set(
            data
              .map(item => item.fields[this.state.filter])
              .filter(item => !!item)
              .sort((a, b) => +a - +b)
          ),
        ];
        dropdownItems = dropdownItems.map(
          (item, index) => this.state.filterFields[item] || item
        );

        //get unique users && create dataset for each
        const uniqueUsers = [
          ...new Set(approvedOrders.map(item => item.user_id)),
        ];
        totalSpendRemaining = 0;

        uniqueUsers.forEach(user => {
          let userWallet = this.getWalletBalance(user) || 0;
          //console.log(userWallet)
          let approvedOrdersForUser = approvedOrders.filter(
            i => i.user_id === user
          );
          const userName =
            approvedOrdersForUser && approvedOrdersForUser[0].firstname
              ? `${approvedOrdersForUser[0].firstname} ${approvedOrdersForUser[0].lastname}`
              : approvedOrdersForUser[0].email;
          let currentTotal = 0;
          let numOfOrders = 0;
          for (let i = 0; i < approvedOrders.length; i++) {
            if (user === approvedOrders[i].user_id) {
              numOfOrders++;
              let total = +approvedOrders[i].total;
              currentTotal += total;
            }
          }

          if (this.state.maxSpend > 0 && currentTotal > this.state.maxSpend)
            currentTotal = this.state.maxSpend;

          companyTotal += currentTotal;
          totalSpendRemaining += +userWallet.current_cash || 0;

          let userSpendRemaining =
            +userWallet.current_cash || this.state.maxSpend - currentTotal;
          if (userSpendRemaining < 0) userSpendRemaining = 0;
          userTotals.push({
            user_id: approvedOrdersForUser[0].user_id,
            name: userName,
            orders: numOfOrders,
            total: +currentTotal,
            spendRemaining: userSpendRemaining,
          });
        });
        let sortedOrders = sortCollection(
          orderTotals,
          this.state.sort,
          this.state.reverse
        );
        //format orders for order table
        headers = ['Order Number', 'Order Date', 'Employee', 'Total'].map(
          (item, index) => (
            <TableCell key={index} data-sort={item} onClick={this.sortFactor}>
              {item}
            </TableCell>
          )
        );
        tableData = sortedOrders.map((item, index) => {
          return (
            <ClickableTableRow
              key={item.orderNumber}
              data-order={item.orderNumber}
              onClick={this.setActiveOrder}
            >
              {_.map(
                item,
                (i, key) =>
                  key !== 'user_id' && <TableCell key={key}>{i}</TableCell>
              )}
            </ClickableTableRow>
          );
        });
        //format users for user spend table
        userHeaders = ['Employee'].map((item, index) => (
          <TableCell key={index} data-sort={item} onClick={this.sortFactor}>
            {item}
          </TableCell>
        ));
        userSpendData = _.uniq(orderTotals, 'user_id').map((item, index) => {
          return (
            <ClickableTableRow
              key={item.user_id}
              data-user={item.user_id}
              onClick={this.setActiveUser}
            >
              {_.map(item, (i, key) => {
                return key === 'name' ? (
                  <TableCell key={i}>{i}</TableCell>
                ) : null;
              })}
            </ClickableTableRow>
          );
        });

        //number of orders
        totalOrders = (
          <DataBlock label={'Number of Orders'} value={approvedOrders.length} />
        );

        //total products purchased
        // totalProductCount = approvedOrders.map(i => i.products);
        let numOfProducts = 0;
        // for (let i = 0; i < totalProductCount.length; i++) {
        //   numOfProducts += Object.keys(totalProductCount[i]).length;
        // }
        averageOrderTotal = (
          <DataBlock
            label={'Average Order Total'}
            value={`$${(companyTotal / approvedOrders.length).toFixed(2)}`}
          />
        );

        //sort user spend data for display
        userTotals = _.sortBy(userTotals, 'total').reverse();
        //format user spend data for chart
        chartData = userTotals.map(user => {
          return { name: user.name, total: user.total };
        });
        tooltipContent = chartData.map(item => {
          return { name: item.name, total: '$' + item.total.toFixed(2) };
        });
        //update UI
        totalSpend = (
          <DataBlock
            label={`Total Spend ${selectedYear}`}
            value={`$${companyTotal.toFixed(2)}`}
          />
        );
        spendRemaining = (
          <DataBlock
            label={`Amount Remaining ${selectedYear}`}
            value={`$${+totalSpendRemaining.toFixed(2)}`}
          />
        );
        userData = userTotals.map((user, index) => {
          const textColor =
            user.total <= this.state.maxSpend ? 'green-text' : 'red-text';
          return (
            <h3 key={index}>
              {user.name}:{' '}
              <span className={textColor}>${user.total.toFixed(2)}</span>
            </h3>
          );
        });
        //get data for current order
        if (currentOrderData.order_id) {
          orderData = _.map(currentOrderData.products || {}, (item, index) => {
            //strip html and options from item description
            let description = item.product.split('<', 1)[0];
            return (
              <TableRow key={index}>
                <TableCell>{item.product_code}</TableCell>
                <TableCell>{description}</TableCell>
                <TableCell>${(+item.price).toFixed(2)}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>${+(item.price * item.amount).toFixed(2)}</TableCell>
              </TableRow>
            );
          });
        }

        //get data for current customer
        if (this.state.activeUser) {
          userOrderData = approvedOrders
            .filter(order => {
              return +order.user_id === this.state.activeUser;
            })
            .map(item => item.products);
          userOrderData = _.map(userOrderData, (order, index) => {
            return _.map(order, (item, index) => {
              let description = item.product.split('<', 1)[0];
              return (
                <TableRow key={index}>
                  <TableCell>{item.product_code}</TableCell>
                  <TableCell>{description}</TableCell>
                  <TableCell>${+item.price}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>
                    ${+(item.price * item.amount).toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            });
          });
        }
        userDetails = _.first(
          userTotals.filter(item => item.user_id === this.state.activeUser)
        );
        const approveOrderData = orders.filter(o => o.status === 'O');
        modalData = currentOrderData.order_id ? orderData : userOrderData;
        modalTitle = currentOrderData.order_id
          ? 'Order #' + currentOrderData.order_id
          : 'Shopper Profile for ' + (userDetails || {}).name;

        return (
          <Router>
            <Grommet theme={theme}>
              <Switch>
                <Route
                  path="/"
                  render={() => (
                    <Dashboard
                      logo={logo}
                      orderData={approveOrderData}
                      approveOrDenyOrders={this.approveOrDenyOrders}
                      approve={approve}
                      companyName={companyName}
                      totalSpend={totalSpend}
                      spendRemaining={spendRemaining}
                      userData={userData}
                      userHeaders={userHeaders}
                      userSpendData={userSpendData}
                      totalOrders={totalOrders}
                      averageOrderTotal={averageOrderTotal}
                      chartData={chartData}
                      tooltipContent={tooltipContent}
                      headers={headers}
                      tableData={tableData}
                      modalTitle={modalTitle}
                      modalData={modalData}
                      userDetails={userDetails}
                      showModal={showModal}
                      modalLoading={modalLoading}
                      setShowModal={this.setShowModal}
                      setActiveOrder={this.setActiveOrder}
                      filter={getFilterFieldName(filter)}
                      year={this.state.year}
                      handleYear={this.handleYear}
                      dropdownItems={dropdownItems}
                      handleFilter={this.handleFilter}
                      logout={this.logout}
                    />
                  )}
                />
              </Switch>
            </Grommet>
          </Router>
        );
      } else {
        setTimeout(() => this.setState({ takingTooLongToLoad: true }), 4000)
        return (
          <Grommet theme={theme}>
            <LoadingContainer>
              <LoadingSpinner size="xlarge" />
              <h1>Loading, please wait...</h1>
              {this.state.takingTooLongToLoad && <p>taking too long? <button onClick={() => window.location.reload()}>Try again</button></p>}
            </LoadingContainer>
          </Grommet>
        );
      }
    } else {
      this.state.lock.show();
      return null;
    }
  }
}

export default App;
