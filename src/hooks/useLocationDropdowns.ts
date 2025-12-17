import { useState, useEffect } from 'react';
import { getCountries, getRegions, getCities } from '../api';
import { getErrorMessage } from '../api/http';
import { useToast } from '../components/ToastProvider';
import type { CountryListItemDto, RegionListItemDto, CityListItemDto } from '../types';
import { toNumberId } from '../utils';

export function useLocationDropdowns() {
  const { showToast } = useToast();
  const [countries, setCountries] = useState<CountryListItemDto[]>([]);
  const [regions, setRegions] = useState<RegionListItemDto[]>([]);
  const [cities, setCities] = useState<CityListItemDto[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Load countries (only active, non-deleted)
  const loadCountries = async () => {
    setLoadingCountries(true);
    try {
      const data = await getCountries({ IncludeDeleted: false });
      setCountries(data);
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
    } finally {
      setLoadingCountries(false);
    }
  };

  // Load regions for a country
  const loadRegions = async (countryId: number | string | null | undefined) => {
    if (!countryId) {
      setRegions([]);
      return;
    }
    setLoadingRegions(true);
    try {
      const data = await getRegions({ CountryId: toNumberId(countryId), IncludeDeleted: false });
      setRegions(data);
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
      setRegions([]);
    } finally {
      setLoadingRegions(false);
    }
  };

  // Load cities for a country and optional region
  const loadCities = async (
    countryId: number | string | null | undefined,
    regionId: number | string | null | undefined
  ) => {
    if (!countryId) {
      setCities([]);
      return;
    }
    setLoadingCities(true);
    try {
      const query: any = { CountryId: toNumberId(countryId), IncludeDeleted: false };
      if (regionId) {
        query.RegionId = toNumberId(regionId);
      }
      const data = await getCities(query);
      setCities(data);
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  // Load countries on mount
  useEffect(() => {
    loadCountries();
  }, []);

  return {
    countries,
    regions,
    cities,
    loadingCountries,
    loadingRegions,
    loadingCities,
    loadRegions,
    loadCities,
  };
}

