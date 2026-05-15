import '../../../assets/css/App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaCashRegister, FaCalendarAlt, FaInfoCircle, FaUser, FaDollarSign, FaFileInvoice, FaUsers } from "react-icons/fa";
import { IoMdClose, IoMdArrowDropdown } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { getVentasjs, createVentasjs, updateVentasjs, deleteVentasjs } from '../../../assets/js/Venta.js';
import { VentaCRUD } from './../VentaCRUD.jsx';

function Venta() {
  // Estado del formulario
  const [formData, setFormData] = useState({
    idCotizacion: "",
    estado: "PENDIENTE",
    metodoPago: "EFECTIVO",
    referenciaPago: "",
    total: "",
    abono: ""
  });

  // Filtros
  const [filters, setFilters] = useState({
    searchText: "",
    estadoFiltro: "",
    metodoPagoFiltro: "",
    montoFiltro: "",
    montoValor: "",
    fechaInicio: "",
    fechaFin: "",
    mesFiltro: "",
    anioFiltro: ""
  });
  
  // Paginación
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    pageOptions: [5, 10, 20, 50, 100]
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [expandedVenta, setExpandedVenta] = useState(null);

  // Datos y modales
  const [ventasList, setVentas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getVentasjs(setVentas);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    // Resetear a página 1 cuando cambian los filtros
    if (name !== "itemsPerPage") {
      setPagination(prev => ({ ...prev, currentPage: 1 }));
    }
  };

  const handlePaginationChange = (e) => {
    const { name, value } = e.target;
    setPagination(prev => ({ ...prev, [name]: parseInt(value), currentPage: 1 }));
  };

  const filteredData = ventasList.filter(item => {
    // Filtro por texto
    const matchesSearch = (item?.idVenta?.toString() ?? "").includes(filters.searchText) || 
                         (item?.nombrePaciente ?? "").toLowerCase().includes(filters.searchText.toLowerCase()) ||
                         (item?.codigo ?? "").toLowerCase().includes(filters.searchText.toLowerCase());
    
    // Filtro por estado
    const matchesEstado = !filters.estadoFiltro || item.estado === filters.estadoFiltro;
    
    // Filtro por método de pago
    const matchesMetodoPago = !filters.metodoPagoFiltro || item.metodoPago === filters.metodoPagoFiltro;
    
    // Filtro por monto
    let matchesMonto = true;
    if (filters.montoFiltro && filters.montoValor) {
      const montoNum = parseFloat(item.total);
      const valorFiltro = parseFloat(filters.montoValor);
      
      switch(filters.montoFiltro) {
        case "mayor":
          matchesMonto = montoNum > valorFiltro;
          break;
        case "menor":
          matchesMonto = montoNum < valorFiltro;
          break;
        case "igual":
          matchesMonto = montoNum === valorFiltro;
          break;
        default:
          matchesMonto = true;
      }
    }
    
    // Filtro por fechas
    let matchesDate = true;
    if (filters.fechaInicio || filters.fechaFin) {
      const fechaItem = new Date(item.fechaRegistro);
      const fechaInicio = filters.fechaInicio ? new Date(filters.fechaInicio) : null;
      const fechaFin = filters.fechaFin ? new Date(filters.fechaFin) : null;
      
      if (fechaInicio) {
        fechaInicio.setHours(0, 0, 0, 0);
        matchesDate = matchesDate && fechaItem >= fechaInicio;
      }
      
      if (fechaFin) {
        fechaFin.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && fechaItem <= fechaFin;
      }
    }
    
    // Filtro por mes
    let matchesMonth = true;
    if (filters.mesFiltro) {
      const fechaItem = new Date(item.fechaRegistro);
      matchesMonth = (fechaItem.getMonth() + 1) === parseInt(filters.mesFiltro);
    }
    
    // Filtro por año
    let matchesYear = true;
    if (filters.anioFiltro) {
      const fechaItem = new Date(item.fechaRegistro);
      matchesYear = fechaItem.getFullYear() === parseInt(filters.anioFiltro);
    }
    
    return matchesSearch && matchesEstado && matchesMetodoPago && matchesMonto && matchesDate && matchesMonth && matchesYear;
  })
  .sort((a, b) => {
    const dateA = new Date(a.fechaRegistro);
    const dateB = new Date(b.fechaRegistro);
    return dateB - dateA; // Para orden descendente (más reciente primero)
    // return dateA - dateB; // Para orden ascendente (más antiguo primero)
  });

  // Lógica de paginación
  const indexOfLastItem = pagination.currentPage * pagination.itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - pagination.itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / pagination.itemsPerPage);

  const handleAdd = () => {
    createVentasjs(
      formData.idCotizacion,
      formData.estado,
      formData.metodoPago,
      formData.referenciaPago,
      formData.total,
      formData.abono,
      setShowModal,
      () => getVentasjs(setVentas)
    );
  };

  const handleUpdate = () => {
    updateVentasjs(
      selectedVenta.idVenta,
      formData.idCotizacion,
      formData.estado,
      formData.metodoPago,
      formData.referenciaPago,
      formData.total,
      formData.abono,
      setShowEditModal,
      () => getVentasjs(setVentas)
    );
  };

  const handleDelete = () => {
    deleteVentasjs(
      selectedVenta.idVenta,
      setShowDeleteModal,
      () => getVentasjs(setVentas)
    );
  };

  const resetFilters = () => {
    setFilters({
      searchText: "",
      estadoFiltro: "",
      metodoPagoFiltro: "",
      montoFiltro: "",
      montoValor: "",
      fechaInicio: "",
      fechaFin: "",
      mesFiltro: "",
      anioFiltro: ""
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const toggleExpandVenta = (id) => {
    setExpandedVenta(expandedVenta === id ? null : id);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value || 0);
  };

  // Generar opciones de años (últimos 10 años)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 10; i--) {
      years.push(i);
    }
    return years;
  };

  // Estadísticas adicionales
  const ventasPagadas = filteredData.filter(v => v.estado === 'LIQUIDADO').length;
  const ventasPendientes = filteredData.filter(v => v.estado === 'PENDIENTE').length;
  const totalDeuda = filteredData.filter(v => v.estado === 'PENDIENTE')
    .reduce((acc, curr) => acc + (parseFloat(curr.debe) || 0), 0);

  return (
    <div className="container-fluid py-4">
      {/* Encabezado */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <div className="crud-avatar-optimized bg-primary bg-opacity-10 me-3">
            <FaCashRegister className="text-primary" />
          </div>
          <div>
            <h2 className="h4 mb-0 text-dark fw-bold">Gestión de Ventas</h2>
            <small className="text-muted">Registro de transacciones y pagos</small>
          </div>
        </div>
        
        <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0">
          <button 
            className="crud-btn crud-btn-primary d-flex align-items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaSearch className="me-1" /> 
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
          <button 
            className="crud-btn crud-btn-success d-flex align-items-center"
            onClick={() => {
              setFormData({
                idCotizacion: "",
                estado: "PENDIENTE",
                metodoPago: "EFECTIVO",
                referenciaPago: "",
                total: "",
                abono: ""
              });
              setSelectedVenta(null);
              setShowModal(true);
            }}
          >
            <FaPlus className="me-1" /> Nueva Venta
          </button>
        </div>
      </div>

      {/* Filtros desplegables */}
      {showFilters && (
        <div className="card crud-card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 text-primary">
                <FaSearch className="me-2" /> Filtros de Búsqueda
              </h5>
              <button 
                className="crud-btn crud-btn-sm crud-cancel"
                onClick={resetFilters}
              >
                <IoMdClose /> Limpiar Filtros
              </button>
            </div>
            
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label small fw-bold">Búsqueda por texto</label>
                <div className="crud-search-container">
                  <FaSearch className="crud-search-icon" />
                  <input
                    type="text"
                    className="form-control crud-search-input ps-4"
                    name="searchText"
                    value={filters.searchText}
                    onChange={handleFilterChange}
                    placeholder="Buscar ID, paciente o código..."
                  />
                </div>
              </div>
              
              <div className="col-md-3">
                <label className="form-label small fw-bold">Estado de venta</label>
                <select 
                  className="form-select"
                  name="estadoFiltro"
                  value={filters.estadoFiltro}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos los estados</option>
                  <option value="LIQUIDADO">Pagado</option>
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>
              
              <div className="col-md-3">
                <label className="form-label small fw-bold">Método de pago</label>
                <select 
                  className="form-select"
                  name="metodoPagoFiltro"
                  value={filters.metodoPagoFiltro}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos los métodos</option>
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="TARJETA CRÉDITO">Tarjeta Crédito</option>
                  <option value="TARJETA DÉBITO">Tarjeta Débito</option>
                  <option value="TRANSFERENCIA">Transferencia</option>
                  <option value="CHEQUES">Cheque</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
              
              <div className="col-md-3">
                <label className="form-label small fw-bold">Filtrar por monto total</label>
                <div className="d-flex gap-2">
                  <select 
                    className="form-select"
                    name="montoFiltro"
                    value={filters.montoFiltro}
                    onChange={handleFilterChange}
                  >
                    <option value="">Seleccione filtro</option>
                    <option value="mayor">Mayor que</option>
                    <option value="menor">Menor que</option>
                    <option value="igual">Igual a</option>
                  </select>
                  <input 
                    type="number" 
                    className="form-control"
                    name="montoValor"
                    value={filters.montoValor}
                    onChange={handleFilterChange}
                    placeholder="Monto"
                    disabled={!filters.montoFiltro}
                  />
                </div>
              </div>
              
              <div className="col-md-3">
                <label className="form-label small fw-bold">Registros por página</label>
                <select
                  className="form-select"
                  name="itemsPerPage"
                  value={pagination.itemsPerPage}
                  onChange={handlePaginationChange}
                >
                  {pagination.pageOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div className="col-md-3">
                <label className="form-label small fw-bold">Fecha desde</label>
                <input
                  type="date"
                  className="form-control"
                  name="fechaInicio"
                  value={filters.fechaInicio}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div className="col-md-3">
                <label className="form-label small fw-bold">Fecha hasta</label>
                <input
                  type="date"
                  className="form-control"
                  name="fechaFin"
                  value={filters.fechaFin}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div className="col-md-3">
                <label className="form-label small fw-bold">Filtrar por mes</label>
                <select
                  className="form-select"
                  name="mesFiltro"
                  value={filters.mesFiltro}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos los meses</option>
                  <option value="1">Enero</option>
                  <option value="2">Febrero</option>
                  <option value="3">Marzo</option>
                  <option value="4">Abril</option>
                  <option value="5">Mayo</option>
                  <option value="6">Junio</option>
                  <option value="7">Julio</option>
                  <option value="8">Agosto</option>
                  <option value="9">Septiembre</option>
                  <option value="10">Octubre</option>
                  <option value="11">Noviembre</option>
                  <option value="12">Diciembre</option>
                </select>
              </div>
              
              <div className="col-md-3">
                <label className="form-label small fw-bold">Filtrar por año</label>
                <select
                  className="form-select"
                  name="anioFiltro"
                  value={filters.anioFiltro}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos los años</option>
                  {generateYearOptions().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resumen de resultados */}
      <div className="row mb-4">
        <div className="col-md-6 d-flex align-items-center flex-wrap gap-2">
          <div className="badge bg-primary bg-opacity-10 text-primary p-2">
            <FaFileInvoice className="me-1" />
            {filteredData.length} {filteredData.length === 1 ? 'venta' : 'ventas'} encontradas
          </div>
          
          {filters.estadoFiltro && (
            <div className="badge bg-info bg-opacity-10 text-info p-2">
              Estado: {filters.estadoFiltro}
            </div>
          )}
          
          {filters.metodoPagoFiltro && (
            <div className="badge bg-warning bg-opacity-10 text-warning p-2">
              Método: {filters.metodoPagoFiltro}
            </div>
          )}
          
          {filters.montoFiltro && filters.montoValor && (
            <div className="badge bg-danger bg-opacity-10 text-danger p-2">
              {filters.montoFiltro === "mayor" && `Mayor a ${formatCurrency(filters.montoValor)}`}
              {filters.montoFiltro === "menor" && `Menor a ${formatCurrency(filters.montoValor)}`}
              {filters.montoFiltro === "igual" && `Igual a ${formatCurrency(filters.montoValor)}`}
            </div>
          )}
          
          {(filters.fechaInicio || filters.fechaFin) && (
            <div className="badge bg-success bg-opacity-10 text-success p-2">
              <FaCalendarAlt className="me-1" />
              {filters.fechaInicio && `Desde: ${new Date(filters.fechaInicio).toLocaleDateString()}`}
              {filters.fechaFin && ` Hasta: ${new Date(filters.fechaFin).toLocaleDateString()}`}
            </div>
          )}
          
          {filters.mesFiltro && (
            <div className="badge bg-secondary bg-opacity-10 text-secondary p-2">
              Mes: {new Date(2000, parseInt(filters.mesFiltro) - 1, 1).toLocaleString('es-ES', { month: 'long' })}
            </div>
          )}
          
          {filters.anioFiltro && (
            <div className="badge bg-dark bg-opacity-10 text-dark p-2">
              Año: {filters.anioFiltro}
            </div>
          )}
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-end">
          {filters.searchText && (
            <div className="badge bg-success bg-opacity-10 text-success p-2">
              Búsqueda: "{filters.searchText}"
            </div>
          )}
        </div>
      </div>

      {/* Tarjetas de resumen estadístico */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card crud-card border-0 shadow-sm bg-primary bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase text-muted fw-bold small">Total Ventas</h6>
                  <h3 className="mb-0 fw-bold">{filteredData.length}</h3>
                </div>
                <div className="bg-primary bg-opacity-25 p-3 rounded">
                  <FaFileInvoice className="text-primary fs-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card crud-card border-0 shadow-sm bg-success bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase text-muted fw-bold small">Ventas Pagadas</h6>
                  <h3 className="mb-0 fw-bold">{ventasPagadas}</h3>
                </div>
                <div className="bg-success bg-opacity-25 p-3 rounded">
                  <FaDollarSign className="text-success fs-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card crud-card border-0 shadow-sm bg-warning bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase text-muted fw-bold small">Ventas Pendientes</h6>
                  <h3 className="mb-0 fw-bold">{ventasPendientes}</h3>
                </div>
                <div className="bg-warning bg-opacity-25 p-3 rounded">
                  <FaInfoCircle className="text-warning fs-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card crud-card border-0 shadow-sm bg-danger bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase text-muted fw-bold small">Total Deuda</h6>
                  <h3 className="mb-0 fw-bold">{formatCurrency(totalDeuda)}</h3>
                </div>
                <div className="bg-danger bg-opacity-25 p-3 rounded">
                  <FaDollarSign className="text-danger fs-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listado de ventas */}
      <div className="card crud-card">
        <div className="card-header crud-card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-white">Registros de Ventas</h5>
          <small className="text-white-50">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </small>
        </div>
        
        <div className="table-responsive">
          <table className="table table-hover crud-table mb-0">
            <thead>
              <tr>
                <th style={{width: '50px'}}></th>
                <th>ID Venta</th>
                <th>Paciente</th>
                <th>Estado</th>
                <th>Método Pago</th>
                <th>Total</th>
                <th>Abonado</th>
                <th>Debe</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((venta) => (
                  <>
                    <tr key={venta.idVenta} onClick={() => toggleExpandVenta(venta.idVenta)} style={{cursor: 'pointer'}}>
                      <td className="text-center">
                        <IoMdArrowDropdown 
                          style={{
                            transform: expandedVenta === venta.idVenta ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                          }} 
                        />
                      </td>
                      <td className="fw-bold">#{venta.idVenta}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="crud-avatar-optimized bg-primary bg-opacity-10 me-2">
                            <FaUser className="text-primary" />
                          </div>
                          <div>
                            <div className="fw-bold">{venta.nombrePaciente}</div>
                            <small className="text-muted">{venta.telefono}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          venta.estado === 'LIQUIDADO'
                            ? 'bg-success'
                            : venta.estado === 'PENDIENTE'
                            ? 'bg-warning'
                            : venta.estado === 'LIQUIDADO'
                            ? 'bg-warning'
                            : 'bg-danger'
                        } bg-opacity-10 text-${
                          venta.estado === 'LIQUIDADO'
                            ? 'success'
                            : venta.estado === 'PENDIENTE'
                            ? 'warning'
                            : venta.estado === 'LIQUIDADO'
                            ? 'warning'
                            : 'danger'
                        }`}>
                          {venta.estado}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-info bg-opacity-10 text-info">
                          {venta.metodoPago}
                        </span>
                      </td>
                      <td className="fw-bold">{formatCurrency(venta.total)}</td>
                      <td className="fw-bold text-success">{formatCurrency(venta.abono)}</td>
                      <td className="fw-bold text-danger">{formatCurrency(venta.debe)}</td>
                      <td>{new Date(venta.fechaRegistro).toLocaleDateString('es-ES')}</td>
                      <td>
                        <div className="d-flex gap-2">
                        {/*   <button 
                            className="crud-btn crud-btn-info btn-action-optimized"
                            title="Detalles"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Aquí puedes agregar navegación a detalles si es necesario
                            }}
                          >
                            <FaInfoCircle />
                          </button> */}

                          <button 
                            className="crud-btn btn-warning btn-action-optimized"
                            title="Editar"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowEditModal(true);
                              setSelectedVenta(venta);
                              setFormData({
                                idCotizacion: venta.idCotizacion,
                                estado: venta.estado,
                                metodoPago: venta.metodoPago,
                                referenciaPago: venta.referenciaPago,
                                total: venta.total,
                                abono: venta.abono
                              });
                            }}
                          >
                            <FaEdit />
                          </button>

                          <button 
                            className="crud-btn crud-btn-danger btn-action-optimized"
                            title="Eliminar"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteModal(true);
                              setSelectedVenta(venta);
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {expandedVenta === venta.idVenta && (
                      <tr>
                        <td colSpan="10">
                          <div className="p-3 bg-light bg-opacity-10">
                            <h6 className="fw-bold mb-3">Detalles completos de la venta</h6>
                            
                            <div className="row">
                              <div className="col-md-6">
                                <div className="card mb-3">
                                  <div className="card-header bg-primary bg-opacity-10">
                                    <h6 className="mb-0 fw-bold">Información del Paciente</h6>
                                  </div>
                                  <div className="card-body">
                                    <div className="row">
                                      <div className="col-md-6">
                                        <p className="mb-1 small text-muted">Paciente</p>
                                        <p className="fw-bold">{venta.nombrePaciente}</p>
                                        
                                        <p className="mb-1 small text-muted">Contacto</p>
                                        <p className="fw-bold">{venta.telefono}</p>
                                      </div>
                                      <div className="col-md-6">
                                        <p className="mb-1 small text-muted">Dirección</p>
                                        <p className="fw-bold">{venta.direccion}, {venta.localidad}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="card">
                                  <div className="card-header bg-primary bg-opacity-10">
                                    <h6 className="mb-0 fw-bold">Información de la Cotización</h6>
                                  </div>
                                  <div className="card-body">
                                    <div className="d-flex justify-content-between mb-2">
                                      <span className="text-muted">ID Cotización:</span>
                                      <span className="fw-bold">{venta.idCotizacion}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                      <span className="text-muted">Total Cotización:</span>
                                      <span className="fw-bold">{formatCurrency(venta.totalCotizacion)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                      <span className="text-muted">Diferencia:</span>
                                      <span className="fw-bold">{formatCurrency(venta.total - venta.totalCotizacion)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="col-md-6">
                                <div className="card mb-3">
                                  <div className="card-header bg-primary bg-opacity-10">
                                    <h6 className="mb-0 fw-bold">Detalles del Pago</h6>
                                  </div>
                                  <div className="card-body">
                                    <div className="row mb-3">
                                      <div className="col-6">
                                        <p className="mb-1 small text-muted">Estado</p>
                                        <p className="fw-bold">{venta.estado}</p>
                                      </div>
                                      <div className="col-6">
                                        <p className="mb-1 small text-muted">Fecha</p>
                                        <p className="fw-bold">{new Date(venta.fechaRegistro).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="border-top pt-3">
                                      <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Método de pago:</span>
                                        <span className="fw-bold">{venta.metodoPago}</span>
                                      </div>
                                      {venta.referenciaPago && (
                                        <div className="d-flex justify-content-between mb-2">
                                          <span className="text-muted">Referencia:</span>
                                          <span className="fw-bold">{venta.referenciaPago}</span>
                                        </div>
                                      )}
                                      <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Total Venta:</span>
                                        <span className="fw-bold">{formatCurrency(venta.total)}</span>
                                      </div>
                                      <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Abonado:</span>
                                        <span className="fw-bold text-success">{formatCurrency(venta.abono)}</span>
                                      </div>
                                      <div className="d-flex justify-content-between border-top pt-2 mt-2">
                                        <span className="text-muted">Saldo pendiente:</span>
                                        <span className="fw-bold text-danger">{formatCurrency(venta.debe)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="d-flex gap-2">
                            {/*       <button
                                    className="crud-btn crud-btn-primary flex-grow-1"
                                    onClick={() => {
                                      // Aquí puedes agregar funcionalidad para registrar pago
                                    }}
                                  >
                                    <FaDollarSign className="me-2" /> Registrar Pago
                                  </button> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-5">
                    <div className="text-muted mb-2">
                      <FaCashRegister className="fs-4" />
                    </div>
                    <h5 className="text-muted">No se encontraron ventas</h5>
                    <small className="text-muted">
                      {filters.searchText || filters.estadoFiltro || filters.metodoPagoFiltro
                        ? "Intenta con otros criterios de búsqueda" 
                        : "No hay ventas registradas aún"}
                    </small>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {filteredData.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <span className="text-muted small">
              Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredData.length)} de {filteredData.length} registros
            </span>
          </div>
          <div className="d-flex gap-2">
            <button
              className="crud-btn crud-btn-sm"
              disabled={pagination.currentPage === 1}
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
            >
              Anterior
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`crud-btn crud-btn-sm ${pagination.currentPage === page ? 'crud-btn-primary' : ''}`}
                onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
              >
                {page}
              </button>
            ))}
            
            <button
              className="crud-btn crud-btn-sm"
              disabled={pagination.currentPage === totalPages}
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      <VentaCRUD
        formData={{
          ...formData,
          setIdCotizacion: (value) => setFormData(prev => ({ ...prev, idCotizacion: value })),
          setEstado: (value) => setFormData(prev => ({ ...prev, estado: value })),
          setMetodoPago: (value) => setFormData(prev => ({ ...prev, metodoPago: value })),
          setReferenciaPago: (value) => setFormData(prev => ({ ...prev, referenciaPago: value })),
          setTotal: (value) => setFormData(prev => ({ ...prev, total: value })),
          setAbono: (value) => setFormData(prev => ({ ...prev, abono: value }))
        }}
        modals={{
          showModal, setShowModal,
          showEditModal, setShowEditModal,
          showDeleteModal, setShowDeleteModal
        }}
        handlers={{
          handleAdd, handleUpdate, handleDelete
        }}
        selectedVenta={selectedVenta}
      />
    </div>
  );
}

export default Venta;