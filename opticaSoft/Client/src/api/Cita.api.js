import axios from 'axios';
import { BASE_URL } from './config.js'; 

// Obtener todas las citas
export const getCitas = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/citas`);
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener las citas:", error.response?.data || error.message);
        throw new Error('Error al obtener las citas');
    }
};

// Crear una nueva cita
export const createCita = async (idPaciente, idOptometrista, fechaHora, duracionEstimada, estado, motivo, observaciones) => {
    console.log("Llegando update api", { idPaciente, idOptometrista, fechaHora, duracionEstimada, estado, motivo, observaciones });  
    try {
        await axios.post(`${BASE_URL}/Citas/create`, { idPaciente, idOptometrista, fechaHora, duracionEstimada, estado, motivo, observaciones });
    } catch (error) {
        console.error("Error al crear la cita:", error.response?.data || error.message);
        throw new Error('Error al crear la cita');
    }
};


// Actualizar una cita existente
export const updateCita = async (
    idCita, 
    idPaciente, 
    idOptometrista, 
    fechaHora, 
    duracionEstimada, 
    estado, 
    motivo, 
    observaciones
) => {
    try {
        const response = await axios.put(`${BASE_URL}/citas/update/${idCita}`, {
            idPaciente,
            idOptometrista,
            fechaHora,
            duracionEstimada,
            estado,
            motivo,
            observaciones
        });
        return response.data; // Devuelve la respuesta para manejar el resultado
    } catch (error) {
        console.error("Error al actualizar la cita:", error.response?.data || error.message);
        throw new Error('Error al actualizar la cita');
    }
};

// Eliminar una cita
export const deleteCita = async (idCita) => {
    try {
        const response = await axios.delete(`${BASE_URL}/citas/delete/${idCita}`);
        return response.data; // Devuelve la respuesta para manejar el resultado
    } catch (error) {
        console.error("Error al eliminar la cita:", error.response?.data || error.message);
        throw new Error('Error al eliminar la cita');
    }
};