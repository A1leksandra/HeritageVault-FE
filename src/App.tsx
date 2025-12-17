import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastProvider } from './components/ToastProvider';
import { Layout } from './components/Layout';
import { LandmarksPage } from './pages/LandmarksPage';
import { LandmarkDetailsPage } from './pages/LandmarkDetailsPage';
import { CountriesPage } from './pages/CountriesPage';
import { RegionsPage } from './pages/RegionsPage';
import { CitiesPage } from './pages/CitiesPage';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/landmarks" replace />} />
              <Route path="landmarks" element={<LandmarksPage />} />
              <Route path="landmarks/:id" element={<LandmarkDetailsPage />} />
              <Route path="countries" element={<CountriesPage />} />
              <Route path="regions" element={<RegionsPage />} />
              <Route path="cities" element={<CitiesPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
