import { db } from "../db/connection.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email y contraseña requeridos" });

  const [rows] = await db.query(
    "SELECT idUsuario, nombre, apellido, idRol FROM Usuario WHERE email = ? AND password = ?",
    [email, password]
  );

  if (rows.length === 0)
    return res.status(401).json({ message: "Credenciales incorrectas" });

  res.json({ message: "Login exitoso", usuario: rows[0] });
};

export const register = async (req, res) => {
  const { nombre, apellido, email, password, idRol } = req.body;

  const [existe] = await db.query("SELECT idUsuario FROM Usuario WHERE email = ?", [email]);
  if (existe.length > 0)
    return res.status(400).json({ message: "El email ya está registrado" });

  const [result] = await db.query(
    "INSERT INTO Usuario (idRol, nombre, apellido, email, password) VALUES (?, ?, ?, ?, ?)",
    [idRol || 1, nombre, apellido, email, password]
  );

  res.status(201).json({ message: "Usuario creado", idUsuario: result.insertId });
};