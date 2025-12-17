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
import { RegionFormDialog } from '../components/forms/RegionFormDialog';
import {
  getRegions,
  getRegion,
  createRegion,
  updateRegion,
  deleteRegion,
} from '../api/regionsApi';
import { getErrorMessage } from '../api/http';
import type { RegionListItemDto, RegionDetailsDto } from '../types';
import { toNumberId } from '../utils';

export function RegionsPage() {
  const { showToast } = useToast();
  const [regions, setRegions] = useState<RegionListItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [countryIdFilter, setCountryIdFilter] = useState<string>('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<RegionDetailsDto | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [regionToDelete, setRegionToDelete] = useState<number | string | null>(null);

  const loadRegions = async () => {
    setLoading(true);
    try {
      const query: any = { IncludeDeleted: includeDeleted };
      if (countryIdFilter) {
        query.CountryId = Number(countryIdFilter);
      }
      const data = await getRegions(query);
      setRegions(data);
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegions();
  }, [includeDeleted, countryIdFilter]);

  const handleCreate = () => {
    setSelectedRegion(null);
    setFormOpen(true);
  };

  const handleEdit = async (id: number | string) => {
    try {
      const region = await getRegion(id);
      setSelectedRegion(region);
      setFormOpen(true);
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const handleSave = async (request: any) => {
    try {
      if (selectedRegion) {
        await updateRegion(selectedRegion.id, request);
        showToast('Region updated successfully', 'success');
      } else {
        await createRegion(request);
        showToast('Region created successfully', 'success');
      }
      await loadRegions();
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
      throw error;
    }
  };

  const handleDeleteClick = (id: number | string) => {
    setRegionToDelete(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!regionToDelete) return;
    try {
      await deleteRegion(regionToDelete);
      showToast('Region deleted successfully', 'success');
      await loadRegions();
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    } finally {
      setConfirmOpen(false);
      setRegionToDelete(null);
    }
  };

  const columns: GridColDef<RegionListItemDto>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'countryId', headerName: 'Country ID', width: 120 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'type', headerName: 'Type', width: 150 },
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
          Regions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Country ID"
            type="number"
            size="small"
            value={countryIdFilter}
            onChange={(e) => setCountryIdFilter(e.target.value)}
            sx={{ width: 120 }}
          />
          <FormControlLabel
            control={
              <Switch checked={includeDeleted} onChange={(e) => setIncludeDeleted(e.target.checked)} />
            }
            label="Include Deleted"
          />
          <Button variant="contained" onClick={handleCreate}>
            Create Region
          </Button>
        </Box>
      </Box>
      <DataGrid
        rows={regions}
        columns={columns}
        loading={loading}
        getRowId={(row) => toNumberId(row.id)}
        autoHeight
        pageSizeOptions={[10, 25, 50, 100]}
      />
      <RegionFormDialog
        open={formOpen}
        region={selectedRegion}
        countryId={countryIdFilter ? Number(countryIdFilter) : undefined}
        onClose={() => {
          setFormOpen(false);
          setSelectedRegion(null);
        }}
        onSave={handleSave}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Region"
        message="Are you sure you want to delete this region?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setConfirmOpen(false);
          setRegionToDelete(null);
        }}
      />
    </Container>
  );
}
