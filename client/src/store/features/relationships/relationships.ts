import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Status } from "../../../types";
import {
  IAllYearsOrgName,
  IOrganizationByYear,
  IOrganizationsByArea,
  ITopRegionsForOrg,
} from "../../../relationshipsTypes";
import axios from "axios";

interface IRelationshipsType {
  organizationsByArea: IOrganizationsByArea[] | null;
  organizationByYear: IOrganizationByYear[] | null;
  topRegionsForOrg: ITopRegionsForOrg[] | null;
  allYearsOrgName: IAllYearsOrgName[] | null;
  status: Status;
  error: string | null;
}

const initialState: IRelationshipsType = {
  organizationsByArea: null,
  organizationByYear: null,
  topRegionsForOrg: null,
  allYearsOrgName: null,
  status: "idle",
  error: null,
};
const BASE_URL = import.meta.env.VITE_BASE_URL;
export const getOrganizationsByArea = createAsyncThunk(
  "relationships/organizationsByArea",
  async ({ region, limit }: { region: string; limit: string }) => {
    const response = await axios.get(
      `${BASE_URL}/api/analysis/relationships/top-groups/${region}?limit=${limit}`
    );
    return response.data.data.response;
  }
);
export const getOrganizationByYear = createAsyncThunk(
  "relationships/organizationByYear",
  async ({ year }: { year: string }) => {
    const response = await axios.get(
      `${BASE_URL}/api/analysis/relationships/groups-by-year/${year})`
    );
    return response.data.data.response;
  }
);
export const getAllYearsOfGroup = createAsyncThunk(
  "relationships/getAllYearsOrgName",
  async ({ year, group: groupName }: {year: string, group: string }) => {
    const response = await axios.get(
      `${BASE_URL}/api/analysis/relationships/groups-by-year/${year}?${groupName}`
    );
    return response.data.data.response;
  }
);
export const getTopRegionsForOrg = createAsyncThunk(
  "relationships/topRegionsForOrg",
  async ({ orgName }: { orgName: string }) => {
    const response = await axios.get(
      `${BASE_URL}/api/analysis/relationships/deadliest-regions?orgName=${orgName}`
    );
    return response.data.data.response;
  }
);
export const relationshipsSlice = createSlice({
  name: "relationships",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrganizationsByArea.pending, (state) => {
        state.organizationsByArea = null;
        state.status = "pending";
        state.error = null;
      })
      .addCase(
        getOrganizationsByArea.fulfilled,
        (state, action: PayloadAction<IOrganizationsByArea[]>) => {
          state.organizationsByArea = action.payload;
          state.error = null;
          state.status = "fulfilled";
        }
      )
      .addCase(getOrganizationsByArea.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.status = "rejected";
        state.organizationsByArea = null;
      })
      .addCase(getOrganizationByYear.pending, (state) => {
        state.organizationByYear = null;
        state.status = "pending";
        state.error = null;
      })
      .addCase(
        getOrganizationByYear.fulfilled,
        (state, action: PayloadAction<IOrganizationByYear[]>) => {
          state.organizationByYear = action.payload;
          state.error = null;
          state.status = "fulfilled";
        }
      )
      .addCase(getOrganizationByYear.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.status = "rejected";
        state.organizationByYear = null;
      })
      .addCase(getTopRegionsForOrg.pending, (state) => {
        state.topRegionsForOrg = null;
        state.status = "pending";
        state.error = null;
      })
      .addCase(
        getTopRegionsForOrg.fulfilled,
        (state, action: PayloadAction<ITopRegionsForOrg[]>) => {
          state.topRegionsForOrg = action.payload;
          state.error = null;
          state.status = "fulfilled";
        }
      )
      .addCase(getTopRegionsForOrg.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.status = "rejected";
        state.topRegionsForOrg = null;
      })
      .addCase(getAllYearsOfGroup.pending, (state) => {
        state.allYearsOrgName = null;
        state.status = "pending";
        state.error = null;
      })
      .addCase(
        getAllYearsOfGroup.fulfilled,
        (state, action: PayloadAction<IAllYearsOrgName[]>) => {
          state.allYearsOrgName = action.payload;
          state.error = null;
          state.status = "fulfilled";
        }
      )
      .addCase(getAllYearsOfGroup.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.status = "rejected";
        state.allYearsOrgName = null;
      });
  },
});

export default relationshipsSlice.reducer;
