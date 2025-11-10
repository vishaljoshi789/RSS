import { useMemo } from "react";
import useAxios from "@/hooks/use-axios";
import { createVolunteerAPI } from "../api";

export const useVolunteerAPI = () => {
  const axios = useAxios();
  
  const api = useMemo(() => {
    return createVolunteerAPI(axios);
  }, [axios]);

  return api;
};