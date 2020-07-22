import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { ChevronRight } from 'mdi-material-ui';
import { getCurrentUser, getSignedInWith } from '../../store/selectors';
import { email, minLength, required } from '../../utils/formValidator';
import { updateProfile, signOut } from '../../store/actions';

const styles = (theme) => ({
  root: {
    height: '100%',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
  },
  topSec: {
    flex: 1,
    width: '100%',
    position: 'relative',
    padding: theme.spacing(10, 3, 0),
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  topImage: {
    display: 'inline-block',
    width: '30%',
    verticalAlign: 'middle',
  },
  topInfo: {
    display: 'inline-block',
    width: '65%',
    verticalAlign: 'middle',
    paddingLeft: '20px',
    textAlign: 'left',
  },
  image: {
    backgroundColor: '#f5f5f5',
    width: '100%',
    borderRadius: '100px',
  },
  nameText: {
    color: '#333',
    fontSize: '1.3rem',
    fontWeight: 'normal',
    marginBottom: theme.spacing(1),
  },
  emailText: {
    color: '#333',
    fontSize: '1rem',
    fontWeight: 'normal',
    marginBottom: theme.spacing(1),
  },
  mainSec: {
    flex: 4,
    width: '100%',
    overflowY: 'auto',
    padding: theme.spacing(3),
    backgroundColor: '#fff',
  },

  menuElem: {
    marginBottom: '20px'
  },
  menuIcon: {
    padding: '2px'
  },
  menuText: {
    fontSize: '18px',
    lineHeight: '18px',
    padding: '13px'
  },
  tabText: {
    fontWeight: '300',
    fontSize: '0.7rem',
  },
  tabPanel: {
    paddingTop: '20px',
  },
  actionBtn: {
    borderRadius: '50px',
    margin: theme.spacing(2, 0),
  },
});

class Profile extends React.Component {
  state = {
    tabValue: 'general',
  };

  constructor() {
    super();
  }
  renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => {
    return (
      <TextField
        label={label}
        error={touched && !!error}
        helperText={touched && error}
        variant="outlined"
        margin="none"
        required
        fullWidth
        {...input}
        {...custom}
        value={input.value}
        style={{ padding: '5px', marginBottom: '20px' }}
        size="small"
      />
    );
  };

  render() {
    const { me, classes, authProvider, handleSubmit } = this.props;
    const { tabValue } = this.state;

    let picture = '';
    if (me.provider) {
      picture = me.provider[authProvider].picture;
    }

    picture = picture ? picture : '/logo-circle512.png';

    return (
      <div className={classes.root}>
        <div className={classes.paper}>
          <div  className={classes.topSec}>
            <div className={classes.topImage}>
              <img alt="avatar" src={picture} className={classes.image} />
            </div>
            <div className={classes.topInfo}>
              <Typography
                variant="h4"
                color="textSecondary"
                component="h4"
                className={classes.nameText}
              >
                {me.firstName} {me.lastName}
              </Typography>
              <Typography
                variant="h4"
                color="textSecondary"
                component="h4"
                className={classes.emailText}
              >
                {me.email}
              </Typography>
            </div>
          </div>
          <div  className={classes.mainSec}>
            <Grid container className={classes.menuElem} onClick={() => {this.props.history.push('/profile/general');}}>
              <Grid xs={2} item className={classes.menuIcon}>
                <img src={'/images/Icon_Edit-Profile.png'} />
              </Grid>
              <Grid xs={8} item className={classes.menuText}>Edit Profile</Grid>
              <Grid xs={2} item className={classes.menuNav}>
                <IconButton color="#333">
                  <ChevronRight />
                </IconButton>
              </Grid>
            </Grid>

            <Grid container className={classes.menuElem} onClick={() => {this.props.history.push('/profile/address');}}>
              <Grid xs={2} item className={classes.menuIcon}>
                <img src={'/images/Icon_Location.png'} />
              </Grid>
              <Grid xs={8} item className={classes.menuText}>Shipping Address</Grid>
              <Grid xs={2} item className={classes.menuNav}>
                <IconButton color="#333">
                  <ChevronRight />
                </IconButton>
              </Grid>
            </Grid>

            <Grid container className={classes.menuElem} onClick={() => {this.props.history.push('/profile/card');}}>
              <Grid xs={2} item className={classes.menuIcon}>
                <img src={'/images/Icon_Payment.png'} />
              </Grid>
              <Grid xs={8} item className={classes.menuText}>Cards</Grid>
              <Grid xs={2} item className={classes.menuNav}>
                <IconButton color="#333">
                  <ChevronRight />
                </IconButton>
              </Grid>
            </Grid>

            <Grid container className={classes.menuElem} onClick={() => {this.props.history.push('/profile/orderhistory');}}>
              <Grid xs={2} item className={classes.menuIcon}>
                <img src={'/images/Icon_History.png'} />
              </Grid>
              <Grid xs={8} item className={classes.menuText}>Order History</Grid>
              <Grid xs={2} item className={classes.menuNav}>
                <IconButton color="#333">
                  <ChevronRight />
                </IconButton>
              </Grid>
            </Grid>

            <Grid container className={classes.menuElem} onClick={() => {this.props.signOut()}}>
              <Grid xs={2} item className={classes.menuIcon}>
                <img src={'/images/Icon_Exit.png'} />
              </Grid>
              <Grid xs={8} item className={classes.menuText}>Log Out</Grid>
              <Grid xs={2} item className={classes.menuNav}>
                <IconButton color="#333">
                  <ChevronRight />
                </IconButton>
              </Grid>
            </Grid>

            {/* <Grid container className={classes.menuElem} onClick={() => {this.props.history.push('/order/track');}}>
              <Grid xs={2} item className={classes.menuIcon}>
                <img src={'/images/Icon_Order.png'} />
              </Grid>
              <Grid xs={8} item className={classes.menuText}>Track Order</Grid>
              <Grid xs={2} item className={classes.menuNav}>
                <IconButton color="#333">
                  <ChevronRight />
                </IconButton>
              </Grid>
            </Grid> */}

            

            {/* <Grid container className={classes.menuElem} onClick={() => {this.props.history.push('/profile/notification');}}>
              <Grid xs={2} item className={classes.menuIcon}>
                <img src={'/images/Icon_Alert.png'} />
              </Grid>
              <Grid xs={8} item className={classes.menuText}>Notification</Grid>
              <Grid xs={2} item className={classes.menuNav}>
                <IconButton color="#333">
                  <ChevronRight />
                </IconButton>
              </Grid>
            </Grid> */}
          </div>
        </div>
      </div>
    );
  }
}

const validate = (values) => {
  const errors = {};
  errors.username = required(values.username);
  errors.email = required(values.email) || email(values.email);
  errors.phone = required(values.phone);
  return errors;
};

const mapStateToProps = (st) => {
  var me = getCurrentUser(st);
  const {
    firstName,
    lastName,
    username,
    email,
    phone,
    country,
    state,
    city,
    address,
  } = me;
  var initialValues = {
    firstName,
    lastName,
    username,
    email,
    phone,
    country,
    state,
    city,
    address,
  };
  return {
    me: me,
    authProvider: getSignedInWith(st),
    initialValues: initialValues,
  };
};

export default compose(
  connect(mapStateToProps, { updateProfile, signOut }),
  reduxForm({ form: 'profile', validate }),
  withStyles(styles)
)(Profile);
