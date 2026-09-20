import { useEffect, useRef, useState } from "react";
import { ListPlus, Check, Plus } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext";

export default function AddToPlaylistMenu({ videoId }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState(null); // null = not loaded yet
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openMenu = async () => {
    if (!user) return toast.error("Log in to save videos");
    setOpen(true);
    if (playlists === null) {
      try {
        const { data } = await api.get(`/playlists/user/${user._id}`);
        setPlaylists(data.data);
      } catch {
        toast.error("Couldn't load playlists");
      }
    }
  };

  // a playlist "contains" this video if the video id shows up in its videos array
  const containsVideo = (playlist) => playlist.videos?.includes(videoId);

  const handleToggle = async (playlist) => {
    const inPlaylist = containsVideo(playlist);
    try {
      if (inPlaylist) {
        await api.patch(`/playlists/remove/${videoId}/${playlist._id}`);
        setPlaylists((prev) =>
          prev.map((p) =>
            p._id === playlist._id
              ? { ...p, videos: p.videos.filter((v) => v !== videoId) }
              : p
          )
        );
      } else {
        await api.patch(`/playlists/add/${videoId}/${playlist._id}`);
        setPlaylists((prev) =>
          prev.map((p) =>
            p._id === playlist._id ? { ...p, videos: [...(p.videos || []), videoId] } : p
          )
        );
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const { data } = await api.post("/playlists", {
        name: newName,
        description: "Created from video page",
      });
      setPlaylists((prev) => [{ ...data.data, videos: [] }, ...prev]);
      setNewName("");
      setCreating(false);
    } catch {
      toast.error("Couldn't create playlist");
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => (open ? setOpen(false) : openMenu())}
        className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-ink-muted hover:border-ink hover:text-ink"
      >
        <ListPlus size={16} />
        Save
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-64 rounded-lg border border-border bg-surface p-3 shadow-lg">
          <p className="mb-2 text-xs font-medium text-ink-muted">Save to playlist</p>

          {playlists === null && <p className="text-xs text-ink-muted">Loading…</p>}
          {playlists?.length === 0 && !creating && (
            <p className="text-xs text-ink-muted">No playlists yet.</p>
          )}

          <ul className="max-h-48 space-y-1 overflow-y-auto">
            {playlists?.map((playlist) => (
              <li key={playlist._id}>
                <button
                  onClick={() => handleToggle(playlist)}
                  className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm text-ink hover:bg-surface2"
                >
                  <span className="truncate">{playlist.name}</span>
                  {containsVideo(playlist) && <Check size={14} className="text-gold" />}
                </button>
              </li>
            ))}
          </ul>

          {creating ? (
            <form onSubmit={handleCreate} className="mt-2 flex gap-1.5">
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Playlist name"
                className="min-w-0 flex-1 rounded border border-border bg-bg px-2 py-1 text-xs text-ink focus:border-gold focus:outline-none"
              />
              <button type="submit" className="text-xs font-medium text-gold">
                Add
              </button>
            </form>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="mt-2 flex items-center gap-1.5 text-xs text-gold hover:underline"
            >
              <Plus size={13} />
              New playlist
            </button>
          )}
        </div>
      )}
    </div>
  );
}
