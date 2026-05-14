/* eslint-disable react/prop-types */

export const InventarioCRUD = ({
  // Campos del formulario como objeto para simplificar
  formData: {
    marca, setMarca,
    modelo, setModelo,
    color, setColor,
    numeroColor, setNumeroColor,
    material, setMaterial,
    cantidad, setCantidad,
    exhibicion, setExhibicion,
    precio, setPrecio,
    fecha, setFecha,
    estatus, setEstatus,
    precioVenta, setPrecioVenta
  },
  // Estados modales
  modals: {
    showModal, setShowModal,
    showEditModal, setShowEditModal,
    showDeleteModal, setShowDeleteModal
  },
  // Funciones
  handlers: {
    handleAdd, handleUpdate, handleDelete
  },
  selectedInventario
}) => {
  // Configuración común para los campos del formulario
  const formFields = [
    { label: "Marca", value: marca, setter: setMarca, type: "text", placeholder: "Ej: Ray-Ban, Oakley", col: 6 },
    { label: "Modelo", value: modelo, setter: setModelo, type: "text", placeholder: "Ej: Aviador, Wayfarer", col: 6 },
    { label: "Color", value: color, setter: setColor, type: "text", placeholder: "Ej: Negro, Dorado", col: 6 },
    { label: "Núm. Color", value: numeroColor, setter: setNumeroColor, type: "text", placeholder: "Ej: 1234, 5678", col: 6 },
    { label: "Material", value: material, setter: setMaterial, type: "text", placeholder: "Ej: Metal, Acetato", col: 6 },
    { label: "Cantidad", value: cantidad, setter: setCantidad, type: "number", placeholder: "Ej: 5, 10", col: 6 },
    { 
      label: "Exhibición", 
      value: exhibicion, 
      setter: setExhibicion, 
      type: "select", 
      options: ["", "Dama", "Caballero", "Niño"],
      optionLabels: ["Seleccione exhibición...", "Dama", "Caballero", "Niño"],
      col: 6 
    },
    { label: "Precio", value: precio, setter: setPrecio, type: "number", placeholder: "Ej: 1500.00", col: 6 },
    { label: "Fecha", value: fecha, setter: setFecha, type: "date", col: 6 },
    { 
      label: "Estatus", 
      value: estatus, 
      setter: setEstatus, 
      type: "select", 
      options: ["", "Disponible", "Vendido"],
      optionLabels: ["Seleccione estatus...", "Disponible", "Vendido"],
      col: 6 
    },
    { label: "Precio Venta", value: precioVenta, setter: setPrecioVenta, type: "number", placeholder: "Ej: 2000.00", col: 6 }
  ];

  // Componente para renderizar cada campo del formulario
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

  // Componente para renderizar los modales
  const renderModal = (type) => {
    const isAdd = type === 'add';
    const isEdit = type === 'edit';
    const isDelete = type === 'delete';
    const show = isAdd ? showModal : isEdit ? showEditModal : showDeleteModal;
    const setShow = isAdd ? setShowModal : isEdit ? setShowEditModal : setShowDeleteModal;
    const title = isAdd ? 'Registrar Nuevo Producto' : isEdit ? 'Editar Producto' : 'Confirmar Eliminación';
    const actionHandler = isAdd ? handleAdd : isEdit ? handleUpdate : handleDelete;
    const actionText = isAdd ? 'Registrar Producto' : isEdit ? 'Actualizar Producto' : 'Eliminar Definitivamente';
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
                  ¿Estás seguro de eliminar el producto:<br />
                  <strong style={{ color: '#343a40' }}>{selectedInventario?.marca} {selectedInventario?.modelo}</strong>?
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