// Generate countries in a md file from generated data
import { writeFileSync } from 'node:fs';
import locationTimezone from '../src/index.ts';

const countries = locationTimezone.getCountries();
let md = '| Name | Official Name | ISO2 | ISO3 | Capital |\n| --- | --- | --- | --- | --- |\n';

for (const country of countries) {
  md += `| ${country.name} | ${country.officialName} | ${country.iso2} | ${country.iso3} | ${country.capital?.name || ''} |\n`;
}

writeFileSync('./countries.md', md);
