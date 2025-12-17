import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useState, useEffect } from 'react';
import type { CityDetailsDto, CreateCityRequest, UpdateCityRequest } from '../../types';
import { parseNullableNumber } from '../../utils';

interface CityFormDialogProps {
  open: boolean;
  city?: CityDetailsDto | null;
  onClose: () => void;
  onSave: (request: CreateCityRequest | UpdateCityRequest) => Promise<void>;
}

export function CityFormDialog({ open, city, onClose, onSave }: CityFormDialogProps) {
  const [countryId, setCountryId] = useState<number | string>('');
  const [regionId, setRegionId] = useState<string>('');
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (city) {
      setCountryId(city.countryId);
      setRegionId(city.regionId ? String(city.regionId) : '');
      setName(city.name);
      setLatitude(city.latitude ? String(city.latitude) : '');
      setLongitude(city.longitude ? String(city.longitude) : '');
    } else {
      setCountryId('');
      setRegionId('');
      setName('');
      setLatitude('');
      setLongitude('');
    }
  }, [city, open]);

  const handleSubmit = async () => {
    if (!name.trim() || !countryId) {
      return;
    }

    setLoading(true);
    try {
      await onSave({
        countryId,
        regionId: regionId ? Number(regionId) : null,
        name: name.trim(),
        latitude: parseNullableNumber(latitude),
        longitude: parseNullableNumber(longitude),
      });
      onClose();
    } catch (error) {
      // Error handling is done in parent via toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{city ? 'Edit City' : 'Create City'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Country ID"
          fullWidth
          variant="outlined"
          type="number"
          value={countryId}
          onChange={(e) => setCountryId(e.target.value ? Number(e.target.value) : '')}
          required
          sx={{ mt: 2 }}
        />
        <TextField
          margin="dense"
          label="Region ID"
          fullWidth
          variant="outlined"
          type="number"
          value={regionId}
          onChange={(e) => setRegionId(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          margin="dense"
          label="Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          sx={{ mt: 2 }}
        />
        <TextField
          margin="dense"
          label="Latitude"
          fullWidth
          variant="outlined"
          type="number"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          margin="dense"
          label="Longitude"
          fullWidth
          variant="outlined"
          type="number"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !name.trim() || !countryId}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

