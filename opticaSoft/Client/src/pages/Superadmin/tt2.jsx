import '../../../assets/css/App.css';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaBoxes, FaBoxOpen } from "react-icons/fa";

import {
  getPedidosjs,
  createPedidojs,
  updatePedidojs,
  deletePedidojs
} from '../../../assets/js/Pedido.js';

import { PedidoCRUD } from './../PedidoCRUD.jsx';

function GestionVenta() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  
  const idCotizacionParam = params.get("idCotizacion");

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

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [selectedPedido, setSelectedPedido] = useState(null);

  useEffect(() => { 
    getPedidosjs(data => {
      setPedidoList(data);
      const filteredData = data.filter(item => item.idCotizacion == idCotizacionParam);
      setFilteredPedidos(filteredData);
      setPedidoData(filteredData.length > 0 ? filteredData[0] : null);
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

   //Para mandar ints vacíos
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

      createPedidojs(pedido, setShowModal, 
      () => {
        getPedidosjs(data => {
          const filteredData = data.filter(item => item.idCotizacion == idCotizacionParam);
          setFilteredPedidos(filteredData);
        });
        resetForm();
      }
    );
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
      
      console.log("Datos a enviar:", pedido); // 👈 Verifica aquí
     
      updatePedidojs( selectedPedido.idPedido, pedido, setShowEditModal, 
      () => {
        getPedidosjs(data => {
          const filteredData = data.filter(item => item.idCotizacion == idCotizacionParam);
          setFilteredPedidos(filteredData);
        });
        resetForm();
      }
    );
  };

  const handleDelete = () => {
    deletePedidojs(selectedPedido.idPedido, setShowDeleteModal, () => {
      getPedidosjs(data => {
        const filteredData = data.filter(item => item.idCotizacion == idCotizacionParam);
        setFilteredPedidos(filteredData);
      });
    });
  };

  const searchFilteredData = filteredPedidos.filter(item =>
    (item?.Producto ?? "").toLowerCase().includes(searchText.toLowerCase()) ||
    (item?.TipoLente ?? "").toLowerCase().includes(searchText.toLowerCase()) ||
    (item?.Material ?? "").toLowerCase().includes(searchText.toLowerCase())
  );

  const formatDateString = (dateString) => {
    return dateString ? dateString.split('T')[0] : "";
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
          <FaBoxes className="me-2" style={{ color: 'var(--crud-primary)' }} />
          Pedidos de la Cotización: {pedidoData?.Cotizacion || 'N/A'}
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
        </div>
      </div>

      {/* Breadcrumbs */}
      <div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/gestionCotizacion" className="text-decoration-none">Cotizaciones</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page"> {pedidoData?.Cotizacion || 'N/A'}</li>
          </ol>
        </nav>
      </div>
      {/* END Breadcrumbs */}

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="crud-search-container">
            <FaSearch className="crud-search-icon" />
            <input
              type="text"
              className="form-control crud-search-input ps-4"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar en pedidos..."
            />
          </div>
        </div>
      </div>

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
                {pedidoData?.Cotizacion || 'Cotización'}
              </h5>
              <div className="d-flex flex-wrap gap-3 text-white text-opacity-85 small">
                <span className="d-flex align-items-center">
                  <i className="bi bi-card-text me-2"></i>
                  {pedidoData?.nombrePaciente || 'Sin cliente'}
                </span>
                <span className="d-flex align-items-center">
                  <i className="bi bi-calendar3 me-2"></i>
                  {formatDateString(pedidoData?.fechaRegistro) || 'N/A'}
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="badge bg-white text-dark rounded-pill px-3 py-2">
                <i className="bi bi-tag me-2" style={{ color: 'var(--crud-primary)' }}></i>
                {pedidoData?.idCotizacion || 'N/A'}
              </span>
              <span className="text-white fw-bold fs-5">
                ${pedidoData?.total || '0'}
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
                  <th className="pe-4 py-3 text-end text-muted fw-medium small text-uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {searchFilteredData.length > 0 ? (
                  searchFilteredData.map((pedido) => (
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
                      <td className="pe-4 text-end">
                        <div className="d-flex gap-2 justify-content-end">
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
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
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
    </div>
  );
}

export default GestionVenta;