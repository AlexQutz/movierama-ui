import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl =
    import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ?? "/api"; // use Vite proxy in dev

export const mainApi = createApi({
    reducerPath: "mainApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ?? "http://localhost:8080",
        prepareHeaders: (headers) => {
            headers.set("content-type", "application/json");
            const token = localStorage.getItem("access_token");
            if (token) headers.set("authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ["Movies"],
    endpoints: () => ({}),
});
