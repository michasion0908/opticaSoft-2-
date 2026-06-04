import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, FaUserInjured, FaEye, FaGlasses,
  FaShoppingCart, FaMoneyBillWave, FaCheckCircle,
  FaExclamationTriangle, FaClipboardList, FaFileInvoiceDollar,
  FaClock
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/home.css';

import { getVentasjs } from '../../assets/js/Venta.js';
import { getCitasJs } from '../../assets/js/Cita.js';
import { getPaciente } from '../../api/Paciente.api.js';
import { getInventario } from '../../api/Inventario.api.js';
import { getMaterial } from '../../api/Material.api.js';
import { getLentesContacto } from '../../api/LentesContacto.api.js';
import { getGastosjs } from '../../assets/js/Gasto.js';

const toValidDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
};

const isSameDay = (value, reference = new Date()) => {
  const date = toValidDate(value);
  return Boolean(date) &&
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate();
};

const isSameMonth = (value, reference = new Date()) => {
  const date = toValidDate(value);
  return Boolean(date) &&
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth();
};

const getVentaFecha = (venta) => venta.fechaRegistro || venta.createdAt || venta.fecha;
const getMoneyValue = (value) => Number(value) || 0;
const getVentaIngreso = (venta) => {
  const abono = getMoneyValue(venta.abono);
  return abono > 0 ? abono : getMoneyValue(venta.total);
};

const getPacienteNombreKey = (paciente) => {
  return `${paciente.nombre || ''} ${paciente.apellido || ''}`
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
};

const Home = () => {
  // ====================================================
  // ESTADOS Y EFECTOS
  // ====================================================
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [ventas, setVentas] = useState([]);
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [lentesContacto, setLentesContacto] = useState([]);
  const [loadingVentas, setLoadingVentas] = useState(true);
  const [loadingCitas, setLoadingCitas] = useState(true);
  const [loadingInventario, setLoadingInventario] = useState(true);

  // Obtener datos al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener ventas
        await getVentasjs(setVentas);
        setLoadingVentas(false);
        
        // Obtener citas
        await getCitasJs(setCitas);
        setLoadingCitas(false);
        await getGastosjs(setGastos);
        
        // Obtener inventario y catálogos relacionados
        const [inventarioResult, materialesResult, lentesContactoResult, pacientesResult] = await Promise.allSettled([
          getInventario(),
          getMaterial(),
          getLentesContacto(),
          getPaciente()
        ]);

        setInventario(inventarioResult.status === 'fulfilled' ? inventarioResult.value : []);
        setMateriales(materialesResult.status === 'fulfilled' ? materialesResult.value : []);
        setLentesContacto(lentesContactoResult.status === 'fulfilled' ? lentesContactoResult.value : []);
        setPacientes(pacientesResult.status === 'fulfilled' ? pacientesResult.value : []);
        setLoadingInventario(false);
        
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setLoadingVentas(false);
        setLoadingCitas(false);
        setLoadingInventario(false);
      }
    };
    
    fetchData();
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ====================================================
  // DATOS REALES PROCESADOS
  // ====================================================

  // Procesar y filtrar citas pendientes para hoy
  const hoy = new Date();
  const citasHoy = citas.filter(c => 
    isSameDay(c.fechaHora, hoy) && 
    c.estado === 'PENDIENTE'
  ).sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));

  // Procesar citas para mostrar
  const procesarCita = (cita) => ({
    id: cita.idCita,
    patient: cita.nombrePaciente || 'Paciente no especificado',
    time: new Date(cita.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: cita.motivo || 'Consulta',
    status: cita.estado.toLowerCase(),
    doctor: cita.Optometrista?.nombre || 'Optometrista no asignado',
    raw: cita
  });

  // Filtrar ventas del día
  const ventasHoy = ventas.filter(v => 
    isSameDay(getVentaFecha(v), hoy)
  );

  // Calcular métricas mensuales
  const pacientesNuevosMes = new Set(
    pacientes
      .filter(p => isSameMonth(p.fechaRegistro, hoy))
      .map(getPacienteNombreKey)
      .filter(Boolean)
  ).size;
  const ventasMes = ventas.filter(v => isSameMonth(getVentaFecha(v), hoy));
  const gastosMes = gastos.filter(g => isSameMonth(g.fecha, hoy));
  const ingresosMes = ventasMes.reduce((sum, v) => sum + getVentaIngreso(v), 0);
  const egresosMes = gastosMes.reduce((sum, g) => sum + getMoneyValue(g.monto), 0);
  const utilidadMes = ingresosMes - egresosMes;

  // Procesar ventas para mostrar
  const procesarVenta = (venta) => ({
    id: venta.idVenta,
    client: venta.nombrePaciente || 'Cliente no especificado',
    amount: `$${getVentaIngreso(venta).toFixed(2)}`,
    products: venta.Cotizacion?.detalles?.map(d => d.Producto?.nombre).join(', ') || 'Productos no especificados',
    status: venta.estado === 'LIQUIDADO' ? 'liquidado' : 'pendiente',
    date: toValidDate(getVentaFecha(venta))?.toLocaleDateString() || 'Sin fecha',
    raw: venta
  });

  // Ventas recientes (últimas 3)
  const recentSales = [...ventas]
    .sort((a, b) => new Date(getVentaFecha(b)) - new Date(getVentaFecha(a)))
    .slice(0, 3)
    .map(procesarVenta);

  // Ventas pendientes
  const pendingPayments = ventas
    .filter(v => v.estado === 'PENDIENTE')
    .slice(0, 3)
    .map(procesarVenta);

  // ====================================================
  // ESTADÍSTICAS
  // ====================================================
  const stats = [
    { 
      title: "Citas Hoy", 
      value: citasHoy.length, 
      icon: <FaCalendarAlt />, 
      trend: citasHoy.length > 0 ? 'up' : 'steady', 
      link: 'citas', 
      color: 'var(--purple)' 
    },
    { 
      title: "Pacientes Nuevos", 
      value: pacientesNuevosMes, 
      icon: <FaUserInjured />, 
      trend: 'steady', 
      link: 'pacientes', 
      color: 'var(--teal)' 
    },
    { 
      title: "Exámenes", 
      value: citas.filter(c => c.motivo?.toLowerCase().includes('examen') && isSameMonth(c.fechaHora, hoy)).length, 
      icon: <FaEye />, 
      trend: 'up', 
      link: 'examenes', 
      color: 'var(--indigo)' 
    },
    { 
      title: "Ventas Hoy", 
      value: ventasHoy.length, 
      icon: <FaShoppingCart />, 
      trend: ventasHoy.length > 0 ? 'up' : 'steady', 
      link: 'ventas', 
      color: 'var(--orange)' 
    },
    { 
      title: "Ingresos", 
      value: `$${utilidadMes.toFixed(2)}`, 
      icon: <FaMoneyBillWave />, 
      trend: utilidadMes < 0 ? 'down' : utilidadMes > 0 ? 'up' : 'steady', 
      link: 'ventas', 
      color: utilidadMes < 0 ? 'var(--danger)' : 'var(--success)',
      valueColor: utilidadMes < 0 ? 'var(--danger)' : 'var(--dark)'
    }
  ];

  // ====================================================
  // DATOS DE INVENTARIO
  // ====================================================
  const stockBajoLimite = 2;
  const totalArmazones = inventario.reduce((total, item) => total + (Number(item.cantidad) || 0), 0);
  const armazonesBajoStock = inventario.filter(item => (Number(item.cantidad) || 0) <= stockBajoLimite).length;

  const inventoryStatus = [
    {
      category: 'Armazones',
      total: totalArmazones,
      lowStock: armazonesBajoStock,
      color: 'var(--purple)',
      path: '/inventario',
      progress: totalArmazones > 0 ? Math.max(0, 100 - (armazonesBajoStock / inventario.length * 100)) : 0
    },
    {
      category: 'Materiales Lentes',
      total: materiales.length,
      lowStock: 0,
      color: 'var(--blue)',
      path: '/material',
      progress: materiales.length > 0 ? 100 : 0
    },
    {
      category: 'Lentes de Contacto',
      total: lentesContacto.length,
      lowStock: 0,
      color: 'var(--teal)',
      path: '/lentesContacto',
      progress: lentesContacto.length > 0 ? 100 : 0
    }
  ];

  const quickAccessItems = [
    { id: 'pacientes', name: 'Pacientes', icon: <FaUserInjured />, path: '/pacientes', submenu: false },
    { id: 'citas', name: 'Citas', icon: <FaCalendarAlt />, path: '/citas', submenu: false },
    { id: 'ventas', name: 'Ventas', icon: <FaShoppingCart />, path: '/ventas', submenu: false },
    { id: 'examenVista', name: 'Exámenes', icon: <FaEye />, path: '/examenVista', submenu: false },
    { id: 'receta', name: 'Recetas', icon: <FaClipboardList />, path: '/receta', submenu: false },
    { id: 'cotizacion', name: 'Cotización', icon: <FaFileInvoiceDollar />, path: '/Cotizacion', submenu: false }, 
    { id: 'inventario', name: 'Armazones', icon: <FaGlasses />, path: '/inventario' },
    { id: 'precios', name: 'Lista de Precios', icon: <FaFileInvoiceDollar />, path: '/precios' }
  ];

  // ====================================================
  // RENDERIZADO
  // ====================================================
  return (
    <div className="custom-dashboard">
      {/* Título de la página */}
      <h2 className="custom-page-title">Dashboard</h2>
      
      {/* Estadísticas Principales */}
      <div className="custom-stats-grid">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="custom-stat-card"
            style={{ borderLeft: `4px solid ${stat.color}` }}
          >
            <div className="custom-stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="custom-stat-info">
              <h3 style={{ color: stat.valueColor || 'var(--dark)' }}>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
            <div className={`custom-stat-trend ${stat.trend}`}>
              {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'}
            </div>
          </div>
        ))}
      </div>

      {/* Primera Fila: Citas y Ventas Pendientes */}
      <div className="custom-dashboard-row">
        {/* Tarjeta de próximas citas */}
        <div className="custom-dashboard-card">
          <div className="custom-card-header">
            <h4>Próximas Citas</h4>
            <NavLink to="/citas" className="btn custom-btn-sm btn-primary text-white">
              Ver todas
            </NavLink>
          </div>
          <div className="custom-card-body">
            {loadingCitas ? (
              <div className="text-center py-3">Cargando citas...</div>
            ) : citasHoy.length > 0 ? (
              citasHoy.slice(0, 3).map(cita => {
                const processed = procesarCita(cita);
                return (
                  <div key={cita.idCita} className={`custom-appointment-item ${processed.status}`}>
                    <div className="custom-appointment-time">
                      <FaClock className="me-2" />
                      {processed.time}
                    </div>
                    <div className="custom-appointment-details">
                      <h5>{processed.patient}</h5>
                      <p>{processed.type} • {processed.doctor}</p>
                    </div>
                    <div className="custom-appointment-status">
                      <span className={`custom-status-badge ${processed.status}`}>
                        {processed.status === 'confirmada' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                        {windowWidth > 576 ? processed.status : ''}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-3">No hay citas pendientes para hoy</div>
            )}
          </div>
        </div>

        {/* Tarjeta de ventas pendientes */}
        <div className="custom-dashboard-card">
          <div className="custom-card-header">
            <h4>Ventas Pendientes</h4>
            <NavLink to="/ventas" className="btn custom-btn-sm btn-primary text-white">
              Ver todas
            </NavLink>
          </div>
          <div className="custom-card-body">
            {loadingVentas ? (
              <div className="text-center py-3">Cargando ventas...</div>
            ) : pendingPayments.length > 0 ? (
              pendingPayments.map(sale => (
                <div key={sale.id} className="custom-sale-item pending">
                  <div className="custom-sale-client">
                    <h5>{sale.client}</h5>
                    {windowWidth > 576 && <p>{sale.products}</p>}
                  </div>
                  <div className="custom-sale-info">
                    <span className="custom-sale-amount">{sale.amount}</span>
                    {windowWidth > 576 && <span className="custom-sale-date">{sale.date}</span>}
                  </div>
                  <div className="custom-sale-status pending">
                    {windowWidth > 576 ? 'Pendiente' : 'P'}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-3">No hay ventas pendientes</div>
            )}
          </div>
        </div>
      </div>

      {/* Segunda Fila: Inventario y Ventas Recientes */}
      <div className="custom-dashboard-row">
        {/* Tarjeta de estado del inventario */}
        <div className="custom-dashboard-card">
          <div className="custom-card-header">
            <h4>Estado del Inventario</h4>
          </div>
          <div className="custom-card-body">
            {loadingInventario ? (
              <div className="text-center py-3">Cargando inventario...</div>
            ) : (
              inventoryStatus.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className="custom-inventory-item"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="custom-inventory-header">
                    <h5>{item.category}</h5>
                    {item.lowStock > 0 && <span className="custom-low-stock-alert">!</span>}
                  </div>
                  <div className="custom-inventory-stats">
                    <span className="custom-total">Total: {item.total}</span>
                    {item.lowStock > 0 && <span className="custom-low-stock">Bajo stock: {item.lowStock}</span>}
                  </div>
                  <div className="custom-progress-bar">
                    <div 
                      className="custom-progress-fill" 
                      style={{ 
                        width: `${item.progress}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                </NavLink>
              ))
            )}
          </div>
        </div>

        {/* Tarjeta de ventas recientes */}
        <div className="custom-dashboard-card">
          <div className="custom-card-header">
            <h4>Ventas Recientes</h4>
            <NavLink to="/ventas" className="btn custom-btn-sm btn-primary text-white">
              Ver todas
            </NavLink>
          </div>
          <div className="custom-card-body">
            {loadingVentas ? (
              <div className="text-center py-3">Cargando ventas...</div>
            ) : recentSales.length > 0 ? (
              recentSales.map(sale => (
                <div key={sale.id} className={`custom-sale-item ${sale.status}`}>
                  <div className="custom-sale-client">
                    <h5>{sale.client}</h5>
                    {windowWidth > 576 && <p>{sale.products}</p>}
                  </div>
                  <div className="custom-sale-info">
                    <span className="custom-sale-amount">{sale.amount}</span>
                    {windowWidth > 576 && <span className="custom-sale-date">{sale.date}</span>}
                  </div>
                  <div className={`custom-sale-status ${sale.status}`}>
                    {windowWidth > 576 ? (sale.status === 'liquidado' ? 'Pagado' : 'Pendiente') : 
                    (sale.status === 'liquidado' ? 'P' : 'P')}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-3">No hay ventas recientes</div>
            )}
          </div>
        </div>
      </div>

      {/* Acceso Rápido */}
      <div className="custom-dashboard-card">
        <div className="custom-card-header">
          <h4>Acceso Rápido</h4>
        </div>
        <div className="custom-card-body">
          <div className="custom-quick-access-grid">
            {quickAccessItems.map(item => (
              <NavLink 
                key={item.id}
                to={item.path}
                className="custom-quick-access-item"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="custom-quick-access-icon">
                  {item.icon}
                </div>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
