import { db } from "../db/connection.js";

// Obtener todos los detalles de paquetes
export const getPaqueteDetalles = async (req, res) => {
  try {
    const query = `
      SELECT 
        pd.idPaqueteDetalle,
        pd.idPaquete,
        pd.idTipoLente,
        pd.idMaterial,
        pd.idTratamiento,
        p.nombre AS Paquete,
        p.descripcion AS Descripcion,
        p.total AS Total,
        p.vigencia AS Vigencia,
        p.estado AS Estado,
        tl.nombre AS TipoLente,
        m.nombre AS Material,
        t.nombre AS Tratamiento
      FROM PaqueteDetalle pd
      JOIN Paquete p ON pd.idPaquete = p.idPaquete
      LEFT JOIN TipoLente tl ON pd.idTipoLente = tl.idTipoLente
      LEFT JOIN Material m ON pd.idMaterial = m.idMaterial
      LEFT JOIN Tratamientos t ON pd.idTratamiento = t.idTratamiento
    `;

    const [rows] = await db.query(query);

    if (rows.length > 0) {
      res.json({ message: "Detalles de paquetes obtenidos correctamente", data: rows });
    } else {
      res.status(404).json({ message: "No se encontraron detalles de paquetes" });
    }
  } catch (error) {
    console.error("Error al obtener detalles de paquetes:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Crear un nuevo detalle de paquete
export const createPaqueteDetalle = async (req, res) => {
  try {
    const { idPaquete, idTipoLente, idMaterial, idTratamiento } = req.body;

    if (!idPaquete) {
      return res.status(400).json({ 
        message: "El campo idPaquete es obligatorio" 
      });
    }

    const [result] = await db.query(
      `INSERT INTO PaqueteDetalle (idPaquete, idTipoLente, idMaterial, idTratamiento)
       VALUES (?, ?, ?, ?)`,
      [idPaquete, idTipoLente || null, idMaterial || null, idTratamiento || null]
    );

    res.status(201).json({
      message: "Detalle de paquete creado correctamente",
      idPaqueteDetalle: result.insertId
    });
  } catch (error) {
    console.error("Error al crear detalle de paquete:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Actualizar un detalle de paquete
export const updatePaqueteDetalle = async (req, res) => {
  try {
    const { idPaqueteDetalle } = req.params;
    const { idPaquete, idTipoLente, idMaterial, idTratamiento } = req.body;

    const [exists] = await db.query("SELECT 1 FROM PaqueteDetalle WHERE idPaqueteDetalle = ?", [idPaqueteDetalle]);
    if (!exists.length) {
      return res.status(404).json({ message: "Detalle de paquete no encontrado" });
    }

    const [result] = await db.query(
      `UPDATE PaqueteDetalle SET
        idPaquete = ?, idTipoLente = ?, idMaterial = ?, idTratamiento = ?
       WHERE idPaqueteDetalle = ?`,
      [idPaquete, idTipoLente || null, idMaterial || null, idTratamiento || null, idPaqueteDetalle]
    );

    res.status(200).json({
      message: "Detalle de paquete actualizado correctamente",
      idPaqueteDetalle
    });
  } catch (error) {
    console.error("Error al actualizar detalle de paquete:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Eliminar un detalle de paquete
export const deletePaqueteDetalle = async (req, res) => {
  try {
    const { idPaqueteDetalle } = req.params;

    const [exists] = await db.query("SELECT 1 FROM PaqueteDetalle WHERE idPaqueteDetalle = ?", [idPaqueteDetalle]);

    if (!exists.length) {
      return res.status(404).json({ message: "Detalle de paquete no encontrado" });
    }

    const [result] = await db.query(
      "DELETE FROM PaqueteDetalle WHERE idPaqueteDetalle = ?",
      [idPaqueteDetalle]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "Detalle de paquete eliminado correctamente" });
    } else {
      res.status(400).json({ message: "No se pudo eliminar el detalle de paquete" });
    }

  } catch (error) {
    console.error("Error al eliminar detalle de paquete:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};
