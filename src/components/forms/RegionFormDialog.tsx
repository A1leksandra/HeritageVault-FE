import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useState, useEffect } from 'react';
import type { RegionDetailsDto, CreateRegionRequest, UpdateRegionRequest } from '../../types';

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
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [currentCountryId, setCurrentCountryId] = useState<number | string | undefined>(countryId);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (region) {
      setName(region.name);
      setType(region.type || '');
      setCurrentCountryId(region.countryId);
    } else {
      setName('');
      setType('');
      setCurrentCountryId(countryId);
    }
  }, [region, countryId, open]);

  const handleSubmit = async () => {
    if (!name.trim() || !currentCountryId) {
      return;
    }

    setLoading(true);
    try {
      await onSave({
        countryId: currentCountryId,
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
        <TextField
          autoFocus
          margin="dense"
          label="Country ID"
          fullWidth
          variant="outlined"
          type="number"
          value={currentCountryId || ''}
          onChange={(e) => setCurrentCountryId(e.target.value ? Number(e.target.value) : undefined)}
          required
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
          disabled={loading || !name.trim() || !currentCountryId}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

