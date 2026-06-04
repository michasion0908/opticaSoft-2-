
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Importación de componentes y estilos
import Navbar from './components/Navbar/Navbar.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';

// Importación de Home
//import Home from './pages/Superadmin/home.jsx';

import AppRoutes from './App.Routes.jsx'; // Importamos todas las rutas 


import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const isAuthenticated = Boolean(localStorage.getItem('usuario'));

  if (isLoginPage) {
    return <AppRoutes />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app">
      {/* NAVBAR (Barra de navegación superior), Recibe función toggleSidebar para abrir/cerrar el menú, Se muestra siempre en la parte superior */}
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="app-container">
        <Sidebar isOpen={sidebarOpen} />
        <main className={`main-content ${sidebarOpen ? '' : 'full-width'}`}>
        {/*   <Home /> */}
       <AppRoutes /> 
        </main>
      </div>
    </div>
  );
}

export default App;
