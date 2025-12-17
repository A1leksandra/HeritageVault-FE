import { http } from './http';
import type {
  CityListItemDto,
  CityDetailsDto,
  CreateCityRequest,
  UpdateCityRequest,
  GetCitiesQuery,
} from '../types';
import { toNumberId } from '../utils';

export async function getCities(query?: GetCitiesQuery): Promise<CityListItemDto[]> {
  const response = await http.get<CityListItemDto[]>('/api/Cities', { params: query });
  return response.data;
}

export async function getCity(id: number | string): Promise<CityDetailsDto> {
  const response = await http.get<CityDetailsDto>(`/api/Cities/${toNumberId(id)}`);
  return response.data;
}

export async function createCity(request: CreateCityRequest): Promise<CityDetailsDto> {
  const response = await http.post<CityDetailsDto>('/api/Cities', request);
  return response.data;
}

export async function updateCity(
  id: number | string,
  request: UpdateCityRequest
): Promise<CityDetailsDto> {
  const response = await http.put<CityDetailsDto>(`/api/Cities/${toNumberId(id)}`, request);
  return response.data;
}

export async function deleteCity(id: number | string): Promise<void> {
  await http.delete(`/api/Cities/${toNumberId(id)}`);
}

