import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import MainPage from './pages/main';
import ProfileSetupPage from './pages/profile-setup';
import { useAuthStore } from './store/authStore';
import KakaoCallback from './pages/kakao/KakaoCallback';
import ResultPage from './pages/result/index';
import BoardPage from './pages/board/BoardPage';
import BoardDetailPage from './pages/board/BoardDetailPage';
import MyPage from './pages/mypage';


// 임시 페이지 컴포넌트들
const Login = () => <div className="p-20 text-center">🔑 로그인 페이지</div>;
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
        {/* 전역 헤더 없음 */}
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />

        <Route element={<ProtectedRoute isAuthenticated={isLoggedIn} />}>
          <Route path="/profile-setup" element={<ProfileSetupPage />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/board/:category" element={<BoardPage />} />
          <Route path="/board/:category/:id" element={<BoardDetailPage />} />

          <Route element={<ProtectedRoute isAuthenticated={isLoggedIn} />}>
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/result/:id" element={<ResultPage />} />
            <Route path="/result" element={<Navigate to="/" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;