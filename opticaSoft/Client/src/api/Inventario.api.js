import axios from 'axios';
import { BASE_URL } from './config.js'; 


//const BASE_URL = "http://localhost:3000";
//const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getInventario = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Inventario`);
      return response.data.data;
    } catch (error) {
      console.error("Error al obtener los inventarios:", error.response?.data || error.message);
      throw new Error('Error al obtener los inventarios');
    }
  };

  export const createInventario = async (marca, modelo, color, numeroColor, material, cantidad, exhibicion, precio, fecha, estatus, precioVenta) => {
    try {
      await axios.post(`${BASE_URL}/Inventario/create`, {marca, modelo, color, numeroColor, material, cantidad, exhibicion, precio, fecha, estatus, precioVenta });
    } catch (error) {
      console.error("Error al registrar el producto:", error.response?.data || error.message);
      throw new Error('Error al registrar el producto');
    }
  };

  export const updateInventario = async (idInventario, marca, modelo, color, numeroColor, material, cantidad, exhibicion, precio, fecha, estatus, precioVenta ) => {
    try {
      await axios.put(`${BASE_URL}/Inventario/update/${idInventario}`, { marca, modelo, color, numeroColor, material, cantidad, exhibicion, precio, fecha, estatus, precioVenta  });
    } catch (error) {
      console.error("Error al actualizar el producto:", error.response?.data || error.message);
      throw new Error('Error al actualizar el producto');
    }
  };

  export const deleteInventario = async (idInventario) => {
    try {
      await axios.delete(`${BASE_URL}/Inventario/delete/${idInventario}`);
    } catch (error) {
      console.error("Error al eliminar el producto:", error.response?.data || error.message);
      throw new Error('Error al eliminar el producto');
    }
  };