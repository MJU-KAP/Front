import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

// 무한 루프 방지를 위한 커스텀 타입
interface CustomConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 180000,
  withCredentials: true, 
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (err: AxiosError) => {

    const originalRequest = err.config as CustomConfig & { _retryCount?: number };

    if (err.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/reissue`, 
          {}, 
          { withCredentials: true } 
        );

        const { accessToken: newAccessToken } = refreshRes.data;
        localStorage.setItem('accessToken', newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        
        return api(originalRequest);

      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }

    if (originalRequest && (!err.response || err.response.status >= 500)) {
      originalRequest._retryCount = originalRequest._retryCount || 0;

      if (originalRequest._retryCount < 3) {
        originalRequest._retryCount += 1;

        await new Promise((resolve) => setTimeout(resolve, 2000));
        return api(originalRequest);
      }
    }

    return Promise.reject(err);
  }
);