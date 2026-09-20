import { useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext";

export default function SubscribeButton({ channelId, initialSubscribed, onChange }) {
  const { user } = useAuth();
  const [subscribed, setSubscribed] = useState(initialSubscribed);
  const [loading, setLoading] = useState(false);

  // owner can't subscribe to their own channel — mirrors the backend's
  // own guard in toggleSubscription, checked here too so the button
  // doesn't even appear where it would just 400
  if (user?._id === channelId) return null;

  const handleToggle = async () => {
    if (!user) return toast.error("Log in to subscribe");
    setLoading(true);
    try {
      const { data } = await api.post(`/subscriptions/c/${channelId}`);
      setSubscribed(data.data.subscribed);
      onChange?.(data.data.subscribed);
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
      className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
        subscribed
          ? "border border-border text-ink hover:border-danger hover:text-danger"
          : "bg-gold text-bg hover:bg-gold-dim"
      }`}
    >
      {subscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
}
