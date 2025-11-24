import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Recurring from "./pages/Recurring";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Welcome from "./pages/Welcome";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">

     
        <Navbar />

      
        <div className="container my-4 flex-grow-1">
          <Routes>

      
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

       
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              }
            />

            <Route
              path="/budgets"
              element={
                <ProtectedRoute>
                  <Budgets />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recurring"
              element={
                <ProtectedRoute>
                  <Recurring />
                </ProtectedRoute>
              }
            />

       
            <Route path="*" element={<Welcome />} />

          </Routes>
        </div>

     
        <Footer />
      </div>
    </Router>
  );
}

export default App;
