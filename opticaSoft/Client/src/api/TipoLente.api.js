import axios from 'axios';
import { BASE_URL } from './config.js'; 

export const getTipoLente = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/TipoLente`);
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener los tipos de lente:", error.response?.data || error.message);
        throw new Error('Error al obtener los tipos de lente');
    }
};

export const createTipoLente = async (nombre, precio) => {
    try {
        await axios.post(`${BASE_URL}/TipoLente/create`, { nombre, precio });
    } catch (error) {
        console.error("Error al registrar el tipo de lente:", error.response?.data || error.message);
        throw new Error('Error al registrar el tipo de lente');
    }
};

export const updateTipoLente = async (idTipoLente, nombre, precio) => {
    console.log("Llegando update api", { nombre, precio });  
    try {
        await axios.put(`${BASE_URL}/TipoLente/update/${idTipoLente}`, { nombre, precio });
    } catch (error) {
        console.error("Error al actualizar el tipo de lente:", error.response?.data || error.message);
        throw new Error('Error al actualizar el tipo de lente');
    }
};

export const deleteTipoLente = async (idTipoLente) => {
    try {
        await axios.delete(`${BASE_URL}/TipoLente/delete/${idTipoLente}`);
    } catch (error) {
        console.error("Error al eliminar el tipo de lente:", error.response?.data || error.message);
        throw new Error('Error al eliminar el tipo de lente');
    }
};
