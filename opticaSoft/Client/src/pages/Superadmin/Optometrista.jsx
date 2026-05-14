import '../../assets/css/App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/crud-styles.css'; // Importando los estilos CRUD
import { FaEdit, FaTrash, FaPlus, FaSearch, FaUserMd } from "react-icons/fa";

import { getOptometristajs, createOptometristajs, updateOptometristajs, deleteOptometristajs } 
from '../../assets/js/Optometrista.js';

import { OptometristaCRUD } from './OptometristaCRUD.jsx';

function Optometrista() {
    const [OptometristaList, setOptometrista] = useState([]);
    const [nombre, setNombre] = useState("");
    const [noCedula, setNoCedula] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [selectedOptometrista, setSelectedOptometrista] = useState(null);

    useEffect(() => { getOptometristajs(setOptometrista); }, []);
    const filteredData = OptometristaList.filter(item =>
        (item?.nombre ?? "").toLowerCase().includes(searchText.toLowerCase())
    );

    const handleAdd = () => {
        createOptometristajs(nombre, noCedula, setShowModal, () => getOptometristajs(setOptometrista));
    };

    const handleUpdate = () => {
        updateOptometristajs(selectedOptometrista.idOptometrista, nombre, noCedula, setShowEditModal, () => getOptometristajs(setOptometrista));
    };

    const handleDelete = () => {
        deleteOptometristajs(selectedOptometrista.idOptometrista, setShowDeleteModal, () => getOptometristajs(setOptometrista));
    };

    return (
        <div className="container-fluid py-4">
            {/* Encabezado con botón - Estilo CRUD */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
                     <FaUserMd className="me-2" style={{ color: 'var(--crud-primary)' }} />
                    Gestión de Optometristas
                </h2>
                <button 
                    className="crud-btn crud-btn-success text-white"
                    onClick={() => {
                        setNombre(""); setNoCedula("");
                        setShowModal(true);
                    }}
                >
                    <FaPlus className="me-1" /> Nuevo Optometrista
                </button>
            </div>

            {/* Buscador - Estilo CRUD */}
            <div className="crud-search-container mb-4">
                <FaSearch className="crud-search-icon" /> 
                <input
                    type="text"
                    className="form-control crud-search-input ps-4"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)} 
                    placeholder= "  Buscar por nombre de optometrista..."
                />
            </div>

            {/* Tabla de Optometrista - Estilo CRUD */}
            <div className="card crud-card">
                <div className="table-responsive">
                    <table className="table mb-0 crud-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>No. Cédula</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((Optometrista) => (
                                    <tr key={Optometrista.idOptometrista}>
                                        <td>{Optometrista.idOptometrista}</td>
                                        <td>{Optometrista.nombre}</td>
                                        <td>{Optometrista.noCedula}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button 
                                                    className="crud-btn btn-warning  text-white crud-btn-sm"
                                                    onClick={() => {
                                                        setShowEditModal(true);
                                                        setSelectedOptometrista(Optometrista);
                                                        setNombre(Optometrista.nombre);
                                                        setNoCedula(Optometrista.noCedula);
                                                    }}
                                                >
                                                    <FaEdit className="me-1" /> Editar
                                                </button>
                                                <button 
                                                    className="crud-btn crud-btn-danger crud-btn-sm"
                                                    onClick={() => {
                                                        setShowDeleteModal(true);
                                                        setSelectedOptometrista(Optometrista);
                                                    }}
                                                >
                                                    <FaTrash className="me-1" /> Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-muted">
                                        No hay optometristas registrados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* <OptometristaCRUD
                nombre={nombre} setNombre={setNombre}
                noCedula={noCedula} setNoCedula={setNoCedula}
                
                showModal={showModal} setShowModal={setShowModal}
                showEditModal={showEditModal} setShowEditModal={setShowEditModal}
                showDeleteModal={showDeleteModal} setShowDeleteModal={setShowDeleteModal}

                handleAdd={handleAdd}
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}

                selectedOptometrista={selectedOptometrista}
            /> */}

            <OptometristaCRUD
            formData={{
                    nombre, setNombre, 
                    noCedula, setNoCedula
                    }}

            modals={{
                    showModal, setShowModal,
                    showEditModal, setShowEditModal,
                    showDeleteModal, setShowDeleteModal
                    }}
                
            handlers={{
                    handleAdd, handleUpdate, handleDelete
                     }}

            selectedOptometrista={selectedOptometrista}
            
            />

        </div>
    );
}

export default Optometrista;