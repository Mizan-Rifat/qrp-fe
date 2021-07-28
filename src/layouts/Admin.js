import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
// core components
import Navbar from 'components/Navbars/Navbar.js';
import Sidebar from 'components/Sidebar/Sidebar.js';
import { navMenu } from 'routes.js';
import styles from 'assets/jss/material-dashboard-react/layouts/adminStyle.js';
import bgImage from 'assets/img/sidebar-2.jpg';
import logo from 'assets/img/QRP_logo.png';
import Messages from 'views/Chat/Messages';
import UserDetails from 'views/UserDetails/UserDetails';
import Staffs from 'views/Staffs/Staffs';
import PharmacyOwners from 'views/PharmacyOwners/PharmacyOwners';
import usePresence from 'hooks/usePresence';

const useStyles = makeStyles(styles);

export default function Admin({ ...rest }) {
  const classes = useStyles();
  const mainPanel = React.createRef();
  const [image, setImage] = React.useState(bgImage);
  const [color, setColor] = React.useState('blue');
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  usePresence();

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
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar handleDrawerToggle={handleDrawerToggle} {...rest} />
        <div className={classes.content}>
          <div className={classes.container}>
            <Switch>
              <Route exact path="/staffs" component={Staffs} />
              <Route exact path="/user/:id" component={UserDetails} />
              <Route exact path="/pharmacy-owners" component={PharmacyOwners} />
              <Route exact path="/messages" component={Messages} />
              <Redirect from="/" to="/staffs" />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
}
