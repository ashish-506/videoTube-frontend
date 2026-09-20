import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../lib/axios";
import Spinner from "../components/Spinner";
import LikeButton from "../components/LikeButton";
import SubscribeButton from "../components/SubscribeButton";
import AddToPlaylistMenu from "../components/AddToPlaylistMenu";
import Comments from "../components/Comments";
import { useAuth } from "../context/AuthContext";
import { formatViews, timeAgo } from "../lib/format";

export default function Watch() {
  const { videoId } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null); // subscriber count + isSubscribed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setChannel(null);

    api
      .get(`/videos/${videoId}`)
      .then(async ({ data }) => {
        if (cancelled) return;
        setVideo(data.data);

        // getUserChannelProfile requires auth on the backend — only fetch
        // it (for the subscribe button + subscriber count) if logged in
        if (user) {
          try {
            const channelRes = await api.get(`/users/c/${data.data.owner.username}`);
            if (!cancelled) setChannel(channelRes.data.data);
          } catch {
            /* non-fatal — subscribe button just won't render counts */
          }
        }
      })
      .catch(() => {
        if (!cancelled) setError("This video couldn't be loaded.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [videoId, user]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="mx-auto max-w-md py-24 text-center text-ink-muted">
        <p>{error || "Video not found."}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="aspect-video overflow-hidden rounded-xl bg-black">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={video.videoFile}
          poster={video.thumbnail}
          controls
          autoPlay
          className="h-full w-full"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-ink">{video.title}</h1>
        <div className="flex items-center gap-2">
          <LikeButton videoId={video._id} />
          <AddToPlaylistMenu videoId={video._id} />
        </div>
      </div>
      <p className="mt-1 text-sm text-ink-muted">
        {formatViews(video.views)} · {timeAgo(video.createdAt)}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-border py-4">
        <Link to={`/channel/${video.owner?.username}`} className="flex items-center gap-3">
          <img
            src={video.owner?.avatar}
            alt={video.owner?.username}
            className="h-11 w-11 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium text-ink">{video.owner?.fullName}</p>
            <p className="text-xs text-ink-muted">
              {channel ? `${channel.subscribersCount} subscribers` : `@${video.owner?.username}`}
            </p>
          </div>
        </Link>

        {video.owner?._id && (
          <SubscribeButton
            channelId={video.owner._id}
            initialSubscribed={channel?.isSubscribed || false}
          />
        )}
      </div>

      {video.description && (
        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink-muted">
          {video.description}
        </p>
      )}

      <Comments videoId={video._id} />
    </div>
  );
}
