import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import VideoCard from "../components/VideoCard";

export default function PlaylistDetail() {
  const { playlistId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/playlists/${playlistId}`)
      .then(({ data }) => setPlaylist(data.data))
      .catch(() => toast.error("Couldn't load playlist"))
      .finally(() => setLoading(false));
  }, [playlistId]);

  const handleRemoveVideo = async (videoId) => {
    try {
      await api.patch(`/playlists/remove/${videoId}/${playlistId}`);
      setPlaylist((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v._id !== videoId),
      }));
    } catch {
      toast.error("Couldn't remove video");
    }
  };

  const handleDeletePlaylist = async () => {
    if (!confirm("Delete this playlist? This can't be undone.")) return;
    try {
      await api.delete(`/playlists/${playlistId}`);
      toast.success("Playlist deleted");
      navigate("/playlists");
    } catch {
      toast.error("Couldn't delete playlist");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="mx-auto max-w-md py-24 text-center text-ink-muted">
        <p>Playlist not found.</p>
      </div>
    );
  }

  const isOwner = user?._id === playlist.owner;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-4xl tracking-wide text-ink">{playlist.name}</h1>
          <p className="mt-1 text-sm text-ink-muted">{playlist.description}</p>
        </div>
        {isOwner && (
          <button
            onClick={handleDeletePlaylist}
            className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm text-ink-muted hover:border-danger hover:text-danger"
          >
            <Trash2 size={14} />
            Delete playlist
          </button>
        )}
      </div>

      {playlist.videos?.length === 0 ? (
        <p className="py-12 text-center text-sm text-ink-muted">No videos in this playlist yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 py-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {playlist.videos?.map((video) => (
            <div key={video._id} className="relative">
              <VideoCard video={video} />
              {isOwner && (
                <button
                  onClick={() => handleRemoveVideo(video._id)}
                  className="absolute right-2 top-2 rounded-full bg-bg/90 p-1.5 text-ink-muted hover:text-danger"
                  aria-label="Remove from playlist"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
