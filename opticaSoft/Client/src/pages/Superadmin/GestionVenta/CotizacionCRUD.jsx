/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { getPaciente } from "../../../api/Paciente.api.js";
import { FaSearch, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";

export const CotizacionCRUD = ({
  formData: {
    idPaciente, setIdPaciente,
    tipo, setTipo,
    subtotal, setSubtotal,
    descuento, setDescuento,
    iva, setIva,
    total, setTotal,
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
  selectedCotizacion
}) => {
  const [pacientes, setPacientes] = useState([]);
  const [busquedaPaciente, setBusquedaPaciente] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pacientesData = await getPaciente();
        setPacientes(pacientesData);
      } catch (error) {
        console.error("Error fetching pacientes:", error);
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
      setResultadosBusqueda(results);
    } else {
      setResultadosBusqueda([]);
    }
  }, [busquedaPaciente, pacientes]);

  const validateForm = () => {
    const newErrors = {};
    if (!idPaciente) newErrors.idPaciente = "Debe seleccionar un paciente";
    if (!tipo) newErrors.tipo = "Debe seleccionar un tipo de cotización";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (action) => {
    if (!validateForm()) return;
    action();
  };

  const formFields = [
    {
      label: "Buscar paciente",
      value: busquedaPaciente,
      setter: setBusquedaPaciente,
      type: "text",
      placeholder: "Nombre, apellido o teléfono...",
      icon: <FaSearch />,
      col: 6,
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
      required: true
    },
    {
      label: "Tipo",
      value: tipo,
      setter: setTipo,
      type: "select",
      options: ["", "ARMAZON", "LENTE", "TRATAMIENTO", "SERVICIO", "PAQUETE", "OTRO"],
      optionLabels: ["Seleccione tipo...", "Armazón", "Lentes", "Tratamiento", "Servicio", "Paquete", "Otro"],
      col: 6,
      required: true
    },
    {
      label: "Descuento",
      value: descuento,
      setter: setDescuento,
      type: "number",
      placeholder: "Ej: 10%",
      col: 3
    },
    {
      label: "IVA",
      value: iva,
      setter: setIva,
      type: "number",
      placeholder: "Ej: 16%",
      col: 3
    },
    {
      label: "Observaciones",
      value: observaciones,
      setter: setObservaciones,
      type: "textarea",
      placeholder: "Notas adicionales sobre la cotización...",
      col: 12
    }
  ];

  const renderField = (field) => (
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
                <option key={option} value={option}>{field.optionLabels[index]}</option>
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
            className="form-control"
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
      {field.label === "Buscar paciente" && resultadosBusqueda.length > 0 && (
        <div className="mt-2">
          <small className="text-muted">Resultados de búsqueda:</small>
          <div className="list-group mt-1">
            {resultadosBusqueda.slice(0, 5).map(paciente => (
              <button
                key={paciente.idPaciente}
                type="button"
                className={`list-group-item list-group-item-action small ${idPaciente === paciente.idPaciente ? 'active' : ''}`}
                onClick={() => {
                  setIdPaciente(paciente.idPaciente);
                  setBusquedaPaciente(`${paciente.nombre} ${paciente.apellido}`);
                  setResultadosBusqueda([]);
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

  const renderModal = (type) => {
    const isAdd = type === 'add';
    const isEdit = type === 'edit';
    const isDelete = type === 'delete';
    const show = isAdd ? showModal : isEdit ? showEditModal : showDeleteModal;
    const setShow = isAdd ? setShowModal : isEdit ? setShowEditModal : setShowDeleteModal;
    const title = isAdd ? 'Nueva Cotización' : isEdit ? 'Editar Cotización' : 'Confirmar Eliminación';
    const actionHandler = isAdd ? handleAdd : isEdit ? handleUpdate : handleDelete;
    const actionText = isAdd ? 'Guardar Cotización' : isEdit ? 'Actualizar Cotización' : 'Eliminar Definitivamente';
    const actionBtnClass = isAdd ? 'crud-btn-success' : isEdit ? 'crud-btn-primary' : 'crud-btn-danger';

    const pacienteSeleccionado = pacientes.find(p => p.idPaciente === idPaciente);

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
                  <h5>¿Estás seguro de eliminar esta cotización?</h5>
                  <p className="text-muted">
                    Paciente: <strong>{selectedCotizacion && pacientes.find(p => p.idPaciente === selectedCotizacion.idPaciente)?.nombre}</strong>
                  </p>
                </div>
              ) : (
                <div className="row g-3">
                  {formFields.map(renderField)}
                  {Object.keys(errors).length > 0 && (
                    <div className="col-12">
                      <div className="alert alert-danger">
                        <FaExclamationTriangle className="me-2" />
                        Por favor completa todos los campos obligatorios marcados con *
                      </div>
                    </div>
                  )}
                  {pacienteSeleccionado && (
                    <div className="col-12 mt-3 p-3 bg-light rounded">
                      <h6 className="text-primary">Información del Paciente</h6>
                      <div className="row">
                        <div className="col-md-6">
                          <p><strong>Nombre:</strong> {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido}</p>
                          <p><strong>Teléfono:</strong> {pacienteSeleccionado.telefono}</p>
                        </div>
                        <div className="col-md-6">
                          <p><strong>Email:</strong> {pacienteSeleccionado.email || 'No especificado'}</p>
                          <p><strong>Tipo:</strong> {tipo || 'No seleccionado'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="modal-footer crud-card-footer">
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