import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import { timeAgo } from "../lib/format";
import Spinner from "./Spinner";

export default function Comments({ videoId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchComments = async (pageToFetch, replace = false) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/comments/${videoId}`, {
        params: { page: pageToFetch, limit: 10 },
      });
      const result = data.data;
      setComments((prev) => (replace ? result.docs : [...prev, ...result.docs]));
      setHasNextPage(result.hasNextPage);
    } catch {
      toast.error("Couldn't load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchComments(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Log in to comment");
    if (!newComment.trim()) return;

    setPosting(true);
    try {
      const { data } = await api.post(`/comments/${videoId}`, { content: newComment });
      // prepend so the new comment shows immediately without a refetch
      setComments((prev) => [data.data, ...prev]);
      setNewComment("");
    } catch {
      toast.error("Couldn't post comment");
    } finally {
      setPosting(false);
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.content);
  };

  const handleUpdate = async (commentId) => {
    if (!editText.trim()) return;
    try {
      const { data } = await api.patch(`/comments/c/${commentId}`, { content: editText });
      setComments((prev) => prev.map((c) => (c._id === commentId ? data.data : c)));
      setEditingId(null);
    } catch {
      toast.error("Couldn't update comment");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/c/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {
      toast.error("Couldn't delete comment");
    }
  };

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchComments(next);
  };

  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold text-ink">Comments</h2>

      <form onSubmit={handleAdd} className="mt-4 flex gap-3">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? "Add a comment" : "Log in to comment"}
          disabled={!user}
          className="flex-1 border-b border-border bg-transparent px-1 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-gold focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={posting || !user}
          className="shrink-0 rounded-full bg-gold px-4 py-1.5 text-sm font-semibold text-bg hover:bg-gold-dim disabled:opacity-50"
        >
          Comment
        </button>
      </form>

      <ul className="mt-6 space-y-5">
        {comments.map((comment) => (
          <li key={comment._id} className="flex gap-3">
            <img
              src={comment.owner?.avatar}
              alt={comment.owner?.username}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-ink-muted">
                <span className="font-medium text-ink">{comment.owner?.username}</span>{" "}
                · {timeAgo(comment.createdAt)}
              </p>

              {editingId === comment._id ? (
                <div className="mt-1 flex gap-2">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 rounded border border-border bg-surface px-2 py-1 text-sm text-ink focus:border-gold focus:outline-none"
                  />
                  <button
                    onClick={() => handleUpdate(comment._id)}
                    className="text-xs font-medium text-gold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-xs text-ink-muted"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="mt-0.5 whitespace-pre-wrap text-sm text-ink">
                  {comment.content}
                </p>
              )}
            </div>

            {user?._id === comment.owner?._id && editingId !== comment._id && (
              <div className="flex shrink-0 items-start gap-2 text-ink-muted">
                <button onClick={() => startEdit(comment)} aria-label="Edit comment">
                  <Pencil size={14} className="hover:text-ink" />
                </button>
                <button onClick={() => handleDelete(comment._id)} aria-label="Delete comment">
                  <Trash2 size={14} className="hover:text-danger" />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {loading && (
        <div className="mt-4 flex justify-center">
          <Spinner size={20} />
        </div>
      )}

      {!loading && hasNextPage && (
        <button
          onClick={handleLoadMore}
          className="mt-4 text-sm text-ink-muted hover:text-gold"
        >
          Show more comments
        </button>
      )}
    </div>
  );
}
