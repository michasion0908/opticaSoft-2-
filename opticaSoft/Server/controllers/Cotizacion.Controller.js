import { db } from "../db/connection.js";

// Función para generar código único como COT-0001
const generarCodigoCotizacion = async () => {
  const [rows] = await db.query("SELECT MAX(idCotizacion) AS maxId FROM Cotizacion");
  const nextId = (rows[0]?.maxId || 0) + 1;
  return `COT-${String(nextId).padStart(4, '0')}`;
};

//Get
export const getCotizaciones = async (req, res) => {
  try {
    const query = `
      SELECT 
        c.*, 
        CONCAT(p.nombre, ' ', p.apellido) AS nombrePaciente, 
        p.telefono AS telefono,
        p.direccion AS direccion, 
        p.localidad AS localidad,
        p.edad AS edad
      FROM Cotizacion c
      LEFT JOIN Paciente p ON c.idPaciente = p.idPaciente
      ORDER BY c.fechaRegistro DESC
    `;

    const [rows] = await db.query(query);

    if (rows.length > 0) {
      res.json({ message: "Cotizaciones obtenidas correctamente", data: rows });
    } else {
      res.status(404).json({ message: "No se encontraron cotizaciones" });
    }
  } catch (error) {
    console.error("Error al obtener cotizaciones:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// --------------------------------- Create ---------------------------------
export const createCotizacion = async (req, res) => {
  try {
    const { idPaciente, tipo, subtotal, descuento = 0, iva, total, observaciones } = req.body;

    const codigo = await generarCodigoCotizacion();

    const [result] = await db.query(
      `INSERT INTO Cotizacion (
        idPaciente, codigo, tipo, subtotal, descuento, iva, total, observaciones
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [idPaciente, codigo, tipo, subtotal, descuento, iva, total, observaciones]
    );

    res.status(201).json({
      message: "Cotización creada correctamente",
      idCotizacion: result.insertId,
      codigo
    });
  } catch (error) {
    console.error("Error al crear cotización:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// --------------------------------- Update ---------------------------------
export const updateCotizacion = async (req, res) => {
  try {
    const { idCotizacion } = req.params;
    const { idPaciente, tipo, subtotal, descuento = 0, iva, total, observaciones } = req.body;

    const [exists] = await db.query("SELECT 1 FROM Cotizacion WHERE idCotizacion = ?", [idCotizacion]);
    if (!exists.length) {
      return res.status(404).json({ message: "La cotización no existe" });
    }

    const [result] = await db.query(
      `UPDATE Cotizacion SET
        idPaciente = ?, tipo = ?, subtotal = ?, descuento = ?, iva = ?, total = ?, observaciones = ?
      WHERE idCotizacion = ?`,
      [idPaciente, tipo, subtotal, descuento, iva, total, observaciones, idCotizacion]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No se pudo actualizar la cotización" });
    }

    res.status(200).json({ message: "Cotización actualizada correctamente", idCotizacion });
  } catch (error) {
    console.error("Error al actualizar cotización:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// --------------------------------- Delete ---------------------------------
export const deleteCotizacion = async (req, res) => {
  try {
    const { idCotizacion } = req.params;

    const [cotizacion] = await db.query("SELECT 1 FROM Cotizacion WHERE idCotizacion = ?", [idCotizacion]);
    if (!cotizacion.length) {
      return res.status(404).json({ message: "Cotización no encontrada" });
    }

    const [result] = await db.query("DELETE FROM Cotizacion WHERE idCotizacion = ?", [idCotizacion]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Cotización eliminada correctamente" });
    } else {
      res.status(400).json({ message: "No se pudo eliminar la cotización" });
    }
  } catch (error) {
    console.error("Error al eliminar cotización:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};
