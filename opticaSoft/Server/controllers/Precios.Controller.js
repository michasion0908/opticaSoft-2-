import { db } from "../db/connection.js";

// Obtener todos los precios
export const getPrecios = async (req, res) => {
    try {
        const query = `
            SELECT      
                p.idPrecio,
                p.idTipoLente,
                p.idMaterial,
                p.idTratamiento,
                p.serie,
                p.esfera,
                p.cilindro,
                p.combinada,
                p.precio,
                p.total,     
                tl.nombre AS TipoLente,
                tl.precio AS PrecioTipoLente,
                m.nombre AS Material,
                m.precio AS PrecioMaterial,
                t.nombre AS Tratamiento,
                t.precio AS PrecioTratamiento           
            FROM Precios p
            JOIN TipoLente tl ON p.idTipoLente = tl.idTipoLente
            JOIN Material m ON p.idMaterial = m.idMaterial
            JOIN Tratamientos t ON p.idTratamiento = t.idTratamiento
        `;

        const [rows] = await db.query(query);

        if (rows.length > 0) {
            res.json({ message: "Precios obtenidos correctamente", data: rows });
        } else {
            res.status(404).json({ message: "No se encontraron precios" });
        }
    } catch (error) {
        console.error("Error al obtener precios:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};

// Crear un nuevo precio
export const createPrecios = async (req, res) => {
    try {
        const {
            idTipoLente, 
            idMaterial,
            idTratamiento,
            serie,
            esfera,
            cilindro,
            combinada,
            precio,
            total
        } = req.body;

        // Validar campos obligatorios
        if (!idTipoLente || !idMaterial || !idTratamiento || !precio || !total) {
            return res.status(400).json({ 
                message: "Los campos obligatorios son: idTipoLente, idMaterial, idTratamiento, precio, total" 
            });
        }

        const [result] = await db.query(
            `INSERT INTO Precios (
                idTipoLente, idMaterial, idTratamiento, serie,
                esfera, cilindro, combinada, precio, total
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                idTipoLente, idMaterial, idTratamiento, serie,
                esfera, cilindro, combinada, precio, total
            ]
        );

        res.status(201).json({
            message: "Precio creado correctamente",
            idPrecio: result.insertId
        });
    } catch (error) {
        console.error("Error al crear precio:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};

// Actualizar un precio existente
export const updatePrecios = async (req, res) => {
    try {
        const { idPrecio } = req.params;
        const {
            idTipoLente,
            idMaterial,
            idTratamiento,
            serie,
            esfera,
            cilindro,
            combinada,
            precio,
            total
        } = req.body;

        // Verificar si el precio existe
        const [exists] = await db.query("SELECT 1 FROM Precios WHERE idPrecio = ?", [idPrecio]);

        if (!exists.length) {
            return res.status(404).json({ message: "El precio no existe" });
        }

        // Actualizar el precio
        const [result] = await db.query(
            `UPDATE Precios SET
                idTipoLente = ?, idMaterial = ?, idTratamiento = ?,
                serie = ?, esfera = ?, cilindro = ?, combinada = ?, precio = ?, total = ?
            WHERE idPrecio = ?`,
            [
                idTipoLente, idMaterial, idTratamiento,
                serie, esfera, cilindro, combinada, precio, total,
                idPrecio
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "No se pudo actualizar el precio" });
        }

        res.status(200).json({
            message: "Precio actualizado correctamente",
            idPrecio
        });
    } catch (error) {
        console.error("Error al actualizar precio:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};

// Eliminar un precio
export const deletePrecios = async (req, res) => {
    try {
        const { idPrecio } = req.params;

        // Verificar si el precio existe
        const [precio] = await db.query("SELECT 1 FROM Precios WHERE idPrecio = ?", [idPrecio]);

        if (!precio.length) {
            return res.status(404).json({ message: "Precio no encontrado" });
        }

        // Eliminar el precio
        const [result] = await db.query("DELETE FROM Precios WHERE idPrecio = ?", [idPrecio]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Precio eliminado correctamente" });
        } else {
            res.status(400).json({ message: "No se pudo eliminar el precio" });
        }
    } catch (error) {
        console.error("Error al eliminar precio:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};