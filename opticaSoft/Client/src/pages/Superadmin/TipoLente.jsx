import '../../assets/css/App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaGlasses } from "react-icons/fa";

import { getTipoLentejs, createTipoLentejs, updateTipoLentejs, deleteTipoLentejs} 
from '../../assets/js/TipoLente.js';


import { TipoLenteCRUD } from './TipoLenteCRUD.jsx';

function TipoLente() {
    // Campos de la tabla 
    const [TipoLenteList, setTipoLente] = useState([]);
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    
    // Modales
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    //BUSQUEDA
    const [searchText, setSearchText] = useState("");

    // Selección de Tipo Lente
    const [selectedTipoLente, setSelectedTipoLente] = useState(null);


    useEffect(() => { getTipoLentejs(setTipoLente); }, []);
    
        const filteredData = TipoLenteList.filter(item =>
            (item?.nombre ?? "").toLowerCase().includes(searchText.toLowerCase())
        );
    
        const handleAdd = () => {
            createTipoLentejs(nombre, precio, setShowModal, () => getTipoLentejs(setTipoLente));
        };
    
        const handleUpdate = () => {
            updateTipoLentejs(selectedTipoLente.idTipoLente, nombre, precio, setShowEditModal, () => getTipoLentejs(setTipoLente));
        };
    
        const handleDelete = () => {
            deleteTipoLentejs(selectedTipoLente.idTipoLente, setShowDeleteModal, () =>  getTipoLentejs(setTipoLente));
        };


    return (
        <div className="container-fluid py-4">
            {/* Encabezado */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
                <FaGlasses className="me-2" style={{ color: 'var(--crud-primary)' }} />
                    Tipos de lentes 
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
                            setSelectedTipoLente(null);
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
                                <th>Tipo Lente</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((TipoLente) => (
                                    <tr key={TipoLente.idTipoLente}>
                                        <td>{TipoLente.nombre}</td>
                                        <td>${TipoLente.precio}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button 
                                                    className="crud-btn btn-warning text-white btn-sm"
                                                    onClick={() => {
                                                        setShowEditModal(true);
                                                        setSelectedTipoLente(TipoLente);
                                                        setNombre(TipoLente.nombre);
                                                        setPrecio(TipoLente.precio);
                                                    }}
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button 
                                                    className="crud-btn btn-danger btn-sm"
                                                    onClick={() => {
                                                        setShowDeleteModal(true);
                                                        setSelectedTipoLente(TipoLente);
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

            <TipoLenteCRUD
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
            selectedTipoLente={selectedTipoLente}
            />
            
        </div>
    );
}

export default TipoLente;