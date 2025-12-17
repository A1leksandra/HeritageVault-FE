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
import type { RegionDetailsDto, CreateRegionRequest, UpdateRegionRequest } from '../../types';
import { toNumberId } from '../../utils';
import { useLocationDropdowns } from '../../hooks/useLocationDropdowns';

interface RegionFormDialogProps {
  open: boolean;
  region?: RegionDetailsDto | null;
  onClose: () => void;
  onSave: (request: CreateRegionRequest | UpdateRegionRequest) => Promise<void>;
  countryId?: number | string;
}

export function RegionFormDialog({
  open,
  region,
  onClose,
  onSave,
  countryId,
}: RegionFormDialogProps) {
  const { countries, loadingCountries } = useLocationDropdowns();

  const [selectedCountryId, setSelectedCountryId] = useState<number | string | ''>('');
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (region) {
      setSelectedCountryId(region.countryId);
      setName(region.name);
      setType(region.type || '');
    } else {
      setSelectedCountryId(countryId || '');
      setName('');
      setType('');
    }
  }, [region, countryId, open]);

  const handleSubmit = async () => {
    if (!name.trim() || !selectedCountryId) {
      return;
    }

    setLoading(true);
    try {
      await onSave({
        countryId: selectedCountryId,
        name: name.trim(),
        type: type.trim() || null,
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
      <DialogTitle>{region ? 'Edit Region' : 'Create Region'}</DialogTitle>
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
          label="Type"
          fullWidth
          variant="outlined"
          value={type}
          onChange={(e) => setType(e.target.value)}
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
