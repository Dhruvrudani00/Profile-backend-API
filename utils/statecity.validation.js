import { Statecity } from "../models/statecity.models.js";

export const isValidCityForState = async (state, city) => {
  const stateData = await Statecity.findOne({ stateName: state });

  if (!stateData) {
    return {
      isValid: false,
      message: `State '${state}' is not available in database`,
    };
  }

  const isCityValid = stateData.cityName.includes(city);
  return {
    isValid: isCityValid,
    message: isCityValid ? null : `${city} is not a valid city in ${state}`,
  };
};
