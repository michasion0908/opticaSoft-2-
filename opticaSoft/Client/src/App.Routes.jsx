import { Routes, Route } from 'react-router-dom';

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

//-------------------- Ventas -------------------- //
import Precios from './pages/Superadmin/Precios.jsx';
import Cotizacion from './pages/Superadmin/Cotizacion.jsx';
import Pedidos from './pages/Superadmin/Pedidos.jsx';
import PedidosTratamientos from './pages/Superadmin/PedidosTratamientos.jsx';
import Venta from './pages/Superadmin/Venta.jsx';

// -------------------- Gestión de Ventas -------------------- //
import GestionVenta from './pages/Superadmin/GestionVenta/GestionVenta.jsx';
import GestionCotizacion from './pages/Superadmin/GestionVenta/Cotizacion.jsx';
import HistorialVenta from './pages/Superadmin/GestionVenta/Venta.jsx';

// -------------------- Gestión de Usuarios -------------------- //
import NotFound from './pages/Superadmin/NotFound.jsx';
import Login from './pages/Login/Login.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/pacientes" element={<Paciente />} />
      <Route path="/pacienteHistorial" element={<PacienteHistorial />} />
      <Route path="/examenVista" element={<ExamenVista />} />
      <Route path="/receta" element={<Receta />} />
      <Route path="/gestionPacientes" element={<GestionPacientes />} />
      <Route path="/prueba" element={<Prueba />} />

      {/* -------------------- Gestión Inventario -------------------- */}  
      <Route path="/inventario" element={<Inventario />} />
      <Route path="/tratamientos" element={<Tratamientos />} />
      <Route path="/material" element={<Material />} />
      <Route path="/tipoLente" element={<TipoLente />} />
      <Route path="/lentesContacto" element={<LentesContacto />} />

      {/* -------------------- Gestión de Ventas -------------------- */}
      <Route path="/precios" element={<Precios />} />
      <Route path="/cotizacion" element={<Cotizacion />} />
      <Route path="/pedidos" element={<Pedidos />} />
      <Route path="/ventas" element={<Venta />} />
      <Route path="/pedidosTratamientos" element={<PedidosTratamientos />} />
      <Route path="/gestionVenta" element={<GestionVenta />} />

      {/* -------------------- Gestión de Cotizaciones -------------------- */}
      <Route path="/gestionCotizacion" element={<GestionCotizacion />} />
      <Route path="/historialVenta" element={<HistorialVenta />} />

      {/* -------------------- Gestión de Citas -------------------- */}
      <Route path="/citas" element={<Citas />} />

      {/* -------------------- Gestión de Paquetes -------------------- */}
      <Route path="/paquetes" element={<Paquete />} />
      <Route path="/paqueteDetalle" element={<PaqueteDetalle />} /> 

      {/* -------------------- Gestión de Usuarios -------------------- */}

      {/* -------------------- Gestión de Optometristas -------------------- */}
      <Route path="/optometristas" element={<Optometrista />} />

      <Route path="/citas" element={<Citas />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

