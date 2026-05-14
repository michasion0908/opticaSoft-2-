import axios from 'axios';

import { BASE_URL } from './config.js'; 

export const getTratamientos = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Tratamientos`);
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener los tratamientos:", error.response?.data || error.message);
      throw new Error('Error al obtener los tratamientos');
    }
  };

    export const createTratamientos = async ( nombre, precio) => {
        try {
        await axios.post(`${BASE_URL}/Tratamientos/create`, { nombre, precio});
        } catch (error) {
        console.error("Error al registrar el tratamiento:", error.response?.data || error.message);
        throw new Error('Error al registrar el tratamiento');
        }
    };

    export const updateTratamientos = async (idTratamiento, nombre, precio) => {
        console.log("Llegando update api", {nombre, precio});  
        try {
            await axios.put(`${BASE_URL}/Tratamientos/update/${idTratamiento}`, {nombre, precio});
            } catch (error) {
            console.error("Error al actualizar el tratamiento:", error.response?.data || error.message);
            throw new Error('Error al actualizar el tratamiento');
            }
        };

    export const deleteTratamientos  = async (idTratamiento) => {
        try {
        await axios.delete(`${BASE_URL}/Tratamientos/delete/${idTratamiento}`);
        } catch (error) {
        console.error("Error al eliminar el tratamiento:", error.response?.data || error.message);
        throw new Error('Error al eliminar el tratamiento');
        }
    };