// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Trabajadores from "./pages/Trabajadores";
import Cursos from "./pages/Cursos";
import Solicitudes from "./pages/Solicitudes";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
//import Landing from "./pages/Landing";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas privadas */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/trabajadores"
        element={
          <PrivateRoute>
            <Layout>
              <Trabajadores />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/cursos"
        element={
          <PrivateRoute>
            <Layout>
              <Cursos />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/solicitudes"
        element={
          <PrivateRoute>
            <Layout>
              <Solicitudes />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
