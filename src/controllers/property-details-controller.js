const { propertyDetailsService } = require('../services');

/**
 * A simple controller for collecting property details.
 * I generally prefer my controllers to be as simple and as stupid as possible.
 * I also prefer to do my request validation before controllers (usually as middleware).
 */
const getPropertyDetails = async (req, res) => {
  const { query } = req;

  const propertyDetails = await propertyDetailsService.getPropertyDetails(query);

  res.status(200).send(propertyDetails);
};

module.exports = {
  getPropertyDetails,
};
