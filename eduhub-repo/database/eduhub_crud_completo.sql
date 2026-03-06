-- ============================================================
--  EDUHUB PLATFORM -- Base de Datos Fisica Completa
--  Primer Parcial -- Bases de Datos II -- Konrad Lorenz 2026
--
--  IDs por tabla:
--    usuarios        -> id_usuario
--    proyectos       -> id_proyecto  / id_docente
--    proyecto_est.   -> id_proyecto  / id_estudiante
--    tareas          -> id_tarea     / id_proyecto / id_estudiante
--    evaluaciones    -> id_evaluacion/ id_proyecto / id_docente
--
--  COMO EJECUTAR EN MYSQL WORKBENCH:
--  1. Cierra cualquier conexion anterior y abre una nueva
--  2. Selecciona TODO el texto (Ctrl+A)
--  3. Ejecuta con Ctrl+Shift+Enter (ejecutar script completo)
--  4. NO uses el rayo amarillo (ejecuta por bloques y falla)
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
    id_usuario   INT           AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(100)  NOT NULL,
    apellido     VARCHAR(100)  NOT NULL,
    email        VARCHAR(150)  NOT NULL UNIQUE,
    password     VARCHAR(255)  NOT NULL,
    rol          ENUM('estudiante','docente','admin') NOT NULL DEFAULT 'estudiante',
    activo       BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE proyectos (
    id_proyecto  INT           AUTO_INCREMENT PRIMARY KEY,
    id_docente   INT           NOT NULL,
    titulo       VARCHAR(200)  NOT NULL,
    descripcion  TEXT,
    fecha_inicio DATE          NOT NULL,
    fecha_limite DATE          NOT NULL,
    estado       ENUM('activo','pausado','finalizado') NOT NULL DEFAULT 'activo',
    created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_proyecto_docente
        FOREIGN KEY (id_docente) REFERENCES usuarios(id_usuario)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE proyecto_estudiantes (
    id_proyecto   INT  NOT NULL,
    id_estudiante INT  NOT NULL,
    fecha_ingreso DATE NOT NULL,
    PRIMARY KEY (id_proyecto, id_estudiante),
    CONSTRAINT fk_pe_proyecto
        FOREIGN KEY (id_proyecto)   REFERENCES proyectos(id_proyecto)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_pe_estudiante
        FOREIGN KEY (id_estudiante) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tareas (
    id_tarea      INT           AUTO_INCREMENT PRIMARY KEY,
    id_proyecto   INT           NOT NULL,
    id_estudiante INT           NOT NULL,
    titulo        VARCHAR(200)  NOT NULL,
    descripcion   TEXT,
    prioridad     ENUM('baja','media','alta') NOT NULL DEFAULT 'media',
    completada    BOOLEAN       NOT NULL DEFAULT FALSE,
    fecha_limite  DATE          NOT NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tarea_proyecto
        FOREIGN KEY (id_proyecto)   REFERENCES proyectos(id_proyecto)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_tarea_estudiante
        FOREIGN KEY (id_estudiante) REFERENCES usuarios(id_usuario)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE evaluaciones (
    id_evaluacion INT           AUTO_INCREMENT PRIMARY KEY,
    id_proyecto   INT           NOT NULL,
    id_docente    INT           NOT NULL,
    calificacion  DECIMAL(4,2)  NOT NULL CHECK (calificacion BETWEEN 0.00 AND 10.00),
    comentarios   TEXT,
    fecha         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_eval_proyecto
        FOREIGN KEY (id_proyecto) REFERENCES proyectos(id_proyecto)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_eval_docente
        FOREIGN KEY (id_docente)  REFERENCES usuarios(id_usuario)
        ON DELETE RESTRICT ON UPDATE CASCADE
);


-- ============================================================
-- 2. DATOS DE PRUEBA
-- id_usuario: 1=admin  2=docente  3=docente  4-8=estudiantes
-- ============================================================

INSERT INTO usuarios (nombre, apellido, email, password, rol) VALUES
('Admin',  'Sistema',  'admin@eduhub.com',     'hash_admin',  'admin'),
('Maria',  'Garcia',   'mgarcia@eduhub.com',   'hash_prof1',  'docente'),
('Carlos', 'Ruiz',     'cruiz@eduhub.com',      'hash_prof2',  'docente'),
('Ana',    'Lopez',    'alopez@eduhub.com',    'hash_est1',   'estudiante'),
('Juan',   'Martinez', 'jmartinez@eduhub.com', 'hash_est2',   'estudiante'),
('Sofia',  'Torres',   'storres@eduhub.com',   'hash_est3',   'estudiante'),
('Pedro',  'Sanchez',  'psanchez@eduhub.com',  'hash_est4',   'estudiante'),
('Laura',  'Vega',     'lvega@eduhub.com',     'hash_est5',   'estudiante');

-- id_proyecto: 1-4
INSERT INTO proyectos (id_docente, titulo, descripcion, fecha_inicio, fecha_limite, estado) VALUES
(2, 'Analisis de Algoritmos',  'Complejidad computacional y estructuras de datos.', '2026-02-01', '2026-03-15', 'activo'),
(2, 'Diseno de BD Relacional', 'Modelado ER, normalizacion y consultas avanzadas.', '2026-02-10', '2026-04-01', 'activo'),
(3, 'App Movil React Native',  'Aplicacion movil multiplataforma.',                 '2026-02-15', '2026-04-20', 'pausado'),
(3, 'API REST con Node.js',    'Backend seguro con autenticacion JWT.',             '2026-01-10', '2026-02-10', 'finalizado');

INSERT INTO proyecto_estudiantes (id_proyecto, id_estudiante, fecha_ingreso) VALUES
(1,4,'2026-02-01'),(1,5,'2026-02-01'),
(2,4,'2026-02-10'),(2,6,'2026-02-10'),(2,7,'2026-02-10'),
(3,5,'2026-02-15'),(3,6,'2026-02-15'),(3,7,'2026-02-15'),(3,8,'2026-02-15'),
(4,4,'2026-01-10'),(4,8,'2026-01-10');

-- id_tarea: 1-8
INSERT INTO tareas (id_proyecto, id_estudiante, titulo, prioridad, completada, fecha_limite) VALUES
(1,4,'Analisis de complejidad Big-O',  'alta', FALSE,'2026-03-05'),
(1,5,'Implementar QuickSort en Java',  'alta', FALSE,'2026-03-08'),
(2,4,'Modelado Entidad-Relacion',      'alta', TRUE, '2026-02-25'),
(2,6,'Normalizacion hasta 3FN',        'media',FALSE,'2026-03-10'),
(2,7,'Conexion a MongoDB Atlas',       'baja', FALSE,'2026-03-18'),
(3,5,'Diseno de pantallas en Figma',   'media',FALSE,'2026-03-25'),
(4,4,'Endpoints de autenticacion JWT', 'alta', TRUE, '2026-02-08'),
(4,8,'Documentacion con Swagger',      'media',TRUE, '2026-02-09');

-- id_evaluacion: 1-3
INSERT INTO evaluaciones (id_proyecto, id_docente, calificacion, comentarios) VALUES
(4,3,8.50,'Buena implementacion. Mejorar documentacion.'),
(4,3,9.00,'Documentacion completa y clara.'),
(1,2,7.50,'Buen analisis, falta profundidad en casos borde.');

-- ============================================================
-- 3. CRUD -- TABLA usuarios  (PK: id_usuario)
-- ============================================================

-- CREATE: nuevo estudiante (id_usuario se genera solo = 9)
INSERT INTO usuarios (nombre, apellido, email, password, rol)
VALUES ('Diego', 'Ramirez', 'dramirez@eduhub.com', 'hash_diego', 'estudiante');

-- READ 1: listar todos con id_usuario
SELECT id_usuario, nombre, apellido, email, rol, activo
FROM usuarios ORDER BY rol, apellido;

-- READ 2: solo estudiantes activos
SELECT id_usuario, nombre, apellido, email
FROM usuarios WHERE rol = 'estudiante' AND activo = TRUE ORDER BY apellido;

-- READ 3: buscar por id_usuario = 4
SELECT id_usuario, nombre, apellido, email, rol
FROM usuarios WHERE id_usuario = 4;

-- READ 4: buscar por email
SELECT id_usuario, nombre, rol
FROM usuarios WHERE email = 'alopez@eduhub.com';

-- UPDATE 1: actualizar nombre del id_usuario = 4
UPDATE usuarios
SET nombre = 'Ana Maria', apellido = 'Lopez Vega'
WHERE id_usuario = 4;

-- UPDATE 2: desactivar id_usuario = 9 (baja logica)
UPDATE usuarios SET activo = FALSE WHERE id_usuario = 9;

-- DELETE: eliminar id_usuario = 9
DELETE FROM usuarios WHERE id_usuario = 9 AND activo = FALSE;

-- ============================================================
-- 4. CRUD -- TABLA proyectos  (PK: id_proyecto | FK: id_docente)
-- ============================================================

-- CREATE: nuevo proyecto del id_docente = 2 (id_proyecto = 5)
INSERT INTO proyectos (id_docente, titulo, descripcion, fecha_inicio, fecha_limite, estado)
VALUES (2, 'Machine Learning Basico', 'Intro a modelos supervisados.', '2026-03-01', '2026-05-30', 'activo');

-- READ 1: todos los proyectos con id_docente y nombre
SELECT
    p.id_proyecto,
    p.titulo,
    p.estado,
    p.fecha_limite,
    p.id_docente,
    u.nombre   AS nombre_docente,
    u.apellido AS apellido_docente
FROM proyectos p
INNER JOIN usuarios u ON u.id_usuario = p.id_docente
ORDER BY p.fecha_limite ASC;

-- READ 2: proyecto especifico id_proyecto = 1
SELECT p.id_proyecto, p.titulo, p.descripcion, p.estado, p.fecha_limite,
       p.id_docente, u.nombre AS docente
FROM proyectos p
INNER JOIN usuarios u ON u.id_usuario = p.id_docente
WHERE p.id_proyecto = 1;

-- READ 3: proyectos activos con total de estudiantes
SELECT p.id_proyecto, p.titulo, COUNT(pe.id_estudiante) AS total_estudiantes
FROM proyectos p
LEFT JOIN proyecto_estudiantes pe ON pe.id_proyecto = p.id_proyecto
WHERE p.estado = 'activo'
GROUP BY p.id_proyecto, p.titulo ORDER BY total_estudiantes DESC;

-- READ 4: proyectos de un docente especifico id_docente = 2
SELECT id_proyecto, titulo, estado, fecha_limite
FROM proyectos WHERE id_docente = 2 ORDER BY fecha_limite;

-- UPDATE 1: cambiar estado del id_proyecto = 5
UPDATE proyectos SET estado = 'pausado' WHERE id_proyecto = 5;

-- UPDATE 2: reasignar id_proyecto = 5 a id_docente = 3
UPDATE proyectos SET id_docente = 3 WHERE id_proyecto = 5;

-- DELETE: eliminar id_proyecto = 5 (CASCADE borra tareas e inscripciones)
DELETE FROM proyectos WHERE id_proyecto = 5;

-- ============================================================
-- 5. CRUD -- TABLA proyecto_estudiantes
--    PK compuesta: id_proyecto + id_estudiante
-- ============================================================

-- CREATE: inscribir id_estudiante = 8 en id_proyecto = 1
INSERT INTO proyecto_estudiantes (id_proyecto, id_estudiante, fecha_ingreso)
VALUES (1, 8, '2026-03-01');

-- READ 1: estudiantes del id_proyecto = 1
SELECT
    pe.id_proyecto,
    p.titulo        AS proyecto,
    pe.id_estudiante,
    u.nombre        AS nombre_estudiante,
    u.apellido      AS apellido_estudiante,
    u.email,
    pe.fecha_ingreso
FROM proyecto_estudiantes pe
INNER JOIN proyectos p ON p.id_proyecto = pe.id_proyecto
INNER JOIN usuarios  u ON u.id_usuario  = pe.id_estudiante
WHERE pe.id_proyecto = 1 ORDER BY u.apellido;

-- READ 2: proyectos en los que esta el id_estudiante = 4
SELECT
    pe.id_estudiante,
    u.nombre AS estudiante,
    pe.id_proyecto,
    p.titulo AS proyecto,
    p.estado,
    pe.fecha_ingreso
FROM proyecto_estudiantes pe
INNER JOIN proyectos p ON p.id_proyecto = pe.id_proyecto
INNER JOIN usuarios  u ON u.id_usuario  = pe.id_estudiante
WHERE pe.id_estudiante = 4;

-- READ 3: todas las inscripciones en proyectos activos
SELECT pe.id_proyecto, p.titulo AS proyecto,
       pe.id_estudiante, u.nombre AS estudiante, pe.fecha_ingreso
FROM proyecto_estudiantes pe
INNER JOIN proyectos p ON p.id_proyecto = pe.id_proyecto
INNER JOIN usuarios  u ON u.id_usuario  = pe.id_estudiante
WHERE p.estado = 'activo' ORDER BY p.titulo, u.apellido;

-- UPDATE: cambiar fecha de ingreso
UPDATE proyecto_estudiantes
SET fecha_ingreso = '2026-02-20'
WHERE id_proyecto = 1 AND id_estudiante = 8;

-- DELETE: desvincular id_estudiante = 8 de id_proyecto = 1
DELETE FROM proyecto_estudiantes
WHERE id_proyecto = 1 AND id_estudiante = 8;

-- ============================================================
-- 6. CRUD -- TABLA tareas
--    PK: id_tarea | FK: id_proyecto, id_estudiante
-- ============================================================

-- CREATE: nueva tarea para id_estudiante = 5 en id_proyecto = 1 (id_tarea = 9)
INSERT INTO tareas (id_proyecto, id_estudiante, titulo, descripcion, prioridad, fecha_limite)
VALUES (1, 5, 'Caso de uso Merge Sort', 'Analizar y codificar Merge Sort.', 'media', '2026-03-12');

-- READ 1: todas con id_tarea, id_estudiante, id_proyecto y nombres
SELECT
    t.id_tarea,
    t.titulo        AS tarea,
    t.prioridad,
    IF(t.completada,'Si','No') AS completada,
    t.fecha_limite,
    t.id_estudiante,
    u.nombre        AS nombre_estudiante,
    u.apellido      AS apellido_estudiante,
    t.id_proyecto,
    p.titulo        AS proyecto
FROM tareas t
INNER JOIN usuarios  u ON u.id_usuario  = t.id_estudiante
INNER JOIN proyectos p ON p.id_proyecto = t.id_proyecto
ORDER BY t.fecha_limite ASC;

-- READ 2: tareas pendientes del id_estudiante = 4
SELECT t.id_tarea, t.titulo, t.prioridad, t.fecha_limite,
       t.id_proyecto, p.titulo AS proyecto
FROM tareas t
INNER JOIN proyectos p ON p.id_proyecto = t.id_proyecto
WHERE t.id_estudiante = 4 AND t.completada = FALSE
ORDER BY t.fecha_limite ASC;

-- READ 3: tareas del id_proyecto = 2
SELECT t.id_tarea, t.titulo, t.prioridad,
       IF(t.completada,'Si','No') AS completada,
       t.fecha_limite, t.id_estudiante, u.nombre AS estudiante
FROM tareas t
INNER JOIN usuarios u ON u.id_usuario = t.id_estudiante
WHERE t.id_proyecto = 2 ORDER BY t.prioridad DESC;

-- READ 4: tareas vencidas y no completadas
SELECT t.id_tarea, t.titulo, t.fecha_limite,
       t.id_estudiante, u.nombre AS estudiante,
       t.id_proyecto,  p.titulo AS proyecto,
       DATEDIFF(CURRENT_DATE, t.fecha_limite) AS dias_vencida
FROM tareas t
INNER JOIN usuarios  u ON u.id_usuario  = t.id_estudiante
INNER JOIN proyectos p ON p.id_proyecto = t.id_proyecto
WHERE t.completada = FALSE AND t.fecha_limite < CURRENT_DATE
ORDER BY t.fecha_limite ASC;

-- UPDATE 1: marcar id_tarea = 1 como completada
UPDATE tareas SET completada = TRUE WHERE id_tarea = 1;

-- UPDATE 2: cambiar prioridad y fecha del id_tarea = 9
UPDATE tareas SET prioridad = 'alta', fecha_limite = '2026-03-10'
WHERE id_tarea = 9;

-- UPDATE 3: reasignar id_tarea = 9 a id_estudiante = 6
UPDATE tareas SET id_estudiante = 6 WHERE id_tarea = 9;

-- DELETE: eliminar id_tarea = 9
DELETE FROM tareas WHERE id_tarea = 9;

-- ============================================================
-- 7. CRUD -- TABLA evaluaciones
--    PK: id_evaluacion | FK: id_proyecto, id_docente
-- ============================================================

-- CREATE: nueva evaluacion del id_docente = 2 al id_proyecto = 2 (id_evaluacion = 4)
INSERT INTO evaluaciones (id_proyecto, id_docente, calificacion, comentarios)
VALUES (2, 2, 9.50, 'Excelente diseno relacional. Normalizacion perfecta.');

-- READ 1: todas con id_evaluacion, id_proyecto, id_docente y nombres
SELECT
    e.id_evaluacion,
    e.id_proyecto,
    p.titulo        AS proyecto,
    e.id_docente,
    u.nombre        AS nombre_docente,
    u.apellido      AS apellido_docente,
    e.calificacion,
    e.comentarios,
    e.fecha
FROM evaluaciones e
INNER JOIN proyectos p ON p.id_proyecto = e.id_proyecto
INNER JOIN usuarios  u ON u.id_usuario  = e.id_docente
ORDER BY e.fecha DESC;

-- READ 2: evaluaciones del id_proyecto = 4
SELECT e.id_evaluacion, e.calificacion, e.comentarios, e.fecha,
       e.id_docente, u.nombre AS docente
FROM evaluaciones e
INNER JOIN usuarios u ON u.id_usuario = e.id_docente
WHERE e.id_proyecto = 4 ORDER BY e.fecha DESC;

-- READ 3: promedio por proyecto
SELECT p.id_proyecto, p.titulo,
       COUNT(e.id_evaluacion)       AS num_evaluaciones,
       ROUND(AVG(e.calificacion),2) AS promedio,
       MAX(e.calificacion)          AS nota_maxima,
       MIN(e.calificacion)          AS nota_minima
FROM proyectos p
INNER JOIN evaluaciones e ON e.id_proyecto = p.id_proyecto
GROUP BY p.id_proyecto, p.titulo ORDER BY promedio DESC;

-- READ 4: evaluaciones del id_docente = 2
SELECT e.id_evaluacion, e.id_proyecto, p.titulo AS proyecto,
       e.calificacion, e.comentarios, e.fecha
FROM evaluaciones e
INNER JOIN proyectos p ON p.id_proyecto = e.id_proyecto
WHERE e.id_docente = 2 ORDER BY e.fecha DESC;

-- UPDATE 1: corregir nota del id_evaluacion = 1
UPDATE evaluaciones
SET calificacion = 8.75, comentarios = 'Revision aplicada: mejor documentacion.'
WHERE id_evaluacion = 1;

-- UPDATE 2: ajustar id_evaluacion = 3
UPDATE evaluaciones
SET calificacion = 8.00, comentarios = 'Excelente sustentacion oral.'
WHERE id_evaluacion = 3;

-- DELETE: eliminar id_evaluacion = 4
DELETE FROM evaluaciones WHERE id_evaluacion = 4;

-- ============================================================
-- 8. PROCEDIMIENTOS ALMACENADOS (5)
-- ============================================================

DELIMITER $$

CREATE PROCEDURE sp_registrar_usuario(
    IN  p_nombre    VARCHAR(100),
    IN  p_apellido  VARCHAR(100),
    IN  p_email     VARCHAR(150),
    IN  p_password  VARCHAR(255),
    IN  p_rol       VARCHAR(20),
    OUT p_resultado VARCHAR(200)
)
BEGIN
    DECLARE email_existe INT DEFAULT 0;
    SELECT COUNT(*) INTO email_existe FROM usuarios WHERE email = p_email;
    IF email_existe > 0 THEN
        SET p_resultado = 'ERROR: El correo ya esta registrado.';
    ELSE
        INSERT INTO usuarios (nombre, apellido, email, password, rol)
        VALUES (p_nombre, p_apellido, p_email, p_password, p_rol);
        SET p_resultado = CONCAT('OK: id_usuario = ', LAST_INSERT_ID());
    END IF;
END$$

CREATE PROCEDURE sp_progreso_proyecto(IN p_id_proyecto INT)
BEGIN
    DECLARE v_total       INT          DEFAULT 0;
    DECLARE v_completadas INT          DEFAULT 0;
    DECLARE v_porcentaje  DECIMAL(5,2) DEFAULT 0.00;

    SELECT COUNT(*), IFNULL(SUM(completada),0)
    INTO v_total, v_completadas
    FROM tareas WHERE id_proyecto = p_id_proyecto;

    IF v_total > 0 THEN
        SET v_porcentaje = ROUND((v_completadas / v_total) * 100, 2);
    END IF;

    SELECT p.id_proyecto, p.titulo, p.estado, p.fecha_limite,
           p.id_docente, u.nombre AS docente,
           v_total AS total_tareas, v_completadas AS completadas,
           v_porcentaje AS avance_pct
    FROM proyectos p
    INNER JOIN usuarios u ON u.id_usuario = p.id_docente
    WHERE p.id_proyecto = p_id_proyecto;

    SELECT t.id_tarea, t.titulo, t.prioridad,
           IF(t.completada,'Si','No') AS completada,
           t.fecha_limite, t.id_estudiante, u.nombre AS estudiante
    FROM tareas t
    INNER JOIN usuarios u ON u.id_usuario = t.id_estudiante
    WHERE t.id_proyecto = p_id_proyecto
    ORDER BY t.completada ASC, t.prioridad DESC;
END$$

CREATE PROCEDURE sp_asignar_estudiante(
    IN  p_id_proyecto   INT,
    IN  p_id_estudiante INT,
    OUT p_resultado     VARCHAR(200)
)
BEGIN
    DECLARE v_es_est   INT DEFAULT 0;
    DECLARE v_activo   INT DEFAULT 0;
    DECLARE v_asignado INT DEFAULT 0;

    SELECT COUNT(*) INTO v_es_est
    FROM usuarios WHERE id_usuario = p_id_estudiante AND rol = 'estudiante';

    SELECT COUNT(*) INTO v_activo
    FROM proyectos WHERE id_proyecto = p_id_proyecto AND estado = 'activo';

    SELECT COUNT(*) INTO v_asignado
    FROM proyecto_estudiantes
    WHERE id_proyecto = p_id_proyecto AND id_estudiante = p_id_estudiante;

    IF v_es_est = 0 THEN
        SET p_resultado = 'ERROR: id_estudiante no existe o no es estudiante.';
    ELSEIF v_activo = 0 THEN
        SET p_resultado = 'ERROR: id_proyecto no existe o no esta activo.';
    ELSEIF v_asignado > 0 THEN
        SET p_resultado = 'ERROR: El estudiante ya esta inscrito en este proyecto.';
    ELSE
        INSERT INTO proyecto_estudiantes (id_proyecto, id_estudiante, fecha_ingreso)
        VALUES (p_id_proyecto, p_id_estudiante, CURRENT_DATE);
        SET p_resultado = CONCAT('OK: id_estudiante=', p_id_estudiante,
                                 ' asignado a id_proyecto=', p_id_proyecto);
    END IF;
END$$

CREATE PROCEDURE sp_reporte_docente(IN p_id_docente INT)
BEGIN
    DECLARE v_es_doc INT DEFAULT 0;

    SELECT COUNT(*) INTO v_es_doc
    FROM usuarios WHERE id_usuario = p_id_docente AND rol IN ('docente','admin');

    IF v_es_doc = 0 THEN
        SELECT 'ERROR: id_docente no existe o no tiene rol docente.' AS mensaje;
    ELSE
        SELECT e.id_evaluacion, e.id_proyecto, p.titulo AS proyecto,
               e.calificacion, e.comentarios, e.fecha
        FROM evaluaciones e
        INNER JOIN proyectos p ON p.id_proyecto = e.id_proyecto
        WHERE e.id_docente = p_id_docente
        ORDER BY e.fecha DESC;
    END IF;
END$$

CREATE PROCEDURE sp_tareas_por_vencer(IN p_dias INT)
BEGIN
    DECLARE v_fecha_limite DATE;
    SET v_fecha_limite = DATE_ADD(CURRENT_DATE, INTERVAL p_dias DAY);

    SELECT t.id_tarea, t.titulo AS tarea, t.prioridad, t.fecha_limite,
           DATEDIFF(t.fecha_limite, CURRENT_DATE) AS dias_restantes,
           t.id_estudiante,
           u.nombre   AS nombre_estudiante,
           u.apellido AS apellido_estudiante,
           u.email,
           t.id_proyecto,
           p.titulo   AS proyecto
    FROM tareas t
    INNER JOIN usuarios  u ON u.id_usuario  = t.id_estudiante
    INNER JOIN proyectos p ON p.id_proyecto = t.id_proyecto
    WHERE t.completada = FALSE
      AND t.fecha_limite BETWEEN CURRENT_DATE AND v_fecha_limite
    ORDER BY t.fecha_limite ASC;
END$$

-- ============================================================
-- 9. FUNCIONES (5)
-- ============================================================

CREATE FUNCTION fn_porcentaje_avance(p_id_proyecto INT)
RETURNS DECIMAL(5,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_total INT DEFAULT 0;
    DECLARE v_comp  INT DEFAULT 0;
    SELECT COUNT(*), IFNULL(SUM(completada),0)
    INTO v_total, v_comp
    FROM tareas WHERE id_proyecto = p_id_proyecto;
    IF v_total = 0 THEN RETURN 0.00; END IF;
    RETURN ROUND((v_comp / v_total) * 100, 2);
END$$

CREATE FUNCTION fn_estado_tarea(p_id_tarea INT)
RETURNS VARCHAR(25)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_comp  BOOLEAN;
    DECLARE v_limit DATE;
    SELECT completada, fecha_limite
    INTO v_comp, v_limit
    FROM tareas WHERE id_tarea = p_id_tarea;
    IF v_comp = TRUE THEN
        RETURN 'Completada';
    ELSEIF DATEDIFF(v_limit, CURRENT_DATE) < 0 THEN
        RETURN 'Vencida';
    ELSEIF DATEDIFF(v_limit, CURRENT_DATE) <= 3 THEN
        RETURN 'Proxima a vencer';
    ELSE
        RETURN 'En tiempo';
    END IF;
END$$

CREATE FUNCTION fn_promedio_proyecto(p_id_proyecto INT)
RETURNS DECIMAL(4,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_prom DECIMAL(4,2) DEFAULT 0.00;
    SELECT ROUND(AVG(calificacion),2) INTO v_prom
    FROM evaluaciones WHERE id_proyecto = p_id_proyecto;
    RETURN IFNULL(v_prom, 0.00);
END$$

CREATE FUNCTION fn_tareas_pendientes(p_id_estudiante INT)
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_cnt INT DEFAULT 0;
    SELECT COUNT(*) INTO v_cnt
    FROM tareas WHERE id_estudiante = p_id_estudiante AND completada = FALSE;
    RETURN v_cnt;
END$$

CREATE FUNCTION fn_dias_restantes(p_id_proyecto INT)
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_limite DATE;
    DECLARE v_estado VARCHAR(20);
    SELECT fecha_limite, estado
    INTO v_limite, v_estado
    FROM proyectos WHERE id_proyecto = p_id_proyecto;
    IF v_estado = 'finalizado' THEN RETURN 0; END IF;
    RETURN DATEDIFF(v_limite, CURRENT_DATE);
END$$

DELIMITER ;

-- ============================================================
-- 10. PRUEBAS FINALES
-- ============================================================

-- Reporte ejecutivo con las 5 funciones + JOIN
SELECT
    p.id_proyecto,
    p.titulo                             AS proyecto,
    p.estado,
    p.id_docente,
    u.nombre                             AS docente,
    COUNT(DISTINCT pe.id_estudiante)     AS estudiantes,
    COUNT(DISTINCT t.id_tarea)           AS total_tareas,
    fn_porcentaje_avance(p.id_proyecto)  AS avance_pct,
    fn_promedio_proyecto(p.id_proyecto)  AS calificacion_prom,
    fn_dias_restantes(p.id_proyecto)     AS dias_restantes
FROM proyectos p
INNER JOIN usuarios             u  ON u.id_usuario   = p.id_docente
LEFT  JOIN proyecto_estudiantes pe ON pe.id_proyecto = p.id_proyecto
LEFT  JOIN tareas               t  ON t.id_proyecto  = p.id_proyecto
GROUP BY p.id_proyecto, p.titulo, p.estado, p.id_docente, u.nombre
ORDER BY avance_pct DESC;

-- Estado de cada tarea con fn_estado_tarea
SELECT t.id_tarea, t.titulo, t.fecha_limite,
       t.id_estudiante, u.nombre AS estudiante,
       fn_estado_tarea(t.id_tarea) AS estado_actual
FROM tareas t
INNER JOIN usuarios u ON u.id_usuario = t.id_estudiante
ORDER BY t.fecha_limite;

-- Tareas pendientes por estudiante con fn_tareas_pendientes
SELECT u.id_usuario AS id_estudiante, u.nombre, u.apellido,
       fn_tareas_pendientes(u.id_usuario) AS tareas_pendientes
FROM usuarios u
WHERE u.rol = 'estudiante' AND u.activo = TRUE
ORDER BY tareas_pendientes DESC;

-- Probar procedimientos
CALL sp_progreso_proyecto(1);
CALL sp_progreso_proyecto(2);

CALL sp_registrar_usuario('Luis','Perez','lperez@eduhub.com','hash_lp','estudiante',@res);
SELECT @res AS resultado;

CALL sp_registrar_usuario('Dup','X','alopez@eduhub.com','hash_x','estudiante',@res);
SELECT @res AS resultado_duplicado;

CALL sp_asignar_estudiante(1, 6, @res);
SELECT @res AS resultado;

CALL sp_asignar_estudiante(1, 4, @res);
SELECT @res AS resultado_ya_inscrito;

CALL sp_reporte_docente(2);
CALL sp_reporte_docente(4);

CALL sp_tareas_por_vencer(7);
CALL sp_tareas_por_vencer(30);
