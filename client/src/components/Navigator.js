import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import { Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { push } from 'connected-react-router';
import { Tag } from 'mdi-material-ui';
import { connect } from 'react-redux';
import { compose } from 'redux';


import { getRouteCategories, getCurrentUser, getSignedInWith } from '../store/selectors';
import { signOut } from '../store/actions';

const styles = (theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
    fontSize: 16,
    fontWeight: theme.typography.fontWeightMedium,
  },
  item: {
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemCategory: {
    backgroundColor: '#000',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  logo: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginRight: theme.spacing(2),
  },
  drawerTitle: {
    color: theme.palette.common.white,
    fontSize: 20,
  },
  itemActiveItem: {
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  itemPrimary: {
    fontSize: 14,
    fontWeight: theme.typography.fontWeightMedium,
  },
  itemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
    '& svg': {
      fontSize: 20,
    },
  },
  divider: {
    marginTop: theme.spacing(0),
    backgroundColor: '#404854',
  },
});

function Navigator(props) {
  const {
    classes,
    pathname,
    routeCategories,
    onClose,
    signOut,
    push,
    me,
    authProvider,
    ...other
  } = props;
  return (
    <Drawer variant="permanent" onClose={onClose} {...other}>
      <List disablePadding onClick={onClose}>
        <ListItem
          className={clsx(
            classes.drawerTitle,
            classes.item,
            classes.itemCategory
          )}
        >
          <Tooltip title={`${me.firstName} ${me.lastName}`}>
            <IconButton
              color="inherit"
              className={classes.iconButtonAvatar}
              aria-controls="avatar-menu"
              aria-haspopup="true"
            >
              <Avatar
                src={me.provider[authProvider].picture}
                alt="My Avatar"
                className={classes.avatar}
              />
            </IconButton>
          </Tooltip>
          {me.firstName} {me.lastName}
        </ListItem>
        {routeCategories.map((category) => {
          console.log('-- category : ', category);
          if (category.isHidden) return null;
          return (
            <React.Fragment key={category.id}>
              {/* <ListItem className={classes.categoryHeader}>
                <ListItemText
                  classes={{
                    primary: classes.categoryHeaderPrimary,
                  }}
                >
                  {category.name}
                </ListItemText>
              </ListItem> */}
              {category.routes.map((route) => {
                if (route.isHidden) return null;
                return (
                  <ListItem
                    key={route.id}
                    button
                    className={clsx(
                      classes.item,
                      pathname.indexOf(route.path) > -1 &&
                        classes.itemActiveItem
                    )}
                    onClick={() => {
                      console.log('-- route.id : ', route.id);
                      if (route.id == 'signout') {
                        console.log('-- signout : ');
                        signOut();
                      } else {
                        push(route.path);
                      }
                    }}
                  >
                    <ListItemIcon className={classes.itemIcon}>
                      <route.icon />
                    </ListItemIcon>
                    <ListItemText
                      classes={{
                        primary: classes.itemPrimary,
                      }}
                    >
                      {route.name}
                    </ListItemText>
                  </ListItem>
                );
              })}

              <Divider className={classes.divider} />
            </React.Fragment>
          );
        })}
      </List>
    </Drawer>
  );
}

const mapStateToProps = (state) => ({
  pathname: state.router.location.pathname,
  routeCategories: getRouteCategories(state),
  me: getCurrentUser(state),
  authProvider: getSignedInWith(state),
});

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  connect(mapStateToProps, { signOut, push }),
  withStyles(styles)
)(Navigator);
