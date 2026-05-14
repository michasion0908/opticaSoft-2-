import Swal from 'sweetalert2'; 

import {getExamenesVista, createExamenVista, updateExamenVista, deleteExamenVista}
from "../../api/ExamenVista.api.js";

export const getExamenesVistajs = async (setExamenesVista) => {
    try {
      const data = await getExamenesVista();
      setExamenesVista(data);
    } catch (error) {
      console.error('Error al obtener los exámenes:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema obteniendo los exámenes de vista.',
      });
    }
  };


// Crear nuevo examen de vista
    export const createExamenVistajs = async (
        idPaciente,
        idOptometrista,
        NoExamen,
        rx_esfera_od,
        rx_cilindro_od,
        rx_eje_od,
        rx_esfera_oi,
        rx_cilindro_oi,
        rx_eje_oi,
        add_lente,
        ao,
        dnp,
        defRefractivo,
        observaciones,
        setShowModal,
        getExamenesVistajs
    ) => {
        try {
        await createExamenVista(
            idPaciente,
            idOptometrista,
            NoExamen,
            rx_esfera_od,
            rx_cilindro_od,
            rx_eje_od,
            rx_esfera_oi,
            rx_cilindro_oi,
            rx_eje_oi,
            add_lente,
            ao,
            dnp,
            defRefractivo,
            observaciones
        );
        
        getExamenesVistajs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Examen de vista registrado correctamente',
        });
        setShowModal(false);
        } catch (error) {
        console.error('Error al registrar el examen:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema registrando el examen de vista.',
        });
        }
    };
    

// Actualizar examen de vista
    export const updateExamenVistajs = async (
        idExamenVista,
        idPaciente,
        idOptometrista,
        NoExamen,
        rx_esfera_od,
        rx_cilindro_od,
        rx_eje_od,
        rx_esfera_oi,
        rx_cilindro_oi,
        rx_eje_oi,
        add_lente,
        ao,
        dnp,
        defRefractivo,
        observaciones,
        setShowModal,
        getExamenesVistajs
    ) => {
        try {
        await updateExamenVista(
            idExamenVista,
            idPaciente,
            idOptometrista,
            NoExamen,
            rx_esfera_od,
            rx_cilindro_od,
            rx_eje_od,
            rx_esfera_oi,
            rx_cilindro_oi,
            rx_eje_oi,
            add_lente,
            ao,
            dnp,
            defRefractivo,
            observaciones
        );
        
        getExamenesVistajs();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Examen de vista actualizado correctamente',
        });
        setShowModal(false);
        } catch (error) {
        console.error('Error al actualizar el examen:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema actualizando el examen de vista.',
        });
        }
    };    

// Eliminar examen de vista
    export const deleteExamenVistajs = async (idExamenVista, setShowDeleteModal, getExamenesVistajs) => {
        try {
          await deleteExamenVista(idExamenVista);
          getExamenesVistajs();
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Examen de vista eliminado correctamente',
          });
          setShowDeleteModal(false);
        } catch (error) {
          console.error('Error al eliminar el examen:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema eliminando el examen de vista.',
          });
        }
      };
    