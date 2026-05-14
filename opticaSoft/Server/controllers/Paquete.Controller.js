import { db } from "../db/connection.js";

// Obtener todos los paquetes
export const getPaquetes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Paquete");
    if (rows.length > 0) {
      res.json({ message: "Paquetes obtenidos correctamente", data: rows });
    } else {
      res.status(404).json({ message: "No se encontraron paquetes" });
    }
  } catch (error) {
    res.status(500).json({ message: "Algo salió mal", error });
  }
};

// Crear un nuevo paquete
export const createPaquete = async (req, res) => {
  const { nombre, descripcion, total, vigencia, estado } = req.body;

  if (!nombre || total == null) {
    return res.status(400).json({
      message: "El nombre y el total son requeridos"
    });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO Paquete (nombre, descripcion, total, vigencia, estado) VALUES (?, ?, ?, ?, ?)",
      [nombre, descripcion || null, total, vigencia || null, estado || 'ACTIVO']
    );

    res.status(201).json({
      message: `Paquete '${nombre}' creado`,
      idPaquete: result.insertId,
      nombre,
      descripcion,
      total,
      vigencia,
      estado: estado || 'ACTIVO'
    });

  } catch (error) {
    console.error("Error al crear paquete:", error);
    res.status(500).json({
      message: "Algo salió mal",
      error: error.message
    });
  }
};

// Actualizar paquete
export const updatePaquete = async (req, res) => {
  try {
    const { idPaquete } = req.params;
    const { nombre, descripcion, total, vigencia, estado } = req.body;

    if (!nombre || total == null) {
      return res.status(400).json({
        message: "Los campos nombre y total son requeridos"
      });
    }

    const [result] = await db.query(
      `UPDATE Paquete 
       SET nombre = ?, descripcion = ?, total = ?, vigencia = ?, estado = ? 
       WHERE idPaquete = ?`,
      [nombre, descripcion || null, total, vigencia || null, estado || 'ACTIVO', idPaquete]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "Paquete actualizado correctamente" });
    } else {
      res.status(404).json({ message: "Paquete no encontrado" });
    }

  } catch (error) {
    console.error("Error al actualizar paquete:", error);
    res.status(500).json({
      message: "Algo salió mal",
      error: error.message
    });
  }
};

// Eliminar paquete
export const deletePaquete = async (req, res) => {
  try {
    const { idPaquete } = req.params;

    const [result] = await db.query(
      "DELETE FROM Paquete WHERE idPaquete = ?",
      [idPaquete]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "Paquete eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Paquete no encontrado" });
    }

  } catch (error) {
    console.error("Error al eliminar paquete:", error);
    res.status(500).json({
      message: "Algo salió mal",
      error: error.message
    });
  }
};
