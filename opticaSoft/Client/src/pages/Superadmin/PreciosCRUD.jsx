/* eslint-disable react/prop-types */
import { getTipoLente } from "../../api/TipoLente.api.js";
import { getMaterial } from "../../api/Material.api.js";
import { getTratamientos } from "../../api/Tratamientos.api.js";
import { useEffect, useState } from "react";

export const PreciosCRUD = ({
  formData: {
    idTipoLente, setIdTipoLente,
    idMaterial, setIdMaterial,
    idTratamiento, setIdTratamiento,
    serie, setSerie,
    esfera, setEsfera,
    cilindro, setCilindro,
    combinada, setCombinada,
    precio, setPrecio,
    total, setTotal,
  },
  modals: {
    showModal, setShowModal,
    showEditModal, setShowEditModal,
    showDeleteModal, setShowDeleteModal
  },
  handlers: {
    handleAdd, handleUpdate, handleDelete
  },
  selectedPrecios
}) => {
  const [tiposLente, setTiposLente] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [tratamientos, setTratamientos] = useState([]);

  // Cargar datos necesarios al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tiposLenteData = await getTipoLente();
        const materialesData = await getMaterial();
        const tratamientosData = await getTratamientos();
        
        setTiposLente(tiposLenteData);
        setMateriales(materialesData);
        setTratamientos(tratamientosData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Configuración de los campos del formulario
  const formFields = [
    { 
      label: "Tipo de Lente", 
      value: idTipoLente, 
      setter: setIdTipoLente, 
      type: "select", 
      options: ["", ...tiposLente.map(t => t.idTipoLente)],
      optionLabels: ["Seleccione un tipo de lente...", ...tiposLente.map(t => t.nombre)],
      col: 6 
    },
    { 
      label: "Material", 
      value: idMaterial, 
      setter: setIdMaterial, 
      type: "select", 
      options: ["", ...materiales.map(m => m.idMaterial)],
      optionLabels: ["Seleccione un material...", ...materiales.map(m => m.nombre)],
      col: 6 
    },
    { 
      label: "Tratamiento", 
      value: idTratamiento, 
      setter: setIdTratamiento, 
      type: "select", 
      options: ["", ...tratamientos.map(t => t.idTratamiento)],
      optionLabels: ["Seleccione un tratamiento...", ...tratamientos.map(t => t.nombre)],
      col: 12 
    },
    { 
      label: "Serie", 
      value: serie, 
      setter: setSerie, 
      type: "text", 
      placeholder: "Ej: 1, 2, 3...", 
      col: 5 
    },
    { 
      label: "Esfera", 
      value: esfera, 
      setter: setEsfera, 
      type: "text", 
      placeholder: "Ej: -2.50", 
      col: 5
    },
    { 
      label: "Cilindro", 
      value: cilindro, 
      setter: setCilindro, 
      type: "text", 
      placeholder: "Ej: -0.75", 
      col: 5 
    },
    { 
      label: "Combinada", 
      value: combinada, 
      setter: setCombinada, 
      type: "text", 
      placeholder: "Ej: SI/NO", 
      col: 5
    },
    { 
      label: "Precio Base", 
      value: precio, 
      setter: setPrecio, 
      type: "number", 
      placeholder: "Precio base", 
      col: 6 
    },
    { 
      label: "Precio Total", 
      value: total, 
      setter: setTotal, 
      type: "number", 
      placeholder: "Precio total", 
      col: 6 
    }
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
    const title = isAdd ? 'Registrar Nuevo Precio' : isEdit ? 'Editar Precio' : 'Confirmar Eliminación';
    const actionHandler = isAdd ? handleAdd : isEdit ? handleUpdate : handleDelete;
    const actionText = isAdd ? 'Registrar Precio' : isEdit ? 'Actualizar Precio' : 'Eliminar Definitivamente';
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
                ¿Estás seguro de que deseas eliminar el precio del lente: 
                <br />
                <strong style={{ color: '#343a40' }}>{selectedPrecios?.TipoLente}</strong> - 
                <strong style={{ color: '#343a40' }}>{selectedPrecios?.Material} </strong> 
                con tratamiento <strong style={{ color: '#343a40' }}>{selectedPrecios?.Tratamiento}</strong>?
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