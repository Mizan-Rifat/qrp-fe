import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
// creates a beautiful scrollbar
// import PerfectScrollbar from 'perfect-scrollbar';
// import 'perfect-scrollbar/css/perfect-scrollbar.css';

import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
// core components
import Navbar from 'components/Navbars/Navbar.js';
import Footer from 'components/Footer/Footer.js';
import Sidebar from 'components/Sidebar/Sidebar.js';
import FixedPlugin from 'components/FixedPlugin/FixedPlugin.js';

import { routes, navMenu } from 'routes.js';

import styles from 'assets/jss/material-dashboard-react/layouts/adminStyle.js';

import bgImage from 'assets/img/sidebar-2.jpg';
import logo from 'assets/img/reactlogo.png';
import Users from 'views/Users/Users';
import Chat from 'views/Chat/Chat';
import Messages from 'views/Chat/Messages';
import UserDetails from 'views/UserDetails/UserDetails';

let ps;

const useStyles = makeStyles(styles);

export default function Admin({ ...rest }) {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [image, setImage] = React.useState(bgImage);
  const [color, setColor] = React.useState('blue');
  const [fixedClasses, setFixedClasses] = React.useState('dropdown');
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleImageClick = image => {
    setImage(image);
  };
  const handleColorClick = color => {
    setColor(color);
  };
  const handleFixedClick = () => {
    if (fixedClasses === 'dropdown') {
      setFixedClasses('dropdown show');
    } else {
      setFixedClasses('dropdown');
    }
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  // initialize and destroy the PerfectScrollbar plugin
  // React.useEffect(() => {
  //   if (navigator.platform.indexOf('Win') > -1) {
  //     ps = new PerfectScrollbar(mainPanel.current, {
  //       suppressScrollX: true,
  //       suppressScrollY: false
  //     });
  //     document.body.style.overflow = 'hidden';
  //   }
  //   window.addEventListener('resize', resizeFunction);
  //   // Specify how to clean up after this effect:
  //   return function cleanup() {
  //     if (navigator.platform.indexOf('Win') > -1) {
  //       ps.destroy();
  //     }
  //     window.removeEventListener('resize', resizeFunction);
  //   };
  // }, [mainPanel]);
  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={navMenu}
        logoText={'QRP Consulting'}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        {...rest}
      />
      {/* <PerfectScrollbar> */}
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar routes={navMenu} handleDrawerToggle={handleDrawerToggle} {...rest} />
        <div className={classes.content}>
          <div className={classes.container}>
            <Switch>
              <Route
                exact
                path="/staffs"
                render={props => <Users {...props} type={['Pharmacist', 'Other']} />}
              />
              <Route exact path="/user/:id" component={UserDetails} />
              <Route
                exact
                path="/pharmacy-owners"
                render={props => <Users {...props} type={['pharmacyOwner']} />}
              />
              <Route exact path="/messages" component={Messages} />
              <Redirect from="/" to="/dashboard" />
            </Switch>
          </div>
        </div>
        {/* {getRoute() ? <Footer /> : null} */}
      </div>
      {/* </PerfectScrollbar> */}
    </div>
  );
}
