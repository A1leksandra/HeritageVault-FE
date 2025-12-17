import { Button, Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { useState, useRef } from 'react';
import { Delete, Upload } from '@mui/icons-material';
import { getImageUrl } from '../utils';

interface LandmarkImagePanelProps {
  imageUrl: string | null;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function LandmarkImagePanel({ imageUrl, onUpload, onDelete }: LandmarkImagePanelProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (PNG, JPG, JPEG, or WEBP)');
      return;
    }

    setUploading(true);
    try {
      await onUpload(file);
    } catch (error) {
      // Error handling is done in parent via toast
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    setDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      // Error handling is done in parent via toast
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Image
        </Typography>
        {imageUrl ? (
          <Box>
            <CardMedia
              component="img"
              image={getImageUrl(imageUrl) || ''}
              alt="Landmark"
              sx={{ maxHeight: 400, objectFit: 'contain', mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Upload />}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || deleting}
              >
                Replace Image
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleDelete}
                disabled={uploading || deleting}
              >
                Delete Image
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No image uploaded
            </Typography>
            <Button
              variant="contained"
              startIcon={<Upload />}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || deleting}
            >
              Upload Image
            </Button>
          </Box>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
      </CardContent>
    </Card>
  );
}

