/* eslint-disable react/prop-types */
import { getTratamientos } from "../../api/Tratamientos.api.js";
import { getPedidos } from "../../api/Pedido.api.js";
import { useEffect, useState } from "react";

export const PedidosTratamientosCRUD = ({
  formData: {
    idPedido, setIdPedido,
    idTratamiento, setIdTratamiento,
  },
  modals: {
    showModal, setShowModal,
    showEditModal, setShowEditModal,
    showDeleteModal, setShowDeleteModal
  },
  handlers: {
    handleAdd, handleUpdate, handleDelete
  },
  selectedPedidoTratamiento
}) => {
  const [pedidos, setPedidos] = useState([]);
  const [tratamientos, setTratamientos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pedidosData = await getPedidos();
        const tratamientosData = await getTratamientos();
        setPedidos(pedidosData);
        setTratamientos(tratamientosData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const formFields = [
    { 
      label: "Pedido", 
      value: idPedido, 
      setter: setIdPedido, 
      type: "select", 
      options: ["", ...pedidos.map(p => p.idPedido)],
      optionLabels: ["Seleccione un pedido...", ...pedidos.map(p => `Pedido #${p.idPedido} - ${p.observaciones}`)],
      col: 6 
    },
    { 
      label: "Tratamiento", 
      value: idTratamiento, 
      setter: setIdTratamiento, 
      type: "select", 
      options: ["", ...tratamientos.map(t => t.idTratamiento)],
      optionLabels: ["Seleccione un tratamiento...", ...tratamientos.map(t => `${t.nombre}`)],
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
              <option key={option} value={option}>{field.optionLabels[index]}</option>
            ))}
          </select>
        ) : (
          <textarea
            className="form-control crud-search-input"
            value={field.value}
            onChange={(e) => field.setter(e.target.value)}
            placeholder={field.placeholder}
            style={{ padding: '0.5rem 0.75rem', minHeight: '80px' }}
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
    const title = isAdd ? 'Agregar Tratamiento al Pedido' : isEdit ? 'Editar Tratamiento del Pedido' : 'Confirmar Eliminación';
    const actionHandler = isAdd ? handleAdd : isEdit ? handleUpdate : handleDelete;
    const actionText = isAdd ? 'Agregar' : isEdit ? 'Actualizar' : 'Eliminar Definitivamente';
    const actionBtnClass = isAdd ? 'crud-btn-success' : isEdit ? 'crud-btn-primary' : 'crud-btn-danger';

    return (
      <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1">
        <div className={`modal-dialog modal-dialog-centered ${isDelete ? '' : 'modal-lg'}`}>
          <div className="modal-content crud-card" style={{ borderRadius: '10px', overflow: 'hidden' }}>
            <div className="modal-header crud-card-header" style={{ padding: '1rem 1.5rem' }}>
              <h5 className="modal-title text-white" style={{ fontSize: '1.25rem', fontWeight: '600' }}>{title}</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShow(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body crud-card-body" style={{ padding: '1.5rem' }}>
              {isDelete ? (
                <p className="text-center mb-0" style={{ fontSize: '1rem' }}>
                  ¿Estás seguro de eliminar el tratamiento <br />
                  <strong style={{ color: '#343a40' }}>
                    {selectedPedidoTratamiento && tratamientos.find(t => t.idTratamiento === selectedPedidoTratamiento.idTratamiento)?.nombreTratamiento}
                  </strong> del pedido?
                </p>
              ) : (
                <div className="row g-3">
                  {formFields.map(renderField)}
                </div>
              )}
            </div>
            <div className="modal-footer crud-card-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <button
                type="button"
                className={`crud-btn ${isDelete ? 'crud-cancel' : 'crud-btn-danger'}`}
                onClick={() => setShow(false)}
                style={{ padding: '0.5rem 1.25rem', borderRadius: '6px' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={`crud-btn ${actionBtnClass}`}
                onClick={actionHandler}
                style={{ padding: '0.5rem 1.25rem', borderRadius: '6px' }}
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
