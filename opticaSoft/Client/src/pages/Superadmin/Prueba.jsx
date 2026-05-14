import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const HistorialClinico = () => {
  const [pestañaActiva, setPestañaActiva] = useState('informacion');
  const [examenExpandido, setExamenExpandido] = useState('examen1');

  // Manejadores simples
  const cambiarPestaña = (pestaña) => {
    setPestañaActiva(pestaña);
  };

  const toggleExamen = (examenId) => {
    setExamenExpandido(examenExpandido === examenId ? null : examenId);
  };

  // Estructura de datos vacía
  const datosPaciente = {
    informacionPersonal: {
      nombreCompleto: '',
      fechaNacimiento: '',
      genero: '',
      ocupacion: ''
    },
    informacionContacto: {
      direccion: '',
      telefono: '',
      email: '',
      fechaRegistro: ''
    },
    historialMedico: {
      enfermedadesCronicas: '',
      alergias: '',
      cirugiasPrevias: '',
      enfermedadesOcularesFamiliares: '',
      otrasEnfermedadesFamiliares: '',
      medicamentosActuales: '',
      observaciones: ''
    },
    examenesOculares: [
      {
        id: 'examen1',
        fecha: '',
        diagnosticos: [],
        ojoDerecho: {
          esfera: '',
          cilindro: '',
          eje: ''
        },
        ojoIzquierdo: {
          esfera: '',
          cilindro: '',
          eje: ''
        },
        notasDiagnosticas: '',
        observaciones: ''
      },
      {
        id: 'examen2',
        fecha: '',
        diagnosticos: [],
        ojoDerecho: {
          esfera: '',
          cilindro: '',
          eje: ''
        },
        ojoIzquierdo: {
          esfera: '',
          cilindro: '',
          eje: ''
        },
        notasDiagnosticas: '',
        observaciones: ''
      }
    ]
  };

  // Estilos CSS
  const estilos = {
    contenedorPrincipal: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    },
    contenido: {
      margin: '0 auto',
      maxWidth: '1200px',
      padding: '20px'
    },
    tarjetaSeccion: {
      marginBottom: '1.5rem',
      borderLeft: '4px solid #0d6efd'
    },
    tarjetaExamen: {
      transition: 'all 0.2s ease',
      borderLeft: '3px solid #6c757d',
      marginBottom: '1rem'
    },
    tarjetaExamenHover: {
      transform: 'translateX(3px)',
      borderLeftColor: '#0d6efd'
    }
  };

  return (
    <div style={estilos.contenedorPrincipal}>
      <div style={estilos.contenido}>
        {/* Encabezado del Paciente */}
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <div>
            <h1 className="h2">Nombre del Paciente</h1>
            <div className="d-flex text-muted">
              <span className="me-3"><i className="bi bi-gender-female"></i> Género</span>
              <span className="me-3"><i className="bi bi-calendar"></i> Edad</span>
              <span><i className="bi bi-telephone"></i> Teléfono</span>
            </div>
          </div>
          <div className="btn-toolbar mb-2 mb-md-0">
            <button className="btn btn-sm btn-outline-secondary me-2">
              <i className="bi bi-printer"></i> Imprimir
            </button>
            <button className="btn btn-sm btn-primary">
              <i className="bi bi-plus-circle"></i> Nuevo Examen
            </button>
          </div>
        </div>

        {/* Navegación por pestañas */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button 
              className={`nav-link ${pestañaActiva === 'informacion' ? 'active' : ''}`}
              onClick={() => cambiarPestaña('informacion')}
            >
              Información
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${pestañaActiva === 'historial' ? 'active' : ''}`}
              onClick={() => cambiarPestaña('historial')}
            >
              Historial Clínico
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${pestañaActiva === 'examenes' ? 'active' : ''}`}
              onClick={() => cambiarPestaña('examenes')}
            >
              Exámenes de Vista
            </button>
          </li>
        </ul>

        {/* Contenido de las pestañas */}
        <div>
          {/* Pestaña de Información */}
          {pestañaActiva === 'informacion' && (
            <div className="row">
              <div className="col-md-6">
                <div className="card" style={estilos.tarjetaSeccion}>
                  <div className="card-header bg-light">
                    <h5 className="mb-0">Datos Personales</h5>
                  </div>
                  <div className="card-body">
                    <dl className="row">
                      <dt className="col-sm-4">Nombre completo:</dt>
                      <dd className="col-sm-8">{datosPaciente.informacionPersonal.nombreCompleto}</dd>
                      
                      <dt className="col-sm-4">Fecha de nacimiento:</dt>
                      <dd className="col-sm-8">{datosPaciente.informacionPersonal.fechaNacimiento}</dd>
                      
                      <dt className="col-sm-4">Género:</dt>
                      <dd className="col-sm-8">{datosPaciente.informacionPersonal.genero}</dd>
                      
                      <dt className="col-sm-4">Ocupación:</dt>
                      <dd className="col-sm-8">{datosPaciente.informacionPersonal.ocupacion}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card" style={estilos.tarjetaSeccion}>
                  <div className="card-header bg-light">
                    <h5 className="mb-0">Contacto</h5>
                  </div>
                  <div className="card-body">
                    <dl className="row">
                      <dt className="col-sm-4">Dirección:</dt>
                      <dd className="col-sm-8">{datosPaciente.informacionContacto.direccion}</dd>
                      
                      <dt className="col-sm-4">Teléfono:</dt>
                      <dd className="col-sm-8">{datosPaciente.informacionContacto.telefono}</dd>
                      
                      <dt className="col-sm-4">Email:</dt>
                      <dd className="col-sm-8">{datosPaciente.informacionContacto.email}</dd>
                      
                      <dt className="col-sm-4">Fecha registro:</dt>
                      <dd className="col-sm-8">{datosPaciente.informacionContacto.fechaRegistro}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pestaña de Historial Clínico */}
          {pestañaActiva === 'historial' && (
            <div className="card" style={estilos.tarjetaSeccion}>
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Historial Clínico</h5>
                <button className="btn btn-sm btn-outline-primary">
                  <i className="bi bi-pencil"></i> Editar
                </button>
              </div>
              <div className="card-body">
                <form>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <h6 className="border-bottom pb-2">Antecedentes de salud</h6>
                      <div className="mb-3">
                        <label className="form-label">Enfermedades crónicas</label>
                        <textarea 
                          className="form-control" 
                          rows="3"
                          value={datosPaciente.historialMedico.enfermedadesCronicas}
                          readOnly
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Alergias</label>
                        <textarea 
                          className="form-control" 
                          rows="2"
                          value={datosPaciente.historialMedico.alergias}
                          readOnly
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Cirugías previas</label>
                        <textarea 
                          className="form-control" 
                          rows="2"
                          value={datosPaciente.historialMedico.cirugiasPrevias}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h6 className="border-bottom pb-2">Antecedentes familiares</h6>
                      <div className="mb-3">
                        <label className="form-label">Enfermedades oculares</label>
                        <textarea 
                          className="form-control" 
                          rows="3"
                          value={datosPaciente.historialMedico.enfermedadesOcularesFamiliares}
                          readOnly
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Otras enfermedades</label>
                        <textarea 
                          className="form-control" 
                          rows="2"
                          value={datosPaciente.historialMedico.otrasEnfermedadesFamiliares}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="border-bottom pb-2">Medicamentos actuales</h6>
                      <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <textarea 
                          className="form-control" 
                          rows="2"
                          value={datosPaciente.historialMedico.medicamentosActuales}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h6 className="border-bottom pb-2">Observaciones</h6>
                      <div className="mb-3">
                        <textarea 
                          className="form-control" 
                          rows="4"
                          value={datosPaciente.historialMedico.observaciones}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-end mt-3">
                    <button type="button" className="btn btn-secondary me-2">Cancelar</button>
                    <button type="submit" className="btn btn-primary">Guardar cambios</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Pestaña de Exámenes Oculares */}
          {pestañaActiva === 'examenes' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Exámenes de Vista</h5>
                <button className="btn btn-sm btn-primary">
                  <i className="bi bi-plus-circle"></i> Nuevo Examen
                </button>
              </div>
              
              {/* Lista de exámenes */}
              <div>
                {datosPaciente.examenesOculares.map((examen) => (
                  <div 
                    className="card" 
                    style={{
                      ...estilos.tarjetaExamen,
                      ...(examenExpandido === examen.id ? estilos.tarjetaExamenHover : {})
                    }} 
                    key={examen.id}
                  >
                    <div className="card-header">
                      <div className="d-flex justify-content-between align-items-center">
                        <button 
                          className="btn btn-link text-decoration-none" 
                          type="button" 
                          onClick={() => toggleExamen(examen.id)}
                        >
                          <h6 className="mb-0">
                            <i className={`bi bi-chevron-${examenExpandido === examen.id ? 'down' : 'right'} me-2`}></i>
                            Examen #{examen.id} - {examen.fecha}
                          </h6>
                        </button>
                        <div>
                          {examen.diagnosticos.map((diag, index) => (
                            <span key={index} className="badge bg-info me-2">{diag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {examenExpandido === examen.id && (
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Ojo Derecho (OD)</h6>
                            <dl className="row small">
                              <dt className="col-sm-4">Esfera:</dt>
                              <dd className="col-sm-8">{examen.ojoDerecho.esfera}</dd>
                              
                              <dt className="col-sm-4">Cilindro:</dt>
                              <dd className="col-sm-8">{examen.ojoDerecho.cilindro}</dd>
                              
                              <dt className="col-sm-4">Eje:</dt>
                              <dd className="col-sm-8">{examen.ojoDerecho.eje}</dd>
                            </dl>
                          </div>
                          <div className="col-md-6">
                            <h6>Ojo Izquierdo (OI)</h6>
                            <dl className="row small">
                              <dt className="col-sm-4">Esfera:</dt>
                              <dd className="col-sm-8">{examen.ojoIzquierdo.esfera}</dd>
                              
                              <dt className="col-sm-4">Cilindro:</dt>
                              <dd className="col-sm-8">{examen.ojoIzquierdo.cilindro}</dd>
                              
                              <dt className="col-sm-4">Eje:</dt>
                              <dd className="col-sm-8">{examen.ojoIzquierdo.eje}</dd>
                            </dl>
                          </div>
                        </div>
                        
                        <div className="row mt-3">
                          <div className="col-md-6">
                            <h6>Diagnóstico</h6>
                            <p>{examen.notasDiagnosticas}</p>
                          </div>
                          <div className="col-md-6">
                            <h6>Observaciones</h6>
                            <p>{examen.observaciones}</p>
                          </div>
                        </div>
                        
                        <div className="d-flex justify-content-end mt-3">
                          <button className="btn btn-sm btn-outline-primary me-2">
                            <i className="bi bi-file-earmark-text"></i> Ver Receta
                          </button>
                          <button className="btn btn-sm btn-outline-success me-2">
                            <i className="bi bi-cash-coin"></i> Cotización
                          </button>
                          <button className="btn btn-sm btn-outline-secondary">
                            <i className="bi bi-printer"></i> Imprimir
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialClinico;