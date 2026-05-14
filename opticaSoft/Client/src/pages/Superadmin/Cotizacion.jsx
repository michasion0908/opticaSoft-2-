import '../../assets/css/App.css';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaList, FaReceipt } from "react-icons/fa";

import {
  getCotizacionesJs,
  createCotizacionJs,
  updateCotizacionJs,
  deleteCotizacionJs
} from '../../assets/js/Cotizacion.js';

import { CotizacionCRUD } from './CotizacionCRUD.jsx';

function Cotizacion() {
  const [cotizacionList, setCotizacion] = useState([]);
  const [idPaciente, setIdPaciente] = useState("");
  const [tipo, setTipo] = useState("ARMAZON");
  const [subtotal, setSubtotal] = useState("");
  const [descuento, setDescuento] = useState("");
  const [iva, setIva] = useState("");
  const [total, setTotal] = useState("");
  const [observaciones, setObservaciones] = useState("");

  // Modales
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Búsqueda
  const [searchText, setSearchText] = useState("");

  // Cotización seleccionada
  const [selectedCotizacion, setSelectedCotizacion] = useState(null);

  useEffect(() => {
    getCotizacionesJs(setCotizacion);
  }, []);

  const filteredData = cotizacionList.filter(item =>
    (item?.nombrePaciente ?? "").toLowerCase().includes(searchText.toLowerCase())
  );


  const handleAdd = () => {
    createCotizacionJs(
      idPaciente ? Number(idPaciente) : null,
      tipo, 
      subtotal, 
      descuento ? Number(descuento) : null, 
      iva ? Number(iva) : null, 
      total, 
      observaciones,
      setShowModal,
      () => getCotizacionesJs(setCotizacion)
    );
  };

  const handleUpdate = () => {
    updateCotizacionJs(
      selectedCotizacion.idCotizacion,
      idPaciente ? Number(idPaciente) : null,
      tipo, 
      subtotal, 
      descuento ? Number(descuento) : null, 
      iva ? Number(iva) : null, 
      total, 
      observaciones,
      setShowEditModal,
      () => getCotizacionesJs(setCotizacion)
    );
  };

  const handleDelete = () => {
    deleteCotizacionJs(
      selectedCotizacion.idCotizacion,
      () => getCotizacionesJs(setCotizacion),
      setShowDeleteModal
    );
  };

  return (
    <div className="container-fluid py-4">
      {/* Encabezado */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
          <FaReceipt className="me-2" style={{ color: 'var(--crud-primary)' }} />
          Cotizaciones
        </h2>

        <div className="d-flex flex-wrap gap-2">
          <button className="crud-btn crud-btn-primary text-white">
            <FaList className="me-1" /> Lista
          </button>
          <button
            className="crud-btn crud-btn-success text-white"
            onClick={() => {
              setIdPaciente("");
              setTipo("");
              setSubtotal("");
              setDescuento("");
              setIva("");
              setTotal("");
              setObservaciones("");
              setSelectedCotizacion(null);
              setShowModal(true);
            }}
          >
            <FaPlus className="me-1" /> Nueva Cotización
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
              placeholder="Buscar por nombre del paciente..."
            />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="card crud-card">
        <div className="table-responsive">
          <table className="table table-hover crud-table mb-0">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Tipo</th>
                <th>Subtotal</th>
                <th>Descuento</th>
                <th>IVA</th>
                <th>Total</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((cot) => (
                  <tr key={cot.idCotizacion}>
                    <td>{cot.nombrePaciente}</td>
                    <td>{cot.tipo}</td>
                    <td>${cot.subtotal}</td>
                    <td>${cot.descuento}</td>
                    <td>${cot.iva}</td>
                    <td>${cot.total}</td>
                    <td>{cot.observaciones}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="crud-btn btn-warning text-white btn-sm"
                          onClick={() => {
                            setShowEditModal(true);
                            setSelectedCotizacion(cot);
                            setIdPaciente(cot.idPaciente);
                            setTipo(cot.tipo);
                            setSubtotal(cot.subtotal);
                            setDescuento(cot.descuento);
                            setIva(cot.iva);
                            setTotal(cot.total);
                            setObservaciones(cot.observaciones);
                          }}
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="crud-btn btn-danger btn-sm"
                          onClick={() => {
                            setShowDeleteModal(true);
                            setSelectedCotizacion(cot);
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
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No hay cotizaciones registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CotizacionCRUD
        formData={{
          idPaciente, setIdPaciente,
          tipo, setTipo,
          subtotal, setSubtotal,
          descuento, setDescuento,
          iva, setIva,
          total, setTotal,
          observaciones, setObservaciones,
        }}
        modals={{
          showModal, setShowModal,
          showEditModal, setShowEditModal,
          showDeleteModal, setShowDeleteModal
        }}
        handlers={{
          handleAdd, handleUpdate, handleDelete
        }}
        selectedCotizacion={selectedCotizacion}
      />
    </div>
  );
}

export default Cotizacion;
