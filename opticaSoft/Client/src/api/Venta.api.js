import axios from 'axios';
import { BASE_URL } from './config.js'; 

// Obtener todas las ventas
export const getVentas = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/Ventas`);
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener las ventas:", error.response?.data || error.message);
        throw new Error('Error al obtener las ventas');
    }
};

// Crear una nueva venta
export const createVenta = async (idCotizacion, estado, metodoPago, referenciaPago, total, abono) => {
    try {
        console.log("Creando venta con los siguientes datos:", {idCotizacion, estado, metodoPago, referenciaPago, total, abono})
        await axios.post(`${BASE_URL}/Ventas/create`, {
            idCotizacion,
            estado,
            metodoPago,
            referenciaPago,
            total,
            abono
        });
    } catch (error) {
        console.error("Error al registrar la venta:", error.response?.data || error.message);
        throw new Error('Error al registrar la venta');
    }
};

// Actualizar una venta
export const updateVenta = async (idVenta, idCotizacion, estado, metodoPago, referenciaPago, total, abono) => {
    try {
        await axios.put(`${BASE_URL}/Ventas/update/${idVenta}`, {
            idCotizacion,
            estado,
            metodoPago,
            referenciaPago,
            total,
            abono
        });
    } catch (error) {
        console.error("Error al actualizar la venta:", error.response?.data || error.message);
        throw new Error('Error al actualizar la venta');
    }
};

// Eliminar una venta
export const deleteVenta = async (idVenta) => {
    try {
        await axios.delete(`${BASE_URL}/Ventas/delete/${idVenta}`);
    } catch (error) {
        console.error("Error al eliminar la venta:", error.response?.data || error.message);
        throw new Error('Error al eliminar la venta');
    }
};
