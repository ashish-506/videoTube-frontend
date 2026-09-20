import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

export default function Playlists() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    api
      .get(`/playlists/user/${user._id}`)
      .then(({ data }) => setPlaylists(data.data))
      .catch(() => toast.error("Couldn't load playlists"))
      .finally(() => setLoading(false));
  }, [user._id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) {
      return toast.error("Name and description are both required");
    }
    try {
      const { data } = await api.post("/playlists", form);
      setPlaylists((prev) => [{ ...data.data, videoCount: 0 }, ...prev]);
      setForm({ name: "", description: "" });
      setCreating(false);
    } catch {
      toast.error("Couldn't create playlist");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl tracking-wide text-ink">Your playlists</h1>
        <button
          onClick={() => setCreating((c) => !c)}
          className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-bg hover:bg-gold-dim"
        >
          <Plus size={16} />
          New
        </button>
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="mt-6 space-y-3 rounded-lg border border-border bg-surface p-4">
          <input
            placeholder="Playlist name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-ink focus:border-gold focus:outline-none"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full resize-none rounded-lg border border-border bg-bg px-4 py-2.5 text-ink focus:border-gold focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-bg hover:bg-gold-dim"
          >
            Create
          </button>
        </form>
      )}

      {playlists.length === 0 ? (
        <p className="mt-8 text-sm text-ink-muted">
          No playlists yet — save a video from its watch page or create one above.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-border border-y border-border">
          {playlists.map((playlist) => (
            <li key={playlist._id}>
              <Link
                to={`/playlist/${playlist._id}`}
                className="flex items-center justify-between py-4 hover:text-gold"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{playlist.name}</p>
                  <p className="mt-1 text-xs text-ink-muted">{playlist.description}</p>
                </div>
                <span className="shrink-0 text-xs text-ink-muted">
                  {playlist.videoCount} video{playlist.videoCount === 1 ? "" : "s"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
