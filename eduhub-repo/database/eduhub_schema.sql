-- ============================================================
--  EDUHUB PLATFORM — Script de Base de Datos
--  Motor: MySQL 8.0 / MariaDB
--  Temas cubiertos: CREATE TABLE, SELECT con JOIN,
--                   Procedimientos Almacenados (DELIMITER),
--                   Funciones (FUNCTION)
--  Materia: Base de Datos · Avance Semana 1
-- ============================================================

DROP DATABASE IF EXISTS eduhub_db;
CREATE DATABASE eduhub_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE eduhub_db;

-- ============================================================
-- 1. TABLAS
-- ============================================================

CREATE TABLE usuarios (
    id           INT           AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(100)  NOT NULL,
    email        VARCHAR(150)  NOT NULL UNIQUE,
    password     VARCHAR(255)  NOT NULL,
    rol          ENUM('estudiante', 'docente', 'admin') NOT NULL DEFAULT 'estudiante',
    activo       BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE proyectos (
    id           INT           AUTO_INCREMENT PRIMARY KEY,
    docente_id   INT           NOT NULL,
    titulo       VARCHAR(200)  NOT NULL,
    descripcion  TEXT,
    fecha_inicio DATE          NOT NULL,
    fecha_limite DATE          NOT NULL,
    estado       ENUM('activo', 'pausado', 'finalizado') NOT NULL DEFAULT 'activo',
    created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_proyecto_docente
        FOREIGN KEY (docente_id) REFERENCES usuarios(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE proyecto_estudiantes (
    proyecto_id   INT  NOT NULL,
    usuario_id    INT  NOT NULL,
    fecha_ingreso DATE NOT NULL DEFAULT (CURRENT_DATE),
    PRIMARY KEY (proyecto_id, usuario_id),
    CONSTRAINT fk_pe_proyecto FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
    CONSTRAINT fk_pe_usuario  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id)  ON DELETE CASCADE
);

CREATE TABLE tareas (
    id           INT           AUTO_INCREMENT PRIMARY KEY,
    proyecto_id  INT           NOT NULL,
    asignado_a   INT           NOT NULL,
    titulo       VARCHAR(200)  NOT NULL,
    descripcion  TEXT,
    prioridad    ENUM('baja', 'media', 'alta') NOT NULL DEFAULT 'media',
    completada   BOOLEAN       NOT NULL DEFAULT FALSE,
    fecha_limite DATE          NOT NULL,
    created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tarea_proyecto FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
    CONSTRAINT fk_tarea_usuario  FOREIGN KEY (asignado_a)  REFERENCES usuarios(id)  ON DELETE RESTRICT
);

CREATE TABLE evaluaciones (
    id           INT            AUTO_INCREMENT PRIMARY KEY,
    proyecto_id  INT            NOT NULL,
    docente_id   INT            NOT NULL,
    calificacion DECIMAL(4, 2)  NOT NULL CHECK (calificacion BETWEEN 0 AND 10),
    comentarios  TEXT,
    fecha        TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_eval_proyecto FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
    CONSTRAINT fk_eval_docente  FOREIGN KEY (docente_id)  REFERENCES usuarios(id)  ON DELETE RESTRICT
);

-- ============================================================
-- 2. DATOS DE PRUEBA
-- ============================================================

INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Admin Sistema',       'admin@eduhub.com',     'hash_admin',  'admin'),
('Prof. María García',  'mgarcia@eduhub.com',   'hash_prof1',  'docente'),
('Prof. Carlos Ruiz',   'cruiz@eduhub.com',     'hash_prof2',  'docente'),
('Ana López',           'alopez@eduhub.com',    'hash_est1',   'estudiante'),
('Juan Martínez',       'jmartinez@eduhub.com', 'hash_est2',   'estudiante'),
('Sofía Torres',        'storres@eduhub.com',   'hash_est3',   'estudiante'),
('Pedro Sánchez',       'psanchez@eduhub.com',  'hash_est4',   'estudiante'),
('Laura Vega',          'lvega@eduhub.com',     'hash_est5',   'estudiante');

INSERT INTO proyectos (docente_id, titulo, descripcion, fecha_inicio, fecha_limite, estado) VALUES
(2, 'Análisis de Algoritmos',  'Complejidad computacional y estructuras de datos.', '2026-02-01', '2026-03-15', 'activo'),
(2, 'Diseño de BD Relacional', 'Modelado ER, normalización y consultas avanzadas.', '2026-02-10', '2026-04-01', 'activo'),
(3, 'App Móvil React Native',  'Aplicación móvil multiplataforma.',                 '2026-02-15', '2026-04-20', 'pausado'),
(3, 'API REST con Node.js',    'Backend con autenticación JWT.',                    '2026-01-10', '2026-02-10', 'finalizado');

INSERT INTO proyecto_estudiantes (proyecto_id, usuario_id, fecha_ingreso) VALUES
(1,4,'2026-02-01'),(1,5,'2026-02-01'),
(2,4,'2026-02-10'),(2,6,'2026-02-10'),(2,7,'2026-02-10'),
(3,5,'2026-02-15'),(3,6,'2026-02-15'),(3,7,'2026-02-15'),(3,8,'2026-02-15'),
(4,4,'2026-01-10'),(4,8,'2026-01-10');

INSERT INTO tareas (proyecto_id, asignado_a, titulo, prioridad, completada, fecha_limite) VALUES
(1,4,'Análisis de complejidad Big-O',   'alta',  FALSE,'2026-03-05'),
(1,5,'Implementar QuickSort en Java',   'alta',  FALSE,'2026-03-08'),
(2,4,'Modelado Entidad-Relación',       'alta',  TRUE, '2026-02-25'),
(2,6,'Normalización hasta 3FN',         'media', FALSE,'2026-03-10'),
(2,7,'Conexión a MongoDB Atlas',        'baja',  FALSE,'2026-03-18'),
(3,5,'Diseño de pantallas en Figma',    'media', FALSE,'2026-03-25'),
(4,4,'Endpoints de autenticación JWT',  'alta',  TRUE, '2026-02-08'),
(4,8,'Documentación con Swagger',       'media', TRUE, '2026-02-09');

INSERT INTO evaluaciones (proyecto_id, docente_id, calificacion, comentarios) VALUES
(4,3,8.50,'Buena implementación. Mejorar documentación.'),
(4,3,9.00,'Documentación completa y clara.'),
(1,2,7.50,'Buen análisis, falta profundidad en casos borde.');

-- ============================================================
-- 3. CONSULTAS CON JOIN
-- ============================================================

-- JOIN 1: Proyectos con nombre del docente
SELECT
    p.id,
    p.titulo            AS proyecto,
    p.estado,
    p.fecha_limite,
    u.nombre            AS docente,
    u.email             AS email_docente
FROM proyectos p
INNER JOIN usuarios u ON u.id = p.docente_id
ORDER BY p.fecha_limite ASC;

-- JOIN 2: Tareas con estudiante y proyecto
SELECT
    t.id,
    t.titulo            AS tarea,
    t.prioridad,
    t.completada,
    t.fecha_limite,
    u.nombre            AS estudiante,
    p.titulo            AS proyecto
FROM tareas t
INNER JOIN usuarios  u ON u.id = t.asignado_a
INNER JOIN proyectos p ON p.id = t.proyecto_id
ORDER BY t.fecha_limite ASC;

-- JOIN 3: Estudiantes inscritos en cada proyecto
SELECT
    p.titulo            AS proyecto,
    p.estado,
    u.nombre            AS estudiante,
    u.email,
    pe.fecha_ingreso
FROM proyecto_estudiantes pe
INNER JOIN proyectos p ON p.id = pe.proyecto_id
INNER JOIN usuarios  u ON u.id = pe.usuario_id
ORDER BY p.titulo, u.nombre;

-- JOIN 4: Tareas pendientes de proyectos activos (LEFT JOIN)
SELECT
    p.titulo            AS proyecto,
    p.fecha_limite      AS limite_proyecto,
    t.titulo            AS tarea,
    t.prioridad,
    u.nombre            AS asignado_a
FROM proyectos p
LEFT JOIN tareas   t ON t.proyecto_id = p.id AND t.completada = FALSE
LEFT JOIN usuarios u ON u.id = t.asignado_a
WHERE p.estado = 'activo'
ORDER BY p.titulo, t.prioridad DESC;

-- JOIN 5: Evaluaciones con proyecto y docente evaluador
SELECT
    p.titulo            AS proyecto,
    u.nombre            AS docente,
    e.calificacion,
    e.comentarios,
    e.fecha
FROM evaluaciones e
INNER JOIN proyectos p ON p.id = e.proyecto_id
INNER JOIN usuarios  u ON u.id = e.docente_id
ORDER BY e.calificacion DESC;

-- JOIN 6: Resumen por proyecto (conteo de estudiantes y tareas)
SELECT
    p.titulo                            AS proyecto,
    p.estado,
    u.nombre                            AS docente,
    COUNT(DISTINCT pe.usuario_id)       AS total_estudiantes,
    COUNT(DISTINCT t.id)                AS total_tareas,
    SUM(t.completada)                   AS tareas_completadas
FROM proyectos p
INNER JOIN usuarios            u  ON u.id  = p.docente_id
LEFT  JOIN proyecto_estudiantes pe ON pe.proyecto_id = p.id
LEFT  JOIN tareas               t  ON t.proyecto_id  = p.id
GROUP BY p.id, p.titulo, p.estado, u.nombre
ORDER BY p.id;

-- JOIN 7: Estudiantes con tareas vencidas
SELECT
    u.nombre            AS estudiante,
    u.email,
    t.titulo            AS tarea_vencida,
    t.fecha_limite,
    p.titulo            AS proyecto
FROM tareas t
INNER JOIN usuarios  u ON u.id = t.asignado_a
INNER JOIN proyectos p ON p.id = t.proyecto_id
WHERE t.completada = FALSE
  AND t.fecha_limite < CURRENT_DATE
ORDER BY t.fecha_limite ASC;

-- ============================================================
-- 4. PROCEDIMIENTOS ALMACENADOS (DELIMITER)
-- ============================================================

-- Procedimiento 1: Registrar usuario con validación de email duplicado
DELIMITER $$
CREATE PROCEDURE sp_registrar_usuario(
    IN  p_nombre    VARCHAR(100),
    IN  p_email     VARCHAR(150),
    IN  p_password  VARCHAR(255),
    IN  p_rol       VARCHAR(20),
    OUT p_resultado VARCHAR(200)
)
BEGIN
    DECLARE email_existe INT DEFAULT 0;
    SELECT COUNT(*) INTO email_existe FROM usuarios WHERE email = p_email;
    IF email_existe > 0 THEN
        SET p_resultado = 'ERROR: El correo ya está registrado.';
    ELSE
        INSERT INTO usuarios (nombre, email, password, rol) VALUES (p_nombre, p_email, p_password, p_rol);
        SET p_resultado = CONCAT('OK: Usuario creado con ID ', LAST_INSERT_ID());
    END IF;
END$$
DELIMITER ;

-- Procedimiento 2: Ver progreso completo de un proyecto
DELIMITER $$
CREATE PROCEDURE sp_progreso_proyecto(IN p_proyecto_id INT)
BEGIN
    DECLARE v_total       INT          DEFAULT 0;
    DECLARE v_completadas INT          DEFAULT 0;
    DECLARE v_porcentaje  DECIMAL(5,2) DEFAULT 0.00;

    SELECT COUNT(*), IFNULL(SUM(completada),0)
    INTO v_total, v_completadas
    FROM tareas WHERE proyecto_id = p_proyecto_id;

    IF v_total > 0 THEN
        SET v_porcentaje = ROUND((v_completadas / v_total) * 100, 2);
    END IF;

    -- Resumen del proyecto
    SELECT p.titulo, p.estado, p.fecha_limite, u.nombre AS docente,
           v_total AS total_tareas, v_completadas AS completadas, v_porcentaje AS avance_pct
    FROM proyectos p
    INNER JOIN usuarios u ON u.id = p.docente_id
    WHERE p.id = p_proyecto_id;

    -- Detalle de tareas
    SELECT t.titulo, t.prioridad,
           IF(t.completada,'Sí','No') AS completada,
           t.fecha_limite,
           u.nombre AS asignado_a
    FROM tareas t
    INNER JOIN usuarios u ON u.id = t.asignado_a
    WHERE t.proyecto_id = p_proyecto_id
    ORDER BY t.completada ASC, t.prioridad DESC;
END$$
DELIMITER ;

-- Procedimiento 3: Asignar estudiante a proyecto con validaciones
DELIMITER $$
CREATE PROCEDURE sp_asignar_estudiante(
    IN  p_proyecto_id INT,
    IN  p_usuario_id  INT,
    OUT p_resultado   VARCHAR(200)
)
BEGIN
    DECLARE v_es_est   INT DEFAULT 0;
    DECLARE v_activo   INT DEFAULT 0;
    DECLARE v_asignado INT DEFAULT 0;

    SELECT COUNT(*) INTO v_es_est   FROM usuarios WHERE id = p_usuario_id AND rol = 'estudiante';
    SELECT COUNT(*) INTO v_activo   FROM proyectos WHERE id = p_proyecto_id AND estado = 'activo';
    SELECT COUNT(*) INTO v_asignado FROM proyecto_estudiantes WHERE proyecto_id = p_proyecto_id AND usuario_id = p_usuario_id;

    IF v_es_est = 0 THEN
        SET p_resultado = 'ERROR: El usuario no existe o no es estudiante.';
    ELSEIF v_activo = 0 THEN
        SET p_resultado = 'ERROR: El proyecto no existe o no está activo.';
    ELSEIF v_asignado > 0 THEN
        SET p_resultado = 'ERROR: El estudiante ya está en este proyecto.';
    ELSE
        INSERT INTO proyecto_estudiantes (proyecto_id, usuario_id) VALUES (p_proyecto_id, p_usuario_id);
        SET p_resultado = 'OK: Estudiante asignado correctamente.';
    END IF;
END$$
DELIMITER ;

-- Procedimiento 4: Reporte de evaluaciones de un docente
DELIMITER $$
CREATE PROCEDURE sp_reporte_docente(IN p_docente_id INT)
BEGIN
    DECLARE v_es_docente INT DEFAULT 0;
    SELECT COUNT(*) INTO v_es_docente FROM usuarios WHERE id = p_docente_id AND rol IN ('docente','admin');

    IF v_es_docente = 0 THEN
        SELECT 'ERROR: El usuario no es docente.' AS mensaje;
    ELSE
        SELECT p.titulo AS proyecto, p.estado, e.calificacion, e.comentarios, e.fecha
        FROM evaluaciones e
        INNER JOIN proyectos p ON p.id = e.proyecto_id
        WHERE e.docente_id = p_docente_id
        ORDER BY e.fecha DESC;
    END IF;
END$$
DELIMITER ;

-- ============================================================
-- 5. FUNCIONES (FUNCTION)
-- ============================================================

-- Función 1: Porcentaje de avance de un proyecto
DELIMITER $$
CREATE FUNCTION fn_porcentaje_avance(p_proyecto_id INT)
RETURNS DECIMAL(5,2)
DETERMINISTIC READS SQL DATA
BEGIN
    DECLARE v_total INT DEFAULT 0;
    DECLARE v_comp  INT DEFAULT 0;
    SELECT COUNT(*), IFNULL(SUM(completada),0) INTO v_total, v_comp FROM tareas WHERE proyecto_id = p_proyecto_id;
    IF v_total = 0 THEN RETURN 0.00; END IF;
    RETURN ROUND((v_comp / v_total) * 100, 2);
END$$
DELIMITER ;

-- Función 2: Estado legible de una tarea
DELIMITER $$
CREATE FUNCTION fn_estado_tarea(p_tarea_id INT)
RETURNS VARCHAR(25)
DETERMINISTIC READS SQL DATA
BEGIN
    DECLARE v_comp  BOOLEAN;
    DECLARE v_limit DATE;
    SELECT completada, fecha_limite INTO v_comp, v_limit FROM tareas WHERE id = p_tarea_id;
    IF v_comp = TRUE THEN RETURN 'Completada'; END IF;
    IF DATEDIFF(v_limit, CURRENT_DATE) < 0  THEN RETURN 'Vencida'; END IF;
    IF DATEDIFF(v_limit, CURRENT_DATE) <= 3 THEN RETURN 'Próxima a vencer'; END IF;
    RETURN 'En tiempo';
END$$
DELIMITER ;

-- Función 3: Promedio de calificaciones de un proyecto
DELIMITER $$
CREATE FUNCTION fn_promedio_proyecto(p_proyecto_id INT)
RETURNS DECIMAL(4,2)
DETERMINISTIC READS SQL DATA
BEGIN
    DECLARE v_prom DECIMAL(4,2) DEFAULT 0.00;
    SELECT ROUND(AVG(calificacion),2) INTO v_prom FROM evaluaciones WHERE proyecto_id = p_proyecto_id;
    RETURN IFNULL(v_prom, 0.00);
END$$
DELIMITER ;

-- Función 4: Contar tareas pendientes de un estudiante
DELIMITER $$
CREATE FUNCTION fn_tareas_pendientes(p_usuario_id INT)
RETURNS INT
DETERMINISTIC READS SQL DATA
BEGIN
    DECLARE v_cnt INT DEFAULT 0;
    SELECT COUNT(*) INTO v_cnt FROM tareas WHERE asignado_a = p_usuario_id AND completada = FALSE;
    RETURN v_cnt;
END$$
DELIMITER ;

-- ============================================================
-- 6. PRUEBAS FINALES
-- ============================================================

-- Funciones dentro de SELECT con JOIN
SELECT
    p.titulo                        AS proyecto,
    u.nombre                        AS docente,
    p.estado,
    fn_porcentaje_avance(p.id)      AS avance_pct,
    fn_promedio_proyecto(p.id)      AS calificacion_promedio
FROM proyectos p
INNER JOIN usuarios u ON u.id = p.docente_id
ORDER BY avance_pct DESC;

-- Estado de cada tarea
SELECT
    t.titulo                        AS tarea,
    t.fecha_limite,
    u.nombre                        AS estudiante,
    fn_estado_tarea(t.id)           AS estado_actual
FROM tareas t
INNER JOIN usuarios u ON u.id = t.asignado_a
ORDER BY t.fecha_limite ASC;

-- Tareas pendientes por estudiante
SELECT
    u.nombre                        AS estudiante,
    fn_tareas_pendientes(u.id)      AS tareas_pendientes
FROM usuarios u WHERE u.rol = 'estudiante'
ORDER BY tareas_pendientes DESC;

-- Ejecutar procedimientos
CALL sp_progreso_proyecto(1);
CALL sp_progreso_proyecto(2);

CALL sp_registrar_usuario('Carlos Mendoza','cmendoza@eduhub.com','hash_c','estudiante',@res);
SELECT @res AS resultado;

CALL sp_registrar_usuario('Duplicado','alopez@eduhub.com','hash_x','estudiante',@res);
SELECT @res AS resultado;

CALL sp_asignar_estudiante(1, 6, @res);
SELECT @res AS resultado;

CALL sp_reporte_docente(2);
