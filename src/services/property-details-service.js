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
  // For now, we will assume an 'all or none' requirement for API calls.
  // This would be something I would otherwise verify with a product owner/manager.
  const propertyDetails = await Promise.all([
    getHouseCanaryDetails(params),
  ]);

  return {
    // Return 'true' if any response from an API call indicates septic.
    // Normally, though, I'd ask a PM on how to best reconcile this behavior.
    // This may otherwise indicate that a house has changed its sewage system recently.
    hasSeptic: !!propertyDetails.find(({ hasSeptic }) => hasSeptic),
  };
};

module.exports = {
  getPropertyDetails,
};
