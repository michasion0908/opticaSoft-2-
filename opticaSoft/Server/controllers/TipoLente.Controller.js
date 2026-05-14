import { db } from "../db/connection.js";

export const getTipoLente = async(req, res) => {
    try{
        const [rows] = await db.query("SELECT * FROM TipoLente");
        if (rows.length > 0){
            res.json({ message: "Tipos de lentes obtenidos correctamente", data : rows});
        }else{
            res.status(404).json({ message: "No se encontraron datos de los Tipos de lentes" });
        }
        } catch (error){
            return res.status(500).json({ message: "Algo salió mal" });
        }
            };

export const createTipoLente  = async (req, res) =>{
    try{
        const{ nombre, precio} = req.body;
        if (! nombre){
            return res.status(400).json({ message: "El nombre de los tipos de lentes es requerido"});
        }
        const [rows] = await db.query(
            "INSERT INTO TipoLente (nombre, precio) VALUES (?, ?)",
            [nombre, precio]
          ); 
        res.status(201).json({
            message: `Tipo de lente '${nombre}' creado`,
            idTipoLente: rows.insertId,
            nombre, 
            precio
        });
    }
    catch (error){
        console.error("Error al crear tipos de lentes:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
    };

    export const updateTipoLente  = async (req, res) => {
        try{
            const {idTipoLente} = req.params;
            const { nombre, precio} = req.body;
            if (! nombre){
                return res.status(400).json({ message: "El nombre de los tipos de lentes es requerido"});
            }
            const [rows] = await db.query(
                "UPDATE TipoLente SET nombre = ?, precio = ? WHERE idTipoLente = ?",
                [nombre, precio, idTipoLente]
            );
            if (rows.affectedRows > 0){
                res.json({ message: "tipo de lente actualizado correctamente"});
            }else{
                res.status(404).json({ message: "tipo de lente no encontrado"});
                    
                }
            } catch (error){
                console.error("Error al actualizar el tipo de lente:", error);
                res.status(500).json({ message: "Algo salió mal", error: error.message });
            }
    };


export const deleteTipoLente  = async (req, res) => {
    try{
        const {idTipoLente} = req.params;
        const [rows] = await db.query(
            "DELETE FROM TipoLente WHERE idTipoLente = ?",
            [idTipoLente]
        );
        if (rows.affectedRows > 0){
            res.json({ message: "Tipo de lente eliminado correctamente"});
        }else{
            res.status(404).json({ message: "tipo de lente no encontrado"});
        }
    } catch (error){
        console.error("Error al eliminar tipo de lente:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};