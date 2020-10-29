import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Grommet } from 'grommet';

import './App.css';
import Main from './components/Main';
import { AuthProvider } from './hooks/useAuth';
import { OrdersProvider } from './hooks/useOrders';
import { FilterProvider } from './hooks/useFilter';
import { User } from 'grommet-icons';

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

const App = () => (
  <AuthProvider>
    <FilterProvider>
      <OrdersProvider>
        <Router>
          <Grommet theme={theme}>
            <Switch>
              <Route path="/" component={Main} />
            </Switch>
          </Grommet>
        </Router>
      </OrdersProvider>
    </FilterProvider>
  </AuthProvider>
);

export default App;
