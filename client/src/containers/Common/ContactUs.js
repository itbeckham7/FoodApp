import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  getBagProcessing,
  getBagError,
  getCurrentUser,
  getLangLang
} from '../../store/selectors';
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
    backgroundColor: '#0B2031',
    width: '100%',
    position: 'relative',
    padding: theme.spacing(12, 3, 0),
  },
  pageTitleSec: {
    textAlign: 'center',
    padding: theme.spacing(1, 0),
    marginBottom: theme.spacing(0.5),
  },
  pageTitleText: {
    color: '#fff',
    fontWeight: 'normal',
    fontSize: '1.4rem',
  },
  mainSec: {
    flex: 4,
    width: '100%',
    overflowY: 'auto',
  },
  infoSec: {
    padding: theme.spacing(1, 3),
  },
  infoTitleSec: {
    textAlign: 'center',
  },
  infoSecTitle: {
    display: 'inline-block',
    verticalAlign: 'middle',
    width: '60vw',
    color: '#0B2031',
    fontSize: '1rem',
    fontWeight: 'normal',
    marginLeft: theme.spacing(2),
    textAlign: 'right',
  },
  infoContentSec: {
    marginTop: '15px',
  },
  contactElem: {
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: theme.spacing(1),
    marginBottom: '40px'
  },
  contactElemSub: {
    textAlign: 'center',
  },
  contactElemText: {
    display: 'inline-block',
    color: '#0B2031',
    fontSize: '0.75rem',
    fontWeight: 'normal',
    verticalAlign: 'middle',
    textAlign: 'center',
  },
  contactElemImage: {
    display: 'inline-block',
    marginRight: '10px',
    verticalAlign: 'middle'
  },
  roundBtn: {
    borderRadius: '50px',
    backgroundColor: '#E5293E',
    '&:hover,&:focus': {
      backgroundColor: '#E5293E',
    },
  },
});

class ContactUs extends React.Component {

  constructor(props) {
    super();
    
    var lang = props.lang ? props.lang.abbr.toLowerCase() : 'en';
    this.state = {
      _t: translation[lang],
    };
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps, nextState) {
    const { lang } = this.props;

    if (
      (!lang && nextProps.lang) ||
      (lang && nextProps.lang && lang.abbr !== nextProps.lang.abbr)
    ) {
      this.setState({
        _t: translation[nextProps.lang.abbr.toLowerCase()],
      });
    }
  }

  renderContactInfo() {
    const { classes } = this.props;
    
    var contactElems = [];
    for (var i = 0; i < 5; i++) {
      contactElems.push(
        <Grid container className={classes.contactElem}>
          <Grid xs={4} item className={classes.contactElemText}>
            <Typography component="span" className={classes.contactElemText}>
              KUWAIT
            </Typography>
          </Grid>
          <Grid xs={4} item className={classes.contactElemText} style={{borderLeft: '1px solid #E5293E', borderRight: '1px solid #E5293E'}}>
            <img src="/images/phone-solid.png" className={classes.contactElemImage} alt=""/>
            <Typography component="span" className={classes.contactElemText}>
              KUWAIT
            </Typography>
          </Grid>
          <Grid xs={4} item className={classes.contactElemText}>
            <img src="/images/map-marker-alt-solid.png" className={classes.contactElemImage} alt=""/>
            <Typography component="span" className={classes.contactElemText}>
              KUWAIT
            </Typography>
          </Grid>
        </Grid>
      );
    }

    return <div>{contactElems}</div>;
  }

  render() {
    const {
      classes,
    } = this.props;
    const { _t } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.paper}>
          <div  className={classes.topSec}>
            <div className={classes.pageTitleSec}>
              <Typography
                component="p"
                variant="h6"
                className={classes.pageTitleText}
              >
                {_t.common.contact_us}
              </Typography>
            </div>
            <div
              style={{
                position: 'absolute',
                left: '0',
                bottom: '0',
                width: '100%',
                height: '40px',
                borderTopLeftRadius: '40px',
                borderTopRightRadius: '40px',
                backgroundColor: '#fff',
              }}
            ></div>
          </div>
          <div  className={classes.mainSec}>
            <div
              className={classes.infoSec}
              style={{
                paddingTop: '0',
                paddingBottom: '20px',
                backgroundColor: '#fff',
              }}
            >
              <div className={classes.infoTitleSec}>
                <img src="/images/Online-world-pana.png" alt=""/>
              </div>
              <div className={classes.infoContentSec}>
                {this.renderContactInfo()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isProcessing: getBagProcessing(state),
    errorMessage: getBagError(state),
    me: getCurrentUser(state),
    lang: getLangLang(state),
  };
};

export default compose(
  connect(mapStateToProps, {}),
  withStyles(styles)
)(ContactUs);
