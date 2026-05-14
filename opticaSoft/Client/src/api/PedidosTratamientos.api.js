import axios from 'axios';
import { BASE_URL } from './config.js';

// Obtener todos los Pedidos-Tratamientos
export const getPedidosTratamientos = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/PedidosTratamientos`);
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener los Pedidos-Tratamientos:", error.response?.data || error.message);
        throw new Error('Error al obtener los Pedidos-Tratamientos');
    }
};

// Crear un nuevo Pedido-Tratamiento
export const createPedidoTratamiento = async (idTratamiento, idPedido) => {
    try {
        await axios.post(`${BASE_URL}/PedidosTratamientos/create`, { idTratamiento, idPedido });
    } catch (error) {
        console.error("Error al crear el Pedido-Tratamiento:", error.response?.data || error.message);
        throw new Error('Error al crear el Pedido-Tratamiento');
    }
};

// Actualizar un Pedido-Tratamiento existente
export const updatePedidoTratamiento = async (idPedidos_Tratamiento, idTratamiento, idPedido) => {
    try {
        const response = await axios.put(`${BASE_URL}/PedidosTratamientos/update/${idPedidos_Tratamiento}`, {
            idTratamiento,
            idPedido
        });
        return response.data; // Devuelve la respuesta para manejar el resultado
    } catch (error) {
        console.error("Error al actualizar el Pedido-Tratamiento:", error.response?.data || error.message);
        throw new Error('Error al actualizar el Pedido-Tratamiento');
    }
};

// Eliminar un Pedido-Tratamiento
export const deletePedidoTratamiento = async (idPedidos_Tratamiento) => {
    try {
        const response = await axios.delete(`${BASE_URL}/PedidosTratamientos/delete/${idPedidos_Tratamiento}`);
        return response.data; // Devuelve la respuesta para manejar el resultado
    } catch (error) {
        console.error("Error al eliminar el Pedido-Tratamiento:", error.response?.data || error.message);
        throw new Error('Error al eliminar el Pedido-Tratamiento');
    }
};
