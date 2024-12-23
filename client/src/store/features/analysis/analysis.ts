import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  IAreasWithTheHighestAverageCasualties,
  IAttackByYear,
  IAttackTypesPerCasualties,
} from "../../../types/analysisTypes";
import { Status } from "../../../types";

interface IAnalysisStatType {
  attackTypesPerKind: IAttackTypesPerCasualties[] | null;
  areasWithTheHighestAverageCasualties:
    | IAreasWithTheHighestAverageCasualties[]
    | null;
  attackByYear: IAttackByYear[] | null;
  status: Status;
  error: string | null;
}

const initialState: IAnalysisStatType = {
  attackTypesPerKind: null,
  areasWithTheHighestAverageCasualties: null,
  attackByYear: null,
  status: "idle",
  error: null,
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const gatAttackTypesPerKind = createAsyncThunk(
  "analysis/attackPerType",
  async () => {
    const response = await axios.get(
      `${BASE_URL}/api/analysis/deadliest-attack-types`
    );
    return response.data.data.response;
  }
);
export const getAreasWithTheHighestAverageCasualties = createAsyncThunk(
  "analysis/getTheHighestByAvg",
  async () => {
    const response = await axios.get(
      `${BASE_URL}/api/analysis/highest-casualty-regions`
    );
    return response.data.data.response;
  }
);

export const getEventsByYear = createAsyncThunk(
  "analysis/getEventsByYear",
  async ({ year, yearTo }: { year: string; yearTo: string }) => {
    const response = await axios.get(
      `${BASE_URL}/api/analysis/incident-trends/${year}/${yearTo}`
    );
    return response.data.data.response;
  }
);

export const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(gatAttackTypesPerKind.pending, (state) => {
        state.attackTypesPerKind = null;
        state.status = "pending";
        state.error = null;
      })
      .addCase(
        gatAttackTypesPerKind.fulfilled,
        (state, action: PayloadAction<IAttackTypesPerCasualties[]>) => {
          state.attackTypesPerKind = action.payload;
          state.error = null;
          state.status = "fulfilled";
        }
      )
      .addCase(gatAttackTypesPerKind.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.status = "rejected";
        state.attackTypesPerKind = null;
      })
      .addCase(getAreasWithTheHighestAverageCasualties.pending, (state) => {
        state.areasWithTheHighestAverageCasualties = null;
        state.status = "pending";
        state.error = null;
      })
      .addCase(
        getAreasWithTheHighestAverageCasualties.fulfilled,
        (
          state,
          action: PayloadAction<IAreasWithTheHighestAverageCasualties[]>
        ) => {
          state.areasWithTheHighestAverageCasualties = action.payload;
          state.error = null;
          state.status = "fulfilled";
        }
      )
      .addCase(
        getAreasWithTheHighestAverageCasualties.rejected,
        (state, action) => {
          state.error = action.error.message || "Failed to fetch data";
          state.status = "rejected";
          state.areasWithTheHighestAverageCasualties = null;
        }
      )
      .addCase(getEventsByYear.pending, (state) => {
        state.attackByYear = null;
        state.status = "pending";
        state.error = null;
      })
      .addCase(
        getEventsByYear.fulfilled,
        (state, action: PayloadAction<IAttackByYear[]>) => {
          state.attackByYear = action.payload;
          state.error = null;
          state.status = "fulfilled";
        }
      )
      .addCase(getEventsByYear.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch data";
        state.status = "rejected";
        state.attackByYear = null;
      });
  },
});

export default analysisSlice.reducer;
