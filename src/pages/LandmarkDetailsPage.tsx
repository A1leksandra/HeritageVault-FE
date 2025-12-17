import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  Link,
  Divider,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useToast } from '../components/ToastProvider';
import { LandmarkImagePanel } from '../components/LandmarkImagePanel';
import { getLandmark, uploadLandmarkImage, deleteLandmarkImage } from '../api/landmarksApi';
import { getErrorMessage } from '../api/http';
import type { LandmarkDetailsDto } from '../types';
import {
  formatEnum,
  ProtectionStatusLabels,
  PhysicalConditionLabels,
  AccessibilityStatusLabels,
  toNumberId,
} from '../utils';

export function LandmarkDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [landmark, setLandmark] = useState<LandmarkDetailsDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const loadLandmark = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getLandmark(id);
      setLandmark(data);
      setNotFound(false);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setNotFound(true);
      } else {
        showToast(getErrorMessage(error), 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLandmark();
  }, [id]);

  const handleImageUpload = async (file: File) => {
    if (!id || !landmark) return;
    try {
      await uploadLandmarkImage(id, file);
      // Reload landmark to get updated image URL
      const updated = await getLandmark(id);
      setLandmark(updated);
      showToast('Image uploaded successfully', 'success');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
      throw error;
    }
  };

  const handleImageDelete = async () => {
    if (!id || !landmark) return;
    try {
      await deleteLandmarkImage(id);
      const updated = await getLandmark(id);
      setLandmark(updated);
      showToast('Image deleted successfully', 'success');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
      throw error;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (notFound || !landmark) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/landmarks')} sx={{ mb: 2 }}>
          Back to Landmarks
        </Button>
        <Typography variant="h5">Landmark not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/landmarks')} sx={{ mb: 2 }}>
        Back to Landmarks
      </Button>
      <Typography variant="h4" component="h1" gutterBottom>
        {landmark.name}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    ID
                  </Typography>
                  <Typography variant="body1">{toNumberId(landmark.id)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    City
                  </Typography>
                  <Typography variant="body1">{landmark.cityName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Region
                  </Typography>
                  <Typography variant="body1">{landmark.regionName || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Country
                  </Typography>
                  <Typography variant="body1">{landmark.countryName}</Typography>
                </Grid>
                {landmark.description && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1">{landmark.description}</Typography>
                  </Grid>
                )}
                {landmark.address && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body1">{landmark.address}</Typography>
                  </Grid>
                )}
                {landmark.latitude !== null && landmark.longitude !== null && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Latitude
                      </Typography>
                      <Typography variant="body1">{landmark.latitude}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Longitude
                      </Typography>
                      <Typography variant="body1">{landmark.longitude}</Typography>
                    </Grid>
                  </>
                )}
                {landmark.firstMentionYear !== null && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      First Mention Year
                    </Typography>
                    <Typography variant="body1">{landmark.firstMentionYear}</Typography>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Protection Status
                  </Typography>
                  <Typography variant="body1">
                    {formatEnum(ProtectionStatusLabels, landmark.protectionStatus)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Physical Condition
                  </Typography>
                  <Typography variant="body1">
                    {formatEnum(PhysicalConditionLabels, landmark.physicalCondition)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Accessibility Status
                  </Typography>
                  <Typography variant="body1">
                    {formatEnum(AccessibilityStatusLabels, landmark.accessibilityStatus)}
                  </Typography>
                </Grid>
                {landmark.externalRegistryUrl && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      External Registry URL
                    </Typography>
                    <Link href={landmark.externalRegistryUrl} target="_blank" rel="noopener noreferrer">
                      {landmark.externalRegistryUrl}
                    </Link>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <LandmarkImagePanel
            imageUrl={landmark.imageUrl}
            onUpload={handleImageUpload}
            onDelete={handleImageDelete}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

