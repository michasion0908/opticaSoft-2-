import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import { 
    getExamenesVistajs, 
    createExamenVistajs, 
    updateExamenVistajs, 
    deleteExamenVistajs 
} from '../../../assets/js/ExamenVista.js';
import { getOptometrista } from "../../../api/Optometrista.api.js";

export default function ModalesExamenVista({ 
    showModal, 
    setShowModal,
    showEditModal, 
    setShowEditModal,
    showDeleteModal, 
    setShowDeleteModal,
    selectedExamenVista,
    idPacienteParam,
    setExamenesVista,
    formatDateString
}) {
    // Estados para el formulario de examen
    const [idOptometrista, setIdOptometrista] = useState("");
    const [NoExamen, setNoExamen] = useState("");
    const [rx_esfera_od, setRx_esfera_od] = useState("");
    const [rx_cilindro_od, setRx_cilindro_od] = useState("");
    const [rx_eje_od, setRx_eje_od] = useState("");
    const [rx_esfera_oi, setRx_esfera_oi] = useState("");
    const [rx_cilindro_oi, setRx_cilindro_oi] = useState("");
    const [rx_eje_oi, setRx_eje_oi] = useState("");
    const [add_lente, setAdd_lente] = useState("");
    const [ao, setAo] = useState("");
    const [dnp, setDnp] = useState("");
    const [defRefractivo, setDefRefractivo] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [optometristas, setOptometristas] = useState([]);

    // Cargar optometristas al montar el componente
    useEffect(() => {
        const fetchOptometristas = async () => {
            try {
                const optometristasData = await getOptometrista();
                setOptometristas(optometristasData);
            } catch (error) {
                console.error("Error al cargar optometristas:", error);
            }
        };
        fetchOptometristas();
    }, []);

    // Actualizar estados cuando cambia selectedExamenVista o se abre el modal de edición
    useEffect(() => {
        if (showEditModal && selectedExamenVista) {
            setIdOptometrista(selectedExamenVista.idOptometrista || "");
            setNoExamen(selectedExamenVista.NoExamen || "");
            setRx_esfera_od(selectedExamenVista.rx_esfera_od || "");
            setRx_cilindro_od(selectedExamenVista.rx_cilindro_od || "");
            setRx_eje_od(selectedExamenVista.rx_eje_od || "");
            setRx_esfera_oi(selectedExamenVista.rx_esfera_oi || "");
            setRx_cilindro_oi(selectedExamenVista.rx_cilindro_oi || "");
            setRx_eje_oi(selectedExamenVista.rx_eje_oi || "");
            setAdd_lente(selectedExamenVista.add_lente || "");
            setAo(selectedExamenVista.ao || "");
            setDnp(selectedExamenVista.dnp || "");
            setDefRefractivo(selectedExamenVista.defRefractivo || "");
            setObservaciones(selectedExamenVista.observaciones || "");
        }
    }, [selectedExamenVista, showEditModal]);

    // Limpiar formulario al cerrar modal de creación
    const handleCloseCreateModal = () => {
        setShowModal(false);
        // Resetear todos los campos
        setIdOptometrista("");
        setNoExamen("");
        setRx_esfera_od("");
        setRx_cilindro_od("");
        setRx_eje_od("");
        setRx_esfera_oi("");
        setRx_cilindro_oi("");
        setRx_eje_oi("");
        setAdd_lente("");
        setAo("");
        setDnp("");
        setDefRefractivo("");
        setObservaciones("");
    };

    // Limpiar formulario al cerrar modal de edición
    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    const handleAddExamen = () => {
        createExamenVistajs(
            idPacienteParam,
            idOptometrista,
            NoExamen,
            rx_esfera_od,
            rx_cilindro_od,
            rx_eje_od,
            rx_esfera_oi,
            rx_cilindro_oi,
            rx_eje_oi,
            add_lente,
            ao,
            dnp,
            defRefractivo,
            observaciones, 
            handleCloseCreateModal, 
            () => {
                getExamenesVistajs(data => {
                    const filteredData = data.filter(item => item.idPaciente == idPacienteParam);
                    setExamenesVista(filteredData);
                });
            }
        );
    };

    const handleUpdateExamen = () => {
        updateExamenVistajs(
            selectedExamenVista.idExamenVista,
            idPacienteParam,
            idOptometrista,
            NoExamen,
            rx_esfera_od,
            rx_cilindro_od,
            rx_eje_od,
            rx_esfera_oi,
            rx_cilindro_oi,
            rx_eje_oi,
            add_lente,
            ao,
            dnp,
            defRefractivo,
            observaciones, 
            handleCloseEditModal, 
            () => {
                getExamenesVistajs(data => {
                    const filteredData = data.filter(item => item.idPaciente == idPacienteParam);
                    setExamenesVista(filteredData);
                });
            }
        );
    };

    const handleDeleteExamen = () => {
        deleteExamenVistajs(
            selectedExamenVista.idExamenVista, 
            () => setShowDeleteModal(false), 
            () => {
                getExamenesVistajs(data => {
                    const filteredData = data.filter(item => item.idPaciente == idPacienteParam);
                    setExamenesVista(filteredData);
                });
            }
        );
    };

    return (
        <>
            {/* Modal para agregar nuevo examen */}
            {showModal && (
                <div className="modal fade show crud-modal" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content crud-card">
                            <div className="modal-header crud-card-header">
                                <h5 className="modal-title d-flex align-items-center">
                                    <FaPlus className="me-2" />
                                    Nuevo Examen de Vista
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close btn-close-white" 
                                    onClick={handleCloseCreateModal}
                                ></button>
                            </div>
                            <div className="modal-body crud-card-body">
                                <div className="row g-3">
                                    {/* Primera fila - Datos generales */}
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label crud-label">Optometrista</label>
                                            <select
                                                className="form-select crud-input"
                                                value={idOptometrista}
                                                onChange={(e) => setIdOptometrista(e.target.value)}
                                            >
                                                <option value="">Seleccione un optometrista...</option>
                                                {optometristas.map(optometrista => (
                                                    <option 
                                                        key={optometrista.idOptometrista} 
                                                        value={optometrista.idOptometrista}
                                                    >
                                                        {`${optometrista.nombre} - Cédula: ${optometrista.noCedula}`}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label crud-label">No. Examen</label>
                                            <input 
                                                type="text" 
                                                className="form-control crud-input" 
                                                value={NoExamen}
                                                onChange={(e) => setNoExamen(e.target.value)}
                                                placeholder="Número de examen"
                                            />
                                        </div>
                                    </div>

                                    {/* Sección Ojo Derecho */}
                                    <div className="col-md-6">
                                        <div className="card crud-card mb-3">
                                            <div className="card-header crud-card-header d-flex justify-content-between align-items-center">
                                                <span><FaEye className="me-2" /> Ojo Derecho (OD)</span>
                                            </div>
                                            <div className="card-body">
                                                <div className="row g-2">
                                                    <div className="col-md-4">
                                                        <label className="form-label crud-label">Esfera</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-control crud-input text-center" 
                                                            value={rx_esfera_od}
                                                            onChange={(e) => setRx_esfera_od(e.target.value)}
                                                            placeholder="-2.50"
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label crud-label">Cilindro</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-control crud-input text-center" 
                                                            value={rx_cilindro_od}
                                                            onChange={(e) => setRx_cilindro_od(e.target.value)}
                                                            placeholder="-0.75"
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label crud-label">Eje</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-control crud-input text-center" 
                                                            value={rx_eje_od}
                                                            onChange={(e) => setRx_eje_od(e.target.value)}
                                                            placeholder="180"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sección Ojo Izquierdo */}
                                    <div className="col-md-6">
                                        <div className="card crud-card mb-3">
                                            <div className="card-header crud-card-header d-flex justify-content-between align-items-center">
                                                <span><FaEyeSlash className="me-2" /> Ojo Izquierdo (OI)</span>
                                            </div>
                                            <div className="card-body">
                                                <div className="row g-2">
                                                    <div className="col-md-4">
                                                        <label className="form-label crud-label">Esfera</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-control crud-input text-center" 
                                                            value={rx_esfera_oi}
                                                            onChange={(e) => setRx_esfera_oi(e.target.value)}
                                                            placeholder="-2.50"
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label crud-label">Cilindro</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-control crud-input text-center" 
                                                            value={rx_cilindro_oi}
                                                            onChange={(e) => setRx_cilindro_oi(e.target.value)}
                                                            placeholder="-0.75"
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label crud-label">Eje</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-control crud-input text-center" 
                                                            value={rx_eje_oi}
                                                            onChange={(e) => setRx_eje_oi(e.target.value)}
                                                            placeholder="180"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tercera fila - Datos adicionales */}
                                    <div className="col-md-4">
                                        <label className="form-label crud-label">Add Lente</label>
                                        <input 
                                            type="text" 
                                            className="form-control crud-input" 
                                            value={add_lente}
                                            onChange={(e) => setAdd_lente(e.target.value)}
                                            placeholder="Ej: +1.50"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label crud-label">Agudeza Visual (AO)</label>
                                        <input 
                                            type="text" 
                                            className="form-control crud-input" 
                                            value={ao}
                                            onChange={(e) => setAo(e.target.value)}
                                            placeholder="20/20"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label crud-label">DNP (mm)</label>
                                        <input 
                                            type="text" 
                                            className="form-control crud-input" 
                                            value={dnp}
                                            onChange={(e) => setDnp(e.target.value)}
                                            placeholder="Distancia naso-pupilar"
                                        />
                                    </div>

                                    {/* Cuarta fila - Select y observaciones */}
                                    <div className="col-md-6">
                                        <label className="form-label crud-label">Defecto Refractivo</label>
                                        <select
                                            className="form-select crud-input"
                                            value={defRefractivo}
                                            onChange={(e) => setDefRefractivo(e.target.value)}
                                        >
                                            <option value="">Seleccione defecto...</option>
                                            <option value="Miopía">Miopía</option>
                                            <option value="Hipermetropía">Hipermetropía</option>
                                            <option value="Astigmatismo">Astigmatismo</option>
                                            <option value="Presbicia">Presbicia</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label crud-label">Observaciones</label>
                                        <textarea 
                                            className="form-control crud-input" 
                                            rows="2"
                                            value={observaciones}
                                            onChange={(e) => setObservaciones(e.target.value)}
                                            placeholder="Notas adicionales..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer crud-card-footer">
                                <button 
                                    type="button" 
                                    className="btn crud-btn crud-cancel"
                                    onClick={handleCloseCreateModal}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="button" 
                                    className="btn crud-btn crud-btn-primary"
                                    onClick={handleAddExamen}
                                >
                                    Guardar Examen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Modal para editar examen */}
            {showEditModal && (
                <div className="modal fade show crud-modal" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content crud-card">
                            <div className="modal-header crud-card-header">
                                <h5 className="modal-title d-flex align-items-center">
                                    <FaEdit className="me-2" />
                                    Editar Examen de Vista
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close btn-close-white" 
                                    onClick={handleCloseEditModal}
                                ></button>
                            </div>
                            <div className="modal-body crud-card-body">
                                <div className="row g-3">
                                    {/* Primera fila - Datos generales */}
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label crud-label">Optometrista</label>
                                            <select
                                                className="form-select crud-input"
                                                value={idOptometrista}
                                                onChange={(e) => setIdOptometrista(e.target.value)}
                                            >
                                                <option value="">Seleccione un optometrista...</option>
                                                {optometristas.map(optometrista => (
                                                    <option 
                                                        key={optometrista.idOptometrista} 
                                                        value={optometrista.idOptometrista}
                                                    >
                                                        {`${optometrista.nombre} - Cédula: ${optometrista.noCedula}`}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label crud-label">No. Examen</label>
                                            <input 
                                                type="text" 
                                                className="form-control crud-input" 
                                                value={NoExamen}
                                                onChange={(e) => setNoExamen(e.target.value)}
                                                placeholder="Número de examen"
                                            />
                                        </div>
                                    </div>

                                    {/* Sección Ojo Derecho */}
                                    <div className="col-md-6">
                                        <div className="card crud-card mb-3">
                                            <div className="card-header crud-card-header d-flex justify-content-between align-items-center">
                                                <span><FaEye className="me-2" /> Ojo Derecho (OD)</span>
                                            </div>
                                            <div className="card-body">
                                                <div className="row g-2">
                                                    <div className="col-md-4">
                                                        <label className="form-label crud-label">Esfera</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-control crud-input text-center" 
                                                            value={rx_esfera_od}
                                                            onChange={(e) => setRx_esfera_od(e.target.value)}
                                                            placeholder="-2.50"
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label crud-label">Cilindro</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-control crud-input text-center" 
                                                            value={rx_cilindro_od}
                                                            onChange={(e) => setRx_cilindro_od(e.target.value)}
                                                            placeholder="-0.75"
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label crud-label">Eje</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-control crud-input text-center" 
                                                            value={rx_eje_od}
                                                            onChange={(e) => setRx_eje_od(e.target.value)}
                                                            placeholder="180"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sección Ojo Izquierdo */}
                                    <div className="col-md-6">
                                        <div className="card crud-card mb-3">
                                            <div className="card-header crud-card-header d-flex justify-content-between align-items-center">
                                                <span><FaEyeSlash className="me-2" /> Ojo Izquierdo (OI)</span>
                                            </div>
                                            <div className="card-body">
                                                <div className="row g-2">
                                                    <div className="col-md-4">
                                                        <label className="form-label crud-label">Esfera</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-control crud-input text-center" 
                                                            value={rx_esfera_oi}
                                                            onChange={(e) => setRx_esfera_oi(e.target.value)}
                                                            placeholder="-2.50"
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label crud-label">Cilindro</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-control crud-input text-center" 
                                                            value={rx_cilindro_oi}
                                                            onChange={(e) => setRx_cilindro_oi(e.target.value)}
                                                            placeholder="-0.75"
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label crud-label">Eje</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-control crud-input text-center" 
                                                            value={rx_eje_oi}
                                                            onChange={(e) => setRx_eje_oi(e.target.value)}
                                                            placeholder="180"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tercera fila - Datos adicionales */}
                                    <div className="col-md-4">
                                        <label className="form-label crud-label">Add Lente</label>
                                        <input 
                                            type="text" 
                                            className="form-control crud-input" 
                                            value={add_lente}
                                            onChange={(e) => setAdd_lente(e.target.value)}
                                            placeholder="Ej: +1.50"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label crud-label">Agudeza Visual (AO)</label>
                                        <input 
                                            type="text" 
                                            className="form-control crud-input" 
                                            value={ao}
                                            onChange={(e) => setAo(e.target.value)}
                                            placeholder="20/20"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label crud-label">DNP (mm)</label>
                                        <input 
                                            type="text" 
                                            className="form-control crud-input" 
                                            value={dnp}
                                            onChange={(e) => setDnp(e.target.value)}
                                            placeholder="Distancia naso-pupilar"
                                        />
                                    </div>

                                    {/* Cuarta fila - Select y observaciones */}
                                    <div className="col-md-6">
                                        <label className="form-label crud-label">Defecto Refractivo</label>
                                        <select
                                            className="form-select crud-input"
                                            value={defRefractivo}
                                            onChange={(e) => setDefRefractivo(e.target.value)}
                                        >
                                            <option value="">Seleccione defecto...</option>
                                            <option value="Miopía">Miopía</option>
                                            <option value="Hipermetropía">Hipermetropía</option>
                                            <option value="Astigmatismo">Astigmatismo</option>
                                            <option value="Presbicia">Presbicia</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label crud-label">Observaciones</label>
                                        <textarea 
                                            className="form-control crud-input" 
                                            rows="2"
                                            value={observaciones}
                                            onChange={(e) => setObservaciones(e.target.value)}
                                            placeholder="Notas adicionales..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer crud-card-footer">
                                <button 
                                    type="button" 
                                    className="btn crud-btn crud-cancel"
                                    onClick={handleCloseEditModal}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="button" 
                                    className="btn crud-btn crud-btn-primary"
                                    onClick={handleUpdateExamen}
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Modal para eliminar examen */}
            {showDeleteModal && (
                <div className="modal fade show crud-modal" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content crud-card">
                            <div className="modal-header crud-card-header" style={{backgroundColor: 'var(--crud-danger)'}}>
                                <h5 className="modal-title d-flex align-items-center">
                                    <FaTrash className="me-2" />
                                    Eliminar Examen
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close btn-close-white" 
                                    onClick={() => setShowDeleteModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body crud-card-body">
                                <p>¿Estás seguro que deseas eliminar el examen #{selectedExamenVista?.idExamenVista} del {formatDateString(selectedExamenVista?.fechaRegistro)}?</p>
                                <p className="text-danger fw-bold">Esta acción no se puede deshacer.</p>
                            </div>
                            <div className="modal-footer crud-card-footer">
                                <button 
                                    type="button" 
                                    className="btn crud-btn crud-cancel"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="button" 
                                    className="btn crud-btn crud-btn-danger"
                                    onClick={handleDeleteExamen}
                                >
                                    Confirmar Eliminación
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}