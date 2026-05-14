import '../../assets/css/App.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaBox, FaInfoCircle } from "react-icons/fa";

import {
    getPaquetesJs,
    createPaqueteJs,
    updatePaqueteJs,
    deletePaqueteJs
} from '../../assets/js/Paquete.js';

import { PaqueteCRUD } from './PaqueteCRUD.jsx';

function Paquetes() {
    const navigate = useNavigate();
    const [paquetesList, setPaquetes] = useState([]);

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [total, setTotal] = useState("");
    const [vigencia, setVigencia] = useState("");
    const [estado, setEstado] = useState("ACTIVO");

    // Modales
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Búsqueda
    const [searchText, setSearchText] = useState("");
    const [selectedPaquete, setSelectedPaquete] = useState(null);

    useEffect(() => { getPaquetesJs(setPaquetes); }, []);

    const filteredData = paquetesList.filter(item =>
        (item?.nombre ?? "").toLowerCase().includes(searchText.toLowerCase())
    );

    const handleAdd = () => {
        createPaqueteJs(nombre, descripcion, total, vigencia, estado, setShowModal, () => getPaquetesJs(setPaquetes));
    };

    const handleUpdate = () => {
        updatePaqueteJs(selectedPaquete.idPaquete, nombre, descripcion, total, vigencia, estado, setShowEditModal, () => getPaquetesJs(setPaquetes));
    };

    const handleDelete = () => {
        deletePaqueteJs(selectedPaquete.idPaquete, () => getPaquetesJs(setPaquetes), setShowDeleteModal);
    };

    const formatDateString = (dateString) => {
        return dateString ? dateString.split('T')[0] : "";
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
                    <FaBox className="me-2" style={{ color: 'var(--crud-primary)' }} />
                    Paquetes
                </h2>

                <div className="d-flex flex-wrap gap-2">
                    <button className="crud-btn crud-btn-primary text-white">
                        <FaList className="me-1" /> Lista
                    </button>
                    <button 
                        className="crud-btn crud-btn-success text-white"
                        onClick={() => {
                            setNombre("");
                            setDescripcion("");
                            setTotal("");
                            setVigencia("");
                            setEstado("ACTIVO");
                            setSelectedPaquete(null);
                            setShowModal(true);
                        }}
                    >
                        <FaPlus className="me-1" /> Nuevo Paquete
                    </button>
                </div>
            </div>

            {/* Buscador */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="crud-search-container">
                        <FaSearch className="crud-search-icon" />
                        <input
                            type="text"
                            className="form-control crud-search-input ps-4"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Buscar por nombre..."
                        />
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="card crud-card">
                <div className="table-responsive">
                    <table className="table table-hover crud-table mb-0">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Total</th>
                                <th>Vigencia</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((paquete) => (
                                    <tr key={paquete.idPaquete}>
                                        <td>{paquete.nombre}</td>
                                        <td>{paquete.descripcion}</td>
                                        <td>${paquete.total}</td>
                                        <td> {formatDateString(paquete.vigencia)}</td>
                                        <td>
                                            {paquete.estado === "INACTIVO" ? (
                                                <span className="badge bg-danger">Inactivo</span>
                                            ) : (
                                                <span className="badge bg-success">Activo</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="crud-btn btn-info text-white btn-sm"
                                                    onClick={() => navigate(`/paqueteDetalle?idPaquete=${paquete.idPaquete}`)}
                                                >
                                                    <FaInfoCircle /> &nbsp;
                                                    Detalles 
                                                </button>
                                                <button
                                                    className="crud-btn btn-warning text-white btn-sm"
                                                    onClick={() => {
                                                        setShowEditModal(true);
                                                        setSelectedPaquete(paquete);
                                                        setNombre(paquete.nombre);
                                                        setDescripcion(paquete.descripcion);
                                                        setTotal(paquete.total);
                                                        setVigencia(formatDateString(paquete.vigencia));
                                                        setEstado(paquete.estado);
                                                    }}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="crud-btn btn-danger btn-sm"
                                                    onClick={() => {
                                                        setShowDeleteModal(true);
                                                        setSelectedPaquete(paquete);
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
                                        No hay paquetes registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CRUD Modal Component */}
            <PaqueteCRUD
                formData={{
                    nombre, setNombre,
                    descripcion, setDescripcion,
                    total, setTotal,
                    vigencia, setVigencia,
                    estado, setEstado,
                }}
                modals={{
                    showModal, setShowModal,
                    showEditModal, setShowEditModal,
                    showDeleteModal, setShowDeleteModal
                }}
                handlers={{
                    handleAdd, handleUpdate, handleDelete
                }}
                selectedPaquete={selectedPaquete}
            />
        </div>
    );
}

export default Paquetes;