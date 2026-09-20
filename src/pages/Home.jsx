import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../lib/axios";
import VideoCard from "../components/VideoCard";
import Spinner from "../components/Spinner";

export default function Home() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // reset to page 1 whenever the search query changes
  useEffect(() => {
    setPage(1);
    setVideos([]);
    fetchVideos(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const fetchVideos = async (pageToFetch, replace = false) => {
    replace ? setLoading(true) : setLoadingMore(true);
    setError(null);
    try {
      const { data } = await api.get("/videos", {
        params: { page: pageToFetch, limit: 12, query: query || undefined },
      });
      // mongoose-aggregate-paginate-v2 shape: { docs, hasNextPage, ... }
      const result = data.data;
      setVideos((prev) => (replace ? result.docs : [...prev, ...result.docs]));
      setHasNextPage(result.hasNextPage);
    } catch {
      setError("Couldn't load videos. Is the backend running?");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchVideos(nextPage);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md py-24 text-center text-ink-muted">
        <p>{error}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="mx-auto max-w-md py-24 text-center text-ink-muted">
        <p>{query ? `No videos found for "${query}".` : "No videos yet — be the first to upload."}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>

      {hasNextPage && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm text-ink hover:border-gold hover:text-gold disabled:opacity-60"
          >
            {loadingMore && <Spinner size={14} />}
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
