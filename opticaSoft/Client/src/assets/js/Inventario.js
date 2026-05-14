import Swal from 'sweetalert2'; 

import {getInventario, createInventario, updateInventario, deleteInventario} 
from "../../api/Inventario.api.js";

export const getInventariojs = async (setInventariojs) => {
  try {
    const data = await getInventario();
    setInventariojs(data);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema obteniendo los productos.',
    });
  }
};

export const createInventariojs = async (marca, modelo, color, numeroColor, material, cantidad, exhibicion, precio, fecha, estatus, precioVenta , setShowModal, getInventariojs) => {
console.log("Llegando", {marca, modelo, color, numeroColor, material, cantidad, exhibicion, precio, fecha, estatus, precioVenta });
  try {
    await createInventario(marca, modelo, color, numeroColor, material, cantidad, exhibicion, precio, fecha, estatus, precioVenta );
    getInventariojs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Producto registrado correctamente',
    });
    setShowModal(false);
  } catch (error) {
    console.error('Error al agregar el producto:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema registrando el producto.',
    });
  }
};


export const updateInventariojs = async (idInventario, marca, modelo, color, numeroColor, material, cantidad, exhibicion, precio, fecha, estatus, precioVenta, setShowEditModal, getInventariojs) => {
  try {
    await updateInventario(idInventario, marca, modelo, color, numeroColor, material, cantidad, exhibicion, precio, fecha, estatus, precioVenta);
    getInventariojs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Producto actualizado correctamente',
    });
    setShowEditModal(false);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema actualizando el producto.',
    });
  }
};

export const deleteInventariojs = async (idInventario, setShowDeleteModal, getInventariojs) => {
  try {
    await deleteInventario(idInventario);
    getInventariojs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Producto eliminado correctamente',
    });
    setShowDeleteModal(false);
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema eliminando el producto.',
    });
  }
};