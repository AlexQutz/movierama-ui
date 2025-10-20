import { mainApi } from "./mainApi";

export type SortDirection = "ASC" | "DESC";

export interface PagingRequest {
    page: number;
    size: number;
    sortBy: string;
    sortDirection: SortDirection;
}

export interface PagingResponse<T> {
    content: T[];
    page: number;
    totalPages: number;
    totalElements?: number;
    size?: number;
}

export interface MovieRegistrationDto {
    title: string;
    description: string;
}

export interface MovieDto {
    id: number;
    title: string;
    description: string;
    userName: string;
    createdAt: string;
    likeCount: number;
    hateCount: number;
    userLiked?: false;
    userHated?: false;
    userId?: number;
}

export type Reaction = "LIKE" | "HATE" | "RETRACT";

export const moviesApi = mainApi.injectEndpoints({
    endpoints: (build) => ({
        listMovies: build.query<PagingResponse<MovieDto>, PagingRequest>({
            query: (body) => ({
                url: "/api/movies",
                method: "POST",
                body,
            }),
            providesTags: (result, _err, arg) => [
                { type: "Movies", id: `PAGE-${arg.page}-${arg.size}-${arg.sortBy}-${arg.sortDirection}` },
                { type: "Movies", id: "LIST" },
            ],
        }),
        listMoviesByUser: build.query<
            PagingResponse<MovieDto>,
            { userId: number } & Partial<PagingRequest>
        >({
            query: ({ userId, page = 0, size = 8, sortBy = "createdAt", sortDirection = "desc" }) => ({
                url: `/api/movies/user/${userId}`,
                method: "POST",
                body: { page, size, sortBy, sortDirection },
            }),
            providesTags: (result, _err, arg) => [
                { type: "Movies", id: `USER-${arg.userId}-${arg.page}-${arg.size}-${arg.sortBy}-${arg.sortDirection}` },
                { type: "Movies", id: "LIST" },
            ],
        }),
        reactToMovie: build.mutation<
            string,
            { movieId: number; reaction: Reaction }
        >({
            query: ({ movieId, reaction }) => ({
                url: `/api/secured/movies/${movieId}/react`,
                method: "POST",
                params: { reaction },
            }),
            invalidatesTags: [{ type: "Movies", id: "LIST" }],
        }),
        createMovie: build.mutation<
            MovieDto,
            MovieRegistrationDto
        >({
            query: (body) => ({
                url: "/api/secured/movies",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Movies", id: "LIST" }],
        }),
    }),
    overrideExisting: false,
});

export const { useListMoviesQuery, useListMoviesByUserQuery, useReactToMovieMutation, useCreateMovieMutation } = moviesApi;
