import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

// 무한 루프 방지를 위한 커스텀 타입
interface CustomConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 기본 API 인스턴스
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080', // 백엔드 주소 (추후 env 파일에 설정)
  timeout: 5000,
  withCredentials: true, // 쿠키 공유 허용
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 토큰 꺼내기
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
  (res: AxiosResponse) => res, // 성공하면 그대로 통과
  async (err: AxiosError) => {
    const originalRequest = err.config as CustomConfig;

    // 아예 서버랑 연결이 안 된 경우 (네트워크 에러)
    if (!err.response) {
      return Promise.reject(err);
    }

    // 401 에러(토큰 만료)이고, 재요청을 한 번도 안 한 상태일 때
    if (err.response.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true; // 재요청 시도함으로 표시

      try {
        // 리프레시 토큰으로 새 액세스 토큰 발급 요청 (api 인스턴스 대신 생 axios 사용)
        const refreshToken = localStorage.getItem('refreshToken');
        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/auth/refresh`, 
          { refreshToken } // 혹은 쿠키로 보낸다면 빈 객체 {}
        );

        // 새로 받은 토큰 저장
        const newAccessToken = refreshRes.data.accessToken; // 백엔드 응답 형태에 맞춰 수정
        localStorage.setItem('accessToken', newAccessToken);

        // 원래 하려던 요청의 헤더를 새 토큰으로 갈아끼우기
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        
        // 막혔던 원래 요청 다시 쏘기
        return api(originalRequest);

      } catch (refreshError) {
        // 리프레시 토큰까지 죽었거나 에러가 나면 얄짤없이 강제 로그아웃
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // 일단 임시로 로그인 페이지로 튕겨냄 (있다고 가정)
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);