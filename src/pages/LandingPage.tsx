import { useMemo, useState } from "react";
import {
    useListMoviesByUserQuery,
    useListMoviesQuery, useReactToMovieMutation,
} from "../services/moviesApi";
import MovieCard from "../components/MovieCard";
import {getAuthInfo, logoutAndReload} from "../lib/auth.ts";

export default function LandingPage() {
    // pagination + sort
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(8);
    const [sortBy, setSortBy] = useState<"createdAt" | "likeCount" | "hateCount" | undefined>();
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    // active user filter (optional)
    const [filterUser, setFilterUser] = useState<{ userId?: number; userName: string } | null>(null);

    const { isAuthenticated, username } = getAuthInfo();

    const commonArgs = useMemo(
        () => ({ page, size, sortBy, sortDirection }),
        [page, size, sortBy, sortDirection]
    );

    // choose which query to use
    const listAll = useListMoviesQuery(commonArgs, { skip: !!filterUser });
    const listByUser = useListMoviesByUserQuery(
        filterUser ? { userId: filterUser.userId!, ...commonArgs } : ({} as any),
        { skip: !filterUser || !filterUser.userId }
    );

    const { data, isFetching, isError, error, refetch: refetchAll } = listAll;
    const {
        data: dataUser,
        isFetching: fetchingUser,
        isError: errorUser,
        error: eUser,
        refetch: refetchUser,
    } = listByUser;

    const usingUser = !!(filterUser && filterUser.userId);
    const movies = (usingUser ? dataUser?.content : data?.content) ?? [];
    const totalPages = (usingUser ? dataUser?.totalPages : data?.totalPages) ?? 0;

    const [reactToMovie] = useReactToMovieMutation();

    // When switching filter or sort, stay consistent
    const onUserClick = (u: { userId?: number; userName: string }) => {
        if (!u.userId) {
            // If MovieDto doesn't include userId yet, tell the dev why filtering can't happen
            alert("This movie doesn't include a userId; please add userId to MovieDto to enable filtering.");
            return;
        }
        setFilterUser(u);
        setPage(0);
    };

    const onReact = async (movieId: number, action: "LIKE" | "HATE" | "RETRACT") => {
        try {
            await reactToMovie({ movieId, reaction: action }).unwrap();
            // refetch whichever list is active
            if (usingUser) {
                await refetchUser();
            } else {
                await refetchAll();
            }
        } catch (err: any) {
            // 401 (not logged in) or validation error
            const msg =
                err?.status === 401
                    ? "Please log in to react."
                    : err?.data?.message || "Failed to update reaction";
            alert(msg);
        }
    };

    const clearFilter = () => {
        setFilterUser(null);
        setPage(0);
    };

    const isFetchingAny = usingUser ? fetchingUser : isFetching;
    const isErrorAny = usingUser ? errorUser : isError;
    const errorAny = usingUser ? eUser : error;

    return (
        <section className="section">
            <div className="container">
                {/* Header */}
                <div className="level">
                    <div className="level-left">
                        <h1 className="title">🎬 MovieRama</h1>
                    </div>

                    <div className="level-right">


                        {isAuthenticated ? (
                            <div className="buttons">
                <span className="button is-static is-white is-light">
                  Hello{username ? `, ${username}` : ""}!
                </span>
                                <button className="button is-danger is-light" onClick={logoutAndReload}>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="buttons">
                                <a className="button is-light" href="/login">Log in</a>
                                <a className="button is-primary" href="/register">Register</a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Active filter pill */}


                {/* Controls */}
                <div className="box">
                    <div className="is-flex is-align-items-center is-align-self-stretch">
                        <div className="column is-narrow">
                            <label className="label">Sort</label>
                            <div className="select">
                                <select
                                    value={`${sortBy}:${sortDirection}`}
                                    onChange={(e) => {
                                        const [sb, dir] = e.target.value.split(":") as [typeof sortBy, typeof sortDirection];
                                        setSortBy(sb);
                                        setSortDirection(dir);
                                        setPage(0);
                                    }}
                                >
                                    <option value=""></option>
                                    <option value="createdAt:desc">Date (newest)</option>
                                    <option value="createdAt:asc">Date (oldest)</option>
                                    <option value="likeCount:desc">Likes (high → low)</option>
                                    <option value="likeCount:asc">Likes (low → high)</option>
                                    <option value="hateCount:desc">Hates (high → low)</option>
                                    <option value="hateCount:asc">Hates (low → high)</option>
                                </select>
                            </div>
                        </div>

                        <div className="column is-narrow">
                            <label className="label">Page size</label>
                            <div className="select">
                                <select
                                    value={size}
                                    onChange={(e) => {
                                        setSize(Number(e.target.value));
                                        setPage(0);
                                    }}
                                >
                                    <option value={8}>8</option>
                                    <option value={12}>12</option>
                                    <option value={16}>16</option>
                                </select>
                            </div>
                        </div>

                        <div className="column is-narrow">
                            <label className="label">Page</label>
                            <div className="buttons has-addons">
                                <button
                                    className="button"
                                    disabled={page === 0 || isFetching}
                                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                                >
                                    Prev
                                </button>
                                <span className="button is-static">
                  {totalPages ? `Page ${page + 1} of ${totalPages}` : "—"}
                </span>
                                <button
                                    className="button"
                                    disabled={page + 1 >= totalPages || isFetching}
                                    onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                        {filterUser && (
                            <div className="mb-4">
                                <div className="tags has-addons">
                                    <span className="tag is-info">Filtering by</span>
                                    <span className="tag is-info is-light">{filterUser.userName}</span>
                                    <button className="tag is-delete" onClick={clearFilter} />
                                </div>
                            </div>
                        )}
                        {isAuthenticated && (
                            <a className="button is-success" href="/addMovie">+ Add movie</a>
                        )}
                    </div>
                </div>

                {isErrorAny && (
                    <div className="notification is-danger is-light has-text-centered">
                        {((errorAny as any)?.data?.message as string) || "Failed to load movies"}
                    </div>
                )}
                {isFetchingAny && !movies.length && <p className="has-text-centered">Loading movies…</p>}

                {/* Grid */}
                <div className="columns is-multiline">
                    {movies.map((m) => (
                        <div key={m.id} className="column is-one-quarter-desktop is-half-tablet">
                            <MovieCard movie={m} onUserClick={onUserClick} onReact={onReact} />
                        </div>
                    ))}
                </div>

                {!isFetching && !isError && movies.length === 0 && (
                    <p className="has-text-centered">No movies found.</p>
                )}
            </div>
        </section>
    );
}
