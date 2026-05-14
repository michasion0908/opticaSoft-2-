import '../../assets/css/App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaClipboardList } from "react-icons/fa";

import{getRecetasjs, createRecetasjs, updateRecetasjs, deleteRecetasjs} 
from '../../../assets/js/Receta.js';

import { RecetasCRUD } from '../RecetaCRUD.jsx';

function Receta() {
    // Campos de la tabla 
    const [recetaList, setReceta] = useState([]);
    const [idExamenVista, setIdExamenVista] = useState("");
    const [diagnostico, setDiagnostico] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [vigencia, setVigencia] = useState("");
    
    // Modales
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    //BUSQUEDA
    const [searchText, setSearchText] = useState("");

    // Selección 
    const [selectedReceta, setSelectedReceta] = useState(null);
    

    useEffect(() => { getRecetasjs(setReceta); }, []);
    
        const filteredData = recetaList.filter(item =>
            (item?.nombrePaciente ?? "").toLowerCase().includes(searchText.toLowerCase())
        );
    
        const handleAdd = () => {
            createRecetasjs(idExamenVista, diagnostico, observaciones, vigencia, setShowModal, () => getRecetasjs(setReceta));
        };
    
        const handleUpdate = () => {
            updateRecetasjs(selectedReceta.idReceta, idExamenVista, diagnostico, observaciones, vigencia, setShowEditModal, () => getRecetasjs(setReceta));
        };
    
        const handleDelete = () => {
            deleteRecetasjs(selectedReceta.idReceta, setShowDeleteModal, () =>  getRecetasjs(setReceta));
        };

        const formatDateString = (dateString) => {
            return dateString ? dateString.split('T')[0] : "";
        };

    return (
        <div className="container-fluid py-4">
            {/* Encabezado */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
                <FaClipboardList className="me-2" style={{ color: 'var(--crud-primary)' }} />
                    Recetas
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
                            setIdExamenVista("");
                            setDiagnostico("");
                            setObservaciones("");
                            setVigencia("");                            
                            setSelectedReceta(null);
                            setShowModal(true);
                        }}
                    >
                        <FaPlus className="me-1" /> Nueva Receta
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
                            <th>Paciente</th>   
                            <th>Examen de Vista</th>
                            <th>Diagnóstico</th>
                            <th>Observaciones</th>
                            <th>Vigencia</th>
                            <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((Receta) => (
                                    <tr key={Receta.idReceta}>
                                        <td>{Receta.nombrePaciente}</td>
                                       <td>{Receta.idExamenVista} {Receta.defRefractivo}</td>
                                        <td>{Receta.diagnostico}</td>
                                        <td>{Receta.observaciones}</td>
                                        <td> {formatDateString(Receta.vigencia)}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button 
                                                    className="crud-btn btn-warning text-white btn-sm"
                                                    onClick={() => {
                                                        setShowEditModal(true);
                                                        setSelectedReceta(Receta);
                                                        setIdExamenVista(Receta.idExamenVista);
                                                        setDiagnostico(Receta.diagnostico);
                                                        setObservaciones(Receta.observaciones);
                                                        setVigencia(formatDateString(Receta.vigencia));
                                                    }}
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button 
                                                    className="crud-btn btn-danger btn-sm"
                                                    onClick={() => {
                                                        setShowDeleteModal(true);
                                                        setSelectedReceta(Receta);
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
                                    <td colSpan="6" className="text-center py-4 text-muted">
                                        No hay productos registrados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <RecetasCRUD
              formData={{
                idExamenVista, setIdExamenVista, 
                diagnostico, setDiagnostico,
                observaciones, setObservaciones,
                vigencia, setVigencia,
            }}
            modals={{
                showModal, setShowModal,
                showEditModal, setShowEditModal,
                showDeleteModal, setShowDeleteModal
            }}
            handlers={{
                handleAdd, handleUpdate, handleDelete
            }}
            selectedReceta={selectedReceta}
            />
            
        </div>
    );
}

export default Receta;