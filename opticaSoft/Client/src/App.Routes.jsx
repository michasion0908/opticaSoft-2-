import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Superadmin/home.jsx';

// -------------------- Gestión Pacientes -------------------- //
import Paciente from './pages/Superadmin/Paciente';
import Optometrista from './pages/Superadmin/Optometrista.jsx';

// -------------------- Gestión Inventario -------------------- //
import Inventario from './pages/Superadmin/Inventario';
import Tratamientos from './pages/Superadmin/Tratamientos.jsx';
import Material from './pages/Superadmin/Material.jsx';
import TipoLente from './pages/Superadmin/TipoLente.jsx';
import LentesContacto from './pages/Superadmin/LentesContacto.jsx';

// -------------------- Gestión de HistorialClínico -------------------- //
import PacienteHistorial from './pages/Superadmin/PacienteHistorial.jsx';
import ExamenVista from './pages/Superadmin/ExamenVista.jsx';
import Receta from './pages/Superadmin/Receta.jsx';
import GestionPacientes from './pages/Superadmin/GestionPaciente.jsx';
import Prueba from './pages/Superadmin/Prueba.jsx';

// -------------------- Gestión de Paquetes -------------------- //
import Paquete from './pages/Superadmin/Paquetes.jsx';
import PaqueteDetalle from './pages/Superadmin/PaqueteDetalle.jsx';

// -------------------- Gestión de Citas -------------------- //
import Citas from './pages/Superadmin/Cita.jsx';

// -------------------- Ventas -------------------- //
import Precios from './pages/Superadmin/Precios.jsx';
import Cotizacion from './pages/Superadmin/Cotizacion.jsx';
import Pedidos from './pages/Superadmin/Pedidos.jsx';
import PedidosTratamientos from './pages/Superadmin/PedidosTratamientos.jsx';
import Venta from './pages/Superadmin/Venta.jsx';

// -------------------- Gastos -------------------- //
import Gasto from './pages/Superadmin/Gasto/Gasto.jsx';


// -------------------- Gestión de Ventas -------------------- //
import GestionVenta from './pages/Superadmin/GestionVenta/GestionVenta.jsx';
import GestionCotizacion from './pages/Superadmin/GestionVenta/Cotizacion.jsx';
import HistorialVenta from './pages/Superadmin/GestionVenta/Venta.jsx';

// -------------------- Login y NotFound -------------------- //
import NotFound from './pages/Superadmin/NotFound.jsx';
import Login from './pages/Login/Login.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/" element={<Login />} />

      {/* Rutas protegidas */}
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/pacientes" element={<ProtectedRoute><Paciente /></ProtectedRoute>} />
      <Route path="/pacienteHistorial" element={<ProtectedRoute><PacienteHistorial /></ProtectedRoute>} />
      <Route path="/examenVista" element={<ProtectedRoute><ExamenVista /></ProtectedRoute>} />
      <Route path="/receta" element={<ProtectedRoute><Receta /></ProtectedRoute>} />
      <Route path="/gestionPacientes" element={<ProtectedRoute><GestionPacientes /></ProtectedRoute>} />
      <Route path="/prueba" element={<ProtectedRoute><Prueba /></ProtectedRoute>} />

      {/* Inventario */}
      <Route path="/inventario" element={<ProtectedRoute><Inventario /></ProtectedRoute>} />
      <Route path="/tratamientos" element={<ProtectedRoute><Tratamientos /></ProtectedRoute>} />
      <Route path="/material" element={<ProtectedRoute><Material /></ProtectedRoute>} />
      <Route path="/tipoLente" element={<ProtectedRoute><TipoLente /></ProtectedRoute>} />
      <Route path="/lentesContacto" element={<ProtectedRoute><LentesContacto /></ProtectedRoute>} />

      {/* Ventas */}
      <Route path="/precios" element={<ProtectedRoute><Precios /></ProtectedRoute>} />
      <Route path="/cotizacion" element={<ProtectedRoute><Cotizacion /></ProtectedRoute>} />
      <Route path="/pedidos" element={<ProtectedRoute><Pedidos /></ProtectedRoute>} />
      <Route path="/ventas" element={<ProtectedRoute><Venta /></ProtectedRoute>} />
      <Route path="/pedidosTratamientos" element={<ProtectedRoute><PedidosTratamientos /></ProtectedRoute>} />
      <Route path="/gestionVenta" element={<ProtectedRoute><GestionVenta /></ProtectedRoute>} />
      <Route path="/gestionCotizacion" element={<ProtectedRoute><GestionCotizacion /></ProtectedRoute>} />
      <Route path="/historialVenta" element={<ProtectedRoute><HistorialVenta /></ProtectedRoute>} />

      {/* Gastos */}
      <Route path="/gastos" element={<ProtectedRoute><Gasto /></ProtectedRoute>} />

      {/* Citas */}
      <Route path="/citas" element={<ProtectedRoute><Citas /></ProtectedRoute>} />

      {/* Paquetes */}
      <Route path="/paquetes" element={<ProtectedRoute><Paquete /></ProtectedRoute>} />
      <Route path="/paqueteDetalle" element={<ProtectedRoute><PaqueteDetalle /></ProtectedRoute>} />

      {/* Optometristas */}
      <Route path="/optometristas" element={<ProtectedRoute><Optometrista /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}