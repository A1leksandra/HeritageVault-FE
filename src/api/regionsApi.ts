import { http } from './http';
import type {
  RegionListItemDto,
  RegionDetailsDto,
  CreateRegionRequest,
  UpdateRegionRequest,
  GetRegionsQuery,
} from '../types';
import { toNumberId } from '../utils';

export async function getRegions(query?: GetRegionsQuery): Promise<RegionListItemDto[]> {
  const response = await http.get<RegionListItemDto[]>('/api/Regions', { params: query });
  return response.data;
}

export async function getRegion(id: number | string): Promise<RegionDetailsDto> {
  const response = await http.get<RegionDetailsDto>(`/api/Regions/${toNumberId(id)}`);
  return response.data;
}

export async function createRegion(request: CreateRegionRequest): Promise<RegionDetailsDto> {
  const response = await http.post<RegionDetailsDto>('/api/Regions', request);
  return response.data;
}

export async function updateRegion(
  id: number | string,
  request: UpdateRegionRequest
): Promise<RegionDetailsDto> {
  const response = await http.put<RegionDetailsDto>(`/api/Regions/${toNumberId(id)}`, request);
  return response.data;
}

export async function deleteRegion(id: number | string): Promise<void> {
  await http.delete(`/api/Regions/${toNumberId(id)}`);
}

