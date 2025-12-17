import { http } from './http';
import type {
  LandmarkListItemDto,
  LandmarkDetailsDto,
  CreateLandmarkRequest,
  UpdateLandmarkRequest,
  GetLandmarksQuery,
} from '../types';
import { toNumberId } from '../utils';

export async function getLandmarks(query?: GetLandmarksQuery): Promise<LandmarkListItemDto[]> {
  const response = await http.get<LandmarkListItemDto[]>('/api/Landmarks', { params: query });
  return response.data;
}

export async function getLandmark(id: number | string): Promise<LandmarkDetailsDto> {
  const response = await http.get<LandmarkDetailsDto>(`/api/Landmarks/${toNumberId(id)}`);
  return response.data;
}

export async function createLandmark(request: CreateLandmarkRequest): Promise<LandmarkDetailsDto> {
  const response = await http.post<LandmarkDetailsDto>('/api/Landmarks', request);
  return response.data;
}

export async function updateLandmark(
  id: number | string,
  request: UpdateLandmarkRequest
): Promise<LandmarkDetailsDto> {
  const response = await http.put<LandmarkDetailsDto>(`/api/Landmarks/${toNumberId(id)}`, request);
  return response.data;
}

export async function deleteLandmark(id: number | string): Promise<void> {
  await http.delete(`/api/Landmarks/${toNumberId(id)}`);
}

export async function uploadLandmarkImage(
  id: number | string,
  file: File
): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  await http.post(
    `/api/Landmarks/${toNumberId(id)}/image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
}

export async function deleteLandmarkImage(id: number | string): Promise<void> {
  await http.delete(`/api/Landmarks/${toNumberId(id)}/image`);
}

