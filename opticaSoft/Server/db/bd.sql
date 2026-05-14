CREATE DATABASE OpticaDB;    
USE OpticaDB;

CREATE TABLE Rol (
    idRol INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE Usuario (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    idRol INT,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (idRol) REFERENCES Rol(idRol)
);

CREATE TABLE Paciente (
    idPaciente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    edad INT NOT NULL,
    sexo ENUM('Masculino', 'Femenino', 'Otro') NOT NULL,
    ocupacion VARCHAR(100),
    direccion VARCHAR(255),
    localidad VARCHAR(255), 
    estado VARCHAR(255),
    telefono VARCHAR(15), 
    observaciones TEXT,
    fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Inventario (
    idInventario INT PRIMARY KEY AUTO_INCREMENT,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    numeroColor VARCHAR(50),
    material VARCHAR(100),
    cantidad INT NOT NULL,
    exhibicion ENUM('Dama', 'Caballero', 'Niño') NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    fecha DATE NOT NULL,
    estatus ENUM('Disponible', 'Vendido') NOT NULL,
    precioVenta DECIMAL(10,2)
);

CREATE TABLE Optometrista (
    idOptometrista INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    noCedula VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE TipoLente (
    idTipoLente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL, 
    precio DECIMAL(10,2) NULL
);

CREATE TABLE Material (
    idMaterial INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL, 
    precio DECIMAL(10,2) NULL
);

CREATE TABLE Tratamientos (
    idTratamiento INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE, 
    precio DECIMAL(10,2) NULL
);

CREATE TABLE HistorialClinico (
    idHistorialClinico INT PRIMARY KEY AUTO_INCREMENT,
    idPaciente INT NOT NULL,
    antecedentes_salud TEXT,
    antecedentes_familiares TEXT,
    medicamentos TEXT,
    dosis TEXT,
    cirugias TEXT,
    fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idPaciente) REFERENCES Paciente(idPaciente)
);

CREATE TABLE ExamenVista (
    idExamenVista INT PRIMARY KEY AUTO_INCREMENT,
    idPaciente INT DEFAULT NULL,
    idOptometrista INT DEFAULT NULL,
    NoExamen VARCHAR(20),
    rx_esfera_od VARCHAR(10),
    rx_cilindro_od VARCHAR(10),
    rx_eje_od VARCHAR(10),
    rx_esfera_oi VARCHAR(10),
    rx_cilindro_oi VARCHAR(10),
    rx_eje_oi VARCHAR(10),
    add_lente VARCHAR(10),
    ao VARCHAR(10),
    dnp VARCHAR(10),
    defRefractivo ENUM('Miopía', 'Hipermetropía', 'Astigmatismo', 'Presbicia') NOT NULL,
    observaciones TEXT,
    fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idPaciente) REFERENCES Paciente(idPaciente) ON DELETE CASCADE,
    FOREIGN KEY (idOptometrista) REFERENCES Optometrista(idOptometrista)
);

CREATE TABLE Receta (
    idReceta INT PRIMARY KEY AUTO_INCREMENT,
    idExamenVista INT NOT NULL,
    diagnostico TEXT, 
    observaciones TEXT, 
    vigencia DATE,
    fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idExamenVista) REFERENCES ExamenVista(idExamenVista)
);

#Precios promoción
CREATE TABLE Paquete (
    idPaquete INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    total DECIMAL(10,2) NOT NULL,
    vigencia DATE ,
    estado ENUM('ACTIVO','INACTIVO') DEFAULT 'ACTIVO'
);

CREATE TABLE PaqueteDetalle (
    idPaqueteDetalle INT PRIMARY KEY AUTO_INCREMENT,
    idPaquete INT NOT NULL,
    idTipoLente INT,
    idMaterial INT,
    idTratamiento INT,
    FOREIGN KEY (idPaquete) REFERENCES Paquete(idPaquete) ON DELETE CASCADE,
    FOREIGN KEY (idTipoLente) REFERENCES TipoLente(idTipoLente),
    FOREIGN KEY (idMaterial) REFERENCES Material(idMaterial),
    FOREIGN KEY (idTratamiento) REFERENCES Tratamientos(idTratamiento)
);


CREATE TABLE Precios (
    idPrecio INT PRIMARY KEY AUTO_INCREMENT,
    idTipoLente INT DEFAULT NULL,
    idMaterial INT DEFAULT NULL,
    idTratamiento INT DEFAULT NULL,
    idLentesContacto INT DEFAULT NULL,
    idPaquete INT DEFAULT NULL,
    observacion VARCHAR(50),
    FOREIGN KEY (idTipoLente) REFERENCES TipoLente(idTipoLente) ON DELETE SET NULL,
    FOREIGN KEY (idMaterial) REFERENCES Material(idMaterial) ON DELETE SET NULL,
    FOREIGN KEY (idTratamiento) REFERENCES Tratamientos(idTratamiento) ON DELETE SET NULL,
    FOREIGN KEY (idLentesContacto) REFERENCES LentesContacto(idLentesContacto) ON DELETE SET NULL,
    FOREIGN KEY (idPaquete) REFERENCES Paquete(idPaquete) ON DELETE CASCADE
);


-- Nueva tabla de lentes de contacto
CREATE TABLE LentesContacto (
    idLentesContacto INT PRIMARY KEY AUTO_INCREMENT,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NULL,
    duracion VARCHAR(50) NOT NULL,
    esfera VARCHAR(50),
    precio DECIMAL(10,2) NOT NULL
);

CREATE TABLE Cotizacion (
    idCotizacion INT PRIMARY KEY AUTO_INCREMENT,
    idPaciente INT DEFAULT NULL,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    tipo ENUM('ARMAZON','LENTE','TRATAMIENTO','SERVICIO', 'PAQUETE', 'OTRO') NOT NULL,
    fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10,2) DEFAULT NULL,
    descuento DECIMAL(10,2) DEFAULT 0,
    iva DECIMAL(10,2) DEFAULT NULL,
    total DECIMAL(10,2) DEFAULT NULL,
    observaciones TEXT,
    FOREIGN KEY (idPaciente) REFERENCES Paciente(idPaciente)
);

CREATE TABLE Pedido (
    idPedido INT PRIMARY KEY AUTO_INCREMENT,
    idCotizacion INT NOT NULL,
    idInventario INT DEFAULT NULL,
    idTipoLente INT DEFAULT NULL,
    idMaterial INT DEFAULT NULL,
    idLentesContacto INT DEFAULT NULL,
    idPaquete INT DEFAULT NULL, #Para Paquetes 
    cantidad INT NOT NULL DEFAULT 1,
    fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    fechaEntrega DATE,
    total DECIMAL(10,2) NOT NULL,
    observaciones TEXT,
    FOREIGN KEY (idInventario) REFERENCES Inventario(idInventario),
    FOREIGN KEY (idTipoLente) REFERENCES TipoLente(idTipoLente),
    FOREIGN KEY (idMaterial) REFERENCES Material(idMaterial),
    FOREIGN KEY (idLentesContacto) REFERENCES LentesContacto(idLentesContacto), 
    FOREIGN KEY (idPaquete) REFERENCES Paquete(idPaquete), 
    FOREIGN KEY (idCotizacion) REFERENCES Cotizacion(idCotizacion) ON DELETE CASCADE
);

CREATE TABLE Pedidos_Tratamiento (
    idPedidos_Tratamiento INT PRIMARY KEY AUTO_INCREMENT,
    idTratamiento INT NOT NULL,
    idPedido INT NOT NULL,
    FOREIGN KEY (idTratamiento) REFERENCES Tratamientos(idTratamiento) ON DELETE CASCADE,  
    FOREIGN KEY (idPedido) REFERENCES Pedido(idPedido) ON DELETE CASCADE
);

CREATE TABLE Venta (
    idVenta INT PRIMARY KEY AUTO_INCREMENT,
    idCotizacion INT NOT NULL, 
    estado ENUM('PENDIENTE','LIQUIDADO','CANCELADO') DEFAULT 'PENDIENTE',
    metodoPago ENUM('TRANSFERENCIA','EFECTIVO','TARJETA DÉBITO','TARJETA CRÉDITO','CHEQUES', 'OTRO'),
    referenciaPago VARCHAR(100),
    total DECIMAL(10,2) NOT NULL,
    abono DECIMAL(10,2) DEFAULT 0,
    debe DECIMAL(10,2) GENERATED ALWAYS AS (total - abono) STORED,
    FOREIGN KEY (idCotizacion) REFERENCES Cotizacion(idCotizacion) ON DELETE CASCADE
);

CREATE TABLE Cita (
    idCita INT PRIMARY KEY AUTO_INCREMENT,
    idPaciente INT NOT NULL,
    idOptometrista INT,
    fechaHora DATETIME NOT NULL,
    duracionEstimada INT DEFAULT 30 COMMENT 'En minutos',
    estado ENUM('PENDIENTE','CONFIRMADA','COMPLETADA','CANCELADA','NO_ASISTIO') DEFAULT 'PENDIENTE',
    motivo TEXT,
    observaciones TEXT,
    fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idPaciente) REFERENCES Paciente(idPaciente) ON DELETE CASCADE,
    FOREIGN KEY (idOptometrista) REFERENCES Optometrista(idOptometrista) ON DELETE SET NULL
);

#------------- Creación Automática de Historial al Generar Paciente -----------------
DELIMITER //
CREATE TRIGGER after_paciente_insert
AFTER INSERT ON Paciente
FOR EACH ROW
BEGIN
    INSERT INTO HistorialClinico (
        idPaciente, antecedentes_salud, antecedentes_familiares, medicamentos,
        dosis, cirugias
    ) VALUES (
        NEW.idPaciente,
        '',
        '',
        '',
        '',
        ''
    );
END//
DELIMITER ;


#------------- Creación Automática de Venta al Generar Cotización -----------------
DELIMITER //
CREATE TRIGGER after_cotizacion_insert
AFTER INSERT ON Cotizacion
FOR EACH ROW
BEGIN
    INSERT INTO Venta (
        idCotizacion, estado, metodoPago, referenciaPago, total, abono
    ) VALUES (
        NEW.idCotizacion, 
        'PENDIENTE', 
        NULL, 
        NULL, 
        NEW.total, 
        0
    );
END//
DELIMITER ;

#------- Actualiza el total (en pedidos) cuando se agrega un nuevo tratamiento. --------------------------------------
DELIMITER $$

CREATE TRIGGER after_insert_pedidos_tratamiento
AFTER INSERT ON Pedidos_Tratamiento
FOR EACH ROW
BEGIN
    DECLARE sumaTratamientos DECIMAL(10,2);
    DECLARE sumaPedido DECIMAL(10,2);

    -- Sumar precios de todos los tratamientos asociados al pedido
    SELECT SUM(t.precio) INTO sumaTratamientos
    FROM Pedidos_Tratamiento pt
    JOIN Tratamientos t ON pt.idTratamiento = t.idTratamiento
    WHERE pt.idPedido = NEW.idPedido;

    -- Calcular el total sin tratamientos
    SELECT 
        (COALESCE(i.precioVenta, 0) + COALESCE(tl.precio, 0) + COALESCE(m.precio, 0) + COALESCE(lc.precio, 0) + COALESCE(paq.total, 0)) * p.cantidad
        INTO sumaPedido
    FROM Pedido p
    LEFT JOIN Inventario i ON p.idInventario = i.idInventario
    LEFT JOIN TipoLente tl ON p.idTipoLente = tl.idTipoLente
    LEFT JOIN Material m ON p.idMaterial = m.idMaterial
    LEFT JOIN LentesContacto lc ON p.idLentesContacto = lc.idLentesContacto
    LEFT JOIN Paquete paq ON p.idPaquete = paq.idPaquete
    WHERE p.idPedido = NEW.idPedido;

    -- Actualizar el total del pedido
    UPDATE Pedido
    SET total = COALESCE(sumaPedido, 0) + COALESCE(sumaTratamientos, 0)
    WHERE idPedido = NEW.idPedido;
END$$

DELIMITER ;

#------- Actualiza el total cuando se elimina un tratamiento del pedido.. --------------------------------------
DELIMITER $$

CREATE TRIGGER after_delete_pedidos_tratamiento
AFTER DELETE ON Pedidos_Tratamiento
FOR EACH ROW
BEGIN
    DECLARE sumaTratamientos DECIMAL(10,2);
    DECLARE sumaPedido DECIMAL(10,2);

    -- Sumar precios restantes de tratamientos
    SELECT SUM(t.precio) INTO sumaTratamientos
    FROM Pedidos_Tratamiento pt
    JOIN Tratamientos t ON pt.idTratamiento = t.idTratamiento
    WHERE pt.idPedido = OLD.idPedido;

    -- Calcular el total sin tratamientos
    SELECT 
        (COALESCE(i.precioVenta, 0) + COALESCE(tl.precio, 0) + COALESCE(m.precio, 0) + COALESCE(lc.precio, 0) + COALESCE(paq.total, 0)) * p.cantidad
        INTO sumaPedido
    FROM Pedido p
    LEFT JOIN Inventario i ON p.idInventario = i.idInventario
    LEFT JOIN TipoLente tl ON p.idTipoLente = tl.idTipoLente
    LEFT JOIN Material m ON p.idMaterial = m.idMaterial
    LEFT JOIN LentesContacto lc ON p.idLentesContacto = lc.idLentesContacto
    LEFT JOIN Paquete paq ON p.idPaquete = paq.idPaquete
    WHERE p.idPedido = OLD.idPedido;

    -- Actualizar el total del pedido
    UPDATE Pedido
    SET total = COALESCE(sumaPedido, 0) + COALESCE(sumaTratamientos, 0)
    WHERE idPedido = OLD.idPedido;
END$$

DELIMITER ;



#------------- Actualización de Inventario al Realizar Pedido -----------------
DELIMITER //
CREATE TRIGGER after_pedido_insert
AFTER INSERT ON Pedido
FOR EACH ROW
BEGIN
    -- Si el pedido incluye un item del inventario (armazón)
    IF NEW.idInventario IS NOT NULL THEN
        UPDATE Inventario 
        SET cantidad = cantidad - NEW.cantidad
        WHERE idInventario = NEW.idInventario;
    END IF;
END//
DELIMITER ;

# ----------------------- TOTAL AUTOMÁTICO COTIZACIÓN --------------------------------

DROP TRIGGER IF EXISTS after_pedido_insert;
DROP TRIGGER IF EXISTS after_pedido_update;
DROP TRIGGER IF EXISTS after_pedido_delete;
DROP TRIGGER IF EXISTS after_cotizacion_insert;
DROP TRIGGER IF EXISTS after_cotizacion_update;
DROP PROCEDURE IF EXISTS ActualizarCotizacion;
DROP TRIGGER IF EXISTS after_cotizacion_insert;
DROP TRIGGER IF EXISTS after_cotizacion_update;

DELIMITER //

CREATE PROCEDURE ActualizarCotizacion(IN cotizacion_id INT)
BEGIN
    DECLARE sub_total DECIMAL(10,2);
    DECLARE dto DECIMAL(10,2);
    DECLARE iv DECIMAL(10,2);
    DECLARE tot DECIMAL(10,2);

    -- 1. Obtener subtotal
    SELECT SUM(total) INTO sub_total 
    FROM Pedido 
    WHERE idCotizacion = cotizacion_id;

    IF sub_total IS NULL THEN 
        SET sub_total = 0; 
    END IF;

    -- 2. Obtener descuento e IVA y asegurarse que no sean NULL
    SELECT 
        COALESCE(descuento, 0), 
        COALESCE(iva, 0) 
    INTO dto, iv 
    FROM Cotizacion 
    WHERE idCotizacion = cotizacion_id;

    -- 3. Calcular total
    SET tot = (sub_total - (sub_total * dto / 100)) * (1 + iv / 100);

    -- 4. Actualizar cotización
    UPDATE Cotizacion 
    SET subtotal = sub_total, 
        total = tot
    WHERE idCotizacion = cotizacion_id;
END //

DELIMITER ;


-- Trigger para INSERT en Pedido
DELIMITER //
CREATE TRIGGER after_pedido_insert
AFTER INSERT ON Pedido
FOR EACH ROW
BEGIN
    CALL ActualizarCotizacion(NEW.idCotizacion);
END //
DELIMITER ;

-- Trigger para UPDATE en Pedido
DELIMITER //
CREATE TRIGGER after_pedido_update
AFTER UPDATE ON Pedido
FOR EACH ROW
BEGIN
    CALL ActualizarCotizacion(NEW.idCotizacion);
END //
DELIMITER ;

-- Trigger para DELETE en Pedido
DELIMITER //
CREATE TRIGGER after_pedido_delete
AFTER DELETE ON Pedido
FOR EACH ROW
BEGIN
    CALL ActualizarCotizacion(OLD.idCotizacion);
END //
DELIMITER ;

DELIMITER //
-- Trigger para INSERT en Cotizacion (versión modificada)
CREATE TRIGGER before_cotizacion_insert
BEFORE INSERT ON Cotizacion
FOR EACH ROW
BEGIN
    -- Establecer valores por defecto si son NULL
    SET NEW.descuento = COALESCE(NEW.descuento, 0);
    SET NEW.iva = COALESCE(NEW.iva, 0);
    
    -- Inicializar subtotal y total (se actualizarán después con los pedidos)
    SET NEW.subtotal = 0;
    SET NEW.total = 0;
END //

-- Trigger para UPDATE en Cotizacion (versión modificada)
CREATE TRIGGER before_cotizacion_update
BEFORE UPDATE ON Cotizacion
FOR EACH ROW
BEGIN
    -- Solo calcular si cambió el descuento o el IVA
    IF NEW.descuento <> OLD.descuento OR NEW.iva <> OLD.iva THEN
        -- Recalcular el total basado en el subtotal existente
        SET NEW.total = (NEW.subtotal - (NEW.subtotal * COALESCE(NEW.descuento, 0) / 100)) * 
                        (1 + COALESCE(NEW.iva, 0) / 100);
    END IF;
END //

DELIMITER ;




USE OpticaDB;
select * from Historialclinico;
select * from ExamenVista; 
select * from Receta;