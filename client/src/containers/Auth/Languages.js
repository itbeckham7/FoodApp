import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import { ChevronDown, ChevronUp } from 'mdi-material-ui';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getLangs, getLang, setLang } from '../../store/actions';
import {
  getLangLangs,
  getLangLang,
  getLangProcessing,
  getLangError,
} from '../../store/selectors';
import config from '../../config';

const styles = (theme) => ({
  langButtonWrap: {
    position: 'absolute',
    left: 0,
    top: '20px',
    width: '100%',
    textAlign: 'center',
  },
  langButton: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    width: '55px',
    height: '25px',
    paddingLeft: '18px',
    '&:hover': {
      backgroundColor: '#fff',
    },
  },
  langListWrap: {
    width: '100px',
    display: 'inline-block',
    position: 'absolute',
    top: '30px',
    left: 'calc( 50% - 50px )',
  },
  langListElem: {
    width: '100%',
    textAlign: 'left',
    padding: '5px 0 5px 10px',
    backgroundColor: '#fff',
    '&:hover': {
      backgroundColor: '#eee',
    },
  },
  langListElemImg: {
    width: '20px',
    verticalAlign: 'middle',
  },
  langListElemArrow: {
    verticalAlign: 'middle',
    color: '#E5293E',
  },
  langListElemText: {
    color: '#333',
    fontSize: '0.8rem',
    paddingLeft: '10px',
  },
});

class Languages extends React.Component {
  state = {
    langs: [],
    lang: null,
    isVisibleLangList: false,
  };

  constructor() {
    super();

    this.onClickLang = this.onClickLang.bind(this);
    this.onSelectLang = this.onSelectLang.bind(this);
  }

  componentWillMount() {
    this.props.getLangs().then(() => {
      if (this.props.errorMessageLang) {
        console.log('-- error : ', this.props.errorMessageLang);
        return;
      }

      this.setState({
        langs: this.props.langs,
      });

      this.props.getLang();

      var that = this;
      setTimeout(function () {
        if (that.props.lang) {
          that.props.setLang(that.props.lang);
          that.setState({
            lang: that.props.lang,
          });
        } else {
          that.props.setLang(that.props.langs[0]);
          that.setState({
            lang: that.props.langs[0],
          });
        }
      }, 100);
    });
  }

  onClickLang() {
    const {isVisibleLangList} = this.state;
    this.setState({
      isVisibleLangList: !isVisibleLangList,
    });
  }

  onSelectLang(lang) {
    this.props.setLang(lang);
    this.setState({
      isVisibleLangList: false,
      lang: lang,
    });
  }

  render() {
    const { classes } = this.props;
    const { langs, lang, isVisibleLangList } = this.state;

    var langsElem = [];
    if (langs && langs.length > 0) {
      langs.map((lang, index) => {
        var elemStyle = {};
        if( index === 0 ){
          elemStyle = {
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
            borderBottom: '1px solid #ddd',
          }
        } else if( index === langs.length-1 ){
          elemStyle = {
            borderBottomLeftRadius: '5px',
            borderBottomRightRadius: '5px',
          }
        } else {
          elemStyle = {
            borderBottom: '1px solid #ddd',
          }
        }
        langsElem.push(
          <div
            className={classes.langListElem}
            onClick={this.onSelectLang.bind(this, lang)}
            key={lang.abbr}
            style={elemStyle}
          >
            <img
              src={config.serverUrl + '/assets/images/' + lang.flag}
              className={classes.langListElemImg}
              alt=""
            />
            <span className={classes.langListElemText}>{lang.name}</span>
          </div>
        );

        return lang
      });
    }

    var langImg = lang ? lang.flag : 'en.png';
    return (
      <div className={classes.langButtonWrap}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={this.onClickLang}
          className={classes.langButton}
        >
          <img
            src={config.serverUrl + '/assets/images/' + langImg}
            className={classes.langListElemImg}
            alt=""
          />
          {!isVisibleLangList && <ChevronDown className={classes.langListElemArrow} fontSize="small" />}
          {isVisibleLangList && <ChevronUp className={classes.langListElemArrow} fontSize="small" />}
        </IconButton>
        {isVisibleLangList && (
          <div className={classes.langListWrap}>{langsElem}</div>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    langs: getLangLangs(state),
    lang: getLangLang(state),
    isProcessingLang: getLangProcessing(state),
    errorMessageLang: getLangError(state),
  };
};

export default compose(
  connect(mapStateToProps, {
    getLangs,
    getLang,
    setLang,
  }),
  withStyles(styles)
)(Languages);
