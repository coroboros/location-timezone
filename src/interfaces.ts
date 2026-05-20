export interface Capital {
  name: string;
  nameAscii: string;
  latitude: number;
  longitude: number;
  province: string;
  state: string;
  timezone: string;
  country?: Country;
}

export interface Country {
  name: string;
  officialName: string;
  iso2: string;
  iso3: string;
  timezones: string[];
  capital?: Capital;
}

export interface Location {
  city: string;
  cityAscii: string;
  country: Country;
  latitude: number;
  longitude: number;
  province: string;
  state: string;
  timezone: string;
}

export interface StateAnsi {
  fipsCode: string;
  gnisid: string;
  name: string;
  uspsCode: string;
}
