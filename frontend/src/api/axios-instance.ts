import axios, { type AxiosRequestConfig } from 'axios';

const GATEWAY_URL = 'http://localhost:8082';

// Auth lives in users-api, not bottles-api, so the refresh call needs its own
// gateway-scoped instance rather than inheriting bottles-api's baseURL.
const authClient = axios.create({
  baseURL: `${GATEWAY_URL}/users-api`,
  withCredentials: true,
});

// Coalesces concurrent 401s behind a single refresh call instead of firing one
// refresh request per failed request.
let refreshInFlight: Promise<void> | null = null;

function createServiceInstance(service: string) {
  const instance = axios.create({
    baseURL: `${GATEWAY_URL}/${service}`,
    withCredentials: true,
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      refreshInFlight ??= authClient
        .post('/auth/refresh')
        .then(() => undefined)
        .finally(() => {
          refreshInFlight = null;
        });

      await refreshInFlight;
      return instance(originalRequest);
    },
  );

  return instance;
}

export const bottlesApiInstance = createServiceInstance('bottles-api');
export const reviewsApiInstance = createServiceInstance('reviews-api');
export const usersApiInstance = createServiceInstance('users-api');

// orval's generated functions call this for every request — the single place
// to route through Axios (and its interceptors) instead of fetch.
export const customBottlesInstance = <T>(
  config: AxiosRequestConfig,
): Promise<T> => bottlesApiInstance(config).then((r) => r.data);

export const customReviewsInstance = <T>(
  config: AxiosRequestConfig,
): Promise<T> => reviewsApiInstance(config).then((r) => r.data);

export const customUsersInstance = <T>(
  config: AxiosRequestConfig,
): Promise<T> => usersApiInstance(config).then((r) => r.data);
