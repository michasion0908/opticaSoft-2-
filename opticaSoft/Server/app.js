import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

import indexRoutes from "./routes/index.Routes.js";

//---------------------------------- IMPORTACIÓN DE RUTAS --------------------------------------------
import UsuarioRoutes from "./routes/Usuario.Routes.js"; // RUTA DE USUARIOS
import pacienteRoutes from "./routes/Paciente.Routes.js";
import optometristaRoutes from "./routes/Optometrista.Routes.js";

// Inventarios 
import inventarioRoutes from "./routes/Inventario.Routes.js";
import MaterialRoutes from "./routes/Material.Routes.js";
import TratamientosRoutes from "./routes/Tratamientos.Routes.js";
import TipoLenteRoutes from "./routes/TipoLente.Routes.js";
import LentesContactoRoutes from "./routes/LentesContacto.Routes.js";

// Paquetes
import PaqueteRoutes from "./routes/Paquete.Routes.js";
import PaqueteDetalleRoutes from "./routes/PaqueteDetalle.Routes.js";

// Historial Clinico
import HistorialClinicoRoutes from "./routes/HistorialClinico.Routes.js";
import ExamenVistaRoutes from "./routes/ExamenVista.Routes.js";
import RecetaRoutes from "./routes/Receta.Routes.js";

// Ventas
import preciosRoutes from "./routes/Precios.Routes.js";
import CotizacionRoutes from "./routes/Cotizacion.Routes.js";
import PedidosRoutes from "./routes/Pedido.Routes.js";
import PedidosTratamientosRoutes from "./routes/PedidosTratamientos.Routes.js";
import VentasRoutes from "./routes/Venta.Routes.js";

// Citas
import CitasRoutes from "./routes/Cita.Routes.js";

//---------------------------------- CREACIÓN DE LA APLICACIÓN --------------------------------------------
const app = express();

// 1. Configuración de rate limiting (protección contra ataques DDoS y fuerza bruta)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // límite de peticiones por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: "Demasiadas solicitudes desde esta IP, por favor intente más tarde"
});

// 2. Configuración de Helmet con opciones básicas
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"]
    }
  },
  hidePoweredBy: true,
  noSniff: true,
  xssFilter: true
}));

// 3. Configuración CORS más segura (ajustar según necesidades)
app.use(cors({
  origin: true, // Permite cualquier origen (ajustar en producción)
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: [],
  maxAge: 90
}));

// 4. Middleware de seguridad adicional
app.use(express.json({ limit: "10kb" })); // Limita el tamaño del JSON
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(mongoSanitize()); // Previene inyección NoSQL
app.use(hpp()); // Previene parameter pollution
app.use(limiter); // Aplica rate limiting

// 5. Deshabilitar información sensible
app.disable("x-powered-by");

// 6. Headers de seguridad adicionales
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Feature-Policy", "none");
  next();
});

// 7. Middleware de logging básico (para auditoría de seguridad)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.path}`);
  next();
});

// 8. Manejo de errores seguro
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);
  res.status(500).json({ 
    status: "error", 
    message: "Ocurrió un error en el servidor" 
  });
});

//---------------------------------- RUTAS --------------------------------------------
app.use("/", indexRoutes);
app.use("/Paciente", pacienteRoutes);
app.use("/Optometrista", optometristaRoutes);
app.use("/Usuario", UsuarioRoutes);

// Inventarios
app.use("/Inventario", inventarioRoutes);
app.use("/Tratamientos", TratamientosRoutes);
app.use("/Material", MaterialRoutes);
app.use("/TipoLente", TipoLenteRoutes);
app.use("/LentesContacto", LentesContactoRoutes);

// Paquetes
app.use("/Paquete", PaqueteRoutes);
app.use("/PaqueteDetalle", PaqueteDetalleRoutes);

// Historial Clinico
app.use("/HistorialClinico", HistorialClinicoRoutes);
app.use("/ExamenVista", ExamenVistaRoutes);
app.use("/Receta", RecetaRoutes);

// Ventas
app.use("/Precios", preciosRoutes);
app.use("/Cotizacion", CotizacionRoutes);
app.use("/Pedidos", PedidosRoutes);
app.use("/Ventas", VentasRoutes);
app.use("/PedidosTratamientos", PedidosTratamientosRoutes);

// Citas
app.use("/Citas", CitasRoutes);

// 9. Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    status: "error", 
    message: "Recurso no encontrado" 
  });
});

export default app;