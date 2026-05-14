import { useState } from 'react';
import { FaEye, FaEdit, FaTrash, FaSearch, FaChevronDown, FaChevronRight, FaPrint, FaEyeDropper, FaGlasses } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

export default function ExamenesVista({ 
    examenesVistaList, 
    searchText, 
    setSearchText,
    setSelectedExamenVista,
    setShowEditModal,
    setShowDeleteModal,
    formatDateString
}) {
    const [expandedExams, setExpandedExams] = useState([]);
    const [activeTab, setActiveTab] = useState('todos');

    const toggleExam = (id) => {
        setExpandedExams(prev => 
            prev.includes(id) 
                ? prev.filter(examId => examId !== id) 
                : [...prev, id]
        );
    };

    const filteredExams = examenesVistaList.filter(examen => {
        const matchesSearch = examen.idExamenVista.toString().includes(searchText) || 
                            (examen.fechaRegistro && examen.fechaRegistro.includes(searchText));
    
        
        return matchesSearch;
    });

    const getDefectoColor = (defecto) => {
        if (!defecto) return 'var(--crud-cancel)';
        if (defecto.toLowerCase().includes('miop')) return 'var(--crud-success)';
        if (defecto.toLowerCase().includes('hiper')) return 'var(--crud-cancel)';
        if (defecto.toLowerCase().includes('astig')) return 'var(--crud-warning)';
        return 'var(--crud-info)';
    };

    return (
        <div className="mb-4">
            {/* Encabezado con pestañas */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                <div>
                    <h4 className="mb-0 text-dark d-flex align-items-center">
                        <span className="icon-circle bg-primary-light me-3">
                            <FaEye color="var(--crud-primary)" />
                        </span>
                        <span style={{ color: 'var(--crud-dark)' }}>Historial de Exámenes Oculares</span>
                    </h4>
                    <p className="text-muted mb-0 mt-1">Registro completo de evaluaciones visuales</p>
                </div>
                
                <div className="crud-search-container w-100 w-md-auto">
                    <FaSearch className="crud-search-icon" />
                    <input
                        type="text"
                        className="form-control crud-search-input ps-4"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Buscar por ID o fecha..."
                    />
                </div>
            </div>
            
            {filteredExams.length === 0 ? (
                <div className="crud-card text-center py-5">
                    <div className="empty-state">
                        <FaEye className="empty-icon" color="var(--crud-primary)" size="3em" />
                        <h5 className="mt-3">No se encontraron exámenes</h5>
                        <p className="text-muted">No hay registros que coincidan con tu búsqueda</p>
                    </div>
                </div>
            ) : (
                <div className="row g-4">
                    {filteredExams.map(examen => (
                        <div key={examen.idExamenVista} className="col-12">
                            <div className={`crud-card ${expandedExams.includes(examen.idExamenVista) ? 'expanded' : ''}`}>
                                <div 
                                    className="crud-card-header d-flex justify-content-between align-items-center cursor-pointer"
                                    onClick={() => toggleExam(examen.idExamenVista)}
                                >
                                    <div className="d-flex align-items-center">
                                        <div className="exam-badge me-3">
                                            <span className="exam-number">#{examen.idExamenVista}</span>
                                        </div>
                                        <div>
                                            <div className="d-flex align-items-center flex-wrap gap-2">
                                                <span className="exam-date" style={{ fontWeight: 'bold', color: 'white' }}>
                                                    {formatDateString(examen.fechaRegistro)}
                                                </span>

                                                {examen.defRefractivo && (
                                                    <span 
                                                        className="defecto-tag" 
                                                        style={{ 
                                                            backgroundColor: getDefectoColor(examen.defRefractivo),
                                                            color: 'white'
                                                        }}
                                                    >
                                                        {examen.defRefractivo}
                                                    </span>
                                                )}
                                            </div>
                                            <small style={{color: 'white' }}>
                                            Click para {expandedExams.includes(examen.idExamenVista) ? 'minimizar' : 'expandir'}
                                           </small>
                                            </div>
                                    </div>
                                    {expandedExams.includes(examen.idExamenVista) ? 
                                        <FaChevronDown className="text-white" /> : 
                                        <FaChevronRight className="text-white" />}
                                </div>
                                
                                {expandedExams.includes(examen.idExamenVista) && (
                                    <div className="crud-card-body">
                                        {/* Sección de resultados */}
                                        <div className="results-section mb-4">
                                            <h6 className="section-title mb-3">
                                                <span className="title-decoration"></span>
                                                Resultados del Examen
                                            </h6>
                                            
                                            <div className="row">
                                                {/* Ojo Derecho */}
                                                <div className="col-md-6 mb-3">
                                                    <div className="eye-card right-eye">
                                                        <div className="eye-card-header">
                                                            <div className="eye-label">Ojo Derecho (OD)</div>
                                                            <div className="eye-icon">👁️</div>
                                                        </div>
                                                        <div className="eye-card-body">
                                                            <div className="row">
                                                                <div className="col-4">
                                                                    <div className="vision-param">
                                                                        <label>Esfera</label>
                                                                        <div className="value-box">
                                                                            {examen.rx_esfera_od || 'N/A'}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-4">
                                                                    <div className="vision-param">
                                                                        <label>Cilindro</label>
                                                                        <div className="value-box">
                                                                            {examen.rx_cilindro_od || 'N/A'}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-4">
                                                                    <div className="vision-param">
                                                                        <label>Eje</label>
                                                                        <div className="value-box">
                                                                            {examen.rx_eje_od || 'N/A'}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Ojo Izquierdo */}
                                                <div className="col-md-6 mb-3">
                                                    <div className="eye-card left-eye">
                                                        <div className="eye-card-header">
                                                            <div className="eye-label">Ojo Izquierdo (OI)</div>
                                                            <div className="eye-icon">👁️</div>
                                                        </div>
                                                        <div className="eye-card-body">
                                                            <div className="row">
                                                                <div className="col-4">
                                                                    <div className="vision-param">
                                                                        <label>Esfera</label>
                                                                        <div className="value-box">
                                                                            {examen.rx_esfera_oi || 'N/A'}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-4">
                                                                    <div className="vision-param">
                                                                        <label>Cilindro</label>
                                                                        <div className="value-box">
                                                                            {examen.rx_cilindro_oi || 'N/A'}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-4">
                                                                    <div className="vision-param">
                                                                        <label>Eje</label>
                                                                        <div className="value-box">
                                                                            {examen.rx_eje_oi || 'N/A'}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Parámetros adicionales */}
                                            <div className="additional-params row">
                                                <div className="col-md-4 mb-3">
                                                    <div className="param-card">
                                                        <label>Add Lente</label>
                                                        <div className="value">
                                                            {examen.add_lente || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <div className="param-card">
                                                        <label>Agudeza Visual (AO)</label>
                                                        <div className="value">
                                                            {examen.ao || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <div className="param-card">
                                                        <label>Distancia Naso-Pupilar (DNP)</label>
                                                        <div className="value">
                                                            {examen.dnp || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Observaciones */}
                                        <div className="observations-section mb-4">
                                            <h6 className="section-title mb-3">
                                                <span className="title-decoration"></span>
                                                Observaciones Clínicas
                                            </h6>
                                            <div className="observations-content">
                                                {examen.observaciones || 'No se registraron observaciones en este examen.'}
                                            </div>
                                        </div>
                                        
                                        {/* Acciones */}
                                        <div className="crud-card-footer">
                                            <button 
                                                className="crud-btn crud-btn-primary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedExamenVista(examen);
                                                    setShowEditModal(true);
                                                }}
                                            >
                                                <FaEdit className="me-1" /> Editar Examen
                                            </button>
                                            <button 
                                                className="crud-btn crud-btn-danger"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedExamenVista(examen);
                                                    setShowDeleteModal(true);
                                                }}
                                            >
                                                <FaTrash className="me-1" /> Eliminar
                                            </button>
                                            <button 
                                                className="crud-btn crud-btn-info"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <FaPrint className="me-1" /> Imprimir Receta
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* CSS adicional para este componente */}
            <style jsx>{`
                .icon-circle {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: var(--crud-primary-light);
                }
                
                .exam-badge {
                    background: white;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .exam-number {
                    font-weight: bold;
                    color: var(--crud-primary);
                }
                
                .exam-date {
                    font-weight: 500;
                    color: var(--crud-dark);
                }
                
                .defecto-tag {
                    padding: 0.25rem 0.5rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 500;
                }
                
                .section-title {
                    position: relative;
                    padding-left: 1rem;
                    color: var(--crud-dark);
                    font-weight: 600;
                }
                
                .section-title .title-decoration {
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: 4px;
                    background-color: var(--crud-primary);
                    border-radius: 2px;
                }
                
                .eye-card {
                    border-radius: var(--crud-card-radius);
                    overflow: hidden;
                    height: 100%;
                    border: 1px solid rgba(0,0,0,0.1);
                }
                
                .eye-card-header {
                    padding: 0.75rem 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background-color: #f8f9fa;
                }
                
                .eye-label {
                    font-weight: 600;
                    color: var(--crud-dark);
                }
                
                .eye-icon {
                    font-size: 1.25rem;
                }
                
                .eye-card-body {
                    padding: 1rem;
                    background: white;
                }
                
                .vision-param {
                    text-align: center;
                }
                
                .vision-param label {
                    display: block;
                    font-size: 0.8rem;
                    color: var(--crud-dark);
                    opacity: 0.7;
                    margin-bottom: 0.25rem;
                }
                
                .value-box {
                    background-color: var(--crud-primary-light);
                    padding: 0.5rem;
                    border-radius: 4px;
                    font-weight: 500;
                    color: var(--crud-dark);
                }
                
                .param-card {
                    background: white;
                    padding: 1rem;
                    border-radius: var(--crud-card-radius);
                    border: 1px solid rgba(0,0,0,0.05);
                    height: 100%;
                }
                
                .param-card label {
                    font-size: 0.8rem;
                    color: var(--crud-dark);
                    opacity: 0.7;
                    margin-bottom: 0.25rem;
                    display: block;
                }
                
                .param-card .value {
                    font-weight: 500;
                    color: var(--crud-dark);
                }
                
                .observations-content {
                    background: white;
                    padding: 1rem;
                    border-radius: var(--crud-card-radius);
                    border: 1px solid rgba(0,0,0,0.05);
                    min-height: 100px;
                }
                
                .empty-state {
                    padding: 2rem;
                }
                
                .empty-icon {
                    opacity: 0.5;
                }
                
                .right-eye .eye-card-header {
                    border-left: 4px solid var(--crud-primary);
                }
                
                .left-eye .eye-card-header {
                    border-left: 4px solid var(--crud-info);
                }
                
                .crud-card.expanded {
                    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                }
            `}</style>
        </div>
    );
}