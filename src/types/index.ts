// Country types
export type CountryListItemDto = {
  id: number | string;
  name: string;
  code: string;
};

export type CountryDetailsDto = {
  id: number | string;
  name: string;
  code: string;
};

export type CreateCountryRequest = {
  name: string;
  code: string;
};

export type UpdateCountryRequest = {
  name: string;
  code: string;
};

export type GetCountriesQuery = {
  IncludeDeleted?: boolean;
};

// Region types
export type RegionListItemDto = {
  id: number | string;
  countryId: number | string;
  name: string;
  type: string | null;
};

export type RegionDetailsDto = {
  id: number | string;
  countryId: number | string;
  countryName: string;
  name: string;
  type: string | null;
};

export type CreateRegionRequest = {
  countryId: number | string;
  name: string;
  type: string | null;
};

export type UpdateRegionRequest = {
  countryId: number | string;
  name: string;
  type: string | null;
};

export type GetRegionsQuery = {
  CountryId?: number | string;
  IncludeDeleted?: boolean;
};

// City types
export type CityListItemDto = {
  id: number | string;
  countryId: number | string;
  regionId: number | string | null;
  name: string;
};

export type CityDetailsDto = {
  id: number | string;
  countryId: number | string;
  countryName: string;
  regionId: number | string | null;
  regionName: string | null;
  name: string;
  latitude: number | string | null;
  longitude: number | string | null;
};

export type CreateCityRequest = {
  countryId: number | string;
  regionId: number | string | null;
  name: string;
  latitude: number | string | null;
  longitude: number | string | null;
};

export type UpdateCityRequest = {
  countryId: number | string;
  regionId: number | string | null;
  name: string;
  latitude: number | string | null;
  longitude: number | string | null;
};

export type GetCitiesQuery = {
  CountryId?: number | string;
  RegionId?: number | string;
  IncludeDeleted?: boolean;
  NameContains?: string;
};

// Landmark types
export type LandmarkListItemDto = {
  id: number | string;
  cityId: number | string;
  cityName: string;
  name: string;
  protectionStatus: number;
  physicalCondition: number;
  accessibilityStatus: number;
  imageUrl: string | null;
};

export type LandmarkDetailsDto = {
  id: number | string;
  cityId: number | string;
  cityName: string;
  regionId: number | string | null;
  regionName: string | null;
  countryId: number | string;
  countryName: string;
  name: string;
  description: string | null;
  address: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  firstMentionYear: number | string | null;
  protectionStatus: number;
  physicalCondition: number;
  accessibilityStatus: number;
  externalRegistryUrl: string | null;
  uploadedImagePath: string | null;
  imageUrl: string | null;
};

export type CreateLandmarkRequest = {
  cityId: number | string;
  name: string;
  description: string | null;
  address: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  firstMentionYear: number | string | null;
  protectionStatus: number;
  physicalCondition: number;
  accessibilityStatus: number;
  externalRegistryUrl: string | null;
};

export type UpdateLandmarkRequest = {
  cityId: number | string;
  name: string;
  description: string | null;
  address: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  firstMentionYear: number | string | null;
  protectionStatus: number;
  physicalCondition: number;
  accessibilityStatus: number;
  externalRegistryUrl: string | null;
};

export type GetLandmarksQuery = {
  CityId?: number | string;
  CountryId?: number | string;
  RegionId?: number | string;
  ProtectionStatus?: number;
  PhysicalCondition?: number;
  AccessibilityStatus?: number;
  NameContains?: string;
  Page?: number;
  PageSize?: number;
};

// Paged response (if API returns pagination)
export type PagedResponse<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
};
