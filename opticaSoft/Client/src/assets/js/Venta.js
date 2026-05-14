import Swal from 'sweetalert2';
import { getVentas, createVenta, updateVenta, deleteVenta } from "../../api/Venta.api";

// Obtener todas las ventas
export const getVentasjs = async (setVentasjs) => {
    try {
        const data = await getVentas();
        setVentasjs(data);
    } catch (error) {
        console.error('Error al obtener las ventas:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al obtener las ventas.',
        });
    }
};

// Crear una nueva venta
export const createVentasjs = async (idCotizacion, estado, metodoPago, referenciaPago, total, abono, setShowModal, getVentasjs) => {
    try {
         console.log("Creando venta con los siguientes datos:", {idCotizacion, estado, metodoPago, referenciaPago, total, abono})
        await createVenta(idCotizacion, estado, metodoPago, referenciaPago, total, abono);
        getVentasjs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'La venta se registró correctamente.',
        });
        setShowModal(false);
    } catch (error) {
        console.error('Error al registrar la venta:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al registrar la venta.',
        });
    }
};

// Actualizar una venta
export const updateVentasjs = async (idVenta, idCotizacion, estado, metodoPago, referenciaPago, total, abono, setShowEditModal, getVentasjs) => {
    try {
        await updateVenta(idVenta, idCotizacion, estado, metodoPago, referenciaPago, total, abono);
        getVentasjs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'La venta se actualizó correctamente.',
        });
        setShowEditModal(false);
    } catch (error) {
        console.error('Error al actualizar la venta:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar la venta.',
        });
    }
};

// Eliminar una venta
export const deleteVentasjs = async (idVenta, getVentasjs, setShowDeleteModal) => {
    try {
        await deleteVenta(idVenta);
        getVentasjs();
        setShowDeleteModal(false);
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'La venta se eliminó correctamente.',
        });
    } catch (error) {
        console.error('Error al eliminar la venta:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar la venta.',
        });
    }
};
