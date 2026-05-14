/* eslint-disable react/prop-types */

export const PacienteCRUD = ({
    //CAMPOS DE LA TABLA 
    nombre, setNombre,
    apellido, setApellido,
    edad, setEdad,
    sexo, setSexo,
    ocupacion, setOcupacion,
    direccion, setDireccion,
    localidad, setLocalidad,
    estado, setEstado,
    telefono, setTelefono,

    observaciones, setObservaciones,

    //ANIMACIONES 
    showModal, setShowModal,
    showEditModal, setShowEditModal,
    showDeleteModal, setShowDeleteModal,

    //FUNCIONES 
    handleAdd, handleUpdate, handleDelete,

    selectedPaciente
  }) => {
    return (
        <>
          {/* ------------------- registrar ------------------------------------------ */}
          <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="modalLabel">Registrar Paciente</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                    
                  <div className="input-group mb-3">
                    <span className="input-group-text">Nombre:</span>
                    <input type="text" className="form-control" value={nombre} onChange={(event) => setNombre(event.target.value)} />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Apellido</span>
                    <input type="text" className="form-control" value={apellido} onChange={(event) => setApellido(event.target.value)} />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Edad</span>
                    <input type="number" className="form-control" value={edad} onChange={(event) => setEdad(event.target.value)} />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Sexo:</span>
                    <select className="form-select" value={sexo} onChange={(event) => setSexo(event.target.value)}>
                      <option value="">Selecciona un tipo de sexo</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Ocupación</span>
                    <input type="text" className="form-control" value={ocupacion} onChange={(event) => setOcupacion(event.target.value)} />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Dirección</span>
                    <input type="text" className="form-control" value={direccion} onChange={(event) => setDireccion(event.target.value)} />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Localidad</span>
                    <input type="text" className="form-control" value={localidad} onChange={(event) => setLocalidad(event.target.value)} />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Estado</span>
                    <input type="text" className="form-control" value={estado} onChange={(event) => setEstado(event.target.value)} />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Telefono</span>
                    <input type="number" className="form-control" value={telefono} onChange={(event) => setTelefono(event.target.value)} />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Observaciones</span>
                    <input type="text" className="form-control" value={observaciones} onChange={(event) => setObservaciones(event.target.value)} />
                  </div>


                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cerrar</button>
                  <button type="button" className="btn btn-primary" onClick={handleAdd}>Registrar</button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Modal para editar periodo */}
          <div className={`modal fade ${showEditModal ? 'show' : ''}`} style={{ display: showEditModal ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="editModalLabel">Editar Paciente</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowEditModal(false)}></button>
                </div>
                <div className="modal-body">

                  <div className="input-group mb-3">
                    <span className="input-group-text">Nombre:</span>
                    <input type="text" className="form-control" value={nombre} onChange={(event) => setNombre(event.target.value)} />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Apellido</span>
                    <input type="text" className="form-control" value={apellido} onChange={(event) => setApellido(event.target.value)} />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Edad</span>
                    <input type="number" className="form-control" value={edad} onChange={(event) => setEdad(event.target.value)} />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Sexo:</span>
                    <select className="form-select" value={sexo} onChange={(event) => setSexo(event.target.value)}>
                      <option value="">Selecciona un tipo de sexo</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Ocupación</span>
                    <input type="text" className="form-control" value={ocupacion} onChange={(event) => setOcupacion(event.target.value)} />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Dirección</span>
                    <input type="text" className="form-control" value={direccion} onChange={(event) => setDireccion(event.target.value)} />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Localidad</span>
                    <input type="text" className="form-control" value={localidad} onChange={(event) => setLocalidad(event.target.value)} />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Estado</span>
                    <input type="text" className="form-control" value={estado} onChange={(event) => setEstado(event.target.value)} />
                  </div>

                  <div className="input-group mb-3">
                    <span className="input-group-text">Telefono</span>
                    <input type="number" className="form-control" value={telefono} onChange={(event) => setTelefono(event.target.value)} />
                  </div>


                  <div className="input-group mb-3">
                    <span className="input-group-text">Observaciones</span>
                    <input type="text" className="form-control" value={observaciones} onChange={(event) => setObservaciones(event.target.value)} />
                  </div>

                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cerrar</button>
                  <button type="button" className="btn btn-primary" onClick={handleUpdate}>Actualizar</button>
                </div>
              </div>
            </div>
          </div>
    
          {/* Modal para eliminar periodo */}
          <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} style={{ display: showDeleteModal ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="deleteModalLabel">Eliminar Paciente</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowDeleteModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p>¿Estás seguro de que deseas eliminar el paciente: <strong>{selectedPaciente?.nombre}</strong>?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                  <button type="button" className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    };    