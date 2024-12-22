import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../../types";
import {
  IAttackTypesPerCasualties,
  IHighestCasualtyRegions,
  IIncidentTrends,
} from "../../types/AnalysisStateType";
import axios from "axios";

interface AnalysisStateType {
  attackTypesPerCasualties: IAttackTypesPerCasualties | null;
  highestCasualtyRegions: IHighestCasualtyRegions | null;
  incidentTrends: IIncidentTrends | null;
  status: Status;
  error: string | null;
}

const initialState: AnalysisStateType = {
  attackTypesPerCasualties: null,
  highestCasualtyRegions: null,
  status: "idle",
  error: null,
  incidentTrends: null,
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAttackTypesPerCasualties = createAsyncThunk(
  "analysis/getAttackTypesPerCasualties",
  async () => {
    const response = await axios.get(
      `${BASE_URL}/api/analysis/deadliest-attack-types`
    );
    return response.data.data.response;
  }
);

export const getHighestCasualtyRegions = createAsyncThunk(
  "analysis/getHighestCasualtyRegions",
  async () => {
    const response = await axios.get(
      `${BASE_URL}/api/analysis/highest-casualty-regions`
    );
    return response.data;
  }
);

//מפה אין רדוסרים
export const getIncidentTrends = createAsyncThunk(
  "analysis/getIncidentTrends",
  async ({ from, to }: { from: number; to: number }) => {
    async () => {
      const response = await axios.get(
        `${BASE_URL}/api/analysis/incident-trends/${from}/${to}`
      );
      return response.data;
    };
  }
);

export const getTopGroupsInRegion = createAsyncThunk(
  "analysis/getTopGroupsInRegion",
  async () => {
    const response = await axios.get(
      `${BASE_URL}/api/analysis/incident-trends`
    );
    return response.data;
  }
);

export const getGroupsByYear = createAsyncThunk(
  "analysis/getGroupsByYear",
  async () => {
    const response = await axios.get(
      `${BASE_URL}/api/analysis/incident-trends`
    );
    return response.data;
  }
);

export const analysisSlice = {
  name: "analysis",
  initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder
      .addCase(getAttackTypesPerCasualties.pending, (state: any) => {
        state.status = "loading";
        state.error = null;
        state.attackTypesPerCasualties = null;
      })

      .addCase(
        getAttackTypesPerCasualties.fulfilled,
        (state: any, action: PayloadAction<any>) => {
          state.status = "succeeded";
          state.error = null;
          state.attackTypesPerCasualties = action.payload;
          console.log(state.attackTypesPerCasualties);
        }
      )

      .addCase(
        getAttackTypesPerCasualties.rejected,
        (state: any, action: any) => {
          state.status = "failed";
          state.error = action.error.message;
          state.attackTypesPerCasualties = null;
        }
      )

      .addCase(getHighestCasualtyRegions.pending, (state: any) => {
        state.status = "loading";
        state.error = null;
        state.highestCasualtyRegions = null;
      })

      .addCase(
        getHighestCasualtyRegions.fulfilled,
        (state: any, action: PayloadAction<any>) => {
          state.status = "succeeded";
          state.error = null;
          state.highestCasualtyRegions = action.payload;
          console.log(state.highestCasualtyRegions);
        }
      )

      .addCase(
        getHighestCasualtyRegions.rejected,
        (state: any, action: any) => {
          state.status = "failed";
          state.error = action.error.message;
          state.highestCasualtyRegions = null;
        }
      );
  },
};

export default analysisSlice;
