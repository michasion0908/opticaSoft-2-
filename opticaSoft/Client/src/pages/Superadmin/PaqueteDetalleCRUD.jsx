/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { getPaquetes } from "../../api/Paquete.api.js";
import { getTipoLente } from "../../api/TipoLente.api.js";
import { getMaterial } from "../../api/Material.api.js";
import { getTratamientos } from "../../api/Tratamientos.api.js";

export const PaqueteDetalleCRUD = ({
  formData: {
    idPaquete, setIdPaquete,
    idTipoLente, setIdTipoLente,
    idMaterial, setIdMaterial,
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
  selectedDetalle
}) => {
  const [paquetes, setPaquetes] = useState([]);
  const [tiposLente, setTiposLente] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [tratamientos, setTratamientos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paquetesData, tiposLenteData, materialesData, tratamientosData] = await Promise.all([
          getPaquetes(),
          getTipoLente(),
          getMaterial(),
          getTratamientos()
        ]);
        setPaquetes(paquetesData);
        setTiposLente(tiposLenteData);
        setMateriales(materialesData);
        setTratamientos(tratamientosData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    fetchData();
  }, []);

  const formFields = [
    {
      label: "Paquete",
      value: idPaquete,
      setter: setIdPaquete,
      type: "select",
      options: ["", ...paquetes.map(p => p.idPaquete)],
      optionLabels: ["Seleccione un paquete...", ...paquetes.map(p => p.nombre)],
      col: 12
    },
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
    }
  ];

  const renderField = (field) => (
    <div className={`col-md-${field.col}`} key={field.label}>
      <div className="input-group mb-3">
        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>{field.label}:</span>
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
      </div>
    </div>
  );

  const renderModal = (type) => {
    const isAdd = type === 'add';
    const isEdit = type === 'edit';
    const isDelete = type === 'delete';
    const show = isAdd ? showModal : isEdit ? showEditModal : showDeleteModal;
    const setShow = isAdd ? setShowModal : isEdit ? setShowEditModal : setShowDeleteModal;
    const title = isAdd ? 'Agregar Detalle a Paquete' : isEdit ? 'Editar Detalle de Paquete' : 'Eliminar Detalle';
    const actionHandler = isAdd ? handleAdd : isEdit ? handleUpdate : handleDelete;
    const actionText = isAdd ? 'Agregar Detalle' : isEdit ? 'Actualizar Detalle' : 'Eliminar Detalle';
    const actionBtnClass = isAdd ? 'crud-btn-success' : isEdit ? 'crud-btn-primary' : 'crud-btn-danger';

    return (
      <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1">
        <div className={`modal-dialog modal-dialog-centered ${isDelete ? '' : 'modal-lg'}`}>
          <div className="modal-content crud-card" style={{ borderRadius: '10px', overflow: 'hidden' }}>
            <div className="modal-header crud-card-header" style={{ padding: '1rem 1.5rem' }}>
              <h5 className="modal-title text-white">{title}</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShow(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body crud-card-body" style={{ padding: '1.5rem' }}>
              {isDelete ? (
                <p className="text-center mb-0">
                  ¿Seguro que deseas eliminar este detalle del paquete: 
                  <strong> {selectedDetalle?.Paquete}</strong>?
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
                className={`crud-btn ${isDelete ? 'crud-cancel' : 'crud-btn-danger'}`}
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
      <div 
        className={`modal-backdrop fade ${showModal || showEditModal || showDeleteModal ? 'show' : ''}`} 
        style={{ display: showModal || showEditModal || showDeleteModal ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)' }}
      />
      {renderModal('add')}
      {renderModal('edit')}
      {renderModal('delete')}
    </>
  );
};
