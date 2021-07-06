/*!

=========================================================
* Material Dashboard React - v1.10.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

// core components
import Admin from 'layouts/Admin.js';
import Parse from 'parse';
import 'assets/css/material-dashboard-react.css?v=1.10.0';
import { Provider } from 'react-redux';
import { store } from 'redux/store';
import Login from 'views/Login/Login';

// /**Initialize parse server SDK */
// Parse.initialize('99D9878682A5446B818BC5674A46AF6F88F66C1A');
// Parse.masterKey = '88C2DC1F2055381075ED07CF2E8032A86B4D35FC';
// Parse.serverURL = 'https://qrps.app/parse';

Parse.initialize('myAppId');
Parse.masterKey = 'myMasterKey';
Parse.serverURL = 'http://localhost:1337/parse';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/admin/login" component={Login} />
        <Route path="/admin" component={Admin} />
        <Redirect from="/" to="/admin/dashboard" />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
