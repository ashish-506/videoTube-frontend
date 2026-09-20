import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ identifier: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4">
      <h1 className="font-display text-4xl tracking-wide text-ink">Welcome back</h1>
      <p className="mt-2 text-sm text-ink-muted">Log in to keep watching.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">Username or email</label>
          <input
            name="identifier"
            value={form.identifier}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-ink focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-ink focus:border-gold focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-2.5 font-semibold text-bg hover:bg-gold-dim disabled:opacity-60"
        >
          {submitting && <Spinner size={16} />}
          Log in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        New here?{" "}
        <Link to="/register" className="text-gold hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
