import { type FormEvent, useState } from "react";
import { useLoginMutation } from "../services/authApi";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "" });
    const [login, { isLoading, isError, error }] = useLoginMutation();

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await login({
                username: form.username.trim(),
                password: form.password,
            }).unwrap();
            // store backend's token under our key used in mainApi
            localStorage.setItem("access_token", res.token);
            localStorage.setItem("auth_username", form.username);
            window.location.href = "/";
        } catch {
            /* handled by RTKQ state */
        }
    };

    return (
        <section className="section" style={{ width: "100vw", height: "100vh" }}>
            <button 
                className="button is-light" 
                onClick={() => navigate("/")}
                style={{ position: "absolute", top: "1.5rem", left: "1.5rem" }}
            >
                ← Back
            </button>
            <div className="container" style={{ maxWidth: 480 }}>
                <h1 className="title has-text-centered">Welcome back</h1>

                <form className="box" onSubmit={onSubmit}>
                    <div className="field">
                        <label className="label">Username</label>
                        <div className="control">
                            <input
                                className="input"
                                value={form.username}
                                onChange={(e) => setForm((s) => ({ ...s, username: e.target.value }))}
                                required
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Password</label>
                        <div className="control">
                            <input
                                className="input"
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                                required
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    {isError && (
                        <div className="notification is-danger is-light">
                            {((error as any)?.data?.message as string) || "Invalid credentials"}
                        </div>
                    )}

                    <div className="field">
                        <div className="control">
                            <button className={`button is-primary ${isLoading ? "is-loading" : ""}`} type="submit">
                                Log in
                            </button>
                        </div>
                    </div>
                </form>

                <p className="has-text-centered">
                    New here? <a href="/register">Create an account</a>
                </p>
            </div>
        </section>
    );
}
