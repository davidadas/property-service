const config = require('config');
const fetch = require('node-fetch');
const querystring = require('querystring');

const configs = config.get('clients.houseCanary');
const { baseUrl, username, password } = configs;
const authorization = `${username}:${password}`;

/**
 * Makes the HTTP call to the HouseCanary service.
 * Auth is entirely driven by configuration solely because it's packaged within this service.
 * Normally, this would be a separate package and user would configure auth programmatically.
 */
const getPropertyDetails = async (query) => {
  const qs = Object.keys(query) ? `?${querystring.stringify(query)}` : '';

  const response = await fetch(`${baseUrl}/property/details${qs}`, {
    method: 'GET',
    headers: {
      // I presume HouseCanary requires base64-encoded authentication.
      Authentication: `Basic ${btoa(authorization)}`,
    },
  });

  return response.json();
};

module.exports = {
  getPropertyDetails,
};
