import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect, HashRouter } from 'react-router-dom';

// core components
import Admin from 'layouts/Admin.js';
import Parse from 'parse';
import 'assets/css/material-dashboard-react.css?v=1.10.0';
import { Provider } from 'react-redux';
import { store } from 'redux/store';
import Login from 'views/Login/Login';
import { AdminProtectedRoute } from 'components/routes/AdminProtecedRoute';
import { GuestProtectedRoute } from 'components/routes/GuestProtectedRoute';
import { SnackbarProvider } from 'notistack';
import { ConfirmationServiceProvider } from './hooks/useConfirmation/ConfirmationService';

Parse.initialize('99D9878682A5446B818BC5674A46AF6F88F66C1A');
Parse.masterKey = '88C2DC1F2055381075ED07CF2E8032A86B4D35FC';
// Parse.serverURL = 'https://qrps.app/parse';
Parse.serverURL = 'http://localhost:1338/parse';

ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider>
      <Provider store={store}>
        <ConfirmationServiceProvider>
          <HashRouter>
            <Switch>
              {/* <Route path="/login" component={Login} /> */}
              <GuestProtectedRoute path="/login" component={Login} />
              <AdminProtectedRoute>
                <Route path="/" component={Admin} />
              </AdminProtectedRoute>
            </Switch>
          </HashRouter>
        </ConfirmationServiceProvider>
      </Provider>
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
