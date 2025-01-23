import { Statecity } from "../models/statecity.models.js";

export const isValidCityForState = async (state, city, res) => {
  const stateData = await Statecity.findOne({ stateName: state });

  if (!stateData) {
    return {
      isValid: false,
      message: `State '${state}' is not available in database`,
    };
  }

  const isCityValid = stateData.cityName.includes(city);

  if (!isCityValid) {
    if (res) {
      res.status(400).json({ status: 0, message: "city is not valid" });
    }
    return {
      isValid: false,
      message: `city ${city} is not city of ${state} state`,
    };
  }

  return {
    isValid: true,
    message: "Valid city and state combination",
  };
};
