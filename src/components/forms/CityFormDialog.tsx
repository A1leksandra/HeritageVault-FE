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
  CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import type { CityDetailsDto, CreateCityRequest, UpdateCityRequest } from '../../types';
import { parseNullableNumber, toNumberId } from '../../utils';
import { useLocationDropdowns } from '../../hooks/useLocationDropdowns';

interface CityFormDialogProps {
  open: boolean;
  city?: CityDetailsDto | null;
  onClose: () => void;
  onSave: (request: CreateCityRequest | UpdateCityRequest) => Promise<void>;
}

export function CityFormDialog({ open, city, onClose, onSave }: CityFormDialogProps) {
  const {
    countries,
    regions,
    loadingCountries,
    loadingRegions,
    loadRegions,
  } = useLocationDropdowns();

  const [selectedCountryId, setSelectedCountryId] = useState<number | string | ''>('');
  const [selectedRegionId, setSelectedRegionId] = useState<number | string | ''>('');
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (city) {
      setSelectedCountryId(city.countryId);
      setSelectedRegionId(city.regionId || '');
      setName(city.name);
      setLatitude(city.latitude ? String(city.latitude) : '');
      setLongitude(city.longitude ? String(city.longitude) : '');
    } else {
      setSelectedCountryId('');
      setSelectedRegionId('');
      setName('');
      setLatitude('');
      setLongitude('');
    }
  }, [city, open]);

  // Load regions when country changes
  useEffect(() => {
    if (selectedCountryId) {
      loadRegions(selectedCountryId);
      // Clear region when country changes
      if (selectedRegionId && !city) {
        setSelectedRegionId('');
      }
    } else {
      loadRegions(null);
    }
  }, [selectedCountryId]);

  const handleSubmit = async () => {
    if (!name.trim() || !selectedCountryId) {
      return;
    }

    setLoading(true);
    try {
      await onSave({
        countryId: selectedCountryId,
        regionId: selectedRegionId ? toNumberId(selectedRegionId) : null,
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
        <FormControl fullWidth required sx={{ mt: 2 }}>
          <InputLabel>Country</InputLabel>
          <Select
            value={selectedCountryId}
            label="Country"
            onChange={(e) => setSelectedCountryId(e.target.value)}
            disabled={loadingCountries}
          >
            {loadingCountries ? (
              <MenuItem disabled>
                <CircularProgress size={20} />
              </MenuItem>
            ) : (
              countries.map((country) => (
                <MenuItem key={toNumberId(country.id)} value={toNumberId(country.id)}>
                  {country.name} ({country.code})
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Region</InputLabel>
          <Select
            value={selectedRegionId}
            label="Region"
            onChange={(e) => setSelectedRegionId(e.target.value || '')}
            disabled={!selectedCountryId || loadingRegions}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {loadingRegions ? (
              <MenuItem disabled>
                <CircularProgress size={20} />
              </MenuItem>
            ) : (
              regions.map((region) => (
                <MenuItem key={toNumberId(region.id)} value={toNumberId(region.id)}>
                  {region.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
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
          disabled={loading || !name.trim() || !selectedCountryId}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
