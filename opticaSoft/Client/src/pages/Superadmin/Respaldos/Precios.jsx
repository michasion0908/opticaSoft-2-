import { useState, useEffect } from 'react';
/* import { getLentesContactojs } from '../../assets/js/LentesContacto';
import { getMaterialjs } from '../../assets/js/Material';
import { getTratamientosjs } from '../../assets/js/Tratamiento';
import { getTipoLentejs } from '../../assets/js/TipoLente';
import { getPaquetesJs } from '../../assets/js/Paquete';
import { getInventariojs } from '../../assets/js/Inventario'; */

import { getLentesContacto } from '../../api/LentesContacto.api';
import { getMaterial } from '../../api/Material.api';
import { getTratamientos } from '../../api/Tratamientos.api';
import { getTipoLente } from '../../api/TipoLente.api';
import { getPaquetes } from '../../api/Paquete.api';
import { getInventario } from '../../api/Inventario.api';

const Precios = () => {
   const [lentesContacto, setLentesContacto] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [tratamientos, setTratamientos] = useState([]);
  const [tiposLente, setTiposLente] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener todos los datos en paralelo
        const [
          lentesData,
          materialesData,
          tratamientosData,
          tiposLenteData,
          paquetesData,
          inventarioData
        ] = await Promise.all([
          getLentesContacto(),
          getMaterial(),
          getTratamientos(),
          getTipoLente(),
          getPaquetes(),
          getInventario()
        ]);

        setLentesContacto(lentesData);
        setMateriales(materialesData);
        setTratamientos(tratamientosData);
        setTiposLente(tiposLenteData);
        setPaquetes(paquetesData);
        setInventario(inventarioData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-5">Cargando datos...</div>;
  if (error) return <div className="text-center py-5 text-danger">Error: {error}</div>;

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Gestión de Óptica</h1>
      
      {/* Tabla de Lentes de Contacto */}
      <div className="mb-5">
        <h2>Lentes de Contacto</h2>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Duración</th>
                <th>Esfera</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {lentesContacto.map(lente => (
                <tr key={lente.idLentesContacto}>
                  <td>{lente.idLentesContacto}</td>
                  <td>{lente.marca}</td>
                  <td>{lente.modelo}</td>
                  <td>{lente.duracion}</td>
                  <td>{lente.esfera}</td>
                  <td>{lente.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de Paquetes */}
      <div className="mb-5">
        <h2>Paquetes</h2>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Total</th>
                <th>Vigencia</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {paquetes.map(paquete => (
                <tr key={paquete.idPaquete}>
                  <td>{paquete.idPaquete}</td>
                  <td>{paquete.nombre}</td>
                  <td>{paquete.descripcion}</td>
                  <td>${paquete.total}</td>
                  <td>{new Date(paquete.vigencia).toLocaleDateString()}</td>
                  <td className={paquete.estado === 'ACTIVO' ? 'text-success' : 'text-danger'}>
                    {paquete.estado}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de Tipos de Lente */}
      <div className="mb-5">
        <h2>Tipos de Lente</h2>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {tiposLente.map(tipo => (
                <tr key={tipo.idTipoLente}>
                  <td>{tipo.idTipoLente}</td>
                  <td>{tipo.nombre}</td>
                  <td>{tipo.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de Materiales */}
      <div className="mb-5">
        <h2>Materiales</h2>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {materiales.map(material => (
                <tr key={material.idMaterial}>
                  <td>{material.idMaterial}</td>
                  <td>{material.nombre}</td>
                  <td>{material.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de Tratamientos */}
      <div className="mb-5">
        <h2>Tratamientos</h2>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {tratamientos.map(tratamiento => (
                <tr key={tratamiento.idTratamiento}>
                  <td>{tratamiento.idTratamiento}</td>
                  <td>{tratamiento.nombre}</td>
                  <td>{tratamiento.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de Inventario */}
      <div className="mb-5">
        <h2>Inventario</h2>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Color</th>
                <th>Número Color</th>
                <th>Material</th>
                <th>Cantidad</th>
                <th>Exhibición</th>
                <th>Precio</th>
                <th>Fecha</th>
                <th>Estatus</th>
                <th>Precio Venta</th>
              </tr>
            </thead>
            <tbody>
              {inventario.map(item => (
                <tr key={item.idInventario}>
                  <td>{item.idInventario}</td>
                  <td>{item.marca}</td>
                  <td>{item.modelo}</td>
                  <td>{item.color}</td>
                  <td>{item.numeroColor}</td>
                  <td>{item.material}</td>
                  <td>{item.cantidad}</td>
                  <td>{item.exhibicion}</td>
                  <td>{item.precio}</td>
                  <td>{new Date(item.fecha).toLocaleDateString()}</td>
                  <td className={item.estatus === 'Disponible' ? 'text-success' : 'text-danger'}>
                    {item.estatus}
                  </td>
                  <td>${item.precioVenta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Precios;