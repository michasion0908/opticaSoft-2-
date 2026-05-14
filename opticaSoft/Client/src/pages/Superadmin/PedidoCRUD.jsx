/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { getTipoLente } from "../../api/TipoLente.api.js";
import { getMaterial } from "../../api/Material.api.js";
import { getLentesContacto } from "../../api/LentesContacto.api.js";
import { getInventario } from "../../api/Inventario.api.js";
import { getPaquetes } from "../../api/Paquete.api.js";
import { getCotizaciones } from "../../api/Cotización.api.js";

export const PedidoCRUD = ({
  formData: {
    idCotizacion, setIdCotizacion,
    idInventario, setIdInventario,
    idTipoLente, setIdTipoLente,
    idMaterial, setIdMaterial,
    idLentesContacto, setIdLentesContacto,
    idPaquete, setIdPaquete,
    cantidad, setCantidad,
    fechaEntrega, setFechaEntrega,
    observaciones, setObservaciones
  },
  modals: {
    showModal, setShowModal,
    showEditModal, setShowEditModal,
    showDeleteModal, setShowDeleteModal
  },
  handlers: {
    handleAdd, handleUpdate, handleDelete
  },
  selectedPedido
}) => {
  const [cotizacion, setCotizacion] = useState([]);
  const [tiposLente, setTiposLente] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [paquetes, setPaquetes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cotizacionData = await getCotizaciones();
        const tiposLenteData = await getTipoLente();
        const materialesData = await getMaterial();
        const contactosData = await getLentesContacto();
        const inventarioData = await getInventario();
        const paquetesData = await getPaquetes();

        setCotizacion(cotizacionData);
        setTiposLente(tiposLenteData);
        setMateriales(materialesData);
        setContactos(contactosData);
        setInventario(inventarioData);
        setPaquetes(paquetesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const formFields = [
/*     {
      label: "Cotización",
      value: idCotizacion,
      setter: setIdCotizacion,
      type: "text",
      placeholder: "ID de cotización",
      col: 6
    }, */
    {
        label: "Cotización",
        value: idCotizacion,
        setter: setIdCotizacion,
        type: "select",
        options: ["", ...cotizacion.map(c => c.idCotizacion)],
        optionLabels: ["Seleccione la cotización...", ...cotizacion.map(c => c.codigo)],
        col: 12
      },

    {
      label: "Inventario",
      value: idInventario,
      setter: setIdInventario,
      type: "select",
      options: ["", ...inventario.map(i => i.idInventario)],
      optionLabels: ["Seleccione inventario...", ...inventario.map(i => i.modelo)],
      col: 6
    },
    {
      label: "Tipo de Lente",
      value: idTipoLente,
      setter: setIdTipoLente,
      type: "select",
      options: ["", ...tiposLente.map(t => t.idTipoLente)],
      optionLabels: ["Seleccione tipo de lente...", ...tiposLente.map(t => t.nombre)],
      col: 6
    },
    {
      label: "Material",
      value: idMaterial,
      setter: setIdMaterial,
      type: "select",
      options: ["", ...materiales.map(m => m.idMaterial)],
      optionLabels: ["Seleccione material...", ...materiales.map(m => m.nombre)],
      col: 6
    },
    {
      label: "Lentes de Contacto",
      value: idLentesContacto,
      setter: setIdLentesContacto,
      type: "select",
      options: ["", ...contactos.map(c => c.idLentesContacto)],
      optionLabels: ["Seleccione lentes de contacto...", ...contactos.map(c => c.marca)],
      col: 6
    },
    {
      label: "Paquete",
      value: idPaquete,
      setter: setIdPaquete,
      type: "select",
      options: ["", ...paquetes.map(p => p.idPaquete)],
      optionLabels: ["Seleccione paquete...", ...paquetes.map(p => p.nombre)],
      col: 12
    },
    {
      label: "Cantidad",
      value: cantidad,
      setter: setCantidad,
      type: "number",
      placeholder: "Cantidad de productos",
      col: 4
    },
    {
      label: "Fecha de Entrega",
      value: fechaEntrega,
      setter: setFechaEntrega,
      type: "date",
      placeholder: "Selecciona fecha",
      col: 6
    },
    {
      label: "Observaciones",
      value: observaciones,
      setter: setObservaciones,
      type: "text",
      placeholder: "Notas adicionales...",
      col: 12
    }
  ];

  const renderField = (field) => (
    <div className={`col-md-${field.col}`} key={field.label}>
      <div className="input-group mb-3">
        <span className="input-group-text crud-input-label" style={{ minWidth: '130px' }}>{field.label}:</span>
        {field.type === "select" ? (
          <select
            className="form-select crud-search-input"
            value={field.value}
            onChange={(e) => field.setter(e.target.value)}
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
    const title = isAdd ? 'Nuevo Pedido' : isEdit ? 'Editar Pedido' : 'Eliminar Pedido';
    const actionHandler = isAdd ? handleAdd : isEdit ? handleUpdate : handleDelete;
    const actionText = isAdd ? 'Registrar Pedido' : isEdit ? 'Actualizar Pedido' : 'Eliminar';
    const actionBtnClass = isAdd ? 'crud-btn-success' : isEdit ? 'crud-btn-primary' : 'crud-btn-danger';

    return (
      <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1">
        <div className={`modal-dialog modal-dialog-centered ${isDelete ? '' : 'modal-lg'}`}>
          <div className="modal-content crud-card" style={{ borderRadius: '10px' }}>
            <div className="modal-header crud-card-header">
              <h5 className="modal-title text-white">{title}</h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => setShow(false)} />
            </div>
            <div className="modal-body crud-card-body">
              {isDelete ? (
                <p className="text-center">
                  ¿Estás seguro de que deseas eliminar el pedido con ID: <strong>{selectedPedido?.idPedido}</strong>?
                </p>
              ) : (
                <div className="row">
                  {formFields.map(renderField)}
                </div>
              )}
            </div>
            <div className="modal-footer crud-card-footer">
              <button className="crud-btn crud-cancel" onClick={() => setShow(false)}>Cancelar</button>
              <button className={`crud-btn ${actionBtnClass}`} onClick={actionHandler}>
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
      <div className={`modal-backdrop fade ${showModal || showEditModal || showDeleteModal ? 'show' : ''}`} style={{ display: showModal || showEditModal || showDeleteModal ? 'block' : 'none' }} />
      {renderModal('add')}
      {renderModal('edit')}
      {renderModal('delete')}
    </>
  );
};
