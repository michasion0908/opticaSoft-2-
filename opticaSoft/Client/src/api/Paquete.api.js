import axios from 'axios';
import { BASE_URL } from './config.js';

// Obtener todos los paquetes
export const getPaquetes = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/Paquete`);
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener los paquetes:", error.response?.data || error.message);
        throw new Error('Error al obtener los paquetes');
    }
};

// Crear un nuevo paquete
export const createPaquete = async (nombre, descripcion, total, vigencia, estado) => {
    try {
        await axios.post(`${BASE_URL}/Paquete/create`, {
            nombre,
            descripcion,
            total,
            vigencia,
            estado
        });
    } catch (error) {
        console.error("Error al crear el paquete:", error.response?.data || error.message);
        throw new Error('Error al crear el paquete');
    }
};

// Actualizar un paquete existente
export const updatePaquete = async (idPaquete, nombre, descripcion, total, vigencia, estado) => {
    try {
        const response = await axios.put(`${BASE_URL}/Paquete/update/${idPaquete}`, {
            nombre,
            descripcion,
            total,
            vigencia,
            estado
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el paquete:", error.response?.data || error.message);
        throw new Error('Error al actualizar el paquete');
    }
};

// Eliminar un paquete
export const deletePaquete = async (idPaquete) => {
    try {
        const response = await axios.delete(`${BASE_URL}/Paquete/delete/${idPaquete}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el paquete:", error.response?.data || error.message);
        throw new Error('Error al eliminar el paquete');
    }
};
