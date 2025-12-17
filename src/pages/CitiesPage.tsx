import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Switch,
  FormControlLabel,
  TextField,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { Edit, Delete } from '@mui/icons-material';
import { useToast } from '../components/ToastProvider';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { CityFormDialog } from '../components/forms/CityFormDialog';
import {
  getCities,
  getCity,
  createCity,
  updateCity,
  deleteCity,
} from '../api/citiesApi';
import { getErrorMessage } from '../api/http';
import type { CityListItemDto, CityDetailsDto } from '../types';
import { toNumberId } from '../utils';

export function CitiesPage() {
  const { showToast } = useToast();
  const [cities, setCities] = useState<CityListItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [countryIdFilter, setCountryIdFilter] = useState<string>('');
  const [regionIdFilter, setRegionIdFilter] = useState<string>('');
  const [nameContainsFilter, setNameContainsFilter] = useState<string>('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CityDetailsDto | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<number | string | null>(null);

  const loadCities = async () => {
    setLoading(true);
    try {
      const query: any = { IncludeDeleted: includeDeleted };
      if (countryIdFilter) {
        query.CountryId = Number(countryIdFilter);
      }
      if (regionIdFilter) {
        query.RegionId = Number(regionIdFilter);
      }
      if (nameContainsFilter) {
        query.NameContains = nameContainsFilter;
      }
      const data = await getCities(query);
      setCities(data);
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCities();
  }, [includeDeleted, countryIdFilter, regionIdFilter, nameContainsFilter]);

  const handleCreate = () => {
    setSelectedCity(null);
    setFormOpen(true);
  };

  const handleEdit = async (id: number | string) => {
    try {
      const city = await getCity(id);
      setSelectedCity(city);
      setFormOpen(true);
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const handleSave = async (request: any) => {
    try {
      if (selectedCity) {
        await updateCity(selectedCity.id, request);
        showToast('City updated successfully', 'success');
      } else {
        await createCity(request);
        showToast('City created successfully', 'success');
      }
      await loadCities();
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
      throw error;
    }
  };

  const handleDeleteClick = (id: number | string) => {
    setCityToDelete(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!cityToDelete) return;
    try {
      await deleteCity(cityToDelete);
      showToast('City deleted successfully', 'success');
      await loadCities();
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    } finally {
      setConfirmOpen(false);
      setCityToDelete(null);
    }
  };

  const columns: GridColDef<CityListItemDto>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'countryId', headerName: 'Country ID', width: 120 },
    { field: 'regionId', headerName: 'Region ID', width: 120 },
    { field: 'name', headerName: 'Name', flex: 1 },
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
          Cities
        </Typography>
        <Button variant="contained" onClick={handleCreate}>
          Create City
        </Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="Country ID"
          type="number"
          size="small"
          value={countryIdFilter}
          onChange={(e) => setCountryIdFilter(e.target.value)}
          sx={{ width: 120 }}
        />
        <TextField
          label="Region ID"
          type="number"
          size="small"
          value={regionIdFilter}
          onChange={(e) => setRegionIdFilter(e.target.value)}
          sx={{ width: 120 }}
        />
        <TextField
          label="Name Contains"
          size="small"
          value={nameContainsFilter}
          onChange={(e) => setNameContainsFilter(e.target.value)}
          sx={{ width: 200 }}
        />
        <FormControlLabel
          control={
            <Switch checked={includeDeleted} onChange={(e) => setIncludeDeleted(e.target.checked)} />
          }
          label="Include Deleted"
        />
      </Box>
      <DataGrid
        rows={cities}
        columns={columns}
        loading={loading}
        getRowId={(row) => toNumberId(row.id)}
        autoHeight
        pageSizeOptions={[10, 25, 50, 100]}
      />
      <CityFormDialog
        open={formOpen}
        city={selectedCity}
        onClose={() => {
          setFormOpen(false);
          setSelectedCity(null);
        }}
        onSave={handleSave}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Delete City"
        message="Are you sure you want to delete this city?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setConfirmOpen(false);
          setCityToDelete(null);
        }}
      />
    </Container>
  );
}
