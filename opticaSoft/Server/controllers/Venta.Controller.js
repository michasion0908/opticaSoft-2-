import { db } from "../db/connection.js";

// Obtener todas las ventas
export const getVentas = async (req, res) => {
  try {
    const query = `
      SELECT 
            v.idVenta,
            v.idCotizacion,
            v.estado,
            v.metodoPago,
            v.referenciaPago,
            v.total,
            v.abono,
            v.debe, 
            c.codigo, 
            c.total AS totalCotizacion, 
            c.fechaRegistro, 
              CONCAT(p.nombre, ' ', p.apellido) AS nombrePaciente, 
              p.telefono AS telefono,
              p.direccion AS direccion, 
              p.localidad AS localidad
        FROM Venta v
        JOIN Cotizacion c ON v.idCotizacion = c.idCotizacion
        LEFT JOIN Paciente p ON c.idPaciente = p.idPaciente

    `;

    const [rows] = await db.query(query);

    if (rows.length > 0) {
      res.json({ message: "Ventas obtenidas correctamente", data: rows });
    } else {
      res.status(404).json({ message: "No se encontraron ventas" });
    }
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Crear una nueva venta
export const createVenta = async (req, res) => {
  try {
    const { idCotizacion, estado, metodoPago, referenciaPago, total, abono } = req.body;

    if (!idCotizacion || !total || !metodoPago) {
      return res.status(400).json({ 
        message: "Los campos idCotizacion, metodoPago y total son obligatorios" 
      });
    }

    const [result] = await db.query(
      `INSERT INTO Venta (idCotizacion, estado, metodoPago, referenciaPago, total, abono)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        idCotizacion,
        estado || 'PENDIENTE',
        metodoPago,
        referenciaPago || null,
        total,
        abono || 0
      ]
    );

    res.status(201).json({
      message: "Venta creada correctamente",
      idVenta: result.insertId
    });
  } catch (error) {
    console.error("Error al crear venta:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Actualizar una venta
export const updateVenta = async (req, res) => {
  try {
    const { idVenta } = req.params;
    const { idCotizacion, estado, metodoPago, referenciaPago, total, abono } = req.body;

    const [exists] = await db.query("SELECT 1 FROM Venta WHERE idVenta = ?", [idVenta]);
    if (!exists.length) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    await db.query(
      `UPDATE Venta SET
        idCotizacion = ?, 
        estado = ?, 
        metodoPago = ?, 
        referenciaPago = ?, 
        total = ?, 
        abono = ?
       WHERE idVenta = ?`,
      [
        idCotizacion,
        estado || 'PENDIENTE',
        metodoPago,
        referenciaPago || null,
        total,
        abono || 0,
        idVenta
      ]
    );

    res.status(200).json({
      message: "Venta actualizada correctamente",
      idVenta
    });
  } catch (error) {
    console.error("Error al actualizar venta:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

// Eliminar una venta
export const deleteVenta = async (req, res) => {
  try {
    const { idVenta } = req.params;

    const [exists] = await db.query("SELECT 1 FROM Venta WHERE idVenta = ?", [idVenta]);

    if (!exists.length) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    const [result] = await db.query("DELETE FROM Venta WHERE idVenta = ?", [idVenta]);

    if (result.affectedRows > 0) {
      res.json({ message: "Venta eliminada correctamente" });
    } else {
      res.status(400).json({ message: "No se pudo eliminar la venta" });
    }
  } catch (error) {
    console.error("Error al eliminar venta:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};
