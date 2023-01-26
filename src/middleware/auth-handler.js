// Uncommenting the following would enable authentication.
// Leaving disabled for now for easier use of service.

/**
const config = require('config');
const { expressjwt: jwt } = require('express-jwt');

const authentication = config.get('authentication');

module.exports = jwt(authentication);
*/

module.exports = (req, res, next) => {
  next();
};
