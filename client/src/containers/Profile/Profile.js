import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { ChevronRight } from 'mdi-material-ui';
import { getCurrentUser, getSignedInWith, getLangLang } from '../../store/selectors';
import { email, required } from '../../utils/formValidator';
import { updateProfile, signOut } from '../../store/actions';
import * as translation from '../../trans';

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

  constructor(props) {
    super();

    var lang = props.lang ? props.lang.abbr.toLowerCase() : 'en';
    this.state = {
      tabValue: 'general',
      _t: translation[lang],
      direction: lang === 'ar' ? 'rtl' : 'ltr',
    };
  }

  componentWillReceiveProps(nextProps, nextState) {
    const { lang } = this.props;

    if (
      (!lang && nextProps.lang) ||
      (lang && nextProps.lang && lang.abbr !== nextProps.lang.abbr)
    ) {
      this.setState({
        _t: translation[nextProps.lang.abbr.toLowerCase()],
        direction: nextProps.lang.abbr === 'AR' ? 'rtl' : 'ltr',
      });
    }
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
    const { me, classes, authProvider } = this.props;
    const { _t } = this.state;

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
                <img src={'/images/Icon_Edit-Profile.png'} alt=""/>
              </Grid>
              <Grid xs={8} item className={classes.menuText}>{_t.profile.edit_profile}</Grid>
              <Grid xs={2} item className={classes.menuNav}>
                <IconButton color="#333">
                  <ChevronRight />
                </IconButton>
              </Grid>
            </Grid>

            <Grid container className={classes.menuElem} onClick={() => {this.props.history.push('/profile/address');}}>
              <Grid xs={2} item className={classes.menuIcon}>
                <img src={'/images/Icon_Location.png'} alt=""/>
              </Grid>
              <Grid xs={8} item className={classes.menuText}>{_t.profile.shipping_address}</Grid>
              <Grid xs={2} item className={classes.menuNav}>
                <IconButton color="#333">
                  <ChevronRight />
                </IconButton>
              </Grid>
            </Grid>

            <Grid container className={classes.menuElem} onClick={() => {this.props.history.push('/profile/card');}}>
              <Grid xs={2} item className={classes.menuIcon}>
                <img src={'/images/Icon_Payment.png'} alt=""/>
              </Grid>
              <Grid xs={8} item className={classes.menuText}>{_t.profile.cards}</Grid>
              <Grid xs={2} item className={classes.menuNav}>
                <IconButton color="#333">
                  <ChevronRight />
                </IconButton>
              </Grid>
            </Grid>

            <Grid container className={classes.menuElem} onClick={() => {this.props.history.push('/profile/orderhistory');}}>
              <Grid xs={2} item className={classes.menuIcon}>
                <img src={'/images/Icon_History.png'} alt=""/>
              </Grid>
              <Grid xs={8} item className={classes.menuText}>{_t.profile.order_history}</Grid>
              <Grid xs={2} item className={classes.menuNav}>
                <IconButton color="#333">
                  <ChevronRight />
                </IconButton>
              </Grid>
            </Grid>

            <Grid container className={classes.menuElem} onClick={() => {this.props.signOut()}}>
              <Grid xs={2} item className={classes.menuIcon}>
                <img src={'/images/Icon_Exit.png'} alt=""/>
              </Grid>
              <Grid xs={8} item className={classes.menuText}>{_t.profile.log_out}</Grid>
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
    lang: getLangLang(st),
  };
};

export default compose(
  connect(mapStateToProps, { updateProfile, signOut }),
  reduxForm({ form: 'profile', validate }),
  withStyles(styles)
)(Profile);
