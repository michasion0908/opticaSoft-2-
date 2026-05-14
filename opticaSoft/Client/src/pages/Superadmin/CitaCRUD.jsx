/* eslint-disable react/prop-types */
import { getPaciente } from "../../api/Paciente.api.js";
import { getOptometrista } from "../../api/Optometrista.api.js";
import { useEffect, useState } from "react";
import { FaSearch, FaUserMd, FaUserInjured, FaCalendarAlt, FaClock, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";

export const CitasCRUD = ({
  formData: {
    idPaciente, setIdPaciente,
    idOptometrista, setIdOptometrista,
    fechaHora, setFechaHora,
    duracionEstimada, setDuracionEstimada,
    estado, setEstado,
    motivo, setMotivo,
    observaciones, setObservaciones,  
  },
  modals: {
    showModal, setShowModal,
    showEditModal, setShowEditModal,
    showDeleteModal, setShowDeleteModal
  },
  handlers: {
    handleAdd, handleUpdate, handleDelete
  },
  selectedCita
}) => {
  const [pacientes, setPacientes] = useState([]);
  const [optometristas, setOptometristas] = useState([]);
  const [busquedaPaciente, setBusquedaPaciente] = useState("");
  const [resultadosPacientes, setResultadosPacientes] = useState([]);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("paciente");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pacientesData = await getPaciente();
        const optometristasData = await getOptometrista();
        setPacientes(pacientesData);
        setOptometristas(optometristasData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (busquedaPaciente.length > 0) {
      const results = pacientes.filter(p => 
        p.nombre.toLowerCase().includes(busquedaPaciente.toLowerCase()) ||
        p.apellido.toLowerCase().includes(busquedaPaciente.toLowerCase()) ||
        p.telefono.toLowerCase().includes(busquedaPaciente.toLowerCase())
      );
      setResultadosPacientes(results);
    } else {
      setResultadosPacientes([]);
    }
  }, [busquedaPaciente, pacientes]);

  const validateForm = () => {
    const newErrors = {};
    if (!idPaciente) newErrors.idPaciente = "Debe seleccionar un paciente";
    if (!fechaHora) newErrors.fechaHora = "Debe especificar fecha y hora";
    if (!duracionEstimada) newErrors.duracionEstimada = "Debe especificar una duración estimada";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (action) => {
    if (!validateForm()) {
      setActiveTab("paciente");
      return;
    }
    action();
  };

  const formFields = [
    { 
      label: "Buscar paciente", 
      value: busquedaPaciente, 
      setter: setBusquedaPaciente, 
      type: "text", 
      placeholder: "Nombre, apellido o teléfono...",
      icon: <FaUserInjured />,
      col: 6,
      tab: "paciente",
      required: true
    },
    { 
      label: "Seleccionar paciente", 
      value: idPaciente, 
      setter: setIdPaciente, 
      type: "select", 
      options: ["", ...pacientes
        .filter(p => 
          p.nombre.toLowerCase().includes(busquedaPaciente.toLowerCase()) ||
          p.apellido.toLowerCase().includes(busquedaPaciente.toLowerCase()) ||
          p.telefono.toLowerCase().includes(busquedaPaciente.toLowerCase())
        )
        .map(p => p.idPaciente)],
      optionLabels: ["Seleccione un paciente...", ...pacientes
        .filter(p => 
          p.nombre.toLowerCase().includes(busquedaPaciente.toLowerCase()) ||
          p.apellido.toLowerCase().includes(busquedaPaciente.toLowerCase()) ||
          p.telefono.toLowerCase().includes(busquedaPaciente.toLowerCase())
        )
        .map(p => `${p.nombre} ${p.apellido} (${p.telefono})`)],
      col: 6,
      tab: "paciente",
      required: true
    },
    { 
      label: "Optometrista", 
      value: idOptometrista, 
      setter: setIdOptometrista, 
      type: "select", 
      options: ["", ...optometristas.map(o => o.idOptometrista)],
      optionLabels: ["Seleccione un optometrista...", ...optometristas.map(o => `${o.nombre} (${o.noCedula})`)],
      col: 12,
      tab: "paciente"
    },
    { 
      label: "Fecha y Hora", 
      value: fechaHora, 
      setter: setFechaHora, 
      type: "datetime-local", 
      placeholder: "Fecha y hora de la cita",
      icon: <FaCalendarAlt />,
      col: 6,
      tab: "detalles",
      required: true
    },
    { 
      label: "Duración Estimada (min)", 
      value: duracionEstimada, 
      setter: setDuracionEstimada, 
      type: "number", 
      placeholder: "Ej: 30",
      icon: <FaClock />,
      col: 6,
      tab: "detalles"
    },
    { 
      label: "Motivo", 
      value: motivo, 
      setter: setMotivo, 
      type: "select", 
      options: ["", "Examen de la vista", "Consulta", "Seguimiento", "Urgencia", "Otro"],
      optionLabels: ["Seleccione motivo...", "Examen de la vista", "Consulta", "Seguimiento", "Urgencia", "Otro"],
      col: 6,
      tab: "detalles"
    },
    { 
      label: "Estado", 
      value: estado, 
      setter: setEstado, 
      type: "select", 
      options: ["", "PENDIENTE", "CONFIRMADA", "COMPLETADA", "CANCELADA", "NO_ASISTIO"],
      optionLabels: ["Seleccione estado...", "Pendiente", "Confirmada", "Completada", "Cancelada", "No asistió"],
      col: 6,
      tab: "detalles",
      showOnEdit: true
    },
        { 
      label: "Observaciones", 
      value: observaciones, 
      setter: setObservaciones, 
      type: "textarea", 
      placeholder: "Notas adicionales sobre la cita...",
      icon: <FaInfoCircle />,
      col: 12,
      tab: "detalles"
    }
  ];

  const renderField = (field) => {
    if (field.tab !== activeTab || (field.showOnEdit && !showEditModal)) return null;
    
    return (
      <div className={`col-md-${field.col} mb-3`} key={field.label}>
        <label className="form-label fw-bold text-secondary">
          {field.label}
          {field.required && <span className="text-danger"> *</span>}
        </label>
        <div className="input-group">
          {field.icon && (
            <span className="input-group-text">
              {field.icon}
            </span>
          )}
          {field.type === "select" ? (
            <>
              <select
                className={`form-select ${errors[field.value] ? 'is-invalid' : ''}`}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
              >
                {field.options.map((option, index) => (
                  <option key={option + index} value={option}>{field.optionLabels[index]}</option>
                ))}
              </select>
              {errors[field.value] && (
                <div className="invalid-feedback d-block">
                  {errors[field.value]}
                </div>
              )}
            </>
          ) : field.type === "textarea" ? (
            <textarea
              className={`form-control ${errors[field.value] ? 'is-invalid' : ''}`}
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              placeholder={field.placeholder}
              rows="3"
            />
          ) : (
            <>
              <input
                type={field.type}
                className={`form-control ${errors[field.value] ? 'is-invalid' : ''}`}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
              />
              {errors[field.value] && (
                <div className="invalid-feedback d-block">
                  {errors[field.value]}
                </div>
              )}
            </>
          )}
        </div>
        {field.label === "Buscar paciente" && resultadosPacientes.length > 0 && (
          <div className="mt-2">
            <small className="text-muted">Resultados de búsqueda:</small>
            <div className="list-group mt-1">
              {resultadosPacientes.slice(0, 5).map(paciente => (
                <button
                  key={paciente.idPaciente}
                  type="button"
                  className={`list-group-item list-group-item-action small ${idPaciente === paciente.idPaciente ? 'active' : ''}`}
                  onClick={() => {
                    setIdPaciente(paciente.idPaciente);
                    setBusquedaPaciente(`${paciente.nombre} ${paciente.apellido}`);
                    setResultadosPacientes([]);
                  }}
                >
                  {paciente.nombre} {paciente.apellido} ({paciente.telefono})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderModal = (type) => {
    const isAdd = type === 'add';
    const isEdit = type === 'edit';
    const isDelete = type === 'delete';
    const show = isAdd ? showModal : isEdit ? showEditModal : showDeleteModal;
    const setShow = isAdd ? setShowModal : isEdit ? setShowEditModal : setShowDeleteModal;
    const title = isAdd ? 'Agendar Nueva Cita' : isEdit ? 'Editar Cita' : 'Confirmar Eliminación';
    const actionHandler = isAdd ? handleAdd : isEdit ? handleUpdate : handleDelete;
    const actionText = isAdd ? 'Agendar Cita' : isEdit ? 'Actualizar Cita' : 'Eliminar Definitivamente';
    const actionBtnClass = isAdd ? 'crud-btn-success' : isEdit ? 'crud-btn-primary' : 'crud-btn-danger';

    const pacienteSeleccionado = pacientes.find(p => p.idPaciente === idPaciente);
    const optometristaSeleccionado = optometristas.find(o => o.idOptometrista === idOptometrista);

    return (
      <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1">
        <div className={`modal-dialog modal-dialog-centered ${isDelete ? '' : 'modal-lg'}`}>
          <div className="modal-content crud-card" style={{ borderRadius: '15px' }}>
            <div className="modal-header crud-card-header">
              <h5 className="modal-title text-white">{title}</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => {
                  setShow(false);
                  setErrors({});
                }}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body crud-card-body">
              {isDelete ? (
                <div className="text-center p-4">
                  <div className="mb-4">
                    <FaExclamationTriangle className="text-danger fs-1" />
                  </div>
                  <h5>¿Estás seguro de eliminar esta cita?</h5>
                  <p className="text-muted">
                    Paciente: <strong>{selectedCita && pacientes.find(p => p.idPaciente === selectedCita.idPaciente)?.nombre}</strong>
                  </p>
                </div>
              ) : (
                <>
                  <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'paciente' ? 'active' : ''}`}
                        onClick={() => setActiveTab('paciente')}
                      >
                        Paciente
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'detalles' ? 'active' : ''}`}
                        onClick={() => setActiveTab('detalles')}
                      >
                        Detalles
                      </button>
                    </li>
                  </ul>
                  
                  <div className="row g-3">
                    {formFields.map(renderField)}
                  </div>
                  
                  {activeTab === 'detalles' && (
                    <div className="mt-4 p-3 bg-light rounded">
                      <h6 className="text-primary">Resumen de la Cita</h6>
                      <div className="row">
                        {pacienteSeleccionado && (
                          <div className="col-md-6">
                            <p className="mb-2"><strong>Paciente:</strong> {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido}</p>
                            <p className="mb-2"><strong>Teléfono:</strong> {pacienteSeleccionado.telefono}</p>
                          </div>
                        )}
                        {optometristaSeleccionado && (
                          <div className="col-md-6">
                            <p className="mb-2"><strong>Optometrista:</strong> {optometristaSeleccionado.nombre} {optometristaSeleccionado.apellido}</p>
                            <p className="mb-2"><strong>Cédula:</strong> {optometristaSeleccionado.noCedula}</p>
                          </div>
                        )}
                        <div className="col-12">
                          <p className="mb-2"><strong>Fecha y Hora:</strong> {fechaHora ? new Date(fechaHora).toLocaleString() : <span className="text-danger">No especificada</span>}</p>
                          {motivo && <p className="mb-2"><strong>Motivo:</strong> {motivo}</p>}
                          {duracionEstimada && <p className="mb-2"><strong>Duración:</strong> {duracionEstimada} minutos</p>}
                          {isEdit && estado && <p className="mb-2"><strong>Estado:</strong> {estado}</p>}
                        </div>
                      </div>
                      {observaciones && (
                        <div className="mt-2">
                          <strong>Observaciones:</strong> {observaciones}
                        </div>
                      )}
                      {Object.keys(errors).length > 0 && (
                        <div className="alert alert-danger mt-3">
                          <FaExclamationTriangle className="me-2" />
                          Por favor completa todos los campos obligatorios marcados con *
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="modal-footer crud-card-footer d-flex justify-content-between">
              <button
                type="button"
                className="crud-btn crud-cancel"
                onClick={() => {
                  setShow(false);
                  setErrors({});
                }}
              >
                Cancelar
              </button>
              <div>
                {!isDelete && activeTab !== 'detalles' && (
                  <button 
                    className="crud-btn crud-btn-primary me-2" 
                    onClick={() => setActiveTab('detalles')}
                  >
                    Siguiente
                  </button>
                )}
                <button 
                  type="button"
                  className={`crud-btn ${actionBtnClass}`}
                  onClick={() => isDelete ? actionHandler() : handleSubmit(actionHandler)}
                >
                  {actionText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div 
        className={`modal-backdrop fade ${showModal || showEditModal || showDeleteModal ? 'show' : ''}`} 
        style={{ 
          display: showModal || showEditModal || showDeleteModal ? 'block' : 'none',
          backgroundColor: 'rgba(0,0,0,0.5)' 
        }}
      />
      
      {renderModal('add')}
      {renderModal('edit')}
      {renderModal('delete')}
    </>
  );
};