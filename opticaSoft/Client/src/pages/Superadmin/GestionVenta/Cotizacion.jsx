import '../../../assets/css/App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaReceipt, FaInfoCircle, FaUser, FaDollarSign, FaFileInvoice, FaUsers, FaFilePdf } from "react-icons/fa";
import { IoMdClose, IoMdArrowDropdown } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import {
  getCotizacionesJs,
  createCotizacionJs,
  updateCotizacionJs,
  deleteCotizacionJs
} from '../../../assets/js/Cotizacion.js';
import { CotizacionCRUD } from './CotizacionCRUD.jsx';

import 'jspdf-autotable';
import { generarCotizacionPDF } from './CotizacionPDF.jsx';


function Cotizacion() {


  
  // Estado del formulario
const [formData, setFormData] = useState({
    idPaciente: "",
    tipo: "ARMAZON",
    subtotal: "",
    descuento: "",
    iva: "",
    total: "",
    observaciones: ""
  });

  // Filtros
  const [filters, setFilters] = useState({
    searchText: "",
    tipoFiltro: "",
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
  const [expandedCotizacion, setExpandedCotizacion] = useState(null);

  // Datos y modales
  const [cotizacionList, setCotizacion] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCotizacion, setSelectedCotizacion] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCotizacionesJs(setCotizacion);
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

  const filteredData = cotizacionList.filter(item => {
    // Filtro por texto
    const matchesSearch = (item?.nombrePaciente ?? "").toLowerCase().includes(filters.searchText.toLowerCase()) || 
                         (item?.codigo ?? "").toLowerCase().includes(filters.searchText.toLowerCase()) ||
                         (item?.tipo ?? "").toLowerCase().includes(filters.searchText.toLowerCase());
    
    // Filtro por tipo
    const matchesTipo = !filters.tipoFiltro || item.tipo === filters.tipoFiltro;
    
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
    
    return matchesSearch && matchesTipo && matchesMonto && matchesDate && matchesMonth && matchesYear;
  });

  // Lógica de paginación
  const indexOfLastItem = pagination.currentPage * pagination.itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - pagination.itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / pagination.itemsPerPage);

  const handleAdd = () => {
    const total = 0; // Aquí puedes implementar tu lógica de cálculo
    createCotizacionJs(
      formData.idPaciente ? Number(formData.idPaciente) : null,
      formData.tipo, 
      formData.subtotal ? Number(formData.subtotal) : null, 
      formData.descuento ? Number(formData.descuento) : null, 
      formData.iva ? Number(formData.iva) : null, 
      total,
      formData.observaciones,
      setShowModal,
      () => getCotizacionesJs(setCotizacion)
    );
  };

  const handleUpdate = () => {
    updateCotizacionJs(
      selectedCotizacion.idCotizacion,
      formData.idPaciente ? Number(formData.idPaciente) : null,
      formData.tipo, 
      formData.subtotal, 
      formData.descuento ? Number(formData.descuento) : null, 
      formData.iva ? Number(formData.iva) : null, 
      formData.total, 
      formData.observaciones,
      setShowEditModal,
      () => getCotizacionesJs(setCotizacion)
    );
  };

  const handleDelete = () => {
    deleteCotizacionJs(
      selectedCotizacion.idCotizacion,
      () => getCotizacionesJs(setCotizacion),
      setShowDeleteModal
    );
  };

  const resetFilters = () => {
    setFilters({
      searchText: "",
      tipoFiltro: "",
      montoFiltro: "",
      montoValor: "",
      fechaInicio: "",
      fechaFin: "",
      mesFiltro: "",
      anioFiltro: ""
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const toggleExpandCotizacion = (id) => {
    setExpandedCotizacion(expandedCotizacion === id ? null : id);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
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

  const handleGeneratePDF = (cotizacion) => {
  // Aquí necesitarías obtener los datos adicionales que requiere la función generarCotizacionPDF
  // Por ahora lo dejamos con datos mínimos, pero deberás adaptarlo según tu implementación
  generarCotizacionPDF(
    cotizacion, 
    [], // searchFilteredData - ajustar según necesidad
    () => [], // getTratamientosByPedido - ajustar según necesidad
    (date) => new Date(date).toLocaleDateString('es-ES'), // formatDateString
    cotizacion.observaciones // observacionesCotizacion
  );
};

  return (
    <div className="container-fluid py-4">
      {/* Encabezado */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <div className="crud-avatar-optimized bg-primary bg-opacity-10 me-3">
            <FaReceipt className="text-primary" />
          </div>
          <div>
            <h2 className="h4 mb-0 text-dark fw-bold">Gestión de Cotizaciones</h2>
            <small className="text-muted">Presupuestos para tratamientos y servicios</small>
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
                idPaciente: "",
                tipo: "ARMAZON",
                subtotal: "",
                descuento: "",
                iva: "",
                total: "",
                observaciones: ""
              });
              setSelectedCotizacion(null);
              setShowModal(true);
            }}
          >
            <FaPlus className="me-1" /> Nueva Cotización
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
                    placeholder="Buscar paciente, código o tipo..."
                  />
                </div>
              </div>
              
              <div className="col-md-3">
                <label className="form-label small fw-bold">Tipo de cotización</label>
                <select 
                  className="form-select"
                  name="tipoFiltro"
                  value={filters.tipoFiltro}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos los tipos</option>
                  <option value="ARMAZON">Armazón</option>
                  <option value="LENTE">Lentes</option>
                  <option value="TRATAMIENTO">Tratamiento</option>
                  <option value="SERVICIO">Servicio</option>
                  <option value="PAQUETE">Paquete</option>
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
              
              
              <div className="col-md-4">
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
              
              <div className="col-md-4">
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
            {filteredData.length} {filteredData.length === 1 ? 'cotización' : 'cotizaciones'} encontradas
          </div>
          
          {filters.tipoFiltro && (
            <div className="badge bg-info bg-opacity-10 text-info p-2">
              Tipo: {filters.tipoFiltro}
            </div>
          )}
          
          {filters.montoFiltro && filters.montoValor && (
            <div className="badge bg-warning bg-opacity-10 text-warning p-2">
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
            <div className="badge bg-danger bg-opacity-10 text-danger p-2">
              Mes: {new Date(2000, parseInt(filters.mesFiltro) - 1, 1).toLocaleString('es-ES', { month: 'long' })}
            </div>
          )}
          
          {filters.anioFiltro && (
            <div className="badge bg-secondary bg-opacity-10 text-secondary p-2">
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
                  <h6 className="text-uppercase text-muted fw-bold small">Total Cotizaciones</h6>
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
                  <h6 className="text-uppercase text-muted fw-bold small">Valor Total</h6>
                  <h3 className="mb-0 fw-bold">
                    {formatCurrency(filteredData.reduce((acc, curr) => acc + parseFloat(curr.total), 0))}
                  </h3>
                </div>
                <div className="bg-success bg-opacity-25 p-3 rounded">
                  <FaDollarSign className="text-success fs-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card crud-card border-0 shadow-sm bg-info bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase text-muted fw-bold small">Pacientes Únicos</h6>
                  <h3 className="mb-0 fw-bold">
                    {new Set(filteredData.map(item => item.nombrePaciente)).size}
                  </h3>
                </div>
                <div className="bg-info bg-opacity-25 p-3 rounded">
                  <FaUsers className="text-info fs-4" />
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
                  <h6 className="text-uppercase text-muted fw-bold small">Promedio por cotización</h6>
                  <h3 className="mb-0 fw-bold">
                    {filteredData.length > 0 
                      ? formatCurrency(filteredData.reduce((acc, curr) => acc + parseFloat(curr.total), 0) / filteredData.length)
                      : formatCurrency(0)}
                  </h3>
                </div>
                <div className="bg-warning bg-opacity-25 p-3 rounded">
                  <FaDollarSign className="text-warning fs-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listado de cotizaciones */}
      <div className="card crud-card">
        <div className="card-header crud-card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-white">Registros de Cotizaciones</h5>
          <small className="text-white-50">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </small>
        </div>
        
        <div className="table-responsive">
          <table className="table table-hover crud-table mb-0">
            <thead>
              <tr>
                <th style={{width: '50px'}}></th>
                <th>Código</th>
                <th>Paciente</th>
                <th>Tipo</th>
                <th>Monto Total</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((cot) => (
                  <>
                    <tr key={cot.idCotizacion} onClick={() => toggleExpandCotizacion(cot.idCotizacion)} style={{cursor: 'pointer'}}>
                      <td className="text-center">
                        <IoMdArrowDropdown 
                          style={{
                            transform: expandedCotizacion === cot.idCotizacion ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                          }} 
                        />
                      </td>
                      <td className="fw-bold">{cot.codigo}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="crud-avatar-optimized bg-primary bg-opacity-10 me-2">
                            <FaUser className="text-primary" />
                          </div>
                          <div>
                            <div className="fw-bold">{cot.nombrePaciente}</div>
                            <small className="text-muted">{cot.telefono}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${cot.tipo === 'ARMAZON' ? 'bg-primary' : cot.tipo === 'LENTES' ? 'bg-info' : 'bg-warning'} bg-opacity-10 text-primary`}>
                          {cot.tipo}
                        </span>
                      </td>
                      <td className="fw-bold">{formatCurrency(cot.total)}</td>
                      <td>{new Date(cot.fechaRegistro).toLocaleDateString('es-ES')}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="crud-btn crud-btn-info btn-action-optimized"
                            title="Detalles"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/gestionVenta?idCotizacion=${cot.idCotizacion}`);
                            }}
                          >
                            <FaInfoCircle />
                          </button>

                          <button 
  className="crud-btn crud-btn-danger btn-action-optimized"
  title="Descargar PDF"
  onClick={(e) => {
    e.stopPropagation();
    handleGeneratePDF(cot);
  }}
  style={{ backgroundColor: '#e63946', color: 'white' }}
>
  <FaFilePdf />
</button>

                          <button 
                            className="crud-btn btn-warning btn-action-optimized"
                            title="Editar"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowEditModal(true);
                              setSelectedCotizacion(cot);
                              setFormData({
                                idPaciente: cot.idPaciente,
                                tipo: cot.tipo,
                                subtotal: cot.subtotal,
                                descuento: cot.descuento,
                                iva: cot.iva,
                                total: cot.total,
                                observaciones: cot.observaciones
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
                              setSelectedCotizacion(cot);
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {expandedCotizacion === cot.idCotizacion && (
                      <tr>
                        <td colSpan="7">
                          <div className="p-3 bg-light bg-opacity-10">
                            <h6 className="fw-bold mb-3">Detalles completos de la cotización</h6>
                            
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
                                        <p className="fw-bold">{cot.nombrePaciente}</p>
                                        
                                        <p className="mb-1 small text-muted">Contacto</p>
                                        <p className="fw-bold">{cot.telefono}</p>
                                      </div>
                                      <div className="col-md-6">
                                        <p className="mb-1 small text-muted">Dirección</p>
                                        <p className="fw-bold">{cot.direccion}, {cot.localidad}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="card">
                                  <div className="card-header bg-primary bg-opacity-10">
                                    <h6 className="mb-0 fw-bold">Observaciones</h6>
                                  </div>
                                  <div className="card-body">
                                    <p>{cot.observaciones || 'No hay observaciones registradas'}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="col-md-6">
                                <div className="card mb-3">
                                  <div className="card-header bg-primary bg-opacity-10">
                                    <h6 className="mb-0 fw-bold">Detalles de la Cotización</h6>
                                  </div>
                                  <div className="card-body">
                                    <div className="row mb-3">
                                      <div className="col-6">
                                        <p className="mb-1 small text-muted">Tipo</p>
                                        <p className="fw-bold">{cot.tipo}</p>
                                      </div>
                                      <div className="col-6">
                                        <p className="mb-1 small text-muted">Fecha</p>
                                        <p className="fw-bold">{new Date(cot.fechaRegistro).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="border-top pt-3">
                                      <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Subtotal:</span>
                                        <span className="fw-bold">{formatCurrency(cot.subtotal)}</span>
                                      </div>
                                      <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Descuento ({cot.descuento}%):</span>
                                        <span className="fw-bold text-danger">-{formatCurrency(cot.subtotal * cot.descuento / 100)}</span>
                                      </div>
                                      <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">IVA ({cot.iva}%):</span>
                                        <span className="fw-bold">{formatCurrency((cot.subtotal - (cot.subtotal * cot.descuento / 100)) * cot.iva / 100)}</span>
                                      </div>
                                      <div className="d-flex justify-content-between border-top pt-2 mt-2">
                                        <span className="text-muted">Total:</span>
                                        <span className="fw-bold text-success">{formatCurrency(cot.total)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="d-flex gap-2">
                                  <button
                                    className="crud-btn crud-btn-primary flex-grow-1"
                                    onClick={() => navigate(`/gestionVenta?idCotizacion=${cot.idCotizacion}`)}
                                  >
                                    <FaList className="me-2" /> Convertir en Venta
                                  </button>
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
                  <td colSpan="7" className="text-center py-5">
                    <div className="text-muted mb-2">
                      <FaReceipt className="fs-4" />
                    </div>
                    <h5 className="text-muted">No se encontraron cotizaciones</h5>
                    <small className="text-muted">
                      {filters.searchText || filters.tipoFiltro || filters.montoFiltro
                        ? "Intenta con otros criterios de búsqueda" 
                        : "No hay cotizaciones registradas aún"}
                    </small>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CotizacionCRUD
        formData={{
          ...formData,
          setIdPaciente: (value) => setFormData(prev => ({ ...prev, idPaciente: value })),
          setTipo: (value) => setFormData(prev => ({ ...prev, tipo: value })),
          setSubtotal: (value) => setFormData(prev => ({ ...prev, subtotal: value })),
          setDescuento: (value) => setFormData(prev => ({ ...prev, descuento: value })),
          setIva: (value) => setFormData(prev => ({ ...prev, iva: value })),
          setTotal: (value) => setFormData(prev => ({ ...prev, total: value })),
          setObservaciones: (value) => setFormData(prev => ({ ...prev, observaciones: value }))
        }}
        modals={{
          showModal, setShowModal,
          showEditModal, setShowEditModal,
          showDeleteModal, setShowDeleteModal
        }}
        handlers={{
          handleAdd, handleUpdate, handleDelete
        }}
        selectedCotizacion={selectedCotizacion}
      />
    </div>
  );
}

export default Cotizacion;