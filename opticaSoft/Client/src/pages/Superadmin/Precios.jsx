import '../../assets/css/App.css';
import { useState, useEffect, useMemo } from 'react';

import { getLentesContacto } from '../../api/LentesContacto.api';
import { getMaterial } from '../../api/Material.api';
import { getTratamientos } from '../../api/Tratamientos.api';
import { getTipoLente } from '../../api/TipoLente.api';
import { getPaquetes } from '../../api/Paquete.api';
import { getInventario } from '../../api/Inventario.api';

// Importar íconos de Bootstrap
import { 
  BsEyeglasses, BsEye, BsClipboard, BsBox, BsClipboardData, 
  BsSun, BsSunglasses, BsBrightnessHigh, BsShield,
  BsCalendar, BsDroplet, BsCheckCircle, BsCart,
  BsDownload, BsList, BsFunnel, BsSearch
} from 'react-icons/bs';

const Precios = () => {
  const [activeTab, setActiveTab] = useState('lentes-armazon');
  const [lentesContacto, setLentesContacto] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [tratamientos, setTratamientos] = useState([]);
  const [tiposLente, setTiposLente] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Memoizar los datos filtrados para evitar reprocesamiento
  const filteredPaquetes = useMemo(() => {
    return paquetes.filter(paquete => paquete.estado === 'ACTIVO');
  }, [paquetes]);

  const filteredInventario = useMemo(() => {
    return inventario.filter(item => item.estatus === 'Disponible');
  }, [inventario]);

  // Paginación para inventario
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventario.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInventario.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Cargar datos solo una vez
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          lentesData,
          materialesData,
          tratamientosData,
          tiposLenteData,
          paquetesData,
          inventarioData
        ] = await Promise.all([
          getLentesContacto(),
          getMaterial(),
          getTratamientos(),
          getTipoLente(),
          getPaquetes(),
          getInventario()
        ]);

        setLentesContacto(lentesData);
        setMateriales(materialesData);
        setTratamientos(tratamientosData);
        setTiposLente(tiposLenteData);
        setPaquetes(paquetesData);
        setInventario(inventarioData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-5">Cargando datos...</div>;
  if (error) return <div className="text-center py-5 text-danger">Error: {error}</div>;

  // Función para formatear precios
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);
  };

  // Obtener los 3 materiales más baratos para mostrar en cards
  const featuredMaterials = materiales.slice(0, 3);
  
  // Obtener los 3 tipos de lente más populares
  const featuredLensTypes = tiposLente.slice(0, 3);
  
  // Obtener los 2 paquetes principales (solo activos)
  const featuredPackages = filteredPaquetes.slice(0, 2);

  return (
    <div className="container my-5">
     <h2 className="h4 mb-0 text-dark fw-bold  mb-4">Precios y Productos</h2>
      {/* <h2 className="text-center mb-4">Precios y Productos</h2> */}
      
      <div className="row">
       {/* Panel de Navegación Lateral - Mejorado */}
<div className="col-lg-3 mb-4">
  <div className="card shadow-sm crud-card" style={{ position: 'static' }}>
    <div className="card-header crud-card-header">
      <h5 className="mb-0 text-white"><BsList className="me-2" />Categorías</h5>
    </div>
    <div className="card-body p-0">
      <ul className="nav nav-pills flex-column crud-tabs">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'lentes-armazon' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('lentes-armazon');
              setCurrentPage(1);
            }}
          >
            <BsEyeglasses className="me-2" />Lentes de armazón
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'lentes-contacto' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('lentes-contacto');
              setCurrentPage(1);
            }}
          >
            <BsEye className="me-2" />Lentes de contacto
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'tratamientos' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('tratamientos');
              setCurrentPage(1);
            }}
          >
            <BsClipboard className="me-2" />Tratamientos
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'paquetes' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('paquetes');
              setCurrentPage(1);
            }}
          >
            <BsBox className="me-2" />Paquetes
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'inventario' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('inventario');
              setCurrentPage(1);
            }}
          >
            <BsClipboardData className="me-2" />Inventario
          </button>
        </li>
      </ul>
    </div>
  </div>
</div>

        {/* Contenido Principal */}
        <div className="col-lg-9">
          {/* Lentes de Armazón */}
          {activeTab === 'lentes-armazon' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0 h4 mb-0 text-dark fw-bold"><BsEyeglasses className="me-2" />Lentes de Armazón</h2>
               {/* <button className="btn crud-btn crud-btn-primary">
                  <BsDownload className="me-1" /> Descargar Lista 
                </button> */}
              </div>

              <div className="row g-4">
                {featuredMaterials.map((material, index) => (
                  <div className="col-md-4" key={material.idMaterial}>
                    <div className="card price-card h-100 shadow-sm crud-card">
                      <div className="card-body text-center">
                        <div className="category-icon crud-avatar-optimized mx-auto mb-3">
                          {index === 0 ? <BsSunglasses /> : index === 1 ? <BsEyeglasses /> : <BsBrightnessHigh />}
                        </div>
                        <h5 className="card-title">{material.nombre}</h5>
                        <p className="text-muted">Material premium</p>
                        <h4 className="text-primary mb-3">{formatPrice(material.precio)}</h4>
                        <ul className="list-unstyled text-start small">
                          <li className="mb-1"><BsCheckCircle className="text-success me-1" /> Alta durabilidad</li>
                          <li className="mb-1"><BsCheckCircle className="text-success me-1" /> Varios colores</li>
                          <li className="mb-1"><BsCheckCircle className="text-success me-1" /> Garantía incluida</li>
                        </ul>
                      </div>
                      <div className="card-footer bg-white border-0 crud-card-footer">
                        <span className="badge bg-success">Disponible</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tabla de tipos de lente */}
              <div className="card shadow-sm mt-4 crud-card">
                <div className="card-body">
                  <h5 className="card-title mb-3">Opciones de lentes</h5>
                  <div className="table-responsive">
                    <table className="table table-hover crud-table">
                      <thead className="table-light">
                        <tr>
                          <th>Tipo de Lente</th>
                          <th>Descripción</th>
                          <th>Precio Base</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tiposLente.map(tipo => (
                          <tr key={tipo.idTipoLente}>
                            <td>{tipo.nombre}</td>
                            <td>Corrección de visión</td>
                            <td>{formatPrice(tipo.precio)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lentes de Contacto */}
          {activeTab === 'lentes-contacto' && (
            <div>
              <h2 className="mb-4 h4 mb-0 text-dark fw-bold"><BsEye className="me-2" />Lentes de Contacto</h2>
              
              <div className="row g-4">
                {lentesContacto.slice(0, 3).map((lente, index) => (
                  <div className="col-md-4" key={lente.idLentesContacto}>
                    <div className="card price-card h-100 shadow-sm crud-card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h5 className="card-title">{lente.marca}</h5>
                            <p className="text-muted">{lente.modelo}</p>
                          </div>
                          <div className="category-icon text-primary crud-avatar-optimized">
                            {index === 0 ? <BsDroplet /> : <BsCalendar />}
                          </div>
                        </div>
                        <hr />
                        <div className="mb-3">
                          <h4 className="text-primary">
                            {formatPrice(lente.precio)} <small className="text-muted">/ {lente.duracion}</small>
                          </h4>
                        </div>
                        <ul className="list-unstyled">
                          <li className="mb-2"><BsCheckCircle className="text-success me-1" /> Esfera: {lente.esfera}</li>
                        </ul>
                      </div>
                      <div className="card-footer bg-white border-0 crud-card-footer">
                        <span className="badge bg-success">Disponible</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tabla completa de lentes de contacto */}
              <div className="card shadow-sm mt-4 crud-card">
                <div className="card-body">
                  <h5 className="card-title mb-3">Marcas disponibles</h5>
                  <div className="table-responsive">
                    <table className="table table-hover crud-table">
                      <thead className="table-light">
                        <tr>
                          <th>Marca</th>
                          <th>Modelo</th>
                          <th>Duración</th>
                          <th>Precio</th>
                          <th>Disponibilidad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lentesContacto.map(lente => (
                          <tr key={lente.idLentesContacto}>
                            <td>{lente.marca}</td>
                            <td>{lente.modelo}</td>
                            <td>{lente.duracion}</td>
                            <td>{formatPrice(lente.precio)}</td>
                            <td><span className="badge bg-success">En stock</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tratamientos */}
          {activeTab === 'tratamientos' && (
            <div>
              <h2 className="mb-4 h4 mb-0 text-dark fw-bold"><BsClipboard className="me-2" />Tratamientos</h2>
              
              <div className="row g-4">
                {tratamientos.slice(0, 3).map((tratamiento, index) => (
                  <div className="col-md-4" key={tratamiento.idTratamiento}>
                    <div className="card price-card h-100 shadow-sm crud-card">
                      <div className="card-body text-center">
                        <div className="category-icon crud-avatar-optimized mx-auto mb-3">
                          {index === 0 ? <BsSun /> : index === 1 ? <BsBrightnessHigh /> : <BsShield />}
                        </div>
                        <h5 className="card-title">{tratamiento.nombre}</h5>
                        <h4 className="text-primary mb-3">{formatPrice(tratamiento.precio)}</h4>
                        <p className="text-muted small">
                          {index === 0 ? 'Reduce los reflejos y mejora la estética de tus lentes.' : 
                           index === 1 ? 'Se adapta a diferentes condiciones de luz.' : 
                           'Protección duradera contra rayones y abrasiones.'}
                        </p>
                        <div className="mt-3">
                          <span className="badge bg-info">
                            {index === 0 ? '+1 día de fabricación' : 
                             index === 1 ? '+2 días de fabricación' : 'Sin tiempo adicional'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tabla de tratamientos */}
              <div className="card shadow-sm mt-4 crud-card">
                <div className="card-body">
                  <h5 className="card-title mb-3">Todos los tratamientos</h5>
                  <div className="table-responsive">
                    <table className="table table-hover crud-table">
                      <thead className="table-light">
                        <tr>
                          <th>Tratamiento</th>
                          <th>Precio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tratamientos.map(tratamiento => (
                          <tr key={tratamiento.idTratamiento}>
                            <td>{tratamiento.nombre}</td>
                            <td>{formatPrice(tratamiento.precio)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Paquetes */}
          {activeTab === 'paquetes' && (
            <div>
              <h2 className="mb-4 h4 mb-0 text-dark fw-bold"><BsBox className="me-2" />Paquetes</h2>
              
              <div className="row g-4">
                {featuredPackages.map((paquete, index) => (
                  <div className="col-md-6" key={paquete.idPaquete}>
                    <div className={`card price-card h-100 shadow-sm crud-card ${index === 0 ? 'border-primary' : 'border-warning'}`}>
                      <div className={`card-header ${index === 0 ? 'bg-primary text-white' : 'bg-warning text-dark'}`}>
                        <h5 className="mb-0">{paquete.nombre}</h5>
                      </div>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <h3 className="text-primary d-inline">{formatPrice(paquete.total)}</h3>
                          </div>
                        </div>
                        <ul className="list-unstyled">
                            <li className="mb-2"><BsCheckCircle className="text-success me-2" />{paquete.descripcion}</li>
                          <li className="mb-2"><BsCheckCircle className="text-success me-2" /> Armazón de calidad</li>
                          <li className="mb-2"><BsCheckCircle className="text-success me-2" /> Garantía incluida</li>
                        </ul>
                      </div>
                      <div className="card-footer bg-white crud-card-footer">
                        <span className="badge bg-success">ACTIVO</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tabla de paquetes */}
              <div className="card shadow-sm mt-4 crud-card">
                <div className="card-body">
                  <h5 className="card-title mb-3">Todos los paquetes</h5>
                  <div className="table-responsive">
                    <table className="table table-hover crud-table">
                      <thead className="table-light">
                        <tr>
                          <th>Paquete</th>
                          <th>Descripción</th>
                          <th>Precio</th>
                          <th>Vigencia</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPaquetes.map(paquete => (
                          <tr key={paquete.idPaquete}>
                            <td>{paquete.nombre}</td>
                            <td>{paquete.descripcion}</td>
                            <td>{formatPrice(paquete.total)}</td>
                            <td>{new Date(paquete.vigencia).toLocaleDateString()}</td>
                            <td className={paquete.estado === 'ACTIVO' ? 'text-success' : 'text-danger'}>
                              <span className={`badge bg-${paquete.estado === 'ACTIVO' ? 'success' : 'danger'}`}>
                                {paquete.estado}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Inventario */}
          {activeTab === 'inventario' && (
            <div>
              <h2 className="mb-4 h4 mb-0 text-dark fw-bold"><BsClipboardData className="me-2" />Inventario</h2>
              
              <div className="card shadow-sm crud-card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">Productos disponibles</h5>
                    <div className="d-flex align-items-center">
                      <div className="crud-search-container me-3">
                        <BsSearch className="crud-search-icon" />
                      {/*   <input 
                          type="text" 
                          className="form-control crud-search-input" 
                          placeholder="Buscar productos..." 
                        />
                      </div>
                      <div className="dropdown">
                        <button className="btn crud-btn crud-btn-info dropdown-toggle" type="button" id="inventoryFilter" data-bs-toggle="dropdown" aria-expanded="false">
                          <BsFunnel className="me-1" /> Filtrar
                        </button> */}
                        <ul className="dropdown-menu" aria-labelledby="inventoryFilter">
                          <li><button className="dropdown-item">Todos</button></li>
                          <li><button className="dropdown-item">Disponibles</button></li>
                          <li><button className="dropdown-item">Agotados</button></li>
                          <li><button className="dropdown-item">Pocas unidades</button></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="table-responsive">
                    <table className="table table-hover crud-table">
                      <thead className="table-light">
                        <tr>
                          <th>Marca</th>
                          <th>Modelo</th>
                          <th>Material</th>
                          <th>Precio</th>
                          <th>Stock</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map(item => (
                          <tr key={item.idInventario}>
                            <td>{item.marca}</td>
                            <td>{item.modelo}</td>
                            <td>{item.material}</td>
                            <td>{formatPrice(item.precioVenta)}</td>
                            <td>{item.cantidad}</td>
                            <td className={item.estatus === 'Disponible' ? 'text-success' : 'text-danger'}>
                              <span className={`badge bg-${item.estatus === 'Disponible' ? 'success' : 'danger'}`}>
                                {item.estatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <nav aria-label="Page navigation" className="mt-3">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Anterior
                        </button>
                      </li>
                      {[...Array(totalPages).keys()].map(number => (
                        <li 
                          key={number + 1} 
                          className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}
                        >
                          <button 
                            className="page-link" 
                            onClick={() => paginate(number + 1)}
                          >
                            {number + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Siguiente
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Precios;