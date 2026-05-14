import '../../assets/css/App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaGlasses } from "react-icons/fa";

import{getMaterialjs, createMaterialjs, updateMaterialjs, deleteMaterialjs} 
from '../../assets/js/Material.js';

import { MaterialCRUD } from './MaterialCRUD.jsx';

function Material() {
    // Campos de la tabla 
    const [MaterialList, setMaterial] = useState([]);
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    
    // Modales
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    //BUSQUEDA
    const [searchText, setSearchText] = useState("");

    // Selección de Material
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    useEffect(() => { getMaterialjs(setMaterial); }, []);
    
        const filteredData = MaterialList.filter(item =>
            (item?.nombre ?? "").toLowerCase().includes(searchText.toLowerCase())
        );
    
        const handleAdd = () => {
            createMaterialjs(nombre, precio, setShowModal, () => getMaterialjs(setMaterial));
        };
    
        const handleUpdate = () => {
            updateMaterialjs(selectedMaterial.idMaterial, nombre, precio, setShowEditModal, () => getMaterialjs(setMaterial));
        };
    
        const handleDelete = () => {
            deleteMaterialjs(selectedMaterial.idMaterial, setShowDeleteModal, () =>  getMaterialjs(setMaterial));
        };


    return (
        <div className="container-fluid py-4">
            {/* Encabezado */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
                <FaGlasses className="me-2" style={{ color: 'var(--crud-primary)' }} />
                    Materiales de Lentes
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
                            setNombre(""); 
                            setPrecio("");
                            setSelectedMaterial(null);
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
            </div>

            {/* Vista de Lista */}
            <div className="card crud-card">
                <div className="table-responsive">
                    <table className="table table-hover crud-table mb-0">
                        <thead>
                            <tr>
                                <th>Materiales</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((Material) => (
                                    <tr key={Material.idMaterial}>
                                        <td>{Material.nombre}</td>
                                        <td>${Material.precio}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button 
                                                    className="crud-btn btn-warning text-white btn-sm"
                                                    onClick={() => {
                                                        setShowEditModal(true);
                                                        setSelectedMaterial(Material);
                                                        setNombre(Material.nombre);
                                                        setPrecio(Material.precio);
                                                    }}
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button 
                                                    className="crud-btn btn-danger btn-sm"
                                                    onClick={() => {
                                                        setShowDeleteModal(true);
                                                        setSelectedMaterial(Material);
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

            <MaterialCRUD
              formData={{
                nombre, setNombre,
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
            selectedMaterial={selectedMaterial}
            />
            
        </div>
    );
}

export default Material;