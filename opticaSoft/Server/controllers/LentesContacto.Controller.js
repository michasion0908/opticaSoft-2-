import { db } from "../db/connection.js";

// Obtener todos los lentes de contacto
export const getLentesContacto = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM LentesContacto");
        if (rows.length > 0) {
            res.json({ message: "Lentes de contacto obtenidos correctamente", data: rows });
        } else {
            res.status(404).json({ message: "No se encontraron datos de los Lentes de contacto" });
        }
    } catch (error) {
        res.status(500).json({ message: "Algo salió mal" });
    }
};

// Crear nuevo lente de contacto
export const createLentesContacto = async (req, res) => {
    try {
        const { marca, modelo, duracion, esfera, precio } = req.body;

        if (!marca || !modelo || !duracion || precio === undefined) {
            return res.status(400).json({ message: "Marca, modelo, duración y precio son obligatorios" });
        }

        if (isNaN(precio) || Number(precio) <= 0) {
            return res.status(400).json({ message: "El precio debe ser un número positivo" });
        }

        const [rows] = await db.query(
            "INSERT INTO LentesContacto (marca, modelo, duracion, esfera, precio) VALUES (?, ?, ?, ?, ?)",
            [marca, modelo, duracion, esfera, precio]
        );

        res.status(201).json({
            message: `Lente de Contacto '${marca}' creado`,
            idLentesContacto: rows.insertId,
            marca,
            modelo,
            duracion,
            esfera,
            precio
        });
    } catch (error) {
        console.error("Error al crear lente de contacto:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};

// Actualizar lente de contacto
export const updateLentesContacto = async (req, res) => {
    try {
        const { idLentesContacto } = req.params;
        const { marca, modelo, duracion, esfera, precio } = req.body;

        if (!marca || !modelo || !duracion || precio === undefined) {
            return res.status(400).json({ message: "Marca, modelo, duración y precio son obligatorios" });
        }

        if (isNaN(precio) || Number(precio) <= 0) {
            return res.status(400).json({ message: "El precio debe ser un número positivo" });
        }

        const [rows] = await db.query(
            "UPDATE LentesContacto SET marca = ?, modelo = ?, duracion = ?, esfera = ?, precio = ? WHERE idLentesContacto = ?",
            [marca, modelo, duracion, esfera, precio, idLentesContacto]
        );

        if (rows.affectedRows > 0) {
            res.json({ message: "Lente de contacto actualizado correctamente" });
        } else {
            res.status(404).json({ message: "Lente de contacto no encontrado" });
        }
    } catch (error) {
        console.error("Error al actualizar el lente de contacto:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};

// Eliminar lente de contacto
export const deleteLentesContacto = async (req, res) => {
    try {
        const { idLentesContacto } = req.params;

        const [rows] = await db.query(
            "DELETE FROM LentesContacto WHERE idLentesContacto = ?",
            [idLentesContacto]
        );

        if (rows.affectedRows > 0) {
            res.json({ message: "Lente de contacto eliminado correctamente" });
        } else {
            res.status(404).json({ message: "Lente de contacto no encontrado" });
        }
    } catch (error) {
        console.error("Error al eliminar lente de contacto:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};
