import Swal from 'sweetalert2';
import { getRecetas, createReceta, updateReceta, deleteReceta } 
from "../../api/Receta.api.js";

export const getRecetasjs = async (setRecetasjs) => {
    try {
        const data = await getRecetas();
        setRecetasjs(data);
    } catch (error) {
        console.error('Error al obtener las recetas:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al obtener las recetas.',
        });
    }
};

export const createRecetasjs = async (idExamenVista, diagnostico, observaciones, vigencia, setShowModal, getRecetasjs) => {
    console.log("Llegando", { idExamenVista, diagnostico, observaciones, vigencia });
    try {
        await createReceta(idExamenVista, diagnostico, observaciones, vigencia);
        getRecetasjs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'La receta se registró correctamente.',
        });
        setShowModal(false);
    } catch (error) {
        console.error('Error al registrar la receta:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al registrar la receta.',
        });
    }
};

export const updateRecetasjs = async (idReceta, idExamenVista, diagnostico, observaciones, vigencia, setShowEditModal, getRecetasjs) => {
    console.log("Llegando update", {idExamenVista, diagnostico, observaciones, vigencia });
    try {
        await updateReceta(idReceta, idExamenVista, diagnostico, observaciones, vigencia);
        getRecetasjs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'La receta se actualizó correctamente.',
        });
        setShowEditModal(false);
    } catch (error) {
        console.error('Error al actualizar la receta:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar la receta.',
        });
    }
};

export const deleteRecetasjs = async (idReceta, getRecetasjs, setShowDeleteModal) => {
    try {
        await deleteReceta(idReceta);
        getRecetasjs();
        setShowDeleteModal(false);
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'La receta se eliminó correctamente.',
        });
    } catch (error) {
        console.error('Error al eliminar la receta:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar la receta.',
        });
    }
};