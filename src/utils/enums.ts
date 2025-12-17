// Enum label maps - numeric keys matching backend enum order
// NOTE: These values should match the backend enum definitions exactly

export const ProtectionStatusLabels: Record<number, string> = {
  0: 'None',
  1: 'Protected',
  2: 'Listed',
  3: 'Monument',
  4: 'Heritage Site',
};

export const PhysicalConditionLabels: Record<number, string> = {
  0: 'Unknown',
  1: 'Excellent',
  2: 'Good',
  3: 'Fair',
  4: 'Poor',
  5: 'Critical',
};

export const AccessibilityStatusLabels: Record<number, string> = {
  0: 'Unknown',
  1: 'Public',
  2: 'Restricted',
  3: 'Private',
  4: 'Closed',
};

// Helper to format enum value to label
export function formatEnum(
  labelMap: Record<number, string>,
  value: number | null | undefined
): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  return labelMap[value] ?? `Unknown (${value})`;
}

// Get all enum options for select inputs
export function getEnumOptions(labelMap: Record<number, string>): Array<{ value: number; label: string }> {
  return Object.entries(labelMap).map(([key, label]) => ({
    value: Number(key),
    label,
  }));
}

