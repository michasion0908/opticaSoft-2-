import { db } from "../db/connection.js";

export const getRecetas = async (req, res) => {
  try {
    const query = `
      SELECT 
        r.*, 
        ev.defRefractivo AS defRefractivo, 
        CONCAT(p.nombre, ' ', p.apellido) AS nombrePaciente
      FROM Receta r
      JOIN ExamenVista ev ON r.idExamenVista = ev.idExamenVista
      JOIN Paciente p ON ev.idPaciente = p.idPaciente
      ORDER BY r.fechaRegistro DESC
    `;

    const [rows] = await db.query(query);

    if (rows.length > 0) {
      res.json({ message: "Recetas obtenidas correctamente", data: rows });
    } else {
      res.status(404).json({ message: "No se encontraron recetas" });
    }
  } catch (error) {
    console.error("Error al obtener recetas:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};


export const createReceta = async (req, res) => {
    try {
      const { idExamenVista, diagnostico, observaciones, vigencia } = req.body;
  
      if (!idExamenVista) {
        return res.status(400).json({ message: "El campo obligatorio es: idExamenVista" });
      }
  
      const [result] = await db.query(
        `INSERT INTO Receta (idExamenVista, diagnostico, observaciones, vigencia) VALUES (?, ?, ?, ?)`,
        [idExamenVista, diagnostico, observaciones, vigencia]
      );
  
      res.status(201).json({
        message: "Receta creada correctamente",
        idReceta: result.insertId
      });
    } catch (error) {
      console.error("Error al crear receta:", error);
      res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
  };

  export const updateReceta = async (req, res) => {
    try {
      const { idReceta } = req.params;
      const { idExamenVista, diagnostico, observaciones, vigencia } = req.body;
  
      const [exists] = await db.query("SELECT 1 FROM Receta WHERE idReceta = ?", [idReceta]);
  
      if (!exists.length) {
        return res.status(404).json({ message: "La receta no existe" });
      }
  
      const [result] = await db.query(
        `UPDATE Receta SET 
          idExamenVista = ?, diagnostico = ?, observaciones = ?, vigencia = ?
        WHERE idReceta = ?`,
        [idExamenVista, diagnostico, observaciones, vigencia, idReceta]
      );
  
      if (result.affectedRows === 0) {
        return res.status(400).json({ message: "No se pudo actualizar la receta" });
      }
  
      res.status(200).json({
        message: "Receta actualizada correctamente",
        idReceta
      });
    } catch (error) {
      console.error("Error al actualizar receta:", error);
      res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
  };

  export const deleteReceta = async (req, res) => {
    try {
      const { idReceta } = req.params;
  
      const [receta] = await db.query("SELECT 1 FROM Receta WHERE idReceta = ?", [idReceta]);
  
      if (!receta.length) {
        return res.status(404).json({ message: "Receta no encontrada" });
      }
  
      const [result] = await db.query("DELETE FROM Receta WHERE idReceta = ?", [idReceta]);
  
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "Receta eliminada correctamente" });
      } else {
        res.status(400).json({ message: "No se pudo eliminar la receta" });
      }
    } catch (error) {
      console.error("Error al eliminar receta:", error);
      res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
  };
  