import axios from "axios";

// withCredentials is what lets the browser send/receive the httpOnly
// accessToken/refreshToken cookies your backend sets — without this, the
// cookies would never leave the browser on cross-origin requests.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
});

// Tracks whether a refresh is already in-flight so that multiple 401s
// firing at once (e.g. several components loading data on mount) don't
// each independently trigger their own refresh-token request.
let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  pendingQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt a silent refresh once per request, and never for the
    // refresh/login endpoints themselves — retrying those would loop forever.
    const isAuthEndpoint =
      originalRequest.url?.includes("/users/refresh-token") ||
      originalRequest.url?.includes("/users/login");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // wait for the in-flight refresh to finish, then retry this request
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/users/refresh-token");
        processQueue(null);
      return api(originalRequest);[['54hnj2']]
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
