import '../../assets/css/App.css'; 
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaClipboardList } from "react-icons/fa";

import { 
    getPedidosTratamientosJs, 
    createPedidoTratamientoJs, 
    updatePedidoTratamientoJs, 
    deletePedidoTratamientoJs 
} from '../../assets/js/PedidosTratamientos.js';

import { PedidosTratamientosCRUD } from './PedidosTratamientosCRUD.jsx'; 

function PedidosTratamientos() {
    // Campos de la tabla 
    const [pedidosTratamientosList, setPedidosTratamientos] = useState([]);
    const [idTratamiento, setIdTratamiento] = useState("");
    const [idPedido, setIdPedido] = useState("");
    
    // Modales
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Búsqueda
    const [searchText, setSearchText] = useState("");

    // Selección de Pedido-Tratamiento
    const [selectedPedidoTratamiento, setSelectedPedidoTratamiento] = useState(null);

    useEffect(() => { getPedidosTratamientosJs(setPedidosTratamientos); }, []);

    const filteredData = pedidosTratamientosList.filter(item =>
        (item?.nombreTratamiento ?? "").toLowerCase().includes(searchText.toLowerCase())
    );

    const handleAdd = () => {
        createPedidoTratamientoJs(idTratamiento, idPedido, setShowModal, () => getPedidosTratamientosJs(setPedidosTratamientos));
    };

    const handleUpdate = () => {
        updatePedidoTratamientoJs(selectedPedidoTratamiento.idPedidos_Tratamiento, idTratamiento, idPedido, setShowEditModal, () => getPedidosTratamientosJs(setPedidosTratamientos));
    };

    const handleDelete = () => {
        deletePedidoTratamientoJs(selectedPedidoTratamiento.idPedidos_Tratamiento, () => getPedidosTratamientosJs(setPedidosTratamientos), setShowDeleteModal);
    };

    return (
        <div className="container-fluid py-4">
            {/* Encabezado */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
                    <FaClipboardList className="me-2" style={{ color: 'var(--crud-primary)' }} />
                    Pedidos - Tratamientos
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
                            setIdTratamiento("");
                            setIdPedido("");
                            setSelectedPedidoTratamiento(null);
                            setShowModal(true);
                        }}
                    >
                        <FaPlus className="me-1" /> Nuevo Pedido-Tratamiento
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
                            placeholder="Buscar por Tratamiento..."
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
                                <th>Tratamiento</th>
                                <th>Pedido</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <tr key={item.idPedidos_Tratamiento}>
                                        <td>{item.nombreTratamiento}</td>
                                        <td>#{item.idPedido} - {item.observaciones}</td>
                                        <td>${item.precioTratamiento}</td>
                                        {/* Acciones */}
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button 
                                                    className="crud-btn btn-warning text-white btn-sm"
                                                    onClick={() => {
                                                        setShowEditModal(true);
                                                        setSelectedPedidoTratamiento(item);
                                                        setIdTratamiento(item.idTratamiento);
                                                        setIdPedido(item.idPedido);
                                                    }}
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button 
                                                    className="crud-btn btn-danger btn-sm"
                                                    onClick={() => {
                                                        setShowDeleteModal(true);
                                                        setSelectedPedidoTratamiento(item);
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
                                        No hay registros encontrados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PedidosTratamientosCRUD
                formData={{
                    idTratamiento, setIdTratamiento,
                    idPedido, setIdPedido
                }}
                modals={{
                    showModal, setShowModal,
                    showEditModal, setShowEditModal,
                    showDeleteModal, setShowDeleteModal
                }}
                handlers={{
                    handleAdd, handleUpdate, handleDelete
                }}
                selectedPedidoTratamiento={selectedPedidoTratamiento}
            />
        </div>
    );
}

export default PedidosTratamientos;
