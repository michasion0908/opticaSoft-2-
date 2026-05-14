import axios from 'axios';
import { BASE_URL } from './config.js'; 

export const getPedidos = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/Pedidos`);
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener los pedidos:", error.response?.data || error.message);
        throw new Error('Error al obtener los pedidos');
    }
};

export const createPedido = async (pedido) => {
    console.log("Creando pedido", pedido);
    
    const {
        idCotizacion,
        idInventario,
        idTipoLente,
        idMaterial,
        idLentesContacto,
        idPaquete,
        cantidad,
        fechaEntrega,
        observaciones
    } = pedido;

    try {
        await axios.post(`${BASE_URL}/Pedidos/create`, {
            idCotizacion,
            idInventario,
            idTipoLente,
            idMaterial,
            idLentesContacto,
            idPaquete,
            cantidad,
            fechaEntrega,
            observaciones
        });
    } catch (error) {
        console.error("Error al registrar el pedido:", error.response?.data || error.message);
        throw new Error('Error al registrar el pedido');
    }
};

export const updatePedido = async (idPedido, pedido) => {
    const {
        idCotizacion,
        idInventario,
        idTipoLente,
        idMaterial,
        idLentesContacto,
        idPaquete,
        cantidad,
        fechaEntrega,
        observaciones
    } = pedido;

    console.log("Llegando update api", pedido);

    try {
        await axios.put(`${BASE_URL}/Pedidos/update/${idPedido}`, {
            idCotizacion,
            idInventario,
            idTipoLente,
            idMaterial,
            idLentesContacto,
            idPaquete,
            cantidad,
            fechaEntrega,
            observaciones
        });
    } catch (error) {
        console.error("Error al actualizar el pedido:", error.response?.data || error.message);
        throw new Error('Error al actualizar el pedido');
    }
};

export const deletePedido = async (idPedido) => {
    try {
        await axios.delete(`${BASE_URL}/Pedidos/delete/${idPedido}`);
    } catch (error) {
        console.error("Error al eliminar el pedido:", error.response?.data || error.message);
        throw new Error('Error al eliminar el pedido');
    }
};
