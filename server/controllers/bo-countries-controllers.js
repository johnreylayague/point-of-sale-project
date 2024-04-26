const countriesJson = require("../json/countries.json");

const getCountries = async (req, res, next) => {
  const searchTerm = req.query.search;
  const countryCode = req.params.code;

  let countries = countriesJson;

  if (countryCode) {
    countries = countriesJson.countries.country.filter(
      (country) =>
        country.countryCode.toLowerCase() == countryCode.toLowerCase()
    );
  }

  if (searchTerm) {
    const searchKey = ["countryName"];
    countries = countriesJson.countries.country.filter((country) => {
      for (const iterator of searchKey) {
        if (new RegExp(searchTerm, "i").test(country[iterator])) {
          return true;
        }
        return false;
      }
    });
  }

  res.status(200).json({
    message: "sucessfully retrieved records",
    data: countries,
  });
};

exports.getCountries = getCountries;
