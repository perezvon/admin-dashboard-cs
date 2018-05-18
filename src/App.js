import React from 'react';
import './App.css';
import {Dashboard} from './Dashboard'
import Loading from 'react-loading'
import {MenuItem} from 'react-bootstrap'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import _ from 'underscore'
import Auth0Lock from 'auth0-lock'
import {sortCollection, getCompanyInfo, getStoreID, getFilterFieldName, validateEmail} from './global'
import moment from 'moment'

const lock = new Auth0Lock(
  process.env.REACT_APP_AUTH0_KEY,
  'perezvon.auth0.com',
  {
    allowedConnections: ['Username-Password-Authentication'],
    languageDictionary: {
      usernameOrEmailInputPlaceholder: 'username',
      title: 'Quartermaster Dashboard'
    }
  }
);

lock.on("authenticated", function(authResult) {
  // Use the token in authResult to getUserInfo() and save it to localStorage
  lock.getUserInfo(authResult.accessToken, (error, profile) => {
    if (error) {
      console.log(error)
      return;
    }
    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('username', profile.username);
  });
});

const token = localStorage.getItem('accessToken');
const username = localStorage.getItem('username');
const currentId = getStoreID(username);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      filteredData: [],
      showModal: false,
      activeOrder: 0,
      activeUser: '',
      filter: '',
      filterBy: 'all',
      reverse: true,
      userTotals: [],
      customerIDs: [],
      filterFields: {}
    };
}

  setActiveOrder = (e) => {
    e.preventDefault();
    const order = e.target.parentNode.attributes.getNamedItem('data-order').value;
    this.setState({
      activeOrder: order,
      activeUser: '',
      showModal: true
    })
  }

  setActiveUser = (e) => {
    e.preventDefault();
    const user = e.target.parentNode.attributes.getNamedItem('data-user').value;
    this.setState({
      activeUser: user,
      activeOrder: 0,
      showModal: true
    })
  }

  getWalletBalance = (user) => {
    let userBalance = this.state.data.filter(d => d.user_id === user).sort((a,b) => b.timestamp - a.timestamp);
    return userBalance[0] ? userBalance[0].wallet : null;
  }

  sortFactor = (e) => {
    e.preventDefault();
    const sort = e.target.attributes.getNamedItem('data-sort').value;
    let reverseValue = this.state.reverse;
    switch (sort) {
      case 'Order Number':
        this.setState({
          lastSort: this.state.sort,
          sort: 'orderNumber',
          reverse: !reverseValue
        })
      break;
      case 'Order Date':
        this.setState({
          lastSort: this.state.sort,
          sort: 'date',
          reverse: !reverseValue
        })
      break;
      case 'Employee':
        this.setState({
          lastSort: this.state.sort,
          sort: 'name',
          reverse: !reverseValue
        })
      break;
      case 'Subtotal':
        this.setState({
          lastSort: this.state.sort,
          sort: 'subtotal',
          reverse: !reverseValue
        })
      break;
      case 'Tax':
        this.setState({
          lastSort: this.state.sort,
          sort: 'tax',
          reverse: !reverseValue
        })
      break;
      case 'Total':
        this.setState({
          lastSort: this.state.sort,
          sort: 'total',
          reverse: !reverseValue
        })
      break;
      case 'Shipping':
        this.setState({
          lastSort: this.state.sort,
          sort: 'shipping',
          reverse: !reverseValue
        })
      break;
      default:
        this.setState({
          lastSort: this.state.sort,
          sort: ''
        })
    }
  }

  openModal = () => {
    this.setState({showModal: true})
  }

  closeModal = () => {
    this.setState({showModal: false})
  }

  logout = () => {
    lock.logout();
    localStorage.clear();
    window.history.back();
  }

  handleFilter = eventKey => {
    if (eventKey !== 'all') {
      this.setState(prevState => {
        return {
          filterBy: eventKey,
          filteredData: prevState.data.filter(i => i.fields[prevState.filter] === eventKey)
        }
      })
    } else this.setState({
      filterBy: eventKey,
      filteredData: this.state.data
    });
  }

  approveOrDenyOrders = data => {
    fetch('/api/approve-deny', {
    body: JSON.stringify(data),
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST',
    mode: 'same-origin',
  })
      .then(res => res.json())
      .then(json => {
        alert('Order Statuses Updated!')
      })
      .catch(err => console.error(err))
  }

  componentDidMount = () => {
    if (token) {
          fetch('/api/orders/' + currentId)
            .then(res => res.json())
            .then(json => {
              let orderData = json.orders
              this.setState({orders: orderData})
              this.setState(getCompanyInfo(currentId))
            })
            .then(() => {
              this.state.orders.forEach(order => {
                fetch('/api/orders/' + currentId + '/' + order.order_id)
                  .then(res => res.json())
                  .then(json => {
                    let data = this.state.data
                    data.push(json)
                    this.setState({
                      data: data,
                      filteredData: data
                    })
                  })
                  .catch(err => {
                    console.error(err)
                  })
              })
            })
            .then(() => {
              fetch('/api/users/' + currentId)
                .then(res => res.json())
                .then(json => this.setState({customers: json.users}))
                .then(() => {
                  this.setState({
                    loading: false
                  })
                })
                .catch(err => console.error(err))
            })
        .catch(err => {
          console.error(err)
        })
    }
  }

  render() {
    if (token) {
      if (!this.state.loading) {
        console.log(this.state)
        let {data, filteredData, userDetails, filter, showModal, approve, logo} = this.state;
        let orderData, userOrderData;
        let companyName = this.state.filterBy !=='all' ? this.state.companyName + ' — ' + getFilterFieldName(this.state.filter) + ' ' + this.state.filterFields[this.state.filterBy].split(' ')[0] : this.state.companyName;
        let chartData = []
        let tooltipContent;
        let companyTotal = 0;
        let totalSpend = '';
        let userData = '';
        let userHeaders, userSpendData;
        let totalOrders = '';
        let totalProductCount = 0;
        let productsPurchased = '';
        let orderTotals = [];
        let tableData;
        let headers = [];
        let totalSpendRemaining = 0;
        let spendRemaining;
        let modalData, modalTitle;
        let userTotals = [];
        let dropdownItems;
        const customerIDs = [...new Set(this.state.customers.map(item => item.user_id))]
        let currentData = filteredData.filter(i => customerIDs.indexOf(i.user_id) !== -1);
        let approvedOrders = this.state.approve ? currentData.filter(i => i.status === 'P') : currentData.filter(i => i.status !== 'I')
            //populate orders array
            approvedOrders.forEach(i => {
              let orderNumber = i.order_id;
              let date = moment.unix(i.timestamp).format('MMMM DD, YYYY');
              let username = i.b_firstname ? i.b_firstname + ' ' + i.b_lastname : i.email;
              let shipping = +i.display_shipping_cost;
              let tax = +i.tax_subtotal;
              let subtotal = i.subtotal;
              let total = +i.total || shipping + tax + subtotal;
              orderTotals.push({
                orderNumber: orderNumber,
                date:date,
                name: username,
                subtotal: subtotal,
                shipping: shipping,
                tax: tax,
                total: total
              })
            });
          //filter menu dropdown items
          dropdownItems = [...new Set(data.map(item => item.fields[this.state.filter]).filter(item => !!item).sort((a,b) => +a - +b))];
          dropdownItems = dropdownItems.map((item, index) => <MenuItem key={index} eventKey={item}>{this.state.filterFields[item] || item}</MenuItem>)

          //get unique users && create dataset for each
          const uniqueUsers = [...new Set(approvedOrders.map(item => item.user_id))];
          totalSpendRemaining = 0;

          uniqueUsers.forEach(user => {
            let userWallet = this.getWalletBalance(user) || 0;
            //console.log(userWallet)
            let userName = approvedOrders.filter(i=>i.user_id === user);
            userName = userName && userName[0].b_firstname ? userName[0].b_firstname + ' ' + userName[0].b_lastname : userName[0].email;
            let currentTotal = 0;
            let numOfOrders = 0;
            for (let i = 0; i < approvedOrders.length; i++) {
              if (user === approvedOrders[i].user_id) {
                numOfOrders++;
                let shipping = +approvedOrders[i].display_shipping_cost;
                let tax = +approvedOrders[i].tax_subtotal;
                let subtotal = approvedOrders[i].subtotal;
                let total = +approvedOrders[i].total || shipping + tax + subtotal;
                currentTotal += total;
              }
            }

            if (this.state.maxSpend > 0 && currentTotal > this.state.maxSpend) currentTotal = this.state.maxSpend;

            companyTotal += currentTotal;
            totalSpendRemaining += +userWallet.current_cash || 0;

            let userSpendRemaining = +userWallet.current_cash || this.state.maxSpend - currentTotal;
            if (userSpendRemaining < 0) userSpendRemaining = 0;
            userTotals.push({
              name: userName,
              orders: numOfOrders,
              total: +currentTotal,
              spendRemaining: userSpendRemaining
            })
          });
          let sortedOrders = sortCollection(orderTotals, this.state.sort, this.state.reverse);

          //format orders for order table
          headers = ['Order Number', 'Order Date', 'Employee', 'Subtotal', 'Shipping', 'Tax', 'Total'].map((item, index) => <th key={index} data-sort={item} onClick={this.sortFactor}>{item}</th>);
          tableData = sortedOrders.map((item, index) => {
            return <tr key={item.orderNumber} data-order={item.orderNumber} onClick={this.setActiveOrder}>{_.map(item, (i, key) => <td key={key}>{i}</td>)}</tr>
          })
          //format users for user spend table
          userHeaders = ['Employee'].map((item, index) => <th key={index} data-sort={item} onClick={this.sortFactor}>{item}</th>);
          userSpendData = _.uniq(orderTotals, 'name').map((item, index) => {
            return <tr key={item.name} data-user={item.name} onClick={this.setActiveUser}>{_.map(item, (i, key) => {return key === 'name' ? <td key={i}>{i}</td> : null})}</tr>
          })

          //number of orders
          totalOrders = <h3>Number of Orders: <span className='green-text'>{approvedOrders.length}</span></h3>

          //total products purchased
          totalProductCount = approvedOrders.map(i => i.products)
          let numOfProducts = 0;
          for (let i = 0; i < totalProductCount.length; i++) {
            numOfProducts += Object.keys(totalProductCount[i]).length
          }
          productsPurchased = <h3>Total Products Purchased: <span className='green-text'>{numOfProducts}</span> </h3>

          //sort user spend data for display
          userTotals = _.sortBy(userTotals, 'total').reverse();
          //format user spend data for chart
          chartData = userTotals.map(user => {return {'name': user.name,'total': user.total}});
          tooltipContent = chartData.map(item => {return {'name': item.name,'total': '$' + item.total.toFixed(2)}});
          //update UI
          totalSpend = <h2>Total Spend 2018: <span className='green-text'>${companyTotal.toFixed(2)}</span></h2>
          spendRemaining = <h2>Amount Remaining 2018: <span className='green-text'>${+totalSpendRemaining.toFixed(2)}</span></h2>
          userData = userTotals.map((user, index) => {
            const textColor = user.total <= this.state.maxSpend ? 'green-text' : 'red-text';
            return <h3 key={index}>{user.name}: <span className={textColor}>${user.total.toFixed(2)}</span></h3>
          });
          //get data for current order
        if (this.state.activeOrder !== 0) {
          orderData = data.filter(item => {
            let num = this.state.activeOrder
            return item.order_id === num;
          }).map(item => item.products)
            orderData = orderData[0] ? _.map(orderData[0], (item, index) => {
              //strip html and options from item description
              let description = item.product.split('<', 1)[0];
            return <tr key={index}><td>{item.product_code}</td><td>{description}</td><td>${+item.price}</td><td>{item.amount}</td><td>${+(item.price * item.amount).toFixed(2)}</td></tr>
          }) : orderData;
      }

        //get data for current customer
        if (this.state.activeUser) {
          userOrderData = approvedOrders.filter(item => {
            let email = validateEmail(this.state.activeUser)
            let user = email ? item.email : item.firstname + ' ' + item.lastname
            return user === this.state.activeUser
          }).map(item => item.products)
            userOrderData = _.map(userOrderData, (order, index) => {
              return _.map(order, (item, index) => {
                let description = item.product.split('<', 1)[0];
                return <tr key={index}><td>{item.product_code}</td><td>{description}</td><td>${+item.price}</td><td>{item.amount}</td><td>${+(item.price * item.amount).toFixed(2)}</td></tr>

              })
            })
      }
        userDetails = _.first(userTotals.filter(item => item.name === this.state.activeUser));
        const approveOrderData = data.filter(o => o.status === 'O')
        modalData = this.state.activeOrder !== 0 ? orderData : userOrderData;
        modalTitle = this.state.activeOrder !== 0 ? 'Order #' + this.state.activeOrder : 'Shopper Profile for ' + this.state.activeUser;

        return (
          <Router>
            <div className='container-fluid'>
              <Switch>
                <Route path='/' render={()=> <Dashboard
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
                  productsPurchased={productsPurchased}
                  chartData={chartData}
                  tooltipContent={tooltipContent}
                  headers={headers}
                  tableData={tableData}
                  modalTitle={modalTitle}
                  modalData={modalData}
                  userDetails={userDetails}
                  showModal={showModal}
                  openModal={this.openModal}
                  closeModal={this.closeModal}
                  setActiveOrder={this.setActiveOrder}
                  filter={getFilterFieldName(filter)}
                  dropdownItems={dropdownItems}
                  handleFilter={this.handleFilter}
                  logout={this.logout}
                />} />
              </Switch>
            </div>
          </Router>

        )} else {
          return (
            <div className='container-fluid'>
                <Loading className='loading' type='cylon' color='#222' width='20vw'/>
                <h1>Loading, please wait...</h1>
          </div>
          )
        }
    } else {
      lock.show()
    }
  }
}

export default App;
