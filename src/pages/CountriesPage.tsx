import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { Edit, Delete } from '@mui/icons-material';
import { useToast } from '../components/ToastProvider';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { CountryFormDialog } from '../components/forms/CountryFormDialog';
import {
  getCountries,
  getCountry,
  createCountry,
  updateCountry,
  deleteCountry,
} from '../api/countriesApi';
import { getErrorMessage } from '../api/http';
import type { CountryListItemDto, CountryDetailsDto } from '../types';
import { toNumberId } from '../utils';

export function CountriesPage() {
  const { showToast } = useToast();
  const [countries, setCountries] = useState<CountryListItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryDetailsDto | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState<number | string | null>(null);

  const loadCountries = async () => {
    setLoading(true);
    try {
      const data = await getCountries({ IncludeDeleted: includeDeleted });
      setCountries(data);
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCountries();
  }, [includeDeleted]);

  const handleCreate = () => {
    setSelectedCountry(null);
    setFormOpen(true);
  };

  const handleEdit = async (id: number | string) => {
    try {
      const country = await getCountry(id);
      setSelectedCountry(country);
      setFormOpen(true);
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const handleSave = async (request: any) => {
    try {
      if (selectedCountry) {
        await updateCountry(selectedCountry.id, request);
        showToast('Country updated successfully', 'success');
      } else {
        await createCountry(request);
        showToast('Country created successfully', 'success');
      }
      await loadCountries();
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
      throw error;
    }
  };

  const handleDeleteClick = (id: number | string) => {
    setCountryToDelete(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!countryToDelete) return;
    try {
      await deleteCountry(countryToDelete);
      showToast('Country deleted successfully', 'success');
      await loadCountries();
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    } finally {
      setConfirmOpen(false);
      setCountryToDelete(null);
    }
  };

  const columns: GridColDef<CountryListItemDto>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'code', headerName: 'Code', width: 120 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={<Edit />}
          label="Edit"
          onClick={() => handleEdit(params.row.id)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDeleteClick(params.row.id)}
        />,
      ],
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Countries
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch checked={includeDeleted} onChange={(e) => setIncludeDeleted(e.target.checked)} />
            }
            label="Include Deleted"
          />
          <Button variant="contained" onClick={handleCreate}>
            Create Country
          </Button>
        </Box>
      </Box>
      <DataGrid
        rows={countries}
        columns={columns}
        loading={loading}
        getRowId={(row) => toNumberId(row.id)}
        autoHeight
        pageSizeOptions={[10, 25, 50, 100]}
      />
      <CountryFormDialog
        open={formOpen}
        country={selectedCountry}
        onClose={() => {
          setFormOpen(false);
          setSelectedCountry(null);
        }}
        onSave={handleSave}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Country"
        message="Are you sure you want to delete this country?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setConfirmOpen(false);
          setCountryToDelete(null);
        }}
      />
    </Container>
  );
}
