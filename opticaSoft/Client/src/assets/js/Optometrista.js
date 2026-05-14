import Swal from 'sweetalert2'; 

import {getOptometrista, createOptometrista, updateOptometrista, deleteOptometrista}
from "../../api/Optometrista.api.js";

export const getOptometristajs = async (setOptometristajs) => {
    try {
      const data = await getOptometrista();
      setOptometristajs(data);
    } catch (error) {
      console.error('Error al obtener los Optometrista:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema obteniendo los Optometrista.',
      });
    }
  };

  export const createOptometristajs = async (nombre, noCedula , setShowModal, getOptometristajs) => {
    console.log("Llegando", {nombre, noCedula});
      try {
        await createOptometrista(nombre, noCedula);
        getOptometristajs();
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Optometrista registrado correctamente',
        });
        setShowModal(false);
      } catch (error) {
        console.error('Error al agregar el Optometrista:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema registrando el Optometrista.',
        });
      }
    };

    export const updateOptometristajs = async (idOptometrista, nombre, noCedula, setShowModal, getOptometristajs) => {
      try {
        await updateOptometrista(idOptometrista, nombre, noCedula);
        getOptometristajs();
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Optometrista actualizado correctamente',
        });
        setShowModal(false);
      } catch (error) {
        console.error('Error al actualizar el Optometrista:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema actualizando el Optometrista.',
        });
      }
    };

    export const deleteOptometristajs = async (idOptometrista, setShowDeleteModal, getOptometristajs) => {
        try {
            await deleteOptometrista(idOptometrista);
            getOptometristajs();
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Optometrista eliminado correctamente',
            });
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error al eliminar el Optometrista:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema eliminando el Optometrista.',
            });
        }
    };