import { db } from "../db/connection.js";

export const getOptometrista = async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM Optometrista");
      if (rows.length > 0) {
        res.json({ message: "Optometrista obtenidos correctamente", data: rows });
      } else {
        res.status(404).json({ message: "No se encontraron Optometrista" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Algo salió mal", error });
    }
  };


  export const createOptometrista = async (req, res) => {
    const { nombre, noCedula } = req.body;
  
    if (!nombre || !noCedula) {
      return res.status(400).json({
        message: "El nombre y el número de cédula son requeridos"
      });
    }
  
    try {
      const [result] = await db.query(
        "INSERT INTO Optometrista (nombre, noCedula) VALUES (?, ?)",
        [nombre, noCedula]
      );
  
      res.status(201).json({
        message: `Optometrista '${nombre} ${noCedula}' creado`,
        idOptometrista: result.insertId, // ✅ Aquí corregido
        nombre,
        noCedula
      });
  
    } catch (error) {
      console.error("Error al crear Optometrista:", error);
      res.status(500).json({
        message: "Algo salió mal",
        error: error.message
      });
    }
  };
  
// Actualizar Optometrista
export const updateOptometrista = async (req, res) => {
  try {
    const { idOptometrista } = req.params;
    const { nombre, noCedula } = req.body;

    if (!nombre || !noCedula) {
      return res.status(400).json({
        message: "Todos los campos son requeridos: nombre y noCedula"
      });
    }

    const [result] = await db.query(
      "UPDATE Optometrista SET nombre = ?, noCedula = ? WHERE idOptometrista = ?",
      [nombre, noCedula, idOptometrista]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "Optometrista actualizado correctamente" });
    } else {
      res.status(404).json({ message: "Optometrista no encontrado" });
    }

  } catch (error) {
    console.error("Error al actualizar Optometrista:", error);
    res.status(500).json({
      message: "Algo salió mal",
      error: error.message
    });
  }
};

// Eliminar Optometrista
export const deleteOptometrista = async (req, res) => {
  try {
    const { idOptometrista } = req.params;

    const [result] = await db.query(
      "DELETE FROM Optometrista WHERE idOptometrista = ?",
      [idOptometrista]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "Optometrista eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Optometrista no encontrado" });
    }

  } catch (error) {
    console.error("Error al eliminar Optometrista:", error);
    res.status(500).json({
      message: "Algo salió mal",
      error: error.message
    });
  }
};
