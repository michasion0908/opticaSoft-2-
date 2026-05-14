import '../../assets/css/App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/crud-styles.css'; // Nuevos estilos CRUD
import { FaUserCircle, FaThLarge, FaList, FaEdit, FaTrash, FaPlus, FaSearch,  FaMapMarkerAlt, FaPhone, FaUserTag, FaVenusMars, FaCalendarAlt, FaNotesMedical, FaIdCard } from "react-icons/fa";
//import { FaUserCircle, FaThLarge, FaList, FaEdit, FaTrash, FaPlus, FaSearch, FaMapMarkerAlt, FaCalendarAlt,FaIdCard } from "react-icons/fa";

import { useNavigate } from 'react-router-dom';

import { getPacientejs, createPacientejs, updatePacientejs, deletePacientejs } 
from '../../assets/js/Paciente.js';

import { PacienteCRUD } from './PacienteCRUD.jsx';

function Paciente() {
  const [viewMode, setViewMode] = useState("cards"); // "cards" o "list"
  const [pacienteList, setPaciente] = useState([]);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [edad, setEdad] = useState("");
  const [sexo, setSexo] = useState("");
  const [ocupacion, setOcupacion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [estado, setEstado] = useState("");
  const [telefono, setTelefono] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedPaciente, setSelectedPaciente] = useState(null);

  const navigate = useNavigate(); // Inicializa navigate

  useEffect(() => { getPacientejs(setPaciente); }, []);

  const filteredData = pacienteList.filter(item =>
    `${item.nombre} ${item.apellido}`.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAdd = () => {
    createPacientejs(nombre, apellido, edad, sexo, ocupacion, direccion, localidad, estado, telefono, observaciones, setShowModal, () => getPacientejs(setPaciente));
  };

  const handleUpdate = () => {
    updatePacientejs(selectedPaciente.idPaciente, nombre, apellido, edad, sexo, ocupacion, direccion, localidad, estado, telefono, observaciones, setShowEditModal, () => getPacientejs(setPaciente));
  };

  const handleDelete = () => {
    deletePacientejs(selectedPaciente.idPaciente, setShowDeleteModal, () => getPacientejs(setPaciente));
  };

  return (
    <div className="container-fluid py-4">
      {/* Encabezado */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
          <FaUserCircle className="me-2" style={{ color: 'var(--crud-primary)' }} />
          Gestión de Pacientes
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
              setNombre(""); setApellido(""); setEdad(""); setSexo("");
              setOcupacion(""); setDireccion(""); setLocalidad("");
              setEstado(""); setTelefono(""); setObservaciones("");
              setSelectedPaciente(null);
              setShowModal(true);
            }}
          >
            <FaPlus className="me-1" /> Nuevo Paciente
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="crud-search-container mb-4">
        <FaSearch className="crud-search-icon" />
        <input
          type="text"
          className="form-control crud-search-input ps-4"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder= "Buscar por nombre o apellido..."
        />
      </div>

      {/* Vista de Tarjetas */}
      {viewMode === "cards" && (
        <div className="row g-4 justify-content-center">
          {filteredData.length > 0 ? (
            filteredData.map((paciente) => (
              <div key={paciente.idPaciente} className="col-xl-3 col-lg-4 col-md-6 d-flex">
                <div className="crud-card card-optimized w-100">
                  {/* Header */}
                  <div className="crud-card-header d-flex align-items-center p-3">
                    <div className="crud-avatar-optimized me-3">
                      <FaUserCircle size={22} className="text-white" />
                    </div>
                    <div className="d-flex flex-column flex-grow-1">
                      <h6 className="mb-0 text-white text-truncate fw-semibold">{paciente.nombre} {paciente.apellido}</h6>
                      <div className="d-flex justify-content-between align-items-center mt-1">
                        <span className="badge bg-white text-primary px-2 py-1 small">{paciente.edad} años</span>
                        <span className="text-white-50 small">
                          <FaVenusMars className="me-1" /> {paciente.sexo}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="crud-card-body p-3">
                    <div className="optimized-info-grid">
                      <div className="info-row-optimized">
                        <FaUserTag className="info-icon-optimized text-primary" />
                        <span className="info-text-optimized">{paciente.ocupacion}</span>
                      </div>
                      
                      <div className="info-row-optimized">
                        <FaMapMarkerAlt className="info-icon-optimized text-primary" />
                        <span className="info-text-optimized text-truncate">
                          {paciente.localidad}, {paciente.estado}
                        </span>
                      </div>
                      
                      <div className="info-row-optimized">
                        <FaPhone className="info-icon-optimized text-primary" />
                        <span className="info-text-optimized">{paciente.telefono}</span>
                      </div>

                      {paciente.observaciones && (
                        <div className="info-row-optimized mt-2 pt-2 border-top">
                          <FaNotesMedical className="info-icon-optimized text-primary" />
                          <span className="info-text-optimized small text-truncate-2" title={paciente.observaciones}>
                            {paciente.observaciones}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="crud-card-footer d-flex justify-content-between align-items-center p-3">
                    <small className="text-muted">
                      <FaCalendarAlt className="me-1" />
                      {new Date(paciente.fechaRegistro).toLocaleDateString('es-ES', {day: '2-digit', month: 'short'})}
                    </small>
                    <div className="d-flex gap-2">
                      <button 
                        className="crud-btn btn-warning text-white btn-action-optimized"
                        onClick={() => {
                          setShowEditModal(true);
                          setSelectedPaciente(paciente);
                          setNombre(paciente.nombre);
                          setApellido(paciente.apellido);
                          setEdad(paciente.edad);
                          setSexo(paciente.sexo);
                          setOcupacion(paciente.ocupacion);
                          setDireccion(paciente.direccion);
                          setLocalidad(paciente.localidad);
                          setEstado(paciente.estado);
                          setTelefono(paciente.telefono);
                          setObservaciones(paciente.observaciones);
                        }}
                        title="Editar"
                      >
                        <FaEdit size={13} />
                      </button>
                      <button 
                        className="crud-btn crud-btn-danger btn-action-optimized"
                        onClick={() => {
                          setShowDeleteModal(true);
                          setSelectedPaciente(paciente);
                        }}
                        title="Eliminar"
                      >
                        <FaTrash size={13} />
                      </button>
                {/*       <button
                        className="crud-btn crud-btn-info btn-action-optimized"
                        onClick={() => navigate(`/PacienteHistorial?idPaciente=${paciente.idPaciente}`)}
                        title="Historial"
                      >
                        <FaIdCard size={13} />
                      </button> */}

                      <button
                        className="crud-btn crud-btn-info btn-action-optimized"
                        onClick={() => navigate(`/gestionPacientes?idPaciente=${paciente.idPaciente}`)}
                        title="Historial"
                      >
                        <FaIdCard size={13} />
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info text-center py-3">
                No hay pacientes registrados
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
                  <th>Nombre</th>
                  <th>Edad</th>
                  <th>Sexo</th>
                  <th>Ocupación</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((paciente) => (
                    <tr key={paciente.idPaciente}>
                      <td>
                        <strong>{paciente.nombre} {paciente.apellido}</strong><br />
                        <small className="text-muted">{paciente.direccion}, {paciente.localidad}</small>
                      </td>
                      <td>{paciente.edad} años</td>
                      <td>{paciente.sexo}</td>
                      <td>{paciente.ocupacion}</td>
                      <td>{paciente.telefono}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="crud-btn btn-warning text-white btn-sm"
                            onClick={() => {
                              setShowEditModal(true);
                              setSelectedPaciente(paciente);
                              setNombre(paciente.nombre);
                              setApellido(paciente.apellido);
                              setEdad(paciente.edad);
                              setSexo(paciente.sexo);
                              setOcupacion(paciente.ocupacion);
                              setDireccion(paciente.direccion);
                              setLocalidad(paciente.localidad);
                              setEstado(paciente.estado);
                              setTelefono(paciente.telefono);
                              setObservaciones(paciente.observaciones);
                            }}
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="crud-btn btn-danger btn-sm"
                            onClick={() => {
                              setShowDeleteModal(true);
                              setSelectedPaciente(paciente);
                            }}
                          >
                            <FaTrash />
                          </button>
                          <button
                            className="crud-btn btn-info text-white btn-sm"
                            onClick={() => navigate(`/gestionPacientes?idPaciente=${paciente.idPaciente}`)}
                          >
                            📝
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No hay pacientes registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de CRUD (mantener igual) 
      <PacienteCRUD
        nombre={nombre} setNombre={setNombre}
        apellido={apellido} setApellido={setApellido}
        edad={edad} setEdad={setEdad}
        sexo={sexo} setSexo={setSexo}
        ocupacion={ocupacion} setOcupacion={setOcupacion}
        direccion={direccion} setDireccion={setDireccion}
        localidad={localidad} setLocalidad={setLocalidad}
        estado={estado} setEstado={setEstado}
        telefono={telefono} setTelefono={setTelefono}
        observaciones={observaciones} setObservaciones={setObservaciones}
        showModal={showModal} setShowModal={setShowModal}
        showEditModal={showEditModal} setShowEditModal={setShowEditModal}
        showDeleteModal={showDeleteModal} setShowDeleteModal={setShowDeleteModal}
        handleAdd={handleAdd}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
        selectedPaciente={selectedPaciente}
      /> */}

      <PacienteCRUD 
      
      formData={{
        nombre, setNombre,
        apellido, setApellido,
        edad, setEdad,
        sexo, setSexo,
        ocupacion, setOcupacion,
        direccion, setDireccion,
        localidad, setLocalidad,
        estado, setEstado,
        telefono, setTelefono,
        observaciones, setObservaciones
    }}
    modals={{
        showModal, setShowModal,
        showEditModal, setShowEditModal,
        showDeleteModal, setShowDeleteModal
    }}
    handlers={{
        handleAdd, handleUpdate, handleDelete
    }}
    selectedPaciente={selectedPaciente}

      />

    </div>
  );
}

export default Paciente;