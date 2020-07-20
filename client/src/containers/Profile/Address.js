import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tab';
import Tab from '@material-ui/core/Tab';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import TabContext from '@material-ui/lab/TabContext';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import FormHelperText from '@material-ui/core/FormHelperText';
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
  getAddressProcessing,
  getAddressError,
  getAddressActiveAddress,
} from '../../store/selectors';
import {
  updateProfile,
  getAddresses,
  deleteAddress,
  updateActiveAddress,
  getActiveAddress,
  changeAddressInitialValues,
} from '../../store/actions';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
    this.state = {
      me: props.me,
      addresses: null,
      selectAddress: null,
      isVisibleAddAddressDlg: false,
      isVisibleUpdateAddressDlg: false,
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
        console.log('-- error : ', this.props.errorMessage)
        return;
      }

      this.setState({
        addresses: this.props.addresses,
      });
    });
  }

  onClickAddressElem(addressInfo) {
    const {addressName, countryId, stateId, cityId, address} = addressInfo
    this.props.changeAddressInitialValues({addressName, countryId, stateId, cityId, address});

    this.setState({
      selectAddress: addressInfo,
      isVisibleUpdateAddressDlg: true,
    });
  }

  renderAddresses() {
    const { classes } = this.props;
    const { addresses } = this.state;
    console.log('-- addresses : ', addresses);
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
          <div
            className={classes.addressElem}
            onClick={this.onClickAddressElem.bind(this, address)}
            key={address._id}
          >
            <div className={classes.addressElemLeft}>
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
                <img src={checkImage} />
              </IconButton>
            </div>
          </div>
        );
      });
      return <div>{addressElems}</div>;
    } else {
      return (
        <div className={classes.noAddress}>
          There are no addresses. Please add new address.
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
      me,
      isVisibleAddAddressDlg,
      isVisibleUpdateAddressDlg,
      selectAddress,
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
              Shipping Address
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
                address: ''
              });
              this.setState({ isVisibleAddAddressDlg: true });
            }}
          >
            New Address
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
