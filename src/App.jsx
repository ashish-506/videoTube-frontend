import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import Channel from "./pages/Channel";
import Dashboard from "./pages/Dashboard";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: "#171A21", color: "#EDEDEF", border: "1px solid #262B35" },
        }}
      />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:videoId" element={<Watch />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* getUserChannelProfile requires auth on the backend, so channel
              pages are protected here too rather than silently 401ing */}
          <Route
            path="/channel/:username"
            element={
              <ProtectedRoute>
                <Channel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/playlists"
            element={
              <ProtectedRoute>
                <Playlists />
              </ProtectedRoute>
            }
          />
          <Route
            path="/playlist/:playlistId"
            element={
              <ProtectedRoute>
                <PlaylistDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </AuthProvider>
  );
}
