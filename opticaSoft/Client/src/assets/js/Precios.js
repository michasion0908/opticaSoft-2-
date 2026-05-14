import Swal from 'sweetalert2'; 

import {getPrecios, createPrecios, updatePrecios, deletePrecios}
from "../../api/Precios.api.js";

export const getPreciosjs = async (setPreciosjs) => {
    try {
      const data = await getPrecios();
      setPreciosjs(data);
    } catch (error) {
      console.error('Error al obtener el precio:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema obteniendo el precio.',
      });
    }
  };


export const createPreciosjs = async (idTipoLente, idMaterial, idTratamiento, serie, esfera, cilindro, combinada, precio, total, setShowModal, getPreciosjs) => {
    
 console.log("Llegando", {idTipoLente, idMaterial, idTratamiento, serie, esfera, cilindro, combinada, precio, total});

      try {
        await createPrecios( 
            idTipoLente, idMaterial, idTratamiento, serie, esfera, cilindro, combinada, precio, total);
        getPreciosjs();
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Precios registrado correctamente',
        });
        setShowModal(false);
      } catch (error) {
        console.error('Error al agregar el Precios:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema registrando el precios.',
        });
      }
    };


 export const updatePreciosjs = async (idPrecio, idTipoLente, idMaterial, idTratamiento, serie, esfera, cilindro, combinada, precio, total, setShowModal, getPreciosjs) => {
                
 console.log("LlegandoUP", { idTipoLente, idMaterial, idTratamiento, serie, esfera, cilindro, combinada, precio, total});
      try {
        await updatePrecios(idPrecio, idTipoLente, idMaterial, idTratamiento, serie, esfera, cilindro, combinada, precio, total);
        getPreciosjs();
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Precio actualizado correctamente',
        });
        setShowModal(false);
      } catch (error) {
        console.error('Error al actualizar el Precio:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema actualizando el Precio.',
        });
      }
    };

    
    export const deletePreciosjs = async (idPrecio, setShowDeleteModal, getPreciosjs) => {
        try {
            await deletePrecios(idPrecio);
            getPreciosjs();
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Precio eliminado correctamente',
            });
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error al eliminar el Precio:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema eliminando el precio.',
            });
        }
    };