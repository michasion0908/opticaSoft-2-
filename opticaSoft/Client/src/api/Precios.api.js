import axios from 'axios';
import { BASE_URL } from './config.js'; 

// Obtener todos los registros del Historial Clínico
export const getPrecios = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Precios`);
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener los precios:", error.response?.data || error.message);
      throw new Error('Error al obtener los precios');
    }
  };
  
  // Crear un nuevo registro en Historial Clínico
  export const createPrecios = async ( idTipoLente, idMaterial, idTratamiento, serie, esfera, cilindro, combinada, precio, total) => {
    try {
      await axios.post(`${BASE_URL}/Precios/create`, {idTipoLente, idMaterial, idTratamiento, serie, esfera, cilindro, combinada, precio, total
      });
    } catch (error) {
      console.error("Error al registrar el precio:", error.response?.data || error.message);
      throw new Error('Error al registrar el precio');
    }
  };
  
  // Actualizar un registro existente en Historial Clínico
  export const updatePrecios = async (idPrecio, idTipoLente, idMaterial, idTratamiento, serie, esfera, cilindro, combinada, precio, total) => {
      console.log("Llegando al update API:", {
        idTipoLente, idMaterial, idTratamiento, serie, esfera, cilindro, combinada, precio, total
      });
    
      try {
        await axios.put(`${BASE_URL}/Precios/update/${idPrecio}`, {
            idTipoLente, idMaterial, idTratamiento, serie, esfera, cilindro, combinada, precio, total
        });
      } catch (error) {
        console.error("Error al actualizar el precio:", error.response?.data || error.message);
        throw new Error('Error al actualizar el precio');
      }
    };
  
    // Eliminar un registro de Historial Clínico
  export const deletePrecios = async (idPrecio) => {
      try {
        await axios.delete(`${BASE_URL}/Precios/delete/${idPrecio}`);
      } catch (error) {
        console.error("Error al eliminar el precio:", error.response?.data || error.message);
        throw new Error('Error al eliminar el precio');
      }
    };