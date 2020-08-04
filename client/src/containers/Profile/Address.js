import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddAddressModal from './AddAddressModal';
import UpdateAddressModal from './UpdateAddressModal';
import csc from 'country-state-city';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  getCurrentUser,
  getSignedInWith,
  getAddressAddresses,
  getAddressActiveAddress,
  getLangLang
} from '../../store/selectors';
import {
  updateProfile,
  getAddresses,
  deleteAddress,
  updateActiveAddress,
  getActiveAddress,
  changeAddressInitialValues,
} from '../../store/actions';
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
    padding: theme.spacing(5, 3, 0),
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  mainSec: {
    flex: 15,
    width: '100%',
    overflowY: 'auto',
    padding: theme.spacing(3),
    backgroundColor: '#fff',
  },
  image: {
    backgroundColor: '#f5f5f5',
    width: '30%',
    borderRadius: '100px',
  },
  pageTitle: {
    color: '#333',
    fontSize: '1.3rem',
    fontWeight: 'normal',
    marginTop: theme.spacing(1),
  },
  tabText: {
    fontWeight: '300',
    fontSize: '0.7rem',
  },
  tabPanel: {
    paddingTop: '20px',
  },
  actionBtn: {
    // borderRadius: '50px',
    position: 'absolute',
    right: '30px',
    bottom: '120px',
    padding: theme.spacing(1.5, 3),
  },
  formControl: {
    width: '100%',
  },
  noAddress: {
    textAlign: 'center',
    color: '#333',
    fontWeight: '300',
    fontSize: '1rem',
    padding: '10%',
  },
  addressElem: {
    verticalAlign: 'top',
    marginBottom: '40px',
  },
  addressElemLeft: {
    display: 'inline-block',
    width: '90%',
  },
  addressElemRight: {
    display: 'inline-block',
    width: '9%',
  },
  addressElemTitle: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: '1rem',
    marginBottom: '5px',
  },
  addressElemInfo: {
    color: '#333',
    fontWeight: '300',
    fontSize: '0.8rem',
  },
});

class Address extends React.Component {
  constructor(props) {
    super();

    var lang = props.lang ? props.lang.abbr.toLowerCase() : 'en';
    this.state = {
      me: props.me,
      addresses: null,
      selectAddress: null,
      isVisibleAddAddressDlg: false,
      isVisibleUpdateAddressDlg: false,
      _t: translation[lang],
      direction: lang === 'ar' ? 'rtl' : 'ltr'
    };

    this.activeAddress = this.activeAddress.bind(this);
    this.onClickAddressElem = this.onClickAddressElem.bind(this);
    this.closeAddAddressDlg = this.closeAddAddressDlg.bind(this);
    this.closeUpdateAddressDlg = this.closeUpdateAddressDlg.bind(this);
    this.activeAddress = this.activeAddress.bind(this);
    this.updateAddresses = this.updateAddresses.bind(this);
  }

  componentWillMount() {
    const { me } = this.props;

    this.props.getAddresses(me.id).then(() => {
      if (this.props.errorMessage) {
        console.log('-- error : ', this.props.errorMessage);
        return;
      }

      var addresses = this.props.addresses;
      this.setState({ addresses });
    });
  }

  componentWillReceiveProps(nextProps, nextState) {
    const { lang } = this.props;

    if (
      (!lang && nextProps.lang) ||
      (lang && nextProps.lang && lang.abbr !== nextProps.lang.abbr)
    ) {
      this.setState({
        _t: translation[nextProps.lang.abbr.toLowerCase()],
        direction: nextProps.lang.abbr === 'AR' ? 'rtl' : 'ltr'
      });
    }
  }

  closeAddAddressDlg() {
    this.setState({
      isVisibleAddAddressDlg: false,
    });
  }

  closeUpdateAddressDlg() {
    this.setState({
      isVisibleUpdateAddressDlg: false,
    });
  }

  activeAddress(addressId) {
    const { me } = this.props;

    return this.props.updateActiveAddress(me.id, addressId).then(() => {
      if (this.props.errorMessage) {
        console.log('-- error : ', this.props.errorMessage);
        return;
      }

      this.setState({
        addresses: this.props.addresses,
      });
    });
  }

  onClickAddressElem(addressInfo) {
    const { addressName, countryId, stateId, cityId, address } = addressInfo;
    this.props.changeAddressInitialValues({
      addressName,
      countryId,
      stateId,
      cityId,
      address,
    });

    this.setState({
      selectAddress: addressInfo,
      isVisibleUpdateAddressDlg: true,
    });
  }

  renderAddresses() {
    const { classes } = this.props;
    const { addresses, _t } = this.state;
    
    if (addresses && addresses.length > 0) {
      var addressElems = [];
      addresses.map((address) => {
        var country = csc.getCountryById(address.countryId);
        var state = csc.getStateById(address.stateId);
        var city = csc.getCityById(address.cityId);
        var addressInfo = `${address.address}, ${city.name}, ${state.name}, ${country.name}`;
        var checkImage = address.active
          ? '/images/Checkbox-1.png'
          : '/images/Checkbox.png';
        addressElems.push(
          <div className={classes.addressElem} key={address._id}>
            <div
              className={classes.addressElemLeft}
              onClick={this.onClickAddressElem.bind(this, address)}
            >
              <div className={classes.addressElemTitle}>
                {address.addressName}
              </div>
              <div className={classes.addressElemInfo}>{addressInfo}</div>
            </div>
            <div className={classes.addressElemRight}>
              <IconButton
                color="inherit"
                aria-label="active address"
                onClick={this.activeAddress.bind(this, address._id)}
              >
                <img src={checkImage} alt=""/>
              </IconButton>
            </div>
          </div>
        );

        return address;
      });
      return <div>{addressElems}</div>;
    } else {
      return (
        <div className={classes.noAddress}>
          {_t.profile.no_address}
        </div>
      );
    }
  }

  updateAddresses(addresses) {
    this.setState({ addresses: addresses });
  }

  render() {
    const { classes } = this.props;
    const {
      isVisibleAddAddressDlg,
      isVisibleUpdateAddressDlg,
      selectAddress,
      _t
    } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.paper}>
          <div className={classes.topSec}>
            <Typography
              component="p"
              variant="h6"
              className={classes.pageTitle}
            >
              {_t.profile.shipping_address}
            </Typography>
          </div>
          <div className={classes.mainSec}>
            <div className={classes.tabPanel}>{this.renderAddresses()}</div>
          </div>

          <Button
            className={classes.actionBtn}
            color="secondary"
            variant="contained"
            onClick={() => {
              this.props.changeAddressInitialValues({
                addressName: '',
                countryId: '',
                stateId: '',
                cityId: '',
                address: '',
              });
              this.setState({ isVisibleAddAddressDlg: true });
            }}
          >
            {_t.profile.new_address}
          </Button>
          {isVisibleAddAddressDlg && (
            <AddAddressModal
              updateAddresses={this.updateAddresses}
              closeModal={this.closeAddAddressDlg}
            />
          )}
          {isVisibleUpdateAddressDlg && (
            <UpdateAddressModal
              updateAddresses={this.updateAddresses}
              closeModal={this.closeUpdateAddressDlg}
              selectAddress={selectAddress}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    me: getCurrentUser(state),
    authProvider: getSignedInWith(state),
    addresses: getAddressAddresses(state),
    activeAddress: getAddressActiveAddress(state),
    lang: getLangLang(state),
  };
};

export default compose(
  connect(mapStateToProps, {
    updateProfile,
    getAddresses,
    deleteAddress,
    updateActiveAddress,
    getActiveAddress,
    changeAddressInitialValues,
  }),
  withStyles(styles)
)(Address);
