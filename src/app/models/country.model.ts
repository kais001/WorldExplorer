export interface CountryName {
  common: string;
  official: string;
}

export interface Currency {
  name: string;
  symbol?: string;
}

export interface Country {
  cca2: string;
  cca3: string;
  name: CountryName;
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  languages?: Record<string, string>;
  currencies?: Record<string, Currency>;
  borders?: string[];
  maps?: {
    googleMaps?: string;
    openStreetMaps?: string;
  };
}