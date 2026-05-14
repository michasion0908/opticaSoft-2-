import Swal from 'sweetalert2'; 
import { getTratamientos, createTratamientos, updateTratamientos, deleteTratamientos } 
from "../../api/Tratamientos.api.js";

export const getTratamientosjs = async (setTratamientosjs) => {
    try {
        const data = await getTratamientos();
        setTratamientosjs(data);
    } catch (error) {
        console.error('Error al obtener los tratamientos:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al obtener los tratamientos.',
        });
    }
};

export const createTratamientosjs = async (nombre, precio, setShowModal, getTratamientosjs) => {
    console.log("Llegando", { nombre, precio });
    try {
        await createTratamientos(nombre, precio);
        getTratamientosjs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El tratamiento se registró correctamente.',
        });
        setShowModal(false);
    } catch (error) {
        console.error('Error al registrar el tratamiento:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al registrar el tratamiento.',
        });
    }
};

export const updateTratamientosjs = async (idTratamiento, nombre, precio, setShowEditModal, getTratamientosjs) => {
    console.log("Llegando update", { nombre, precio });
    try {
        await updateTratamientos(idTratamiento, nombre, precio);
        getTratamientosjs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El tratamiento se actualizó correctamente.',
        });
        setShowEditModal(false);
    } catch (error) {
        console.error('Error al actualizar el tratamiento:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar el tratamiento.',
        });
    }
};

export const deleteTratamientosjs = async (idTratamiento, getTratamientosjs, setShowDeleteModal) => {
    try {
        await deleteTratamientos(idTratamiento);
        getTratamientosjs(); // ← esto actualiza la lista
        setShowDeleteModal(false); // ← esto cierra el modal
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El tratamiento se eliminó correctamente.',
        });
    } catch (error) {
        console.error('Error al eliminar el tratamiento:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar el tratamiento.',
        });
    }
};
