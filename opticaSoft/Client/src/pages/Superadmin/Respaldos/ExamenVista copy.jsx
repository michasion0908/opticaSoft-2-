import '../../assets/css/App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaEye } from "react-icons/fa";

import{getExamenesVistajs, createExamenVistajs, updateExamenVistajs, deleteExamenVistajs} 
from '../../../assets/js/ExamenVista.js';

import { ExamenVistaCRUD } from '../ExamenVistaCRUD.jsx';

function ExamenVista() {
    // Campos de la tabla 
    const [ExamenVistaList, setExamenVista] = useState([]);
    const [idPaciente, setIdPaciente] = useState("");
    const [idOptometrista, setIdOptometrista] = useState("");
    const [NoExamen, setNoExamen] = useState("");
    const [rx_esfera_od, setRx_esfera_od] = useState("");
    const [rx_cilindro_od, setRx_cilindro_od] = useState("");
    const [rx_eje_od, setRx_eje_od] = useState("");
    const [rx_esfera_oi, setRx_esfera_oi] = useState("");
    const [rx_cilindro_oi, setRx_cilindro_oi] = useState("");
    const [rx_eje_oi, setRx_eje_oi] = useState("");
    const [add_lente, setAdd_lente] = useState("");
    const [ao, setAo] = useState("");
    const [dnp, setDnp] = useState("");
    const [defRefractivo, setDefRefractivo] = useState("");
    const [observaciones, setObservaciones] = useState("");

    
    // Modales
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    //BUSQUEDA
    const [searchText, setSearchText] = useState("");

    // Selección
    const [selectedExamenVista, setSelectedExamenVista] = useState(null);

    useEffect(() => { getExamenesVistajs(setExamenVista); }, []);
    
        const filteredData = ExamenVistaList.filter(item =>
            (item?.nombrePaciente ?? "").toLowerCase().includes(searchText.toLowerCase())
        );
    
        const handleAdd = () => {
            createExamenVistajs(
                idPaciente,
                idOptometrista,
                NoExamen,
                rx_esfera_od,
                rx_cilindro_od,
                rx_eje_od,
                rx_esfera_oi,
                rx_cilindro_oi,
                rx_eje_oi,
                add_lente,
                ao,
                dnp,
                defRefractivo,
                observaciones, 
                setShowModal, () => 
                getExamenesVistajs(setExamenVista));
        };
    
        const handleUpdate = () => {
            updateExamenVistajs(
                selectedExamenVista.idExamenVista,
                idPaciente,
                idOptometrista,
                NoExamen,
                rx_esfera_od,
                rx_cilindro_od,
                rx_eje_od,
                rx_esfera_oi,
                rx_cilindro_oi,
                rx_eje_oi,
                add_lente,
                ao,
                dnp,
                defRefractivo,
                observaciones, setShowEditModal, () => 
                getExamenesVistajs(setExamenVista));
        };
    
        const handleDelete = () => {
            deleteExamenVistajs(selectedExamenVista.idExamenVista, setShowDeleteModal, () =>  getExamenesVistajs(setExamenVista));
        };

        const formatDateString = (dateString) => {
            return dateString ? dateString.split('T')[0] : "";
        };

    return (
        <div className="container-fluid py-4">
            {/* Encabezado */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
                <FaEye className="me-2" style={{ color: 'var(--crud-primary)' }} />
                    Exámenes de la vista
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
                            setNoExamen("");
                            setRx_esfera_od("");
                            setRx_cilindro_od("");
                            setRx_eje_od("");
                            setRx_esfera_oi("");
                            setRx_cilindro_oi("");
                            setRx_eje_oi("");
                            setAdd_lente("");
                            setAo("");
                            setDnp("");
                            setDefRefractivo("");
                            setObservaciones("");
                            
                            setSelectedExamenVista(null);
                            setShowModal(true);
                        }}
                    >
                        <FaPlus className="me-1" /> Nuevo Exámen
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
                                <th>No. Examen</th>
                                <th>Paciente</th>
                                <th>Optometrista</th>
                                <th>Rx Esfera OD</th>
                                <th>Rx Cilindro OD</th>
                                <th>Rx Eje OD</th>
                                <th>Rx Esfera OI</th>
                                <th>Rx Cilindro OI</th>
                                <th>Rx Eje OI</th>
                                <th>Add Lente</th>
                                <th>AO</th>
                                <th>DNP</th>
                                <th>Def. Refractivo</th>
                                <th>Observaciones</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((ExamenVista) => (
                                    <tr key={ExamenVista.idExamenVista}>
                                        <td>{ExamenVista.idExamenVista}</td>
                                        <td>{ExamenVista.nombrePaciente}</td>
                                        <td>{ExamenVista.nombreOptometrista}</td>
                                        {/* <td>{ExamenVista.NoExamen}</td> */}
                                        <td>{ExamenVista.rx_esfera_od}</td>
                                        <td>{ExamenVista.rx_cilindro_od}</td>
                                        <td>{ExamenVista.rx_eje_od}</td>
                                        <td>{ExamenVista.rx_esfera_oi}</td>
                                        <td>{ExamenVista.rx_cilindro_oi}</td>
                                        <td>{ExamenVista.rx_eje_oi}</td>
                                        <td>{ExamenVista.add_lente}</td>
                                        <td>{ExamenVista.ao}</td>
                                        <td>{ExamenVista.dnp}</td>
                                        <td>{ExamenVista.defRefractivo}</td>
                                        <td>{ExamenVista.observaciones}</td>
                                        <td> {formatDateString(ExamenVista.fechaRegistro)}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button 
                                                    className="crud-btn btn-warning text-white btn-sm"
                                                    onClick={() => {
                                                        setShowEditModal(true);
                                                        setSelectedExamenVista(ExamenVista);
                                                        setIdPaciente(ExamenVista.idPaciente);
                                                        setIdOptometrista(ExamenVista.idOptometrista);
                                                        setNoExamen(ExamenVista.NoExamen);
                                                        setRx_esfera_od(ExamenVista.rx_esfera_od);
                                                        setRx_cilindro_od(ExamenVista.rx_cilindro_od);
                                                        setRx_eje_od(ExamenVista.rx_eje_od);
                                                        setRx_esfera_oi(ExamenVista.rx_esfera_oi);
                                                        setRx_cilindro_oi(ExamenVista.rx_cilindro_oi);
                                                        setRx_eje_oi(ExamenVista.rx_eje_oi);
                                                        setAdd_lente(ExamenVista.add_lente);
                                                        setAo(ExamenVista.ao);
                                                        setDnp(ExamenVista.dnp);
                                                        setDefRefractivo(ExamenVista.defRefractivo);
                                                        setObservaciones(ExamenVista.observaciones);
                                                    }}
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button 
                                                    className="crud-btn btn-danger btn-sm"
                                                    onClick={() => {
                                                        setShowDeleteModal(true);
                                                        setSelectedExamenVista(ExamenVista);
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
                                    <td colSpan="7" className="text-center py-4 text-muted">
                                        No hay Exámenes registrados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ExamenVistaCRUD
              formData={{
                idPaciente, setIdPaciente,
                idOptometrista, setIdOptometrista,
                NoExamen, setNoExamen,
                rx_esfera_od, setRx_esfera_od,
                rx_cilindro_od, setRx_cilindro_od,
                rx_eje_od, setRx_eje_od,
                rx_esfera_oi, setRx_esfera_oi,
                rx_cilindro_oi, setRx_cilindro_oi,
                rx_eje_oi, setRx_eje_oi,
                add_lente, setAdd_lente,
                ao, setAo,
                dnp, setDnp,
                defRefractivo, setDefRefractivo,
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
            selectedExamenVista={selectedExamenVista}
            />
            
        </div>
    );
}

export default ExamenVista;