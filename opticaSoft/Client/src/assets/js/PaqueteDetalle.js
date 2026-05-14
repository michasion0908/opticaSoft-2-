import Swal from 'sweetalert2';
import {
    getPaqueteDetalles,
    createPaqueteDetalle,
    updatePaqueteDetalle,
    deletePaqueteDetalle
} from '../../api/PaqueteDetalle.api.js';

// Obtener todos los detalles
export const getPaqueteDetallesJs = async (setPaqueteDetalles) => {
    try {
        const data = await getPaqueteDetalles();
        setPaqueteDetalles(data);
    } catch (error) {
        console.error('Error al obtener detalles del paquete:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los detalles del paquete.',
        });
    }
};

// Crear detalle de paquete
export const createPaqueteDetalleJs = async (
    idPaquete,
    idTipoLente,
    idMaterial,
    idTratamiento,
    setShowModal,
    getPaqueteDetallesJs
) => {
    try {
        await createPaqueteDetalle(idPaquete, idTipoLente, idMaterial, idTratamiento);
        getPaqueteDetallesJs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Detalle de paquete creado correctamente.',
        });
        setShowModal(false);
    } catch (error) {
        console.error('Error al crear detalle:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo registrar el detalle del paquete.',
        });
    }
};

// Actualizar detalle de paquete
export const updatePaqueteDetalleJs = async (
    idPaqueteDetalle,
    idPaquete,
    idTipoLente,
    idMaterial,
    idTratamiento,
    setShowEditModal,
    getPaqueteDetallesJs
) => {
    try {
        await updatePaqueteDetalle(idPaqueteDetalle, idPaquete, idTipoLente, idMaterial, idTratamiento);
        getPaqueteDetallesJs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Detalle actualizado correctamente.',
        });
        setShowEditModal(false);
    } catch (error) {
        console.error('Error al actualizar detalle:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar el detalle del paquete.',
        });
    }
};

// Eliminar detalle de paquete
export const deletePaqueteDetalleJs = async (idPaqueteDetalle, getPaqueteDetallesJs, setShowDeleteModal) => {
    try {
        await deletePaqueteDetalle(idPaqueteDetalle);
        getPaqueteDetallesJs();
        setShowDeleteModal(false);
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Detalle de paquete eliminado correctamente.',
        });
    } catch (error) {
        console.error('Error al eliminar detalle:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el detalle del paquete.',
        });
    }
};
