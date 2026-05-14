import axios from 'axios';
import { BASE_URL } from './config.js';

// Obtener todos los detalles de paquetes
export const getPaqueteDetalles = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/PaqueteDetalle`);
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener los detalles de paquete:", error.response?.data || error.message);
        throw new Error('Error al obtener los detalles de paquete');
    }
};

// Crear un nuevo detalle de paquete
export const createPaqueteDetalle = async (idPaquete, idTipoLente, idMaterial, idTratamiento) => {
    try {
        await axios.post(`${BASE_URL}/PaqueteDetalle/create`, {
            idPaquete,
            idTipoLente,
            idMaterial,
            idTratamiento
        });
    } catch (error) {
        console.error("Error al crear el detalle de paquete:", error.response?.data || error.message);
        throw new Error('Error al crear el detalle de paquete');
    }
};

// Actualizar un detalle de paquete existente
export const updatePaqueteDetalle = async (idPaqueteDetalle, idPaquete, idTipoLente, idMaterial, idTratamiento) => {
    try {
        const response = await axios.put(`${BASE_URL}/PaqueteDetalle/update/${idPaqueteDetalle}`, {
            idPaquete,
            idTipoLente,
            idMaterial,
            idTratamiento
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el detalle de paquete:", error.response?.data || error.message);
        throw new Error('Error al actualizar el detalle de paquete');
    }
};

// Eliminar un detalle de paquete
export const deletePaqueteDetalle = async (idPaqueteDetalle) => {
    try {
        const response = await axios.delete(`${BASE_URL}/PaqueteDetalle/delete/${idPaqueteDetalle}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el detalle de paquete:", error.response?.data || error.message);
        throw new Error('Error al eliminar el detalle de paquete');
    }
};
