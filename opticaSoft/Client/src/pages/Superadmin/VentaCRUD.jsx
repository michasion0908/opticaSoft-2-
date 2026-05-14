/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { getCotizaciones } from "../../api/Cotización.api.js";

export const VentaCRUD = ({
  formData: {
    idCotizacion, setIdCotizacion,
    estado, setEstado,
    metodoPago, setMetodoPago,
    referenciaPago, setReferenciaPago,
    total, setTotal,
    abono, setAbono
  },
  modals: {
    showModal, setShowModal,
    showEditModal, setShowEditModal,
    showDeleteModal, setShowDeleteModal
  },
  handlers: {
    handleAdd, handleUpdate, handleDelete
  },
  selectedVenta
}) => {
  const [cotizaciones, setCotizaciones] = useState([]);

  useEffect(() => {
    const fetchCotizaciones = async () => {
      try {
        const cotData = await getCotizaciones();
        setCotizaciones(cotData);
      } catch (error) {
        console.error("Error al cargar cotizaciones:", error);
      }
    };
    fetchCotizaciones();
  }, []);

  const formFields = [
    {
      label: "Cotización",
      value: idCotizacion,
      setter: setIdCotizacion,
      type: "select",
      options: ["", ...cotizaciones.map(c => c.idCotizacion)],
      optionLabels: ["Seleccione una cotización...", ...cotizaciones.map(c => `Cotización #${c.idCotizacion}`)],
      col: 6
    },
    {
      label: "Estado",
      value: estado,
      setter: setEstado,
      type: "select",
      options: ["", "PENDIENTE", "LIQUIDADO", "CANCELADO"],
      optionLabels: ["Seleccione estado...", "Pendiente", "Pagada", "Cancelada"],
      col: 6
    },
    {
      label: "Método de Pago",
      value: metodoPago,
      setter: setMetodoPago,
      type: "select",
      options: ["", "EFECTIVO", "TARJETA CRÉDITO", "TARJETA DÉBITO", "TRANSFERENCIA", "CHEQUES", "OTRO"],
      optionLabels: ["Seleccione método...", "Efectivo", "Tarjeta Crédito", "Tarjeta Débito", "Transferencia", "Cheques", "Otro"],
      col: 6
    },
    {
      label: "Referencia Pago",
      value: referenciaPago,
      setter: setReferenciaPago,
      type: "text",
      placeholder: "Ej: #TRX12345",
      col: 6
    },
    {
      label: "Total",
      value: total,
      setter: setTotal,
      type: "number",
      placeholder: "Ej: 500.00",
      col: 6
    },
    {
      label: "Abono",
      value: abono,
      setter: setAbono,
      type: "number",
      placeholder: "Ej: 200.00",
      col: 6
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
  <option key={`${option}-${index}`} value={option}>{field.optionLabels[index]}</option>
))}

          </select>
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
    const title = isAdd ? 'Nueva Venta' : isEdit ? 'Editar Venta' : 'Confirmar Eliminación';
    const actionHandler = isAdd ? handleAdd : isEdit ? handleUpdate : handleDelete;
    const actionText = isAdd ? 'Guardar Venta' : isEdit ? 'Actualizar Venta' : 'Eliminar Venta';
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
                  ¿Estás seguro de eliminar la venta con ID:<br />
                  <strong>{selectedVenta?.idVenta}</strong>?
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
