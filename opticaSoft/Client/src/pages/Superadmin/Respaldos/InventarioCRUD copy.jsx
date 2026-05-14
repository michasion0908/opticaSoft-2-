/* eslint-disable react/prop-types */

    export const InventarioCRUD = ({
      //CAMPOS DE LA TABLA 
      marca, setMarca,
      modelo, setModelo,
      color, setColor,
      numeroColor, setNumeroColor,
      material, setMaterial,
      cantidad, setCantidad,
      exhibicion, setExhibicion,
      precio, setPrecio,
      fecha, setFecha,
      estatus, setEstatus,
      precioVenta, setPrecioVenta,
    
      //ANIMACIONES 
      showModal, setShowModal,
      showEditModal, setShowEditModal,
      showDeleteModal, setShowDeleteModal,
    
      //FUNCIONES 
      handleAdd, handleUpdate, handleDelete,
    
      selectedInventario
    }) => {
      return (
        <>
          {/* Fondo oscuro para todos los modales */}
          <div className={`modal-backdrop fade ${showModal || showEditModal || showDeleteModal ? 'show' : ''}`} 
               style={{ 
                 display: showModal || showEditModal || showDeleteModal ? 'block' : 'none',
                 backgroundColor: 'rgba(0,0,0,0.5)' 
               }}></div>
          
          {/* Modal de Registro */}
          <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content crud-card" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                <div className="modal-header crud-card-header" style={{ padding: '1rem 1.5rem' }}>
                  <h5 className="modal-title text-white" style={{ fontSize: '1.25rem', fontWeight: '600' }}>Registrar Nuevo Producto</h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body crud-card-body" style={{ padding: '1.5rem' }}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>Marca:</span>
                        <input 
                          type="text" 
                          className="form-control crud-search-input" 
                          value={marca} 
                          onChange={(e) => setMarca(e.target.value)}
                          placeholder="Ej: Ray-Ban, Oakley"
                          style={{ padding: '0.5rem 0.75rem' }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>Modelo:</span>
                        <input 
                          type="text" 
                          className="form-control crud-search-input" 
                          value={modelo} 
                          onChange={(e) => setModelo(e.target.value)}
                          placeholder="Ej: Aviador, Wayfarer"
                          style={{ padding: '0.5rem 0.75rem' }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>Color:</span>
                        <input 
                          type="text" 
                          className="form-control crud-search-input" 
                          value={color} 
                          onChange={(e) => setColor(e.target.value)}
                          placeholder="Ej: Negro, Dorado"
                          style={{ padding: '0.5rem 0.75rem' }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>Núm. Color:</span>
                        <input 
                          type="text" 
                          className="form-control crud-search-input" 
                          value={numeroColor} 
                          onChange={(e) => setNumeroColor(e.target.value)}
                          placeholder="Ej: 1234, 5678"
                          style={{ padding: '0.5rem 0.75rem' }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>Material:</span>
                        <input 
                          type="text" 
                          className="form-control crud-search-input" 
                          value={material} 
                          onChange={(e) => setMaterial(e.target.value)}
                          placeholder="Ej: Metal, Acetato"
                          style={{ padding: '0.5rem 0.75rem' }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>Cantidad:</span>
                        <input 
                          type="number" 
                          className="form-control crud-search-input" 
                          value={cantidad} 
                          onChange={(e) => setCantidad(e.target.value)}
                          placeholder="Ej: 5, 10"
                          style={{ padding: '0.5rem 0.75rem' }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>Exhibición:</span>
                        <select 
                          className="form-select crud-search-input"
                          value={exhibicion} 
                          onChange={(e) => setExhibicion(e.target.value)}
                          style={{ padding: '0.5rem 0.75rem' }}
                        >
                          <option value="">Seleccione exhibición...</option>
                          <option value="Dama">Dama</option>
                          <option value="Caballero">Caballero</option>
                          <option value="Niño">Niño</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>Precio:</span>
                        <input 
                          type="number" 
                          className="form-control crud-search-input" 
                          value={precio} 
                          onChange={(e) => setPrecio(e.target.value)}
                          placeholder="Ej: 1500.00"
                          style={{ padding: '0.5rem 0.75rem' }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>Fecha:</span>
                        <input 
                          type="date" 
                          className="form-control crud-search-input" 
                          value={fecha} 
                          onChange={(e) => setFecha(e.target.value)}
                          style={{ padding: '0.5rem 0.75rem' }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>Estatus:</span>
                        <select 
                          className="form-select crud-search-input"
                          value={estatus} 
                          onChange={(e) => setEstatus(e.target.value)}
                          style={{ padding: '0.5rem 0.75rem' }}
                        >
                          <option value="">Seleccione estatus...</option>
                          <option value="Disponible">Disponible</option>
                          <option value="Vendido">Vendido</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>Precio Venta:</span>
                        <input 
                          type="number" 
                          className="form-control crud-search-input" 
                          value={precioVenta} 
                          onChange={(e) => setPrecioVenta(e.target.value)}
                          placeholder="Ej: 2000.00"
                          style={{ padding: '0.5rem 0.75rem' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer crud-card-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <button 
                    type="button" 
                    className="crud-btn crud-btn-danger" 
                    onClick={() => setShowModal(false)}
                    style={{ padding: '0.5rem 1.25rem', borderRadius: '6px' }}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    className="crud-btn crud-btn-success" 
                    onClick={handleAdd}
                    style={{ padding: '0.5rem 1.25rem', borderRadius: '6px' }}
                  >
                    Registrar Producto
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Modal de Edición */}
          <div className={`modal fade ${showEditModal ? 'show' : ''}`} style={{ display: showEditModal ? 'block' : 'none' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content crud-card" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                <div className="modal-header crud-card-header" style={{ padding: '1rem 1.5rem' }}>
                  <h5 className="modal-title text-white" style={{ fontSize: '1.25rem', fontWeight: '600' }}>Editar Producto</h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => setShowEditModal(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body crud-card-body" style={{ padding: '1.5rem' }}>
                <div className="row g-3">
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>Marca:</span>
                        <input 
                          type="text" 
                          className="form-control crud-search-input" 
                          value={marca} 
                          onChange={(e) => setMarca(e.target.value)}
                          placeholder="Ej: Ray-Ban, Oakley"
                          style={{ padding: '0.5rem 0.75rem' }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>Modelo:</span>
                        <input 
                          type="text" 
                          className="form-control crud-search-input" 
                          value={modelo} 
                          onChange={(e) => setModelo(e.target.value)}
                          placeholder="Ej: Aviador, Wayfarer"
                          style={{ padding: '0.5rem 0.75rem' }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>Color:</span>
                        <input 
                          type="text" 
                          className="form-control crud-search-input" 
                          value={color} 
                          onChange={(e) => setColor(e.target.value)}
                          placeholder="Ej: Negro, Dorado"
                          style={{ padding: '0.5rem 0.75rem' }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>Núm. Color:</span>
                        <input 
                          type="text" 
                          className="form-control crud-search-input" 
                          value={numeroColor} 
                          onChange={(e) => setNumeroColor(e.target.value)}
                          placeholder="Ej: 1234, 5678"
                          style={{ padding: '0.5rem 0.75rem' }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>Material:</span>
                        <input 
                          type="text" 
                          className="form-control crud-search-input" 
                          value={material} 
                          onChange={(e) => setMaterial(e.target.value)}
                          placeholder="Ej: Metal, Acetato"
                          style={{ padding: '0.5rem 0.75rem' }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>Cantidad:</span>
                        <input 
                          type="number" 
                          className="form-control crud-search-input" 
                          value={cantidad} 
                          onChange={(e) => setCantidad(e.target.value)}
                          placeholder="Ej: 5, 10"
                          style={{ padding: '0.5rem 0.75rem' }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>Exhibición:</span>
                        <select 
                          className="form-select crud-search-input"
                          value={exhibicion} 
                          onChange={(e) => setExhibicion(e.target.value)}
                          style={{ padding: '0.5rem 0.75rem' }}
                        >
                          <option value="">Seleccione exhibición...</option>
                          <option value="Dama">Dama</option>
                          <option value="Caballero">Caballero</option>
                          <option value="Niño">Niño</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>Precio:</span>
                        <input 
                          type="number" 
                          className="form-control crud-search-input" 
                          value={precio} 
                          onChange={(e) => setPrecio(e.target.value)}
                          placeholder="Ej: 1500.00"
                          style={{ padding: '0.5rem 0.75rem' }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>Fecha:</span>
                        <input 
                          type="date" 
                          className="form-control crud-search-input" 
                          value={fecha} 
                          onChange={(e) => setFecha(e.target.value)}
                          style={{ padding: '0.5rem 0.75rem' }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>Estatus:</span>
                        <select 
                          className="form-select crud-search-input"
                          value={estatus} 
                          onChange={(e) => setEstatus(e.target.value)}
                          style={{ padding: '0.5rem 0.75rem' }}
                        >
                          <option value="">Seleccione estatus...</option>
                          <option value="Disponible">Disponible</option>
                          <option value="Vendido">Vendido</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text crud-input-label" style={{ minWidth: '110px' }}>Precio Venta:</span>
                        <input 
                          type="number" 
                          className="form-control crud-search-input" 
                          value={precioVenta} 
                          onChange={(e) => setPrecioVenta(e.target.value)}
                          placeholder="Ej: 2000.00"
                          style={{ padding: '0.5rem 0.75rem' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer crud-card-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <button 
                    type="button" 
                    className="crud-btn crud-btn-danger" 
                    onClick={() => setShowEditModal(false)}
                    style={{ padding: '0.5rem 1.25rem', borderRadius: '6px' }}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    className="crud-btn crud-btn-primary" 
                    onClick={handleUpdate}
                    style={{ padding: '0.5rem 1.25rem', borderRadius: '6px' }}
                  >
                    Actualizar Producto
                  </button>
                </div>
              </div>
            </div>
          </div>
    
          {/* Modal de Eliminación */}
          <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} style={{ display: showDeleteModal ? 'block' : 'none' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content crud-card" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                <div className="modal-header crud-card-header" style={{ padding: '1rem 1.5rem' }}>
                  <h5 className="modal-title text-white" style={{ fontSize: '1.25rem', fontWeight: '600' }}>Confirmar Eliminación</h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => setShowDeleteModal(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body crud-card-body" style={{ padding: '1.5rem' }}>
                  <p className="text-center mb-0" style={{ fontSize: '1rem' }}>
                    ¿Estás seguro de eliminar el producto:<br />
                    <strong style={{ color: '#fff' }}>{selectedInventario?.marca} {selectedInventario?.modelo}</strong>?
                  </p>
                </div>
                <div className="modal-footer crud-card-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <button 
                    type="button" 
                    className="crud-btn crud-btn-warning" 
                    onClick={() => setShowDeleteModal(false)}
                    style={{ padding: '0.5rem 1.25rem', borderRadius: '6px' }}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    className="crud-btn crud-btn-danger" 
                    onClick={handleDelete}
                    style={{ padding: '0.5rem 1.25rem', borderRadius: '6px' }}
                  >
                    Eliminar Definitivamente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    };