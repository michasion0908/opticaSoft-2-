import axios from 'axios';
import { BASE_URL } from './config.js'; 

export const getMaterial = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/Material`);
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener los materiales:", error.response?.data || error.message);
        throw new Error('Error al obtener los materiales');
    }
};

export const createMaterial = async (nombre, precio) => {
    try {
        await axios.post(`${BASE_URL}/Material/create`, { nombre, precio });
    } catch (error) {
        console.error("Error al registrar el material:", error.response?.data || error.message);
        throw new Error('Error al registrar el material');
    }
};

export const updateMaterial = async (idMaterial, nombre, precio) => {
    console.log("Llegando update api", { nombre, precio });  
    try {
        await axios.put(`${BASE_URL}/Material/update/${idMaterial}`, { nombre, precio });
    } catch (error) {
        console.error("Error al actualizar el material:", error.response?.data || error.message);
        throw new Error('Error al actualizar el material');
    }
};

export const deleteMaterial = async (idMaterial) => {
    try {
        await axios.delete(`${BASE_URL}/Material/delete/${idMaterial}`);
    } catch (error) {
        console.error("Error al eliminar el material:", error.response?.data || error.message);
        throw new Error('Error al eliminar el material');
    }
};
