import { db } from "../db/connection.js";

// Obtener todos los pedidos-tratamientos
export const getPedidosTratamiento = async (req, res) => {
    try {
        const query = `
            SELECT 
                pt.idPedidos_Tratamiento,
                pt.idTratamiento,
                pt.idPedido,
                t.nombre AS nombreTratamiento,
                t.precio AS precioTratamiento,
                p.observaciones
            FROM Pedidos_Tratamiento pt
            JOIN Tratamientos t ON pt.idTratamiento = t.idTratamiento
            JOIN Pedido p ON pt.idPedido = p.idPedido
        `;

        const [rows] = await db.query(query);

        if (rows.length > 0) {
            res.json({ message: "Pedidos-Tratamientos obtenidos correctamente", data: rows });
        } else {
            res.status(404).json({ message: "No se encontraron Pedidos-Tratamientos" });
        }
    } catch (error) {
        console.error("Error al obtener Pedidos-Tratamientos:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};

// Crear un nuevo pedido-tratamiento
export const createPedidoTratamiento = async (req, res) => {
    try {
        const { idTratamiento, idPedido } = req.body;

        // Validar campos obligatorios
        if (!idTratamiento || !idPedido) {
            return res.status(400).json({ 
                message: "Los campos obligatorios son: idTratamiento, idPedido" 
            });
        }

        const [result] = await db.query(
            `INSERT INTO Pedidos_Tratamiento (idTratamiento, idPedido)
             VALUES (?, ?)`,
            [idTratamiento, idPedido]
        );

        res.status(201).json({
            message: "Pedido-Tratamiento creado correctamente",
            idPedidos_Tratamiento: result.insertId
        });
    } catch (error) {
        console.error("Error al crear Pedido-Tratamiento:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};

// Actualizar un pedido-tratamiento existente
export const updatePedidoTratamiento = async (req, res) => {
    try {
        const { idPedidos_Tratamiento } = req.params;
        const { idTratamiento, idPedido } = req.body;

        // Verificar si el registro existe
        const [exists] = await db.query(
            "SELECT 1 FROM Pedidos_Tratamiento WHERE idPedidos_Tratamiento = ?", 
            [idPedidos_Tratamiento]
        );

        if (!exists.length) {
            return res.status(404).json({ message: "El Pedido-Tratamiento no existe" });
        }

        const [result] = await db.query(
            `UPDATE Pedidos_Tratamiento SET
                idTratamiento = ?, 
                idPedido = ?
            WHERE idPedidos_Tratamiento = ?`,
            [idTratamiento, idPedido, idPedidos_Tratamiento]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "No se pudo actualizar el Pedido-Tratamiento" });
        }

        res.status(200).json({
            message: "Pedido-Tratamiento actualizado correctamente",
            idPedidos_Tratamiento
        });
    } catch (error) {
        console.error("Error al actualizar Pedido-Tratamiento:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};

// Eliminar un pedido-tratamiento
export const deletePedidoTratamiento = async (req, res) => {
    try {
        const { idPedidos_Tratamiento } = req.params;

        // Verificar si el registro existe
        const [pedidoTratamiento] = await db.query(
            "SELECT 1 FROM Pedidos_Tratamiento WHERE idPedidos_Tratamiento = ?", 
            [idPedidos_Tratamiento]
        );

        if (!pedidoTratamiento.length) {
            return res.status(404).json({ message: "Pedido-Tratamiento no encontrado" });
        }

        const [result] = await db.query(
            "DELETE FROM Pedidos_Tratamiento WHERE idPedidos_Tratamiento = ?", 
            [idPedidos_Tratamiento]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Pedido-Tratamiento eliminado correctamente" });
        } else {
            res.status(400).json({ message: "No se pudo eliminar el Pedido-Tratamiento" });
        }
    } catch (error) {
        console.error("Error al eliminar Pedido-Tratamiento:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};
