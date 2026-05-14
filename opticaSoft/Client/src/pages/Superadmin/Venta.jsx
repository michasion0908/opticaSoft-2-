import '../../assets/css/App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaCashRegister } from "react-icons/fa";

import { getVentasjs, createVentasjs, updateVentasjs, deleteVentasjs } 
from '../../assets/js/Venta.js';

import { VentaCRUD } from './VentaCRUD.JSX'; 

function Venta() {
    // Campos de la tabla Venta
    const [VentasList, setVentas] = useState([]);
    const [idCotizacion, setIdCotizacion] = useState("");
    const [estado, setEstado] = useState("PENDIENTE");
    const [metodoPago, setMetodoPago] = useState("EFECTIVO");
    const [referenciaPago, setReferenciaPago] = useState("");
    const [total, setTotal] = useState("");
    const [abono, setAbono] = useState("");

    // Modales
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Búsqueda
    const [searchText, setSearchText] = useState("");

    // Selección de Venta
    const [selectedVenta, setSelectedVenta] = useState(null);

    useEffect(() => { getVentasjs(setVentas); }, []);

    const filteredData = VentasList.filter(item =>
        String(item?.idVenta ?? "").includes(searchText)
    );

    const handleAdd = () => {
        createVentasjs(
            idCotizacion, estado, metodoPago, referenciaPago, total, abono, 
            setShowModal, () => getVentasjs(setVentas)
        );
    };

    const handleUpdate = () => {
        updateVentasjs(
            selectedVenta.idVenta,
            idCotizacion, estado, metodoPago, referenciaPago, total, abono,
            setShowEditModal, () => getVentasjs(setVentas)
        );
    };


     const handleDelete = () => {
        deleteVentasjs(selectedVenta.idVenta, setShowDeleteModal, () => getVentasjs(setVentas));
    };
    

    return (
        <div className="container-fluid py-4">
            {/* Encabezado */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
                    <FaCashRegister className="me-2" style={{ color: 'var(--crud-primary)' }} />
                    Ventas
                </h2>

                <div className="d-flex flex-wrap gap-2">
                    <button className="crud-btn crud-btn-primary text-white">
                        <FaList className="me-1" /> Lista
                    </button>
                    <button 
                        className="crud-btn crud-btn-success text-white"
                        onClick={() => {
                            setIdCotizacion("");
                            setEstado("PENDIENTE");
                            setMetodoPago("EFECTIVO");
                            setReferenciaPago("");
                            setTotal("");
                            setAbono("");
                            setSelectedVenta(null);
                            setShowModal(true);
                        }}
                    >
                        <FaPlus className="me-1" /> Nueva Venta
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
                            placeholder="Buscar por ID de Venta..."
                        />
                    </div>
                </div>
            </div>

            {/* Tabla de ventas */}
            <div className="card crud-card">
                <div className="table-responsive">
                    <table className="table table-hover crud-table mb-0">
                        <thead>
                            <tr>
                                <th>ID Venta</th>
                                <th>ID Cotización</th>
                                <th>Estado</th>
                                <th>Método de Pago</th>
                                <th>Referencia de Pago</th>
                                <th>Total</th>
                                <th>Abonó</th>
                                <th>Debe</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((venta) => (
                                    <tr key={venta.idVenta}>
                                        {/* <td>{venta.idVenta}</td> */}
                                        <td>{venta.idCotizacion} {venta.codigo}</td>
                                        <td>{venta.nombrePaciente}
                                                <br />
                                                <small className="text-muted">{venta.telefono}</small>  
                                                <br />
                                                <small className="text-muted">{venta.direccion}</small>,
                                                <small className="text-muted">{venta.localidad}</small>  
                                        </td>
                                        <td>{venta.estado}</td>
                                        <td>{venta.metodoPago}</td>
                                        <td>{venta.referenciaPago}</td>
                                        <td>${venta.total} <br/>
                                            Cotizacion : ${venta.totalCotizacion} 
                                        </td>
                                        <td>${venta.abono}</td>
                                        <td>${venta.debe}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button 
                                                    className="crud-btn btn-warning text-white btn-sm"
                                                    onClick={() => {
                                                        setShowEditModal(true);
                                                        setSelectedVenta(venta);
                                                        setIdCotizacion(venta.idCotizacion);
                                                        setEstado(venta.estado);
                                                        setMetodoPago(venta.metodoPago);
                                                        setReferenciaPago(venta.referenciaPago);
                                                        setTotal(venta.total);
                                                        setAbono(venta.abono);
                                                    }}
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button 
                                                    className="crud-btn btn-danger btn-sm"
                                                    onClick={() => {
                                                        setShowDeleteModal(true);
                                                        setSelectedVenta(venta);
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
                                    <td colSpan="8" className="text-center py-4 text-muted">
                                        No hay ventas registradas
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <VentaCRUD
                formData={{
                    idCotizacion, setIdCotizacion,
                    estado, setEstado,
                    metodoPago, setMetodoPago,
                    referenciaPago, setReferenciaPago,
                    total, setTotal,
                    abono, setAbono
                }}
                modals={{
                    showModal, setShowModal,
                    showEditModal, setShowEditModal,
                    showDeleteModal, setShowDeleteModal
                }}
                handlers={{
                    handleAdd, handleUpdate, handleDelete
                }}
                selectedVenta={selectedVenta}
            />
        </div>
    );
}

export default Venta;
