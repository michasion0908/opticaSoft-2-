import Swal from 'sweetalert2'; 
import { getTipoLente, createTipoLente, updateTipoLente, deleteTipoLente } 
from "../../api/TipoLente.api.js";

export const getTipoLentejs = async (setTipoLentejs) => {
    try {
        const data = await getTipoLente();
        setTipoLentejs(data);
    } catch (error) {
        console.error('Error al obtener los tipos de lente:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al obtener los tipos de lente.',
        });
    }
};

export const createTipoLentejs = async (nombre, precio, setShowModal, getTipoLentejs) => {
    console.log("Llegando", { nombre, precio });
    try {
        await createTipoLente(nombre, precio);
        getTipoLentejs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El tipo de lente se registró correctamente.',
        });
        setShowModal(false);
    } catch (error) {
        console.error('Error al registrar el tipo de lente:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al registrar el tipo de lente.',
        });
    }
};

export const updateTipoLentejs = async (idTipoLente, nombre, precio, setShowEditModal, getTipoLentejs) => {
    console.log("Llegando update", { nombre, precio });
    try {
        await updateTipoLente(idTipoLente, nombre, precio);
        getTipoLentejs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El tipo de lente se actualizó correctamente.',
        });
        setShowEditModal(false);
    } catch (error) {
        console.error('Error al actualizar el tipo de lente:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar el tipo de lente.',
        });
    }
};

export const deleteTipoLentejs = async (idTipoLente, getTipoLentejs, setShowDeleteModal) => {
    try {
        await deleteTipoLente(idTipoLente);
        getTipoLentejs();
        setShowDeleteModal(false);
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El tipo de lente se eliminó correctamente.',
        });
    } catch (error) {
        console.error('Error al eliminar el tipo de lente:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar el tipo de lente.',
        });
    }
};
