import '../../assets/css/App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaGlasses, FaFilter } from "react-icons/fa";

import{getLentesContactojs, createLentesContactojs, updateLentesContactojs, deleteLentesContactojs} 
from '../../assets/js/LentesContacto.js';

import { LentesContactoCRUD } from './LentesContactoCRUD.jsx';

function LentesContacto() {
    // Campos de la tabla 
    const [LentesContactoList, setLentesContacto] = useState([]);
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [duracion, setDuracion] = useState("");
    const [esfera, setEsfera] = useState("");
    const [precio, setPrecio] = useState("");
    
    // Modales
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    //BUSQUEDA
    const [searchText, setSearchText] = useState("");
    const [selectedMarca, setSelectedMarca] = useState("");

    // Selección de Material
    const [selectedLentesContacto, setSelectedLentesContacto] = useState(null);

    useEffect(() => {getLentesContactojs(setLentesContacto); }, []);
    
/*         const filteredData = LentesContactoList.filter(item =>
            (item?.marca ?? "").toLowerCase().includes(searchText.toLowerCase())
        ); */
     

    // Filtrado por marca y modelo
     const filteredData = LentesContactoList.filter(item =>
        (selectedMarca === "" || item.marca === selectedMarca) && 
        `${item.marca} ${item.duracion}`.toLowerCase().includes(searchText.toLowerCase())
    );

    // Obtener lista de marcas únicas para el filtro
    const uniqueMarcas = [...new Set(LentesContactoList.map(item => item.marca))];



    const handleAdd = () => {
        createLentesContactojs(marca, modelo, duracion, esfera, precio, setShowModal, () => getLentesContactojs(setLentesContacto));
    };

    const handleUpdate = () => {
        updateLentesContactojs(selectedLentesContacto.idLentesContacto, marca, modelo, duracion, esfera, precio, setShowEditModal, () => getLentesContactojs(setLentesContacto));
    };

    const handleDelete = () => {
        deleteLentesContactojs(selectedLentesContacto.idLentesContacto, setShowDeleteModal, () => getLentesContactojs(setLentesContacto));
    };

    return (
        <div className="container-fluid py-4">
            {/* Encabezado */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
                <FaGlasses className="me-2" style={{ color: 'var(--crud-primary)' }} />
                    Lentes de Contacto 
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
                            setMarca(""); 
                            setModelo("");
                            setDuracion(""); 
                            setEsfera(""); 
                            setPrecio("");
                            setSelectedLentesContacto(null);
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
                            placeholder="Buscar por Nombre..."
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

            {/* Vista de Lista */}
            <div className="card crud-card">
                <div className="table-responsive">
                    <table className="table table-hover crud-table mb-0">
                        <thead>
                            <tr>
                                <th>Marca</th>
                                <th>Modelo</th>
                                <th>Duración</th>
                                <th>Esfera</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((LentesContacto) => (
                                    <tr key={LentesContacto.idLentesContacto}>
                                        <td>{LentesContacto.marca}</td>
                                        <td>{LentesContacto.modelo}</td>
                                        <td>{LentesContacto.duracion}</td>
                                        <td>{LentesContacto.esfera}</td>
                                        <td>${LentesContacto.precio}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button 
                                                    className="crud-btn btn-warning text-white btn-sm"
                                                    onClick={() => {
                                                        setShowEditModal(true);
                                                        setSelectedLentesContacto(LentesContacto);
                                                        setMarca(LentesContacto.marca);
                                                        setModelo(LentesContacto.modelo);
                                                        setDuracion(LentesContacto.duracion);
                                                        setEsfera(LentesContacto.esfera);
                                                        setPrecio(LentesContacto.precio);
                                                    }}
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button 
                                                    className="crud-btn btn-danger btn-sm"
                                                    onClick={() => {
                                                        setShowDeleteModal(true);
                                                        setSelectedLentesContacto(LentesContacto);
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
                                    <td colSpan="5" className="text-center py-4 text-muted">
                                        No hay productos registrados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <LentesContactoCRUD
              formData={{
                marca, setMarca, 
                modelo, setModelo,
                duracion, setDuracion, 
                esfera, setEsfera,
                precio, setPrecio, 
            }}
            modals={{
                showModal, setShowModal,
                showEditModal, setShowEditModal,
                showDeleteModal, setShowDeleteModal
            }}
            handlers={{
                handleAdd, handleUpdate, handleDelete
            }}
            selectedLentesContacto={selectedLentesContacto}
            />
            
        </div>
    );
}

export default LentesContacto;