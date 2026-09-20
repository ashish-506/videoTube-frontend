import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios";
import Spinner from "../components/Spinner";

export default function Upload() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "" });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) return toast.error("A video file is required");
    if (!thumbnail) return toast.error("A thumbnail is required");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);

    setSubmitting(true);
    setProgress(0);
    try {
      const { data } = await api.post("/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          setProgress(Math.round((evt.loaded * 100) / evt.total));
        },
      });
      toast.success("Video published");
      navigate(`/watch/${data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="font-display text-4xl tracking-wide text-ink">Upload a video</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Video and thumbnail files are both required.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-ink focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-2.5 text-ink focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">
            Video file <span className="text-danger">*</span>
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            required
            className="w-full text-sm text-ink-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface2 file:px-4 file:py-2 file:text-ink hover:file:bg-border"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">
            Thumbnail <span className="text-danger">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            required
            className="w-full text-sm text-ink-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface2 file:px-4 file:py-2 file:text-ink hover:file:bg-border"
          />
        </div>

        {submitting && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface2">
            <div
              className="h-full bg-gold transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-2.5 font-semibold text-bg hover:bg-gold-dim disabled:opacity-60"
        >
          {submitting && <Spinner size={16} />}
          {submitting ? `Uploading ${progress}%` : "Publish"}
        </button>
      </form>
    </div>
  );
}
