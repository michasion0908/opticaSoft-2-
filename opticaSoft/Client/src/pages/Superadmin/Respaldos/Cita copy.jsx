import '../../assets/css/App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaCalendarAlt } from "react-icons/fa";

import{getCitasJs, createCitaJs, updateCitaJs, deleteCitaJs} 
from '../../../assets/js/Cita.js';

import { CitasCRUD } from '../CitaCRUD.jsx';

function Citas() {
    // Campos de la tabla 
    const [citaList, setCita] = useState([]);
    const [idPaciente, setIdPaciente] = useState("");
    const [idOptometrista, setIdOptometrista] = useState("");
    const [fechaHora, setFechaHora] = useState("");
    const [duracionEstimada, setDuracionEstimada] = useState("");
    const [estado, setEstado] = useState("");
    const [motivo, setMotivo] = useState("");
    const [observaciones, setObservaciones] = useState("");
    
    // Modales
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    //BUSQUEDA
    const [searchText, setSearchText] = useState("");

    // Selección de Material
    const [selectedCita, setSelectedCita] = useState(null);

    useEffect(() => { getCitasJs(setCita); }, []);
    
        const filteredData = citaList.filter(item =>
            (item?.nombrePaciente ?? "").toLowerCase().includes(searchText.toLowerCase())
        );
    
        const handleAdd = () => {
            createCitaJs(idPaciente, idOptometrista, fechaHora, duracionEstimada, estado, motivo, observaciones, setShowModal, () => getCitasJs(setCita));
        };
    
        const handleUpdate = () => {
            updateCitaJs(selectedCita.idCita, idPaciente, idOptometrista, fechaHora, duracionEstimada, estado, motivo, observaciones, setShowEditModal, () => getCitasJs(setCita));
        };
    
        const handleDelete = () => {
            deleteCitaJs(selectedCita.idCita, setShowDeleteModal, () =>  getCitasJs(setCita));
        };

        const formatDateTimeForInput = (dateString) => {
            if (!dateString) return "";
            
            const date = new Date(dateString);
            
            // Obtener día, mes y año
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            
            // Obtener horas y minutos en formato 12h con AM/PM
            let hours = date.getHours();
            const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
            hours = hours % 12;
            hours = hours ? hours : 12; // La hora 0 se convierte en 12
            const minutes = String(date.getMinutes()).padStart(2, '0');
            
            // Formatear como dd/mm/aaaa - HH:mm a.m./p.m.
            return `${day}/${month}/${year} - ${hours}:${minutes} ${ampm}`;
          };

    return (
        <div className="container-fluid py-4">
            {/* Encabezado */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
                <FaCalendarAlt className="me-2" style={{ color: 'var(--crud-primary)' }} />
                    Citas
                </h2>
                
                <div className="d-flex flex-wrap gap-2">
                    <button 
                        className="crud-btn crud-btn-primary text-white"
                    >
                        <FaList className="me-1" /> Lista
                    </button>
                    <button 
                        className="crud-btn crud-btn-success text-white"
                        onClick={() => {
                            setIdPaciente(""); 
                            setIdOptometrista(""); 
                            setFechaHora(""); 
                            setDuracionEstimada(""); 
                            setEstado(""); 
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

            {/* Buscador y Filtro */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="crud-search-container">
                        <FaSearch className="crud-search-icon" />
                        <input
                            type="text"
                            className="form-control crud-search-input ps-4"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Buscar por Nombre..."
                        />
                    </div>
                </div>
            </div>

            {/* Vista de Lista */}
            <div className="card crud-card">
                <div className="table-responsive">
                    <table className="table table-hover crud-table mb-0">
                        <thead>
                            <tr>
                                <th>Paciente</th>
                                <th>Optometrista</th>
                                <th>Fecha y Hora</th>
                                <th>Duracion Estimada</th>
                                <th>Estado</th>
                                <th>Motivo</th>
                                <th>Observaciones</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((Cita) => (
                                    <tr key={Cita.idCita}>
                                        <td>{Cita.nombrePaciente}</td>
                                        <td>{Cita.nombreOptometrista}</td>
                                        <td> {formatDateTimeForInput(Cita.fechaHora)}</td>
                                        <td>{Cita.duracionEstimada}</td>
                                        <td>{Cita.estado}</td>
                                        <td>{Cita.motivo}</td>
                                        <td>{Cita.observaciones}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button 
                                                    className="crud-btn btn-warning text-white btn-sm"
                                                    onClick={() => {
                                                        setShowEditModal(true);
                                                        setSelectedCita(Cita);
                                                        setIdPaciente(Cita.idPaciente);
                                                        setIdOptometrista(Cita.idOptometrista);
                                                        setFechaHora(formatDateTimeForInput(Cita.fechaHora));
                                                        setDuracionEstimada(Cita.duracionEstimada);
                                                        setEstado(Cita.estado);
                                                        setMotivo(Cita.motivo);
                                                        setObservaciones(Cita.observaciones);

                                                    }}
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button 
                                                    className="crud-btn btn-danger btn-sm"
                                                    onClick={() => {
                                                        setShowDeleteModal(true);
                                                        setSelectedCita(Cita);
                                                    }}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-4 text-muted">
                                        No hay productos registrados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

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