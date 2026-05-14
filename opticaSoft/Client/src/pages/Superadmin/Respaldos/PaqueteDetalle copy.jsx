import '../../assets/css/App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaBoxes } from "react-icons/fa";

import {
  getPaqueteDetallesJs,
  createPaqueteDetalleJs,
  updatePaqueteDetalleJs,
  deletePaqueteDetalleJs
} from '../../../assets/js/PaqueteDetalle.js';

import { PaqueteDetalleCRUD } from '../PaqueteDetalleCRUD.jsx';

function PaqueteDetalle() {
  const [detalleList, setDetalleList] = useState([]);

  const [idPaquete, setIdPaquete] = useState("");
  const [idTipoLente, setIdTipoLente] = useState("");
  const [idMaterial, setIdMaterial] = useState("");
  const [idTratamiento, setIdTratamiento] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [selectedDetalle, setSelectedDetalle] = useState(null);

  useEffect(() => {
    getPaqueteDetallesJs(setDetalleList);
  }, []);

  const filteredData = detalleList.filter(item =>
    (item?.Paquete ?? "").toLowerCase().includes(searchText.toLowerCase())
  );

  const resetForm = () => {
    setIdPaquete("");
    setIdTipoLente("");
    setIdMaterial("");
    setIdTratamiento("");
  };

  const handleAdd = () => {
    createPaqueteDetalleJs(idPaquete, idTipoLente, idMaterial, idTratamiento, setShowModal, () => {
        getPaqueteDetallesJs(setDetalleList);
      resetForm();
    });
  };

  const handleUpdate = () => {
    updatePaqueteDetalleJs(selectedDetalle.idPaqueteDetalle, idPaquete, idTipoLente, idMaterial, idTratamiento, setShowEditModal, () => {
        getPaqueteDetallesJs(setDetalleList);
      resetForm();
    });
  };

  const handleDelete = () => {
    deletePaqueteDetalleJs(selectedDetalle.idPaqueteDetalle, setShowDeleteModal, () => {
        getPaqueteDetallesJs(setDetalleList);
    });
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
          <FaBoxes className="me-2" style={{ color: 'var(--crud-primary)' }} />
          Detalles de Paquete
        </h2>

        <div className="d-flex flex-wrap gap-2">
          <button className="crud-btn crud-btn-primary text-white">
            <FaList className="me-1" /> Lista
          </button>
          <button
            className="crud-btn crud-btn-success text-white"
            onClick={() => {
              resetForm();
              setSelectedDetalle(null);
              setShowModal(true);
            }}
          >
            <FaPlus className="me-1" /> Nuevo Detalle
          </button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="crud-search-container">
            <FaSearch className="crud-search-icon" />
            <input
              type="text"
              className="form-control crud-search-input ps-4"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar por Paquete..."
            />
          </div>
        </div>
      </div>

      <div className="card crud-card">
        <div className="table-responsive">
          <table className="table table-hover crud-table mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Paquete</th>
                <th>Tipo de Lente</th>
                <th>Material</th>
                <th>Tratamiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((detalle) => (
                  <tr key={detalle.idPaqueteDetalle}>
                    <td>{detalle.idPaqueteDetalle}</td>
                    <td>{detalle.Paquete}</td>
                    <td>{detalle.TipoLente}</td>
                    <td>{detalle.Material}</td>
                    <td>{detalle.Tratamiento}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="crud-btn btn-warning text-white btn-sm"
                          onClick={() => {
                            setShowEditModal(true);
                            setSelectedDetalle(detalle);
                            setIdPaquete(detalle.idPaquete);
                            setIdTipoLente(detalle.idTipoLente);
                            setIdMaterial(detalle.idMaterial);
                            setIdTratamiento(detalle.idTratamiento);
                          }}
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="crud-btn btn-danger btn-sm"
                          onClick={() => {
                            setShowDeleteModal(true);
                            setSelectedDetalle(detalle);
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
                    No hay detalles registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PaqueteDetalleCRUD
        formData={{
          idPaquete, setIdPaquete,
          idTipoLente, setIdTipoLente,
          idMaterial, setIdMaterial,
          idTratamiento, setIdTratamiento,
        }}
        modals={{
          showModal, setShowModal,
          showEditModal, setShowEditModal,
          showDeleteModal, setShowDeleteModal
        }}
        handlers={{
          handleAdd, handleUpdate, handleDelete
        }}
        selectedDetalle={selectedDetalle}
      />
    </div>
  );
}

export default PaqueteDetalle;
