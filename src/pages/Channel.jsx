import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/axios";
import Spinner from "../components/Spinner";
import SubscribeButton from "../components/SubscribeButton";
import VideoCard from "../components/VideoCard";

export default function Channel() {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .get(`/users/c/${username}`)
      .then(async ({ data }) => {
        if (cancelled) return;
        setChannel(data.data);
        // getAllVideos supports filtering by owner id — reused here instead
        // of a dedicated "channel videos" endpoint
        const videosRes = await api.get("/videos", {
          params: { userId: data.data._id, limit: 24 },
        });
        if (!cancelled) setVideos(videosRes.data.data.docs);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load this channel.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="mx-auto max-w-md py-24 text-center text-ink-muted">
        <p>{error || "Channel not found."}</p>
      </div>
    );
  }

  return (
    <div>
      {channel.coverImage && (
        <div className="h-40 w-full overflow-hidden sm:h-56">
          <img src={channel.coverImage} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap items-center gap-4 border-b border-border py-6">
          <img
            src={channel.avatar}
            alt={channel.username}
            className="h-20 w-20 rounded-full object-cover"
          />
          <div className="flex-1">
            <h1 className="font-display text-3xl tracking-wide text-ink">
              {channel.fullName}
            </h1>
            <p className="text-sm text-ink-muted">
              @{channel.username} · {channel.subscribersCount} subscribers ·{" "}
              {channel.channelsSubscribedToCount} subscribed
            </p>
          </div>
          <SubscribeButton channelId={channel._id} initialSubscribed={channel.isSubscribed} />
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-8 py-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.length === 0 ? (
            <p className="col-span-full py-12 text-center text-sm text-ink-muted">
              No published videos yet.
            </p>
          ) : (
            videos.map((video) => <VideoCard key={video._id} video={video} />)
          )}
        </div>
      </div>
    </div>
  );
}
