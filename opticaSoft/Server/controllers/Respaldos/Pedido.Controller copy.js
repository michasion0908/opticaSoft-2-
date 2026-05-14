import { db } from "../../db/connection.js";

// Obtener todos los pedidos con detalles relacionados
export const getPedidos = async (req, res) => {
    try {
        const query = `
            SELECT 
                p.idPedido,
                p.idCotizacion,
                p.idInventario,
                p.idTipoLente,
                p.idMaterial,
                p.idLentesContacto,
                p.idPaquete,
                p.cantidad,
                p.fechaRegistro,
                p.fechaEntrega,
                p.total,
                p.observaciones,

                -- Datos relacionados
                c.Observaciones AS Cotizacion,
                CONCAT(pac.nombre, ' ', pac.apellido) AS nombrePaciente,
                i.modelo,
                CONCAT(i.marca, ' ', i.material) AS armazon,
                i.precioVenta AS precioArmazon,
                tl.nombre AS tipoLente,
                tl.precio AS precioLente,
                m.nombre AS material,
                m.precio AS precioMaterial,
                CONCAT(lc.marca, ' ', lc.modelo) AS lentesContacto,
                lc.marca AS marcaLentesContacto,
                lc.precio AS precioLentesContacto,
                paq.nombre AS paquete,
                paq.total AS precioPaquete

            FROM Pedido p
            LEFT JOIN Cotizacion c ON p.idCotizacion = c.idCotizacion
            LEFT JOIN Paciente pac ON c.idPaciente = pac.idPaciente
            LEFT JOIN Inventario i ON p.idInventario = i.idInventario
            LEFT JOIN TipoLente tl ON p.idTipoLente = tl.idTipoLente
            LEFT JOIN Material m ON p.idMaterial = m.idMaterial
            LEFT JOIN LentesContacto lc ON p.idLentesContacto = lc.idLentesContacto
            LEFT JOIN Paquete paq ON p.idPaquete = paq.idPaquete

            ORDER BY p.fechaRegistro DESC
        `;

        const [rows] = await db.query(query);

        if (rows.length > 0) {
            res.json({ message: "Pedidos obtenidos correctamente", data: rows });
        } else {
            res.status(404).json({ message: "No se encontraron pedidos" });
        }
    } catch (error) {
        console.error("Error al obtener pedidos:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};


// Crear un nuevo pedido
export const createPedido = async (req, res) => {
    try {
        const {
            idCotizacion,
            idInventario,
            idTipoLente,
            idMaterial,
            idLentesContacto,
            idPaquete,
            cantidad = 1,
            fechaEntrega,
            observaciones
        } = req.body;

        if (!idCotizacion) {
            return res.status(400).json({ 
                message: "El campo obligatorio es: idCotizacion" 
            });
        }

        let total = 0;

        // Función segura para sumar precios
        const sumarSiExiste = (precio) => {
            const numero = parseFloat(precio);
            return isNaN(numero) ? 0 : numero;
        };
        
        if (idInventario) {
            const [[inventario]] = await db.query("SELECT precioVenta FROM Inventario WHERE idInventario = ?", [idInventario]);
            total += sumarSiExiste(inventario?.precioVenta);
        }
        
        if (idTipoLente) {
            const [[tipoLente]] = await db.query("SELECT precio FROM TipoLente WHERE idTipoLente = ?", [idTipoLente]);
            total += sumarSiExiste(tipoLente?.precio);
        }
        
        if (idMaterial) {
            const [[material]] = await db.query("SELECT precio FROM Material WHERE idMaterial = ?", [idMaterial]);
            total += sumarSiExiste(material?.precio);
        }
        
        if (idLentesContacto) {
            const [[lenteContacto]] = await db.query("SELECT precio FROM LentesContacto WHERE idLentesContacto = ?", [idLentesContacto]);
            total += sumarSiExiste(lenteContacto?.precio);
        }
        
        if (idPaquete) {
            const [[paquete]] = await db.query("SELECT total FROM Paquete WHERE idPaquete = ?", [idPaquete]);
            total += sumarSiExiste(paquete?.total);
        }
        
        // Multiplicar total por la cantidad (asegurarse de que sea número también)
        const cantidadFinal = parseInt(cantidad);
        total *= isNaN(cantidadFinal) ? 1 : cantidadFinal;
        

        const [result] = await db.query(
            `INSERT INTO Pedido (
                idCotizacion, idInventario, idTipoLente, idMaterial, 
                idLentesContacto, idPaquete, cantidad, fechaEntrega, total, observaciones
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                idCotizacion, idInventario, idTipoLente, idMaterial,
                idLentesContacto, idPaquete, cantidad, fechaEntrega, total, observaciones
            ]
        );

        res.status(201).json({
            message: "Pedido creado correctamente",
            idPedido: result.insertId,
            totalCalculado: total
        });
    } catch (error) {
        console.error("Error al crear pedido:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};


// Actualizar un pedido existente
// Actualizar un pedido existente
export const updatePedido = async (req, res) => {
    try {
        const { idPedido } = req.params;
        const {
            idCotizacion,
            idInventario,
            idTipoLente,
            idMaterial,
            idLentesContacto,
            idPaquete,
            cantidad = 1,
            fechaEntrega,
            observaciones
        } = req.body;

        // Validar existencia del pedido
        const [exists] = await db.query("SELECT 1 FROM Pedido WHERE idPedido = ?", [idPedido]);

        if (!exists.length) {
            return res.status(404).json({ message: "El pedido no existe" });
        }

        // -------------------- Calcular el total dinámicamente -----------------------------
        let total = 0;

        // Sumar precio del armazón si se incluye
        if (idInventario !== null) {
            const [rows] = await db.query("SELECT precioVenta FROM Inventario WHERE idInventario = ?", [idInventario]);
            if (rows.length) total += Number(rows[0].precioVenta) || 0;
        }
        
        if (idTipoLente !== null) {
            const [rows] = await db.query("SELECT precio FROM TipoLente WHERE idTipoLente = ?", [idTipoLente]);
            if (rows.length) total += Number(rows[0].precio) || 0;
        }
        
        if (idMaterial !== null) {
            const [rows] = await db.query("SELECT precio FROM Material WHERE idMaterial = ?", [idMaterial]);
            if (rows.length) total += Number(rows[0].precio) || 0;
        }
        
        if (idLentesContacto !== null) {
            const [rows] = await db.query("SELECT precio FROM LentesContacto WHERE idLentesContacto = ?", [idLentesContacto]);
            if (rows.length) total += Number(rows[0].precio) || 0;
        }
        
        if (idPaquete !== null) {
            const [rows] = await db.query("SELECT total FROM Paquete WHERE idPaquete = ?", [idPaquete]);
            if (rows.length) total += Number(rows[0].total) || 0;
        }
        
        // Sumar los tratamientos asociados al pedido
        const [tratamientos] = await db.query(`
            SELECT t.precio 
            FROM Pedidos_Tratamiento pt
            JOIN Tratamientos t ON pt.idTratamiento = t.idTratamiento
            WHERE pt.idPedido = ?
        `, [idPedido]);
        
        tratamientos.forEach(tratamiento => {
            total += Number(tratamiento.precio) || 0;
        });
        
        // Multiplicar el total por la cantidad de productos (excepto tratamientos que son independientes de la cantidad)
        total = (total - tratamientos.reduce((sum, t) => sum + (Number(t.precio) || 0), 0)) * Number(cantidad || 1) 
                + tratamientos.reduce((sum, t) => sum + (Number(t.precio) || 0), 0);

        // Ejecutar la actualización en la base de datos
        const [result] = await db.query(
            `UPDATE Pedido SET 
                idCotizacion = ?, 
                idInventario = ?, 
                idTipoLente = ?, 
                idMaterial = ?, 
                idLentesContacto = ?, 
                idPaquete = ?, 
                cantidad = ?, 
                fechaEntrega = ?, 
                total = ?, 
                observaciones = ?
            WHERE idPedido = ?`,
            [
                idCotizacion, idInventario, idTipoLente,
                idMaterial, idLentesContacto, idPaquete,
                cantidad, fechaEntrega, total, observaciones,
                idPedido
            ]
        );

        // Validar si se aplicó algún cambio
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "No se pudo actualizar el pedido" });
        }

        // Respuesta exitosa
        res.status(200).json({
            message: "Pedido actualizado correctamente",
            idPedido,
            totalCalculado: total
        });

    } catch (error) {
        console.error("Error al actualizar pedido:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};



// Eliminar un pedido
export const deletePedido = async (req, res) => {
    try {
        const { idPedido } = req.params;

        const [pedido] = await db.query("SELECT 1 FROM Pedido WHERE idPedido = ?", [idPedido]);

        if (!pedido.length) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        const [result] = await db.query("DELETE FROM Pedido WHERE idPedido = ?", [idPedido]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Pedido eliminado correctamente" });
        } else {
            res.status(400).json({ message: "No se pudo eliminar el pedido" });
        }
    } catch (error) {
        console.error("Error al eliminar pedido:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};
