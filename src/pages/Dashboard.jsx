import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import api from "../lib/axios";
import Spinner from "../components/Spinner";
import { formatViews, timeAgo } from "../lib/format";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/dashboard/stats"), api.get("/dashboard/videos")])
      .then(([statsRes, videosRes]) => {
        setStats(statsRes.data.data);
        setVideos(videosRes.data.data);
      })
      .catch(() => toast.error("Couldn't load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const handleTogglePublish = async (video) => {
    try {
      const { data } = await api.patch(`/videos/toggle/publish/${video._id}`);
      setVideos((prev) => prev.map((v) => (v._id === video._id ? { ...v, isPublished: data.data.isPublished } : v)));
    } catch {
      toast.error("Couldn't update video");
    }
  };

  const handleDelete = async (videoId) => {
    if (!confirm("Delete this video? This can't be undone.")) return;
    try {
      await api.delete(`/videos/${videoId}`);
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch {
      toast.error("Couldn't delete video");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  const statCards = [
    { label: "Subscribers", value: stats.totalSubscribers },
    { label: "Videos", value: stats.totalVideos },
    { label: "Total views", value: stats.totalViews },
    { label: "Total likes", value: stats.totalLikes },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-4xl tracking-wide text-ink">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-lg border border-border bg-surface p-4">
            <p className="text-2xl font-semibold text-gold">{card.value}</p>
            <p className="mt-1 text-xs text-ink-muted">{card.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-sm font-semibold text-ink">Your videos</h2>

      {videos.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">
          You haven't uploaded anything yet. <Link to="/upload" className="text-gold hover:underline">Upload one</Link>.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {videos.map((video) => (
            <li key={video._id} className="flex items-center gap-4 py-3">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="h-14 w-24 shrink-0 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <Link to={`/watch/${video._id}`} className="truncate text-sm text-ink hover:text-gold">
                  {video.title}
                </Link>
                <p className="mt-1 text-xs text-ink-muted">
                  {formatViews(video.views)} · {video.likesCount} likes · {timeAgo(video.createdAt)}
                </p>
              </div>
              <button
                onClick={() => handleTogglePublish(video)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                  video.isPublished
                    ? "border border-border text-ink-muted hover:border-ink hover:text-ink"
                    : "bg-gold text-bg hover:bg-gold-dim"
                }`}
              >
                {video.isPublished ? "Unpublish" : "Publish"}
              </button>
              <button
                onClick={() => handleDelete(video._id)}
                aria-label="Delete video"
                className="shrink-0 text-ink-muted hover:text-danger"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
