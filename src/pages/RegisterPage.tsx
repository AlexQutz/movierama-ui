import { type FormEvent, useState } from "react";
import { useRegisterMutation } from "../services/authApi";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirm: "",
    });

    const [register, { isLoading, isError, error, isSuccess, data }] = useRegisterMutation();

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirm) {
            alert("Passwords do not match");
            return;
        }
        try {
            await register({
                username: form.username.trim(),
                password: form.password,
                email: form.email.trim(),
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
            }).unwrap();
            window.location.href = "/login";
        } catch {
            /* handled by RTK Query's state */
        }
    };

    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((s) => ({ ...s, [k]: e.target.value }));

    return (
        <section className="section" style={{width: "100vw", height: "100vh"}}>
            <button 
                className="button is-light" 
                onClick={() => navigate("/")}
                style={{ position: "absolute", top: "1.5rem", left: "1.5rem" }}
            >
                ← Back
            </button>
            <div className="container" style={{ maxWidth: 560 }}>
                <h1 className="title has-text-centered">Create your account</h1>

                <form className="box" onSubmit={onSubmit}>
                    <div className="columns">
                        <div className="column">
                            <div className="field">
                                <label className="label">First name</label>
                                <div className="control">
                                    <input className="input" value={form.firstName} onChange={set("firstName")} required />
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="field">
                                <label className="label">Last name</label>
                                <div className="control">
                                    <input className="input" value={form.lastName} onChange={set("lastName")} required />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Username</label>
                        <div className="control">
                            <input className="input" placeholder="jdoe" value={form.username} onChange={set("username")} required />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Email</label>
                        <div className="control">
                            <input
                                className="input"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={set("email")}
                                required
                            />
                        </div>
                    </div>

                    <div className="columns">
                        <div className="column">
                            <div className="field">
                                <label className="label">Password</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="password"
                                        minLength={6}
                                        value={form.password}
                                        onChange={set("password")}
                                        required
                                    />
                                </div>
                                <p className="help">At least 6 characters.</p>
                            </div>
                        </div>
                        <div className="column">
                            <div className="field">
                                <label className="label">Confirm password</label>
                                <div className="control">
                                    <input className="input" type="password" value={form.confirm} onChange={set("confirm")} required />
                                </div>
                            </div>
                        </div>
                    </div>

                    {isError && (
                        <div className="notification is-danger is-light">
                            {((error as any)?.data?.message as string) || "Registration failed"}
                        </div>
                    )}
                    {isSuccess && (
                        <div className="notification is-success is-light">
                            {data || "User registered successfully"}
                        </div>
                    )}

                    <div className="field">
                        <div className="control">
                            <button className={`button is-primary ${isLoading ? "is-loading" : ""}`} type="submit">
                                Create account
                            </button>
                        </div>
                    </div>
                </form>

                <p className="has-text-centered">
                    Already have an account? <a href="/login">Log in</a>
                </p>
            </div>
        </section>
    );
}
