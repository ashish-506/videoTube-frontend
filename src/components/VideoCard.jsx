import { Link } from "react-router-dom";
import { formatDuration, formatViews, timeAgo } from "../lib/format";

// NOTE: deliberately not one big wrapping <Link> — the thumbnail/title go
// to the watch page, the avatar/channel name go to the channel page, and
// nesting an <a> inside an <a> is invalid HTML with unpredictable click
// behavior, so these are two separate, sibling Links instead.
export default function VideoCard({ video }) {
  return (
    <div className="group">
      <Link to={`/watch/${video._id}`} className="block">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-surface">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute bottom-1.5 right-1.5 rounded bg-bg/90 px-1.5 py-0.5 text-xs font-medium text-ink">
            {formatDuration(video.duration)}
          </span>
        </div>
      </Link>

      <div className="mt-3 flex gap-3">
        <Link to={`/channel/${video.owner?.username}`} className="shrink-0">
          <img
            src={video.owner?.avatar}
            alt={video.owner?.username}
            className="h-9 w-9 rounded-full object-cover hover:opacity-80"
          />
        </Link>
        <div className="min-w-0">
          <Link to={`/watch/${video._id}`}>
            <h3 className="line-clamp-2 text-sm font-medium leading-snug text-ink hover:text-gold">
              {video.title}
            </h3>
          </Link>
          <Link
            to={`/channel/${video.owner?.username}`}
            className="mt-1 block truncate text-xs text-ink-muted hover:text-ink"
          >
            {video.owner?.fullName}
          </Link>
          <p className="text-xs text-ink-muted">
            {formatViews(video.views)} · {timeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
