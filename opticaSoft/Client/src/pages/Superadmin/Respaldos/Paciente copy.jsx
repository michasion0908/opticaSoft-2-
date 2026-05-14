import '../../assets/css/App.css'; // No se mueve
import { useState, useEffect } from 'react'; // No se mueve
import 'bootstrap/dist/css/bootstrap.min.css'; // No se mueve
import { FaUserCircle, FaThLarge, FaList, FaEdit, FaTrash, FaPlus } from "react-icons/fa"; // Iconos
import { useNavigate } from 'react-router-dom'; // Nuevo import para navegación

import { getPacientejs, createPacientejs, updatePacientejs, deletePacientejs } 
from '../../../assets/js/Paciente.js';

import { PacienteCRUD } from '../PacienteCRUD.jsx';

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
    <div className="container mt-4">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">
          <span className="text-primary">👥</span> Gestión de Pacientes
        </h2>
        
        <div>
          {/* Botón para cambiar vista */}
          <button 
            className={`btn ${viewMode === "cards" ? "btn-primary" : "btn-outline-primary"} me-2`} 
            onClick={() => setViewMode("cards")}
          >
            <FaThLarge /> Tarjetas
          </button>
          <button 
            className={`btn ${viewMode === "list" ? "btn-primary" : "btn-outline-primary"}`} 
            onClick={() => setViewMode("list")}
          >
            <FaList /> Lista
          </button>
          <button 
            className="btn btn-success ms-3"
            onClick={() => {
          setNombre(""); setApellido(""); setEdad(""); setSexo("");
          setOcupacion(""); setDireccion(""); setLocalidad("");
          setEstado(""); setTelefono(""); setObservaciones("");
          setSelectedPaciente(null);
          setShowModal(true);
            }}
          >
            <FaPlus /> Registrar Paciente
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control shadow-sm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="🔍 Buscar por Nombre o Apellido..."
        />
        <span className="input-group-text bg-primary text-white">
          <FaUserCircle />
        </span>
      </div>

      {/* Vista de Tarjetas */}
      {viewMode === "cards" && (
        <div className="row">
          {filteredData.length > 0 ? (
            filteredData.map((paciente) => (
              <div key={paciente.idPaciente} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div className="card h-100 shadow-sm border-0 rounded">
                  <div className="card-header bg-dark text-white text-center py-3">
                    <FaUserCircle size={50} className="mb-2" />
                    <h5 className="card-title mb-0">{paciente.nombre} {paciente.apellido}</h5>
                  </div>
                  <div className="card-body">
                  <p className="mb-2"><strong>Edad:</strong> {paciente.edad} años</p>
                  <p className="mb-2"><strong>Sexo:</strong> {paciente.sexo}</p>
                  <p className="mb-2"><strong>Ocupación:</strong> {paciente.ocupacion}</p>
                  <p className="mb-2"><strong>Dirección:</strong> {paciente.direccion}, {paciente.localidad}, {paciente.estado}</p>
                  <p className="mb-2"><strong>Teléfono:</strong> {paciente.telefono}</p>
                  <p className="mb-0"><strong>Obs.:</strong> {paciente.observaciones}</p>
                  </div>
                  <div className="card-footer bg-light d-flex justify-content-between">
                    <button className="btn btn-warning btn-sm" onClick={() => {
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
                    }}>
                      <FaEdit /> Editar
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => {
                       setShowDeleteModal(true);
                       setSelectedPaciente(paciente);
                    }}>
                      <FaTrash /> Eliminar
                    </button>

     {/*  ------------------------ BOTÓN HISTORIAL ---------------- */}
                    <button
                         className="btn btn-info btn-sm"
                        onClick={() => navigate(`/PacienteHistorial?idPaciente=${paciente.idPaciente}`)}
                        >
                        📝 Historial
                      </button>

                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center w-100 text-muted">No hay registros para mostrar.</p>
          )}
        </div>
      )}

      {/* -------------------------- Vista de Lista --------------------------------------- */}
      {viewMode === "list" && (
        <div className="table-responsive">
          <table className="table table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Edad</th>
                <th>Sexo</th>
                <th>Ocupación</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((paciente) => (
                  <tr key={paciente.idPaciente}>
                    <td>{paciente.nombre} {paciente.apellido}</td>
                    <td>{paciente.edad} años</td>
                    <td>{paciente.sexo}</td>
                    <td>{paciente.ocupacion}</td>
                    <td>{paciente.direccion}, {paciente.localidad}, {paciente.estado}</td>
                    <td>{paciente.telefono}</td> {/* Se corrigió el dato de teléfono */}
                    <td>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => {
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
                      }}>
                        <FaEdit />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => {
                          setShowDeleteModal(true);
                          setSelectedPaciente(paciente);
                      }}>
                        <FaTrash />
                      </button>


                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted">No hay registros para mostrar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de CRUD */}
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
      />
    </div>
  );
}

export default Paciente;
