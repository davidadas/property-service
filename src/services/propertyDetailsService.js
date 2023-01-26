const { houseCanaryClient } = require('../clients');

/**
 * Private function to standardize the format from the HouseCanary call.
 * This could be done in a separate file/package if you so desired.
 * @private
 */
const getHouseCanaryDetails = async (params) => {
  const propertyDetails = await houseCanaryClient.getPropertyDetails(params);

  const sewer = propertyDetails
      && propertyDetails.result
      && propertyDetails.result.property
      && propertyDetails.result.property.sewer;

  // Perform a lowercase and trim on string to protect against bad input.
  const hasSeptic = typeof sewer === 'string' && sewer.trim().toLowerCase() === 'septic';

  return {
    hasSeptic,
  };
};

/**
 * 'Services' for me provide the logic of controllers. Their primary function is to
 * return data back to the controller and inform the decisions controllers must make.
 */
const getPropertyDetails = async (params) => {
  const propertyDetails = await Promise.all([
    getHouseCanaryDetails(params),
  ]);

  return {
    hasSeptic: !!propertyDetails.find(({ hasSeptic }) => hasSeptic),
  };
};

module.exports = {
  getPropertyDetails,
};
