import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, Upload, ListVideo, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/?query=${encodeURIComponent(query.trim())}` : "/");
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
        <Link to="/" className="shrink-0 font-display text-3xl tracking-wide text-gold">
          VIDEOTUBE
        </Link>

        <form onSubmit={handleSearch} className="hidden flex-1 max-w-xl md:block">
          <div className="flex items-center rounded-full border border-border bg-bg px-4 py-2 focus-within:border-gold">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search videos"
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
            />
            <button type="submit" aria-label="Search" className="text-ink-muted hover:text-gold">
              <Search size={18} />
            </button>
          </div>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          {user ? (
            <>
              <Link
                to="/upload"
                className="flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-bg hover:bg-gold-dim"
              >
                <Upload size={16} />
                Upload
              </Link>

              <div className="relative" ref={menuRef}>
                <button onClick={() => setMenuOpen((o) => !o)} className="block">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-transparent hover:ring-gold"
                  />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full z-30 mt-2 w-52 rounded-lg border border-border bg-surface py-1 shadow-lg">
                    <p className="truncate px-4 py-2 text-sm text-ink-muted">
                      @{user.username}
                    </p>
                    <Link
                      to={`/channel/${user.username}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-ink hover:bg-surface2"
                    >
                      Your channel
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-ink hover:bg-surface2"
                    >
                      <LayoutDashboard size={15} />
                      Dashboard
                    </Link>
                    <Link
                      to="/playlists"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-ink hover:bg-surface2"
                    >
                      <ListVideo size={15} />
                      Playlists
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 border-t border-border px-4 py-2 text-left text-sm text-danger hover:bg-surface2"
                    >
                      <LogOut size={15} />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm text-ink-muted hover:text-ink"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-bg hover:bg-gold-dim"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
