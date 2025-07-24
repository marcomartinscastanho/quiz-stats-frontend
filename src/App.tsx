import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { PlayPage } from "./pages/PlayPage";
import { PlayQuizPage } from "./pages/PlayQuizPage";
import { PredictionPage } from "./pages/Prediction";
import { TeamPage } from "./pages/TeamPage";

export const App = () => {
  const { logout, accessToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-lvh">
      {/* 🧭 Top Nav */}
      <nav className="w-full bg-white shadow sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center py-3 px-4">
          <div className="space-x-4">
            <Link to="/" className="text-blue-600 hover:underline">
              Home
            </Link>
            <Link className="text-blue-600 hover:underline" to="/play">
              Play
            </Link>
            <Link className="text-blue-600 hover:underline" to="/team">
              Team
            </Link>
            <Link className="text-blue-600 hover:underline" to="/prediction">
              Predictor
            </Link>
          </div>
          {accessToken && (
            <button onClick={handleLogout} className="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* 📦 Main Routes */}
      <main className="flex flex-col flex-1 max-w-[1200px] w-full mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<PlayPage />} />
            <Route path="/play/:quizId" element={<PlayQuizPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/prediction" element={<PredictionPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
