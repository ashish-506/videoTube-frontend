import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // backend requires avatar — mirrors the same 400 the controller would
    // throw, but catching it client-side avoids a wasted network round trip
    if (!avatar) {
      toast.error("Avatar image is required");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    formData.append("avatar", avatar);
    if (coverImage) formData.append("coverImage", coverImage);

    setSubmitting(true);
    try {
      await register(formData);
      toast.success("Account created — log in to continue");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-10">
      <h1 className="font-display text-4xl tracking-wide text-ink">Create an account</h1>
      <p className="mt-2 text-sm text-ink-muted">Join to upload and watch.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">Full name</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-ink focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-ink focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
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
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">
            Avatar <span className="text-danger">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            required
            className="w-full text-sm text-ink-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface2 file:px-4 file:py-2 file:text-ink hover:file:bg-border"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">Cover image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
            className="w-full text-sm text-ink-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface2 file:px-4 file:py-2 file:text-ink hover:file:bg-border"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-2.5 font-semibold text-bg hover:bg-gold-dim disabled:opacity-60"
        >
          {submitting && <Spinner size={16} />}
          Create account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link to="/login" className="text-gold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
