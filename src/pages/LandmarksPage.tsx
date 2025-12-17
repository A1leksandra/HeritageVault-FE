import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { LandmarkFormDialog } from '../components/forms/LandmarkFormDialog';
import {
  getLandmarks,
  getLandmark,
  createLandmark,
  updateLandmark,
  deleteLandmark,
} from '../api/landmarksApi';
import { getErrorMessage } from '../api/http';
import type { LandmarkListItemDto, LandmarkDetailsDto } from '../types';
import {
  toNumberId,
  ProtectionStatusLabels,
  PhysicalConditionLabels,
  AccessibilityStatusLabels,
  formatEnum,
  getEnumOptions,
  getImageUrl,
} from '../utils';

export function LandmarksPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [landmarks, setLandmarks] = useState<LandmarkListItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [cityIdFilter, setCityIdFilter] = useState<string>('');
  const [countryIdFilter, setCountryIdFilter] = useState<string>('');
  const [regionIdFilter, setRegionIdFilter] = useState<string>('');
  const [nameContainsFilter, setNameContainsFilter] = useState<string>('');
  const [protectionStatusFilter, setProtectionStatusFilter] = useState<number | ''>('');
  const [physicalConditionFilter, setPhysicalConditionFilter] = useState<number | ''>('');
  const [accessibilityStatusFilter, setAccessibilityStatusFilter] = useState<number | ''>('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkDetailsDto | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [landmarkToDelete, setLandmarkToDelete] = useState<number | string | null>(null);

  const loadLandmarks = async () => {
    setLoading(true);
    try {
      const query: any = {};
      if (cityIdFilter) {
        query.CityId = Number(cityIdFilter);
      }
      if (countryIdFilter) {
        query.CountryId = Number(countryIdFilter);
      }
      if (regionIdFilter) {
        query.RegionId = Number(regionIdFilter);
      }
      if (nameContainsFilter) {
        query.NameContains = nameContainsFilter;
      }
      if (protectionStatusFilter !== '') {
        query.ProtectionStatus = protectionStatusFilter;
      }
      if (physicalConditionFilter !== '') {
        query.PhysicalCondition = physicalConditionFilter;
      }
      if (accessibilityStatusFilter !== '') {
        query.AccessibilityStatus = accessibilityStatusFilter;
      }
      const data = await getLandmarks(query);
      setLandmarks(data);
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLandmarks();
  }, [
    cityIdFilter,
    countryIdFilter,
    regionIdFilter,
    nameContainsFilter,
    protectionStatusFilter,
    physicalConditionFilter,
    accessibilityStatusFilter,
  ]);

  const handleCreate = () => {
    setSelectedLandmark(null);
    setFormOpen(true);
  };

  const handleView = (id: number | string) => {
    navigate(`/landmarks/${toNumberId(id)}`);
  };

  const handleEdit = async (id: number | string) => {
    try {
      const landmark = await getLandmark(id);
      setSelectedLandmark(landmark);
      setFormOpen(true);
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    }
  };

  const handleSave = async (request: any) => {
    try {
      if (selectedLandmark) {
        await updateLandmark(selectedLandmark.id, request);
        showToast('Landmark updated successfully', 'success');
      } else {
        await createLandmark(request);
        showToast('Landmark created successfully', 'success');
      }
      await loadLandmarks();
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
      throw error;
    }
  };

  const handleDeleteClick = (id: number | string) => {
    setLandmarkToDelete(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!landmarkToDelete) return;
    try {
      await deleteLandmark(landmarkToDelete);
      showToast('Landmark deleted successfully', 'success');
      await loadLandmarks();
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    } finally {
      setConfirmOpen(false);
      setLandmarkToDelete(null);
    }
  };

  const columns: GridColDef<LandmarkListItemDto>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'cityName', headerName: 'City', width: 150 },
    {
      field: 'protectionStatus',
      headerName: 'Protection',
      width: 150,
      valueFormatter: (value) => formatEnum(ProtectionStatusLabels, value),
    },
    {
      field: 'physicalCondition',
      headerName: 'Condition',
      width: 150,
      valueFormatter: (value) => formatEnum(PhysicalConditionLabels, value),
    },
    {
      field: 'accessibilityStatus',
      headerName: 'Accessibility',
      width: 150,
      valueFormatter: (value) => formatEnum(AccessibilityStatusLabels, value),
    },
    {
      field: 'imageUrl',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => {
        const fullImageUrl = getImageUrl(params.value);
        if (fullImageUrl) {
          return <Avatar src={fullImageUrl} variant="rounded" sx={{ width: 40, height: 40 }} />;
        }
        return null;
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          key="view"
          icon={<Visibility />}
          label="View"
          onClick={() => handleView(params.row.id)}
        />,
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
          Landmarks
        </Typography>
        <Button variant="contained" onClick={handleCreate}>
          Create Landmark
        </Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="City ID"
          type="number"
          size="small"
          value={cityIdFilter}
          onChange={(e) => setCityIdFilter(e.target.value)}
          sx={{ width: 120 }}
        />
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
        <FormControl size="small" sx={{ width: 180 }}>
          <InputLabel>Protection Status</InputLabel>
          <Select
            value={protectionStatusFilter}
            label="Protection Status"
            onChange={(e) => setProtectionStatusFilter(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <MenuItem value="">All</MenuItem>
            {getEnumOptions(ProtectionStatusLabels).map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ width: 180 }}>
          <InputLabel>Physical Condition</InputLabel>
          <Select
            value={physicalConditionFilter}
            label="Physical Condition"
            onChange={(e) => setPhysicalConditionFilter(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <MenuItem value="">All</MenuItem>
            {getEnumOptions(PhysicalConditionLabels).map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ width: 180 }}>
          <InputLabel>Accessibility</InputLabel>
          <Select
            value={accessibilityStatusFilter}
            label="Accessibility"
            onChange={(e) => setAccessibilityStatusFilter(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <MenuItem value="">All</MenuItem>
            {getEnumOptions(AccessibilityStatusLabels).map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <DataGrid
        rows={landmarks}
        columns={columns}
        loading={loading}
        getRowId={(row) => toNumberId(row.id)}
        autoHeight
        pageSizeOptions={[10, 25, 50, 100]}
      />
      <LandmarkFormDialog
        open={formOpen}
        landmark={selectedLandmark}
        onClose={() => {
          setFormOpen(false);
          setSelectedLandmark(null);
        }}
        onSave={handleSave}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Landmark"
        message="Are you sure you want to delete this landmark?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setConfirmOpen(false);
          setLandmarkToDelete(null);
        }}
      />
    </Container>
  );
}
