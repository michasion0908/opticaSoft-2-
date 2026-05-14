import { db } from "../db/connection.js";

// Obtener todos los historiales clínicos
export const getHistorialClinico = async (req, res) => {
  try {
    const query = `
      SELECT 
        hc.*, 
        CONCAT(p.nombre, ' ', p.apellido) AS nombrePaciente, 
        p.edad, 
        p.sexo,
        p.ocupacion,
        p.telefono,
        CONCAT(p.direccion, ' ', p.localidad, ' ', p.estado) AS direccion
      FROM HistorialClinico hc
      JOIN Paciente p ON hc.idPaciente = p.idPaciente
    `;
    
    const [rows] = await db.query(query);

    if (rows.length > 0) {
      res.json({ message: "Historiales clínicos obtenidos correctamente", data: rows });
    } else {
      res.status(404).json({ message: "No se encontraron historiales clínicos" });
    }
  } catch (error) {
    console.error("Error al obtener historiales clínicos:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Crear un nuevo historial clínico
export const createHistorialClinico = async (req, res) => {
  try {
    const {
      idPaciente,
      antecedentes_salud,
      antecedentes_familiares,
      medicamentos,
      dosis,
      cirugias
    } = req.body;

    if (!idPaciente) {
      return res.status(400).json({ message: "Los campos obligatorios son: idPaciente" });
    }

    const [result] = await db.query(
      `INSERT INTO HistorialClinico (
        idPaciente, antecedentes_salud, antecedentes_familiares, medicamentos, dosis, cirugias
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        idPaciente, antecedentes_salud, antecedentes_familiares, medicamentos, dosis, cirugias
      ]
    );

    res.status(201).json({
      message: "Historial clínico creado correctamente",
      idHistorialClinico: result.insertId
    });
  } catch (error) {
    console.error("Error al crear historial clínico:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Actualizar un historial clínico existente
export const updateHistorialClinico = async (req, res) => {
  try {
    const { idHistorialClinico } = req.params;
    const {
      idPaciente,
      antecedentes_salud,
      antecedentes_familiares,
      medicamentos,
      dosis,
      cirugias
    } = req.body;

    const [exists] = await db.query("SELECT 1 FROM HistorialClinico WHERE idHistorialClinico = ?", [idHistorialClinico]);

    if (!exists.length) {
      return res.status(404).json({ message: "El historial clínico no existe" });
    }

    const [result] = await db.query(
      `UPDATE HistorialClinico SET
        idPaciente = ?, antecedentes_salud = ?, antecedentes_familiares = ?, medicamentos = ?, dosis = ?, cirugias = ?
      WHERE idHistorialClinico = ?`,
      [
        idPaciente, antecedentes_salud, antecedentes_familiares, medicamentos, dosis, cirugias,
        idHistorialClinico
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No se pudo actualizar el historial clínico" });
    }

    res.status(200).json({
      message: "Historial clínico actualizado correctamente",
      idHistorialClinico
    });
  } catch (error) {
    console.error("Error al actualizar historial clínico:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Eliminar un historial clínico
export const deleteHistorialClinico = async (req, res) => {
  try {
    const { idHistorialClinico } = req.params;

    const [historial] = await db.query("SELECT 1 FROM HistorialClinico WHERE idHistorialClinico = ?", [idHistorialClinico]);

    if (!historial.length) {
      return res.status(404).json({ message: "Historial clínico no encontrado" });
    }

    const [result] = await db.query("DELETE FROM HistorialClinico WHERE idHistorialClinico = ?", [idHistorialClinico]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Historial clínico eliminado correctamente" });
    } else {
      res.status(400).json({ message: "No se pudo eliminar el historial clínico" });
    }
  } catch (error) {
    console.error("Error al eliminar historial clínico:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

  



  