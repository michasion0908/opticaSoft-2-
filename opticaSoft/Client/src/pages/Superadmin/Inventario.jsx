import '../../assets/css/App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaThLarge, FaList, FaGlasses } from "react-icons/fa";

import { getInventariojs, createInventariojs, updateInventariojs, deleteInventariojs } 
from '../../assets/js/Inventario.js';

import { InventarioCRUD } from './InventarioCRUD.jsx';

function Inventario() {
    const [viewMode, setViewMode] = useState("list"); // "cards" o "list"
    const [InventarioList, setInventario] = useState([]);
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [color, setColor] = useState("");
    const [numeroColor, setNumeroColor] = useState("");
    const [material, setMaterial] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [exhibicion, setExhibicion] = useState("");
    const [precio, setPrecio] = useState("");
    const [fecha, setFecha] = useState("");
    const [estatus, setEstatus] = useState("");
    const [precioVenta, setPrecioVenta] = useState("");
    
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [selectedInventario, setSelectedInventario] = useState(null);
    const [selectedMarca, setSelectedMarca] = useState("");

    useEffect(() => { getInventariojs(setInventario); }, []);

     // Filtrado por marca y modelo
     const filteredData = InventarioList.filter(item =>
        (selectedMarca === "" || item.marca === selectedMarca) && 
        `${item.marca} ${item.modelo}`.toLowerCase().includes(searchText.toLowerCase())
    );

    // Obtener lista de marcas únicas para el filtro
    const uniqueMarcas = [...new Set(InventarioList.map(item => item.marca))];

    const handleAdd = () => {
      createInventariojs(marca, modelo, color, numeroColor, material, cantidad, exhibicion, precio, fecha, estatus, precioVenta, setShowModal, () => getInventariojs(setInventario));
    };

    const handleUpdate = () => {
        updateInventariojs(selectedInventario.idInventario, marca, modelo, color, numeroColor, material, cantidad, exhibicion, precio, fecha, estatus, precioVenta, setShowEditModal, () => getInventariojs(setInventario));
    };

    const handleDelete = () => {
        deleteInventariojs(selectedInventario.idInventario, setShowDeleteModal, () => getInventariojs(setInventario));
    };

    const formatDateString = (dateString) => {
        return dateString ? dateString.split('T')[0] : "";
    };

    return (
        <div className="container-fluid py-4">
            {/* Encabezado */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
                    <FaGlasses className="me-2" style={{ color: 'var(--crud-primary)' }} />
                    Gestión de Inventario
                </h2>
                
                <div className="d-flex flex-wrap gap-2">
                    <button 
                        className={`crud-btn ${viewMode === "cards" ? "crud-btn-primary text-white" : "btn-outline-primary"}`}
                        onClick={() => setViewMode("cards")}
                    >
                        <FaThLarge className="me-1" /> Tarjetas
                    </button>
                    <button 
                        className={`crud-btn ${viewMode === "list" ? "crud-btn-primary text-white" : "btn-outline-primary"}`}
                        onClick={() => setViewMode("list")}
                    >
                        <FaList className="me-1" /> Lista
                    </button>
                    <button 
                        className="crud-btn crud-btn-success text-white"
                        onClick={() => {
                            setMarca(""); setModelo(""); setColor(""); setNumeroColor("");
                            setMaterial(""); setCantidad(""); setExhibicion("");
                            setPrecio(""); setFecha(""); setEstatus(""); setPrecioVenta("");
                            setSelectedInventario(null);
                            setShowModal(true);
                        }}
                    >
                        <FaPlus className="me-1" /> Nuevo Producto
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
                            placeholder="Buscar por Marca o Modelo..."
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="input-group shadow-sm">
                        <span className="input-group-text bg-secondary text-white">
                            <FaFilter />
                        </span>
                        <select 
                            className="form-select"
                            value={selectedMarca}
                            onChange={(e) => setSelectedMarca(e.target.value)}
                        >
                            <option value="">Filtrar por Marca</option>
                            {uniqueMarcas.map((marca, index) => (
                                <option key={index} value={marca}>{marca}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Vista de Tarjetas */}
            {viewMode === "cards" && (
                <div className="row g-4">
                    {filteredData.length > 0 ? (
                        filteredData.map((Inventario) => (
                            <div key={Inventario.idInventario} className="col-xl-3 col-lg-4 col-md-6">
                                <div className="crud-card">
                                    <div className="crud-card-header">
                                        <h5 className="mb-1">{Inventario.marca} {Inventario.modelo}</h5>
                                    </div>
                                    <div className="crud-card-body">
                                        <p className="mb-1"><strong>Color:</strong> {Inventario.color} ({Inventario.numeroColor})</p>
                                        <p className="mb-1"><strong>Material:</strong> {Inventario.material}</p>
                                        <p className="mb-1"><strong>Cantidad:</strong> {Inventario.cantidad}</p>
                                        <p className="mb-1"><strong>Exhibición:</strong> {Inventario.exhibicion}</p>
                                        <p className="mb-1"><strong>Precio:</strong> ${Inventario.precio}</p>
                                        <p className="mb-1"><strong>Fecha:</strong> {formatDateString(Inventario.fecha)}</p>
                                        <p className="mb-1">
                                            <strong>Estatus:</strong> 
                                            <span className={`badge ${Inventario.estatus === "Disponible" ? "bg-success" : "bg-danger"}`}>
                                                {Inventario.estatus}
                                            </span>
                                        </p>
                                        <p className="mb-0"><strong>Precio Venta:</strong> ${Inventario.precioVenta}</p>
                                    </div>
                                    <div className="crud-card-footer d-flex justify-content-center gap-2">
                                        <button 
                                            className="crud-btn btn-warning text-white"
                                            onClick={() => {
                                                setShowEditModal(true);
                                                setSelectedInventario(Inventario);
                                                setMarca(Inventario.marca);
                                                setModelo(Inventario.modelo);
                                                setColor(Inventario.color);
                                                setNumeroColor(Inventario.numeroColor);
                                                setMaterial(Inventario.material);
                                                setCantidad(Inventario.cantidad);
                                                setExhibicion(Inventario.exhibicion);
                                                setPrecio(Inventario.precio);
                                                setFecha(formatDateString(Inventario.fecha));
                                                setEstatus(Inventario.estatus);
                                                setPrecioVenta(Inventario.precioVenta);
                                            }}
                                        >
                                            <FaEdit className="me-1" /> Editar
                                        </button>
                                        <button 
                                            className="crud-btn btn-danger"
                                            onClick={() => {
                                                setShowDeleteModal(true);
                                                setSelectedInventario(Inventario);
                                            }}
                                        >
                                            <FaTrash className="me-1" /> Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12">
                            <div className="alert alert-info text-center">
                                No hay productos registrados
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Vista de Lista */}
            {viewMode === "list" && (
                <div className="card crud-card">
                    <div className="table-responsive">
                        <table className="table table-hover crud-table mb-0">
                            <thead>
                                <tr>
                                    <th>Marca</th>
                                    <th>Modelo</th>
                                    <th>Color</th>
                                    <th>N° Color</th>
                                    <th>Material</th>
                                    <th>Cantidad</th>
                                    <th>Exhibición</th>
                                    <th>Precio</th>
                                    <th>Fecha</th>
                                    <th>Estatus</th>
                                    <th>P. Venta</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((Inventario) => (
                                        <tr key={Inventario.idInventario}>                                       
                                            <td>{Inventario.marca}</td>
                                            <td>{Inventario.modelo}</td>
                                            <td>{Inventario.color}</td>
                                            <td>{Inventario.numeroColor}</td>
                                            <td>{Inventario.material}</td>
                                            <td>{Inventario.cantidad}</td>
                                            <td>{Inventario.exhibicion}</td>
                                            <td>${Inventario.precio}</td>
                                            <td>{formatDateString(Inventario.fecha)}</td>
                                            <td>
                                                <span className={`badge ${Inventario.estatus === "Disponible" ? "bg-success" : "bg-danger"}`}>
                                                    {Inventario.estatus}
                                                </span>
                                            </td>
                                            <td>${Inventario.precioVenta}</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button 
                                                        className="crud-btn btn-warning text-white btn-sm"
                                                        onClick={() => {
                                                            setShowEditModal(true);
                                                            setSelectedInventario(Inventario);
                                                            setMarca(Inventario.marca);
                                                            setModelo(Inventario.modelo);
                                                            setColor(Inventario.color);
                                                            setNumeroColor(Inventario.numeroColor);
                                                            setMaterial(Inventario.material);
                                                            setCantidad(Inventario.cantidad);
                                                            setExhibicion(Inventario.exhibicion);
                                                            setPrecio(Inventario.precio);
                                                            setFecha(formatDateString(Inventario.fecha));
                                                            setEstatus(Inventario.estatus);
                                                            setPrecioVenta(Inventario.precioVenta);
                                                        }}
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button 
                                                        className="crud-btn btn-danger btn-sm"
                                                        onClick={() => {
                                                            setShowDeleteModal(true);
                                                            setSelectedInventario(Inventario);
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
                                        <td colSpan="13" className="text-center py-4 text-muted">
                                            No hay productos registrados
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <InventarioCRUD
                formData={{
                    marca, setMarca,
                    modelo, setModelo,
                    color, setColor, 
                    numeroColor, setNumeroColor, 
                    material, setMaterial, 
                    cantidad, setCantidad, 
                    exhibicion, setExhibicion, 
                    precio, setPrecio, 
                    fecha, setFecha, 
                    estatus, setEstatus, 
                    precioVenta, setPrecioVenta
                }}
                modals={{
                    showModal, setShowModal,
                    showEditModal, setShowEditModal,
                    showDeleteModal, setShowDeleteModal
                }}
                handlers={{
                    handleAdd, handleUpdate, handleDelete
                }}
                selectedInventario={selectedInventario}
            />
        </div>
    );
}

export default Inventario;