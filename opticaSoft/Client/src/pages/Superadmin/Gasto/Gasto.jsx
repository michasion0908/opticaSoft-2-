import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaMoneyBillWave } from 'react-icons/fa';
import { getGastosjs, createGastojs, updateGastojs, deleteGastojs, getResumenMensualjs } from '../../../assets/js/Gasto.js';
import '../css/crud-styles.css';

const CATEGORIAS = ['Inventario', 'Proveedor', 'Servicios', 'Nomina', 'Renta', 'Mantenimiento', 'Otro'];
const METODOS_PAGO = ['Efectivo', 'Transferencia', 'Tarjeta', 'Cheque'];

function Gasto() {
  const hoy = new Date();
  const [gastos, setGastos] = useState([]);
  const [resumen, setResumen] = useState({ totalVentas: 0, totalGastos: 0, utilidad: 0 });
  const [mes, setMes] = useState(hoy.getMonth() + 1);
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [searchText, setSearchText] = useState('');

  // Campos del formulario
  const [categoria, setCategoria] = useState('Otro');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(hoy.toISOString().split('T')[0]);
  const [metodoPago, setMetodoPago] = useState('Efectivo');

  // Modales
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGasto, setSelectedGasto] = useState(null);

  useEffect(() => {
    getGastosjs(setGastos);
    getResumenMensualjs(mes, anio, setResumen);
  }, [mes, anio]);

  const filteredGastos = gastos.filter(g =>
    g.descripcion?.toLowerCase().includes(searchText.toLowerCase()) ||
    g.categoria?.toLowerCase().includes(searchText.toLowerCase())
  );

  const resetForm = () => {
    setCategoria('Otro');
    setDescripcion('');
    setMonto('');
    setFecha(hoy.toISOString().split('T')[0]);
    setMetodoPago('Efectivo');
    setSelectedGasto(null);
  };

  const handleAdd = () => {
    createGastojs(categoria, descripcion, monto, fecha, metodoPago, setShowModal, () => {
      getGastosjs(setGastos);
      getResumenMensualjs(mes, anio, setResumen);
    });
  };

  const handleUpdate = () => {
    updateGastojs(selectedGasto.idGasto, categoria, descripcion, monto, fecha, metodoPago, setShowEditModal, () => {
      getGastosjs(setGastos);
      getResumenMensualjs(mes, anio, setResumen);
    });
  };

  const handleDelete = () => {
    deleteGastojs(selectedGasto.idGasto, setShowDeleteModal, () => {
      getGastosjs(setGastos);
      getResumenMensualjs(mes, anio, setResumen);
    });
  };

  const utilidadColor = resumen.utilidad >= 0 ? '#38a169' : '#e53e3e';

  return (
    <div className="container-fluid py-4">
      {/* Encabezado */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-3 mb-md-0 text-dark fw-bold">
          <FaMoneyBillWave className="me-2" style={{ color: 'var(--crud-primary)' }} />
          Gestión de Gastos
        </h2>
        <button className="crud-btn crud-btn-success text-white" onClick={() => { resetForm(); setShowModal(true); }}>
          <FaPlus className="me-1" /> Nuevo Gasto
        </button>
      </div>

      {/* Resumen mensual */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card text-center p-3 shadow-sm">
            <p className="text-muted mb-1" style={{ fontSize: '13px' }}>Ingresos del mes</p>
            <h4 style={{ color: '#38a169', fontWeight: 700 }}>${resumen.totalVentas?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</h4>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-center p-3 shadow-sm">
            <p className="text-muted mb-1" style={{ fontSize: '13px' }}>Gastos del mes</p>
            <h4 style={{ color: '#e53e3e', fontWeight: 700 }}>${resumen.totalGastos?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</h4>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-center p-3 shadow-sm">
            <p className="text-muted mb-1" style={{ fontSize: '13px' }}>Utilidad estimada</p>
            <h4 style={{ color: utilidadColor, fontWeight: 700 }}>${resumen.utilidad?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</h4>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="row mb-4 align-items-end">
        <div className="col-md-4 mb-2">
          <div className="crud-search-container">
            <FaSearch className="crud-search-icon" />
            <input type="text" className="form-control crud-search-input ps-4"
              value={searchText} onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar por descripción o categoría..." />
          </div>
        </div>
        <div className="col-md-2 mb-2">
          <select className="form-select" value={mes} onChange={(e) => setMes(e.target.value)}>
            {['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
              .map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
          </select>
        </div>
        <div className="col-md-2 mb-2">
          <input type="number" className="form-control" value={anio}
            onChange={(e) => setAnio(e.target.value)} min="2020" max="2099" />
        </div>
      </div>

      {/* Tabla */}
      <div className="card crud-card">
        <div className="table-responsive">
          <table className="table table-hover crud-table mb-0">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Método de Pago</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredGastos.length > 0 ? filteredGastos.map((g) => (
                <tr key={g.idGasto}>
                  <td><span className="badge bg-secondary">{g.categoria}</span></td>
                  <td>{g.descripcion}</td>
                  <td>${parseFloat(g.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                  <td>{new Date(g.fecha).toLocaleDateString('es-MX')}</td>
                  <td>{g.metodoPago}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="crud-btn btn-warning text-white btn-sm" onClick={() => {
                        setSelectedGasto(g);
                        setCategoria(g.categoria);
                        setDescripcion(g.descripcion);
                        setMonto(g.monto);
                        setFecha(g.fecha?.split('T')[0]);
                        setMetodoPago(g.metodoPago);
                        setShowEditModal(true);
                      }}><FaEdit /></button>
                      <button className="crud-btn btn-danger btn-sm" onClick={() => {
                        setSelectedGasto(g);
                        setShowDeleteModal(true);
                      }}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="text-center py-4 text-muted">No hay gastos registrados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear */}
      {showModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Registrar Gasto</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <FormGasto {...{ categoria, setCategoria, descripcion, setDescripcion, monto, setMonto, fecha, setFecha, metodoPago, setMetodoPago }} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-success" onClick={handleAdd}>Registrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {showEditModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Gasto</h5>
                <button className="btn-close" onClick={() => setShowEditModal(false)} />
              </div>
              <div className="modal-body">
                <FormGasto {...{ categoria, setCategoria, descripcion, setDescripcion, monto, setMonto, fecha, setFecha, metodoPago, setMetodoPago }} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
                <button className="btn btn-warning text-white" onClick={handleUpdate}>Actualizar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {showDeleteModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Eliminar Gasto</h5>
                <button className="btn-close" onClick={() => setShowDeleteModal(false)} />
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de eliminar el gasto <strong>{selectedGasto?.descripcion}</strong>?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormGasto({ categoria, setCategoria, descripcion, setDescripcion, monto, setMonto, fecha, setFecha, metodoPago, setMetodoPago }) {
  return (
    <>
      <div className="mb-3">
        <label className="form-label">Categoría</label>
        <select className="form-select" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          {['Inventario','Proveedor','Servicios','Nomina','Renta','Mantenimiento','Otro'].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <input type="text" className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej: Pago de luz" />
      </div>
      <div className="mb-3">
        <label className="form-label">Monto</label>
        <input type="number" className="form-control" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="0.00" />
      </div>
      <div className="mb-3">
        <label className="form-label">Fecha</label>
        <input type="date" className="form-control" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Método de Pago</label>
        <select className="form-select" value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
          {['Efectivo','Transferencia','Tarjeta','Cheque'].map(m => <option key={m}>{m}</option>)}
        </select>
      </div>
    </>
  );
}

export default Gasto;
