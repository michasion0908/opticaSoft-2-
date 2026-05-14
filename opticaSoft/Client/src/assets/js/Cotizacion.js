import Swal from 'sweetalert2'; 
import { getCotizaciones, createCotizacion, updateCotizacion, deleteCotizacion } 
from "../../api/Cotización.api.js";

// Obtener todas las cotizaciones
export const getCotizacionesJs = async (setCotizaciones) => {
    try {
        const data = await getCotizaciones();
        setCotizaciones(data);
    } catch (error) {
        console.error('Error al obtener las cotizaciones:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al obtener las cotizaciones.',
        });
    }
};

// Crear una nueva cotización
export const createCotizacionJs = async (
    idPaciente,
    tipo,
    subtotal,
    descuento,
    iva,
    total,
    observaciones,
    setShowModal,
    getCotizacionesJs
) => {

    console.log('Datos recibidos en createCotizacionJs:', {idPaciente,tipo,subtotal,descuento,iva,total,observaciones});

    try {
        await createCotizacion(idPaciente, tipo, subtotal, descuento, iva, total, observaciones);
        getCotizacionesJs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'La cotización se registró correctamente.',
        });
        setShowModal(false);
    } catch (error) {
        console.error('Error al registrar la cotización:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al registrar la cotización.',
        });
    }
};

// Actualizar una cotización existente
export const updateCotizacionJs = async (
    idCotizacion,
    idPaciente,
    tipo,
    subtotal,
    descuento,
    iva,
    total,
    observaciones,
    setShowEditModal,
    getCotizacionesJs
) => {
    try {
        await updateCotizacion(idCotizacion, idPaciente, tipo, subtotal, descuento, iva, total, observaciones);
        getCotizacionesJs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'La cotización se actualizó correctamente.',
        });
        setShowEditModal(false);
    } catch (error) {
        console.error('Error al actualizar la cotización:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar la cotización.',
        });
    }
};

// Eliminar una cotización
export const deleteCotizacionJs = async (idCotizacion, getCotizacionesJs, setShowDeleteModal) => {
    try {
        await deleteCotizacion(idCotizacion);
        getCotizacionesJs();
        setShowDeleteModal(false);
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'La cotización se eliminó correctamente.',
        });
    } catch (error) {
        console.error('Error al eliminar la cotización:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar la cotización.',
        });
    }
};
