-- phpMyAdmin SQL Dump
-- version 4.0.10deb1ubuntu0.1
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 26-05-2023 a las 10:21:12
-- Versión del servidor: 5.5.62-0ubuntu0.14.04.1-log
-- Versión de PHP: 5.5.9-1ubuntu4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `StaffNet`
--
CREATE DATABASE IF NOT EXISTS `StaffNet` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `StaffNet`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `disciplinary_actions`
--

CREATE TABLE IF NOT EXISTS `disciplinary_actions` (
  `cedula` int(11) NOT NULL,
  `falta` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_sancion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sancion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero_faltas` int(11) DEFAULT NULL,
  PRIMARY KEY (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `disciplinary_actions`
--

INSERT INTO `disciplinary_actions` (`cedula`, `falta`, `tipo_sancion`, `sancion`, `numero_faltas`) VALUES
(1000065648, 'grande', 'diminuta', 'Mas pequeña que la de arriba2', 1);

--
-- Disparadores `disciplinary_actions`
--
DROP TRIGGER IF EXISTS `disciplinary_actions_BU`;
DELIMITER //
CREATE TRIGGER `disciplinary_actions_BU` AFTER UPDATE ON `disciplinary_actions`
 FOR EACH ROW BEGIN
    DECLARE current_trx_id VARCHAR(18);
    
    IF NEW.falta <> OLD.falta OR NEW.tipo_sancion <> OLD.tipo_sancion OR NEW.sancion <> OLD.sancion THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'falta', OLD.falta),
               (current_trx_id, OLD.cedula, 'tipo_sancion', OLD.tipo_sancion),
               (current_trx_id, OLD.cedula, 'sancion', OLD.sancion);
    END IF;
END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `educational_information`
--

CREATE TABLE IF NOT EXISTS `educational_information` (
  `cedula` int(11) NOT NULL,
  `nivel_escolaridad` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profesion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estudios_en_curso` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `educational_information`
--

INSERT INTO `educational_information` (`cedula`, `nivel_escolaridad`, `profesion`, `estudios_en_curso`) VALUES
(1000065648, 'Primari', 'estudiante', 'no');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `employment_information`
--

CREATE TABLE IF NOT EXISTS `employment_information` (
  `cedula` int(11) NOT NULL,
  `fecha_afiliacion_eps` date DEFAULT NULL,
  `eps` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pension` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `caja_compensacion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cesantias` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cambio_eps_pension_fecha` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cuenta_nomina` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  `sede` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cargo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gerencia` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `campana_general` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area_negocio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_contrato` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `salario` int(11) DEFAULT NULL,
  `subsidio_transporte` int(11) DEFAULT NULL,
  `fecha_cambio_campana_periodo_prueba` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `employment_information`
--

INSERT INTO `employment_information` (`cedula`, `fecha_afiliacion_eps`, `eps`, `pension`, `caja_compensacion`, `cesantias`, `cambio_eps_pension_fecha`, `cuenta_nomina`, `fecha_ingreso`, `sede`, `cargo`, `gerencia`, `campana_general`, `area_negocio`, `tipo_contrato`, `salario`, `subsidio_transporte`, `fecha_cambio_campana_periodo_prueba`) VALUES
(1000065648, '2023-05-27', '12', '21', '21', '21', '21', '21', '2023-05-27', '12', '21', '21', '21', '21', '21', 2, 2, '21');

--
-- Disparadores `employment_information`
--
DROP TRIGGER IF EXISTS `employment_information_BU`;
DELIMITER //
CREATE TRIGGER `employment_information_BU` AFTER UPDATE ON `employment_information`
 FOR EACH ROW BEGIN
    DECLARE current_trx_id VARCHAR(18);
    IF NEW.fecha_afiliacion_eps <> OLD.fecha_afiliacion_eps THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'fecha_afiliacion_eps', OLD.fecha_afiliacion_eps);
    END IF;

    IF NEW.eps <> OLD.eps THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'eps', OLD.eps);
    END IF;

    IF NEW.pension <> OLD.pension THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'pension', OLD.pension);
    END IF;

    IF NEW.caja_compensacion <> OLD.caja_compensacion THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'caja_compensacion', OLD.caja_compensacion);
    END IF;
    
    IF NEW.cesantias <> OLD.cesantias THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'cesantias', OLD.cesantias);
    END IF;

    IF NEW.cuenta_nomina <> OLD.cuenta_nomina THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'cuenta_nomina', OLD.cuenta_nomina);
    END IF;

    IF NEW.fecha_ingreso <> OLD.fecha_ingreso THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'fecha_ingreso', OLD.fecha_ingreso);
    END IF;

    IF NEW.sede <> OLD.sede THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'sede', OLD.sede);
    END IF;

    IF NEW.cargo <> OLD.cargo THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'cargo', OLD.cargo);
    END IF;

    IF NEW.gerencia <> OLD.gerencia THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'gerencia', OLD.gerencia);
    END IF;

    IF NEW.campana_general <> OLD.campana_general THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'campana_general', OLD.campana_general);
    END IF;

    IF NEW.tipo_contrato <> OLD.tipo_contrato THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'tipo_contrato', OLD.tipo_contrato);
    END IF;

    IF NEW.salario <> OLD.salario THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'salario', OLD.salario);
    END IF;

    IF NEW.subsidio_transporte <> OLD.subsidio_transporte THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'subsidio_transporte', OLD.subsidio_transporte);
    END IF;

    IF NEW.fecha_ingreso <> OLD.fecha_ingreso THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'fecha_ingreso', OLD.fecha_ingreso);
    END IF;
END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historical`
--

CREATE TABLE IF NOT EXISTS `historical` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_transaccion` varchar(18) NOT NULL,
  `cedula` int(11) NOT NULL,
  `columna` varchar(100) NOT NULL,
  `valor_antiguo` varchar(255) NOT NULL,
  `fecha_cambio` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=82 ;

--
-- Volcado de datos para la tabla `historical`
--

INSERT INTO `historical` (`id`, `id_transaccion`, `cedula`, `columna`, `valor_antiguo`, `fecha_cambio`) VALUES
(15, '1913D9DF7', 1000065648, 'celular', 'quiroga', '2023-05-23 17:25:02'),
(17, '1913DAC6F', 1000065648, 'celular', '32000000', '2023-05-23 17:26:04'),
(19, '19145D8F5', 1000065648, 'Barrio', 'quiroga', '2023-05-23 20:10:55'),
(21, '19145D8F5', 1000065648, 'celular', '3111111111', '2023-05-23 20:10:55'),
(23, '19145D8F5', 1000065648, 'direccion', 'no me la se', '2023-05-23 20:10:55'),
(25, '19145D8F5', 1000065648, 'correo', 'heibert.mogollon@gmail.com', '2023-05-23 20:10:55'),
(27, '191460651', 1000065648, 'falta', 'grandisima', '2023-05-23 20:16:53'),
(29, '191460651', 1000065648, 'tipo_sancion', 'grave', '2023-05-23 20:16:53'),
(31, '191460651', 1000065648, 'sancion', 'Multa', '2023-05-23 20:16:53'),
(33, '19146A5CE', 1000065648, 'falta', 'pequena', '2023-05-23 20:32:41'),
(35, '19146A5CE', 1000065648, 'tipo_sancion', 'diminuta', '2023-05-23 20:32:41'),
(37, '19146A5CE', 1000065648, 'sancion', 'feo', '2023-05-23 20:32:41'),
(39, '19146AA69', 1000065648, 'falta', 'grande', '2023-05-23 20:33:22'),
(41, '19146AA69', 1000065648, 'tipo_sancion', 'diminuta', '2023-05-23 20:33:22'),
(43, '19146AA69', 1000065648, 'sancion', 'Mas pequeña que la de arriba''', '2023-05-23 20:33:22'),
(45, '1916A64AB', 1000065648, 'sede', '', '2023-05-24 21:33:25'),
(47, '1916A6977', 1000065648, 'eps', '1', '2023-05-24 21:34:12'),
(49, '1916A6977', 1000065648, 'pension', '1', '2023-05-24 21:34:12'),
(51, '1916A6977', 1000065648, 'caja_compensacion', '1', '2023-05-24 21:34:12'),
(53, '1916A6977', 1000065648, 'cesantias', '1', '2023-05-24 21:34:12'),
(55, '1916A6977', 1000065648, 'cuenta_nomina', '1', '2023-05-24 21:34:12'),
(57, '1916A6977', 1000065648, 'sede', '1', '2023-05-24 21:34:12'),
(59, '1916A6977', 1000065648, 'cargo', '1', '2023-05-24 21:34:12'),
(61, '1916A6977', 1000065648, 'gerencia', '1', '2023-05-24 21:34:12'),
(63, '1916A6977', 1000065648, 'campana_general', '1', '2023-05-24 21:34:12'),
(65, '1916A6977', 1000065648, 'tipo_contrato', '1', '2023-05-24 21:34:12'),
(67, '1916A6977', 1000065648, 'salario', '1', '2023-05-24 21:34:12'),
(69, '1916A6977', 1000065648, 'subsidio_transporte', '1', '2023-05-24 21:34:12'),
(71, '1916A9B75', 1000065648, 'fecha_afiliacion_eps', '2023-05-01', '2023-05-24 21:40:38'),
(73, '1916A9B75', 1000065648, 'fecha_ingreso', '2023-05-10', '2023-05-24 21:40:38'),
(75, '1916A9B75', 1000065648, 'fecha_ingreso', '2023-05-10', '2023-05-24 21:40:38'),
(77, '1917094CA', 1000065648, 'calificacion', '50', '2023-05-25 13:42:21'),
(79, '19171968A', 1000065648, 'calificacion', '500', '2023-05-25 14:13:13'),
(81, '19171968A', 1000065648, 'fecha', '2023-05-25 08:42:09', '2023-05-25 14:13:13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `leave_information`
--

CREATE TABLE IF NOT EXISTS `leave_information` (
  `cedula` int(11) NOT NULL,
  `fecha_retiro` date DEFAULT NULL,
  `tipo_de_retiro` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motivo_de_retiro` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` tinyint(1) NOT NULL,
  PRIMARY KEY (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `performance_evaluation`
--

CREATE TABLE IF NOT EXISTS `performance_evaluation` (
  `cedula` int(11) NOT NULL,
  `calificacion` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `performance_evaluation`
--

INSERT INTO `performance_evaluation` (`cedula`, `calificacion`, `fecha`) VALUES
(1000065648, 500, '2023-05-26 13:42:09');

--
-- Disparadores `performance_evaluation`
--
DROP TRIGGER IF EXISTS `performance_evaluation_BU`;
DELIMITER //
CREATE TRIGGER `performance_evaluation_BU` AFTER UPDATE ON `performance_evaluation`
 FOR EACH ROW BEGIN
    DECLARE current_trx_id VARCHAR(18);
    IF NEW.calificacion <> OLD.calificacion OR NEW.fecha <> OLD.fecha THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'calificacion', OLD.calificacion),
		(current_trx_id, OLD.cedula, 'fecha', OLD.fecha);
    END IF;
END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_information`
--

CREATE TABLE IF NOT EXISTS `personal_information` (
  `cedula` int(11) NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_documento` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rh` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado_civil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hijos` int(11) DEFAULT NULL,
  `personas_a_cargo` int(11) DEFAULT NULL,
  `estrato` int(11) DEFAULT NULL,
  `tel_fijo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `celular` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo_corporativo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `barrio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contacto_emergencia` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parentesco` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tel_contacto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`cedula`),
  KEY `cedula` (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `personal_information`
--

INSERT INTO `personal_information` (`cedula`, `nombre`, `tipo_documento`, `fecha_nacimiento`, `genero`, `rh`, `estado_civil`, `hijos`, `personas_a_cargo`, `estrato`, `tel_fijo`, `celular`, `correo`, `correo_corporativo`, `direccion`, `barrio`, `contacto_emergencia`, `parentesco`, `tel_contacto`) VALUES
(1000065648, 'Heibert', '', '2003-03-30', 'Hombre', 'O+', 'Concubinato', 2, 4, 3, NULL, '444444', 'hsmogollon', 'aprendizsena@cyc.bpo.com', 'ahora si la se', 'quiroga2', 'ALicia', 'abuela', '3103980309');

--
-- Disparadores `personal_information`
--
DROP TRIGGER IF EXISTS `personal_information_BU`;
DELIMITER //
CREATE TRIGGER `personal_information_BU` AFTER UPDATE ON `personal_information`
 FOR EACH ROW BEGIN
    DECLARE current_trx_id VARCHAR(18);
    IF NEW.barrio <> OLD.barrio THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'Barrio', OLD.barrio);
    END IF;
	
	IF NEW.celular <> OLD.celular THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'celular', OLD.celular);
    END IF;

    IF NEW.direccion <> OLD.direccion THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'direccion', OLD.direccion);
    END IF;

    IF NEW.correo <> OLD.correo THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'correo', OLD.correo);
    END IF;
END
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `permission_consult` tinyint(1) NOT NULL,
  `permission_create` tinyint(1) NOT NULL,
  `permission_edit` tinyint(1) NOT NULL,
  `permission_disable` tinyint(1) NOT NULL,
  `permission_create_admins` tinyint(1) NOT NULL DEFAULT '0',
  `session_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vacation_information`
--

CREATE TABLE IF NOT EXISTS `vacation_information` (
  `cedula` int(11) NOT NULL,
  `licencia_no_remunerada` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_salida_vacaciones` date DEFAULT NULL,
  `fecha_ingreso_vacaciones` date DEFAULT NULL,
  `dias_utilizados` int(11) NOT NULL,
  PRIMARY KEY (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `vacation_information`
--

INSERT INTO `vacation_information` (`cedula`, `licencia_no_remunerada`, `fecha_salida_vacaciones`, `fecha_ingreso_vacaciones`, `dias_utilizados`) VALUES
(1000065648, '1', '2023-05-01', '2023-05-25', 5);

--
-- Disparadores `vacation_information`
--
DROP TRIGGER IF EXISTS `vacation_information_BU`;
DELIMITER //
CREATE TRIGGER `vacation_information_BU` AFTER UPDATE ON `vacation_information`
 FOR EACH ROW BEGIN
    DECLARE current_trx_id VARCHAR(18);
    IF NEW.fecha_salida_vacaciones <> OLD.fecha_salida_vacaciones THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'fecha_salida_vacaciones', OLD.fecha_salida_vacaciones);
    END IF;

    IF NEW.fecha_ingreso_vacaciones <> OLD.fecha_ingreso_vacaciones THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'fecha_ingreso_vacaciones', OLD.fecha_ingreso_vacaciones);
    END IF;

    IF NEW.dias_utilizados <> OLD.dias_utilizados THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'dias_utilizados', OLD.dias_utilizados);
    END IF;
END
//
DELIMITER ;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `disciplinary_actions`
--
ALTER TABLE `disciplinary_actions`
  ADD CONSTRAINT `disciplinary_actions_ibfk_1` FOREIGN KEY (`cedula`) REFERENCES `personal_information` (`cedula`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `educational_information`
--
ALTER TABLE `educational_information`
  ADD CONSTRAINT `educational_information_ibfk_1` FOREIGN KEY (`cedula`) REFERENCES `personal_information` (`cedula`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `employment_information`
--
ALTER TABLE `employment_information`
  ADD CONSTRAINT `employment_information_ibfk_1` FOREIGN KEY (`cedula`) REFERENCES `personal_information` (`cedula`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `leave_information`
--
ALTER TABLE `leave_information`
  ADD CONSTRAINT `leave_information_ibfk_1` FOREIGN KEY (`cedula`) REFERENCES `personal_information` (`cedula`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `performance_evaluation`
--
ALTER TABLE `performance_evaluation`
  ADD CONSTRAINT `performance_evaluation_ibfk_1` FOREIGN KEY (`cedula`) REFERENCES `personal_information` (`cedula`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `vacation_information`
--
ALTER TABLE `vacation_information`
  ADD CONSTRAINT `vacation_information_ibfk_1` FOREIGN KEY (`cedula`) REFERENCES `personal_information` (`cedula`) ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
