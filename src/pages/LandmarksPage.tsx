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
  CircularProgress,
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
import { useLocationDropdowns } from '../hooks/useLocationDropdowns';

export function LandmarksPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
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

  const [landmarks, setLandmarks] = useState<LandmarkListItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [countryIdFilter, setCountryIdFilter] = useState<number | string | ''>('');
  const [regionIdFilter, setRegionIdFilter] = useState<number | string | ''>('');
  const [cityIdFilter, setCityIdFilter] = useState<number | string | ''>('');
  const [nameContainsFilter, setNameContainsFilter] = useState<string>('');
  const [protectionStatusFilter, setProtectionStatusFilter] = useState<number | ''>('');
  const [physicalConditionFilter, setPhysicalConditionFilter] = useState<number | ''>('');
  const [accessibilityStatusFilter, setAccessibilityStatusFilter] = useState<number | ''>('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkDetailsDto | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [landmarkToDelete, setLandmarkToDelete] = useState<number | string | null>(null);

  // Load regions when country filter changes
  useEffect(() => {
    if (countryIdFilter) {
      loadRegions(countryIdFilter);
      // Clear region and city filters when country changes
      if (regionIdFilter) {
        setRegionIdFilter('');
      }
      if (cityIdFilter) {
        setCityIdFilter('');
      }
    } else {
      loadRegions(null);
      loadCities(null, null);
    }
  }, [countryIdFilter]);

  // Load cities when country or region filter changes
  useEffect(() => {
    if (countryIdFilter) {
      loadCities(countryIdFilter, regionIdFilter || null);
      // Clear city filter when region changes
      if (cityIdFilter && !regionIdFilter) {
        setCityIdFilter('');
      }
    } else {
      loadCities(null, null);
    }
  }, [countryIdFilter, regionIdFilter]);

  const loadLandmarks = async () => {
    setLoading(true);
    try {
      const query: any = {};
      if (cityIdFilter) {
        query.CityId = toNumberId(cityIdFilter);
      }
      if (countryIdFilter) {
        query.CountryId = toNumberId(countryIdFilter);
      }
      if (regionIdFilter) {
        query.RegionId = toNumberId(regionIdFilter);
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
        <FormControl size="small" sx={{ width: 180 }}>
          <InputLabel>Country</InputLabel>
          <Select
            value={countryIdFilter}
            label="Country"
            onChange={(e) => setCountryIdFilter(e.target.value || '')}
            disabled={loadingCountries}
          >
            <MenuItem value="">All</MenuItem>
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
        <FormControl size="small" sx={{ width: 180 }}>
          <InputLabel>Region</InputLabel>
          <Select
            value={regionIdFilter}
            label="Region"
            onChange={(e) => setRegionIdFilter(e.target.value || '')}
            disabled={!countryIdFilter || loadingRegions}
          >
            <MenuItem value="">All</MenuItem>
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
        <FormControl size="small" sx={{ width: 180 }}>
          <InputLabel>City</InputLabel>
          <Select
            value={cityIdFilter}
            label="City"
            onChange={(e) => setCityIdFilter(e.target.value || '')}
            disabled={!countryIdFilter || loadingCities}
          >
            <MenuItem value="">All</MenuItem>
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
