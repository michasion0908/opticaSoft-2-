import { db } from "../db/connection.js";

// Obtener todas las citas
export const getCitas = async (req, res) => {
    try {
        const query = `
            SELECT 
                c.idCita,
                c.idPaciente,
                c.idOptometrista,
                c.fechaHora,
                c.duracionEstimada,
                c.estado,
                c.motivo,
                c.observaciones,
                c.fechaRegistro,
                CONCAT(p.nombre, ' ', p.apellido) AS nombrePaciente, 
                o.nombre AS nombreOptometrista,
                o.noCedula AS cedula
            FROM Cita c
            LEFT JOIN Paciente p ON c.idPaciente = p.idPaciente
            LEFT JOIN Optometrista o ON c.idOptometrista = o.idOptometrista
            ORDER BY c.fechaHora DESC
        `;

        const [rows] = await db.query(query);

        if (rows.length > 0) {
            res.json({ message: "Citas obtenidas correctamente", data: rows });
        } else {
            res.status(404).json({ message: "No se encontraron citas" });
        }
    } catch (error) {
        console.error("Error al obtener citas:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};


// Crear una nueva cita
export const createCita = async (req, res) => {
    try {
        const {
            idPaciente,
            idOptometrista,
            fechaHora,
            duracionEstimada = 30,
            estado = 'PENDIENTE',
            motivo,
            observaciones
        } = req.body;

        // Validar campos obligatorios
        if (!idPaciente || !fechaHora) {
            return res.status(400).json({ 
                message: "Los campos obligatorios son: idPaciente, fechaHora" 
            });
        }

        const [result] = await db.query(
            `INSERT INTO Cita (
                idPaciente, idOptometrista, fechaHora, 
                duracionEstimada, estado, motivo, observaciones
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                idPaciente, idOptometrista, fechaHora,
                duracionEstimada, estado, motivo, observaciones
            ]
        );

        res.status(201).json({
            message: "Cita creada correctamente",
            idCita: result.insertId
        });
    } catch (error) {
        console.error("Error al crear cita:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};

// Actualizar una cita existente
export const updateCita = async (req, res) => {
    try {
        const { idCita } = req.params;
        const {
            idPaciente,
            idOptometrista,
            fechaHora,
            duracionEstimada,
            estado,
            motivo,
            observaciones
        } = req.body;

        // Verificar si la cita existe
        const [exists] = await db.query("SELECT 1 FROM Cita WHERE idCita = ?", [idCita]);

        if (!exists.length) {
            return res.status(404).json({ message: "La cita no existe" });
        }

        // Actualizar la cita
        const [result] = await db.query(
            `UPDATE Cita SET
                idPaciente = ?, 
                idOptometrista = ?, 
                fechaHora = ?, 
                duracionEstimada = ?, 
                estado = ?, 
                motivo = ?, 
                observaciones = ?
            WHERE idCita = ?`,
            [
                idPaciente, idOptometrista, fechaHora,
                duracionEstimada, estado, motivo, observaciones,
                idCita
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "No se pudo actualizar la cita" });
        }

        res.status(200).json({
            message: "Cita actualizada correctamente",
            idCita
        });
    } catch (error) {
        console.error("Error al actualizar cita:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};

// Eliminar una cita
export const deleteCita = async (req, res) => {
    try {
        const { idCita } = req.params;

        // Verificar si la cita existe
        const [cita] = await db.query("SELECT 1 FROM Cita WHERE idCita = ?", [idCita]);

        if (!cita.length) {
            return res.status(404).json({ message: "Cita no encontrada" });
        }

        // Eliminar la cita
        const [result] = await db.query("DELETE FROM Cita WHERE idCita = ?", [idCita]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Cita eliminada correctamente" });
        } else {
            res.status(400).json({ message: "No se pudo eliminar la cita" });
        }
    } catch (error) {
        console.error("Error al eliminar cita:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};
