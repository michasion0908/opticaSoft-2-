import '../../assets/css/App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaClipboardList } from "react-icons/fa";

import {
  getPedidosjs,
  createPedidojs,
  updatePedidojs,
  deletePedidojs
} from '../../assets/js/Pedido.js';

import { PedidoCRUD } from './PedidoCRUD.jsx';

function Pedido() {
  const [pedidoList, setPedidos] = useState([]);
  
  // Campos del pedido
  const [idCotizacion, setIdCotizacion] = useState("");
  const [idInventario, setIdInventario] = useState("");
  const [idTipoLente, setIdTipoLente] = useState("");
  const [idMaterial, setIdMaterial] = useState("");
  const [idLentesContacto, setIdLentesContacto] = useState("");
  const [idPaquete, setIdPaquete] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [searchText, setSearchText] = useState("");

  // Modales
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedPedido, setSelectedPedido] = useState(null);

  useEffect(() => { getPedidosjs(setPedidos); }, []);

  const filteredData = pedidoList.filter(item =>
    (item?.observaciones ?? "").toLowerCase().includes(searchText.toLowerCase())
  );

  const limpiarCampos = () => {
    setIdCotizacion("");
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
      idCotizacion,
      idInventario: toNumberOrNull(idInventario),
      idTipoLente: toNumberOrNull(idTipoLente),
      idMaterial: toNumberOrNull(idMaterial),
      idLentesContacto: toNumberOrNull(idLentesContacto),
      idPaquete: toNumberOrNull(idPaquete),   
      cantidad,
      fechaEntrega,
      observaciones
    };
    createPedidojs(pedido, setShowModal, () => getPedidosjs(setPedidos));
  };

  const handleUpdate = () => {
    const pedido = {
      idCotizacion,
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
    updatePedidojs(selectedPedido.idPedido, pedido, setShowEditModal, () => getPedidosjs(setPedidos));
  };

  const handleDelete = () => {
    deletePedidojs(selectedPedido.idPedido, () => getPedidosjs(setPedidos), setShowDeleteModal);
  };

  const formatDateString = (dateString) => {
    return dateString ? dateString.split('T')[0] : "";
};


  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
          <FaClipboardList className="me-2" style={{ color: 'var(--crud-primary)' }} />
          Pedidos
        </h2>

        <div className="d-flex flex-wrap gap-2">
          <button className="crud-btn crud-btn-primary text-white">
            <FaList className="me-1" /> Lista
          </button>
          <button
            className="crud-btn crud-btn-success text-white"
            onClick={() => {
              limpiarCampos();
              setSelectedPedido(null);
              setShowModal(true);
            }}
          >
            <FaPlus className="me-1" /> Nuevo Pedido
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="crud-search-container">
            <FaSearch className="crud-search-icon" />
            <input
              type="text"
              className="form-control crud-search-input ps-4"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar por observaciones..."
            />
          </div>
        </div>
      </div>

      {/* Tabla de pedidos */}
      <div className="card crud-card">
        <div className="table-responsive">
          <table className="table table-hover crud-table mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cotización</th>
                <th>Productos</th>
                <th>Cantidad</th>
                <th>Entrega</th>
                <th>Observaciones</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((pedido) => (
                  <tr key={pedido.idPedido}>
                    <td>{pedido.idPedido}</td>
                    <td>{pedido.Cotizacion}</td>
                    <td>
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
                                    <li><strong>Contacto:</strong> {pedido.marcaLentesContacto} - ${pedido.precioLentesContacto}</li>
                                )}
                                {pedido.paquete && (
                                    <li><strong>Paquete:</strong> {pedido.paquete} - ${pedido.precioPaquete}</li>
                                )}
                                </ul>
                            </div>
                    </td>


                    <td>{pedido.cantidad}</td>
                    <td> {formatDateString(pedido.fechaEntrega)}</td>
                    <td>{pedido.observaciones}</td>
                    <td>${pedido.total}</td>
                    <td>
                      <div className="d-flex gap-2">

                       <button
                          className="crud-btn btn-warning text-white btn-sm"
                          onClick={() => {
                            setSelectedPedido(pedido);
                            setIdCotizacion(pedido.idCotizacion);
                            setIdInventario(pedido.idInventario);
                            setIdTipoLente(pedido.idTipoLente);
                            setIdMaterial(pedido.idMaterial);
                            setIdLentesContacto(pedido.idLentesContacto);
                            setIdPaquete(pedido.idPaquete);
                            setCantidad(pedido.cantidad);
                            setFechaEntrega(formatDateString(pedido.fechaEntrega));
                            setObservaciones(pedido.observaciones);
                            setShowEditModal(true);
                          }}
                        >
                          <FaEdit />
                        </button> 

                        <button
                          className="crud-btn btn-danger btn-sm"
                          onClick={() => {
                            setSelectedPedido(pedido);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No hay pedidos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulario CRUD */}
      <PedidoCRUD
        formData={{
          idCotizacion, setIdCotizacion,
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

export default Pedido;
