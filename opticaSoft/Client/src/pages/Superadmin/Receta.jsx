import '../../assets/css/App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaClipboardList, FaFilter, FaFileMedical, FaCalendarAlt, FaUser, FaEye } from "react-icons/fa";
import { IoMdClose, IoMdArrowDropdown } from "react-icons/io";

import { getRecetasjs, createRecetasjs, updateRecetasjs, deleteRecetasjs } 
from '../../assets/js/Receta.js';
import { RecetasCRUD } from './RecetaCRUD.jsx';

function Receta() {
    // Estado del formulario
    const [formData, setFormData] = useState({
        idExamenVista: "",
        diagnostico: "",
        observaciones: "",
        vigencia: ""
    });

    // Filtros
    const [filters, setFilters] = useState({
        searchText: "",
        fechaFiltro: "todos",
        fechaEspecifica: "",
        mes: "",
        year: "",
        vigenciaFiltro: ""
    });
    const [showFilters, setShowFilters] = useState(false);
    const [expandedReceta, setExpandedReceta] = useState(null);

    // Datos y modales
    const [recetaList, setReceta] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedReceta, setSelectedReceta] = useState(null);

    useEffect(() => { getRecetasjs(setReceta); }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredData = recetaList.filter(item => {
        // Filtro por texto
        const matchesSearch = item?.nombrePaciente?.toLowerCase().includes(filters.searchText.toLowerCase()) || 
                             item?.diagnostico?.toLowerCase().includes(filters.searchText.toLowerCase());
        
        // Filtros por fecha de creación
        let matchesFecha = true;
        const fechaReceta = new Date(item.fechaRegistro);
        
        switch(filters.fechaFiltro) {
            case "hoy":
                const hoy = new Date();
                matchesFecha = fechaReceta.toDateString() === hoy.toDateString();
                break;
            case "especifica":
                if (filters.fechaEspecifica) {
                    const fechaEspecifica = new Date(filters.fechaEspecifica);
                    matchesFecha = fechaReceta.toDateString() === fechaEspecifica.toDateString();
                }
                break;
            case "mes":
                if (filters.mes) {
                    matchesFecha = fechaReceta.getMonth() + 1 === parseInt(filters.mes);
                    if (filters.year) {
                        matchesFecha = matchesFecha && fechaReceta.getFullYear() === parseInt(filters.year);
                    }
                }
                break;
            case "year":
                if (filters.year) {
                    matchesFecha = fechaReceta.getFullYear() === parseInt(filters.year);
                }
                break;
            default:
                matchesFecha = true;
        }
        
        // Filtro por vigencia
        let matchesVigencia = true;
        if (filters.vigenciaFiltro) {
            const hoy = new Date();
            const vigencia = new Date(item.vigencia);
            
            switch(filters.vigenciaFiltro) {
                case "vigentes":
                    matchesVigencia = vigencia >= hoy;
                    break;
                case "vencidas":
                    matchesVigencia = vigencia < hoy;
                    break;
                case "este_mes":
                    const finDeMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
                    matchesVigencia = vigencia >= hoy && vigencia <= finDeMes;
                    break;
                default:
                    matchesVigencia = true;
            }
        }
        
        return matchesSearch && matchesFecha && matchesVigencia;
    });

    const handleAdd = () => {
        createRecetasjs(
            formData.idExamenVista,
            formData.diagnostico,
            formData.observaciones,
            formData.vigencia,
            setShowModal,
            () => getRecetasjs(setReceta)
        );
    };

    const handleUpdate = () => {
        updateRecetasjs(
            selectedReceta.idReceta,
            formData.idExamenVista,
            formData.diagnostico,
            formData.observaciones,
            formData.vigencia,
            setShowEditModal,
            () => getRecetasjs(setReceta)
        );
    };

    const handleDelete = () => {
        deleteRecetasjs(
            selectedReceta.idReceta,
            setShowDeleteModal,
            () => getRecetasjs(setReceta)
        );
    };

    const formatDateString = (dateString, withTime = false) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            ...(withTime && { hour: '2-digit', minute: '2-digit' })
        });
    };

    const resetFilters = () => {
        setFilters({
            searchText: "",
            fechaFiltro: "todos",
            fechaEspecifica: "",
            mes: "",
            year: "",
            vigenciaFiltro: ""
        });
    };

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

    const toggleExpandReceta = (id) => {
        setExpandedReceta(expandedReceta === id ? null : id);
    };

    return (
        <div className="container-fluid py-4">
            {/* Encabezado */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                    <div className="crud-avatar-optimized bg-primary bg-opacity-10 me-3">
                        <FaClipboardList className="text-primary" />
                    </div>
                    <div>
                        <h2 className="h4 mb-0 text-dark fw-bold">Recetas Oftalmológicas</h2>
                        <small className="text-muted">Gestión de prescripciones médicas</small>
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
                                idExamenVista: "",
                                diagnostico: "",
                                observaciones: "",
                                vigencia: ""
                            });
                            setSelectedReceta(null);
                            setShowModal(true);
                        }}
                    >
                        <FaPlus className="me-1" /> Nueva Receta
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
                                        placeholder="Buscar paciente o diagnóstico..."
                                    />
                                </div>
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
                            
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">Estado de vigencia</label>
                                <select 
                                    className="form-select"
                                    name="vigenciaFiltro"
                                    value={filters.vigenciaFiltro}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Todos</option>
                                    <option value="vigentes">Vigentes</option>
                                    <option value="vencidas">Vencidas</option>
                                    <option value="este_mes">Vencen este mes</option>
                                </select>
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
                        {filteredData.length} {filteredData.length === 1 ? 'receta' : 'recetas'} encontradas
                    </div>
                    
                    {filters.fechaFiltro !== "todos" && (
                        <div className="badge bg-info bg-opacity-10 text-info p-2 me-2">
                            <FaCalendarAlt className="me-1" />
                            {filters.fechaFiltro === "hoy" && "Recetas de hoy"}
                            {filters.fechaFiltro === "especifica" && filters.fechaEspecifica && `Recetas del ${new Date(filters.fechaEspecifica).toLocaleDateString('es-ES')}`}
                            {filters.fechaFiltro === "mes" && filters.mes && `Recetas de ${meses.find(m => m.value === filters.mes)?.label} ${filters.year || ''}`}
                            {filters.fechaFiltro === "year" && filters.year && `Recetas del año ${filters.year}`}
                        </div>
                    )}
                    
                    {filters.vigenciaFiltro && (
                        <div className="badge bg-warning bg-opacity-10 text-warning p-2">
                            {filters.vigenciaFiltro === "vigentes" && "Recetas vigentes"}
                            {filters.vigenciaFiltro === "vencidas" && "Recetas vencidas"}
                            {filters.vigenciaFiltro === "este_mes" && "Vencen este mes"}
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

            {/* Listado de recetas */}
            <div className="card crud-card">
                <div className="card-header crud-card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 text-white">Registros de Recetas</h5>
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
                                <th>Diagnóstico</th>
                                <th>Examen Relacionado</th>
                                <th>Vigencia</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((receta) => {
                                    const vigencia = new Date(receta.vigencia);
                                    const hoy = new Date();
                                    const estaVencida = vigencia < hoy;
                                    const venceEsteMes = vigencia >= hoy && vigencia <= new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
                                    
                                    return (
                                        <>
                                            <tr key={receta.idReceta} onClick={() => toggleExpandReceta(receta.idReceta)} style={{cursor: 'pointer'}}>
                                                <td className="text-center">
                                                    <IoMdArrowDropdown 
                                                        style={{
                                                            transform: expandedReceta === receta.idReceta ? 'rotate(180deg)' : 'rotate(0deg)',
                                                            transition: 'transform 0.3s ease'
                                                        }} 
                                                    />
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="crud-avatar-optimized bg-primary bg-opacity-10 me-2">
                                                            <FaUser className="text-primary" />
                                                        </div>
                                                        <div className="fw-bold">{receta.nombrePaciente}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-truncate" style={{maxWidth: '200px'}}>
                                                        {receta.diagnostico}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="crud-avatar-optimized bg-info bg-opacity-10 me-2">
                                                            <FaEye className="text-info" />
                                                        </div>
                                                        <div>
                                                            <div className="small">Examen #{receta.idExamenVista}</div>
                                                            <div className="small text-muted">{receta.defRefractivo}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{formatDateString(receta.vigencia)}</td>
                                                <td>
                                                    {estaVencida ? (
                                                        <span className="badge bg-danger bg-opacity-10 text-danger">Vencida</span>
                                                    ) : venceEsteMes ? (
                                                        <span className="badge bg-warning bg-opacity-10 text-warning">Vence pronto</span>
                                                    ) : (
                                                        <span className="badge bg-success bg-opacity-10 text-success">Vigente</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button 
                                                            className="crud-btn crud-btn-primary btn-action-optimized"
                                                            title="Editar"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setShowEditModal(true);
                                                                setSelectedReceta(receta);
                                                                setFormData({
                                                                    idExamenVista: receta.idExamenVista,
                                                                    diagnostico: receta.diagnostico,
                                                                    observaciones: receta.observaciones,
                                                                    vigencia: receta.vigencia.split('T')[0]
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
                                                                setSelectedReceta(receta);
                                                            }}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            
                                            {expandedReceta === receta.idReceta && (
                                                <tr>
                                                    <td colSpan="7">
                                                        <div className="p-3 bg-light bg-opacity-10">
                                                            <h6 className="fw-bold mb-3">Detalles completos de la receta</h6>
                                                            
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <div className="card mb-3">
                                                                        <div className="card-header bg-primary bg-opacity-10">
                                                                            <h6 className="mb-0 fw-bold">Información del Paciente</h6>
                                                                        </div>
                                                                        <div className="card-body">
                                                                            <div className="row">
                                                                                <div className="col-6">
                                                                                    <p className="mb-1 small text-muted">Paciente</p>
                                                                                    <p className="fw-bold">{receta.nombrePaciente}</p>
                                                                                </div>
                                                                                <div className="col-6">
                                                                                    <p className="mb-1 small text-muted">Examen Relacionado</p>
                                                                                    <p className="fw-bold">#{receta.idExamenVista} - {receta.defRefractivo}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="card mb-3">
                                                                        <div className="card-header bg-primary bg-opacity-10">
                                                                            <h6 className="mb-0 fw-bold">Vigencia</h6>
                                                                        </div>
                                                                        <div className="card-body">
                                                                            <div className="d-flex justify-content-between align-items-center">
                                                                                <div>
                                                                                    <p className="mb-1 small text-muted">Fecha de emisión</p>
                                                                                    <p className="fw-bold">{formatDateString(receta.fechaRegistro, true)}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="mb-1 small text-muted">Válida hasta</p>
                                                                                    <p className="fw-bold">{formatDateString(receta.vigencia)}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="mb-1 small text-muted">Estado</p>
                                                                                    {estaVencida ? (
                                                                                        <span className="badge bg-danger bg-opacity-10 text-danger">Vencida</span>
                                                                                    ) : venceEsteMes ? (
                                                                                        <span className="badge bg-warning bg-opacity-10 text-warning">Vence pronto</span>
                                                                                    ) : (
                                                                                        <span className="badge bg-success bg-opacity-10 text-success">Vigente</span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="col-md-6">
                                                                    <div className="card mb-3">
                                                                        <div className="card-header bg-primary bg-opacity-10">
                                                                            <h6 className="mb-0 fw-bold">Diagnóstico</h6>
                                                                        </div>
                                                                        <div className="card-body">
                                                                            <p className="fw-bold">{receta.diagnostico}</p>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="card">
                                                                        <div className="card-header bg-primary bg-opacity-10">
                                                                            <h6 className="mb-0 fw-bold">Observaciones</h6>
                                                                        </div>
                                                                        <div className="card-body">
                                                                            <p>{receta.observaciones || 'No hay observaciones registradas'}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-5">
                                        <div className="text-muted mb-2">
                                            <FaClipboardList className="fs-4" />
                                        </div>
                                        <h5 className="text-muted">No se encontraron recetas</h5>
                                        <small className="text-muted">
                                            {filters.searchText || filters.fechaFiltro !== "todos" || filters.vigenciaFiltro
                                                ? "Intenta con otros criterios de búsqueda" 
                                                : "No hay recetas registradas aún"}
                                        </small>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <RecetasCRUD
                formData={{
                    ...formData,
                    setIdExamenVista: (value) => setFormData(prev => ({ ...prev, idExamenVista: value })),
                    setDiagnostico: (value) => setFormData(prev => ({ ...prev, diagnostico: value })),
                    setObservaciones: (value) => setFormData(prev => ({ ...prev, observaciones: value })),
                    setVigencia: (value) => setFormData(prev => ({ ...prev, vigencia: value }))
                }}
                modals={{
                    showModal, setShowModal,
                    showEditModal, setShowEditModal,
                    showDeleteModal, setShowDeleteModal
                }}
                handlers={{
                    handleAdd, handleUpdate, handleDelete
                }}
                selectedReceta={selectedReceta}
            />
        </div>
    );
}

export default Receta;