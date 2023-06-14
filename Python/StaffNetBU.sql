CREATE DATABASE  IF NOT EXISTS `StaffNet` /*!40100 DEFAULT CHARACTER SET latin1 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `StaffNet`;
-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 172.16.0.115    Database: StaffNet
-- ------------------------------------------------------
-- Server version	8.0.33-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `disciplinary_actions`
--

DROP TABLE IF EXISTS `disciplinary_actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `disciplinary_actions` (
  `cedula` int NOT NULL,
  `falta` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_sancion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sancion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_falta` date DEFAULT NULL,
  PRIMARY KEY (`cedula`),
  CONSTRAINT `disciplinary_actions_ibfk_1` FOREIGN KEY (`cedula`) REFERENCES `personal_information` (`cedula`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `disciplinary_actions_BU` AFTER UPDATE ON `disciplinary_actions` FOR EACH ROW BEGIN
    DECLARE current_trx_id VARCHAR(18);
    IF (old.falta IS NOT NULL AND NEW.falta <> OLD.falta) OR (old.falta IS NOT NULL AND NEW.tipo_sancion <> OLD.tipo_sancion) OR (old.sancion IS NOT NULL AND NEW.sancion <> OLD.sancion) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'falta', OLD.falta),
               (current_trx_id, OLD.cedula, 'tipo_sancion', OLD.tipo_sancion),
               (current_trx_id, OLD.cedula, 'sancion', OLD.sancion);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `educational_information`
--

DROP TABLE IF EXISTS `educational_information`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `educational_information` (
  `cedula` int NOT NULL,
  `nivel_escolaridad` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profesion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estudios_en_curso` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`cedula`),
  CONSTRAINT `educational_information_ibfk_1` FOREIGN KEY (`cedula`) REFERENCES `personal_information` (`cedula`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employment_information`
--

DROP TABLE IF EXISTS `employment_information`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employment_information` (
  `cedula` int NOT NULL,
  `fecha_afiliacion_eps` date DEFAULT NULL,
  `eps` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pension` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `caja_compensacion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cesantias` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cambio_eps_pension_fecha` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cuenta_nomina` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  `sede` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cargo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gerencia` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `campana_general` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area_negocio` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_contrato` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `salario` int DEFAULT NULL,
  `subsidio_transporte` int DEFAULT NULL,
  `fecha_cambio_campana_periodo_prueba` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`cedula`),
  CONSTRAINT `employment_information_ibfk_1` FOREIGN KEY (`cedula`) REFERENCES `personal_information` (`cedula`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `employment_information_BU` AFTER UPDATE ON `employment_information` FOR EACH ROW BEGIN
    DECLARE current_trx_id VARCHAR(18);
    IF (old.fecha_afiliacion_eps IS NOT NULL AND NEW.fecha_afiliacion_eps <> OLD.fecha_afiliacion_eps) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo, nuevo_valor)
        VALUES (current_trx_id, OLD.cedula, 'Fecha de afiliacion de la EPS', OLD.fecha_afiliacion_eps, NEW.fecha_afiliacion_eps);
    END IF;

    IF (old.eps IS NOT NULL AND NEW.eps <> OLD.eps) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo, nuevo_valor)
        VALUES (current_trx_id, OLD.cedula, 'EPS', OLD.eps, NEW.eps);
    END IF;

    IF (old.pension IS NOT NULL AND NEW.pension <> OLD.pension) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo, nuevo_valor)
        VALUES (current_trx_id, OLD.cedula, 'Pension', OLD.pension, NEW.pension);
    END IF;

    IF (old.caja_compensacion IS NOT NULL AND NEW.caja_compensacion <> OLD.caja_compensacion) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo, nuevo_valor)
        VALUES (current_trx_id, OLD.cedula, 'Caja de compensacion', OLD.caja_compensacion, NEW.caja_compensacion);
    END IF;
    
    IF (old.cesantias IS NOT NULL AND  NEW.cesantias <> OLD.cesantias) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo, nuevo_valor)
        VALUES (current_trx_id, OLD.cedula, 'Cesantias', OLD.cesantias, NEW.cesantias);
    END IF;

    IF (old.cuenta_nomina IS NOT NULL AND NEW.cuenta_nomina <> OLD.cuenta_nomina) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo, nuevo_valor)
        VALUES (current_trx_id, OLD.cedula, 'Cuenta de nomina', OLD.cuenta_nomina, NEW.cuenta_nomina);
    END IF;

    IF (old.fecha_ingreso IS NOT NULL AND NEW.fecha_ingreso <> OLD.fecha_ingreso) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo, nuevo_valor)
        VALUES (current_trx_id, OLD.cedula, 'Fecha de ingreso', OLD.fecha_ingreso, NEW.fecha_ingreso);
    END IF;

    IF (old.sede IS NOT NULL AND NEW.sede <> OLD.sede) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo, nuevo_valor)
        VALUES (current_trx_id, OLD.cedula, 'Sede', OLD.sede, NEW.sede);
    END IF;

    IF (old.cargo IS NOT NULL AND NEW.cargo <> OLD.cargo) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo, nuevo_valor)
        VALUES (current_trx_id, OLD.cedula, 'Cargo', OLD.cargo, NEW.cargo);
    END IF;

    IF (old.gerencia IS NOT NULL AND NEW.gerencia <> OLD.gerencia) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo, nuevo_valor)
        VALUES (current_trx_id, OLD.cedula, 'Gerencia', OLD.gerencia, NEW.gerencia);
    END IF;

    IF (old.campana_general IS NOT NULL AND NEW.campana_general <> OLD.campana_general) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo, nuevo_valor)
        VALUES (current_trx_id, OLD.cedula, 'Campaña general', OLD.campana_general, NEW.campana_general);
    END IF;

    IF (old.tipo_contrato IS NOT NULL AND NEW.tipo_contrato <> OLD.tipo_contrato) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo, nuevo_valor)
        VALUES (current_trx_id, OLD.cedula, 'Tipo de contrato', OLD.tipo_contrato, NEW.tipo_contrato);
    END IF;

    IF (old.salario IS NOT NULL AND NEW.salario <> OLD.salario) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo, nuevo_valor)
        VALUES (current_trx_id, OLD.cedula, 'Salario', OLD.salario, NEW.salario);
    END IF;

    IF (old.subsidio_transporte IS NOT NULL AND NEW.subsidio_transporte <> OLD.subsidio_transporte) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo, nuevo_valor)
        VALUES (current_trx_id, OLD.cedula, 'Subsidio de transporte', OLD.subsidio_transporte, NEW.subsidio_transporte);
    END IF;

    IF (old.fecha_ingreso IS NOT NULL AND NEW.fecha_ingreso <> OLD.fecha_ingreso) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo, nuevo_valor)
        VALUES (current_trx_id, OLD.cedula, 'Fecha de ingreso', OLD.fecha_ingreso, NEW.fecha_ingreso);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `historical`
--

DROP TABLE IF EXISTS `historical`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historical` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_transaccion` varchar(18) NOT NULL,
  `cedula` int NOT NULL,
  `columna` varchar(100) NOT NULL,
  `valor_antiguo` varchar(255) NOT NULL,
  `valor_nuevo` varchar(255) NOT NULL,
  `fecha_cambio` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3973 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `leave_information`
--

DROP TABLE IF EXISTS `leave_information`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_information` (
  `cedula` int NOT NULL,
  `fecha_retiro` date DEFAULT NULL,
  `tipo_retiro` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motivo_retiro` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` tinyint DEFAULT '1',
  PRIMARY KEY (`cedula`),
  CONSTRAINT `leave_information_ibfk_1` FOREIGN KEY (`cedula`) REFERENCES `personal_information` (`cedula`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `leave_information_BU` AFTER UPDATE ON `leave_information` FOR EACH ROW BEGIN
    DECLARE current_trx_id VARCHAR(18);
    IF (old.fecha_retiro IS NOT NULL AND NEW.fecha_retiro <> OLD.fecha_retiro) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo, nuevo_valor)
        VALUES (current_trx_id, OLD.cedula, 'Fecha de retiro', OLD.fecha_retiro, NEW.fecha_retiro);
    END IF;

    IF (old.tipo_retiro IS NOT NULL AND NEW.tipo_retiro <> OLD.tipo_retiro) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo, nuevo_valor)
        VALUES (current_trx_id, OLD.cedula, 'Tipo de retiro', OLD.tipo_retiro, NEW.tipo_retiro);
    END IF;

    IF (old.motivo_retiro IS NOT NULL AND NEW.motivo_retiro <> OLD.motivo_retiro) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo, nuevo_valor)
        VALUES (current_trx_id, OLD.cedula, 'Motivo de retiro', OLD.motivo_retiro, NEW.motivo_retiro);
    END IF;
    
    -- IF (old.estado IS NOT NULL AND NEW.estado = true) THEN
    --     UPDATE vacation_information SET licencia_no_remunerada = NULL, fecha_salida_vacaciones = NULL, fecha_ingreso_vacaciones = NULL, dias_utilizados = 0 WHERE cedula = NEW.cedula;
    -- END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `performance_evaluation`
--

DROP TABLE IF EXISTS `performance_evaluation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `performance_evaluation` (
  `cedula` int NOT NULL,
  `calificacion` int NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cedula`),
  CONSTRAINT `performance_evaluation_ibfk_1` FOREIGN KEY (`cedula`) REFERENCES `personal_information` (`cedula`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `performance_evaluation_BU` AFTER UPDATE ON `performance_evaluation` FOR EACH ROW BEGIN
    DECLARE current_trx_id VARCHAR(18);
    IF NEW.calificacion <> OLD.calificacion OR NEW.fecha <> OLD.fecha THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'calificacion', OLD.calificacion),
(current_trx_id, OLD.cedula, 'fecha', OLD.fecha);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `personal_information`
--

DROP TABLE IF EXISTS `personal_information`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_information` (
  `cedula` int NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_documento` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'CC',
  `fecha_nacimiento` date NOT NULL,
  `genero` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rh` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado_civil` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `hijos` int NOT NULL,
  `personas_a_cargo` int NOT NULL,
  `estrato` int DEFAULT NULL,
  `tel_fijo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `celular` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo_corporativo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `barrio` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contacto_emergencia` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parentesco` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tel_contacto` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_expedicion` datetime DEFAULT NULL,
  PRIMARY KEY (`cedula`),
  KEY `cedula` (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `personal_information_BU` AFTER UPDATE ON `personal_information` FOR EACH ROW BEGIN
    DECLARE current_trx_id VARCHAR(18);
    IF (old.barrio IS NOT NULL AND NEW.barrio <> OLD.barrio) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo, valor_nuevo)
        VALUES (current_trx_id, OLD.cedula, 'Barrio', OLD.barrio, NEW.barrio);
    END IF;

IF (old.celular IS NOT NULL AND NEW.celular <> OLD.celular) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo, valor_nuevo)
        VALUES (current_trx_id, OLD.cedula, 'Celular', OLD.celular, NEW.celular);
    END IF;

    IF (old.direccion IS NOT NULL AND NEW.direccion <> OLD.direccion) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo, valor_nuevo)
        VALUES (current_trx_id, OLD.cedula, 'Dirección', OLD.direccion, NEW.direccion);
    END IF;

    IF (old.correo IS NOT NULL AND NEW.correo <> OLD.correo) THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo, valor_nuevo)
        VALUES (current_trx_id, OLD.cedula, 'Correo', OLD.correo, NEW.correo);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` varchar(180) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `permission_consult` tinyint(1) NOT NULL,
  `permission_create` tinyint(1) NOT NULL,
  `permission_edit` tinyint(1) NOT NULL,
  `permission_disable` tinyint(1) NOT NULL,
  `permission_create_admins` tinyint(1) NOT NULL DEFAULT '0',
  `session_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vacation_information`
--

DROP TABLE IF EXISTS `vacation_information`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacation_information` (
  `cedula` int NOT NULL,
  `licencia_no_remunerada` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_salida_vacaciones` date DEFAULT NULL,
  `fecha_ingreso_vacaciones` date DEFAULT NULL,
  `dias_utilizados` int DEFAULT NULL,
  PRIMARY KEY (`cedula`),
  CONSTRAINT `vacation_information_ibfk_1` FOREIGN KEY (`cedula`) REFERENCES `personal_information` (`cedula`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `vacation_information_BU` AFTER UPDATE ON `vacation_information` FOR EACH ROW BEGIN
    DECLARE current_trx_id VARCHAR(18);
    IF NEW.licencia_no_remunerada <> OLD.licencia_no_remunerada OR NEW.licencia_no_remunerada IS NULL THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'licencia_no_remunerada', OLD.licencia_no_remunerada);
    END IF;
    
    IF NEW.fecha_salida_vacaciones <> OLD.fecha_salida_vacaciones OR NEW.fecha_salida_vacaciones IS NULL THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'fecha_salida_vacaciones', OLD.fecha_salida_vacaciones);
    END IF;

    IF NEW.fecha_ingreso_vacaciones <> OLD.fecha_ingreso_vacaciones OR NEW.fecha_ingreso_vacaciones IS NULL THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'fecha_ingreso_vacaciones', OLD.fecha_ingreso_vacaciones);
    END IF;

    IF NEW.dias_utilizados <> OLD.dias_utilizados THEN
        SELECT TRX_ID INTO current_trx_id FROM INFORMATION_SCHEMA.INNODB_TRX WHERE TRX_MYSQL_THREAD_ID = CONNECTION_ID();
        INSERT INTO historical (id_transaccion, cedula, columna, valor_antiguo)
        VALUES (current_trx_id, OLD.cedula, 'dias_utilizados', OLD.dias_utilizados);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Dumping events for database 'StaffNet'
--

--
-- Dumping routines for database 'StaffNet'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-14  9:01:04
