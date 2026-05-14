import '../../assets/css/App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter } from "react-icons/fa";

import { getInventariojs, createInventariojs, updateInventariojs, deleteInventariojs } 
from '../../../assets/js/Inventario.js';

import { InventarioCRUD } from '../InventarioCRUD.jsx';

function Inventario() {
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
    const [selectedMarca, setSelectedMarca] = useState(""); // Estado del filtro por marca

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
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold">📦 Inventario</h2>
                <button className="btn btn-success" onClick={() => {
                    setMarca(""); setModelo(""); setColor(""); setNumeroColor("");
                    setMaterial(""); setCantidad(""); setExhibicion("");
                    setPrecio(""); setFecha(""); setEstatus(""); setPrecioVenta("");
                    setSelectedInventario(null);
                    setShowModal(true);
                }}>
                    <FaPlus /> Registrar Producto
                </button>
            </div>

            {/* Buscador y Filtro por Marca */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="input-group shadow-sm">
                        <input
                            type="text"
                            className="form-control"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="🔍 Buscar por Marca o Modelo..."
                        />
                        <span className="input-group-text bg-primary text-white">
                            <FaSearch />
                        </span>
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
                            <option value="">🔽 Filtrar por Marca</option>
                            {uniqueMarcas.map((marca, index) => (
                                <option key={index} value={marca}>{marca}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabla de Inventario */}
            <div className="table-responsive">
                <table className="table table-hover table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Color</th>
                            <th>Número Color</th>
                            <th>Material</th>
                            <th>Cantidad</th>
                            <th>Exhibición</th>
                            <th>Precio</th>
                            <th>Fecha</th>
                            <th>Estatus</th>
                            <th>Precio Venta</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((Inventario) => (
                                <tr key={Inventario.idInventario}>
                                    <td>{Inventario.idInventario}</td>
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
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => {
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
                                        }}>
                                            <FaEdit />
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => {
                                            setShowDeleteModal(true);
                                            setSelectedInventario(Inventario);
                                        }}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="13" className="text-center text-muted">No hay registros para mostrar.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <InventarioCRUD {...{ marca, setMarca, modelo, setModelo, color, setColor, numeroColor, setNumeroColor, material, setMaterial, cantidad, setCantidad, exhibicion, setExhibicion, precio, setPrecio, fecha, setFecha, estatus, setEstatus, precioVenta, setPrecioVenta, showModal, setShowModal, showEditModal, setShowEditModal, showDeleteModal, setShowDeleteModal, handleAdd, handleUpdate, handleDelete, selectedInventario }} />
        </div>
    );
}

export default Inventario;
