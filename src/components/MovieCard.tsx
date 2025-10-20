import { type MovieDto } from "../services/moviesApi";

export default function MovieCard({
                                      movie,
                                      onUserClick,
                                      onReact,
                                  }: {
    movie: MovieDto;
    onUserClick?: (user: { userId?: number; userName: string }) => void;
    onReact?: (movieId: number, action: "LIKE" | "HATE") => void;
}) {
    const formattedDate = new Date(movie.createdAt).toLocaleDateString();

    const handleLike = () => onReact?.(movie.id, "LIKE");
    const handleHate = () => onReact?.(movie.id, "HATE");

    return (
        <div className="card" style={{ height: "100%" }}>
            <div className="card-content">
                <div className="media">
                    <div className="media-content">
                        <p className="title is-5">{movie.title}</p>

                        {onUserClick ? (
                            <button
                                type="button"
                                className="subtitle is-6 button is-text p-0"
                                onClick={() => onUserClick({userId: (movie as any).userId, userName: movie.userName})}
                                title={`View all by ${movie.userName}`}
                                style={{textDecoration: "underline"}}
                            >
                                by {movie.userName}
                            </button>
                        ) : (
                            <p className="subtitle is-6">by {movie.userName}</p>
                        )}
                    </div>
                </div>

                <div className="content">
                    <p>{movie.description}</p>
                    <p className="is-size-7 has-text-grey mt-2">
                        Posted on <strong>{formattedDate}</strong>
                    </p>
                </div>

                <div className="level mt-3">
                    <div className="level-left">
                        {/* 👍 Like Button */}
                        <button
                            className={`button is-small ${
                                movie.userLiked ? "is-info" : "is-light"
                            }`}
                            title="Like"
                            onClick={handleLike}
                        >
                            👍 <span className="ml-1">{movie.likeCount}</span>
                        </button>

                        {/* 👎 Hate Button */}
                        <button
                            className={`button is-small ml-2 ${
                                movie.userHated ? "is-info" : "is-light"
                            }`}
                            title="Hate"
                            onClick={handleHate}
                        >
                            👎 <span className="ml-1">{movie.hateCount}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
