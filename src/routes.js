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
// @material-ui/icons
import Dashboard from '@material-ui/icons/Dashboard';
import Person from '@material-ui/icons/Person';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import BubbleChart from '@material-ui/icons/BubbleChart';
import LocationOn from '@material-ui/icons/LocationOn';
import Notifications from '@material-ui/icons/Notifications';
import Unarchive from '@material-ui/icons/Unarchive';
import Language from '@material-ui/icons/Language';
// core components/views for Admin layout
import DashboardPage from 'views/Dashboard/Dashboard.js';
import UserProfile from 'views/UserProfile/UserProfile.js';
import TableList from 'views/TableList/TableList.js';
import Typography from 'views/Typography/Typography.js';
import Icons from 'views/Icons/Icons.js';
import Maps from 'views/Maps/Maps.js';
import NotificationsPage from 'views/Notifications/Notifications.js';
import UpgradeToPro from 'views/UpgradeToPro/UpgradeToPro.js';
import Users from 'views/Users/Users';
import Test from 'views/Test/Test';
import UserDetails from 'views/UserDetails/UserDetails';

export const routes = [
  {
    path: '/dashboard',
    component: DashboardPage
  },
  {
    path: '/user',
    component: UserProfile
  },
  {
    path: '/users/:id',
    component: UserDetails
  },
  {
    path: '/users',
    component: Users
  },
  {
    path: '/typography',
    component: Typography
  },
  {
    path: '/icons',
    component: Icons
  },
  {
    path: '/maps',
    component: Maps
  },
  {
    path: '/table',
    component: TableList
  },
  {
    path: '/notifications',
    component: NotificationsPage
  },
  {
    path: '/test',
    component: Test
  }
];
export const navMenu = [
  {
    path: '/staffs',
    name: 'Manage Staffs',
    icon: Person,
    layout: '/admin'
  },
  {
    path: '/pharmacy-owners',
    name: 'Pharmacy Owners',
    icon: Person,
    layout: '/admin'
  }
];
