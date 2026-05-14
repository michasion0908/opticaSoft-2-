import Swal from 'sweetalert2'; 
import { createLentesContacto, deleteLentesContacto, getLentesContacto, updateLentesContacto } 
from "../../api/LentesContacto.api.js"; 

export const getLentesContactojs = async (setLentesContactojs) => {
    try {
        const data = await getLentesContacto();
        setLentesContactojs(data);
    } catch (error) {
        console.error('Error al obtener los lentes de contacto :', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al obtener los lentes de contacto.',
        });
    }
};

export const createLentesContactojs = async (marca, modelo, duracion, esfera, precio, setShowModal, getLentesContactojs) => {
    console.log("Llegando", {marca, modelo, duracion, esfera, precio });
    try {
        await createLentesContacto(marca, modelo, duracion, esfera, precio);
        getLentesContactojs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El lente de contacto se registró correctamente.',
        });
        setShowModal(false);
    } catch (error) {
        console.error('Error al registrar el lente de contacto:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al registrar el lente de contacto.',
        });
    }
};

export const updateLentesContactojs = async (idLentesContacto, marca, modelo, duracion, esfera, precio, setShowEditModal, getLentesContactojs) => {
    console.log("Llegando update", { marca, modelo, duracion, esfera, precio });
    try {
        await updateLentesContacto(idLentesContacto, marca, modelo, duracion, esfera, precio);
        getLentesContactojs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El lente de contacto se actualizó correctamente.',
        });
        setShowEditModal(false);
    } catch (error) {
        console.error('Error al actualizar el lente de contacto:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar el lente de contacto.',
        });
    }
};

export const deleteLentesContactojs = async (idLentesContacto, getLentesContactojs, setShowDeleteModal) => {
    try {
        await deleteLentesContacto(idLentesContacto);
        getLentesContactojs();
        setShowDeleteModal(false);
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El lente de contacto se eliminó correctamente.',
        });
    } catch (error) {
        console.error('Error al eliminar el lente de contacto:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar el lente de contacto.',
        });
    }
};
