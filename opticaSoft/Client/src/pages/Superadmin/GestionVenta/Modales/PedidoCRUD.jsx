/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { getTipoLente } from "../../../../api/TipoLente.api.js";
import { getMaterial } from "../../../../api/Material.api.js";
import { getLentesContacto } from "../../../../api/LentesContacto.api.js";
import { getInventario } from "../../../../api/Inventario.api.js";
import { getPaquetes } from "../../../../api/Paquete.api.js";
import { getCotizaciones } from "../../../../api/Cotización.api.js";
import { FaSearch, FaInfoCircle, FaCalendarAlt, FaBoxOpen, FaExclamationTriangle } from "react-icons/fa";

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
  const [modeloBusqueda, setModeloBusqueda] = useState("");
  const [activeTab, setActiveTab] = useState("inventario");
  const [searchResults, setSearchResults] = useState([]);
  const [errors, setErrors] = useState({});

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
        setInventario(inventarioData.filter(i => i.estatus === "Disponible"));
        setPaquetes(paquetesData.filter(p => p.estado === "ACTIVO"));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (modeloBusqueda.length > 0) {
      const results = inventario.filter(i => 
        i.modelo.toLowerCase().includes(modeloBusqueda.toLowerCase()) ||
        i.marca.toLowerCase().includes(modeloBusqueda.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [modeloBusqueda, inventario]);

  const validateForm = () => {
    const newErrors = {};
    if (!fechaEntrega) newErrors.fechaEntrega = "La fecha de entrega es obligatoria";
    if (!cantidad || cantidad < 1) newErrors.cantidad = "La cantidad debe ser al menos 1";
/*     if (!idInventario) newErrors.idInventario = "Debe seleccionar un producto"; */
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (action) => {
    if (!validateForm()) {
      setActiveTab("detalles");
      return;
    }
    action();
  };

  const formFields = [
    {
      label: "Buscar modelo",
      value: modeloBusqueda,
      setter: setModeloBusqueda,
      type: "text",
      placeholder: "Escribe el modelo o marca a buscar...",
      icon: <FaSearch />,
      col: 12,
      tab: "inventario",
      required: true
    },
    {
      label: "Seleccionar inventario",
      value: idInventario,
      setter: setIdInventario,
      type: "select",
      options: ["", ...inventario
        .filter(i => i.modelo.toLowerCase().includes(modeloBusqueda.toLowerCase()) ||
        i.marca.toLowerCase().includes(modeloBusqueda.toLowerCase()))
        .map(i => i.idInventario)],
      optionLabels: ["Seleccione un producto...", ...inventario
        .filter(i => i.modelo.toLowerCase().includes(modeloBusqueda.toLowerCase()) ||
        i.marca.toLowerCase().includes(modeloBusqueda.toLowerCase()))
        .map(i => `${i.modelo} (${i.marca}) - ${i.color} - $${i.precioVenta}`)],
      col: 12,
      tab: "inventario",
      required: true
    },
    {
      label: "Tipo de Lente",
      value: idTipoLente,
      setter: setIdTipoLente,
      type: "select",
      options: ["", ...tiposLente.map(t => t.idTipoLente)],
      optionLabels: ["Seleccione tipo de lente...", ...tiposLente.map(t => `${t.nombre} - $${t.precio}`)],
      col: 6,
      tab: "lentes"
    },
    {
      label: "Material",
      value: idMaterial,
      setter: setIdMaterial,
      type: "select",
      options: ["", ...materiales.map(m => m.idMaterial)],
      optionLabels: ["Seleccione material...", ...materiales.map(m => `${m.nombre} - $${m.precio}`)],
      col: 6,
      tab: "lentes"
    },
    {
      label: "Lentes de Contacto",
      value: idLentesContacto,
      setter: setIdLentesContacto,
      type: "select",
      options: ["", ...contactos.map(c => c.idLentesContacto)],
      optionLabels: ["Seleccione lentes de contacto...", ...contactos.map(c => `${c.marca} - $${c.precio}`)],
      col: 6,
      tab: "lentes"
    },
    {
      label: "Paquete",
      value: idPaquete,
      setter: setIdPaquete,
      type: "select",
      options: ["", ...paquetes.map(p => p.idPaquete)],
      optionLabels: ["Seleccione paquete...", ...paquetes.map(p => `${p.nombre} - $${p.total}`)],
      col: 6,
      tab: "lentes"
    },
    {
      label: "Cantidad",
      value: cantidad,
      setter: setCantidad,
      type: "number",
      placeholder: "Ej. 1, 2, 3...",
      min: 1,
      col: 4,
      tab: "detalles",
      required: true
    },
    {
      label: "Fecha de Entrega",
      value: fechaEntrega,
      setter: setFechaEntrega,
      type: "date",
      placeholder: "Selecciona fecha",
      icon: <FaCalendarAlt />,
      col: 6,
      tab: "detalles",
      required: true
    },
    {
      label: "Observaciones",
      value: observaciones,
      setter: setObservaciones,
      type: "textarea",
      placeholder: "Notas adicionales sobre el pedido...",
      icon: <FaInfoCircle />,
      col: 12,
      tab: "detalles"
    }
  ];

  const renderField = (field) => {
    if (field.tab !== activeTab) return null;
    
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
                  <option key={index} value={option}>{field.optionLabels[index]}</option>
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
                min={field.min || undefined}
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
        {field.label === "Buscar modelo" && searchResults.length > 0 && (
          <div className="mt-2">
            <small className="text-muted">Resultados de búsqueda:</small>
            <div className="list-group mt-1">
              {searchResults.slice(0, 5).map(item => (
                <button
                  key={item.idInventario}
                  type="button"
                  className={`list-group-item list-group-item-action small ${idInventario === item.idInventario ? 'active' : ''}`}
                  onClick={() => {
                    setIdInventario(item.idInventario);
                    setModeloBusqueda(item.modelo);
                    setSearchResults([]);
                  }}
                >
                  {item.modelo} ({item.marca}) - {item.color} - ${item.precioVenta}
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
    const title = isAdd ? 'Nuevo Pedido' : isEdit ? 'Editar Pedido' : 'Eliminar Pedido';
    const actionHandler = isAdd ? handleAdd : isEdit ? handleUpdate : handleDelete;
    const actionText = isAdd ? 'Registrar Pedido' : isEdit ? 'Actualizar' : 'Eliminar';
    const actionBtnClass = isAdd ? 'crud-btn-success' : isEdit ? 'crud-btn-primary' : 'crud-btn-danger';

    const selectedProduct = inventario.find(i => i.idInventario === idInventario);
    const selectedTipoLente = tiposLente.find(t => t.idTipoLente === idTipoLente);
    const selectedMaterial = materiales.find(m => m.idMaterial === idMaterial);
    const selectedContacto = contactos.find(c => c.idLentesContacto === idLentesContacto);
    const selectedPaquete = paquetes.find(p => p.idPaquete === idPaquete);

    return (
      <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1">
        <div className={`modal-dialog modal-dialog-centered ${isDelete ? '' : 'modal-lg'}`}>
          <div className="modal-content crud-card" style={{ borderRadius: '15px' }}>
            <div className="modal-header crud-card-header">
              <h5 className="modal-title text-white">
                <FaBoxOpen className="me-2" />
                {title}
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => {
                setShow(false);
                setErrors({});
              }} />
            </div>
            <div className="modal-body crud-card-body">
              {isDelete ? (
                <div className="text-center p-4">
                  <div className="mb-4">
                    <FaExclamationTriangle className="text-danger fs-1" />
                  </div>
                  <h5>¿Estás seguro de eliminar este pedido?</h5>
                  <p className="text-muted">
                    Pedido ID: <strong>{selectedPedido?.idPedido}</strong>
                  </p>
                </div>
              ) : (
                <>
                  <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'inventario' ? 'active' : ''}`}
                        onClick={() => setActiveTab('inventario')}
                      >
                        Producto
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'lentes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('lentes')}
                      >
                        Lentes
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
                      <h6 className="text-primary">Resumen del Pedido</h6>
                      <div className="row">
                        <div className="col-md-6">
                          <p className="mb-2">
                            <strong>Producto:</strong> {selectedProduct ? 
                              `${selectedProduct.modelo} (${selectedProduct.marca}) - $${selectedProduct.precioVenta}` : 
                              <span className="text-danger">No seleccionado</span>}
                          </p>
                          {selectedTipoLente && (
                            <p className="mb-2">
                              <strong>Tipo de Lente:</strong> {selectedTipoLente.nombre} - ${selectedTipoLente.precio}
                            </p>
                          )}
                          {selectedMaterial && (
                            <p className="mb-2">
                              <strong>Material:</strong> {selectedMaterial.nombre} - ${selectedMaterial.precio}
                            </p>
                          )}
                        </div>
                        <div className="col-md-6">
                          <p className="mb-2">
                            <strong>Cantidad:</strong> {cantidad || <span className="text-danger">No especificada</span>}
                          </p>
                          <p className="mb-2">
                            <strong>Fecha Entrega:</strong> {fechaEntrega ? 
                              new Date(fechaEntrega).toLocaleDateString() : 
                              <span className="text-danger">No especificada</span>}
                          </p>
                          {selectedContacto && (
                            <p className="mb-2">
                              <strong>Lentes Contacto:</strong> {selectedContacto.marca} - ${selectedContacto.precio}
                            </p>
                          )}
                          {selectedPaquete && (
                            <p className="mb-2">
                              <strong>Paquete:</strong> {selectedPaquete.nombre} - ${selectedPaquete.total}
                            </p>
                          )}
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
              <button className="crud-btn crud-cancel" onClick={() => {
                setShow(false);
                setErrors({});
              }}>
                Cancelar
              </button>
              <div>
                {!isDelete && activeTab !== 'detalles' && (
                  <button 
                    className="crud-btn crud-btn-primary me-2" 
                    onClick={() => {
                      if (activeTab === 'inventario') setActiveTab('lentes');
                      if (activeTab === 'lentes') setActiveTab('detalles');
                    }}
                  >
                    Siguiente
                  </button>
                )}
                <button 
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
      <div className={`modal-backdrop fade ${showModal || showEditModal || showDeleteModal ? 'show' : ''}`} 
           style={{ display: showModal || showEditModal || showDeleteModal ? 'block' : 'none' }} />
      {renderModal('add')}
      {renderModal('edit')}
      {renderModal('delete')}
    </>
  );
};