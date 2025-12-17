import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useState, useEffect } from 'react';
import type { CountryDetailsDto, CreateCountryRequest, UpdateCountryRequest } from '../../types';

interface CountryFormDialogProps {
  open: boolean;
  country?: CountryDetailsDto | null;
  onClose: () => void;
  onSave: (request: CreateCountryRequest | UpdateCountryRequest) => Promise<void>;
}

export function CountryFormDialog({ open, country, onClose, onSave }: CountryFormDialogProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (country) {
      setName(country.name);
      setCode(country.code);
    } else {
      setName('');
      setCode('');
    }
  }, [country, open]);

  const handleSubmit = async () => {
    if (!name.trim() || !code.trim()) {
      return;
    }

    setLoading(true);
    try {
      await onSave({ name: name.trim(), code: code.trim() });
      onClose();
    } catch (error) {
      // Error handling is done in parent via toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{country ? 'Edit Country' : 'Create Country'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
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
          label="Code"
          fullWidth
          variant="outlined"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading || !name.trim() || !code.trim()}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

