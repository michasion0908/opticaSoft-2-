import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { 
  FaHome, FaAddressBook, FaEye, FaGlasses, FaUsersCog, 
  FaFlask, FaCalendarAlt, FaFileInvoiceDollar, 
  FaShoppingCart, FaUserMd, FaUsers, FaClipboardList,
  FaBoxes, FaChevronDown, FaChevronRight
} from 'react-icons/fa';
import './Sidebar.css';
import PropTypes from 'prop-types';

const Sidebar = ({ isOpen }) => {
  const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [
    { id: 'home', name: 'Home', icon: <FaHome />, path: '/home', submenu: false },
    { 
      id: 'pacientes', 
      name: 'Gestión de Pacientes', 
      icon: <FaAddressBook />,
      submenu: [
        { id: 'pacientes', name: 'Pacientes', icon: <FaUsersCog />, path: '/pacientes' },
        { id: 'recetas', name: 'Recetas', icon: <FaClipboardList />, path: '/receta' },
       /*  { id: 'gestionPacientes', name: 'Gestión Pacientes', icon: <FaClipboardList />, path: '/gestionPacientes' } */
      ]
    },
    
    { id: 'examenes', name: 'Exámenes de la Vista', icon: <FaEye />, path: '/examenVista', submenu: false },

    { 
      id: 'inventario', 
      name: 'Inventario', 
      icon: <FaBoxes />,
      submenu: [
        { id: 'inventario', name: 'Armazones', icon: <FaGlasses />, path: '/inventario' },
        { id: 'micas', name: 'Materiales Lentes (Micas)', icon: <FaGlasses />, path: '/material' },
        { id: 'lentes-contacto', name: 'Lentes de Contacto', icon: <FaGlasses />, path: '/lentesContacto' },
        { id: 'tipos-lentes', name: 'Tipos de Lentes', icon: <FaGlasses />, path: '/tipoLente' },
        { id: 'tratamientos', name: 'Tratamientos', icon: <FaFlask />, path: '/tratamientos' }
      ]
    },

    { 
      id: 'precios', 
      name: 'Precios', 
      icon: <FaFileInvoiceDollar />,
      submenu: [
      { id: 'listaPrecios', name: 'Lista de Precios', icon: <FaFileInvoiceDollar />, path: '/precios' },    
      { id: 'paquetes', name: 'Paquetes', icon: <FaBoxes />, path: '/paquetes' }
        //{ id: 'paqueteDetalle', name: 'Paquetes Detalles', icon: <FaBoxes />, path: '/paqueteDetalle' }, 
      ]
    },

    // { id: 'precios', name: 'Precios', icon: <FaFileInvoiceDollar />, path: '/precios', submenu: false},

    { id: 'citas', name: 'Citas', icon: <FaCalendarAlt />, path: '/citas', submenu: false },
    // { id: 'cotizacion', name: 'Cotización', icon: <FaFileInvoiceDollar />, path: '/Cotizacion', submenu: false },
    // { id: 'pedidos', name: 'Pedidos', icon: <FaFileInvoiceDollar />, path: '/pedidos', submenu: false },
    // { id: 'pedidosTratamientos', name: 'Pedidos - Tratamientos', icon: <FaFileInvoiceDollar />, path: '/pedidosTratamientos', submenu: false },
    //{ id: 'ventas', name: 'Ventas', icon: <FaShoppingCart />, path: '/ventas', submenu: false },
    { id: 'optometristas', name: 'Optometristas', icon: <FaUserMd />, path: '/optometristas', submenu: false },
    //{ id: 'usuarios', name: 'Usuarios', icon: <FaUsers />, path: '/usuarios', submenu: false }, 


    { 
      id: 'gestionVentas', 
      name: 'Gestión de Ventas',
      icon: <FaShoppingCart />, 
      submenu: [
        { id: 'GestionCotizacion', name: 'Cotización', icon: <FaFileInvoiceDollar />, path: '/gestionCotizacion' },
        { id: 'Ventas', name: 'Historial de ventas', icon: <FaShoppingCart />, path: '/historialVenta' }
      ]
    },

  ];

  const toggleMenu = (menuId) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h3 className="logo">
          <span className="text-primary">Óptica</span> Maryen 
        </h3>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <div key={item.id}>
            {item.submenu ? (
              <div 
                className={`menu-item ${expandedMenu === item.id ? 'active' : ''}`}
                onClick={() => toggleMenu(item.id)}
                aria-expanded={expandedMenu === item.id}
                aria-haspopup="true"
              >
                <div className="menu-icon">{item.icon}</div>
                {isOpen && <span className="menu-text">{item.name}</span>}
                {isOpen && (
                  <span className="menu-arrow">
                    {expandedMenu === item.id ? <FaChevronDown /> : <FaChevronRight />}
                  </span>
                )}
              </div>
            ) : (
              <NavLink 
                to={item.path}
                className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
              >
                <div className="menu-icon">{item.icon}</div>
                {isOpen && <span className="menu-text">{item.name}</span>}
              </NavLink>
            )}

            {item.submenu && expandedMenu === item.id && isOpen && (
              <div className="submenu" role="menu">
                {item.submenu.map((subItem) => (
                  <NavLink 
                    to={subItem.path}
                    key={subItem.id}
                    className="submenu-item"
                  >
                    <div className="submenu-icon">{subItem.icon}</div>
                    <span>{subItem.name}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

export default Sidebar;
