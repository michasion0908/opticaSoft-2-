import Swal from 'sweetalert2'; 
import { getPedidos, createPedido, updatePedido, deletePedido } from "../../api/Pedido.api.js";

// Obtener todos los pedidos
export const getPedidosjs = async (setPedidos) => {
    try {
        const data = await getPedidos();
        setPedidos(data);
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al obtener los pedidos.',
        });
    }
};

// Crear un nuevo pedido
export const createPedidojs = async (pedido, setShowModal, getPedidosjs) => {
    console.log("Creando pedido", pedido);
    try {
        await createPedido(pedido);
        getPedidosjs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El pedido se registró correctamente.',
        });
        setShowModal(false);
    } catch (error) {
        console.error('Error al registrar el pedido:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al registrar el pedido.',
        });
    }
};

// Actualizar un pedido existente
export const updatePedidojs = async (idPedido, pedido, setShowEditModal, getPedidosjs) => {
    console.log("Actualizando pedido", { idPedido, ...pedido });
    try {
        await updatePedido(idPedido, pedido);
        getPedidosjs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El pedido se actualizó correctamente.',
        });
        setShowEditModal(false);
    } catch (error) {
        console.error('Error al actualizar el pedido:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar el pedido.',
        });
    }
};

// Eliminar un pedido
export const deletePedidojs = async (idPedido, getPedidosjs, setShowDeleteModal) => {
    try {
        await deletePedido(idPedido);
        getPedidosjs();
        setShowDeleteModal(false);
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El pedido se eliminó correctamente.',
        });
    } catch (error) {
        console.error('Error al eliminar el pedido:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar el pedido.',
        });
    }
};
