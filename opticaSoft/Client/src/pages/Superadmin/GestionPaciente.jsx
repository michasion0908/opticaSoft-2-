import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getHistorialClinicojs, updateHistorialClinicojs } from '../../assets/js/HistorialClinico.js';
import { getPaciente } from "../../api/Paciente.api.js";
import { getExamenesVistajs } from '../../assets/js/ExamenVista.js';
import PacienteInfo from './GestionPaciente/PacienteInfo.jsx';
import HistorialClinico from './GestionPaciente/HistorialClinico.jsx';
import ExamenesVista from './GestionPaciente/ExamenesVista.jsx';
import ModalesExamenVista from './GestionPaciente/ModalesExamenVista.jsx';
import { formatDateString } from './GestionPaciente/utils.js';

function PacienteHistorial() {
    const [historialClinicoList, setHistorialClinicoList] = useState([]);
    const [pacientesList, setPacientesList] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [pacienteData, setPacienteData] = useState(null);
    const [activeTab, setActiveTab] = useState('informacion');
    
    // Estados para Exámenes de Vista
    const [examenesVistaList, setExamenesVista] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [selectedExamenVista, setSelectedExamenVista] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        
        if (idPacienteParam) {
            getExamenesVistajs(data => {
                const filteredData = data.filter(item => item.idPaciente == idPacienteParam);
                setExamenesVista(filteredData);
            });
        }
    }, [idPacienteParam]);

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

    if (!idPacienteParam) {
        return (
            <div className="crud-card shadow-lg" style={{ maxWidth: '600px', margin: '2rem auto' }}>
                <div className="crud-card-header text-center">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Acceso denegado
                </div>
                <div className="crud-card-body text-center">
                    <p>No se ha seleccionado un paciente. Por favor, seleccione un paciente para ver su historial clínico.</p>
                    <button className="crud-btn crud-btn-primary mt-3">
                        <i className="bi bi-arrow-left me-2"></i>Volver a la lista
                    </button>
                </div>
            </div>
        );
    }

    if (!pacienteData) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <h4 className="mt-3 text-primary">Cargando historial clínico...</h4>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Encabezado del paciente - Mejorado */}
            <div className="crud-card mb-4 border-0">
                <div className="crud-card-header d-flex justify-content-between align-items-center">
                    <div>
                        <h4 className="mb-0 text-white">
                            <i className="bi bi-file-earmark-medical me-2"></i>
                            Historial
                        </h4>
                    </div>
                    <div className="d-flex">
                        {/* <button className="crud-btn crud-btn-cancel me-2">
                            <i className="bi bi-printer me-2"></i>Imprimir 
                        </button> */}
                        <button 
                            className="crud-btn crud-btn-success"
                            onClick={() => {
                                setSelectedExamenVista(null);
                                setShowModal(true);
                            }}
                        >
                            <i className="bi bi-plus-circle me-2"></i>Nuevo Examen
                        </button>
                    </div>
                </div>
                <div className="crud-card-body">
                    <PacienteInfo pacienteData={pacienteData} formatDateString={formatDateString} />
                   
                    <br />
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                        <Link to="/pacientes" className="text-decoration-none">Pacientes</Link>
                        </li>
                            <li className="breadcrumb-item active" aria-current="page">{pacienteData.nombrePaciente}</li>
                        </ol>
                    </nav>

                </div>
            </div>

            {/* Pestañas de navegación - Mejoradas */}
            <div className="mb-4">
                <ul className="nav nav-tabs crud-tabs">
                    <li className="nav-item">
                        <button 
                            className={`nav-link ${activeTab === 'informacion' ? 'active' : ''}`}
                            onClick={() => setActiveTab('informacion')}
                        >
                            <i className="bi bi-info-circle me-2"></i>
                            Información
                        </button>
                    </li>
                    <li className="nav-item">
                        <button 
                            className={`nav-link ${activeTab === 'historial' ? 'active' : ''}`}
                            onClick={() => setActiveTab('historial')}
                        >
                            <i className="bi bi-clipboard2-pulse me-2"></i>
                            Historial Clínico
                        </button>
                    </li>
                    <li className="nav-item">
                        <button 
                            className={`nav-link ${activeTab === 'examenes' ? 'active' : ''}`}
                            onClick={() => setActiveTab('examenes')}
                        >
                            <i className="bi bi-eye me-2"></i>
                            Exámenes de Vista
                        </button>
                    </li>
                </ul>
            </div>

            {/* Contenido de las pestañas */}
            <div className="tab-content">
                {activeTab === 'informacion' && (
                    <div className="crud-card">
                        <div className="crud-card-body">
                            <PacienteInfo pacienteData={pacienteData} formatDateString={formatDateString} detailed />
                        </div>
                    </div>
                )}

                {activeTab === 'historial' && (
                    <div className="crud-card">
                        <div className="crud-card-body">
                            <HistorialClinico 
                                pacienteData={pacienteData} 
                                isEditing={isEditing} 
                                formData={formData} 
                                handleEditClick={handleEditClick} 
                                handleChange={handleChange} 
                                handleSave={handleSave}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'examenes' && (
                    <div className="crud-card">
                        <div className="crud-card-body">
                            <ExamenesVista 
                                examenesVistaList={examenesVistaList} 
                                searchText={searchText} 
                                setSearchText={setSearchText}
                                setSelectedExamenVista={setSelectedExamenVista}
                                setShowEditModal={setShowEditModal}
                                setShowDeleteModal={setShowDeleteModal}
                                formatDateString={formatDateString}
                            />
                        </div>
                    </div>
                )}
            </div>
            
            <ModalesExamenVista 
                showModal={showModal} 
                setShowModal={setShowModal}
                showEditModal={showEditModal} 
                setShowEditModal={setShowEditModal}
                showDeleteModal={showDeleteModal} 
                setShowDeleteModal={setShowDeleteModal}
                selectedExamenVista={selectedExamenVista}
                idPacienteParam={idPacienteParam}
                setExamenesVista={setExamenesVista}
                formatDateString={formatDateString}
            />
            
            {/* Nota al pie - Mejorada */}
            <div className="crud-card mt-4">
                <div className="crud-card-body text-center text-muted small">
                    <p className="mb-0">
                        <i className="bi bi-shield-lock me-2"></i>
                        Este historial clínico es confidencial y está protegido por las leyes de privacidad médica.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PacienteHistorial;