import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import ChatPage from "./components/ChatPage";
import ProtectedRoute from "./components/ProtectedRoute";

function Main() {
  return (
    <Router>
      <Routes>
        {/* Public login page */}
        <Route path="/" element={<LoginForm />} />

        {/* Protected chat page */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default Main;
