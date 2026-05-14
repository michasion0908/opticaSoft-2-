import axios from 'axios';
import { BASE_URL } from './config.js'; 

// Obtener todos los exámenes de vista
export const getExamenesVista = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/ExamenVista`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener los exámenes de vista:", error.response?.data || error.message);
    throw new Error('Error al obtener los exámenes de vista');
  }
};

// Crear un nuevo examen de vista
export const createExamenVista = async (
  idPaciente,
  idOptometrista,
  NoExamen,
  rx_esfera_od,
  rx_cilindro_od,
  rx_eje_od,
  rx_esfera_oi,
  rx_cilindro_oi,
  rx_eje_oi,
  add_lente,
  ao,
  dnp,
  defRefractivo,
  observaciones
) => {
  try {
    await axios.post(`${BASE_URL}/ExamenVista/create`, {
      idPaciente,
      idOptometrista,
      NoExamen,
      rx_esfera_od,
      rx_cilindro_od,
      rx_eje_od,
      rx_esfera_oi,
      rx_cilindro_oi,
      rx_eje_oi,
      add_lente,
      ao,
      dnp,
      defRefractivo,
      observaciones
    });
  } catch (error) {
    console.error("Error al registrar el examen de vista:", error.response?.data || error.message);
    throw new Error('Error al registrar el examen de vista');
  }
};

// Actualizar un examen de vista existente
export const updateExamenVista = async (
  idExamenVista,
  idPaciente,
  idOptometrista,
  NoExamen,
  rx_esfera_od,
  rx_cilindro_od,
  rx_eje_od,
  rx_esfera_oi,
  rx_cilindro_oi,
  rx_eje_oi,
  add_lente,
  ao,
  dnp,
  defRefractivo,
  observaciones
) => {
  try {
    await axios.put(`${BASE_URL}/ExamenVista/update/${idExamenVista}`, {
      idPaciente,
      idOptometrista,
      NoExamen,
      rx_esfera_od,
      rx_cilindro_od,
      rx_eje_od,
      rx_esfera_oi,
      rx_cilindro_oi,
      rx_eje_oi,
      add_lente,
      ao,
      dnp,
      defRefractivo,
      observaciones
    });
  } catch (error) {
    console.error("Error al actualizar el examen de vista:", error.response?.data || error.message);
    throw new Error('Error al actualizar el examen de vista');
  }
};

// Eliminar un examen de vista
export const deleteExamenVista = async (idExamenVista) => {
  try {
    await axios.delete(`${BASE_URL}/ExamenVista/delete/${idExamenVista}`);
  } catch (error) {
    console.error("Error al eliminar el examen de vista:", error.response?.data || error.message);
    throw new Error('Error al eliminar el examen de vista');
  }
};
