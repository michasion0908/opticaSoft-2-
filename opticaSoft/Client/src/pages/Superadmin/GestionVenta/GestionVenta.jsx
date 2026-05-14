import '../../../assets/css/App.css';
import './estilos.css';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaBoxOpen, FaMoneyBillWave, FaUser, FaShoppingCart, FaFileInvoiceDollar, FaPrint, FaSave, FaTimes, FaCheck, FaCreditCard, FaExchangeAlt, FaQuestionCircle, FaTimesCircle, FaChevronLeft , FaPhoneAlt,FaCalendarAlt } from "react-icons/fa";

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'jspdf-autotable';
import { generarCotizacionPDF } from './CotizacionPDF.jsx';
import { generarTicketVenta } from './Ticket.jsx';

import { getCotizacionesJs, updateCotizacionJs } from '../../../assets/js/Cotizacion.js';
import { getVentasjs, createVentasjs, updateVentasjs } from '../../../assets/js/Venta.js';
import { getPedidosjs, createPedidojs, updatePedidojs, deletePedidojs } from '../../../assets/js/Pedido.js';
import { getPedidosTratamientosJs, createPedidoTratamientoJs, deletePedidoTratamientoJs } from '../../../assets/js/PedidosTratamientos.js';



import { PedidoCRUD } from './Modales/PedidoCRUD.jsx';
import { PedidosTratamientosCRUD } from './Modales/PedidosTratamientosCRUD.jsx';

function GestionVenta() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const idCotizacionParam = params.get("idCotizacion");

  // Estados existentes (manteniendo todos los que ya tienes)
  const [cotizacionData, setCotizacionData] = useState(null);
  const [showEditCotizacionModal, setShowEditCotizacionModal] = useState(false);
  const [descuento, setDescuento] = useState(0);
  const [iva, setIva] = useState(false);
  const [observacionesCotizacion, setObservacionesCotizacion] = useState("");

  const [pedidoList, setPedidoList] = useState([]);
  const [pedidoData, setPedidoData] = useState(null);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [idInventario, setIdInventario] = useState("");
  const [idTipoLente, setIdTipoLente] = useState("");
  const [idMaterial, setIdMaterial] = useState("");
  const [idLentesContacto, setIdLentesContacto] = useState("");
  const [idPaquete, setIdPaquete] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [ventaData, setVentaData] = useState(null);
  const [showVentaModal, setShowVentaModal] = useState(false);
  const [metodoPago, setMetodoPago] = useState("EFECTIVO");
  const [referenciaPago, setReferenciaPago] = useState("");
  const [abono, setAbono] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [pedidosTratamientosList, setPedidosTratamientos] = useState([]);
  const [filteredPedidosTratamientos, setFilteredPedidosTratamientos] = useState([]);
  
  const [idPedido, setIdPedido] = useState("");
  const [idTratamiento, setIdTratamiento] = useState("");
  const [selectedPedidoTratamiento, setSelectedPedidoTratamiento] = useState(null);
  const [showTratamientoModal, setShowTratamientoModal] = useState(false);
  const [showDeleteTratamientoModal, setShowDeleteTratamientoModal] = useState(false);

  // Funciones existentes (manteniendo todas las que ya tienes)
  useEffect(() => {
    if (cotizacionData) {
      setDescuento(cotizacionData.descuento || 0);
      setIva(cotizacionData.iva === 16);
      setObservacionesCotizacion(cotizacionData.observaciones || "");
    }
  }, [cotizacionData]);

  const fetchCotizacionData = () => {
    getCotizacionesJs(data => {
      const cotizacion = data.find(item => item.idCotizacion == idCotizacionParam);
      setCotizacionData(cotizacion || null);
    });
  };

  const fetchVentaData = () => {
    getVentasjs(data => {
      const venta = data.find(item => item.idCotizacion == idCotizacionParam);
      setVentaData(venta || null);
    });
  };

  useEffect(() => {
  if (ventaData) {
    setMetodoPago(ventaData.metodoPago || "EFECTIVO");
    setReferenciaPago(ventaData.referenciaPago || "");
    setAbono(ventaData.abono || 0);
  }
}, [ventaData]);

  useEffect(() => { 
    fetchCotizacionData();
    fetchVentaData();
    getPedidosjs(data => {
      setPedidoList(data);
      const filteredData = data.filter(item => item.idCotizacion == idCotizacionParam);
      setFilteredPedidos(filteredData);
      setPedidoData(filteredData.length > 0 ? filteredData[0] : null);
      
      if (filteredData.length > 0) {
        const pedidoIds = filteredData.map(p => p.idPedido);
        getPedidosTratamientosJs(data => {
          const tratamientosFiltrados = data.filter(item => pedidoIds.includes(item.idPedido));
          setPedidosTratamientos(data);
          setFilteredPedidosTratamientos(tratamientosFiltrados);
        });
      }
    }); 
  }, [idCotizacionParam]);

  const resetForm = () => {
    setIdInventario("");
    setIdTipoLente("");
    setIdMaterial("");
    setIdLentesContacto("");
    setIdPaquete("");
    setCantidad(1);
    setFechaEntrega("");
    setObservaciones("");
  };

  const toNumberOrNull = (value) => {
    if (value === undefined || value === null || value === "") return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  };

  const handleAdd = () => {
    const pedido = {
      idCotizacion: Number(idCotizacionParam),
      idInventario: toNumberOrNull(idInventario),
      idTipoLente: toNumberOrNull(idTipoLente),
      idMaterial: toNumberOrNull(idMaterial),
      idLentesContacto: toNumberOrNull(idLentesContacto),
      idPaquete: toNumberOrNull(idPaquete),
      cantidad, 
      fechaEntrega,
      observaciones
    };

    createPedidojs(pedido, setShowModal, () => {
      getPedidosjs(data => {
        const filteredData = data.filter(item => item.idCotizacion == idCotizacionParam);
        setFilteredPedidos(filteredData);
      });
      fetchCotizacionData();
      resetForm();
    });
  };

  const handleUpdate = () => {
    const pedido = {
      idCotizacion: Number(idCotizacionParam),
      idInventario: toNumberOrNull(idInventario),
      idTipoLente: toNumberOrNull(idTipoLente),
      idMaterial: toNumberOrNull(idMaterial),
      idLentesContacto: toNumberOrNull(idLentesContacto),
      idPaquete: toNumberOrNull(idPaquete),
      cantidad, 
      fechaEntrega,
      observaciones
    };
    
    updatePedidojs(selectedPedido.idPedido, pedido, setShowEditModal, () => {
      getPedidosjs(data => {
        const filteredData = data.filter(item => item.idCotizacion == idCotizacionParam);
        setFilteredPedidos(filteredData);
      });
      fetchCotizacionData();
      resetForm();
    });
  };

  const handleDelete = () => {
    deletePedidojs(selectedPedido.idPedido, setShowDeleteModal, () => {
      getPedidosjs(data => {
        const filteredData = data.filter(item => item.idCotizacion == idCotizacionParam);
        setFilteredPedidos(filteredData);
      });
      fetchCotizacionData();
    });
  };

  const refreshAllData = () => {
    fetchCotizacionData();
    getPedidosjs(data => {
      const filteredData = data.filter(item => item.idCotizacion == idCotizacionParam);
      setFilteredPedidos(filteredData);
      
      if (filteredData.length > 0) {
        const pedidoIds = filteredData.map(p => p.idPedido);
        getPedidosTratamientosJs(data => {
          setFilteredPedidosTratamientos(data.filter(item => pedidoIds.includes(item.idPedido)));
        });
      }
    });
  };

  const handleAddTratamiento = () => {
    if (!idTratamiento || !idPedido) return;
    createPedidoTratamientoJs(
      Number(idTratamiento),
      Number(idPedido),
      setShowTratamientoModal,
      () => {
        const pedidoIds = filteredPedidos.map(p => p.idPedido);
        getPedidosTratamientosJs(data => {
          setFilteredPedidosTratamientos(data.filter(item => pedidoIds.includes(item.idPedido)));
        });
        getPedidosjs(data => {
          const filteredData = data.filter(item => item.idCotizacion == idCotizacionParam);
          setFilteredPedidos(filteredData);
        });
        fetchCotizacionData();
      }
    );
    setIdTratamiento("");
  };
  
  const handleDeleteTratamiento = () => {
    deletePedidoTratamientoJs(selectedPedidoTratamiento.idPedidos_Tratamiento, () => {
      getPedidosTratamientosJs(data => {
        const pedidoIds = filteredPedidos.map(p => p.idPedido);
        setFilteredPedidosTratamientos(data.filter(item => pedidoIds.includes(item.idPedido)));
      });
      getPedidosjs(data => {
        const filteredData = data.filter(item => item.idCotizacion == idCotizacionParam);
        setFilteredPedidos(filteredData);
      });  
      fetchCotizacionData();
    }, setShowDeleteTratamientoModal);
  };

  const handleCreateVenta = () => {
    if (!cotizacionData) return;
    createVentasjs(
      Number(idCotizacionParam),
      'PENDIENTE',
      metodoPago,
      referenciaPago,
      cotizacionData.total,
      abono,
      setShowVentaModal,
      () => {
        fetchVentaData();
        fetchCotizacionData();
      }
    );
  };

  const handleUpdateVenta = () => {
    if (!ventaData) return;
    updateVentasjs(
      ventaData.idVenta,
      Number(idCotizacionParam),
      ventaData.estado,
      metodoPago,
      referenciaPago,
      cotizacionData.total,
      abono,
      setShowVentaModal,
      () => {
        fetchVentaData();
        fetchCotizacionData();
      }
    );
  };

  const handleUpdateCotizacion = () => {
    updateCotizacionJs(
      cotizacionData.idCotizacion,
      cotizacionData.idPaciente ? Number(cotizacionData.idPaciente) : null,
      cotizacionData.tipo, 
      cotizacionData.subtotal, 
      descuento ? Number(descuento) : null, 
      iva ? 16 : 0,
      cotizacionData.total, 
      observacionesCotizacion,
      setShowEditCotizacionModal,
      (updatedData) => {
        setCotizacionData(prev => ({
          ...prev,
          descuento: descuento ? Number(descuento) : null,
          iva: iva ? 16 : 0,
          observaciones: observacionesCotizacion,
          total: updatedData?.total || prev.total
        }));
        fetchCotizacionData();
      }
    );
  };

  const searchFilteredData = filteredPedidos.filter(item =>
    (item?.Producto ?? "").toLowerCase().includes(searchText.toLowerCase()) ||
    (item?.TipoLente ?? "").toLowerCase().includes(searchText.toLowerCase()) ||
    (item?.Material ?? "").toLowerCase().includes(searchText.toLowerCase())
  );

  const formatDateString = (dateString) => {
    return dateString ? dateString.split('T')[0] : "";
  };

  const getTratamientosByPedido = (pedidoId) => {
    return filteredPedidosTratamientos.filter(trat => trat.idPedido === pedidoId);
  };

  if (!idCotizacionParam) {
    return <div className="alert alert-warning text-center mt-4 shadow-sm">
      <i className="bi bi-exclamation-triangle-fill me-2"></i>
      Acceso denegado: Falta seleccionar una Cotización.
    </div>;
  }

const handleGenerarPDF = () => {
  generarCotizacionPDF(
    cotizacionData,
    searchFilteredData,
    getTratamientosByPedido,
    formatDateString,
    observacionesCotizacion
  );
};

const handlegenerarTicketVenta = () => {
  generarTicketVenta(
    cotizacionData,
    searchFilteredData,
    getTratamientosByPedido,
    formatDateString,
    observacionesCotizacion
  );
};

generarTicketVenta

  return (
  <div className="cotizacion-container">
    {/* Breadcrumbs con estilo mejorado */}
    <nav aria-label="breadcrumb" className="custom-breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/gestionCotizacion" className="breadcrumb-link">
            <FaChevronLeft className="me-1" size={12} />
            Cotizaciones
          </Link>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          <span className="badge bg-primary-light text-primary">
            #{cotizacionData?.codigo || 'N/A'}
          </span>
        </li>
      </ol>
    </nav>

    <div className="row g-4">
      {/* Panel de Cotización (Izquierda) */}
      <div className="col-lg-8">
        <div className="card shadow-sm border-0">
          {/* Header con efecto de gradiente */}
          <div className="card-header bg-gradient-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 d-flex align-items-center">
                <FaFileInvoiceDollar className="me-2" />
                Cotización #{cotizacionData?.codigo || 'N/A'}
              </h5>
              <span className="badge bg-white text-primary">
                {formatDateString(cotizacionData?.fechaRegistro) || 'N/A'}
              </span>
            </div>
          </div>

          {/* Sección de Datos del Paciente con diseño de tarjeta */}
          <div className="card-body patient-section">
            <div className="d-flex align-items-center mb-3 section-title">
              <div className="icon-circle bg-primary-light text-primary">
                <FaUser />
              </div>
              <h6 className="mb-0 ms-2">Datos del Paciente</h6>
            </div>
            
            <div className="row g-3">
              <div className="col-md-6">
                <div className="info-card">
                  <label>Nombre completo</label>
                  <p className="value">{cotizacionData?.nombrePaciente || 'No especificado'}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="info-card">
                  <label>Teléfono</label>
                  <p className="value">
                    {cotizacionData?.telefono || 'No especificado'}
                    {cotizacionData?.telefono && (
                      <a href={`tel:${cotizacionData.telefono}`} className="ms-2 text-primary">
                        <FaPhoneAlt size={12} />
                      </a>
                    )}
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="info-card">
                  <label>Dirección</label>
                  <p className="value">
                    {cotizacionData?.direccion || 'No especificado'}
                    {cotizacionData?.localidad && `, ${cotizacionData.localidad}`}
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="info-card">
                  <label>Fecha de registro</label>
                  <p className="value">{formatDateString(cotizacionData?.fechaRegistro) || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Pedidos con diseño mejorado */}
          <div className="card-body pedidos-section">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center section-title">
                <div className="icon-circle bg-primary-light text-primary">
                  <FaShoppingCart />
                </div>
                <h6 className="mb-0 ms-2">Pedidos</h6>
              </div>
              <button
                className="btn btn-primary btn-icon"
                onClick={() => {
                  resetForm();
                  setSelectedPedido(null);
                  setShowModal(true);
                }}
              >
                <FaPlus className="me-1" /> Agregar Pedido
              </button>
            </div>

            {searchFilteredData.length > 0 ? (
              <div className="pedidos-list">
                {searchFilteredData.map((pedido) => {
                  const tratamientos = getTratamientosByPedido(pedido.idPedido);
                  return (
                    <div key={pedido.idPedido} className="pedido-card">
                      <div className="pedido-header">
                        <div className="d-flex align-items-center">
                          <span className="pedido-number">Pedido #{pedido.idPedido}</span>
                          {pedido.fechaEntrega && (
                            <span className="delivery-date ms-3">
                              <FaCalendarAlt className="me-1" />
                              {formatDateString(pedido.fechaEntrega)}
                            </span>
                          )}
                        </div>
                        <div className="pedido-actions">
                          <button
                            className="btn btn-sm btn-icon btn-outline-warning me-1"
                            onClick={() => {
                              setShowEditModal(true);
                              setSelectedPedido(pedido);
                              setIdInventario(pedido.idInventario);
                              setIdTipoLente(pedido.idTipoLente);
                              setIdMaterial(pedido.idMaterial);
                              setIdLentesContacto(pedido.idLentesContacto);
                              setIdPaquete(pedido.idPaquete);
                              setCantidad(pedido.cantidad);
                              setFechaEntrega(formatDateString(pedido.fechaEntrega));
                              setObservaciones(pedido.observaciones);
                            }}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-icon btn-outline-danger"
                            onClick={() => {
                              setShowDeleteModal(true);
                              setSelectedPedido(pedido);
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      
                      <div className="pedido-content">
                        {/* Productos del pedido */}
                        <div className="productos-section">
                          <h6 className="section-subtitle">Productos</h6>
                          <ul className="productos-list">
                            {pedido.modelo && (
                              <li className="producto-item">
                                <div className="d-flex justify-content-between">
                                  <span>
                                    <strong>{pedido.marca} - {pedido.modelo}</strong>
                                    {pedido.precioArmazon && (
                                      <span className="price-badge">${pedido.precioArmazon}</span>
                                    )}
                                  </span>
                                </div>
                                {pedido.modelo && pedido.armazon && (
                                  <div className="producto-details">
                                    {pedido.modelo} - {pedido.armazon}
                                  </div>
                                )}
                              </li>
                            )}
                            {pedido.tipoLente && (
                              <li className="producto-item">
                                <div className="d-flex justify-content-between">
                                  <span>
                                    <strong>Lente:</strong> {pedido.tipoLente}
                                    {pedido.precioLente && (
                                      <span className="price-badge">${pedido.precioLente}</span>
                                    )}
                                  </span>
                                </div>
                              </li>
                            )}
                            {pedido.material && (
                              <li className="producto-item">
                                <div className="d-flex justify-content-between">
                                  <span>
                                    <strong>Material:</strong> {pedido.material}
                                    {pedido.precioMaterial && (
                                      <span className="price-badge">${pedido.precioMaterial}</span>
                                    )}
                                  </span>
                                </div>
                              </li>
                            )}
                            {pedido.marcaLentesContacto && (
                              <li className="producto-item">
                                <div className="d-flex justify-content-between">
                                  <span>
                                    <strong>Lente Contacto:</strong> {pedido.marcaLentesContacto}
                                    {pedido.precioLentesContacto && (
                                      <span className="price-badge">${pedido.precioLentesContacto}</span>
                                    )}
                                  </span>
                                </div>
                              </li>
                            )}
                            {pedido.paquete && (
                              <li className="producto-item">
                                <div className="d-flex justify-content-between">
                                  <span>
                                    <strong>Paquete:</strong> {pedido.paquete}
                                    {pedido.precioPaquete && (
                                      <span className="price-badge">${pedido.precioPaquete}</span>
                                    )}
                                  </span>
                                </div>
                              </li>
                            )}
                          </ul>
                          {pedido.observaciones && (
                            <div className="observaciones">
                              <strong>Notas:</strong> {pedido.observaciones}
                            </div>
                          )}
                        </div>

                        {/* Tratamientos del pedido */}
                        {tratamientos.length > 0 && (
                          <div className="tratamientos-section">
                            <h6 className="section-subtitle">Tratamientos</h6>
                            <ul className="tratamientos-list">
                              {tratamientos.map(trat => (
                                <li key={trat.idPedidos_Tratamiento} className="tratamiento-item">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <span>{trat.nombreTratamiento}</span>
                                      {trat.precioTratamiento && (
                                        <span className="price-badge">${trat.precioTratamiento}</span>
                                      )}
                                    </div>
                                    <button 
                                      className="btn btn-sm btn-icon btn-link text-danger"
                                      onClick={() => {
                                        setSelectedPedidoTratamiento(trat);
                                        setShowDeleteTratamientoModal(true);
                                      }}
                                    >
                                      <FaTrash size={12} />
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Botón para agregar tratamiento */}
                        <button
                          className="btn btn-outline-primary btn-sm btn-add-tratamiento"
                          onClick={() => {
                            setIdPedido(pedido.idPedido);
                            setShowTratamientoModal(true);
                          }}
                        >
                          <FaPlus className="me-1" /> Agregar Tratamiento
                        </button>

                        {/* Resumen del pedido */}
                        <div className="pedido-summary">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="quantity">Cantidad: {pedido.cantidad}</span>
                            <span className="total">Total: <strong>${pedido.total}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <FaBoxOpen size={48} className="text-muted" />
                </div>
                <h5 className="empty-title">
                  {filteredPedidos.length === 0
                    ? "No hay pedidos registrados"
                    : "No se encontraron resultados"}
                </h5>
                <p className="empty-text">Agrega nuevos pedidos para comenzar</p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    resetForm();
                    setSelectedPedido(null);
                    setShowModal(true);
                  }}
                >
                  <FaPlus className="me-1" /> Agregar primer pedido
                </button>
              </div>
            )}
          </div>

          {/* Sección de Notas y Totales con diseño mejorado */}
          <div className="card-footer summary-section">
            <div className="notes-section mb-4">
              <label className="form-label">Observaciones</label>
              <textarea 
                className="form-control" 
                rows="3" 
                value={observacionesCotizacion}
                onChange={(e) => setObservacionesCotizacion(e.target.value)}
                placeholder="Agregar notas adicionales..."
              />
            </div>

            <div className="discount-section mb-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Descuento</label>
                  <div className="input-group">
                    <span className="input-group-text">%</span>
                    <input
                      type="number"
                      className="form-control"
                      value={descuento}
                      onChange={(e) => setDescuento(e.target.value)}
                      min="0"
                      max="100"
                      step="1"
                    />
                  </div>
                </div>
                <div className="col-md-6 d-flex align-items-end">
                  <div className="form-check form-switch iva-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="ivaSwitch"
                      checked={iva}
                      onChange={(e) => setIva(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="ivaSwitch">
                     &nbsp; &nbsp; Aplicar IVA (16%)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="totals-section mb-4">
              <div className="totals-card">
                <div className="total-item">
                  <span>Subtotal:</span>
                  <span>${cotizacionData?.subtotal || '0.00'}</span>
                </div>
                <div className="total-item">
                  <span>Descuento:</span>
                  <span className="text-danger">-${(cotizacionData?.subtotal * (cotizacionData?.descuento || 0) / 100).toFixed(2) || '0.00'}</span>
                </div>
                <div className="total-item">
                  <span>IVA (16%):</span>
                  <span>{cotizacionData?.iva ? `$${(cotizacionData.subtotal * 0.16).toFixed(2)}` : '$0.00'}</span>
                </div>
                <div className="total-item grand-total">
                  <span>Total:</span>
                  <span>${cotizacionData?.total || '0.00'}</span>
                </div>
              </div>
            </div>

            <div className="actions-section d-flex justify-content-between">
{/*               <button className="btn btn-outline-secondary btn-print">
                <FaPrint className="me-1" /> Imprimir
              </button> */}

            
<button 
  className="btn btn-outline-secondary btn-print"
  onClick={handleGenerarPDF}
>
  <FaPrint className="me-1" /> Descargar Cotización
</button>

<button 
  className="btn btn-outline-secondary btn-print"
  onClick={handlegenerarTicketVenta}
>
  <FaPrint className="me-1" /> Descargar ticket
</button>


              <button 
                className="btn btn-primary btn-save"
                onClick={handleUpdateCotizacion}
              >
                <FaSave className="me-1" /> Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de Venta (Derecha) */}
      <div className="col-lg-4">
        <div className="card shadow-sm border-0 sale-card">
          <div className="card-header bg-gradient-primary text-white">
            <h5 className="mb-0 d-flex align-items-center">
              <FaMoneyBillWave className="me-2" />
              {ventaData ? 'Editar Venta' : 'Proceso de Venta'}
            </h5>
          </div>

          <div className="card-body">
            {/* Resumen de Cotización */}
            <div className="quote-summary alert alert-primary">
              <div className="d-flex justify-content-between align-items-center">
                <span>Total de la Cotización:</span>
                <h4 className="mb-0">${cotizacionData?.total || '0.00'}</h4>
              </div>
            </div>

            {/* Estado de Venta */}
            {ventaData ? (
              <div className="sale-status mb-4">
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label>Estado:</label>
                  </div>
                  <div className="col-6">
                    <select 
                      className="form-select form-select-sm"
                      value={ventaData.estado}
                      onChange={(e) => setVentaData({...ventaData, estado: e.target.value})}
                    >
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="LIQUIDADO">Liquidado</option>
                      <option value="CANCELADO">Cancelado</option>
                    </select>
                  </div>
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label>Fecha Venta:</label>
                  </div>
                  <div className="col-6">
                    <span className="text-muted">{formatDateString(ventaData.fechaRegistro) || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-warning mb-4 d-flex align-items-center">
                <FaTimesCircle className="me-2" />
                <span>Esta cotización no tiene una venta asociada</span>
              </div>
            )}

            {/* Método de Pago */}
            <div className="payment-method mb-4">
              <h6 className="section-title">Método de Pago</h6>
              <div className="payment-options">
                {["EFECTIVO", "TARJETA", "TRANSFERENCIA", "OTRO"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={`payment-option ${metodoPago === method ? 'active' : ''}`}
                    onClick={() => setMetodoPago(method)}
                  >
                    {method === "TARJETA" ? (
                      <FaCreditCard className="me-1" />
                    ) : method === "EFECTIVO" ? (
                      <FaMoneyBillWave className="me-1" />
                    ) : method === "TRANSFERENCIA" ? (
                      <FaExchangeAlt className="me-1" />
                    ) : (
                      <FaQuestionCircle className="me-1" />
                    )}
                    {method}
                  </button>
                ))}
              </div>
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Referencia de pago"
                value={referenciaPago}
                onChange={(e) => setReferenciaPago(e.target.value)}
              />
            </div>

            {/* Abono y Saldo */}
            <div className="payment-details mb-4">
              <h6 className="section-title">Detalles de Pago</h6>
              <div className="input-group mb-3">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className="form-control"
                  value={abono}
                  onChange={(e) => setAbono(Number(e.target.value))}
                  min="0"
                  max={cotizacionData?.total || 0}
                  step="0.01"
                  placeholder="Monto abonado"
                />
              </div>
              <div className="payment-summary">
                <div className="payment-item">
                  <span>Total:</span>
                  <span>${cotizacionData?.total || '0.00'}</span>
                </div>
                <div className="payment-item">
                  <span>Abono:</span>
                  <span className="text-success">${Number(abono || 0).toFixed(2)}</span>
                </div>
                <div className="payment-item total">
                  <span>Saldo Pendiente:</span>
                  <span className="text-danger">${(cotizacionData?.total - abono).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="sale-actions">
              {ventaData ? (
                <button
                  className="btn btn-primary w-100"
                  onClick={handleUpdateVenta}
                >
                  <FaSave className="me-1" /> Guardar Cambios
                </button>
              ) : (
                <button
                  className="btn btn-success w-100"
                  onClick={handleCreateVenta}
                >
                  <FaCheck className="me-1" /> Finalizar Venta
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Modales (se mantienen igual que en tu código original) */}
    {!ventaData && showVentaModal && (
      <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Crear Venta</h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => setShowVentaModal(false)}></button>
            </div>
            <div className="modal-body">
              {/* ... (contenido del modal de creación de venta se mantiene igual) */}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowVentaModal(false)}>
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleCreateVenta}
              >
                Crear Venta
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Modales para Pedidos y Tratamientos */}
    <PedidoCRUD
      formData={{
        idCotizacion: idCotizacionParam,
        idInventario, setIdInventario,
        idTipoLente, setIdTipoLente,
        idMaterial, setIdMaterial,
        idLentesContacto, setIdLentesContacto,
        idPaquete, setIdPaquete,
        cantidad, setCantidad,
        fechaEntrega, setFechaEntrega,
        observaciones, setObservaciones
      }}
      modals={{
        showModal, setShowModal,
        showEditModal, setShowEditModal,
        showDeleteModal, setShowDeleteModal
      }}
      handlers={{
        handleAdd, handleUpdate, handleDelete
      }}
      selectedPedido={selectedPedido}
    />

    <PedidosTratamientosCRUD
      formData={{
        idTratamiento, setIdTratamiento,
        idPedido, setIdPedido
      }}
      modals={{
        showModal: showTratamientoModal, 
        setShowModal: setShowTratamientoModal,
        showDeleteModal: showDeleteTratamientoModal,
        setShowDeleteModal: setShowDeleteTratamientoModal
      }}
      handlers={{
        handleAdd: handleAddTratamiento,
        handleDelete: handleDeleteTratamiento
      }}
      selectedPedidoTratamiento={selectedPedidoTratamiento}
    />
  </div>
);
}

export default GestionVenta;