const createError = require('http-errors');
const passport = require('passport');

const createAuthenticationStrategy = (strategy, admin) => (req, res, next) => {
  passport.authenticate(strategy, { session: false }, (err, user, info) => {
    if (err) {
      return next(createError(500, err));
    }
    if (!user) {
      return next(createError(401, info.message));
    }    
    
    if( admin === true && (user.role == 'user' || user.role == 'guest') ){
      return next(createError(401, 'This user can\'t login to admin pannel.'));
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = createAuthenticationStrategy;
