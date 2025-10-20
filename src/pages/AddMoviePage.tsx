import { type FormEvent, useState } from "react";
import { useCreateMovieMutation } from "../services/moviesApi";


export default function AddMoviePage() {
    const [form, setForm] = useState({ title: "", description: "" });
    const [createMovie, { isLoading, isError, error, isSuccess, data }] = useCreateMovieMutation();

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const title = form.title.trim();
        const description = form.description.trim();

        if (!title) {
            alert("Title is required");
            return;
        }

        try {
            await createMovie({ title, description }).unwrap();
            alert("Movie created successfully!");
        } catch (err: any) {
            const msg = err?.data?.message || "Failed to create movie";
            alert(msg);
        }
    };

    return (
        <section className="section">
            <div className="container" style={{ maxWidth: 640 }}>
                <h1 className="title">+ Add movie</h1>

                <form className="box" onSubmit={onSubmit}>
                    <div className="field">
                        <label className="label">Title</label>
                        <div className="control">
                            <input
                                className="input"
                                value={form.title}
                                onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                                required
                                maxLength={200}
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Description</label>
                        <div className="control">
              <textarea
                  className="textarea"
                  value={form.description}
                  onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                  rows={5}
                  maxLength={2000}
              />
                        </div>
                    </div>

                    {isError && (
                        <div className="notification is-danger is-light">
                            {((error as any)?.data?.message as string) || "Failed to create movie"}
                        </div>
                    )}
                    {isSuccess && data && (
                        <div className="notification is-success is-light">
                            Created: <strong>{data.title}</strong>
                        </div>
                    )}

                    <div className="field is-grouped">
                        <div className="control">
                            <button className={`button is-primary ${isLoading ? "is-loading" : ""}`} type="submit">
                                Save
                            </button>
                        </div>
                        <div className="control">
                            <button type="button" className="button" onClick={() => navigate("/")}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}
