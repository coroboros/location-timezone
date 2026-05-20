// From the United Nations: https://unterm.un.org/unterm2/en/country
// and the World Factbook: https://www.cia.gov/the-world-factbook/
const { readFileSync, writeFileSync } = require('fs');

const exists = (thing) => !(thing === undefined || thing === null || Number.isNaN(thing));

const missingCountries = {
  'Åland Islands': 'Åland',
  'American Samoa': 'The Territory of American Samoa',
  Anguilla: 'Anguilla',
  Antarctica: 'Antarctica',
  Aruba: 'Aruba',
  Bermuda: 'Bermuda',
  Bonaire: 'Bonaire, Sint Eustatius and Saba',
  'Sint Eustatius': 'Bonaire, Sint Eustatius and Saba',
  Saba: 'Bonaire, Sint Eustatius and Saba',
  'Bouvet Island': 'Bouvet Island',
  'British Indian Ocean Territory': 'The British Indian Ocean Territory',
  'British Virgin Islands': 'The Virgin Islands',
  'Cayman Islands': 'The Cayman Islands',
  'Christmas Island': 'The Territory of Christmas Island',
  'Cocos (Keeling) Islands': 'The Territory of Cocos (Keeling) Islands',
  'Cook Islands': 'The Cook Islands',
  Curaçao: 'The Country of Curaçao',
  Eswatini: 'The Kingdom of Eswatini',
  'Falkland Islands': 'The Falkland Islands',
  'Faroe Islands': 'The Faroe Islands',
  'French Guiana': 'Guyane',
  'French Polynesia': 'French Polynesia',
  'French Southern Territories': 'The French Southern and Antarctic Lands',
  Gambia: 'The Republic of The Gambia',
  Gibraltar: 'Gibraltar',
  Greenland: 'Kalaallit Nunaat',
  Guadeloupe: 'Guadeloupe',
  Guam: 'The Territory of Guam',
  'Guernsey': 'The Bailiwick of Guernsey',
  'Heard Island and McDonald Islands': 'The Territory of Heard Island and McDonald Islands',
  'Hong Kong': 'The Hong Kong Special Administrative Region of China',
  'Isle of Man': 'The Isle of Man',
  Jersey: 'The Bailiwick of Jersey',
  Kosovo: 'The Republic of Kosovo',
  Macau: 'The Macao Special Administrative Region of China',
  Martinique: 'Martinique',
  Mayotte: 'The Department of Mayotte',
  Montserrat: 'Montserrat',
  'New Caledonia': 'New Caledonia',
  'Northern Cyprus': 'The Turkish Republic of Northern Cyprus',
  Niue: 'Niue',
  'Norfolk Island': 'The Territory of Norfolk Island',
  'Northern Mariana Islands': 'The Commonwealth of the Northern Mariana Islands',
  Pitcairn: 'The Pitcairn, Henderson, Ducie and Oeno Islands',
  'Puerto Rico': 'The Commonwealth of Puerto Rico',
  Réunion: 'Réunion',
  'Saint Helena': 'Saint Helena, Ascension and Tristan da Cunha',
  'Ascension Island': 'Saint Helena, Ascension and Tristan da Cunha',
  'Svalbard and Jan Mayen': 'Svalbard and Jan Mayen',
  'Saint Barthélemy': 'The Collectivity of Saint-Barthélemy',
  'Saint Martin': 'The Collectivity of Saint-Martin',
  'Saint Pierre and Miquelon': 'The Overseas Collectivity of Saint-Pierre and Miquelon',
  'Sint Maarten': 'Sint Maarten',
  Somaliland: 'The Republic of Somaliland',
  'South Georgia and the South Sandwich Islands': 'South Georgia and the South Sandwich Islands',
  Taiwan: 'The Republic of China',
  Tokelau: 'Tokelau',
  'Tristan da Cunha': 'Saint Helena, Ascension and Tristan da Cunha',
  'Turks and Caicos Islands': 'The Turks and Caicos Islands',
  'U.S. Minor Outlying Islands': 'Baker Island, Howland Island, Jarvis Island, Johnston Atoll, Kingman Reef, Midway Atoll, Navassa Island, Palmyra Atoll, and Wake Island',
  'U.S. Virgin Islands': 'The Virgin Islands of the United States',
  'Wallis and Futuna': 'The Territory of the Wallis and Futuna Islands',
  'Western Sahara': 'The Sahrawi Arab Democratic Republic',
};

module.exports = () => {
  const countriesCsv = readFileSync(`${__dirname}/data/countries.csv`, 'utf8');
  const countryFormalNamesByCountryName = {};
  let nbCountries = 0;

  countriesCsv.split('\n').splice(1).forEach((line) => {
    const [countryShort, countryFormal] = line.replace(/\r/g, '').split(';');

    if (exists(countryShort) && exists(countryFormal)) {
      countryFormalNamesByCountryName[countryShort] = countryFormal;
      nbCountries += 1;
    }
  });

  nbCountries += Object.keys(missingCountries).length;

  const updated = {
    ...missingCountries,
    ...countryFormalNamesByCountryName
  };

  writeFileSync(
    `${__dirname}/data/country-formal-names-by-country-name.json`,
    JSON.stringify(updated),
  );

  console.log(`✅ Successfully generated ${nbCountries} countries from the official data`);

  return updated;
};
