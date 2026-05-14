/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { getPaciente } from "../../api/Paciente.api.js";

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

  const formFields = [
    {
      label: "Paciente",
      value: idPaciente,
      setter: setIdPaciente,
      type: "select",
      options: ["", ...pacientes.map(p => p.idPaciente)],
      optionLabels: ["Seleccione un paciente...", ...pacientes.map(p => `${p.nombre} ${p.apellido}`)],
      col: 6
    },
    {
      label: "Tipo",
      value: tipo,
      setter: setTipo,
      type: "select",
      options: ["", "ARMAZON", "LENTE", "TRATAMIENTO", "SERVICIO", "PAQUETE", "OTRO"],
      optionLabels: ["Seleccione tipo...", "Armazón", "Lentes", "Tratamiento", "Servicio", "Paquete", "Otro"],
      col: 6
    },
    {
      label: "Subtotal",
      value: subtotal,
      setter: setSubtotal,
      type: "number",
      placeholder: "Ej: 500",
      col: 6
    },
    {
      label: "Descuento",
      value: descuento,
      setter: setDescuento,
      type: "number",
      placeholder: "Ej: 10%",
      col: 6
    },
    {
      label: "IVA",
      value: iva,
      setter: setIva,
      type: "number",
      placeholder: "Ej: 16%",
      col: 6
    },
    {
      label: "Total",
      value: total,
      setter: setTotal,
      type: "number",
      placeholder: "Ej: 520",
      col: 6
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
    <div className={`col-md-${field.col}`} key={field.label}>
      <div className="input-group mb-3">
        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>{field.label}:</span>
        {field.type === "select" ? (
          <select
            className="form-select crud-search-input"
            value={field.value}
            onChange={(e) => field.setter(e.target.value)}
            style={{ padding: '0.5rem 0.75rem' }}
          >
            {field.options.map((option, index) => (
              <option key={option} value={option}>{field.optionLabels[index]}</option>
            ))}
          </select>
        ) : field.type === "textarea" ? (
          <textarea
            className="form-control crud-search-input"
            value={field.value}
            onChange={(e) => field.setter(e.target.value)}
            placeholder={field.placeholder}
            style={{ padding: '0.5rem 0.75rem', minHeight: '80px' }}
          />
        ) : (
          <input
            type={field.type}
            className="form-control crud-search-input"
            value={field.value}
            onChange={(e) => field.setter(e.target.value)}
            placeholder={field.placeholder}
            style={{ padding: '0.5rem 0.75rem' }}
          />
        )}
      </div>
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

    return (
      <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1">
        <div className={`modal-dialog modal-dialog-centered ${isDelete ? '' : 'modal-lg'}`}>
          <div className="modal-content crud-card" style={{ borderRadius: '10px', overflow: 'hidden' }}>
            <div className="modal-header crud-card-header">
              <h5 className="modal-title text-white">{title}</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShow(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body crud-card-body">
              {isDelete ? (
                <p className="text-center mb-0">
                  ¿Estás seguro de eliminar la cotización del paciente:<br />
                  <strong>
                    {selectedCotizacion && pacientes.find(p => p.idPaciente === selectedCotizacion.idPaciente)?.nombre}
                  </strong>?
                </p>
              ) : (
                <div className="row g-3">
                  {formFields.map(renderField)}
                </div>
              )}
            </div>
            <div className="modal-footer crud-card-footer">
              <button
                type="button"
                className="crud-btn crud-cancel"
                onClick={() => setShow(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={`crud-btn ${actionBtnClass}`}
                onClick={actionHandler}
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
      {/* Fondo oscuro para todos los modales */}
      <div 
        className={`modal-backdrop fade ${showModal || showEditModal || showDeleteModal ? 'show' : ''}`} 
        style={{ 
          display: showModal || showEditModal || showDeleteModal ? 'block' : 'none',
          backgroundColor: 'rgba(0,0,0,0.5)' 
        }}
      />
      
      {/* Modales */}
      {renderModal('add')}
      {renderModal('edit')}
      {renderModal('delete')}
    </>
  );
};
