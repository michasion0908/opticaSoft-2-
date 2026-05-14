import '../../assets/css/App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaCalendarAlt, FaFilter, FaUser, FaUserMd, FaClock, FaStickyNote } from "react-icons/fa";

import { getCitasJs, createCitaJs, updateCitaJs, deleteCitaJs } 
from '../../assets/js/Cita.js';

import { CitasCRUD } from './CitaCRUD.jsx';

function Citas() {
    // Campos de la tabla 
    const [citaList, setCita] = useState([]);
    const [idPaciente, setIdPaciente] = useState("");
    const [idOptometrista, setIdOptometrista] = useState("");
    const [fechaHora, setFechaHora] = useState("");
    const [duracionEstimada, setDuracionEstimada] = useState("");
    const [estado, setEstado] = useState("PENDIENTE"); // Estado por defecto
    const [motivo, setMotivo] = useState("");
    const [observaciones, setObservaciones] = useState("");
    
    // Modales
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // BUSQUEDA Y FILTROS
    const [searchText, setSearchText] = useState("");
    const [filterEstado, setFilterEstado] = useState("PENDIENTE"); // Filtro por defecto
    const [timeFilter, setTimeFilter] = useState("all"); // 'all', 'day', 'week', 'month', 'next-month'
    const [filterDate, setFilterDate] = useState(new Date());

    // Selección de Cita
    const [selectedCita, setSelectedCita] = useState(null);

    useEffect(() => { getCitasJs(setCita); }, []);
    
    const filteredData = citaList.filter(item => {
        // Filtro por texto de búsqueda
        const matchesSearch = (item?.nombrePaciente ?? "").toLowerCase().includes(searchText.toLowerCase());
        
        // Filtro por estado
        const matchesEstado = filterEstado === "all" || item.estado === filterEstado;
        
        // Filtro por fecha
        let matchesDate = true;
        if (timeFilter !== "all") {
            const citaDate = new Date(item.fechaHora);
            const today = new Date(filterDate);
            
            switch(timeFilter) {
                case 'day':
                    matchesDate = citaDate.getDate() === today.getDate() && 
                                 citaDate.getMonth() === today.getMonth() && 
                                 citaDate.getFullYear() === today.getFullYear();
                    break;
                case 'week': {
                    const weekStart = new Date(today);
                    weekStart.setDate(today.getDate() - today.getDay());
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    
                    matchesDate = citaDate >= weekStart && citaDate <= weekEnd;
                    break;
                }
                case 'month':
                    matchesDate = citaDate.getMonth() === today.getMonth() && 
                                 citaDate.getFullYear() === today.getFullYear();
                    break;
                case 'next-month': {
                    const nextMonth = new Date(today);
                    nextMonth.setMonth(today.getMonth() + 1);
                    matchesDate = citaDate.getMonth() === nextMonth.getMonth() && 
                                 citaDate.getFullYear() === nextMonth.getFullYear();
                    break;
                }
                default:
                    matchesDate = true;
            }
        }
        
        return matchesSearch && matchesEstado && matchesDate;
    });

    const handleAdd = () => {
        // Asegurarse de que el estado sea PENDIENTE al crear
        createCitaJs(
            idPaciente, 
            idOptometrista, 
            fechaHora, 
            duracionEstimada, 
            "PENDIENTE", // Estado forzado a PENDIENTE
            motivo, 
            observaciones, 
            setShowModal, 
            () => getCitasJs(setCita)
        );
    };

    const handleUpdate = () => {
        updateCitaJs(
            selectedCita.idCita, 
            idPaciente, 
            idOptometrista, 
            fechaHora, 
            duracionEstimada, 
            estado, 
            motivo, 
            observaciones, 
            setShowEditModal, 
            () => getCitasJs(setCita)
        );
    };

    const handleDelete = () => {
        deleteCitaJs(selectedCita.idCita, setShowDeleteModal, () => getCitasJs(setCita));
    };

    return (
            <div className="container-fluid py-4">
                {/* Encabezado */}
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="h3 mb-1 text-dark fw-bold">
                            <FaCalendarAlt className="me-2" style={{ color: 'var(--crud-primary)' }} />
                            Gestión de Citas
                        </h2>
                        <p className="text-muted mb-0">Administra las citas de tus pacientes</p>
                    </div>
                    
                    <div className="d-flex flex-wrap gap-2 mt-2 mt-md-0">
                        <button className="crud-btn crud-btn-primary text-white">
                            <FaList className="me-1" /> Vista General
                        </button>
                        <button 
                            className="crud-btn crud-btn-success text-white"
                            onClick={() => {
                                setIdPaciente(""); 
                                setIdOptometrista(""); 
                                setFechaHora(""); 
                                setDuracionEstimada(""); 
                                setEstado("PENDIENTE");
                                setMotivo(""); 
                                setObservaciones(""); 
                                setSelectedCita(null);
                                setShowModal(true);
                            }}
                        >
                            <FaPlus className="me-1" /> Nueva Cita
                        </button>
                    </div>
                </div>
    
                {/* Panel de Filtros */}
                <div className="card crud-card mb-4 border-0 shadow-sm">
                    <div className="card-body p-3">
                        <div className="row g-3 align-items-center">
                            {/* Buscador */}
                            <div className="col-md-5 col-lg-4">
                                <div className="position-relative">
                                    <FaSearch className="crud-search-icon" />
                                    <input
                                        type="text"
                                        className="form-control ps-4 border-0 bg-light"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        placeholder="   Buscar paciente..."
                                    />
                                </div>
                            </div>
                            
                            {/* Filtros */}
                            <div className="col-md-7 col-lg-8">
                                <div className="d-flex flex-wrap gap-2">
                                    {/* Filtro por estado */}
                                    <div className="position-relative flex-grow-1" style={{ minWidth: '180px' }}>
                                        <FaFilter className="crud-search-icon" />
                                        <select 
                                            className="form-select ps-4 border-0 bg-light"
                                            value={filterEstado}
                                            onChange={(e) => setFilterEstado(e.target.value)}
                                        >
                                            <option value="all">Todos los estados</option>
                                            <option value="PENDIENTE">Pendientes</option>
                                            <option value="CONFIRMADA">Confirmadas</option>
                                            <option value="COMPLETADA">Completadas</option>
                                            <option value="CANCELADA">Canceladas</option>
                                        </select>
                                    </div>
                                    
                                    {/* Filtro por tiempo */}
                                    <div className="position-relative flex-grow-1" style={{ minWidth: '160px' }}>
                                        <FaCalendarAlt className="crud-search-icon" />
                                        <select 
                                            className="form-select ps-4 border-0 bg-light"
                                            value={timeFilter}
                                            onChange={(e) => setTimeFilter(e.target.value)}
                                        >
                                            <option value="all">Todas las fechas</option>
                                            <option value="day">Hoy</option>
                                            <option value="week">Esta semana</option>
                                            <option value="month">Este mes</option>
                                            <option value="next-month">Próximo mes</option>
                                        </select>
                                    </div>
                                    
                                    {timeFilter !== 'all' && (
                                        <div className="flex-grow-1" style={{ minWidth: '160px' }}>
                                            <input
                                                type="date"
                                                className="form-control border-0 bg-light"
                                                value={filterDate.toISOString().split('T')[0]}
                                                onChange={(e) => setFilterDate(new Date(e.target.value))}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* Lista de Citas */}
                <div className="row g-4">
                    {filteredData.length > 0 ? (
                        filteredData.map((cita) => (
                            <div key={cita.idCita} className="col-12">
                                <div className="card crud-card border-0 shadow-sm hover-shadow transition-all">
                                    <div className="card-body p-4">
                                        <div className="row align-items-center">
                                            {/* Fecha y Hora - Destacado */}
                                            <div className="col-md-3 mb-3 mb-md-0">
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3 text-center">
                                                        <div className="text-primary fw-bold fs-4">
                                                            {/* Muestra Días */}
                                                            {new Date(cita.fechaHora).getDate()}
                                                        </div>
                                                        <div className="text-muted small text-uppercase">
                                                            {/* Muestra Mes */}
                                                            {new Date(cita.fechaHora).toLocaleString('es-ES', { month: 'short' })}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {/* Muestra Horas y Minutos */}
                                                        <div className="fw-bold text-dark">
                                                            {new Date(cita.fechaHora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                        <div className={`badge mt-1 ${cita.estado === 'PENDIENTE' ? 'bg-warning text-dark' : 
                                                                        cita.estado === 'CONFIRMADA' ? 'bg-primary' :
                                                                        cita.estado === 'COMPLETADA' ? 'bg-success' : 'bg-danger'}`}>
                                                            {cita.estado}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Detalles de la cita */}
                                            <div className="col-md-6">
                                                <div className="d-flex flex-column">
                                                    <div className="d-flex align-items-center mb-2">
                                                        <FaUser className="me-2 text-muted" />
                                                        <span className="fw-bold">{cita.nombrePaciente}</span>
                                                    </div>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <FaUserMd className="me-2 text-muted" />
                                                        <span>{cita.nombreOptometrista}</span>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <FaStickyNote className="me-2 text-muted" />
                                                        <span className="text-truncate">{cita.motivo}</span>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <span className="text-truncate">{cita.observaciones}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Duración y Acciones */}
                                            <div className="col-md-3 text-md-end">
                                                <div className="d-flex flex-column">
                                                    <div className="d-flex align-items-center justify-content-end mb-2">
                                                        <FaClock className="me-2 text-muted" />
                                                        <span>{cita.duracionEstimada} min.</span>
                                                    </div>
                                                    <div className="d-flex gap-2 justify-content-end">
                                                        <button 
                                                            className="crud-btn btn-warning text-white btn-sm"
                                                            onClick={() => {
                                                                setShowEditModal(true);
                                                                setSelectedCita(cita);
                                                                setIdPaciente(cita.idPaciente);
                                                                setIdOptometrista(cita.idOptometrista);
                                                                //setFechaHora(new Date(cita.fechaHora).toISOString().slice(0, 16));
                                                               
                                                                const fecha = new Date(cita.fechaHora);
                                                                setFechaHora(`${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}T${String(fecha.getHours()).padStart(2, '0')}:${String(fecha.getMinutes()).padStart(2, '0')}`);                                                            

                                                                setDuracionEstimada(cita.duracionEstimada);
                                                                setEstado(cita.estado);
                                                                setMotivo(cita.motivo);
                                                                setObservaciones(cita.observaciones);
                                                            }}
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button 
                                                            className="crud-btn btn-danger btn-sm"
                                                            onClick={() => {
                                                                setShowDeleteModal(true);
                                                                setSelectedCita(cita);
                                                            }}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12">
                            <div className="card crud-card border-0 shadow-sm">
                                <div className="card-body text-center py-5">
                                    <FaCalendarAlt className="text-muted mb-3" size={48} />
                                    <h5 className="text-muted">No hay citas programadas</h5>
                                    <p className="text-muted">Utiliza los filtros para buscar o crea una nueva cita</p>
                                    <button 
                                        className="crud-btn crud-btn-success text-white"
                                        onClick={() => setShowModal(true)}
                                    >
                                        <FaPlus className="me-1" /> Crear Cita
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
    
                {/* Modales (se mantienen igual) */}
                <CitasCRUD
                    formData={{
                        idPaciente, setIdPaciente,
                        idOptometrista, setIdOptometrista,
                        fechaHora, setFechaHora,
                        duracionEstimada, setDuracionEstimada,
                        estado, setEstado,
                        motivo, setMotivo,
                        observaciones, setObservaciones,                 
                    }}
                    modals={{
                        showModal, setShowModal,
                        showEditModal, setShowEditModal,
                        showDeleteModal, setShowDeleteModal
                    }}
                    handlers={{
                        handleAdd, handleUpdate, handleDelete
                    }}
                    selectedCita={selectedCita}
                />
            </div>
        );
    }
    
    export default Citas;