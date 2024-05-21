export type CountriesState = {
  countryCode: string;
  countryName: string;
  currencyCode: string;
  population: number;
  capital: string;
  continentName: string;
}[];

export type CountriesResponse = {
  message: string;
  total: number;
  data: {
    countries: {
      country: CountriesState;
    };
  };
};

export type ResponseData = {
  response: CountriesResponse;
  status: number;
};

export type FetchCountriesResponse = ResponseData | undefined;
