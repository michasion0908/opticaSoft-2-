import '../../assets/css/App.css';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaBoxes, FaBoxOpen } from "react-icons/fa";

import {
  getPaqueteDetallesJs,
  createPaqueteDetalleJs,
  updatePaqueteDetalleJs,
  deletePaqueteDetalleJs
} from '../../assets/js/PaqueteDetalle.js';

import { PaqueteDetalleCRUD } from './PaqueteDetalleCRUD.jsx';

function PaqueteDetalle() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const idPaqueteParam = params.get("idPaquete");

  const [detalleList, setDetalleList] = useState([]);
  //const [setDetalleList] = useState([]);
  const [paqueteData, setPaqueteData] = useState(null);
  const [filteredDetalles, setFilteredDetalles] = useState([]);

  const [idTipoLente, setIdTipoLente] = useState("");
  const [idMaterial, setIdMaterial] = useState("");
  const [idTratamiento, setIdTratamiento] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [selectedDetalle, setSelectedDetalle] = useState(null);

  useEffect(() => { 
    getPaqueteDetallesJs(data => {
      setDetalleList(data);
      const filteredData = data.filter(item => item.idPaquete == idPaqueteParam);
      setFilteredDetalles(filteredData);
      setPaqueteData(filteredData.length > 0 ? filteredData[0] : null);
    }); 
  }, [idPaqueteParam]);

  if (!idPaqueteParam) {
    return <div className="alert alert-warning text-center mt-4 shadow-sm">
      <i className="bi bi-exclamation-triangle-fill me-2"></i>
      Acceso denegado: Falta seleccionar un paquete.
    </div>;
  }

  const resetForm = () => {
    setIdTipoLente("");
    setIdMaterial("");
    setIdTratamiento("");
  };

  const handleAdd = () => {
    createPaqueteDetalleJs(idPaqueteParam, idTipoLente, idMaterial, idTratamiento, setShowModal, () => {
      getPaqueteDetallesJs(data => {
        const filteredData = data.filter(item => item.idPaquete == idPaqueteParam);
        setFilteredDetalles(filteredData);
      });
      resetForm();
    });
  };

  const handleUpdate = () => {
    updatePaqueteDetalleJs(selectedDetalle.idPaqueteDetalle, idPaqueteParam, idTipoLente, idMaterial, idTratamiento, setShowEditModal, () => {
      getPaqueteDetallesJs(data => {
        const filteredData = data.filter(item => item.idPaquete == idPaqueteParam);
        setFilteredDetalles(filteredData);
      });
      resetForm();
    });
  };

  const handleDelete = () => {
    deletePaqueteDetalleJs(selectedDetalle.idPaqueteDetalle, setShowDeleteModal, () => {
      getPaqueteDetallesJs(data => {
        const filteredData = data.filter(item => item.idPaquete == idPaqueteParam);
        setFilteredDetalles(filteredData);
      });
    });
  };

  const searchFilteredData = filteredDetalles.filter(item =>
    (item?.TipoLente ?? "").toLowerCase().includes(searchText.toLowerCase())
  );

  const formatDateString = (dateString) => {
    return dateString ? dateString.split('T')[0] : "";
};

  return (
    <div className="container-fluid py-4">
   {/*    <button 
        className="btn btn-link mb-3 d-flex align-items-center"
        onClick={() => window.history.back()}
      >
        <FaArrowLeft className="me-2" /> Volver a paquetes
      </button> */}

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
          <FaBoxes className="me-2" style={{ color: 'var(--crud-primary)' }} />
          Detalles del Paquete: {paqueteData?.Paquete || 'N/A'}
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

        {/* Breadcrumbs */}
        <div>
        <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                        <Link to="/paquetes" className="text-decoration-none">Paquetes</Link>
                        </li>
                            <li className="breadcrumb-item active" aria-current="page"> {paqueteData?.Paquete || 'N/A'}</li>
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
              placeholder="Buscar en detalles..."
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
          {paqueteData?.Paquete || 'Nombre del Paquete'}
        </h5>
        <div className="d-flex flex-wrap gap-3 text-white text-opacity-85 small">
          <span className="d-flex align-items-center">
            <i className="bi bi-card-text me-2"></i>
            {paqueteData?.Descripcion || 'Sin descripción'}
          </span>
          <span className="d-flex align-items-center">
            <i className="bi bi-calendar3 me-2"></i>
            {formatDateString (paqueteData?.Vigencia) || 'N/A'}
          </span>
        </div>
      </div>
      <div className="d-flex align-items-center gap-3">
        <span className="badge bg-white text-dark rounded-pill px-3 py-2">
          <i className="bi bi-tag me-2" style={{ color: 'var(--crud-primary)' }}></i>
          {paqueteData?.idPaquete || 'N/A'}
        </span>
        <span className="text-white fw-bold fs-5">
          ${paqueteData?.Total || '0'}
        </span>
      </div>
    </div>
  </div>

  {/* Barra de estado */}
  <div className="px-4 py-2 bg-light d-flex justify-content-between align-items-center border-bottom">
    <div>
      {paqueteData?.Estado === "INACTIVO" ? (
        <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-2">
          <span className="dot me-2 bg-danger" style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            display: 'inline-block'
          }}></span>
          Inactivo
        </span>
      ) : (
        <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">
          <span className="dot me-2 bg-success" style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            display: 'inline-block'
          }}></span>
          Activo
        </span>
      )}
    </div>
    <div className="text-muted small">
      <i className="bi bi-grid me-1"></i> Detalles del paquete
    </div>
  </div>


  {/* Tabla */}
  <div className="card-body p-0">
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="bg-light">
          <tr>
            <th className="py-3 text-muted fw-medium small text-uppercase">Tipo de Lente</th>
            <th className="py-3 text-muted fw-medium small text-uppercase">Material</th>
            <th className="py-3 text-muted fw-medium small text-uppercase">Tratamiento</th>
            <th className="pe-4 py-3 text-end text-muted fw-medium small text-uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {searchFilteredData.length > 0 ? (
            searchFilteredData.map((detalle) => (
              <tr key={detalle.idPaqueteDetalle}>
                <td>
                  <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-pill small">
                    {detalle.TipoLente}
                  </span>
                </td>
                <td className="small">{detalle.Material}</td>
                <td className="small">{detalle.Tratamiento}</td>
                <td className="pe-4 text-end">
                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      className="btn btn-sm btn-warning text-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '32px', height: '32px' }}
                      onClick={() => {
                        setShowEditModal(true);
                        setSelectedDetalle(detalle);
                        setIdTipoLente(detalle.idTipoLente);
                        setIdMaterial(detalle.idMaterial);
                        setIdTratamiento(detalle.idTratamiento);
                      }}
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '32px', height: '32px' }}
                      onClick={() => {
                        setShowDeleteModal(true);
                        setSelectedDetalle(detalle);
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
              <td colSpan="5" className="text-center py-5">
                <div className="py-4">
                  <div className="bg-light rounded-circle d-inline-flex p-3 mb-3">
                    <FaBoxOpen size={28} className="text-muted" />
                  </div>
                  <h5 className="fw-normal text-dark mb-1">
                    {filteredDetalles.length === 0
                      ? "No hay detalles registrados"
                      : "No se encontraron resultados"}
                  </h5>
                  <p className="small text-muted">Agrega nuevos detalles para comenzar</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>

      <PaqueteDetalleCRUD
        formData={{
          idPaquete: idPaqueteParam,
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
