import Swal from 'sweetalert2'; 
import { getCitas, createCita, updateCita, deleteCita } 
from "../../api/Cita.api.js";

// Obtener todas las citas
export const getCitasJs = async (setCitas) => {
    try {
        const data = await getCitas();
        setCitas(data);
    } catch (error) {
        console.error('Error al obtener las citas:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al obtener las citas.',
        });
    }
};

// Crear una nueva cita
export const createCitaJs = async (idPaciente, idOptometrista, fechaHora, duracionEstimada, estado, motivo, observaciones, setShowModal, getCitasJs) => {
    console.log("Datos de la cita:", idPaciente, idOptometrista, fechaHora, duracionEstimada, estado, motivo, observaciones);
    try {
        await createCita(idPaciente, idOptometrista, fechaHora, duracionEstimada, estado, motivo, observaciones);
        getCitasJs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'La cita se registró correctamente.',
        });
        setShowModal(false);
    } catch (error) {
        console.error('Error al registrar la cita:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al registrar la cita.',
        });
    }
};

// Actualizar una cita existente
export const updateCitaJs = async (idCita, idPaciente, idOptometrista, fechaHora, duracionEstimada, estado, motivo, observaciones, setShowEditModal, getCitasJs) => {
    console.log("Actualizando cita:", { idCita, idPaciente, idOptometrista, fechaHora, duracionEstimada, estado, motivo, observaciones });
    try {
        await updateCita(idCita, idPaciente, idOptometrista, fechaHora, duracionEstimada, estado, motivo, observaciones);
        getCitasJs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'La cita se actualizó correctamente.',
        });
        setShowEditModal(false);
    } catch (error) {
        console.error('Error al actualizar la cita:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar la cita.',
        });
    }
};

// Eliminar una cita
export const deleteCitaJs = async (idCita, getCitasJs, setShowDeleteModal) => {
    try {
        await deleteCita(idCita);
        getCitasJs();
        setShowDeleteModal(false);
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'La cita se eliminó correctamente.',
        });
    } catch (error) {
        console.error('Error al eliminar la cita:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar la cita.',
        });
    }
};