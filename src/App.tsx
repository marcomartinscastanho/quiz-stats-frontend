import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { NavLink } from "./components/ui/NavLink";
import { LogoutButton } from "./components/ui/button/LogoutButton";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { PlayPage } from "./pages/PlayPage";
import { PlayQuizPage } from "./pages/PlayQuizPage";
import { TeamPage } from "./pages/TeamPage";
import { PredictorPage } from "./pages/perdictor/Predictor";

export const App = () => {
  const { logout, accessToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-dvh">
      {/* 🧭 Top Nav */}
      <nav className="w-full bg-white shadow sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center h-12">
          <div className="flex h-full">
            <NavLink to="/team" label="Team" />
            <NavLink to="/play" label="Play" />
            <NavLink to="/predictor" label="Predictor" />
          </div>
          {accessToken && <LogoutButton onCLick={handleLogout} />}
        </div>
      </nav>

      {/* 📦 Main Routes */}
      <main className="flex flex-col flex-1 max-w-[1200px] w-full mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/team" replace />} />
            <Route path="/play" element={<PlayPage />} />
            <Route path="/play/:quizId" element={<PlayQuizPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/predictor" element={<PredictorPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
