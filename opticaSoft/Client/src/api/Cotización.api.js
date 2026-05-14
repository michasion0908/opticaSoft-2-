import axios from 'axios';
import { BASE_URL } from './config.js'; 

// Obtener todas las cotizaciones
export const getCotizaciones = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/Cotizacion`);
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener las cotizaciones:", error.response?.data || error.message);
        throw new Error('Error al obtener las cotizaciones');
    }
};

// Crear una nueva cotización
export const createCotizacion = async (idPaciente, tipo, subtotal, descuento, iva, total, observaciones) => {
    try {
        await axios.post(`${BASE_URL}/Cotizacion/create`, {
            idPaciente,
            tipo,
            subtotal,
            descuento,
            iva,
            total,
            observaciones
        });
    } catch (error) {
        console.error("Error al crear la cotización:", error.response?.data || error.message);
        throw new Error('Error al crear la cotización');
    }
};

// Actualizar una cotización existente
export const updateCotizacion = async (
    idCotizacion,
    idPaciente,
    tipo,
    subtotal,
    descuento,
    iva,
    total,
    observaciones
) => {
    try {
        const response = await axios.put(`${BASE_URL}/Cotizacion/update/${idCotizacion}`, {
            idPaciente,
            tipo,
            subtotal,
            descuento,
            iva,
            total,
            observaciones
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar la cotización:", error.response?.data || error.message);
        throw new Error('Error al actualizar la cotización');
    }
};

// Eliminar una cotización
export const deleteCotizacion = async (idCotizacion) => {
    try {
        const response = await axios.delete(`${BASE_URL}/Cotizacion/delete/${idCotizacion}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar la cotización:", error.response?.data || error.message);
        throw new Error('Error al eliminar la cotización');
    }
};
