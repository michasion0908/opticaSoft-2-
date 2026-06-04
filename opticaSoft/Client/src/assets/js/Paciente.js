import Swal from 'sweetalert2'; 

import {getPaciente, createPaciente, updatePaciente, deletePaciente} 
from "../../api/Paciente.api.js";

const ordenarPacientesRecientesPrimero = (pacientes = []) => {
  return [...pacientes].sort((a, b) => {
    const fechaA = new Date(a.fechaRegistro).getTime();
    const fechaB = new Date(b.fechaRegistro).getTime();

    if (!Number.isNaN(fechaA) && !Number.isNaN(fechaB) && fechaA !== fechaB) {
      return fechaB - fechaA;
    }

    return (Number(b.idPaciente) || 0) - (Number(a.idPaciente) || 0);
  });
};

//Mostrar los pacientes con animación
export const getPacientejs = async (setPacientejs) => {
  try {
    const data = await getPaciente();
    setPacientejs(ordenarPacientesRecientesPrimero(data));
  } catch (error) {
    console.error('Error al obtener los Pacientes:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema obteniendo los Pacientes.',
    });
  }
};

//Crear un nuevo paciente
export const createPacientejs = async (nombre, apellido, edad, sexo, ocupacion, direccion, localidad, estado, telefono, observaciones, setShowModal, getPacientejs) => {
console.log("Llegando", {nombre, apellido, edad, sexo, ocupacion, direccion, localidad, estado, telefono, observaciones});
  try {
    await createPaciente(nombre, apellido, edad, sexo, ocupacion, direccion, localidad, estado, telefono, observaciones);
    getPacientejs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Paciente registrado correctamente',
    });
    setShowModal(false);
  } catch (error) {
    console.error('Error al agregar el paciente:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema registrando el paciente.',
    });
  }
};

//Actualizar un paciente 
export const updatePacientejs = async (idPaciente, nombre, apellido, edad, sexo, ocupacion, direccion, localidad, estado, telefono, observaciones, setShowEditModal, getPacientejs) => {
  try {
    await updatePaciente(idPaciente, nombre, apellido, edad, sexo, ocupacion, direccion, localidad, estado, telefono, observaciones);
    getPacientejs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Paciente actualizado correctamente',
    });
    setShowEditModal(false);
  } catch (error) {
    console.error('Error al actualizar el paciente:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema actualizando el paciente.',
    });
  }
};

//Eliminar un paciente
export const deletePacientejs = async (idPaciente, setShowDeleteModal, getPacientejs) => {
  try {
    await deletePaciente(idPaciente);
    getPacientejs();
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Paciente eliminado correctamente',
    });
    setShowDeleteModal(false);
  } catch (error) {
    console.error('Error al eliminar el paciente:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema eliminando el paciente.',
    });
  }
};
