import axios, { type AxiosRequestConfig } from "axios";

const GATEWAY_URL = "http://localhost:8082";

// The gateway strips the "/bottles-api" prefix before forwarding, so the paths in
// bottles-api's own OpenAPI spec (e.g. "/bottles/{bottleId}") line up unchanged
// once appended to this baseURL. withCredentials is required for the browser to
// send the httpOnly jwt/refreshToken cookies at all.
export const axiosInstance = axios.create({
  baseURL: `${GATEWAY_URL}/bottles-api`,
  withCredentials: true,
});

// Auth lives in users-api, not bottles-api, so the refresh call needs its own
// gateway-scoped instance rather than inheriting bottles-api's baseURL.
const authClient = axios.create({
  baseURL: GATEWAY_URL,
  withCredentials: true,
});

// Coalesces concurrent 401s behind a single refresh call instead of firing one
// refresh request per failed request.
let refreshInFlight: Promise<void> | null = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    refreshInFlight ??= authClient
      .post("/users-api/auth/refresh")
      .then(() => undefined)
      .finally(() => {
        refreshInFlight = null;
      });

    await refreshInFlight;
    return axiosInstance(originalRequest);
  },
);

// orval's generated functions call this for every request — the single place
// to route through Axios (and its interceptors) instead of fetch.
export const customInstance = <T,>(config: AxiosRequestConfig): Promise<T> => {
  return axiosInstance(config).then((response) => response.data);
};
