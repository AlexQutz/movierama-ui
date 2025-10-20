import { configureStore } from "@reduxjs/toolkit";
import { mainApi } from "../services/mainApi";

export const store = configureStore({
    reducer: {
        [mainApi.reducerPath]: mainApi.reducer,
    },
    middleware: (getDefault) => getDefault().concat(mainApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
