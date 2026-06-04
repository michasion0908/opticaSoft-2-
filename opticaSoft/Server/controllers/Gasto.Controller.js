import { db } from "../db/connection.js";

export const getGastos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM Gasto ORDER BY fecha DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener gastos", error: error.message });
  }
};

export const getGastosByMes = async (req, res) => {
  try {
    const { mes, anio } = req.params;
    const [rows] = await db.query(`
      SELECT * FROM Gasto 
      WHERE MONTH(fecha) = ? AND YEAR(fecha) = ?
      ORDER BY fecha DESC
    `, [mes, anio]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener gastos", error: error.message });
  }
};

export const createGasto = async (req, res) => {
  try {
    const { categoria, descripcion, monto, fecha, metodoPago } = req.body;
    const [result] = await db.query(`
      INSERT INTO Gasto (categoria, descripcion, monto, fecha, metodoPago)
      VALUES (?, ?, ?, ?, ?)
    `, [categoria, descripcion, monto, fecha, metodoPago]);
    res.status(201).json({ message: "Gasto registrado", idGasto: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar gasto", error: error.message });
  }
};

export const updateGasto = async (req, res) => {
  try {
    const { idGasto } = req.params;
    const { categoria, descripcion, monto, fecha, metodoPago } = req.body;
    await db.query(`
      UPDATE Gasto SET categoria=?, descripcion=?, monto=?, fecha=?, metodoPago=?
      WHERE idGasto=?
    `, [categoria, descripcion, monto, fecha, metodoPago, idGasto]);
    res.json({ message: "Gasto actualizado" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar gasto", error: error.message });
  }
};

export const deleteGasto = async (req, res) => {
  try {
    const { idGasto } = req.params;
    await db.query("DELETE FROM Gasto WHERE idGasto = ?", [idGasto]);
    res.json({ message: "Gasto eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar gasto", error: error.message });
  }
};

export const getResumenMensual = async (req, res) => {
  try {
    const { mes, anio } = req.params;
    const [gastos] = await db.query(`
      SELECT COALESCE(SUM(monto), 0) as totalGastos FROM Gasto
      WHERE MONTH(fecha) = ? AND YEAR(fecha) = ?
    `, [mes, anio]);

    const [ventas] = await db.query(`
      SELECT COALESCE(SUM(v.total), 0) as totalVentas
      FROM Venta v
      JOIN Cotizacion c ON v.idCotizacion = c.idCotizacion
      WHERE MONTH(c.fechaRegistro) = ? AND YEAR(c.fechaRegistro) = ?
    `, [mes, anio]);

    const totalGastos = parseFloat(gastos[0].totalGastos);
    const totalVentas = parseFloat(ventas[0].totalVentas);

    res.json({
      totalVentas,
      totalGastos,
      utilidad: totalVentas - totalGastos
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener resumen", error: error.message });
  }
};
