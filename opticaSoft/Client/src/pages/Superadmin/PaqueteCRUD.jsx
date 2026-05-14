/* eslint-disable react/prop-types */

export const PaqueteCRUD = ({
  formData: {
    nombre, setNombre,
    descripcion, setDescripcion,
    total, setTotal,
    vigencia, setVigencia,
    estado, setEstado
  },
  modals: {
    showModal, setShowModal,
    showEditModal, setShowEditModal,
    showDeleteModal, setShowDeleteModal
  },
  handlers: {
    handleAdd, handleUpdate, handleDelete
  },
  selectedPaquete
}) => {

  const formFields = [
    { 
      label: "Nombre", 
      value: nombre, 
      setter: setNombre, 
      type: "text", 
      placeholder: "Nombre del paquete", 
      col: 12 
    },
    { 
      label: "Descripción", 
      value: descripcion, 
      setter: setDescripcion, 
      type: "text", 
      placeholder: "Descripción detallada del paquete", 
      col: 12 
    },
    { 
      label: "Precio Total", 
      value: total, 
      setter: setTotal, 
      type: "number", 
      placeholder: "Total del paquete", 
      col: 6 
    },
    { 
      label: "Vigencia", 
      value: vigencia, 
      setter: setVigencia, 
      type: "date", 
      placeholder: "Fecha de vigencia", 
      col: 6 
    },
    { 
      label: "Estado", 
      value: estado, 
      setter: setEstado, 
      type: "select", 
      options: ["ACTIVO", "INACTIVO"], 
      optionLabels: ["Activo", "Inactivo"], 
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
    const title = isAdd ? 'Registrar Nuevo Paquete' : isEdit ? 'Editar Paquete' : 'Confirmar Eliminación';
    const actionHandler = isAdd ? handleAdd : isEdit ? handleUpdate : handleDelete;
    const actionText = isAdd ? 'Registrar Paquete' : isEdit ? 'Actualizar Paquete' : 'Eliminar Definitivamente';
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
                  ¿Estás seguro de que deseas eliminar el paquete <br />
                  <strong style={{ color: '#343a40' }}>{selectedPaquete?.nombre}</strong>?
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
