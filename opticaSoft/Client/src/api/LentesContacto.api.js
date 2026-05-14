import axios from 'axios';
import { BASE_URL } from './config.js'; 

export const getLentesContacto = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/LentesContacto`);
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener los lentes de contacto:", error.response?.data || error.message);
        throw new Error('Error al obtener los lentes de contacto');
    }
};

export const createLentesContacto = async (marca, modelo, duracion, esfera, precio) => {
    try {
        await axios.post(`${BASE_URL}/LentesContacto/create`, { marca, modelo, duracion, esfera, precio });
    } catch (error) {
        console.error("Error al registrar el lente de contacto:", error.response?.data || error.message);
        throw new Error('Error al registrar el lente de contacto');
    }
};

export const updateLentesContacto = async (idLentesContacto, marca, modelo, duracion, esfera, precio) => {
    console.log("Llegando update api", { marca, modelo, duracion, esfera, precio });  
    try {
        await axios.put(`${BASE_URL}/LentesContacto/update/${idLentesContacto}`, { marca, modelo, duracion, esfera, precio });
    } catch (error) {
        console.error("Error al actualizar el lente de contacto:", error.response?.data || error.message);
        throw new Error('Error al actualizar el lente de contacto');
    }
};

export const deleteLentesContacto = async (idLentesContacto) => {
    try {
        await axios.delete(`${BASE_URL}/LentesContacto/delete/${idLentesContacto}`);
    } catch (error) {
        console.error("Error al eliminar el lente de contacto:", error.response?.data || error.message);
        throw new Error('Error al eliminar el lente de contacto');
    }
};
