// Normalize ID from number | string to number
export function toNumberId(value: number | string | null | undefined): number {
  if (value === null || value === undefined) {
    return 0;
  }
  return typeof value === 'string' ? parseInt(value, 10) : value;
}

// Parse nullable number from string
export function parseNullableNumber(value: string): number | null {
  if (!value || value.trim() === '') {
    return null;
  }
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

// Parse nullable integer from string
export function parseNullableInt(value: string): number | null {
  if (!value || value.trim() === '') {
    return null;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

// Build full image URL from relative path
export function getImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) {
    return null;
  }
  // If already a full URL, return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  // Otherwise, prepend API base URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  // Remove trailing slash from baseUrl and leading slash from imageUrl if present
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanImageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${cleanBaseUrl}${cleanImageUrl}`;
}

