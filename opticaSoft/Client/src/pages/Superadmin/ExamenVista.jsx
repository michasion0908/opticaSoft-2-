import '../../assets/css/App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaEye, FaFilter, FaFileMedical, FaCalendarAlt, FaUserMd, FaUser } from "react-icons/fa";
import { IoMdClose, IoMdArrowDropdown } from "react-icons/io";

import { getExamenesVistajs, createExamenVistajs, updateExamenVistajs, deleteExamenVistajs } 
from '../../assets/js/ExamenVista.js';
import { ExamenVistaCRUD } from './ExamenVistaCRUD.jsx';

function ExamenVista() {
    // Campos del formulario
    const [ExamenVistaList, setExamenVista] = useState([]);
    const [formData, setFormData] = useState({
        idPaciente: "",
        idOptometrista: "",
        NoExamen: "",
        rx_esfera_od: "",
        rx_cilindro_od: "",
        rx_eje_od: "",
        rx_esfera_oi: "",
        rx_cilindro_oi: "",
        rx_eje_oi: "",
        add_lente: "",
        ao: "",
        dnp: "",
        defRefractivo: "",
        observaciones: ""
    });

    // Filtros
    const [filters, setFilters] = useState({
        searchText: "",
        defRefractivo: "",
        fechaFiltro: "todos",
        fechaEspecifica: "",
        mes: "",
        year: ""
    });
    const [showFilters, setShowFilters] = useState(false);
    const [expandedExam, setExpandedExam] = useState(null);

    // Modales
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedExamenVista, setSelectedExamenVista] = useState(null);

    useEffect(() => { getExamenesVistajs(setExamenVista); }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredData = ExamenVistaList.filter(item => {
        // Filtro por texto
        const matchesSearch = item?.nombrePaciente?.toLowerCase().includes(filters.searchText.toLowerCase()) || 
                             item?.nombreOptometrista?.toLowerCase().includes(filters.searchText.toLowerCase());
        
        // Filtro por defecto refractivo
        const matchesDefRefractivo = filters.defRefractivo ? item.defRefractivo === filters.defRefractivo : true;
        
        // Filtros por fecha
        let matchesFecha = true;
        const fechaExamen = new Date(item.fechaRegistro);
        
        switch(filters.fechaFiltro) {
            case "hoy":
                const hoy = new Date();
                matchesFecha = fechaExamen.toDateString() === hoy.toDateString();
                break;
            case "especifica":
                if (filters.fechaEspecifica) {
                    const fechaEspecifica = new Date(filters.fechaEspecifica);
                    matchesFecha = fechaExamen.toDateString() === fechaEspecifica.toDateString();
                }
                break;
            case "mes":
                if (filters.mes) {
                    matchesFecha = fechaExamen.getMonth() + 1 === parseInt(filters.mes);
                    if (filters.year) {
                        matchesFecha = matchesFecha && fechaExamen.getFullYear() === parseInt(filters.year);
                    }
                }
                break;
            case "year":
                if (filters.year) {
                    matchesFecha = fechaExamen.getFullYear() === parseInt(filters.year);
                }
                break;
            default:
                matchesFecha = true;
        }
        
        return matchesSearch && matchesDefRefractivo && matchesFecha;
    });

    const handleAdd = () => {
        createExamenVistajs(
            formData.idPaciente,
            formData.idOptometrista,
            formData.NoExamen,
            formData.rx_esfera_od,
            formData.rx_cilindro_od,
            formData.rx_eje_od,
            formData.rx_esfera_oi,
            formData.rx_cilindro_oi,
            formData.rx_eje_oi,
            formData.add_lente,
            formData.ao,
            formData.dnp,
            formData.defRefractivo,
            formData.observaciones, 
            setShowModal, 
            () => getExamenesVistajs(setExamenVista)
        );
    };

    const handleUpdate = () => {
        updateExamenVistajs(
            selectedExamenVista.idExamenVista,
            formData.idPaciente,
            formData.idOptometrista,
            formData.NoExamen,
            formData.rx_esfera_od,
            formData.rx_cilindro_od,
            formData.rx_eje_od,
            formData.rx_esfera_oi,
            formData.rx_cilindro_oi,
            formData.rx_eje_oi,
            formData.add_lente,
            formData.ao,
            formData.dnp,
            formData.defRefractivo,
            formData.observaciones, 
            setShowEditModal, 
            () => getExamenesVistajs(setExamenVista)
        );
    };

    const handleDelete = () => {
        deleteExamenVistajs(
            selectedExamenVista.idExamenVista, 
            setShowDeleteModal, 
            () => getExamenesVistajs(setExamenVista)
        );
    };

    const formatDateString = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const resetFilters = () => {
        setFilters({
            searchText: "",
            defRefractivo: "",
            fechaFiltro: "todos",
            fechaEspecifica: "",
            mes: "",
            year: ""
        });
    };

    const defectosRefractivos = [
        "Miopía",
        "Hipermetropía",
        "Astigmatismo",
        "Presbicia",
        "Miopía + Astigmatismo",
        "Hipermetropía + Astigmatismo"
    ];

    const meses = [
        { value: "1", label: "Enero" },
        { value: "2", label: "Febrero" },
        { value: "3", label: "Marzo" },
        { value: "4", label: "Abril" },
        { value: "5", label: "Mayo" },
        { value: "6", label: "Junio" },
        { value: "7", label: "Julio" },
        { value: "8", label: "Agosto" },
        { value: "9", label: "Septiembre" },
        { value: "10", label: "Octubre" },
        { value: "11", label: "Noviembre" },
        { value: "12", label: "Diciembre" }
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    const toggleExpandExam = (id) => {
        setExpandedExam(expandedExam === id ? null : id);
    };

    return (
        <div className="container-fluid py-4">
            {/* Encabezado */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                    <div className="crud-avatar-optimized bg-primary bg-opacity-10 me-3">
                        <FaEye className="text-primary" />
                    </div>
                    <div>
                        <h2 className="h4 mb-0 text-dark fw-bold">Exámenes de la Vista</h2>
                        <small className="text-muted">Registro y seguimiento de exámenes oftalmológicos</small>
                    </div>
                </div>
                
                <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0">
                    <button 
                        className="crud-btn crud-btn-primary d-flex align-items-center"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FaFilter className="me-1" /> 
                        {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                    </button>
                    <button 
                        className="crud-btn crud-btn-success d-flex align-items-center"
                        onClick={() => {
                            setFormData({
                                idPaciente: "",
                                idOptometrista: "",
                                NoExamen: "",
                                rx_esfera_od: "",
                                rx_cilindro_od: "",
                                rx_eje_od: "",
                                rx_esfera_oi: "",
                                rx_cilindro_oi: "",
                                rx_eje_oi: "",
                                add_lente: "",
                                ao: "",
                                dnp: "",
                                defRefractivo: "",
                                observaciones: ""
                            });
                            setSelectedExamenVista(null);
                            setShowModal(true);
                        }}
                    >
                        <FaPlus className="me-1" /> Nuevo Examen
                    </button>
                </div>
            </div>

            {/* Filtros desplegables */}
            {showFilters && (
                <div className="card crud-card mb-4">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0 text-primary">
                                <FaFilter className="me-2" /> Filtros Avanzados
                            </h5>
                            <button 
                                className="crud-btn crud-btn-sm crud-cancel"
                                onClick={resetFilters}
                            >
                                <IoMdClose /> Limpiar Filtros
                            </button>
                        </div>
                        
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Búsqueda por texto</label>
                                <div className="crud-search-container">
                                    <FaSearch className="crud-search-icon" />
                                    <input
                                        type="text"
                                        className="form-control crud-search-input ps-4"
                                        name="searchText"
                                        value={filters.searchText}
                                        onChange={handleFilterChange}
                                        placeholder="Buscar paciente u optometrista..."
                                    />
                                </div>
                            </div>
                            
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Defecto Refractivo</label>
                                <select 
                                    className="form-select"
                                    name="defRefractivo"
                                    value={filters.defRefractivo}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Todos los diagnósticos</option>
                                    {defectosRefractivos.map((defecto, index) => (
                                        <option key={index} value={defecto}>{defecto}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Filtrar por fecha</label>
                                <select 
                                    className="form-select mb-2"
                                    name="fechaFiltro"
                                    value={filters.fechaFiltro}
                                    onChange={handleFilterChange}
                                >
                                    <option value="todos">Todos los registros</option>
                                    <option value="hoy">Hoy</option>
                                    <option value="especifica">Fecha específica</option>
                                    <option value="mes">Por mes</option>
                                    <option value="year">Por año</option>
                                </select>
                                
                                {filters.fechaFiltro === "especifica" && (
                                    <input 
                                        type="date" 
                                        className="form-control mt-2"
                                        name="fechaEspecifica"
                                        value={filters.fechaEspecifica}
                                        onChange={handleFilterChange}
                                    />
                                )}
                                
                                {filters.fechaFiltro === "mes" && (
                                    <div className="row g-2 mt-2">
                                        <div className="col-6">
                                            <select 
                                                className="form-select"
                                                name="mes"
                                                value={filters.mes}
                                                onChange={handleFilterChange}
                                            >
                                                <option value="">Seleccione mes</option>
                                                {meses.map(mes => (
                                                    <option key={mes.value} value={mes.value}>{mes.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <select 
                                                className="form-select"
                                                name="year"
                                                value={filters.year}
                                                onChange={handleFilterChange}
                                            >
                                                <option value="">Seleccione año</option>
                                                {years.map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}
                                
                                {filters.fechaFiltro === "year" && (
                                    <select 
                                        className="form-select mt-2"
                                        name="year"
                                        value={filters.year}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Seleccione año</option>
                                        {years.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Resumen de resultados */}
            <div className="row mb-4">
                <div className="col-md-6 d-flex align-items-center">
                    <div className="badge bg-primary bg-opacity-10 text-primary p-2 me-3">
                        <FaFileMedical className="me-1" />
                        {filteredData.length} {filteredData.length === 1 ? 'examen' : 'exámenes'} encontrados
                    </div>
                    
                    {filters.fechaFiltro !== "todos" && (
                        <div className="badge bg-info bg-opacity-10 text-info p-2">
                            <FaCalendarAlt className="me-1" />
                            {filters.fechaFiltro === "hoy" && "Mostrando exámenes de hoy"}
                            {filters.fechaFiltro === "especifica" && filters.fechaEspecifica && `Mostrando exámenes del ${new Date(filters.fechaEspecifica).toLocaleDateString('es-ES')}`}
                            {filters.fechaFiltro === "mes" && filters.mes && `Mostrando exámenes de ${meses.find(m => m.value === filters.mes)?.label} ${filters.year || ''}`}
                            {filters.fechaFiltro === "year" && filters.year && `Mostrando exámenes del año ${filters.year}`}
                        </div>
                    )}
                </div>
                <div className="col-md-6 d-flex align-items-center justify-content-end">
                    {filters.defRefractivo && (
                        <div className="badge bg-warning bg-opacity-10 text-warning p-2 me-2">
                            Diagnóstico: {filters.defRefractivo}
                        </div>
                    )}
                    {filters.searchText && (
                        <div className="badge bg-success bg-opacity-10 text-success p-2">
                            Búsqueda: "{filters.searchText}"
                        </div>
                    )}
                </div>
            </div>

            {/* Listado de exámenes */}
            <div className="card crud-card">
                <div className="card-header crud-card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 text-white">Registros de Exámenes</h5>
                    <small className="text-white-50">
                        {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </small>
                </div>
                
                <div className="table-responsive">
                    <table className="table table-hover crud-table mb-0">
                        <thead>
                            <tr>
                                <th style={{width: '50px'}}></th>
                                <th>Paciente</th>
                                <th>Optometrista</th>
                                <th>Diagnóstico</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((examen) => (
                                    <>
                                        <tr key={examen.idExamenVista} onClick={() => toggleExpandExam(examen.idExamenVista)} style={{cursor: 'pointer'}}>
                                            <td className="text-center">
                                                <IoMdArrowDropdown 
                                                    style={{
                                                        transform: expandedExam === examen.idExamenVista ? 'rotate(180deg)' : 'rotate(0deg)',
                                                        transition: 'transform 0.3s ease'
                                                    }} 
                                                />
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="crud-avatar-optimized bg-primary bg-opacity-10 me-2">
                                                        <FaUser className="text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold">{examen.nombrePaciente}</div>
                                                        <small className="text-muted">ID: #{examen.idExamenVista}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="crud-avatar-optimized bg-info bg-opacity-10 me-2">
                                                        <FaUserMd className="text-info" />
                                                    </div>
                                                    <div className="fw-bold">{examen.nombreOptometrista}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-primary bg-opacity-10 text-primary">
                                                    {examen.defRefractivo}
                                                </span>
                                            </td>
                                            <td>{formatDateString(examen.fechaRegistro)}</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button 
                                                        className="crud-btn crud-btn-primary btn-action-optimized"
                                                        title="Editar"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowEditModal(true);
                                                            setSelectedExamenVista(examen);
                                                            setFormData({
                                                                idPaciente: examen.idPaciente,
                                                                idOptometrista: examen.idOptometrista,
                                                                NoExamen: examen.NoExamen,
                                                                rx_esfera_od: examen.rx_esfera_od,
                                                                rx_cilindro_od: examen.rx_cilindro_od,
                                                                rx_eje_od: examen.rx_eje_od,
                                                                rx_esfera_oi: examen.rx_esfera_oi,
                                                                rx_cilindro_oi: examen.rx_cilindro_oi,
                                                                rx_eje_oi: examen.rx_eje_oi,
                                                                add_lente: examen.add_lente,
                                                                ao: examen.ao,
                                                                dnp: examen.dnp,
                                                                defRefractivo: examen.defRefractivo,
                                                                observaciones: examen.observaciones
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
                                                            setSelectedExamenVista(examen);
                                                        }}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        
                                        {expandedExam === examen.idExamenVista && (
                                            <tr>
                                                <td colSpan="6">
                                                    <div className="p-3 bg-light bg-opacity-10">
                                                        <h6 className="fw-bold mb-3">Detalles completos del examen</h6>
                                                        
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="card mb-3">
                                                                    <div className="card-header bg-primary bg-opacity-10">
                                                                        <h6 className="mb-0 fw-bold">Ojo Derecho (OD)</h6>
                                                                    </div>
                                                                    <div className="card-body">
                                                                        <div className="row">
                                                                            <div className="col-4">
                                                                                <p className="mb-1 small text-muted">Esfera</p>
                                                                                <p className="fw-bold">{examen.rx_esfera_od || '-'}</p>
                                                                            </div>
                                                                            <div className="col-4">
                                                                                <p className="mb-1 small text-muted">Cilindro</p>
                                                                                <p className="fw-bold">{examen.rx_cilindro_od || '-'}</p>
                                                                            </div>
                                                                            <div className="col-4">
                                                                                <p className="mb-1 small text-muted">Eje</p>
                                                                                <p className="fw-bold">{examen.rx_eje_od || '-'}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="col-md-6">
                                                                <div className="card mb-3">
                                                                    <div className="card-header bg-primary bg-opacity-10">
                                                                        <h6 className="mb-0 fw-bold">Ojo Izquierdo (OI)</h6>
                                                                    </div>
                                                                    <div className="card-body">
                                                                        <div className="row">
                                                                            <div className="col-4">
                                                                                <p className="mb-1 small text-muted">Esfera</p>
                                                                                <p className="fw-bold">{examen.rx_esfera_oi || '-'}</p>
                                                                            </div>
                                                                            <div className="col-4">
                                                                                <p className="mb-1 small text-muted">Cilindro</p>
                                                                                <p className="fw-bold">{examen.rx_cilindro_oi || '-'}</p>
                                                                            </div>
                                                                            <div className="col-4">
                                                                                <p className="mb-1 small text-muted">Eje</p>
                                                                                <p className="fw-bold">{examen.rx_eje_oi || '-'}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="col-md-6">
                                                                <div className="card mb-3">
                                                                    <div className="card-header bg-primary bg-opacity-10">
                                                                        <h6 className="mb-0 fw-bold">Datos Adicionales</h6>
                                                                    </div>
                                                                    <div className="card-body">
                                                                        <div className="row">
                                                                            <div className="col-6">
                                                                                <p className="mb-1 small text-muted">Add Lente</p>
                                                                                <p className="fw-bold">{examen.add_lente || '-'}</p>
                                                                            </div>
                                                                            <div className="col-6">
                                                                                <p className="mb-1 small text-muted">AO</p>
                                                                                <p className="fw-bold">{examen.ao || '-'}</p>
                                                                            </div>
                                                                            <div className="col-6">
                                                                                <p className="mb-1 small text-muted">DNP</p>
                                                                                <p className="fw-bold">{examen.dnp || '-'}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="col-md-6">
                                                                <div className="card mb-3">
                                                                    <div className="card-header bg-primary bg-opacity-10">
                                                                        <h6 className="mb-0 fw-bold">Observaciones</h6>
                                                                    </div>
                                                                    <div className="card-body">
                                                                        <p>{examen.observaciones || 'No hay observaciones registradas'}</p>
                                                                    </div>
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
                                    <td colSpan="6" className="text-center py-5">
                                        <div className="text-muted mb-2">
                                            <FaEye className="fs-4" />
                                        </div>
                                        <h5 className="text-muted">No se encontraron exámenes</h5>
                                        <small className="text-muted">
                                            {filters.searchText || filters.defRefractivo || filters.fechaFiltro !== "todos" 
                                                ? "Intenta con otros criterios de búsqueda" 
                                                : "No hay exámenes registrados aún"}
                                        </small>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ExamenVistaCRUD
                formData={{
                    ...formData,
                    setIdPaciente: (value) => setFormData(prev => ({ ...prev, idPaciente: value })),
                    setIdOptometrista: (value) => setFormData(prev => ({ ...prev, idOptometrista: value })),
                    setNoExamen: (value) => setFormData(prev => ({ ...prev, NoExamen: value })),
                    setRx_esfera_od: (value) => setFormData(prev => ({ ...prev, rx_esfera_od: value })),
                    setRx_cilindro_od: (value) => setFormData(prev => ({ ...prev, rx_cilindro_od: value })),
                    setRx_eje_od: (value) => setFormData(prev => ({ ...prev, rx_eje_od: value })),
                    setRx_esfera_oi: (value) => setFormData(prev => ({ ...prev, rx_esfera_oi: value })),
                    setRx_cilindro_oi: (value) => setFormData(prev => ({ ...prev, rx_cilindro_oi: value })),
                    setRx_eje_oi: (value) => setFormData(prev => ({ ...prev, rx_eje_oi: value })),
                    setAdd_lente: (value) => setFormData(prev => ({ ...prev, add_lente: value })),
                    setAo: (value) => setFormData(prev => ({ ...prev, ao: value })),
                    setDnp: (value) => setFormData(prev => ({ ...prev, dnp: value })),
                    setDefRefractivo: (value) => setFormData(prev => ({ ...prev, defRefractivo: value })),
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
                selectedExamenVista={selectedExamenVista}
            />
        </div>
    );
}

export default ExamenVista;