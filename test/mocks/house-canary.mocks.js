const config = require('config');
const nock = require('nock');

const baseUrl = config.get('clients.houseCanary.baseUrl');

/**
 * Use an HTTP interceptor to catch the outgoing request and replace it.
 * I find this approach to be much, much cleaner and easier to do than programmatic mocking.
 */
const mockGetPropertyDetails = (query, responseCode, body) => nock(baseUrl)
  .get('/property/details')
  .query(query)
  .reply(responseCode, body);

module.exports = {
  mockGetPropertyDetails,
};
