import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute';

// 임시 페이지 컴포넌트들
const Login = () => <div className="p-20 text-center">🔑 로그인 페이지</div>;
const MyPage = () => <div className="p-20 text-center">👤 마이페이지 (로그인 성공!)</div>;

function App() {
  const [isLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* --- 공개 페이지  --- */}
        <Route path="/login" element={<Login />} />

        {/* --- 보호된 페이지 --- */}
        <Route element={<ProtectedRoute isAuthenticated={isLoggedIn} />}>
          <Route path="/mypage" element={<MyPage />} />
        </Route>

        {/* --- 예외 처리 --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;