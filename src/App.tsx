import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import MainPage from './pages/main';
import { useAuthStore } from './store/authStore';
import KakaoCallback from './pages/kakao/KakaoCallback';
import ResultPage from './pages/result/index';

// 임시 페이지 컴포넌트들
const Login = () => <div className="p-20 text-center">🔑 로그인 페이지</div>;
const MyPage = () => <div className="p-20 text-center">👤 마이페이지 (로그인 성공!)</div>;

function App() {
  // Zustand 스토어에서 로그인 상태와 상태 검사 함수 꺼내오기
  const { isLoggedIn, checkAuth } = useAuthStore();

  // 앱이 처음 렌더링될 때(새로고침 등) 로컬 스토리지 확인해서 로그인 상태 유지
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* --- 공개 페이지  --- */}
        <Route path="/" element={<MainPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
        
        {/* 카카오 로그인 완료 후 돌아올 콜백 라우트 추가 */}
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />

        {/* --- 보호된 페이지 --- */}
        <Route element={<ProtectedRoute isAuthenticated={isLoggedIn} />}>
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/result/:id" element={<ResultPage />} />
          <Route path="/result" element={<Navigate to="/" replace />} />
        </Route>

        {/* --- 예외 처리 --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;