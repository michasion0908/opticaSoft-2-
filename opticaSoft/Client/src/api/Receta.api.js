import axios from 'axios';
import { BASE_URL } from './config.js';

export const getRecetas = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/Receta`);
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener las recetas:", error.response?.data || error.message);
        throw new Error('Error al obtener las recetas');
    }
};

export const createReceta = async (idExamenVista, diagnostico, observaciones, vigencia) => {
    try {
        await axios.post(`${BASE_URL}/Receta/create`, { idExamenVista, diagnostico, observaciones, vigencia });
    } catch (error) {
        console.error("Error al registrar la receta:", error.response?.data || error.message);
        throw new Error('Error al registrar la receta');
    }
};

export const updateReceta = async (idReceta, idExamenVista, diagnostico, observaciones, vigencia) => {
    console.log("Actualizando receta", { idExamenVista, diagnostico, observaciones, vigencia });
    try {
        await axios.put(`${BASE_URL}/Receta/update/${idReceta}`, { idExamenVista, diagnostico, observaciones, vigencia });
    } catch (error) {
        console.error("Error al actualizar la receta:", error.response?.data || error.message);
        throw new Error('Error al actualizar la receta');
    }
};

export const deleteReceta = async (idReceta) => {
    try {
        await axios.delete(`${BASE_URL}/Receta/delete/${idReceta}`);
    } catch (error) {
        console.error("Error al eliminar la receta:", error.response?.data || error.message);
        throw new Error('Error al eliminar la receta');
    }
};