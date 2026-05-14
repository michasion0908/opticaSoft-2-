import '../../assets/css/App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList } from "react-icons/fa";

import { getTratamientosjs, createTratamientosjs, updateTratamientosjs, deleteTratamientosjs } 
from '../../assets/js/Tratamiento.js';

//import { InventarioCRUD } from './InventarioCRUD.jsx';
import { TratamientosCRUD } from './TratamientosCRUD.jsx';

function Tratamientos() {
    const [TratamientosList, setTratamientos] = useState([]);
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    //BUSQUEDA
    const [searchText, setSearchText] = useState("");

    const [selectedTratamientos, setSelectedTratamientos] = useState(null);

    useEffect(() => { getTratamientosjs(setTratamientos); }, []);
    
        const filteredData = TratamientosList.filter(item =>
            (item?.nombre ?? "").toLowerCase().includes(searchText.toLowerCase())
        );
    
        const handleAdd = () => {
            createTratamientosjs(nombre, precio, setShowModal, () => getTratamientosjs(setTratamientos));
        };
    
        const handleUpdate = () => {
            updateTratamientosjs(selectedTratamientos.idTratamiento, nombre, precio, setShowEditModal, () => getTratamientosjs(setTratamientos));
        };
    
        const handleDelete = () => {
            deleteTratamientosjs(selectedTratamientos.idTratamiento, setShowDeleteModal, () =>  getTratamientosjs(setTratamientos));
        };


    return (
        <div className="container-fluid py-4">
            {/* Encabezado */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
                    📦 Gestión de Tratamientos
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
                            setSelectedTratamientos(null);
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
                                <th>Tratamiento</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((Tratamiento) => (
                                    <tr key={Tratamiento.idTratamiento}>
                                        <td>{Tratamiento.nombre}</td>
                                        <td>${Tratamiento.precio}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button 
                                                    className="crud-btn btn-warning text-white btn-sm"
                                                    onClick={() => {
                                                        setShowEditModal(true);
                                                        setSelectedTratamientos(Tratamiento);
                                                        setNombre(Tratamiento.nombre);
                                                        setPrecio(Tratamiento.precio);
                                                    }}
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button 
                                                    className="crud-btn btn-danger btn-sm"
                                                    onClick={() => {
                                                        setShowDeleteModal(true);
                                                        setSelectedTratamientos(Tratamiento);
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

             <TratamientosCRUD
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
                selectedTratamientos={selectedTratamientos}
            /> 
            
        </div>
    );
}

export default Tratamientos;