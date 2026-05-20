/** from https://www2.census.gov/geo/docs/reference/state.txt
 * fipsCode: (Federal Information Processing Standard) FIPS State Code
 * uspsCode: Official United States Postal Service (USPS) Code
 * name: State name
 * gnisid: Geographic Names Information System Identifier (GNISID)
 */
const statesAnsi = [
  {
    fipsCode: '01',
    uspsCode: 'AL',
    name: 'Alabama',
    gnisid: '01779775'
  },
  {
    fipsCode: '02',
    uspsCode: 'AK',
    name: 'Alaska',
    gnisid: '01785533'
  },
  {
    fipsCode: '04',
    uspsCode: 'AZ',
    name: 'Arizona',
    gnisid: '01779777'
  },
  {
    fipsCode: '05',
    uspsCode: 'AR',
    name: 'Arkansas',
    gnisid: '00068085'
  },
  {
    fipsCode: '06',
    uspsCode: 'CA',
    name: 'California',
    gnisid: '01779778'
  },
  {
    fipsCode: '08',
    uspsCode: 'CO',
    name: 'Colorado',
    gnisid: '01779779'
  },
  {
    fipsCode: '09',
    uspsCode: 'CT',
    name: 'Connecticut',
    gnisid: '01779780'
  },
  {
    fipsCode: '10',
    uspsCode: 'DE',
    name: 'Delaware',
    gnisid: '01779781'
  },
  {
    fipsCode: '11',
    uspsCode: 'DC',
    name: 'District of Columbia',
    gnisid: '01702382'
  },
  {
    fipsCode: '12',
    uspsCode: 'FL',
    name: 'Florida',
    gnisid: '00294478'
  },
  {
    fipsCode: '13',
    uspsCode: 'GA',
    name: 'Georgia',
    gnisid: '01705317'
  },
  {
    fipsCode: '15',
    uspsCode: 'HI',
    name: 'Hawaii',
    gnisid: '01779782'
  },
  {
    fipsCode: '16',
    uspsCode: 'ID',
    name: 'Idaho',
    gnisid: '01779783'
  },
  {
    fipsCode: '17',
    uspsCode: 'IL',
    name: 'Illinois',
    gnisid: '01779784'
  },
  {
    fipsCode: '18',
    uspsCode: 'IN',
    name: 'Indiana',
    gnisid: '00448508'
  },
  {
    fipsCode: '19',
    uspsCode: 'IA',
    name: 'Iowa',
    gnisid: '01779785'
  },
  {
    fipsCode: '20',
    uspsCode: 'KS',
    name: 'Kansas',
    gnisid: '00481813'
  },
  {
    fipsCode: '21',
    uspsCode: 'KY',
    name: 'Kentucky',
    gnisid: '01779786'
  },
  {
    fipsCode: '22',
    uspsCode: 'LA',
    name: 'Louisiana',
    gnisid: '01629543'
  },
  {
    fipsCode: '23',
    uspsCode: 'ME',
    name: 'Maine',
    gnisid: '01779787'
  },
  {
    fipsCode: '24',
    uspsCode: 'MD',
    name: 'Maryland',
    gnisid: '01714934'
  },
  {
    fipsCode: '25',
    uspsCode: 'MA',
    name: 'Massachusetts',
    gnisid: '00606926'
  },
  {
    fipsCode: '26',
    uspsCode: 'MI',
    name: 'Michigan',
    gnisid: '01779789'
  },
  {
    fipsCode: '27',
    uspsCode: 'MN',
    name: 'Minnesota',
    gnisid: '00662849'
  },
  {
    fipsCode: '28',
    uspsCode: 'MS',
    name: 'Mississippi',
    gnisid: '01779790'
  },
  {
    fipsCode: '29',
    uspsCode: 'MO',
    name: 'Missouri',
    gnisid: '01779791'
  },
  {
    fipsCode: '30',
    uspsCode: 'MT',
    name: 'Montana',
    gnisid: '00767982'
  },
  {
    fipsCode: '31',
    uspsCode: 'NE',
    name: 'Nebraska',
    gnisid: '01779792'
  },
  {
    fipsCode: '32',
    uspsCode: 'NV',
    name: 'Nevada',
    gnisid: '01779793'
  },
  {
    fipsCode: '33',
    uspsCode: 'NH',
    name: 'New Hampshire',
    gnisid: '01779794'
  },
  {
    fipsCode: '34',
    uspsCode: 'NJ',
    name: 'New Jersey',
    gnisid: '01779795'
  },
  {
    fipsCode: '35',
    uspsCode: 'NM',
    name: 'New Mexico',
    gnisid: '00897535'
  },
  {
    fipsCode: '36',
    uspsCode: 'NY',
    name: 'New York',
    gnisid: '01779796'
  },
  {
    fipsCode: '37',
    uspsCode: 'NC',
    name: 'North Carolina',
    gnisid: '01027616'
  },
  {
    fipsCode: '38',
    uspsCode: 'ND',
    name: 'North Dakota',
    gnisid: '01779797'
  },
  {
    fipsCode: '39',
    uspsCode: 'OH',
    name: 'Ohio',
    gnisid: '01085497'
  },
  {
    fipsCode: '40',
    uspsCode: 'OK',
    name: 'Oklahoma',
    gnisid: '01102857'
  },
  {
    fipsCode: '41',
    uspsCode: 'OR',
    name: 'Oregon',
    gnisid: '01155107'
  },
  {
    fipsCode: '42',
    uspsCode: 'PA',
    name: 'Pennsylvania',
    gnisid: '01779798'
  },
  {
    fipsCode: '44',
    uspsCode: 'RI',
    name: 'Rhode Island',
    gnisid: '01219835'
  },
  {
    fipsCode: '45',
    uspsCode: 'SC',
    name: 'South Carolina',
    gnisid: '01779799'
  },
  {
    fipsCode: '46',
    uspsCode: 'SD',
    name: 'South Dakota',
    gnisid: '01785534'
  },
  {
    fipsCode: '47',
    uspsCode: 'TN',
    name: 'Tennessee',
    gnisid: '01325873'
  },
  {
    fipsCode: '48',
    uspsCode: 'TX',
    name: 'Texas',
    gnisid: '01779801'
  },
  {
    fipsCode: '49',
    uspsCode: 'UT',
    name: 'Utah',
    gnisid: '01455989'
  },
  {
    fipsCode: '50',
    uspsCode: 'VT',
    name: 'Vermont',
    gnisid: '01779802'
  },
  {
    fipsCode: '51',
    uspsCode: 'VA',
    name: 'Virginia',
    gnisid: '01779803'
  },
  {
    fipsCode: '53',
    uspsCode: 'WA',
    name: 'Washington',
    gnisid: '01779804'
  },
  {
    fipsCode: '54',
    uspsCode: 'WV',
    name: 'West Virginia',
    gnisid: '01779805'
  },
  {
    fipsCode: '55',
    uspsCode: 'WI',
    name: 'Wisconsin',
    gnisid: '01779806'
  },
  {
    fipsCode: '56',
    uspsCode: 'WY',
    name: 'Wyoming',
    gnisid: '01779807'
  },
  {
    fipsCode: '60',
    uspsCode: 'AS',
    name: 'American Samoa',
    gnisid: '01802701'
  },
  {
    fipsCode: '66',
    uspsCode: 'GU',
    name: 'Guam',
    gnisid: '01802705'
  },
  {
    fipsCode: '69',
    uspsCode: 'MP',
    name: 'Northern Mariana Islands',
    gnisid: '01779809'
  },
  {
    fipsCode: '72',
    uspsCode: 'PR',
    name: 'Puerto Rico',
    gnisid: '01779808'
  },
  {
    fipsCode: '74',
    uspsCode: 'UM',
    name: 'U.S. Minor Outlying Islands',
    gnisid: '01878752'
  },
  {
    fipsCode: '78',
    uspsCode: 'VI',
    name: 'U.S. Virgin Islands',
    gnisid: '01802710'
  }
];

module.exports = statesAnsi;
