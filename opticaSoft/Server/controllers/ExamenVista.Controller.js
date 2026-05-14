import { db } from "../db/connection.js";

// Obtener todos los exámenes de vista
export const getExamenVista = async (req, res) => {
  try {
    const query = `
      SELECT 
        ev.*,
        CONCAT(p.nombre, ' ', p.apellido) AS nombrePaciente, 
        o.nombre AS nombreOptometrista,
        o.noCedula AS cedula
      FROM ExamenVista ev
      LEFT JOIN Paciente p ON ev.idPaciente = p.idPaciente
      JOIN Optometrista o ON ev.idOptometrista = o.idOptometrista
    `;

    const [rows] = await db.query(query);
    if (rows.length > 0) {
      res.json({ message: "Exámenes obtenidos correctamente", data: rows });
    } else {
      res.status(404).json({ message: "No se encontraron exámenes" });
    }
  } catch (error) {
    console.error("Error al obtener los exámenes:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Crear un nuevo examen de vista
export const createExamenVista = async (req, res) => {
  try {
    const {
      idPaciente,
      idOptometrista,
      NoExamen,
      rx_esfera_od,
      rx_cilindro_od,
      rx_eje_od,
      rx_esfera_oi,
      rx_cilindro_oi,
      rx_eje_oi,
      add_lente,
      ao,
      dnp,
      defRefractivo,
      observaciones
    } = req.body;

    // Validación de campos obligatorios
    if (!idOptometrista || !defRefractivo) {
      return res.status(400).json({ message: "idOptometrista y defRefractivo son campos obligatorios" });
    }

    const [result] = await db.query(
      `INSERT INTO ExamenVista (
        idPaciente, idOptometrista, NoExamen, rx_esfera_od, rx_cilindro_od, rx_eje_od,
        rx_esfera_oi, rx_cilindro_oi, rx_eje_oi, add_lente, ao, dnp, defRefractivo, observaciones
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idPaciente || null,  // Permitir null para idPaciente
        idOptometrista,
        NoExamen,
        rx_esfera_od,
        rx_cilindro_od,
        rx_eje_od,
        rx_esfera_oi,
        rx_cilindro_oi,
        rx_eje_oi,
        add_lente,
        ao,
        dnp,
        defRefractivo,
        observaciones
      ]
    );

    res.status(201).json({
      message: "Examen creado correctamente",
      idExamenVista: result.insertId  // Corregido: idHistorialClinico -> idExamenVista
    });
  } catch (error) {
    console.error("Error al crear el examen:", error);  // Corregido: "exámen" -> "examen"
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Actualizar un examen de vista existente
export const updateExamenVista = async (req, res) => {
  try {
    const { idExamenVista } = req.params;
    const {
      idPaciente,
      idOptometrista,
      NoExamen,
      rx_esfera_od,
      rx_cilindro_od,
      rx_eje_od,
      rx_esfera_oi,
      rx_cilindro_oi,
      rx_eje_oi,
      add_lente,
      ao,
      dnp,
      defRefractivo,
      observaciones
    } = req.body;

    // Verificar si el examen existe
    const [exists] = await db.query("SELECT 1 FROM ExamenVista WHERE idExamenVista = ?", [idExamenVista]);

    if (!exists.length) {
      return res.status(404).json({ message: "El examen no existe" });  // Corregido: "exámen" -> "examen"
    }

    const [result] = await db.query(
      `UPDATE ExamenVista SET
        idPaciente = ?,
        idOptometrista = ?,
        NoExamen = ?,
        rx_esfera_od = ?,
        rx_cilindro_od = ?,
        rx_eje_od = ?,
        rx_esfera_oi = ?,
        rx_cilindro_oi = ?,
        rx_eje_oi = ?,
        add_lente = ?,
        ao = ?,
        dnp = ?,
        defRefractivo = ?,
        observaciones = ?
      WHERE idExamenVista = ?`,
      [
        idPaciente || null,  // Permitir null para idPaciente
        idOptometrista,
        NoExamen,
        rx_esfera_od,
        rx_cilindro_od,
        rx_eje_od,
        rx_esfera_oi,
        rx_cilindro_oi,
        rx_eje_oi,
        add_lente,
        ao,
        dnp,
        defRefractivo,
        observaciones,
        idExamenVista
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No se pudo actualizar el examen" });  // Corregido: "exámen" -> "examen"
    }

    res.status(200).json({
      message: "Examen actualizado correctamente",  // Corregido: "Exámen" -> "Examen"
      idExamenVista
    });
  } catch (error) {
    console.error("Error al actualizar el examen de la vista:", error);  // Corregido: "exámen" -> "examen"
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Eliminar un examen de vista
export const deleteExamenVista = async (req, res) => {
  try {
    const { idExamenVista } = req.params;

    // Verificar si el examen existe antes de eliminar
    const [exists] = await db.query("SELECT 1 FROM ExamenVista WHERE idExamenVista = ?", [idExamenVista]);
    if (!exists.length) {
      return res.status(404).json({ message: "El examen no existe" });
    }

    const [result] = await db.query("DELETE FROM ExamenVista WHERE idExamenVista = ?", [idExamenVista]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Examen eliminado correctamente" });  // Corregido: "Exámen" -> "Examen"
    } else {
      res.status(400).json({ message: "No se pudo eliminar el examen" });  // Corregido: "exámen" -> "examen"
    }
  } catch (error) {
    console.error("Error al eliminar examen:", error);  // Corregido: "exámen" -> "examen"
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};