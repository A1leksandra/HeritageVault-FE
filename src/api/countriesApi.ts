import { http, getErrorMessage } from './http';
import type {
  CountryListItemDto,
  CountryDetailsDto,
  CreateCountryRequest,
  UpdateCountryRequest,
  GetCountriesQuery,
} from '../types';
import { toNumberId } from '../utils';

export async function getCountries(query?: GetCountriesQuery): Promise<CountryListItemDto[]> {
  const response = await http.get<CountryListItemDto[]>('/api/Countries', { params: query });
  return response.data;
}

export async function getCountry(id: number | string): Promise<CountryDetailsDto> {
  const response = await http.get<CountryDetailsDto>(`/api/Countries/${toNumberId(id)}`);
  return response.data;
}

export async function createCountry(request: CreateCountryRequest): Promise<CountryDetailsDto> {
  const response = await http.post<CountryDetailsDto>('/api/Countries', request);
  return response.data;
}

export async function updateCountry(
  id: number | string,
  request: UpdateCountryRequest
): Promise<CountryDetailsDto> {
  const response = await http.put<CountryDetailsDto>(`/api/Countries/${toNumberId(id)}`, request);
  return response.data;
}

export async function deleteCountry(id: number | string): Promise<void> {
  await http.delete(`/api/Countries/${toNumberId(id)}`);
}

