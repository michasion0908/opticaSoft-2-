import axios from 'axios';
import { BASE_URL } from './config.js'; 


// Obtener todos los registros del Historial Clínico
export const getHistorialClinico = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/HistorialClinico`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener los historiales clínicos:", error.response?.data || error.message);
    throw new Error('Error al obtener los historiales clínicos');
  }
};

// Crear un nuevo registro en Historial Clínico
export const createHistorialClinico = async (
  idPaciente,
  antecedentes_salud,
  antecedentes_familiares,
  medicamentos,
  dosis,
  cirugias
) => {

  try {
    await axios.post(`${BASE_URL}/HistorialClinico/create`, {
      idPaciente,
      antecedentes_salud,
      antecedentes_familiares,
      medicamentos,
      dosis,
      cirugias
    });
  } catch (error) {
    console.error("Error al registrar el historial clínico:", error.response?.data || error.message);
    throw new Error('Error al registrar el historial clínico');
  }
};

// Actualizar un registro existente en Historial Clínico
export const updateHistorialClinico = async (
  idHistorialClinico,
    idPaciente,
    antecedentes_salud,
    antecedentes_familiares,
    medicamentos,
    dosis,
    cirugias
) => {
  console.log("Llegando al update API:", {
    idPaciente,
    antecedentes_salud,
    antecedentes_familiares,
    medicamentos,
    dosis,
    cirugias
  });

  try {
    await axios.put(`${BASE_URL}/HistorialClinico/update/${idHistorialClinico}`, {
      idPaciente,
      antecedentes_salud,
      antecedentes_familiares,
      medicamentos,
      dosis,
      cirugias
    });
  } catch (error) {
    console.error("Error al actualizar el historial clínico:", error.response?.data || error.message);
    throw new Error('Error al actualizar el historial clínico');
  }
};

// Eliminar un registro de Historial Clínico
export const deleteHistorialClinico = async (idHistorialClinico) => {
  try {
    await axios.delete(`${BASE_URL}/HistorialClinico/delete/${idHistorialClinico}`);
  } catch (error) {
    console.error("Error al eliminar el historial clínico:", error.response?.data || error.message);
    throw new Error('Error al eliminar el historial clínico');
  }
};
