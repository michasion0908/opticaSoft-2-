import '../../../assets/css/App.css';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaList, FaBoxes, FaBoxOpen, FaClipboardList, FaMoneyBillWave } from "react-icons/fa";

import { getCotizacionesJs,   updateCotizacionJs, } from '../../../assets/js/Cotizacion.js';


import { getVentasjs, createVentasjs, updateVentasjs } from '../../../assets/js/Venta.js';

// Importaciones existentes
import {
  getPedidosjs,
  createPedidojs,
  updatePedidojs,
  deletePedidojs
} from '../../../assets/js/Pedido.js';

// Nuevas importaciones para tratamientos
import {
  getPedidosTratamientosJs,
  createPedidoTratamientoJs,
  deletePedidoTratamientoJs
} from '../../../assets/js/PedidosTratamientos.js';

import { PedidoCRUD } from './../PedidoCRUD.jsx';
import { PedidosTratamientosCRUD } from './../PedidosTratamientosCRUD.jsx';

function GestionVenta() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const idCotizacionParam = params.get("idCotizacion");

  const [cotizacionData, setCotizacionData] = useState(null);
  // Agregar cerca de los otros estados
  const [showEditCotizacionModal, setShowEditCotizacionModal] = useState(false);
  const [descuento, setDescuento] = useState(0);
  const [iva, setIva] = useState(false);
  const [observacionesCotizacion, setObservacionesCotizacion] = useState("");

  // Estados existentes para Pedidos...
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

  // Nuevos estados para Pedidos-Tratamientos
  const [pedidosTratamientosList, setPedidosTratamientos] = useState([]);
  const [filteredPedidosTratamientos, setFilteredPedidosTratamientos] = useState([]);
  const [idPedido, setIdPedido] = useState("");
  const [idTratamiento, setIdTratamiento] = useState("");
  const [selectedPedidoTratamiento, setSelectedPedidoTratamiento] = useState(null);

  // Modales para tratamientos
  const [showTratamientoModal, setShowTratamientoModal] = useState(false);
  const [showDeleteTratamientoModal, setShowDeleteTratamientoModal] = useState(false);

  useEffect(() => {
  if (cotizacionData) {
    setDescuento(cotizacionData.descuento || 0);
    setIva(cotizacionData.iva === 16); // IVA siempre será true/false para 16%
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
     fetchCotizacionData();
     fetchVentaData();
    // Cargar pedidos
    getPedidosjs(data => {
      setPedidoList(data);
      const filteredData = data.filter(item => item.idCotizacion == idCotizacionParam);
      setFilteredPedidos(filteredData);
      setPedidoData(filteredData.length > 0 ? filteredData[0] : null);
      
      // Cargar tratamientos para los pedidos filtrados
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

  if (!idCotizacionParam) {
    return <div className="alert alert-warning text-center mt-4 shadow-sm">
      <i className="bi bi-exclamation-triangle-fill me-2"></i>
      Acceso denegado: Falta seleccionar una Cotización.
    </div>;
  }

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

  // Para mandar ints vacíos
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

//REFRESCAR TABLA PEDIDO
  const refreshAllData = () => {
    fetchCotizacionData();
    // Actualizar pedidos
    getPedidosjs(data => {
      const filteredData = data.filter(item => item.idCotizacion == idCotizacionParam);
      setFilteredPedidos(filteredData);
      
      // Actualizar tratamientos para los pedidos filtrados
      if (filteredData.length > 0) {
        const pedidoIds = filteredData.map(p => p.idPedido);
        getPedidosTratamientosJs(data => {
          setFilteredPedidosTratamientos(data.filter(item => pedidoIds.includes(item.idPedido)));
        });
      }
    });
  };
  


  // Funciones corregidas para Tratamientos
  const handleAddTratamiento = () => {
    if (!idTratamiento || !idPedido) {
      console.error("Faltan datos requeridos");
      return;
    }
    createPedidoTratamientoJs(
      Number(idTratamiento),
      Number(idPedido),
      setShowTratamientoModal,
      () => {
        const pedidoIds = filteredPedidos.map(p => p.idPedido);
        getPedidosTratamientosJs(data => {
          setFilteredPedidosTratamientos(data.filter(item => pedidoIds.includes(item.idPedido)));
        });

            // Actualizar la lista de pedidos también
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

          // Actualizar la lista de pedidos también
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
  setShowVentaModal,             // este es el setShowModal
  () => {                        // este es getVentasjs
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
    setShowVentaModal, // <-- este es setShowModal
    () => {             // <-- este es getVentasjs
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
    // Nota: El total debería ser recalculado en el backend
    cotizacionData.total, 
    observacionesCotizacion,
    setShowEditCotizacionModal,
    (updatedData) => {  // Aceptar los datos actualizados como parámetro
      // Actualizar el estado local con los nuevos datos
      setCotizacionData(prev => ({
        ...prev,
        descuento: descuento ? Number(descuento) : null,
        iva: iva ? 16 : 0,
        observaciones: observacionesCotizacion,
        // Actualizar el total si el backend lo devuelve
        total: updatedData?.total || prev.total
      }));
      // Opcional: Recargar datos completos si es necesario
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

  // Función para obtener tratamientos por pedido
  const getTratamientosByPedido = (pedidoId) => {
    return filteredPedidosTratamientos.filter(trat => trat.idPedido === pedidoId);
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
          <FaBoxes className="me-2" style={{ color: 'var(--crud-primary)' }} />
          Pedidos de la Cotización: {cotizacionData?.codigo || 'N/A'}
        </h2>

        <div className="d-flex flex-wrap gap-2">
          <button className="crud-btn crud-btn-primary text-white">
            <FaList className="me-1" /> Lista
          </button>
          <button
            className="crud-btn crud-btn-success text-white"
            onClick={() => {
              resetForm();
              setSelectedPedido(null);
              setShowModal(true);
            }}
          >
            <FaPlus className="me-1" /> Nuevo Pedido
          </button>

{!ventaData && (
  <button
    className="crud-btn crud-btn-info text-white"
    onClick={() => {
      setShowVentaModal(true);
      setMetodoPago("EFECTIVO");
      setReferenciaPago("");
      setAbono(cotizacionData?.total || 0);
    }}
  >
    <FaMoneyBillWave className="me-1" /> Crear Venta
  </button>
)}

        </div>
      </div>

      {/* Breadcrumbs */}
      <div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/gestionCotizacion" className="text-decoration-none">Cotizaciones</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page"> {pedidoData?.codigo || 'N/A'}</li>
          </ol>
        </nav>
      </div>
      {/* END Breadcrumbs */}

{ventaData && (
  <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
    <div className="card-header bg-primary text-white py-3">
      <h5 className="mb-0">
        <FaMoneyBillWave className="me-2" />
        Información de la Venta
      </h5>
    </div>
    <div className="card-body">
      <div className="row">
        <div className="col-md-4">
          <p className="mb-2"><strong>Estado:</strong> 
            <span className={`badge ms-2 ${
              ventaData.estado === 'LIQUIDADO' ? 'bg-success' : 
              ventaData.estado === 'CANCELADO' ? 'bg-danger' : 'bg-warning'
            }`}>
              {ventaData.estado}
            </span>
          </p>
        </div>
        <div className="col-md-4">
          <p className="mb-2"><strong>Método de Pago:</strong> {ventaData.metodoPago}</p>
        </div>
        <div className="col-md-4">
          <p className="mb-2"><strong>Referencia:</strong> {ventaData.referenciaPago || 'N/A'}</p>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-4">
          <p className="mb-2"><strong>Total:</strong> ${ventaData.total}</p>
        </div>
        <div className="col-md-4">
          <p className="mb-2"><strong>Abono:</strong> ${ventaData.abono}</p>
        </div>
        <div className="col-md-4">
          <p className="mb-2"><strong>Saldo Pendiente:</strong> ${ventaData.debe}</p>
        </div>
      </div>
      <div className="mt-3 d-flex justify-content-end">
        <button
          className="btn btn-sm btn-warning text-white"
          onClick={() => {
            setShowVentaModal(true);
            setMetodoPago(ventaData.metodoPago);
            setReferenciaPago(ventaData.referenciaPago);
            setAbono(ventaData.abono);
          }}
        >
          <FaEdit className="me-1" /> Editar Venta
        </button>
      </div>
    </div>
  </div>
)}

      {/* ----------------------- CARD ------------------------------------------*/}
      <div className="card border-0 shadow-sm" style={{
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {/* Encabezado limpio con color primario */}
        <div className="card-header border-0 py-3 px-4" style={{
          backgroundColor: 'var(--crud-primary)'
        }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <div className="mb-2 mb-md-0">
              <h5 className="mb-2 text-white fw-semibold">
                {cotizacionData?.Cotizacion || 'Cotización'} {cotizacionData?.codigo || 'Cotización'}
              </h5>
              <div className="d-flex flex-wrap gap-3 text-white text-opacity-85 small">
                <span className="d-flex align-items-center">
                  <i className="bi bi-card-text me-2"></i>
                  {cotizacionData?.nombrePaciente || 'Sin cliente'}
                </span>
                <span className="d-flex align-items-center">
                  <i className="bi bi-calendar3 me-2"></i>
                  {formatDateString(cotizacionData?.fechaRegistro) || 'N/A'}
                </span>
                 <span className="d-flex align-items-center">
                  <i className="bi bi-calendar3 me-2"></i>
                  {pedidoData?.totalCotizacion || 'N/A'}
                </span>
               

             <span className="d-flex align-items-center">
                  <i className="bi bi-calendar3 me-2"></i>
                  {cotizacionData?.observaciones || 'N/A'}
            </span>
             <span className="d-flex align-items-center">
                  <i className="bi bi-calendar3 me-2"></i>
                  {cotizacionData?.iva|| 'N/A'}
            </span>
             <span className="d-flex align-items-center">
                  <i className="bi bi-calendar3 me-2"></i>
                  {cotizacionData?.descuento || 'N/A'}
            </span>
            </div>


            <div className="d-flex align-items-center gap-3">
  <button 
    className="btn btn-sm btn-warning text-white"
    onClick={() => setShowEditCotizacionModal(true)}
  >
    <FaEdit className="me-1" /> Editar Cotización
  </button>
</div>
            

            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="badge bg-white text-dark rounded-pill px-3 py-2">
                <i className="bi bi-tag me-2" style={{ color: 'var(--crud-primary)' }}></i>
                {cotizacionData?.idCotizacion || 'N/A'}
              </span>
              <span className="text-white fw-bold fs-5">
                ${cotizacionData?.total || '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="py-3 text-muted fw-medium small text-uppercase">Producto(s)</th>            
                  <th className="py-3 text-muted fw-medium small text-uppercase">Cantidad</th>
                  <th className="py-3 text-muted fw-medium small text-uppercase">Total Pedido</th> 
                  <th className="py-3 text-muted fw-medium small text-uppercase">Fecha Entrega</th>
                  <th className="py-3 text-muted fw-medium small text-uppercase">Tratamientos</th>
                  <th className="pe-4 py-3 text-end text-muted fw-medium small text-uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {searchFilteredData.length > 0 ? (
                  searchFilteredData.map((pedido) => {
                    const tratamientos = getTratamientosByPedido(pedido.idPedido);
                    return (
                      <tr key={pedido.idPedido}>
                        <td className="small">{pedido.Producto || 'Paquete'}
                          <div style={{ padding: '0.5rem 0' }}>
                            <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem', listStyleType: 'square' }}>
                              {pedido.modelo && pedido.armazon && (
                                <li>
                                  <strong>Armazón:</strong> {pedido.modelo} - {pedido.armazon}
                                  {pedido.precioArmazon ? ` - $${pedido.precioArmazon}` : ''}
                                </li>
                              )}
                              {pedido.tipoLente && (
                                <li><strong>Lente:</strong> {pedido.tipoLente} - ${pedido.precioLente}</li>
                              )}
                              {pedido.material && (
                                <li><strong>Material:</strong> {pedido.material} - ${pedido.precioMaterial}</li>
                              )}
                              {pedido.marcaLentesContacto && (
                                <li><strong> Lente Contacto:</strong> {pedido.marcaLentesContacto} - ${pedido.precioLentesContacto}</li>
                              )}
                              {pedido.paquete && (
                                <li><strong>Paquete:</strong> {pedido.paquete} - ${pedido.precioPaquete}</li>
                              )}
                            </ul> 
                            <small className="text-muted">{pedido.observaciones}</small>  
                          </div>
                        </td>

                        <td className="small">{pedido.cantidad}</td>
                        <td className="small">{pedido.total}</td>
                        <td className="small">{formatDateString(pedido.fechaEntrega)}</td>
                        
                        {/* Columna de Tratamientos */}
                        <td className="small">
                          {tratamientos.length > 0 ? (
                            <ul className="list-unstyled mb-0">
                              {tratamientos.map(trat => (
                                <li key={trat.idPedidos_Tratamiento} className="d-flex justify-content-between align-items-center">
                                  <span>{trat.nombreTratamiento} - ${trat.precioTratamiento}</span>
                                  <button 
                                    className="btn btn-sm btn-link text-danger p-0"
                                    onClick={() => {
                                      setSelectedPedidoTratamiento(trat);
                                      setShowDeleteTratamientoModal(true);
                                    }}
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-muted">Sin tratamientos</span>
                          )}
                        </td>
                        
                        <td className="pe-4 text-end">
                          <div className="d-flex gap-2 justify-content-end">
                            <button
                              className="btn btn-sm btn-primary rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: '32px', height: '32px' }}
                              onClick={() => {
                                setIdPedido(pedido.idPedido);
                                setShowTratamientoModal(true);
                              }}
                              title="Añadir tratamiento"
                            >
                              <FaClipboardList size={12} />
                            </button>
                            <button
                              className="btn btn-sm btn-warning text-white rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: '32px', height: '32px' }}
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
                              title="Editar pedido"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: '32px', height: '32px' }}
                              onClick={() => {
                                setShowDeleteModal(true);
                                setSelectedPedido(pedido);
                              }}
                              title="Eliminar pedido"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div className="py-4">
                        <div className="bg-light rounded-circle d-inline-flex p-3 mb-3">
                          <FaBoxOpen size={28} className="text-muted" />
                        </div>
                        <h5 className="fw-normal text-dark mb-1">
                          {filteredPedidos.length === 0
                            ? "No hay pedidos registrados"
                            : "No se encontraron resultados"}
                        </h5>
                        <p className="small text-muted">Agrega nuevos pedidos para comenzar</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
{showVentaModal && (
  <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header bg-primary text-white">
          <h5 className="modal-title">
            {ventaData ? 'Editar Venta' : 'Crear Venta'}
          </h5>
          <button type="button" className="btn-close btn-close-white" onClick={() => setShowVentaModal(false)}></button>
        </div>
        <div className="modal-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Método de Pago</label>
              <select 
                className="form-select"
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
              >
                <option value="EFECTIVO">Efectivo</option>
                <option value="TRANSFERENCIA">Transferencia</option>
                <option value="TARJETA DÉBITO">Tarjeta Débito</option>
                <option value="TARJETA CRÉDITO">Tarjeta Crédito</option>
                <option value="CHEQUES">Cheques</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Referencia de Pago</label>
              <input
                type="text"
                className="form-control"
                value={referenciaPago}
                onChange={(e) => setReferenciaPago(e.target.value)}
                placeholder="Número de transacción, cheque, etc."
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Total</label>
              <input
                type="text"
                className="form-control"
                value={cotizacionData?.total || 0}
                readOnly
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Abono Inicial</label>
              <input
                type="number"
                className="form-control"
                value={abono}
                onChange={(e) => setAbono(Number(e.target.value))}
                min="0"
                max={cotizacionData?.total || 0}
                step="0.01"
              />
            </div>
          </div>
          {ventaData && (
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Estado</label>
                <select 
                  className="form-select"
                  value={ventaData.estado}
                  onChange={(e) => setVentaData({...ventaData, estado: e.target.value})}
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="LIQUIDADO">Liquidado</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Saldo Pendiente</label>
                <input
                  type="text"
                  className="form-control"
                  value={cotizacionData?.total - abono}
                  readOnly
                />
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => setShowVentaModal(false)}>
            Cancelar
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={ventaData ? handleUpdateVenta : handleCreateVenta}
          >
            {ventaData ? 'Actualizar Venta' : 'Crear Venta'}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
{/* Modal para editar cotización */}
{showEditCotizacionModal && (
  <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header bg-primary text-white">
          <h5 className="modal-title">Editar Cotización</h5>
          <button 
            type="button" 
            className="btn-close btn-close-white" 
            onClick={() => setShowEditCotizacionModal(false)}
          ></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label">Descuento</label>
            <input
              type="number"
              className="form-control"
              value={descuento}
              onChange={(e) => setDescuento(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="ivaCheckbox"
              checked={iva}
              onChange={(e) => setIva(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="ivaCheckbox">
              Aplicar IVA (16%)
            </label>
          </div>
          <div className="mb-3">
            <label className="form-label">Observaciones</label>
            <textarea
              className="form-control"
              value={observacionesCotizacion}
              onChange={(e) => setObservacionesCotizacion(e.target.value)}
              rows="3"
            />
          </div>
          <div className="alert alert-info">
            <strong>Total calculado:</strong> ${cotizacionData?.total || '0'}
          </div>
        </div>
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => setShowEditCotizacionModal(false)}
          >
            Cancelar
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleUpdateCotizacion}
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  </div>
)}
      {/* Modales existentes para Pedidos... */}
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

      {/* Nuevos modales para Tratamientos */}
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