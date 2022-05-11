import React from 'react';
import classNames from 'classnames';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Hidden from '@material-ui/core/Hidden';
import Poppers from '@material-ui/core/Popper';
import Divider from '@material-ui/core/Divider';
// @material-ui/icons
import Person from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
// core components
import Button from 'components/CustomButtons/Button.js';
import Parse from 'parse';
import styles from 'assets/jss/material-dashboard-react/components/headerLinksStyle.js';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Badge } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(styles);

export default function AdminNavbarLinks() {
  const classes = useStyles();

  const history = useHistory();

  const { unseenMessages, fetching } = useSelector(state => state.contacts);

  const [openNotification, setOpenNotification] = React.useState(null);
  const [openProfile, setOpenProfile] = React.useState(null);
  const handleClickNotification = event => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };
  const handleCloseNotification = () => {
    setOpenNotification(null);
  };
  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };

  const handleLogout = () => {
    Parse.User.logOut().then(() => {
      history.push('/admin/login');
    });
  };
  return (
    <div>
      <Hidden mdDown>
        <div className={classes.manager}>
          <Link to="/messages">
            <Button
              color={window.innerWidth > 959 ? 'transparent' : 'white'}
              justIcon={window.innerWidth > 959}
              simple={!(window.innerWidth > 959)}
              className={classes.buttonLink}
            >
              <Badge badgeContent={unseenMessages} color="secondary">
                <MailIcon fontSize="small" className={classes.icon} />
              </Badge>
            </Button>
          </Link>
        </div>
      </Hidden>
      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? 'transparent' : 'white'}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openProfile ? 'profile-menu-list-grow' : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={classes.buttonLink}
        >
          <Person className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Button>
        <Poppers
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          className={classNames({ [classes.popperClose]: !openProfile }) + ' ' + classes.popperNav}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list-grow"
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={() => history.push('/update-password')}
                      className={classes.dropdownItem}
                    >
                      Change password
                    </MenuItem>
                    <MenuItem onClick={handleLogout} className={classes.dropdownItem}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
    </div>
  );
}
