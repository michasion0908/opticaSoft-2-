import { FaUserCircle } from "react-icons/fa";

export default function PacienteInfo({ pacienteData, formatDateString, detailed = false }) {
    if (!detailed) {
        return (
            <div className="d-flex align-items-center mb-2 mb-md-0">
                <div className="me-3">
                    <FaUserCircle className="text-primary" size={48} />
                </div>
                <div>
                    <h3 className="mb-1 text-dark">{pacienteData.nombrePaciente}</h3>
                    <div className="d-flex flex-wrap align-items-center text-muted small">
                        <span className="d-flex align-items-center me-3">
                            <i className={`bi bi-gender-${pacienteData.sexo === 'Femenino' ? 'female' : 'male'} me-2`}></i>
                            {pacienteData.sexo}
                        </span>
                        <span className="d-flex align-items-center me-3">
                            <i className="bi bi-calendar me-2"></i>
                            {pacienteData.edad} años
                        </span>
                        <span className="d-flex align-items-center me-3">
                            <i className="bi bi-telephone me-2"></i>
                            {pacienteData.telefono}
                        </span>
                        <span className="d-flex align-items-center">
                            <i className="bi bi-heart-pulse me-2"></i>
                            ID: {pacienteData.idPaciente}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="row g-4">
            {/* Tarjeta de Datos Personales */}
            <div className="col-md-6">
                <div className="crud-card h-100">
                    <div className="crud-card-header d-flex align-items-center">
                        <i className="bi bi-person-vcard-fill me-2"></i>
                        <h5 className="mb-0">Datos Personales</h5>
                    </div>
                    <div className="crud-card-body">
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Nombre completo</span>
                                <span className="info-value">{pacienteData.nombrePaciente}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Fecha nacimiento/Edad</span>
                                <span className="info-value">{formatDateString(pacienteData.fechaNacimiento)} {pacienteData.edad}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Género</span>
                                <span className="info-value">
                                    <i className={`bi bi-gender-${pacienteData.sexo === 'Femenino' ? 'female' : 'male'} me-2`}></i>
                                    {pacienteData.sexo}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Ocupación</span>
                                <span className="info-value">{pacienteData.ocupacion || 'No especificado'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tarjeta de Contacto */}
            <div className="col-md-6">
                <div className="crud-card h-100">
                    <div className="crud-card-header d-flex align-items-center">
                        <i className="bi bi-telephone-fill me-2"></i>
                        <h5 className="mb-0">Información de Contacto</h5>
                    </div>
                    <div className="crud-card-body">
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Dirección</span>
                                <span className="info-value">{pacienteData.direccion || 'No especificado'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Teléfono</span>
                                <span className="info-value">
                                    <i className="bi bi-telephone me-2"></i>
                                    {pacienteData.telefono || 'No especificado'}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Email</span>
                                <span className="info-value">
                                    {pacienteData.email ? (
                                        <a href={`mailto:${pacienteData.email}`} className="text-primary">
                                            {pacienteData.email}
                                        </a>
                                    ) : 'No especificado'}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Fecha registro</span>
                                <span className="info-value">{formatDateString(pacienteData.fechaRegistro)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}