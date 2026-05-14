import { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, FaUserInjured, FaEye, 
  FaShoppingCart, FaMoneyBillWave, FaCheckCircle,
  FaExclamationTriangle, FaClipboardList, FaFileInvoiceDollar,
  FaBoxes, FaLayerGroup, FaUserMd
} from 'react-icons/fa';
import './css/home.css';

/**
 * COMPONENTE PRINCIPAL DEL DASHBOARD
 * 
 * Este componente representa la página principal del dashboard de la aplicación.
 * Muestra estadísticas, citas, ventas, inventario y acceso rápido a funciones.
 */
const Home = () => {
  // ====================================================
  // ESTADO Y EFECTOS
  // ====================================================
  
  /**
   * Estado para el ancho de la ventana
   * @type {[number, Function]} windowWidth - Ancho actual de la ventana
   */
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  /**
   * Efecto para manejar el redimensionamiento de la ventana
   */
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ====================================================
  // DATOS DE EJEMPLO
  // ====================================================

  /**
   * Estadísticas principales del dashboard
   * @type {Array<Object>}
   */
  const stats = [
    { title: "Citas Hoy", value: 8, icon: <FaCalendarAlt />, trend: 'up', link: 'citas', color: 'var(--purple)' },
    { title: "Pacientes Nuevos", value: 3, icon: <FaUserInjured />, trend: 'steady', link: 'pacientes', color: 'var(--teal)' },
    { title: "Exámenes", value: 15, icon: <FaEye />, trend: 'up', link: 'examenes', color: 'var(--indigo)' },
    { title: "Ventas Hoy", value: 5, icon: <FaShoppingCart />, trend: 'down', link: 'ventas', color: 'var(--orange)' },
    { title: "Ingresos", value: '$3,850', icon: <FaMoneyBillWave />, trend: 'up', link: 'ventas', color: 'var(--green)' }
  ];

  /**
   * Próximas citas programadas
   * @type {Array<Object>}
   */
  const upcomingAppointments = [
    { id: 1, patient: 'María González', time: '09:00 AM', type: 'Examen de vista', status: 'confirmada', doctor: 'Dr. Pérez' },
    { id: 2, patient: 'Carlos Mendoza', time: '10:30 AM', type: 'Entrega lentes', status: 'pendiente', doctor: 'Dra. López' },
    { id: 3, patient: 'Ana Torres', time: '11:15 AM', type: 'Consulta', status: 'confirmada', doctor: 'Dr. Pérez' }
  ];

  /**
   * Ventas recientes realizadas
   * @type {Array<Object>}
   */
  const recentSales = [
    { id: 1001, client: 'Juan Pérez', amount: '$1,250', products: 'Armazón + Lentes bifocales', status: 'liquidado', date: '15/05/2023' },
    { id: 1002, client: 'Laura Sánchez', amount: '$850', products: 'Lentes de contacto', status: 'pendiente', date: '16/05/2023' },
    { id: 1003, client: 'Roberto Jiménez', amount: '$2,150', products: 'Armazón premium + Tratamiento', status: 'liquidado', date: '16/05/2023' }
  ];

  // Filtrar ventas pendientes de pago
  const pendingPayments = recentSales.filter(sale => sale.status === 'pendiente');

  /**
   * Estado actual del inventario
   * @type {Array<Object>}
   */
  const inventoryStatus = [
    { category: 'Armazones', total: 45, lowStock: 2, color: 'var(--purple)' },
    { category: 'Lentes', total: 120, lowStock: 5, color: 'var(--blue)' },
    { category: 'Contacto', total: 35, lowStock: 1, color: 'var(--teal)' },
    { category: 'Soluciones', total: 28, lowStock: 0, color: 'var(--green)' }
  ];

  /**
   * Items de acceso rápido
   * @type {Array<Object>}
   */
  const quickAccessItems = [
    { id: 'pacientes', name: 'Pacientes', icon: <FaUserInjured /> },
    { id: 'citas', name: 'Citas', icon: <FaCalendarAlt /> },
    { id: 'ventas', name: 'Ventas', icon: <FaShoppingCart /> },
    { id: 'examenes', name: 'Exámenes', icon: <FaEye /> },
    { id: 'recetas', name: 'Recetas', icon: <FaClipboardList /> },
    { id: 'cotizacion', name: 'Cotización', icon: <FaFileInvoiceDollar /> }
  ];

  // ====================================================
  // RENDERIZADO DEL COMPONENTE
  // ====================================================
  
  return (
    <div className="dashboard">
      {/* Título de la página */}
      <h2 className="page-title">Dashboard</h2>
      
      {/* ====================================================
          SECCIÓN: ESTADÍSTICAS PRINCIPALES
          Muestra tarjetas con métricas clave del negocio
          ==================================================== */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="stat-card"
            style={{ borderLeft: `4px solid ${stat.color}` }}
          >
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
            <div className={`stat-trend ${stat.trend}`}>
              {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'}
            </div>
          </div>
        ))}
      </div>

      {/* ====================================================
          PRIMERA FILA: CITAS Y VENTAS PENDIENTES
          Muestra las próximas citas y ventas pendientes de pago
          ==================================================== */}
      <div className="dashboard-row">
        {/* Tarjeta de próximas citas */}
        <div className="dashboard-card">
          <div className="card-header">
            <h4>Próximas Citas</h4>
            <button className="btn-sm">Ver todas</button>
          </div>
          <div className="card-body">
            {upcomingAppointments.map(appt => (
              <div key={appt.id} className={`appointment-item ${appt.status}`}>
                <div className="appointment-time">{appt.time}</div>
                <div className="appointment-details">
                  <h5>{appt.patient}</h5>
                  <p>{appt.type} • {appt.doctor}</p>
                </div>
                <div className="appointment-status">
                  <span className={`status-badge ${appt.status}`}>
                    {appt.status === 'confirmada' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    {windowWidth > 576 ? appt.status : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tarjeta de ventas pendientes */}
        <div className="dashboard-card">
          <div className="card-header">
            <h4>Ventas Pendientes</h4>
            <button className="btn-sm">Ver todas</button>
          </div>
          <div className="card-body">
            {pendingPayments.map(sale => (
              <div key={sale.id} className="sale-item pending">
                <div className="sale-client">
                  <h5>{sale.client}</h5>
                  {windowWidth > 576 && <p>{sale.products}</p>}
                </div>
                <div className="sale-info">
                  <span className="sale-amount">{sale.amount}</span>
                  {windowWidth > 576 && <span className="sale-date">{sale.date}</span>}
                </div>
                <div className="sale-status pending">
                  {windowWidth > 576 ? 'Pendiente' : 'P'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ====================================================
          SEGUNDA FILA: INVENTARIO Y VENTAS RECIENTES
          Muestra el estado del inventario y las ventas recientes
          ==================================================== */}
      <div className="dashboard-row">
        {/* Tarjeta de estado del inventario */}
        <div className="dashboard-card">
          <div className="card-header">
            <h4>Estado del Inventario</h4>
          </div>
          <div className="card-body">
            {inventoryStatus.map((item, index) => (
              <div key={index} className="inventory-item">
                <div className="inventory-header">
                  <h5>{item.category}</h5>
                  {item.lowStock > 0 && <span className="low-stock-alert">!</span>}
                </div>
                <div className="inventory-stats">
                  <span className="total">Total: {item.total}</span>
                  {item.lowStock > 0 && <span className="low-stock">Bajo stock: {item.lowStock}</span>}
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${100 - (item.lowStock / item.total * 100)}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tarjeta de ventas recientes */}
        <div className="dashboard-card">
          <div className="card-header">
            <h4>Ventas Recientes</h4>
            <button className="btn-sm">Ver todas</button>
          </div>
          <div className="card-body">
            {recentSales.map(sale => (
              <div key={sale.id} className={`sale-item ${sale.status}`}>
                <div className="sale-client">
                  <h5>{sale.client}</h5>
                  {windowWidth > 576 && <p>{sale.products}</p>}
                </div>
                <div className="sale-info">
                  <span className="sale-amount">{sale.amount}</span>
                  {windowWidth > 576 && <span className="sale-date">{sale.date}</span>}
                </div>
                <div className={`sale-status ${sale.status}`}>
                  {windowWidth > 576 ? (sale.status === 'liquidado' ? 'Pagado' : 'Pendiente') : 
                   (sale.status === 'liquidado' ? 'P' : 'P')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ====================================================
          SECCIÓN: ACCESO RÁPIDO
          Muestra accesos directos a funciones principales
          ==================================================== */}
      <div className="dashboard-card">
        <div className="card-header">
          <h4>Acceso Rápido</h4>
        </div>
        <div className="card-body">
          <div className="quick-access-grid">
            {quickAccessItems.map(item => (
              <div key={item.id} className="quick-access-item">
                <div className="quick-access-icon">
                  {item.icon}
                </div>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;


