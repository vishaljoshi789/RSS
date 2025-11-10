"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import useSWRImmutable from "swr/immutable";
import useAxios from "@/hooks/use-axios";
import { useAuth } from "@/hooks/use-auth";

// Type definitions
interface CountryItem {
  name: string;
  code?: string;
}

interface StateItem {
  id?: number;
  name: string;
}

interface DistrictItem {
  id?: number;
  name: string;
  state?: number;
  state_id?: number;
}

interface CreateStatePayload {
  name: string;
}

interface CreateDistrictPayload {
  name: string;
  state: number;
}

interface UseCountryApiReturn {
  // Data
  countries: CountryItem[];
  states: StateItem[];
  districts: DistrictItem[];

  // Loading states
  isLoadingCountries: boolean;
  isLoadingStates: boolean;
  isLoadingDistricts: boolean;
  isCreatingState: boolean;
  isCreatingDistrict: boolean;

  // Error states
  countriesError: string | null;
  statesError: string | null;
  districtsError: string | null;
  createStateError: string | null;
  createDistrictError: string | null;

  canCreateState: boolean;
  canCreateDistrict: boolean;

  // Fetch functions
  fetchCountries: () => Promise<void>;
  fetchStates: () => Promise<void>;
  fetchDistricts: (stateId?: number) => Promise<void>;
  refreshCountries: () => Promise<void>;
  refreshStates: () => Promise<void>;
  refreshDistricts: (stateId?: number) => Promise<void>;

  // Create functions
  createState: (payload: CreateStatePayload) => Promise<StateItem | null>;
  createDistrict: (
    payload: CreateDistrictPayload
  ) => Promise<DistrictItem | null>;

  // Reset functions
  resetStates: () => void;
  resetDistricts: () => void;
  clearErrors: () => void;
}

export function useCountryApi(): UseCountryApiReturn {
  const { isAdmin, isStaff } = useAuth();
  const axios = useAxios();

  // Axios-backed fetcher for SWR
  const fetcher = useMemo(() => (url: string) => axios.get(url).then(r => r.data), [axios]);

  // Creation state & errors (SWR handles fetch states/errors)
  const [isCreatingState, setIsCreatingState] = useState(false);
  const [isCreatingDistrict, setIsCreatingDistrict] = useState(false);
  const [createStateError, setCreateStateError] = useState<string | null>(null);
  const [createDistrictError, setCreateDistrictError] = useState<string | null>(null);

  // Countries (static for now; if endpoint appears, swap to useSWR)
  const { data: countriesData, error: countriesErr } = useSWRImmutable<CountryItem[]>(
    "countries-static",
    async () => [{ name: "India" }]
  );
  const countries = countriesData ?? [];
  const isLoadingCountries = !countriesData && !countriesErr;
  const countriesError = countriesErr ? (countriesErr as Error).message : null;

  // States
  const STATES_KEY = "/dashboard/states" as const;
  const { data: statesData, error: statesErr, isLoading: loadingStates, mutate: mutateStates } = useSWR<StateItem[] | { results: StateItem[] }>(STATES_KEY, fetcher);
  const states = Array.isArray(statesData) 
    ? statesData 
    : (statesData as { results?: StateItem[] })?.results ?? [];
  const statesError = statesErr ? (statesErr as Error).message : null;
  const isLoadingStates = loadingStates;

  // Districts (keyed by selected state id)
  const [selectedStateId, setSelectedStateId] = useState<number | undefined>(undefined);
  const districtsKey = selectedStateId ? `/dashboard/districts/?state=${selectedStateId}` : null;
  const { data: districtsData, error: districtsErr, isLoading: loadingDistricts, mutate: mutateDistricts } = useSWR<DistrictItem[] | { results: DistrictItem[] } | undefined>(districtsKey, fetcher);
  const districts = Array.isArray(districtsData) 
    ? districtsData 
    : (districtsData as { results?: DistrictItem[] })?.results ?? [];
  const districtsError = districtsErr ? (districtsErr as Error).message : null;
  const isLoadingDistricts = loadingDistricts;

  const canCreateState = isAdmin() || isStaff();
  const canCreateDistrict = isAdmin() || isStaff();

  const fetchCountries = async () => { /* static immutable; no op */ };
  const doRefreshCountries = async () => { await globalMutate("countries-static"); };

  const fetchStates = async () => { await mutateStates(); };
  const doRefreshStates = async () => { await mutateStates(); };

  const fetchDistricts = async (stateId?: number) => {
    setSelectedStateId(stateId);
    if (stateId) await mutateDistricts();
  };
  const doRefreshDistricts = async (stateId?: number) => {
    setSelectedStateId(stateId);
    if (stateId) await mutateDistricts();
  };

  // Create state function
  const createState = async (payload: CreateStatePayload): Promise<StateItem | null> => {
    if (!canCreateState) {
      const errorMessage =
        "You do not have permission to create states. Only admin and staff users can perform this action.";
      setCreateStateError(errorMessage);
      console.error("Permission denied: User cannot create states");
      return null;
    }

    setIsCreatingState(true);
    setCreateStateError(null);

    try {
  const response = await axios.post("/admin/states/create/", payload);
  const newState = response.data;
  await mutateStates();
  return newState;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create state";
      setCreateStateError(errorMessage);
      console.error("Error creating state:", error);
      return null;
    } finally {
      setIsCreatingState(false);
    }
  };

  // Create district function
  const createDistrict = async (payload: CreateDistrictPayload): Promise<DistrictItem | null> => {
    if (!canCreateDistrict) {
      const errorMessage =
        "You do not have permission to create districts. Only admin and staff users can perform this action.";
      setCreateDistrictError(errorMessage);
      console.error("Permission denied: User cannot create districts");
      return null;
    }

    setIsCreatingDistrict(true);
    setCreateDistrictError(null);

    try {
      const response = await axios.post("/admin/districts/create/", payload);
      const newDistrict = response.data;
      await globalMutate(`/dashboard/districts/?state=${payload.state}`);
      return newDistrict;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create district";
      setCreateDistrictError(errorMessage);
      console.error("Error creating district:", error);
      return null;
    } finally {
      setIsCreatingDistrict(false);
    }
  };

  const resetStates = (): void => {
    setSelectedStateId(undefined);
    globalMutate(STATES_KEY, [], false);
  };

  const resetDistricts = (): void => {
    setSelectedStateId(undefined);
  };

  const clearErrors = (): void => {
    setCreateStateError(null);
    setCreateDistrictError(null);
  };

  useEffect(() => { /* countries static */ }, []);

  // Public refresh alias functions
  const refreshCountries = doRefreshCountries;
  const refreshStates = doRefreshStates;
  const refreshDistricts = doRefreshDistricts;

  return {
    // Data
  countries,
  states,
  districts,

    // Loading states
  isLoadingCountries,
  isLoadingStates,
  isLoadingDistricts,
    isCreatingState,
    isCreatingDistrict,

    // Error states
  countriesError,
  statesError,
  districtsError,
    createStateError,
    createDistrictError,

    canCreateState,
    canCreateDistrict,

    // Functions
    fetchCountries,
    fetchStates,
    fetchDistricts,
    refreshCountries,
    refreshStates,
    refreshDistricts,
    createState,
    createDistrict,

    // Reset functions
    resetStates,
    resetDistricts,
    clearErrors,
  };
}
