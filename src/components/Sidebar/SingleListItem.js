/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
// core components
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import styles from 'assets/jss/material-dashboard-react/components/sidebarStyle.js';

const useStyles = makeStyles(styles);

export default function SingleListItem({ route, color, label = 1 }) {
  const classes = useStyles({ label });
  let location = useLocation();

  const [open, setOpen] = useState(false);
  // // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return location.pathname.includes(routeName);
  }

  const listItemClasses = classNames({
    [' ' + classes[color]]: activeRoute(route.path)
  });
  const whiteFontClasses = classNames({
    [' ' + classes.whiteFont]: activeRoute(route.path)
  });

  const show = routes => {
    return routes.some(item => {
      if (item.hasOwnProperty('children')) {
        return show(item.children);
      } else {
        return item.path === location.pathname;
      }
    });
  };

  useEffect(() => {
    if (route.hasOwnProperty('children')) {
      setOpen(show(route.children));
    }
  }, [location.pathname]);

  return (
    <>
      <NavLink to={route.path} className={classNames(classes.item)} activeClassName="active">
        <ListItem
          button
          onClick={() => setOpen(!open)}
          className={classNames(classes.itemLink + listItemClasses, {
            [classes.nestedItem]: label > 1
          })}
        >
          {typeof route.icon === 'string' ? (
            <Icon className={classNames(classes.itemIcon, whiteFontClasses)}>{route.icon}</Icon>
          ) : (
            <route.icon className={classNames(classes.itemIcon, whiteFontClasses)} />
          )}

          <ListItemText
            primary={route.name}
            className={classNames(classes.itemText, whiteFontClasses)}
          />
          {route.hasOwnProperty('children') ? open ? <ExpandLess /> : <ExpandMore /> : ''}
        </ListItem>
      </NavLink>
      {route.hasOwnProperty('children') && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          {route.children.map(children => (
            <List key={children.name} component="div" disablePadding className={classes.listItem}>
              <SingleListItem route={children} color={color} label={label + 1} />
            </List>
          ))}
        </Collapse>
      )}
    </>
  );
}

SingleListItem.propTypes = {
  route: PropTypes.object,
  color: PropTypes.string,
  label: PropTypes.number
};
