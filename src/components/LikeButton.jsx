import { useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext";

// NOTE: the backend has no "give me the like status + count for this one
// video" endpoint — only a toggle and a "get all videos I've liked" list.
// So the initial liked state is derived client-side by checking whether
// this video appears in that list. There's also no total-like-count
// endpoint for an arbitrary video, so this button intentionally shows
// liked/not-liked only, not a count.
export default function LikeButton({ videoId }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    api
      .get("/likes/videos")
      .then(({ data }) => {
        setLiked(data.data.some((v) => v._id === videoId));
      })
      .catch(() => {});
  }, [user, videoId]);

  const handleToggle = async () => {
    if (!user) return toast.error("Log in to like videos");
    setLoading(true);
    try {
      const { data } = await api.post(`/likes/toggle/v/${videoId}`);
      setLiked(data.data.liked);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
        liked
          ? "border-gold bg-gold/10 text-gold"
          : "border-border text-ink-muted hover:border-ink hover:text-ink"
      }`}
    >
      <ThumbsUp size={16} fill={liked ? "currentColor" : "none"} />
      {liked ? "Liked" : "Like"}
    </button>
  );
}
