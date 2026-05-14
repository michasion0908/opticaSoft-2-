import Swal from 'sweetalert2'; 
import { getMaterial, createMaterial, updateMaterial, deleteMaterial } 
from "../../api/Material.api.js";

export const getMaterialjs = async (setMaterialjs) => {
    try {
        const data = await getMaterial();
        setMaterialjs(data);
    } catch (error) {
        console.error('Error al obtener los materiales:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al obtener los materiales.',
        });
    }
};

export const createMaterialjs = async (nombre, precio, setShowModal, getMaterialjs) => {
    console.log("Llegando", { nombre, precio });
    try {
        await createMaterial(nombre, precio);
        getMaterialjs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El material se registró correctamente.',
        });
        setShowModal(false);
    } catch (error) {
        console.error('Error al registrar el material:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al registrar el material.',
        });
    }
};

export const updateMaterialjs = async (idMaterial, nombre, precio, setShowEditModal, getMaterialjs) => {
    console.log("Llegando update", { nombre, precio });
    try {
        await updateMaterial(idMaterial, nombre, precio);
        getMaterialjs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El material se actualizó correctamente.',
        });
        setShowEditModal(false);
    } catch (error) {
        console.error('Error al actualizar el material:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar el material.',
        });
    }
};

export const deleteMaterialjs = async (idMaterial, getMaterialjs, setShowDeleteModal) => {
    try {
        await deleteMaterial(idMaterial);
        getMaterialjs();
        setShowDeleteModal(false);
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El material se eliminó correctamente.',
        });
    } catch (error) {
        console.error('Error al eliminar el material:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar el material.',
        });
    }
};
