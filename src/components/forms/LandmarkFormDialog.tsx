import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import { useState, useEffect } from 'react';
import type {
  LandmarkDetailsDto,
  CreateLandmarkRequest,
  UpdateLandmarkRequest,
} from '../../types';
import {
  ProtectionStatusLabels,
  PhysicalConditionLabels,
  AccessibilityStatusLabels,
  getEnumOptions,
  parseNullableNumber,
  parseNullableInt,
} from '../../utils';

interface LandmarkFormDialogProps {
  open: boolean;
  landmark?: LandmarkDetailsDto | null;
  onClose: () => void;
  onSave: (request: CreateLandmarkRequest | UpdateLandmarkRequest) => Promise<void>;
}

export function LandmarkFormDialog({ open, landmark, onClose, onSave }: LandmarkFormDialogProps) {
  const [cityId, setCityId] = useState<number | string>('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [firstMentionYear, setFirstMentionYear] = useState('');
  const [protectionStatus, setProtectionStatus] = useState<number>(0);
  const [physicalCondition, setPhysicalCondition] = useState<number>(0);
  const [accessibilityStatus, setAccessibilityStatus] = useState<number>(0);
  const [externalRegistryUrl, setExternalRegistryUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (landmark) {
      setCityId(landmark.cityId);
      setName(landmark.name);
      setDescription(landmark.description || '');
      setAddress(landmark.address || '');
      setLatitude(landmark.latitude ? String(landmark.latitude) : '');
      setLongitude(landmark.longitude ? String(landmark.longitude) : '');
      setFirstMentionYear(landmark.firstMentionYear ? String(landmark.firstMentionYear) : '');
      setProtectionStatus(landmark.protectionStatus);
      setPhysicalCondition(landmark.physicalCondition);
      setAccessibilityStatus(landmark.accessibilityStatus);
      setExternalRegistryUrl(landmark.externalRegistryUrl || '');
    } else {
      setCityId('');
      setName('');
      setDescription('');
      setAddress('');
      setLatitude('');
      setLongitude('');
      setFirstMentionYear('');
      setProtectionStatus(0);
      setPhysicalCondition(0);
      setAccessibilityStatus(0);
      setExternalRegistryUrl('');
    }
  }, [landmark, open]);

  const handleSubmit = async () => {
    if (!name.trim() || !cityId) {
      return;
    }

    setLoading(true);
    try {
      await onSave({
        cityId,
        name: name.trim(),
        description: description.trim() || null,
        address: address.trim() || null,
        latitude: parseNullableNumber(latitude),
        longitude: parseNullableNumber(longitude),
        firstMentionYear: parseNullableInt(firstMentionYear),
        protectionStatus,
        physicalCondition,
        accessibilityStatus,
        externalRegistryUrl: externalRegistryUrl.trim() || null,
      });
      onClose();
    } catch (error) {
      // Error handling is done in parent via toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{landmark ? 'Edit Landmark' : 'Create Landmark'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              label="City ID"
              fullWidth
              variant="outlined"
              type="number"
              value={cityId}
              onChange={(e) => setCityId(e.target.value ? Number(e.target.value) : '')}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Name"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              fullWidth
              variant="outlined"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Latitude"
              fullWidth
              variant="outlined"
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Longitude"
              fullWidth
              variant="outlined"
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="First Mention Year"
              fullWidth
              variant="outlined"
              type="number"
              value={firstMentionYear}
              onChange={(e) => setFirstMentionYear(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Protection Status</InputLabel>
              <Select
                value={protectionStatus}
                label="Protection Status"
                onChange={(e) => setProtectionStatus(Number(e.target.value))}
              >
                {getEnumOptions(ProtectionStatusLabels).map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Physical Condition</InputLabel>
              <Select
                value={physicalCondition}
                label="Physical Condition"
                onChange={(e) => setPhysicalCondition(Number(e.target.value))}
              >
                {getEnumOptions(PhysicalConditionLabels).map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Accessibility Status</InputLabel>
              <Select
                value={accessibilityStatus}
                label="Accessibility Status"
                onChange={(e) => setAccessibilityStatus(Number(e.target.value))}
              >
                {getEnumOptions(AccessibilityStatusLabels).map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="External Registry URL"
              fullWidth
              variant="outlined"
              value={externalRegistryUrl}
              onChange={(e) => setExternalRegistryUrl(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !name.trim() || !cityId}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

