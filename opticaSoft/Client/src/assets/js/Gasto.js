import axios from "axios";
const API = import.meta.env.VITE_API_BASE_URL;

export const getGastosjs = async (setGastos) => {
  try {
    const res = await axios.get(`${API}/Gasto`);
    setGastos(res.data);
  } catch (error) {
    console.error("Error al obtener gastos:", error);
  }
};

export const createGastojs = async (categoria, descripcion, monto, fecha, metodoPago, setShowModal, refresh) => {
  try {
    await axios.post(`${API}/Gasto/create`, { categoria, descripcion, monto, fecha, metodoPago });
    setShowModal(false);
    refresh();
  } catch (error) {
    console.error("Error al registrar gasto:", error);
  }
};

export const updateGastojs = async (idGasto, categoria, descripcion, monto, fecha, metodoPago, setShowEditModal, refresh) => {
  try {
    await axios.put(`${API}/Gasto/update/${idGasto}`, { categoria, descripcion, monto, fecha, metodoPago });
    setShowEditModal(false);
    refresh();
  } catch (error) {
    console.error("Error al actualizar gasto:", error);
  }
};

export const deleteGastojs = async (idGasto, setShowDeleteModal, refresh) => {
  try {
    await axios.delete(`${API}/Gasto/delete/${idGasto}`);
    setShowDeleteModal(false);
    refresh();
  } catch (error) {
    console.error("Error al eliminar gasto:", error);
  }
};

export const getResumenMensualjs = async (mes, anio, setResumen) => {
  try {
    const res = await axios.get(`${API}/Gasto/resumen/${mes}/${anio}`);
    setResumen(res.data);
  } catch (error) {
    console.error("Error al obtener resumen:", error);
  }
};