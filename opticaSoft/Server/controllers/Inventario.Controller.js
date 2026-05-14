import { db } from "../db/connection.js";

export const getInventario = async(req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM Inventario");
      if (rows.length > 0) {
        res.json({ message: "Inventarios obtenidos correctamente", data: rows });
      } else {
        res.status(404).json({ message: "No se encontraron datos del inventario" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Algo salió mal" });
    }
};

export const createInventario = async (req, res) => {
  try {
    const { marca, modelo, color, numeroColor, material, cantidad, exhibicion, precio, fecha, estatus, precioVenta } = req.body; 
    if (!marca || !modelo || !cantidad || !exhibicion || !precio || !fecha || !estatus) {
      return res.status(400).json({ message: "Todos los campos son requeridos: marca, modelo, cantidad, exhibicion, precio, fecha, estatus" });
    }
    const [rows] = await db.query(
      "INSERT INTO Inventario (marca, modelo, color, numeroColor, material, cantidad, exhibicion, precio, fecha, estatus, precioVenta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [marca, modelo, color, numeroColor, material, cantidad, exhibicion, precio, fecha, estatus, precioVenta]
    );
    res.status(201).json({
      message: `Inventario '${marca} ${modelo}' creado`,
      idInventario: rows.insertId,
      marca,
      modelo,
      color,
      numeroColor,
      material,
      cantidad,
      exhibicion,
      precio,
      fecha,
      estatus,
      precioVenta
    });
  } catch (error) {
    console.error("Error al crear inventario:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

export const updateInventario = async (req, res) => {
  try {
    const { idInventario } = req.params;
    const { marca, modelo, color, numeroColor, material, cantidad, exhibicion, precio, fecha, estatus, precioVenta } = req.body;
    if (!marca || !modelo || !cantidad || !exhibicion || !precio || !fecha || !estatus) {
      return res.status(400).json({ message: "Todos los campos son requeridos: marca, modelo, color, cantidad, exhibicion, precio, fecha, estatus" });
    }
    const [rows] = await db.query(
      "UPDATE Inventario SET marca = ?, modelo = ?, color = ?, numeroColor = ?, material = ?, cantidad = ?, exhibicion = ?, precio = ?, fecha = ?, estatus = ?, precioVenta = ? WHERE idInventario = ?",
      [marca, modelo, color, numeroColor, material, cantidad, exhibicion, precio, fecha, estatus, precioVenta, idInventario]
    );
    if (rows.affectedRows > 0) {
      res.json({ message: "Inventario actualizado correctamente" });
    } else {
      res.status(404).json({ message: "Inventario no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar inventario:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};

export const deleteInventario = async (req, res) => {
  try {
    const { idInventario } = req.params;
    const [rows] = await db.query("DELETE FROM Inventario WHERE idInventario = ?", [idInventario]);
    if (rows.affectedRows > 0) {
      res.json({ message: "Producto eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar inventario:", error);
    res.status(500).json({ message: "Algo salió mal", error: error.message });
  }
};