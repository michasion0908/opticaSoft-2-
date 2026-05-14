import Swal from 'sweetalert2';
import {
    getPaquetes,
    createPaquete,
    updatePaquete,
    deletePaquete
} from '../../api/Paquete.api.js';

// Obtener todos los paquetes
export const getPaquetesJs = async (setPaquetes) => {
    try {
        const data = await getPaquetes();
        setPaquetes(data);
    } catch (error) {
        console.error('Error al obtener los paquetes:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al obtener los paquetes.',
        });
    }
};

// Crear un nuevo paquete
export const createPaqueteJs = async (
    nombre,
    descripcion,
    total,
    vigencia,
    estado,
    setShowModal,
    getPaquetesJs
) => {
    try {
        await createPaquete(nombre, descripcion, total, vigencia, estado);
        getPaquetesJs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El paquete se registró correctamente.',
        });
        setShowModal(false);
    } catch (error) {
        console.error('Error al registrar el paquete:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al registrar el paquete.',
        });
    }
};

// Actualizar un paquete
export const updatePaqueteJs = async (
    idPaquete,
    nombre,
    descripcion,
    total,
    vigencia,
    estado,
    setShowEditModal,
    getPaquetesJs
) => {
    try {
        await updatePaquete(idPaquete, nombre, descripcion, total, vigencia, estado);
        getPaquetesJs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El paquete se actualizó correctamente.',
        });
        setShowEditModal(false);
    } catch (error) {
        console.error('Error al actualizar el paquete:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar el paquete.',
        });
    }
};

// Eliminar paquete
export const deletePaqueteJs = async (idPaquete, getPaquetesJs, setShowDeleteModal) => {
    try {
        await deletePaquete(idPaquete);
        getPaquetesJs();
        setShowDeleteModal(false);
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El paquete se eliminó correctamente.',
        });
    } catch (error) {
        console.error('Error al eliminar el paquete:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar el paquete.',
        });
    }
};
