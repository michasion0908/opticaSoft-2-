import axios from 'axios';

//const BASE_URL = "http://localhost:3000";
import { BASE_URL } from './config.js'; 


   export const getOptometrista = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/Optometrista`);
        return response.data.data;
      } catch (error) {
        console.error("Error al obtener los Optometrista:", error.response?.data || error.message);
        throw new Error('Error al obtener los Optometrista');
      }
    };

    export const createOptometrista = async (nombre, noCedula) => {
        try {
        await axios.post(`${BASE_URL}/Optometrista/create`, {nombre, noCedula});
        } catch (error) {
        console.error("Error al registrar el Optometrista:", error.response?.data || error.message);
        throw new Error('Error al registrar el Optometrista');
        }
    };

    export const updateOptometrista = async (idOptometrista, nombre, noCedula) => {
        console.log("Llegando update api", {nombre, noCedula});  
        try {
          await axios.put(`${BASE_URL}/Optometrista/update/${idOptometrista}`, {nombre, noCedula});
          } catch (error) {
          console.error("Error al actualizar el Optometrista:", error.response?.data || error.message);
          throw new Error('Error al actualizar el Optometrista');
          }
      };

    export const deleteOptometrista  = async (idOptometrista) => {
        try {
        await axios.delete(`${BASE_URL}/Optometrista/delete/${idOptometrista}`);
        } catch (error) {
        console.error("Error al eliminar el Optometrista:", error.response?.data || error.message);
        throw new Error('Error al eliminar el Optometrista');
        }
    };