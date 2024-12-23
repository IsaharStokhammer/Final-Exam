import { configureStore } from "@reduxjs/toolkit";
import analysisReducer from "./features/analysis/analysis";
import relationshipsReducer from "./features/relationships/relationships";
export const store = configureStore({
    reducer: {
        analysis: analysisReducer,
        relationships:relationshipsReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
