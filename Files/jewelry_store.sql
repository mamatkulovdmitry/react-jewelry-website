-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: jewelry_store
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `cart_data` json NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (10,8,'{}');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `amount` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('Placed','Confirmed','Being Prepared','On Hold','Handed Over for Delivery','In Transit','Delivered','Completed','Returned','Cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Placed',
  `payment_method` enum('COD','Online') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment` tinyint(1) DEFAULT '0',
  `products` json NOT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `delivery_method` enum('courier','pickup') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'courier',
  `shipping_address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (16,11,'317814','Cancelled','COD',0,'[{\"id\": 2, \"sex\": \"Для женщин\", \"name\": \"Кольцо из комбинированного золота с фианитами\", \"size\": \"18.5\", \"uuid\": \"9a9501d4-68f4-4968-a4d0-90f77b839857\", \"image\": \"[\\\"https://ucarecdn.com/efe00dca-6703-4d7e-a01d-303aec2897f9/\\\",\\\"https://ucarecdn.com/e40b2712-8025-453d-98a8-7fa4868225b2/\\\",\\\"https://ucarecdn.com/73d7f9b2-952c-4cbb-b7c3-a9f6ec42f70a/\\\"]\", \"price\": 80899, \"sizes\": [\"15\", \"15.5\", \"16\", \"16.5\", \"17\", \"17.5\", \"18\", \"18.5\", \"19\", \"19.5\", \"20\", \"20.5\", \"21\", \"21.5\", \"22\", \"22.5\", \"23\", \"23.5\", \"24\"], \"weight\": \"5.10\", \"category\": \"Кольца\", \"material\": \"Золото\", \"quantity\": 1, \"is_visible\": 1, \"description\": \"Объёмное кольцо из красного и белого золота 585 пробы с фианитами. Дизайн украшения в стиле современная классика. Сложная композиция из гладких и фактурных золотых лент создаёт эффект многослойности. Кольцо инкрустировано миниатюрными фианитами в виде дорожек и пятью более крупными. Закрепка камней выполнена вручную. Кольцо подойдёт для бизнес-гардероба, в качестве коктейльного или вечернего, для повседневного ношения.\", \"is_bestseller\": 1}, {\"id\": 12, \"sex\": \"Для женщин\", \"name\": \"Серьги «Павлины» с английским замком из красного золота с эмалью\", \"size\": \"no_size\", \"uuid\": \"ebd4a242-8ff2-411c-8cfc-790146815224\", \"image\": \"[\\\"https://ucarecdn.com/2a2b876a-59d1-4d6a-a562-7ef3c5103f34/\\\",\\\"https://ucarecdn.com/b326b4e5-ce06-46cd-ba8b-6571f30d4773/\\\",\\\"https://ucarecdn.com/1d07d821-673b-4b6e-a2bc-d8ff1ef38757/\\\",\\\"https://ucarecdn.com/adc20941-613d-43a0-bf85-63e90ea1a1ff/\\\"]\", \"price\": 47383, \"sizes\": [], \"weight\": \"3.00\", \"category\": \"Серьги\", \"material\": \"Золото\", \"quantity\": 5, \"is_visible\": 1, \"description\": \"Серьги «Павлины» с английским замком из красного золота 585 пробы с эмалью. Украшение выполнено в стиле анималистика. Павлин олицетворяет собой бессмертие. Родирование и эмалирование выполнены вручную.\", \"is_bestseller\": 0}]','2025-06-20 05:22:02','pickup','{\"firstName\":\"Иван\",\"lastName\":\"Иванов\",\"email\":\"testuser1@gmail.com\",\"street\":\"\",\"city\":\"\",\"state\":\"\",\"zipcode\":\"\",\"country\":\"\",\"phone\":\"+7 (922) 145-67-89\"}'),(17,11,'546222','In Transit','Online',1,'[{\"id\": 5, \"sex\": \"Для женщин\", \"name\": \"Серьги «Дикие орхидеи» с гранатом и аметистами\", \"size\": \"no_size\", \"uuid\": \"0ff52307-22e0-406e-8e04-f7e34e9489b0\", \"image\": \"[\\\"https://ucarecdn.com/5df38173-7f49-428e-919f-796ef44cf2d3/\\\",\\\"https://ucarecdn.com/9d08e073-8bce-4c89-9d9f-310f1ee78f90/\\\",\\\"https://ucarecdn.com/b7cfb059-1b36-4988-a633-0f1b6ef6e0fa/\\\",\\\"https://ucarecdn.com/259b50fc-9749-4144-a67c-dcbc4c57bf6b/\\\"]\", \"price\": 85056, \"sizes\": [], \"weight\": \"5.00\", \"category\": \"Серьги\", \"material\": \"Золото\", \"quantity\": 2, \"is_visible\": 1, \"description\": \"Серьги «Дикие орхидеи» из красного золота 585 пробы с гранатом и аметистами из коллекции «Большой замысел» от ювелирного бренда PLATINA. Дизайн украшения в стиле флористика. Образ цветка орхидеи симолизирует любовь и страсть. Покрытие лепестков черным родием придаёт колорит ювелирному образу и оттеняет блеск натуральных камней: граната родолита и сиреневых аметистов. Родирование и закрепка камней выполнены вручную. Серьги станут эффектным и ярким акцентом образа.\", \"is_bestseller\": 0}, {\"id\": 10, \"sex\": \"Для женщин\", \"name\": \"Браслет «Амфисбена» из красного золота\", \"size\": \"16.5\", \"uuid\": \"01fd59f0-cc83-47d0-9ea9-5f039e868b98\", \"image\": \"[\\\"https://ucarecdn.com/dd591688-8b70-4445-a1f1-d5173a819744/\\\",\\\"https://ucarecdn.com/a7abd6a3-d7e2-492e-b6a4-fcd871644aa6/\\\",\\\"https://ucarecdn.com/fcb240d9-7908-4f02-89f4-116a4d649faf/\\\"]\", \"price\": 125270, \"sizes\": [\"16\", \"16.5\", \"17\"], \"weight\": \"8.00\", \"category\": \"Браслеты\", \"material\": \"Золото\", \"quantity\": 3, \"is_visible\": 1, \"description\": \"Браслет «Амфисбена» из красного золота 585 пробы. Дизайн украшения в стиле анималистика. Образ двухголовой змеи символизирует гармонию и симметрию двух начал. Рельефный узор в точности повоторяет рисунок змеиной кожи, что придаёт ювелирному образу реалистичность. Браслет станет символичным и изысканным штрихом образа.\", \"is_bestseller\": 0}]','2025-06-20 05:22:59','courier','{\"firstName\":\"Иван\",\"lastName\":\"Иванов\",\"email\":\"testuser1@gmail.com\",\"street\":\"Репина, 15\",\"city\":\"Екатеринбург\",\"state\":\"Свердловская область\",\"zipcode\":\"620123\",\"country\":\"Россия\",\"phone\":\"+7 (922) 145-67-89\"}');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `material` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `weight` decimal(10,2) DEFAULT NULL,
  `sex` enum('Man','Woman','Kids') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sizes` json DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `is_bestseller` tinyint(1) DEFAULT '0',
  `is_visible` tinyint(1) NOT NULL DEFAULT '1',
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (2,'9a9501d4-68f4-4968-a4d0-90f77b839857','Кольцо из комбинированного золота с фианитами','Объёмное кольцо из красного и белого золота 585 пробы с фианитами. Дизайн украшения в стиле современная классика. Сложная композиция из гладких и фактурных золотых лент создаёт эффект многослойности. Кольцо инкрустировано миниатюрными фианитами в виде дорожек и пятью более крупными. Закрепка камней выполнена вручную. Кольцо подойдёт для бизнес-гардероба, в качестве коктейльного или вечернего, для повседневного ношения.','Кольца','Золото',5.10,'Woman','[\"15\", \"15.5\", \"16\", \"16.5\", \"17\", \"17.5\", \"18\", \"18.5\", \"19\", \"19.5\", \"20\", \"20.5\", \"21\", \"21.5\", \"22\", \"22.5\", \"23\", \"23.5\", \"24\"]',80899.00,1,1,'[\"https://ucarecdn.com/efe00dca-6703-4d7e-a01d-303aec2897f9/\",\"https://ucarecdn.com/e40b2712-8025-453d-98a8-7fa4868225b2/\",\"https://ucarecdn.com/73d7f9b2-952c-4cbb-b7c3-a9f6ec42f70a/\"]'),(3,'eba91f56-fa19-4ac0-9fd2-20e9142723ae','Кольцо из комбинированного золота с бриллиантами','Интересное и эффектное кольцо из красного и белого золота 585 пробы с бриллиантами. Дизайн украшения в стиле современная классика, геометрия и флористика. Удвоенная шинка придаёт объём украшению. В центре композиции объёмный абстрактный цветок, один лепесток которого инкрустирован натуральными бриллиантами. Закрепка камней выполнена вручную. Кольцо подойдёт для коктейльных и праздничных мероприятий, а также к деловому и повседневному гардеробу.','Кольца','Золото',3.00,'Woman','[\"15\", \"15.5\", \"16\", \"16.5\", \"17\", \"17.5\", \"18\", \"18.5\", \"19\", \"19.5\", \"20\", \"20.5\", \"21\", \"21.5\", \"22\", \"22.5\", \"23\", \"23.5\", \"24\"]',77714.00,0,1,'[\"https://ucarecdn.com/b23ac96f-c9be-4065-889c-aa91e244649b/\",\"https://ucarecdn.com/c6eb3ac3-0a3f-45e7-9135-2a4aedfeca89/\",\"https://ucarecdn.com/48b2fb7a-bf14-431c-8062-ff9c777728cb/\",\"https://ucarecdn.com/8f963c49-4487-46df-a895-f50624489d71/\"]'),(5,'0ff52307-22e0-406e-8e04-f7e34e9489b0','Серьги «Дикие орхидеи» с гранатом и аметистами','Серьги «Дикие орхидеи» из красного золота 585 пробы с гранатом и аметистами из коллекции «Большой замысел» от ювелирного бренда PLATINA. Дизайн украшения в стиле флористика. Образ цветка орхидеи симолизирует любовь и страсть. Покрытие лепестков черным родием придаёт колорит ювелирному образу и оттеняет блеск натуральных камней: граната родолита и сиреневых аметистов. Родирование и закрепка камней выполнены вручную. Серьги станут эффектным и ярким акцентом образа.','Серьги','Золото',5.00,'Woman','[]',85056.00,0,1,'[\"https://ucarecdn.com/5df38173-7f49-428e-919f-796ef44cf2d3/\",\"https://ucarecdn.com/9d08e073-8bce-4c89-9d9f-310f1ee78f90/\",\"https://ucarecdn.com/b7cfb059-1b36-4988-a633-0f1b6ef6e0fa/\",\"https://ucarecdn.com/259b50fc-9749-4144-a67c-dcbc4c57bf6b/\"]'),(8,'66ee39a7-36cc-4be3-b527-c4701083ef61','Кольцо «Леопард» из лимонного золота с цитринами и эмалью','ваковковко','Кольца','Золото',5.00,'Man','[\"15\", \"15.5\", \"16\", \"16.5\", \"17\", \"17.5\", \"18\", \"18.5\", \"19\", \"19.5\", \"20\", \"20.5\", \"21\", \"21.5\", \"22\", \"22.5\", \"23\", \"23.5\", \"24\"]',5000.00,1,1,'[\"https://ucarecdn.com/4ac756a1-35fa-4b3d-9360-594f8d5293b2/\",\"https://ucarecdn.com/f901f804-2b68-487a-987c-dabb190445a1/\",\"https://ucarecdn.com/5b4a172c-f7fd-4f76-804a-96fd03b05bca/\",\"https://ucarecdn.com/fbbfd6f3-5b9b-42ff-8cc3-0168b8bc766d/\"]'),(9,'ea521242-bdda-4716-9552-63b201550d8f','Браслет из комбинированного золота с фианитами','Браслет из комбинированного золота с фианитами из красного золота 585 пробы.','Браслеты','Золото',12.30,'Woman','[\"16\", \"16.5\", \"17\"]',187295.00,0,1,'[\"https://ucarecdn.com/2e688c8f-e005-4dd5-ac07-83e8c8b59fc3/\",\"https://ucarecdn.com/3c19f252-7175-4740-939a-e3ed8c7ba2c5/\"]'),(10,'01fd59f0-cc83-47d0-9ea9-5f039e868b98','Браслет «Амфисбена» из красного золота','Браслет «Амфисбена» из красного золота 585 пробы. Дизайн украшения в стиле анималистика. Образ двухголовой змеи символизирует гармонию и симметрию двух начал. Рельефный узор в точности повоторяет рисунок змеиной кожи, что придаёт ювелирному образу реалистичность. Браслет станет символичным и изысканным штрихом образа.','Браслеты','Золото',8.00,'Woman','[\"16\", \"16.5\", \"17\"]',125270.00,0,1,'[\"https://ucarecdn.com/dd591688-8b70-4445-a1f1-d5173a819744/\",\"https://ucarecdn.com/a7abd6a3-d7e2-492e-b6a4-fcd871644aa6/\",\"https://ucarecdn.com/fcb240d9-7908-4f02-89f4-116a4d649faf/\"]'),(11,'d762f239-f772-4639-b6c0-bea547d96c3a','Браслет «Бабочки» из красного золота с фианитами','Браслет «Бабочки» из красного золота 585 пробы с фианитами. Длина браслета регулируется. Дизайн украшения современный, в стиле флористика. Ювелирный образ бабочек символизирует лёгкость, свободу, перерождение. Инкрустация бесцветными фианитами усиливает нежный характер украшения и его сияние. Закрепка камней выполнена вручную. Браслет станет романтичным, изящным и женственным штрихом образа.','Браслеты','Золото',6.50,'Woman','[\"16\", \"16.5\", \"17\"]',102396.00,0,1,'[\"https://ucarecdn.com/d11ace82-60d8-49f0-8d29-bf728c15dd1b/\",\"https://ucarecdn.com/0152ffff-4535-4466-9251-602d1bcf50eb/\"]'),(12,'ebd4a242-8ff2-411c-8cfc-790146815224','Серьги «Павлины» с английским замком из красного золота с эмалью','Серьги «Павлины» с английским замком из красного золота 585 пробы с эмалью. Украшение выполнено в стиле анималистика. Павлин олицетворяет собой бессмертие. Родирование и эмалирование выполнены вручную.','Серьги','Золото',3.00,'Woman','[]',47383.00,0,1,'[\"https://ucarecdn.com/2a2b876a-59d1-4d6a-a562-7ef3c5103f34/\",\"https://ucarecdn.com/b326b4e5-ce06-46cd-ba8b-6571f30d4773/\",\"https://ucarecdn.com/1d07d821-673b-4b6e-a2bc-d8ff1ef38757/\",\"https://ucarecdn.com/adc20941-613d-43a0-bf85-63e90ea1a1ff/\"]');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birth_date` date DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_activity` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Дмитрий','Маматкулов','mamatkulov.dmitry@gmail.com','+7 (912) 345-67-89','2003-01-27','$2b$10$Z.omg6Ff1pYDCNLV3cFDre5QkztTJeDwNvduq3kVS4CfVJ/S6S3Lq',1,'2025-04-07 17:33:18','2025-04-08 07:19:09'),(8,'f','f','f@gmail.com','+7 (565) 555-55-55','2003-01-01','$2b$10$Z4SQqXYZp0IxH5oiKOVhDOqbStEqoCHwstH8h/pLhfIjQpjiC8Wzi',0,'2025-05-02 08:22:25','2025-06-20 08:15:05'),(9,'Иван','Иванов','ivanov.ivan@gmail.com','+7 (912) 345-67-88','1996-04-25','$2b$10$VgiaQm81hUTZzWKpdixkyO8wPa9wxWvEyFyCd2kpLVYwYzcei4fTq',0,'2025-05-02 08:56:38','2025-05-02 10:22:34'),(10,'User','Test','test.user@gmail.com','+7 (912) 345-67-80','2000-01-01','$2b$10$kXfcmlfbC7i9jl9n7HEzLuv2gd8jZZvOwNNZtJHg9JOUPEb4wZIQO',0,'2025-05-05 07:59:21','2025-05-05 07:59:21'),(11,'User1','Test1','testuser1@gmail.com','+7 (922) 145-67-89','1996-01-01','$2b$10$WKd/4.Hh4OHY.VjVLg0jI.iaNtU7v.TsX.mniYBfAhhdv9dejIDFe',0,'2025-06-20 08:19:58','2025-06-20 08:19:58'),(14,'admin','admin','admin@gmail.com','+7 (952) 489-25-15','1996-06-21','$2b$10$eUt8woQ4sVyn3PaN0xTyfOdjNVGL/iVjtsSH5U4SSfSIaqubZ/rdW',1,'2025-06-23 13:14:08','2025-06-23 13:14:08');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-24 16:18:05
