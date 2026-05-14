import { db } from "../db/connection.js";

export const getMaterial = async(req, res) => {
    try{
        const [rows] = await db.query("SELECT * FROM Material");
        if (rows.length > 0){
            res.json({ message: "Materiales obtenidos correctamente", data : rows});
        }else{
            res.status(404).json({ message: "No se encontraron datos de los materiales" });
        }
        } catch (error){
            return res.status(500).json({ message: "Algo salió mal" });
        }
            };

export const createMaterial = async (req, res) =>{
    try{
        const{ nombre, precio} = req.body;
        if (! nombre){
            return res.status(400).json({ message: "El nombre del material es requerido"});
        }
        const [rows] = await db.query(
            "INSERT INTO Material (nombre, precio) VALUES (?, ?)",
            [nombre, precio]
          ); 
        res.status(201).json({
            message: `Material '${nombre}' creado`,
            idMaterial: rows.insertId,
            nombre, 
            precio
        });
    }
    catch (error){
        console.error("Error al crear Material:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
    };

    export const updateMaterial = async (req, res) => {
        try{
            const {idMaterial} = req.params;
            const { nombre, precio} = req.body;
            if (! nombre){
                return res.status(400).json({ message: "El nombre del material es requerido"});
            }
            const [rows] = await db.query(
                "UPDATE Material SET nombre = ?, precio = ? WHERE idMaterial = ?",
                [nombre, precio, idMaterial]
            );
            if (rows.affectedRows > 0){
                res.json({ message: "Material actualizado correctamente"});
            }else{
                res.status(404).json({ message: "Material no encontrado"});
                    
                }
            } catch (error){
                console.error("Error al actualizar el material:", error);
                res.status(500).json({ message: "Algo salió mal", error: error.message });
            }
    };


export const deleteMaterial = async (req, res) => {
    try{
        const {idMaterial} = req.params;
        const [rows] = await db.query(
            "DELETE FROM Material WHERE idMaterial = ?",
            [idMaterial]
        );
        if (rows.affectedRows > 0){
            res.json({ message: "Material eliminado correctamente"});
        }else{
            res.status(404).json({ message: "Material no encontrado"});
        }
    } catch (error){
        console.error("Error al eliminar Material:", error);
        res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};