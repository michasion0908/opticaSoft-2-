import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaUser, FaNotesMedical, FaSave, FaUserCircle, FaClinicMedical, FaPills, FaProcedures, FaPhone, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
    getHistorialClinicojs, 
    updateHistorialClinicojs, 
} from '../../assets/js/HistorialClinico.js';
import { getPaciente } from "../../api/Paciente.api.js";

import { Link } from 'react-router-dom';


function PacienteHistorial() {
    const [historialClinicoList, setHistorialClinicoList] = useState([]);
    const [pacientesList, setPacientesList] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [pacienteData, setPacienteData] = useState(null);

    const [formData, setFormData] = useState({
        idHistorialClinico: "",
        idPaciente: "",
        antecedentes_salud: "",
        antecedentes_familiares: "",
        medicamentos: "",
        dosis: "",
        cirugias: ""
    });

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const idPacienteParam = params.get("idPaciente");

    useEffect(() => { 
        getHistorialClinicojs(data => {
            setHistorialClinicoList(data);
            const filteredData = data.filter(item => item.idPaciente == idPacienteParam);
            setPacienteData(filteredData.length > 0 ? filteredData[0] : null);
        }); 
        
        getPaciente().then(data => setPacientesList(data)).catch(error => console.error("Error al obtener los Pacientes:", error));
    }, [idPacienteParam]);

    if (!idPacienteParam) {
        return <div className="alert alert-warning text-center mt-4 shadow-sm">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Acceso denegado: Falta seleccionar un trámite.
        </div>;
    }

    const handleEditClick = () => {
        if (!isEditing && pacienteData) {
            setFormData({
                idHistorialClinico: pacienteData.idHistorialClinico,
                idPaciente: pacienteData.idPaciente,
                antecedentes_salud: pacienteData.antecedentes_salud,
                antecedentes_familiares: pacienteData.antecedentes_familiares,
                medicamentos: pacienteData.medicamentos,
                dosis: pacienteData.dosis,
                cirugias: pacienteData.cirugias
            });
        }
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        updateHistorialClinicojs(
            formData.idHistorialClinico, 
            formData.idPaciente,
            formData.antecedentes_salud,
            formData.antecedentes_familiares,
            formData.medicamentos,
            formData.dosis,
            formData.cirugias, 
            () => {}, 
            () => {
                getHistorialClinicojs(data => {
                    setHistorialClinicoList(data);
                    const filteredData = data.filter(item => item.idPaciente == idPacienteParam);
                    setPacienteData(filteredData.length > 0 ? filteredData[0] : null);
                });
                setIsEditing(false);
            }
        );
    };

    const formatDateString = (dateString) => {
        return dateString ? dateString.split('T')[0] : "";
    };

    const renderEditableField = (name, value, isTextArea = false, className = "") => {
        if (isEditing) {
            if (isTextArea) {
                return (
                    <textarea
                        name={name}
                        className={`form-control ${className}`}
                        value={value || ""}
                        onChange={handleChange}
                        style={isTextArea ? { minHeight: '100px' } : {}}
                    />
                );
            }
            return (
                <input
                    type="text"
                    name={name}
                    className={`form-control ${className}`}
                    value={value || ""}
                    onChange={handleChange}
                />
            );
        }
        return <div className={`form-control-plaintext bg-light p-2 ${className}`} style={{
            borderRadius: 'var(--crud-card-radius)',
            minHeight: isTextArea ? '100px' : 'auto',
            border: '1px solid rgba(0,0,0,0.1)'
        }}>
            {value || <span className="text-muted">No especificado</span>}
        </div>;
    };

    if (!pacienteData) {
        return <div className="d-flex justify-content-center mt-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>;
    }

    return (
        <div className="crud-container" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}> {/* Cambio clave aquí */}
            {/* Encabezado */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                      <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
                              <FaUserCircle className="me-2" style={{ color: 'var(--crud-primary)' }} />
                              Historial Clínico
                     </h2>

                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                        <Link to="/pacientes" className="text-decoration-none">Pacientes</Link>
                        </li>
                            <li className="breadcrumb-item active" aria-current="page">{pacienteData.nombrePaciente}</li>
                        </ol>
                    </nav>
                </div>
                <button 
                    className={`crud-btn ${isEditing ? 'crud-btn-success' : 'crud-btn-primary'} d-flex align-items-center`}
                    onClick={isEditing ? handleSave : handleEditClick}
                >
                    {isEditing ? (
                        <>
                            <FaSave className="me-2" /> Guardar Cambios
                        </>
                    ) : (
                        <>
                            <FaEdit className="me-2" /> Editar Historial
                        </>
                    )}
                </button>
            </div>

            {/* Tarjeta de Información del Paciente - Versión compacta */}
            <div className="crud-card mb-4">
                <div className="crud-card-header d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 d-flex align-items-center">
                        <FaUser className="me-2" />
                        Información del Paciente
                    </h4>
                    <span className="badge bg-white text-primary">ID: {pacienteData.idPaciente}</span>
                </div>
                <div className="crud-card-body">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="d-flex align-items-center mb-3">
                                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                                    <FaUser className="text-primary fs-4" />
                                </div>
                                <div>
                                    <h3 className="mb-1" style={{color: 'var(--crud-dark)'}}>{pacienteData.nombrePaciente}</h3>
                                    <div className="d-flex flex-wrap gap-3">
                                        <span className="d-flex align-items-center text-muted">
                                            <FaBriefcase className="me-2" /> {pacienteData.ocupacion}
                                        </span>
                                        <span className="d-flex align-items-center text-muted">
                                            <FaUser className="me-2" /> {pacienteData.sexo}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="ms-5 ps-3">
                                <div className="d-flex mb-2 align-items-center">
                                    <FaPhone className="text-muted me-2" style={{width: '20px'}} />
                                    <span>{pacienteData.telefono || 'No especificado'}</span>
                                </div>
                                <div className="d-flex mb-2 align-items-center">
                                    <FaMapMarkerAlt className="text-muted me-2" style={{width: '20px'}} />
                                    <span>{pacienteData.direccion || 'No especificado'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 d-flex align-items-end flex-column">
                            <div className="mt-auto text-end">
                                <small className="text-muted">Última actualización</small>
                                <p className="mb-0">{formatDateString(pacienteData.fechaRegistro)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección de Antecedentes Médicos - Versión más compacta */}
            <div className="crud-card">
                <div className="crud-card-header">
                    <h4 className="mb-0 d-flex align-items-center">
                        <FaNotesMedical className="me-2" />
                        Antecedentes Médicos
                    </h4>
                </div>
                <div className="crud-card-body">
                    <div className="row g-3">
                        {/* Columna Izquierda */}
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label fw-bold d-flex align-items-center">
                                    <FaClinicMedical className="text-warning me-2" />
                                    Antecedentes de Salud
                                </label>
                                {renderEditableField("antecedentes_salud", isEditing ? formData.antecedentes_salud : pacienteData.antecedentes_salud, true)}
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label fw-bold d-flex align-items-center">
                                    <FaClinicMedical className="text-warning me-2" />
                                    Antecedentes Familiares
                                </label>
                                {renderEditableField("antecedentes_familiares", isEditing ? formData.antecedentes_familiares : pacienteData.antecedentes_familiares, true)}
                            </div>
                        </div>
                        
                        {/* Columna Derecha */}
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label fw-bold d-flex align-items-center">
                                    <FaPills className="text-info me-2" />
                                    Medicamentos
                                </label>
                                {renderEditableField("medicamentos", isEditing ? formData.medicamentos : pacienteData.medicamentos, true)}
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label fw-bold d-flex align-items-center">
                                    <FaPills className="text-info me-2" />
                                    Dosis
                                </label>
                                {renderEditableField("dosis", isEditing ? formData.dosis : pacienteData.dosis, true)}
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label fw-bold d-flex align-items-center">
                                    <FaProcedures className="text-danger me-2" />
                                    Cirugías
                                </label>
                                {renderEditableField("cirugias", isEditing ? formData.cirugias : pacienteData.cirugias, true)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Nota al pie */}
            <div className="text-center text-muted mt-4 small">
                <p>Este historial clínico es confidencial y está protegido por las leyes de privacidad médica.</p>
            </div>
        </div>
    );
}

export default PacienteHistorial;