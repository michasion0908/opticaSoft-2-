import Swal from 'sweetalert2';
import { 
    getPedidosTratamientos, 
    createPedidoTratamiento, 
    updatePedidoTratamiento, 
    deletePedidoTratamiento 
} from "../../api/PedidosTratamientos.api.js";

// Obtener todos los Pedidos-Tratamientos
export const getPedidosTratamientosJs = async (setPedidosTratamientos) => {
    try {
        const data = await getPedidosTratamientos();
        setPedidosTratamientos(data);
    } catch (error) {
        console.error('Error al obtener los Pedidos-Tratamientos:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al obtener los Pedidos-Tratamientos.',
        });
    }
};

// Crear un nuevo Pedido-Tratamiento
export const createPedidoTratamientoJs = async (idTratamiento, idPedido, setShowModal, getPedidosTratamientosJs) => {
    console.log("Datos del Pedido-Tratamientos js:", idTratamiento, idPedido);
    try {
        await createPedidoTratamiento(idTratamiento, idPedido);
        getPedidosTratamientosJs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El Pedido-Tratamiento se registró correctamente.',
        });
        setShowModal(false);
    } catch (error) {
        console.error('Error al registrar el Pedido-Tratamiento:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al registrar el Pedido-Tratamiento.',
        });
    }
};

// Actualizar un Pedido-Tratamiento existente
export const updatePedidoTratamientoJs = async (idPedidos_Tratamiento, idTratamiento, idPedido, setShowEditModal, getPedidosTratamientosJs) => {
    console.log("Actualizando Pedido-Tratamiento:", { idPedidos_Tratamiento, idTratamiento, idPedido });
    try {
        await updatePedidoTratamiento(idPedidos_Tratamiento, idTratamiento, idPedido);
        getPedidosTratamientosJs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El Pedido-Tratamiento se actualizó correctamente.',
        });
        setShowEditModal(false);
    } catch (error) {
        console.error('Error al actualizar el Pedido-Tratamiento:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar el Pedido-Tratamiento.',
        });
    }
};

// Eliminar un Pedido-Tratamiento
export const deletePedidoTratamientoJs = async (idPedidos_Tratamiento, getPedidosTratamientosJs, setShowDeleteModal) => {
    try {
        await deletePedidoTratamiento(idPedidos_Tratamiento);
        getPedidosTratamientosJs();
        setShowDeleteModal(false);
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El Pedido-Tratamiento se eliminó correctamente.',
        });
    } catch (error) {
        console.error('Error al eliminar el Pedido-Tratamiento:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar el Pedido-Tratamiento.',
        });
    }
};
