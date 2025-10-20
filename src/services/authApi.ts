import { mainApi } from "./mainApi";

export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export const authApi = mainApi.injectEndpoints({
    endpoints: (build) => ({
        register: build.mutation<string, RegisterRequest>({
            query: (body) => ({
                url: "/api/auth/register",
                method: "POST",
                body,
            }),
            // the endpoint returns text, not JSON object; RTK will handle string
            transformResponse: (response: string) => response,
        }),
        login: build.mutation<LoginResponse, LoginRequest>({
            query: (body) => ({
                url: "/api/auth/login",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
