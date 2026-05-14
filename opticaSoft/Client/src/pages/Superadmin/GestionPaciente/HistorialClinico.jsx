import { FaEdit, FaSave, FaNotesMedical, FaClinicMedical, FaPills, FaProcedures, FaTimes } from "react-icons/fa";

export default function HistorialClinico({ 
    pacienteData, 
    isEditing, 
    formData, 
    handleEditClick, 
    handleChange, 
    handleSave 
}) {
    const renderEditableField = (name, value, isTextArea = false) => {
        if (isEditing) {
            if (isTextArea) {
                return (
                    <textarea
                        name={name}
                        className="form-control"
                        value={value || ""}
                        onChange={handleChange}
                        style={{ 
                            minHeight: '100px',
                            borderRadius: '12px',
                            border: '2px solid var(--crud-primary-light)',
                            padding: '12px 16px',
                            fontSize: '0.95rem',
                            transition: 'all 0.3s ease',
                            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                        }}
                    />
                );
            }
            return (
                <input
                    type="text"
                    name={name}
                    className="form-control"
                    value={value || ""}
                    onChange={handleChange}
                    style={{
                        borderRadius: '12px',
                        border: '2px solid var(--crud-primary-light)',
                        padding: '10px 16px',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease'
                    }}
                />
            );
        }
        return (
            <div 
                className="form-control-plaintext"
                style={{
                    minHeight: isTextArea ? '100px' : 'auto',
                    backgroundColor: 'rgba(94, 114, 228, 0.05)',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px dashed rgba(94, 114, 228, 0.3)',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    transition: 'all 0.3s ease'
                }}
            >
                {value || <span className="text-muted" style={{ opacity: 0.7 }}>No se ha registrado información</span>}
            </div>
        );
    };

    return (
        <div className="crud-card" style={{
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
        }}>
            <div className="crud-card-header d-flex justify-content-between align-items-center" style={{
                padding: '1.25rem 1.75rem',
                background: 'linear-gradient(135deg, var(--crud-primary), #7a8ef1)',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div className="d-flex align-items-center">
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '14px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <FaNotesMedical style={{ 
                            color: 'white',
                            fontSize: '1.3rem'
                        }} />
                    </div>
                    <h4 className="mb-0 text-white" style={{
                        fontWeight: '600',
                        fontSize: '1.3rem',
                        letterSpacing: '0.5px'
                    }}>
                        Historial Clínico
                    </h4>
                </div>
                <button 
                    className={`btn d-flex align-items-center ${isEditing ? 'btn-outline-light' : 'btn-light'}`}
                    onClick={handleEditClick}
                    style={{
                        padding: '0.5rem 1.25rem',
                        borderRadius: '10px',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        boxShadow: isEditing ? 'none' : '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                >
                    {isEditing ? (
                        <>
                            <FaTimes className="me-2" /> Cancelar
                        </>
                    ) : (
                        <>
                            <FaEdit className="me-2" /> Editar Historial
                        </>
                    )}
                </button>
            </div>
            
            <div className="crud-card-body" style={{ padding: '1.75rem' }}>
                <div className="row g-4">
                    <div className="col-lg-6">
                        {/* Sección Antecedentes */}
                        <div className="section-block" style={{
                            backgroundColor: 'white',
                            padding: '1.5rem',
                            borderRadius: '14px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                            border: '1px solid rgba(0,0,0,0.03)'
                        }}>
                            <div className="section-header d-flex align-items-center mb-4">
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'rgba(251, 99, 64, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '12px'
                                }}>
                                    <FaClinicMedical style={{ 
                                        color: 'var(--crud-warning)',
                                        fontSize: '1.2rem'
                                    }} />
                                </div>
                                <h5 style={{
                                    color: 'var(--crud-dark)',
                                    fontWeight: '600',
                                    marginBottom: '0'
                                }}>
                                    Antecedentes Médicos
                                </h5>
                            </div>
                            
                            <div className="mb-4">
                                <label className="form-label d-flex align-items-center mb-3" style={{
                                    color: 'var(--crud-dark)',
                                    fontWeight: '500',
                                    fontSize: '0.95rem'
                                }}>
                                    <span style={{
                                        display: 'inline-block',
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: 'var(--crud-warning)',
                                        marginRight: '10px'
                                    }}></span>
                                    Antecedentes de Salud
                                </label>
                                {renderEditableField("antecedentes_salud", isEditing ? formData.antecedentes_salud : pacienteData.antecedentes_salud, true)}
                            </div>
                            
                            <div className="mb-2">
                                <label className="form-label d-flex align-items-center mb-3" style={{
                                    color: 'var(--crud-dark)',
                                    fontWeight: '500',
                                    fontSize: '0.95rem'
                                }}>
                                    <span style={{
                                        display: 'inline-block',
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: 'var(--crud-warning)',
                                        marginRight: '10px'
                                    }}></span>
                                    Antecedentes Familiares
                                </label>
                                {renderEditableField("antecedentes_familiares", isEditing ? formData.antecedentes_familiares : pacienteData.antecedentes_familiares, true)}
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-lg-6">
                        {/* Sección Tratamientos */}
                        <div className="section-block" style={{
                            backgroundColor: 'white',
                            padding: '1.5rem',
                            borderRadius: '14px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                            border: '1px solid rgba(0,0,0,0.03)'
                        }}>
                            <div className="section-header d-flex align-items-center mb-4">
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'rgba(17, 205, 239, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '12px'
                                }}>
                                    <FaPills style={{ 
                                        color: 'var(--crud-info)',
                                        fontSize: '1.2rem'
                                    }} />
                                </div>
                                <h5 style={{
                                    color: 'var(--crud-dark)',
                                    fontWeight: '600',
                                    marginBottom: '0'
                                }}>
                                    Tratamientos Actuales
                                </h5>
                            </div>
                            
                            <div className="mb-4">
                                <label className="form-label d-flex align-items-center mb-3" style={{
                                    color: 'var(--crud-dark)',
                                    fontWeight: '500',
                                    fontSize: '0.95rem'
                                }}>
                                    <span style={{
                                        display: 'inline-block',
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: 'var(--crud-info)',
                                        marginRight: '10px'
                                    }}></span>
                                    Medicamentos Recetados
                                </label>
                                {renderEditableField("medicamentos", isEditing ? formData.medicamentos : pacienteData.medicamentos, true)}
                            </div>
                            
                            <div className="mb-4">
                                <label className="form-label d-flex align-items-center mb-3" style={{
                                    color: 'var(--crud-dark)',
                                    fontWeight: '500',
                                    fontSize: '0.95rem'
                                }}>
                                    <span style={{
                                        display: 'inline-block',
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: 'var(--crud-info)',
                                        marginRight: '10px'
                                    }}></span>
                                    Dosis y Frecuencia
                                </label>
                                {renderEditableField("dosis", isEditing ? formData.dosis : pacienteData.dosis, true)}
                            </div>
                            
                            <div className="mb-2">
                                <label className="form-label d-flex align-items-center mb-3" style={{
                                    color: 'var(--crud-dark)',
                                    fontWeight: '500',
                                    fontSize: '0.95rem'
                                }}>
                                    <span style={{
                                        display: 'inline-block',
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: 'var(--crud-danger)',
                                        marginRight: '10px'
                                    }}></span>
                                    Cirugías Previas
                                </label>
                                {renderEditableField("cirugias", isEditing ? formData.cirugias : pacienteData.cirugias, true)}
                            </div>
                        </div>
                    </div>
                </div>
                
                {isEditing && (
                    <div className="d-flex justify-content-end mt-4 gap-3">
                        <button 
                            className="btn btn-primary d-flex align-items-center"
                            onClick={handleSave}
                            style={{
                                fontWeight: '600',
                                padding: '0.65rem 1.5rem',
                                borderRadius: '10px',
                                border: 'none',
                                background: 'linear-gradient(135deg, var(--crud-primary), #7a8ef1)',
                                color: 'white',
                                boxShadow: '0 4px 12px rgba(94, 114, 228, 0.3)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <FaSave className="me-2" /> Guardar Cambios
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}