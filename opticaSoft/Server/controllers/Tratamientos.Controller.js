import { db } from "../db/connection.js";

export const getTratamientos = async(req, res) => {
    try{
        const [rows] = await db.query("SELECT * FROM Tratamientos");
        if (rows.length > 0){
            res.json({ message: "Tratamientos obtenidos correctamente", data : rows});
        }else{
            res.status(404).json({ message: "No se encontraron datos de tratamientos" });
        }
        } catch (error){
            return res.status(500).json({ message: "Algo salió mal" });
        }
            };

export const createTratamientos = async (req, res) =>{
    try{
        const{ nombre, precio} = req.body;
        if (! nombre){
            return res.status(400).json({ message: "El nombre del tratamiento es requerido"});
        }
        const [rows] = await db.query(
            "INSERT INTO tratamientos (nombre, precio) VALUES (?, ?)",
            [nombre, precio]
          ); 
        res.status(201).json({
            message: `Tratamiento '${nombre}' creado`,
            idTratamiento: rows.insertId,
            nombre, 
            precio
        });
    }
    catch (error){
        console.error("Error al crear tratamiento:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
    };

    export const updateTratamientos = async (req, res) => {
        try{
            const {idTratamiento} = req.params;
            const { nombre, precio} = req.body;
            if (! nombre){
                return res.status(400).json({ message: "El nombre del tratamiento es requerido"});
            }
            const [rows] = await db.query(
                "UPDATE tratamientos SET nombre = ?, precio = ? WHERE idTratamiento = ?",
                [nombre, precio, idTratamiento]
            );
            if (rows.affectedRows > 0){
                res.json({ message: "Tratamiento actualizado correctamente"});
            }else{
                res.status(404).json({ message: "Tratamiento no encontrado"});
                    
                }
            } catch (error){
                console.error("Error al actualizar tratamiento:", error);
                res.status(500).json({ message: "Algo salió mal", error: error.message });
            }
    };


export const deleteTratamientos = async (req, res) => {
    try{
        const {idTratamiento} = req.params;
        const [rows] = await db.query(
            "DELETE FROM tratamientos WHERE idTratamiento = ?",
            [idTratamiento]
        );
        if (rows.affectedRows > 0){
            res.json({ message: "Tratamiento eliminado correctamente"});
        }else{
            res.status(404).json({ message: "Tratamiento no encontrado"});
        }
    } catch (error){
        console.error("Error al eliminar tratamiento:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};