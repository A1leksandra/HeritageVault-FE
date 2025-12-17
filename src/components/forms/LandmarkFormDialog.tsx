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
  CircularProgress,
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
  toNumberId,
} from '../../utils';
import { useLocationDropdowns } from '../../hooks/useLocationDropdowns';
import { getCity } from '../../api/citiesApi';

interface LandmarkFormDialogProps {
  open: boolean;
  landmark?: LandmarkDetailsDto | null;
  onClose: () => void;
  onSave: (request: CreateLandmarkRequest | UpdateLandmarkRequest) => Promise<void>;
}

export function LandmarkFormDialog({ open, landmark, onClose, onSave }: LandmarkFormDialogProps) {
  const {
    countries,
    regions,
    cities,
    loadingCountries,
    loadingRegions,
    loadingCities,
    loadRegions,
    loadCities,
  } = useLocationDropdowns();

  const [selectedCountryId, setSelectedCountryId] = useState<number | string | ''>('');
  const [selectedRegionId, setSelectedRegionId] = useState<number | string | ''>('');
  const [selectedCityId, setSelectedCityId] = useState<number | string | ''>('');
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
  const [initializing, setInitializing] = useState(false);

  // Initialize form when editing
  useEffect(() => {
    if (open && landmark) {
      setInitializing(true);
      // Load the city to get its country and region
      getCity(landmark.cityId)
        .then((city) => {
          setSelectedCountryId(city.countryId);
          setSelectedRegionId(city.regionId || '');
          setSelectedCityId(landmark.cityId);
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
          setInitializing(false);
        })
        .catch(() => {
          setInitializing(false);
        });
    } else if (open) {
      // Reset for new landmark
      setSelectedCountryId('');
      setSelectedRegionId('');
      setSelectedCityId('');
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

  // Load regions when country changes
  useEffect(() => {
    if (selectedCountryId) {
      loadRegions(selectedCountryId);
      // Clear region and city when country changes
      if (selectedRegionId) {
        setSelectedRegionId('');
      }
      if (selectedCityId) {
        setSelectedCityId('');
      }
    } else {
      loadRegions(null);
      loadCities(null, null);
    }
  }, [selectedCountryId]);

  // Load cities when country or region changes
  useEffect(() => {
    if (selectedCountryId) {
      loadCities(selectedCountryId, selectedRegionId || null);
    } else {
      loadCities(null, null);
    }
  }, [selectedCountryId, selectedRegionId]);

  const handleSubmit = async () => {
    if (!name.trim() || !selectedCityId) {
      return;
    }

    setLoading(true);
    try {
      await onSave({
        cityId: selectedCityId,
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
        {initializing ? (
          <Grid container spacing={2} sx={{ mt: 1, justifyContent: 'center' }}>
            <Grid item>
              <CircularProgress />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
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
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
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
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>City</InputLabel>
                <Select
                  value={selectedCityId}
                  label="City"
                  onChange={(e) => setSelectedCityId(e.target.value)}
                  disabled={!selectedCountryId || loadingCities}
                >
                  {loadingCities ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} />
                    </MenuItem>
                  ) : cities.length === 0 ? (
                    <MenuItem disabled>No cities available</MenuItem>
                  ) : (
                    cities.map((city) => (
                      <MenuItem key={toNumberId(city.id)} value={toNumberId(city.id)}>
                        {city.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
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
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || initializing || !name.trim() || !selectedCityId}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
