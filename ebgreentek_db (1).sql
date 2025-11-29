-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 29, 2025 at 09:36 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ebgreentek_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_features`
--

CREATE TABLE `about_features` (
  `id` int(10) UNSIGNED NOT NULL,
  `feature_text` varchar(200) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tính năng About section';

-- --------------------------------------------------------

--
-- Table structure for table `about_values`
--

CREATE TABLE `about_values` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `color` varchar(50) DEFAULT 'blue',
  `icon` varchar(50) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Giá trị cốt lõi công ty';

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `action` varchar(50) NOT NULL,
  `entity_type` varchar(50) DEFAULT NULL,
  `entity_id` varchar(36) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Lịch sử hoạt động admin';

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `user_agent`, `created_at`) VALUES
(1, 1, 'upload_image', NULL, NULL, 'Uploaded image: Screenshot 2025-11-26 155658.png', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Edg/142.0.0.0', '2025-11-28 07:58:37'),
(2, 1, 'upload_image', NULL, NULL, 'Uploaded image: Screenshot 2025-11-26 160201.png', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Edg/142.0.0.0', '2025-11-28 08:03:06'),
(3, 1, 'upload_image', NULL, NULL, 'Uploaded image: Screenshot 2025-11-27 204703.png', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Edg/142.0.0.0', '2025-11-28 08:15:38'),
(4, 1, 'upload_image', NULL, NULL, 'Uploaded image: f1.jpg', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-29 00:48:29'),
(5, 1, 'upload_image', NULL, NULL, 'Uploaded image: Screenshot 2025-11-28 155737.png', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-29 00:48:35'),
(6, 1, 'reply_contact', 'contact', 'f5338b2f-cc00-11f0-950c-84e3e3c94707', 'Replied to contact from Nguyễn Văn A', NULL, NULL, '2025-11-29 01:05:36'),
(7, 1, 'upload_image', NULL, NULL, 'Uploaded image: agent.png', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Edg/142.0.0.0', '2025-11-29 01:42:55'),
(8, 1, 'upload_image', NULL, NULL, 'Uploaded image: agent.png', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-29 02:32:40'),
(9, 1, 'upload_image', NULL, NULL, 'Uploaded image: agent.png', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-29 02:54:46'),
(10, 1, 'upload_image', NULL, NULL, 'Uploaded image: f1.jpg', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-29 02:54:57'),
(11, 1, 'upload_image', NULL, NULL, 'Uploaded image: agent.png', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-29 03:29:33'),
(12, 1, 'upload_image', NULL, NULL, 'Uploaded image: f1.jpg', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-29 03:38:12'),
(13, 1, 'reply_contact', 'contact', 'ad6f30fc-50bd-45eb-8d82-76930d18036c', 'Replied to contact from provinces', NULL, NULL, '2025-11-29 04:26:00'),
(14, 1, 'upload_image', NULL, NULL, 'Uploaded image: 6e611539defc7e3b051e4d7eedf6eef34a3ee041.png', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-29 04:37:02'),
(15, 1, 'upload_image', NULL, NULL, 'Uploaded image: f4c43641a0a7f32ad32b6e72da10c6ae04af8cf9.png', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-29 04:37:17'),
(16, 1, 'upload_image', NULL, NULL, 'Uploaded image: d9d2adeb0a3292cbf7eb73e88c5eb2afd552a007.png', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-29 04:37:41'),
(17, 1, 'upload_image', NULL, NULL, 'Uploaded image: 7213434da5a01df81c61b5b294755a3cce1ae031.png', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-29 04:37:45'),
(18, 1, 'upload_image', NULL, NULL, 'Uploaded image: 61e7a519c081dca1029a6a54beabe26ce4925794.png', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Edg/142.0.0.0', '2025-11-29 04:43:58'),
(19, 1, 'upload_image', NULL, NULL, 'Uploaded image: f4c43641a0a7f32ad32b6e72da10c6ae04af8cf9.png', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Edg/142.0.0.0', '2025-11-29 04:45:39'),
(20, 1, 'upload_image', NULL, NULL, 'Uploaded image: 7213434da5a01df81c61b5b294755a3cce1ae031.png', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Edg/142.0.0.0', '2025-11-29 04:45:48'),
(21, 1, 'upload_image', NULL, NULL, 'Uploaded image: d9d2adeb0a3292cbf7eb73e88c5eb2afd552a007.png', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Edg/142.0.0.0', '2025-11-29 04:45:53'),
(22, 1, 'upload_image', NULL, NULL, 'Uploaded image: 93b714c497399529c7b2e062679af59386de7a40.png', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Edg/142.0.0.0', '2025-11-29 04:47:53'),
(23, 1, 'upload_image', NULL, NULL, 'Uploaded image: f7fb5407eeccedd33e850e514904ea87897e24c5.png', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Edg/142.0.0.0', '2025-11-29 04:48:09'),
(24, 1, 'upload_image', NULL, NULL, 'Uploaded image: 4f9243760533d7eedcf78fe5297b0b77de79bdf7.png', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Edg/142.0.0.0', '2025-11-29 04:48:18'),
(25, 1, 'upload_image', NULL, NULL, 'Uploaded image: Screenshot 2025-11-26 144435.png', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-29 06:30:48'),
(26, 1, 'upload_image', NULL, NULL, 'Uploaded image: Screenshot 2025-11-26 160030.png', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Edg/142.0.0.0', '2025-11-29 07:01:02'),
(27, 1, 'upload_image', NULL, NULL, 'Uploaded image: b05a47fe497a38721b0032ff9a82fa03423c78ec.png', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Edg/142.0.0.0', '2025-11-29 07:48:49'),
(28, 1, 'upload_image', NULL, NULL, 'Uploaded image: b389bc127df9e935e72183a9f713a7df032fbf12.png', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Edg/142.0.0.0', '2025-11-29 07:48:59'),
(29, 1, 'upload_image', NULL, NULL, 'Uploaded image: 1ff9cebf7401d6966350d436c106cad92b7c4462.png', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Edg/142.0.0.0', '2025-11-29 07:49:13'),
(30, 1, 'upload_image', NULL, NULL, 'Uploaded image: 9cd7b9f3004c6b625260a1b0d10f68b9849021af.png', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Edg/142.0.0.0', '2025-11-29 07:49:29'),
(31, 1, 'upload_image', NULL, NULL, 'Uploaded image: 6e611539defc7e3b051e4d7eedf6eef34a3ee041.png', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Edg/142.0.0.0', '2025-11-29 07:50:03'),
(32, 1, 'upload_image', NULL, NULL, 'Uploaded image: f4c43641a0a7f32ad32b6e72da10c6ae04af8cf9.png', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Edg/142.0.0.0', '2025-11-29 07:50:11'),
(33, 1, 'upload_image', NULL, NULL, 'Uploaded image: 7213434da5a01df81c61b5b294755a3cce1ae031.png', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Edg/142.0.0.0', '2025-11-29 07:50:18'),
(34, 1, 'upload_image', NULL, NULL, 'Uploaded image: d9d2adeb0a3292cbf7eb73e88c5eb2afd552a007.png', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36 Edg/142.0.0.0', '2025-11-29 07:50:22');

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `id` varchar(36) NOT NULL,
  `title` varchar(300) NOT NULL,
  `category` varchar(100) NOT NULL,
  `excerpt` text NOT NULL,
  `content` longtext NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `author` varchar(100) DEFAULT 'Admin',
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `status` enum('published','draft') DEFAULT 'draft',
  `is_featured` tinyint(1) DEFAULT 0,
  `view_count` int(10) UNSIGNED DEFAULT 0,
  `read_time` varchar(20) DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý tin tức và bài viết';

-- --------------------------------------------------------

--
-- Table structure for table `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 2, 'add_permission'),
(6, 'Can change permission', 2, 'change_permission'),
(7, 'Can delete permission', 2, 'delete_permission'),
(8, 'Can view permission', 2, 'view_permission'),
(9, 'Can add group', 3, 'add_group'),
(10, 'Can change group', 3, 'change_group'),
(11, 'Can delete group', 3, 'delete_group'),
(12, 'Can view group', 3, 'view_group'),
(13, 'Can add user', 4, 'add_user'),
(14, 'Can change user', 4, 'change_user'),
(15, 'Can delete user', 4, 'delete_user'),
(16, 'Can view user', 4, 'view_user'),
(17, 'Can add content type', 5, 'add_contenttype'),
(18, 'Can change content type', 5, 'change_contenttype'),
(19, 'Can delete content type', 5, 'delete_contenttype'),
(20, 'Can view content type', 5, 'view_contenttype'),
(21, 'Can add session', 6, 'add_session'),
(22, 'Can change session', 6, 'change_session'),
(23, 'Can delete session', 6, 'delete_session'),
(24, 'Can view session', 6, 'view_session');

-- --------------------------------------------------------

--
-- Table structure for table `auth_user`
--

CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `auth_user`
--

INSERT INTO `auth_user` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`) VALUES
(1, 'pbkdf2_sha256$600000$kRh3b3uAh3ZpEx2Qv1g49t$qJTE5tMVa8kuyQcnC3w009lgdYgqX0oOrhjulyo7ihc=', NULL, 1, 'admin', '', '', '', 1, 1, '2025-11-27 07:20:24.155980');

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_groups`
--

CREATE TABLE `auth_user_groups` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_user_permissions`
--

CREATE TABLE `auth_user_user_permissions` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `type` enum('product','article') NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `parent_id` int(10) UNSIGNED DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh mục sản phẩm và bài viết';

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `type`, `description`, `icon`, `color`, `parent_id`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Chăn nuôi', 'chan-nuoi', 'product', 'Sản phẩm cho chăn nuôi', NULL, 'green', NULL, 1, 1, '2025-11-27 13:22:19', '2025-11-27 13:22:19'),
(2, 'Thủy sản', 'thuy-san', 'product', 'Sản phẩm cho thủy sản', NULL, 'blue', NULL, 2, 1, '2025-11-27 13:22:19', '2025-11-27 13:22:19'),
(3, 'Môi trường', 'moi-truong', 'product', 'Sản phẩm xử lý môi trường', NULL, 'purple', NULL, 3, 1, '2025-11-27 13:22:19', '2025-11-27 13:22:19'),
(4, 'Canh tác', 'canh-tac', 'product', 'Sản phẩm cho canh tác', NULL, 'orange', NULL, 4, 1, '2025-11-27 13:22:19', '2025-11-27 13:22:19'),
(5, 'Kiến thức', 'kien-thuc', 'article', 'Bài viết kiến thức', NULL, 'blue', NULL, 1, 1, '2025-11-27 13:22:19', '2025-11-27 13:22:19'),
(6, 'Tin tức', 'tin-tuc', 'article', 'Tin tức ngành', NULL, 'green', NULL, 2, 1, '2025-11-27 13:22:19', '2025-11-27 13:22:19');

-- --------------------------------------------------------

--
-- Table structure for table `certifications`
--

CREATE TABLE `certifications` (
  `id` varchar(36) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(50) DEFAULT 'Award',
  `icon_color` varchar(50) DEFAULT 'blue',
  `image_url` varchar(500) DEFAULT NULL,
  `certificate_number` varchar(100) DEFAULT NULL,
  `issued_by` varchar(200) DEFAULT NULL,
  `issued_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chứng nhận chất lượng';

--
-- Dumping data for table `certifications`
--

INSERT INTO `certifications` (`id`, `name`, `description`, `icon`, `icon_color`, `image_url`, `certificate_number`, `issued_by`, `issued_date`, `expiry_date`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Chứng nhận ISO 9001:2015', NULL, 'Award', 'blue', NULL, NULL, NULL, NULL, NULL, 1, 1, '2025-11-27 13:22:19', '2025-11-27 13:22:19'),
('650e8400-e29b-41d4-a716-446655440002', 'Chứng nhận An toàn thực phẩm', NULL, 'Shield', 'green', NULL, NULL, NULL, NULL, NULL, 1, 2, '2025-11-27 13:22:19', '2025-11-27 13:22:19'),
('650e8400-e29b-41d4-a716-446655440003', 'Chứng nhận GMP', NULL, 'CheckCircle', 'purple', NULL, NULL, NULL, NULL, NULL, 1, 3, '2025-11-27 13:22:19', '2025-11-27 13:22:19'),
('650e8400-e29b-41d4-a716-446655440004', 'Chứng nhận HACCP', NULL, 'BadgeCheck', 'blue', NULL, NULL, NULL, NULL, NULL, 1, 4, '2025-11-27 13:22:19', '2025-11-27 13:22:19'),
('650e8400-e29b-41d4-a716-446655440005', 'Chứng nhận Organic', NULL, 'Medal', 'green', NULL, NULL, NULL, NULL, NULL, 1, 5, '2025-11-27 13:22:19', '2025-11-27 13:22:19'),
('650e8400-e29b-41d4-a716-446655440006', 'Chứng nhận VSATTP', NULL, 'Trophy', 'purple', NULL, NULL, NULL, NULL, NULL, 1, 6, '2025-11-27 13:22:19', '2025-11-27 13:22:19');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('new','replied','closed') DEFAULT 'new',
  `admin_reply` text DEFAULT NULL,
  `replied_at` datetime DEFAULT NULL,
  `replied_by_id` int(10) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý liên hệ từ khách hàng';

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `phone`, `subject`, `message`, `status`, `admin_reply`, `replied_at`, `replied_by_id`, `ip_address`, `user_agent`, `created_at`, `updated_at`) VALUES
('f533b253-cc00-11f0-950c-84e3e3c94707', 'Trần Thị B', 'thib@example.com', NULL, 'Báo lỗi website', 'Trang chi tiết sản phẩm không hiển thị hình ảnh.', 'new', NULL, NULL, NULL, '14.241.19.22', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_2)', '2025-11-28 09:21:33', '2025-11-28 09:21:33'),
('f533b509-cc00-11f0-950c-84e3e3c94707', 'Hoàng Đức C', 'duc.c@example.com', '0908001122', 'Khuyến mãi tháng này', 'Cho tôi hỏi hiện tại có chương trình khuyến mãi nào không?', 'replied', 'Chào anh, hiện tại đang có chương trình giảm giá 20% toàn bộ sản phẩm.', '2025-11-28 09:21:33', NULL, '42.115.7.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', '2025-11-25 09:21:33', '2025-11-28 09:21:33'),
('f533b699-cc00-11f0-950c-84e3e3c94707', 'Lê Minh D', 'minhd@example.com', '0912345678', 'Yêu cầu hỗ trợ đơn hàng #1234', 'Tôi cần hỗ trợ thay đổi địa chỉ giao hàng cho đơn 1234.', 'closed', 'Chúng tôi đã cập nhật địa chỉ giao hàng cho anh.', '2025-11-26 09:21:33', NULL, '115.78.120.45', 'Mozilla/5.0 (Android 13)', '2025-11-23 09:21:33', '2025-11-28 09:21:33'),
('f533b7ae-cc00-11f0-950c-84e3e3c94707', 'Phạm Thị E', 'pham.e@example.com', NULL, 'Tư vấn sản phẩm chăm sóc cây', 'Tôi muốn được tư vấn loại chế phẩm phù hợp cho lan hồ điệp.', 'replied', 'Lan Hồ Điệp nên dùng sản phẩm EB-Flower Booster.', '2025-11-27 09:21:33', NULL, '203.113.172.55', 'Mozilla/5.0 (Windows NT 10.0)', '2025-11-26 09:21:33', '2025-11-28 09:21:33'),
('f534282f-cc00-11f0-950c-84e3e3c94707', 'Võ Hữu F', 'huu.f@example.com', '0977233445', 'Báo giá sỉ', 'Bên bạn có hỗ trợ giá sỉ cho đại lý không?', 'new', NULL, NULL, NULL, '171.224.0.21', 'Mozilla/5.0 (Linux; Android 12)', '2025-11-28 09:21:33', '2025-11-28 09:21:33'),
('f5342b13-cc00-11f0-950c-84e3e3c94707', 'Đinh Thảo G', 'thao.g@example.com', '0966888999', 'Khiếu nại sản phẩm lỗi', 'Tôi nhận sản phẩm bị móp méo, vui lòng hỗ trợ.', 'closed', 'Chúng tôi đã gửi sản phẩm thay thế cho chị.', '2025-11-23 09:21:33', NULL, '115.72.33.75', 'Mozilla/5.0 (Windows NT 11.0)', '2025-11-18 09:21:33', '2025-11-28 09:21:33'),
('f5342c1e-cc00-11f0-950c-84e3e3c94707', 'Hồ Minh H', 'minh.h@example.com', NULL, 'Hợp tác quảng cáo', 'Tôi muốn hợp tác quảng cáo sản phẩm của bạn.', 'replied', 'Cảm ơn bạn, vui lòng gửi proposal qua email.', '2025-11-24 09:21:33', NULL, '58.187.54.102', 'Mozilla/5.0 (iPad; CPU iPad OS 15_5)', '2025-11-22 09:21:33', '2025-11-28 09:21:33'),
('f5342cdf-cc00-11f0-950c-84e3e3c94707', 'Trương Quang I', 'quangi@example.com', '0932123123', 'Góp ý giao diện website', 'Giao diện trên mobile hơi khó thao tác. Mong được cải thiện.', 'new', NULL, NULL, NULL, '171.244.30.11', 'Mozilla/5.0 (Android 11)', '2025-11-27 09:21:33', '2025-11-28 09:21:33'),
('f5342d79-cc00-11f0-950c-84e3e3c94707', 'Ngô Thị K', 'thi.k@example.com', NULL, 'Hạn sử dụng sản phẩm', 'Sản phẩm EB-Greentek hạn sử dụng bao lâu?', 'replied', 'Thời hạn sử dụng là 24 tháng kể từ ngày sản xuất.', '2025-11-28 08:21:33', NULL, '42.112.123.40', 'Mozilla/5.0 (Windows NT 10.0; Win64)', '2025-11-27 09:21:33', '2025-11-28 09:21:33');

-- --------------------------------------------------------

--
-- Table structure for table `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(1, 'admin', 'logentry'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(4, 'auth', 'user'),
(5, 'contenttypes', 'contenttype'),
(6, 'sessions', 'session');

-- --------------------------------------------------------

--
-- Table structure for table `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2025-11-27 06:36:33.551296'),
(2, 'auth', '0001_initial', '2025-11-27 06:36:33.953288'),
(3, 'admin', '0001_initial', '2025-11-27 06:36:34.040685'),
(4, 'admin', '0002_logentry_remove_auto_add', '2025-11-27 06:36:34.047897'),
(5, 'admin', '0003_logentry_add_action_flag_choices', '2025-11-27 06:36:34.055742'),
(6, 'contenttypes', '0002_remove_content_type_name', '2025-11-27 06:36:34.124742'),
(7, 'auth', '0002_alter_permission_name_max_length', '2025-11-27 06:36:34.168708'),
(8, 'auth', '0003_alter_user_email_max_length', '2025-11-27 06:36:34.182823'),
(9, 'auth', '0004_alter_user_username_opts', '2025-11-27 06:36:34.190521'),
(10, 'auth', '0005_alter_user_last_login_null', '2025-11-27 06:36:34.232908'),
(11, 'auth', '0006_require_contenttypes_0002', '2025-11-27 06:36:34.237267'),
(12, 'auth', '0007_alter_validators_add_error_messages', '2025-11-27 06:36:34.245845'),
(13, 'auth', '0008_alter_user_username_max_length', '2025-11-27 06:36:34.258550'),
(14, 'auth', '0009_alter_user_last_name_max_length', '2025-11-27 06:36:34.270798'),
(15, 'auth', '0010_alter_group_name_max_length', '2025-11-27 06:36:34.284724'),
(16, 'auth', '0011_update_proxy_permissions', '2025-11-27 06:36:34.293244'),
(17, 'auth', '0012_alter_user_first_name_max_length', '2025-11-27 06:36:34.306266'),
(18, 'sessions', '0001_initial', '2025-11-27 06:36:34.337109');

-- --------------------------------------------------------

--
-- Table structure for table `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` varchar(36) NOT NULL,
  `file` varchar(100) DEFAULT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `file_url` varchar(500) DEFAULT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `width` int(10) UNSIGNED DEFAULT NULL,
  `height` int(10) UNSIGNED DEFAULT NULL,
  `uploaded_by_id` int(11) DEFAULT NULL,
  `entity_type` varchar(50) DEFAULT NULL,
  `entity_id` varchar(36) DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`id`, `file`, `file_name`, `file_path`, `file_url`, `file_type`, `file_size`, `width`, `height`, `uploaded_by_id`, `entity_type`, `entity_id`, `is_public`, `created_at`) VALUES
('08c16d6c-e266-4758-a4bd-f62ca84ad902', 'uploads/2025/11/29/4f9243760533d7eedcf78fe5297b0b77de79bdf7.png', '4f9243760533d7eedcf78fe5297b0b77de79bdf7.png', NULL, NULL, 'image', 415569, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 04:48:18.392944'),
('0a05bc9d-7c1e-4aa7-8980-45393b4f1ed0', 'uploads/2025/11/29/agent_wxzlyKc.png', 'agent.png', NULL, NULL, 'image', 274372, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 03:29:33.181703'),
('13ab0c37-1ef7-429e-ae26-08cb8f8fe8f2', 'uploads/2025/11/29/7213434da5a01df81c61b5b294755a3cce1ae031_pbF7Dwj.png', '7213434da5a01df81c61b5b294755a3cce1ae031.png', NULL, NULL, 'image', 888731, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 07:50:18.192845'),
('1b283c9c-c494-4652-8f35-d00fccf27795', 'uploads/2025/11/29/7213434da5a01df81c61b5b294755a3cce1ae031.png', '7213434da5a01df81c61b5b294755a3cce1ae031.png', NULL, NULL, 'image', 888731, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 04:37:45.107109'),
('1c04cdf4-3a42-4d58-84a2-ec9459fa88ad', 'uploads/2025/11/29/61e7a519c081dca1029a6a54beabe26ce4925794.png', '61e7a519c081dca1029a6a54beabe26ce4925794.png', NULL, NULL, 'image', 126654, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 04:43:58.210331'),
('1e735365-079b-4514-9bdd-3cfe2243f8a9', 'uploads/2025/11/29/b05a47fe497a38721b0032ff9a82fa03423c78ec.png', 'b05a47fe497a38721b0032ff9a82fa03423c78ec.png', NULL, NULL, 'image', 1908148, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 07:48:49.693271'),
('1eec24e8-6168-43f7-811a-7f5307e83a2e', 'uploads/2025/11/29/f7fb5407eeccedd33e850e514904ea87897e24c5.png', 'f7fb5407eeccedd33e850e514904ea87897e24c5.png', NULL, NULL, 'image', 425447, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 04:48:09.619616'),
('23a457fb-59d0-498e-8958-ac58eed86af5', 'uploads/2025/11/29/7213434da5a01df81c61b5b294755a3cce1ae031_SunMKus.png', '7213434da5a01df81c61b5b294755a3cce1ae031.png', NULL, NULL, 'image', 888731, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 04:45:48.810135'),
('30e9708c-464e-499a-b329-e7e916e66a61', 'uploads/2025/11/29/f4c43641a0a7f32ad32b6e72da10c6ae04af8cf9.png', 'f4c43641a0a7f32ad32b6e72da10c6ae04af8cf9.png', NULL, NULL, 'image', 646831, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 04:37:17.040012'),
('3a07fd76-dfb1-4ba7-9681-f6af07e8c649', 'uploads/2025/11/29/9cd7b9f3004c6b625260a1b0d10f68b9849021af.png', '9cd7b9f3004c6b625260a1b0d10f68b9849021af.png', NULL, NULL, 'image', 1638080, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 07:49:29.105636'),
('3dbe2db3-f8e9-434f-ab20-e0ced1db2112', 'uploads/2025/11/29/d9d2adeb0a3292cbf7eb73e88c5eb2afd552a007_0ATWL2I.png', 'd9d2adeb0a3292cbf7eb73e88c5eb2afd552a007.png', NULL, NULL, 'image', 976264, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 04:45:53.078218'),
('3e5ca2e5-cdc8-4667-8af2-45e6ea8ddf14', 'uploads/2025/11/29/f1_Gr4XPaY.jpg', 'f1.jpg', NULL, NULL, 'image', 782411, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 03:38:12.705436'),
('48ed30c8-538d-4d74-aa48-81023e378de4', 'uploads/2025/11/29/f4c43641a0a7f32ad32b6e72da10c6ae04af8cf9_13X7nyP.png', 'f4c43641a0a7f32ad32b6e72da10c6ae04af8cf9.png', NULL, NULL, 'image', 646831, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 07:50:11.023753'),
('52bc472a-3a89-4ade-82f1-b70f3839708b', 'uploads/2025/11/29/f1.jpg', 'f1.jpg', NULL, NULL, 'image', 782411, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 00:48:29.756816'),
('5609ac9c-6955-43e9-bb17-a18a80cdef38', 'uploads/2025/11/29/f1_BJvESTy.jpg', 'f1.jpg', NULL, NULL, 'image', 782411, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 02:54:57.194450'),
('64c51f43-1ce5-476b-89fc-94596a52a0a1', 'uploads/2025/11/29/agent.png', 'agent.png', NULL, NULL, 'image', 274372, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 01:42:55.075966'),
('7c2b978e-39a2-4054-babe-71503297889b', 'uploads/2025/11/29/d9d2adeb0a3292cbf7eb73e88c5eb2afd552a007_ZO8mKo9.png', 'd9d2adeb0a3292cbf7eb73e88c5eb2afd552a007.png', NULL, NULL, 'image', 976264, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 07:50:22.468332'),
('7c5ba724-dfd9-4068-a5e4-bfd3cdcbeaed', 'uploads/2025/11/29/b389bc127df9e935e72183a9f713a7df032fbf12.png', 'b389bc127df9e935e72183a9f713a7df032fbf12.png', NULL, NULL, 'image', 1534208, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 07:48:59.896328'),
('7ea41cdd-df00-442c-86f6-5117331be396', 'uploads/2025/11/29/f4c43641a0a7f32ad32b6e72da10c6ae04af8cf9_2rW28tu.png', 'f4c43641a0a7f32ad32b6e72da10c6ae04af8cf9.png', NULL, NULL, 'image', 646831, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 04:45:39.538670'),
('7f63aedd-8ea4-4dc7-b2bc-a805a4baefab', 'uploads/2025/11/29/Screenshot_2025-11-26_160030.png', 'Screenshot 2025-11-26 160030.png', NULL, NULL, 'image', 162362, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 07:01:02.308375'),
('b81640f0-50f8-44f4-ba8a-6d375d8196cf', 'uploads/2025/11/29/6e611539defc7e3b051e4d7eedf6eef34a3ee041_pK6UXCK.png', '6e611539defc7e3b051e4d7eedf6eef34a3ee041.png', NULL, NULL, 'image', 1431520, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 07:50:03.712159'),
('ba412d9f-18f9-4844-b59f-ed49612d7889', 'uploads/2025/11/29/agent_aSBatB3.png', 'agent.png', NULL, NULL, 'image', 274372, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 02:54:46.663551'),
('c91e5beb-8419-44ab-a69e-f153e5330ab2', 'uploads/2025/11/29/93b714c497399529c7b2e062679af59386de7a40.png', '93b714c497399529c7b2e062679af59386de7a40.png', NULL, NULL, 'image', 69330, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 04:47:53.855705'),
('cd619e8c-e49f-49b0-ab72-de084b3ea9ab', 'uploads/2025/11/29/Screenshot_2025-11-28_155737.png', 'Screenshot 2025-11-28 155737.png', NULL, NULL, 'image', 148127, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 00:48:35.948073'),
('ce6623fe-9dff-41ae-856b-2a44df4da9a0', 'uploads/2025/11/29/agent_1KnsnuS.png', 'agent.png', NULL, NULL, 'image', 274372, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 02:32:40.040965'),
('d11e4222-2072-45a2-b43a-54eaafc11ebb', 'uploads/2025/11/29/Screenshot_2025-11-26_144435.png', 'Screenshot 2025-11-26 144435.png', NULL, NULL, 'image', 50308, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 06:30:48.380298'),
('d3e499a6-7636-49b5-9d95-8850501ac451', 'uploads/2025/11/28/Screenshot_2025-11-27_204703.png', 'Screenshot 2025-11-27 204703.png', NULL, NULL, 'image', 57765, NULL, NULL, 1, NULL, NULL, 1, '2025-11-28 08:15:38.604203'),
('e6d77e9a-d2db-4f77-8097-4b41f28f947f', 'uploads/2025/11/28/Screenshot_2025-11-26_160201.png', 'Screenshot 2025-11-26 160201.png', NULL, NULL, 'image', 90064, NULL, NULL, 1, NULL, NULL, 1, '2025-11-28 08:03:06.247959'),
('e7f386dc-91cd-4f45-81cf-1eb454521430', 'uploads/2025/11/29/1ff9cebf7401d6966350d436c106cad92b7c4462.png', '1ff9cebf7401d6966350d436c106cad92b7c4462.png', NULL, NULL, 'image', 1500774, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 07:49:13.466765'),
('f34e9f72-16f9-46fb-8cc8-0aae4b9a12bc', 'uploads/2025/11/29/6e611539defc7e3b051e4d7eedf6eef34a3ee041.png', '6e611539defc7e3b051e4d7eedf6eef34a3ee041.png', NULL, NULL, 'image', 1431520, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 04:37:02.939890'),
('f672d75e-0980-4dbe-bfac-f4071b908c7e', 'uploads/2025/11/29/d9d2adeb0a3292cbf7eb73e88c5eb2afd552a007.png', 'd9d2adeb0a3292cbf7eb73e88c5eb2afd552a007.png', NULL, NULL, 'image', 976264, NULL, NULL, 1, NULL, NULL, 1, '2025-11-29 04:37:41.014276'),
('ff8d51e9-c33e-4656-b38d-1f153577eace', 'uploads/2025/11/28/Screenshot_2025-11-26_155658.png', 'Screenshot 2025-11-26 155658.png', NULL, NULL, 'image', 8070, NULL, NULL, 1, NULL, NULL, 1, '2025-11-28 07:58:37.515582');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` varchar(36) NOT NULL,
  `name` varchar(200) NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `usage` text DEFAULT NULL,
  `ingredients` text DEFAULT NULL,
  `benefits` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`benefits`)),
  `packaging` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`packaging`)),
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `image_labels` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`image_labels`)),
  `status` enum('active','inactive') DEFAULT 'active',
  `is_popular` tinyint(1) DEFAULT 0,
  `sort_order` int(11) DEFAULT 0,
  `view_count` int(10) UNSIGNED DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý sản phẩm';

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category`, `description`, `features`, `usage`, `ingredients`, `benefits`, `packaging`, `images`, `image_labels`, `status`, `is_popular`, `sort_order`, `view_count`, `created_at`, `updated_at`) VALUES
('27bdb4ae-d1b5-4bb1-9581-25a452471473', 'Bio aquatic Aquaculture', 'Phục hồi sinh học', 'Chế phẩm sinh học chuyên dụng cho nuôi trồng thủy sản, cải thiện chất lượng nước và tăng năng suất', '[\"N\\u01b0\\u1edbc trong s\\u1ea1ch\", \"T\\u0103ng n\\u0103ng su\\u1ea5t\", \"Gi\\u1ea3m b\\u1ec7nh t\\u1eadt\"]', 'Sử dụng 1-2 ppm cho ao nuôi, rải đều khắp mặt ao', 'Probiotics đặc biệt cho thủy sản, vitamin, khoáng chất', '[\"C\\u1ea3i thi\\u1ec7n ch\\u1ea5t l\\u01b0\\u1ee3ng n\\u01b0\\u1edbc\", \"T\\u0103ng s\\u1ee9c \\u0111\\u1ec1 kh\\u00e1ng\"]', '[\"Th\\u00f9ng nh\\u1ef1a\", \"Th\\u00f9ng Carton\", \"G\\u00f3i\"]', '[\"http://127.0.0.1:8000/media/uploads/2025/11/29/b05a47fe497a38721b0032ff9a82fa03423c78ec.png\", \"http://127.0.0.1:8000/media/uploads/2025/11/29/b389bc127df9e935e72183a9f713a7df032fbf12.png\", \"http://127.0.0.1:8000/media/uploads/2025/11/29/1ff9cebf7401d6966350d436c106cad92b7c4462.png\", \"http://127.0.0.1:8000/media/uploads/2025/11/29/9cd7b9f3004c6b625260a1b0d10f68b9849021af.png\"]', NULL, 'active', 0, 0, 1, '2025-11-29 07:49:32', '2025-11-29 14:51:12'),
('4d1852f0-0272-4277-95bb-2a6504eb84c3', 'Biorestos', 'Phục hồi sinh học', 'Chế phẩm sinh học phục hồi và tái tạo hệ sinh thái, cân bằng vi sinh vật có lợi trong môi trường', '[\"Ph\\u1ee5c h\\u1ed3i sinh th\\u00e1i\", \"An to\\u00e0n tuy\\u1ec7t \\u0111\\u1ed1i\"]', 'Pha loãng 1-2kg/1000m² khu vực hoặc theo hướng dẫn chuyên gia', 'Hỗn hợp vi sinh vật có lợi, enzyme sinh học, chất dinh dưỡng', '[\"Ph\\u1ee5c h\\u1ed3i \\u0111\\u1ea5t v\\u00e0 n\\u01b0\\u1edbc \\u00f4 nhi\\u1ec5m\", \"C\\u00e2n b\\u1eb1ng h\\u1ec7 vi sinh\", \"T\\u0103ng c\\u01b0\\u1eddng sinh th\\u00e1i t\\u1ef1 nhi\\u00ean\"]', '[\"Th\\u00f9ng Carton\", \"H\\u1ee7 nh\\u1ef1a cao\", \"H\\u1ee7 nh\\u1ef1a th\\u1ea5p\"]', '[\"http://127.0.0.1:8000/media/uploads/2025/11/29/6e611539defc7e3b051e4d7eedf6eef34a3ee041_pK6UXCK.png\", \"http://127.0.0.1:8000/media/uploads/2025/11/29/f4c43641a0a7f32ad32b6e72da10c6ae04af8cf9_13X7nyP.png\", \"http://127.0.0.1:8000/media/uploads/2025/11/29/7213434da5a01df81c61b5b294755a3cce1ae031_pbF7Dwj.png\", \"http://127.0.0.1:8000/media/uploads/2025/11/29/d9d2adeb0a3292cbf7eb73e88c5eb2afd552a007_ZO8mKo9.png\"]', NULL, 'active', 0, 0, 7, '2025-11-29 04:45:54', '2025-11-29 07:50:26');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(10) UNSIGNED NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` longtext DEFAULT NULL,
  `setting_type` enum('text','json','number','boolean','image') DEFAULT 'text',
  `setting_group` varchar(50) DEFAULT 'general',
  `description` varchar(300) DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Cấu hình website';

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `setting_group`, `description`, `is_public`, `created_at`, `updated_at`) VALUES
(1, 'site_name', 'EBGreentek', 'text', 'general', 'Tên website', 1, '2025-11-27 13:22:19', '2025-11-29 07:52:16'),
(2, 'logo_url', '', 'image', 'general', 'Logo website', 1, '2025-11-27 13:22:19', '2025-11-27 13:22:19'),
(3, 'hotline', '0901 234 567', 'text', 'general', 'Hotline', 1, '2025-11-27 13:22:19', '2025-11-29 07:52:16'),
(4, 'email', 'info@ebgreentek.vn', 'text', 'general', 'Email chính', 1, '2025-11-27 13:22:19', '2025-11-29 07:52:16'),
(5, 'support_email', 'support@ebgreentek.vn', 'text', 'general', 'Email hỗ trợ', 1, '2025-11-27 13:22:19', '2025-11-29 07:52:16'),
(6, 'phone', '+84 (0)23 2000 2332', 'text', 'general', 'Số điện thoại', 1, '2025-11-27 13:22:19', '2025-11-29 07:52:16'),
(7, 'fax', '+84 (0)23 2002 2413', 'text', 'general', 'Số fax', 1, '2025-11-27 13:22:19', '2025-11-29 07:52:16'),
(8, 'address', '123 Đường Nguyễn Văn Cừ\nPhường 4, Quận 5, TP.HCM', 'text', 'general', 'Địa chỉ văn phòng', 1, '2025-11-27 13:22:19', '2025-11-29 07:52:16'),
(9, 'working_hours', 'Thứ 2 - Thứ 6: 8:00 - 17:30\nThứ 7: 8:00 - 12:00', 'text', 'general', 'Giờ làm việc', 1, '2025-11-27 13:22:19', '2025-11-29 07:52:16'),
(10, 'hero_title', 'Chế Phẩm Sinh Học Men Vi Sinh', 'text', 'general', 'Tiêu đề Hero', 1, '2025-11-27 13:22:19', '2025-11-29 07:52:16'),
(11, 'hero_subtitle', 'Sản phẩm sinh học chất lượng cao', 'text', 'general', 'Phụ đề Hero', 1, '2025-11-27 13:22:19', '2025-11-29 07:52:16'),
(12, 'hero_description', 'Giải pháp sinh học an toàn, hiệu quả cho nông nghiệp bền vững. Được tin tưởng bởi hàng nghìn khách hàng trên toàn quốc.', 'text', 'general', 'Mô tả Hero', 1, '2025-11-27 13:22:19', '2025-11-29 07:52:16'),
(13, 'hero_background_image', '', 'image', 'hero', 'Ảnh nền Hero', 1, '2025-11-27 13:22:19', '2025-11-27 13:22:19'),
(14, 'hero_banner_image', '', 'image', 'hero', 'Ảnh banner Hero', 1, '2025-11-27 13:22:19', '2025-11-27 13:22:19'),
(15, 'hero_button_text', 'Khám phá sản phẩm', 'text', 'general', 'Text nút Hero', 1, '2025-11-27 13:22:19', '2025-11-29 07:52:16'),
(16, 'hero_button_link', '#products', 'text', 'general', 'Link nút Hero', 1, '2025-11-27 13:22:19', '2025-11-29 07:52:16'),
(17, 'about_content', '<h2>Giới thiệu về EBGreentek</h2><p>EBGreentek là công ty chuyên cung cấp các sản phẩm sinh học chất lượng cao cho nông nghiệp, thủy sản và chăn nuôi.</p>', 'text', 'general', 'Trang Giới thiệu', 1, '2025-11-27 13:22:19', '2025-11-29 07:52:16'),
(18, 'privacy_policy', '<h2>Chính sách bảo mật</h2><p>Nội dung chính sách bảo mật...</p>', 'text', 'general', 'Trang Chính sách bảo mật', 1, '2025-11-27 13:22:19', '2025-11-29 07:52:16'),
(19, 'terms_of_service', '<h2>Điều khoản sử dụng</h2><p>Nội dung điều khoản...</p>', 'text', 'general', 'Trang Điều khoản', 1, '2025-11-27 13:22:19', '2025-11-29 07:52:16'),
(20, 'general.siteName', 'EBGreentek', 'text', 'general', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(21, 'general.logoUrl', 'http://127.0.0.1:8000/media/uploads/2025/11/29/93b714c497399529c7b2e062679af59386de7a40.png', 'text', 'general', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(22, 'general.hotline', '0901 234 567222', 'text', 'general', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(23, 'general.email', 'info@ebgreentek.vn', 'text', 'general', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(24, 'general.supportEmail', 'support@ebgreentek.vn', 'text', 'general', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(25, 'general.phone', '+84 (0)23 2000 2332', 'text', 'general', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(26, 'general.fax', '+84 (0)23 2002 2413', 'text', 'general', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(27, 'general.address', '123 Đường Nguyễn Văn Cừu\nPhường 4, Quận 5, TP.HCM', 'text', 'general', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(28, 'general.workingHours', 'Thứ 2 - Thứ 6: 8:00 - 17:30\nThứ 7: 8:00 - 12:00', 'text', 'general', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(29, 'general.site_name', 'EBGreentek', 'text', 'general', NULL, 0, '2025-11-29 01:45:01', '2025-11-29 01:54:05'),
(30, 'general.support_email', 'support@ebgreentek.vn', 'text', 'general', NULL, 0, '2025-11-29 01:45:01', '2025-11-29 01:54:05'),
(31, 'general.working_hours', 'Thứ 2 - Thứ 6: 8:00 - 17:30\nThứ 7: 8:00 - 12:00', 'text', 'general', NULL, 0, '2025-11-29 01:45:01', '2025-11-29 01:54:05'),
(32, 'hero.title', 'Chế Phẩm Sinh Học Men Vi Sinh', 'text', 'hero', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(33, 'hero.subtitle', 'Sản phẩm sinh học chất lượng cao', 'text', 'hero', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(34, 'hero.description', 'Giải pháp sinh học an toàn, hiệu quả cho nông nghiệp bền vững. Được tin tưởng bởi hàng nghìn khách hàng trên toàn quốc', 'text', 'hero', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(35, 'hero.buttonText', 'Khám phá sản phẩm', 'text', 'hero', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(36, 'hero.buttonLink', '#products', 'text', 'hero', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(37, 'hero.hero_button_link', '#products', 'text', 'general', NULL, 0, '2025-11-29 01:45:01', '2025-11-29 01:54:05'),
(38, 'hero.hero_button_text', 'Khám phá sản phẩm', 'text', 'general', NULL, 0, '2025-11-29 01:45:01', '2025-11-29 01:54:05'),
(39, 'hero.hero_description', 'Giải pháp sinh học an toàn, hiệu quả cho nông nghiệp bền vững. Được tin tưởng bởi hàng nghìn khách hàng trên toàn quốc.', 'text', 'general', NULL, 0, '2025-11-29 01:45:01', '2025-11-29 01:54:05'),
(40, 'hero.hero_subtitle', 'Sản phẩm sinh học chất lượng cao', 'text', 'general', NULL, 0, '2025-11-29 01:45:01', '2025-11-29 01:54:05'),
(41, 'hero.hero_title', 'Chế Phẩm Sinh Học Men Vi Sinh', 'text', 'general', NULL, 0, '2025-11-29 01:45:01', '2025-11-29 01:54:05'),
(42, 'socialMedia', '[{\"id\":\"1\",\"platform\":\"Facebook\",\"url\":\"https://facebook.com/ebgreentek\",\"imageUrl\":\"https://www.facebook.com/images/fb_icon_325x325.png\"}]', 'text', 'general', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(43, 'aboutSection.hero.title', 'Đối Tác Tin Cậy Của', 'text', 'aboutSection', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(44, 'aboutSection.hero.subtitle', 'Nông Nghiệp Việt Nam', 'text', 'aboutSection', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(45, 'aboutSection.hero.description', 'Chuyên gia hàng đầu về chế phẩm sinh học men vi sinh, mang đến giải pháp bền vững cho nông nghiệp hiện đại', 'text', 'aboutSection', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(46, 'aboutSection.content.heading', 'Cam kết chất lượng hàng đầu', 'text', 'aboutSection', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(47, 'aboutSection.content.paragraph1', 'Với hơn một thập kỷ kinh nghiệm, chúng tôi tự hào là đơn vị tiên phong trong việc nghiên cứu và ứng dụng công nghệ sinh học tiên tiến.', 'text', 'aboutSection', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(48, 'aboutSection.content.paragraph2', 'Sản phẩm được nghiên cứu và sản xuất theo tiêu chuẩn quốc tế nghiêm ngặt, đảm bảo hiệu quả tối ưu và an toàn tuyệt đối cho môi trường.', 'text', 'aboutSection', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(49, 'aboutSection.features', '[\"Công nghệ sinh học tiên tiến từ Nhật Bản\",\"Chứng nhận ISO 9001:2015 và HACCP\",\"Đội ngũ chuyên gia giàu kinh nghiệm\",\"Hỗ trợ kỹ thuật 24\"]', 'text', 'aboutSection', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(50, 'aboutSection.values', '[{\"title\":\"Chất lượng vượt trội\",\"desc\":\"Tiêu chuẩn quốc tế, hiệu quả đã được chứng minh\",\"color\":\"from-green-500 to-green-600\"},{\"title\":\"Đáng tin cậy\",\"desc\":\"Được 500+ khách hàng tin tưởng và lựa chọn\",\"color\":\"from-blue-500 to-blue-600\"},{\"title\":\"Hiệu quả rõ ràng\",\"desc\":\"Kết quả cải thiện đáng kể sau 7-14 ngày sử dụng\",\"color\":\"from-green-600 to-blue-600\"},{\"title\":\"\",\"desc\":\"\",\"color\":\"from-green-500 to-green-600\"}]', 'text', 'aboutSection', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(51, 'staticPages.about', 'Về chúng tôi...', 'text', 'staticPages', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(52, 'staticPages.privacyPolicy', 'Chính sách bảo mật...', 'text', 'staticPages', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(53, 'staticPages.termsOfService', 'Điều khoản sử dụng...', 'text', 'staticPages', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(54, 'certifications', '[{\"id\":\"1\",\"name\":\"ISO 9001:2015\",\"icon\":\"Award\"},{\"id\":\"2\",\"name\":\"HACCP\",\"icon\":\"Award\"}]', 'text', 'general', NULL, 1, '2025-11-29 01:45:01', '2025-11-29 07:52:16'),
(55, 'pages.about_content', '<h2>Giới thiệu về EBGreentek</h2><p>EBGreentek là công ty chuyên cung cấp các sản phẩm sinh học chất lượng cao cho nông nghiệp, thủy sản và chăn nuôi.</p>', 'text', 'general', NULL, 0, '2025-11-29 01:45:01', '2025-11-29 01:54:05'),
(56, 'pages.privacy_policy', '<h2>Chính sách bảo mật</h2><p>Nội dung chính sách bảo mật...</p>', 'text', 'general', NULL, 0, '2025-11-29 01:45:01', '2025-11-29 01:54:05'),
(57, 'pages.terms_of_service', '<h2>Điều khoản sử dụng</h2><p>Nội dung điều khoản...</p>', 'text', 'general', NULL, 0, '2025-11-29 01:45:01', '2025-11-29 01:54:05'),
(58, 'hero.bannerImage', 'http://127.0.0.1:8000/media/uploads/2025/11/29/f7fb5407eeccedd33e850e514904ea87897e24c5.png', 'text', 'hero', NULL, 1, '2025-11-29 02:54:58', '2025-11-29 07:52:16'),
(59, 'aboutImage', 'http://127.0.0.1:8000/media/uploads/2025/11/29/4f9243760533d7eedcf78fe5297b0b77de79bdf7.png', 'text', 'general', NULL, 1, '2025-11-29 03:38:15', '2025-11-29 07:52:16'),
(60, 'privacyPolicy.hero.title', 'Chính sách bảo mật', 'text', 'privacyPolicy', NULL, 1, '2025-11-29 04:08:24', '2025-11-29 07:52:16'),
(61, 'privacyPolicy.hero.description', 'Chúng tôi cam kết bảo vệ thông tin cá nhân của khách hàng với các tiêu chuẩn bảo mật cao nhất.', 'text', 'privacyPolicy', NULL, 1, '2025-11-29 04:08:24', '2025-11-29 07:52:16'),
(62, 'privacyPolicy.hero.lastUpdated', '22 tháng 10, 2025', 'text', 'privacyPolicy', NULL, 1, '2025-11-29 04:08:24', '2025-11-29 07:52:16'),
(63, 'privacyPolicy.detailedContent', 'CHÍNH SÁCH BẢO MẬT THÔNG TIN\n\n1. Mục đích thu thập thông tin\nChúng tôi thu thập thông tin cá nhân của bạn để:\n- Cung cấp dịch vụ và sản phẩm theo yêu cầu\n- Liên hệ tư vấn và hỗ trợ kỹ thuật\n- Gửi thông tin về sản phẩm mới và chương trình khuyến mãi\n- Cải thiện chất lượng dịch vụ\n\n2. Phạm vi sử dụng thông tin\nThông tin cá nhân của bạn chỉ được sử dụng trong nội bộ công ty và không được chia sẻ cho bên thứ ba khi chưa có sự đồng ý của bạn.\n\n3. Thời gian lưu trữ\nThông tin của bạn sẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ. Trong mọi trường hợp, thông tin sẽ được bảo mật trên máy chủ của chúng tôi.\n\n4. Cam kết bảo mật\n- Không sử dụng, chuyển giao, cung cấp thông tin khách hàng cho bên thứ ba khi chưa có sự đồng ý\n- Thông tin thanh toán được mã hóa và bảo mật tuyệt đối\n- Có biện pháp kỹ thuật để ngăn chặn truy cập trái phép\n\n5. Liên hệ\nNếu có thắc mắc về chính sách bảo mật, vui lòng liên hệ:\nEmail: contact@ebgreentek.com\nHotline: 0901 234 567', 'text', 'privacyPolicy', NULL, 1, '2025-11-29 04:08:24', '2025-11-29 07:52:16'),
(64, 'privacyPolicy.bottomNotice.title', 'Cam kết của chúng tôi', 'text', 'privacyPolicy', NULL, 1, '2025-11-29 04:08:24', '2025-11-29 07:52:16'),
(65, 'privacyPolicy.bottomNotice.message', 'EBGreentek cam kết bảo vệ thông tin của bạn với các tiêu chuẩn bảo mật cao nhất và đảm bảo an toàn tuyệt đối cho dữ liệu khách hàng.', 'text', 'privacyPolicy', NULL, 1, '2025-11-29 04:08:24', '2025-11-29 07:52:16'),
(66, 'termsOfService.hero.title', 'Điều khoản sử dụng', 'text', 'termsOfService', NULL, 1, '2025-11-29 04:08:24', '2025-11-29 07:52:16'),
(67, 'termsOfService.hero.description', 'Vui lòng đọc kỹ các điều khoản trước khi sử dụng sản phẩm và dịch vụ của chúng tôi.', 'text', 'termsOfService', NULL, 1, '2025-11-29 04:08:24', '2025-11-29 07:52:16'),
(68, 'termsOfService.hero.effectiveDate', '22 tháng 10, 2025', 'text', 'termsOfService', NULL, 1, '2025-11-29 04:08:24', '2025-11-29 07:52:16'),
(69, 'termsOfService.detailedContent', 'ĐIỀU KHOẢN SỬ DỤNG DỊCH VỤ\n\n1. Điều khoản chung\nKhi sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện sau đây.\n\n2. Quyền và trách nhiệm của khách hàng\n- Cung cấp thông tin chính xác khi đăng ký\n- Sử dụng sản phẩm đúng hướng dẫn\n- Thanh toán đầy đủ và đúng hạn\n- Không sử dụng sản phẩm vào mục đích vi phạm pháp luật\n\n3. Quyền và trách nhiệm của EBGreentek\n- Cung cấp sản phẩm chính hãng, chất lượng\n- Hỗ trợ kỹ thuật và tư vấn chuyên nghiệp\n- Bảo mật thông tin khách hàng\n- Giải quyết khiếu nại trong thời gian sớm nhất\n\n4. Chính sách giao hàng\n- Giao hàng toàn quốc\n- Thời gian: 2-5 ngày làm việc tùy khu vực\n- Miễn phí vận chuyển cho đơn hàng trên 5 triệu đồng\n\n5. Chính sách đổi trả\n- Đổi trả trong vòng 7 ngày nếu sản phẩm lỗi\n- Sản phẩm chưa qua sử dụng, còn nguyên bao bì\n- Chi phí vận chuyển đổi trả do công ty chịu\n\n6. Giới hạn trách nhiệm\nChúng tôi không chịu trách nhiệm cho:\n- Thiệt hại do sử dụng sai hướng dẫn\n- Tác động của yếu tố bên ngoài không kiểm soát được\n- Thông tin sai lệch do khách hàng cung cấp\n\n7. Liên hệ hỗ trợ\nEmail: contact@ebgreentek.com\nHotline: 0901 234 567\nĐịa chỉ: Khu công nghiệp, TP. Hồ Chí Minh, Việt Nam', 'text', 'termsOfService', NULL, 1, '2025-11-29 04:08:24', '2025-11-29 07:52:16'),
(70, 'termsOfService.bottomNotice.title', 'Chấp nhận điều khoản', 'text', 'termsOfService', NULL, 1, '2025-11-29 04:08:24', '2025-11-29 07:52:16'),
(71, 'termsOfService.bottomNotice.message', 'Bằng việc sử dụng sản phẩm của EBGreentek, bạn xác nhận đã đọc và đồng ý với các điều khoản này.', 'text', 'termsOfService', NULL, 1, '2025-11-29 04:08:24', '2025-11-29 07:52:16');

-- --------------------------------------------------------

--
-- Table structure for table `social_media`
--

CREATE TABLE `social_media` (
  `id` varchar(36) NOT NULL,
  `platform` varchar(50) NOT NULL,
  `url` varchar(500) NOT NULL,
  `icon_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý mạng xã hội';

--
-- Dumping data for table `social_media`
--

INSERT INTO `social_media` (`id`, `platform`, `url`, `icon_url`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Facebook', 'https://facebook.com/ebgreentek', 'https://www.facebook.com/images/fb_icon_325x325.png', 1, 1, '2025-11-27 13:22:19', '2025-11-27 13:22:19'),
('550e8400-e29b-41d4-a716-446655440002', 'Zalo', 'https://zalo.me/0901234567', '', 1, 2, '2025-11-27 13:22:19', '2025-11-27 13:22:19'),
('550e8400-e29b-41d4-a716-446655440003', 'Instagram', 'https://instagram.com/ebgreentek', '', 1, 3, '2025-11-27 13:22:19', '2025-11-27 13:22:19'),
('550e8400-e29b-41d4-a716-446655440004', 'YouTube', 'https://youtube.com/@ebgreentek', '', 1, 4, '2025-11-27 13:22:19', '2025-11-27 13:22:19');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `role` enum('admin','editor','viewer') DEFAULT 'editor',
  `status` enum('active','inactive') DEFAULT 'active',
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_superuser` tinyint(1) NOT NULL DEFAULT 0,
  `is_staff` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `first_name` varchar(150) DEFAULT '',
  `last_name` varchar(150) DEFAULT '',
  `date_joined` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý tài khoản admin';

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `full_name`, `role`, `status`, `last_login`, `created_at`, `updated_at`, `is_superuser`, `is_staff`, `is_active`, `first_name`, `last_name`, `date_joined`) VALUES
(1, 'admin', '123321Hoang', 'admin@ebgreentek.vn', 'Admin EBGreentek', 'admin', 'active', NULL, '2025-11-27 13:22:19', '2025-11-28 10:28:52', 0, 0, 1, '', '', '2025-11-28 09:33:05'),
(2, 'editor01', 'pbkdf2_sha256$870000$vqk1dAhM0HphZ6np3tZJbW$Qb2oN5pqu7pPuwbdeKqz3yVvepQoX7jvzg7UiPUIYUE=', 'editor01@ebgreentek.vn', 'Nguyễn Văn Editor', 'editor', 'active', NULL, '2025-10-12 10:15:20', '2025-11-20 08:33:10', 0, 0, 1, '', '', '2025-11-28 09:33:05'),
(3, 'editor02', 'pbkdf2_sha256$870000$vqk1dAhM0HphZ6np3tZJbW$Qb2oN5pqu7pPuwbdeKqz3yVvepQoX7jvzg7UiPUIYUE=', 'editor02@ebgreentek.vn', 'Trần Thị Biên Tập', 'editor', 'inactive', NULL, '2025-09-05 14:00:00', '2025-10-02 09:15:50', 0, 0, 1, '', '', '2025-11-28 09:33:05'),
(4, 'viewer01', 'pbkdf2_sha256$870000$vqk1dAhM0HphZ6np3tZJbW$Qb2oN5pqu7pPuwbdeKqz3yVvepQoX7jvzg7UiPUIYUE=', 'viewer01@ebgreentek.vn', 'Lê Văn Viewer', 'viewer', 'active', NULL, '2025-11-01 08:22:11', '2025-11-10 13:40:00', 0, 0, 1, '', '', '2025-11-28 09:33:05'),
(5, 'viewer02', 'pbkdf2_sha256$870000$vqk1dAhM0HphZ6np3tZJbW$Qb2oN5pqu7pPuwbdeKqz3yVvepQoX7jvzg7UiPUIYUE=', 'viewer02@ebgreentek.vn', 'Phạm Minh Thảo', 'viewer', 'inactive', NULL, '2025-10-10 07:10:44', '2025-10-15 10:05:33', 0, 0, 1, '', '', '2025-11-28 09:33:05'),
(6, 'support01', 'pbkdf2_sha256$870000$vqk1dAhM0HphZ6np3tZJbW$Qb2oN5pqu7pPuwbdeKqz3yVvepQoX7jvzg7UiPUIYUE=', 'support01@ebgreentek.vn', 'Ngô Quang Hỗ Trợ', 'editor', 'active', NULL, '2025-11-20 12:00:00', '2025-11-25 09:12:21', 0, 0, 1, '', '', '2025-11-28 09:33:05'),
(7, 'content01', 'pbkdf2_sha256$870000$vqk1dAhM0HphZ6np3tZJbW$Qb2oN5pqu7pPuwbdeKqz3yVvepQoX7jvzg7UiPUIYUE=', 'content01@ebgreentek.vn', 'Đỗ Thị Content', 'editor', 'active', NULL, '2025-10-25 08:50:30', '2025-11-01 11:22:17', 0, 0, 1, '', '', '2025-11-28 09:33:05'),
(8, 'marketing01', 'pbkdf2_sha256$870000$vqk1dAhM0HphZ6np3tZJbW$Qb2oN5pqu7pPuwbdeKqz3yVvepQoX7jvzg7UiPUIYUE=', 'marketing01@ebgreentek.vn', 'Vũ Hoài Marketing', 'viewer', 'active', NULL, '2025-09-20 09:30:45', '2025-11-02 10:18:22', 0, 0, 1, '', '', '2025-11-28 09:33:05'),
(9, 'seo01', 'pbkdf2_sha256$870000$vqk1dAhM0HphZ6np3tZJbW$Qb2oN5pqu7pPuwbdeKqz3yVvepQoX7jvzg7UiPUIYUE=', 'seo01@ebgreentek.vn', 'Trịnh Văn SEO', 'editor', 'active', NULL, '2025-11-05 15:33:19', '2025-11-07 09:44:00', 0, 0, 1, '', '', '2025-11-28 09:33:05'),
(10, 'designer01', 'pbkdf2_sha256$870000$vqk1dAhM0HphZ6np3tZJbW$Qb2oN5pqu7pPuwbdeKqz3yVvepQoX7jvzg7UiPUIYUE=', 'designer01@ebgreentek.vn', 'Bùi Thanh Thiết Kế', 'viewer', 'inactive', NULL, '2025-08-22 07:00:00', '2025-09-01 09:12:59', 0, 0, 1, '', '', '2025-11-28 09:33:05');

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_active_products`
-- (See below for the actual view)
--
CREATE TABLE `v_active_products` (
`id` varchar(36)
,`name` varchar(200)
,`category` varchar(100)
,`description` text
,`features` longtext
,`usage` text
,`ingredients` text
,`benefits` longtext
,`packaging` longtext
,`images` longtext
,`image_labels` longtext
,`status` enum('active','inactive')
,`is_popular` tinyint(1)
,`sort_order` int(11)
,`view_count` int(10) unsigned
,`created_at` datetime
,`updated_at` datetime
,`inquiry_count` bigint(21)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_dashboard_stats`
-- (See below for the actual view)
--
CREATE TABLE `v_dashboard_stats` (
`total_products` bigint(21)
,`total_articles` bigint(21)
,`new_contacts` bigint(21)
,`today_contacts` bigint(21)
,`total_product_views` decimal(32,0)
,`total_article_views` decimal(32,0)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_published_articles`
-- (See below for the actual view)
--
CREATE TABLE `v_published_articles` (
`id` varchar(36)
,`title` varchar(300)
,`category` varchar(100)
,`excerpt` text
,`content` longtext
,`image` varchar(500)
,`author` varchar(100)
,`tags` longtext
,`status` enum('published','draft')
,`is_featured` tinyint(1)
,`view_count` int(10) unsigned
,`read_time` varchar(20)
,`published_at` datetime
,`created_at` datetime
,`updated_at` datetime
);

-- --------------------------------------------------------

--
-- Structure for view `v_active_products`
--
DROP TABLE IF EXISTS `v_active_products`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_active_products`  AS SELECT `p`.`id` AS `id`, `p`.`name` AS `name`, `p`.`category` AS `category`, `p`.`description` AS `description`, `p`.`features` AS `features`, `p`.`usage` AS `usage`, `p`.`ingredients` AS `ingredients`, `p`.`benefits` AS `benefits`, `p`.`packaging` AS `packaging`, `p`.`images` AS `images`, `p`.`image_labels` AS `image_labels`, `p`.`status` AS `status`, `p`.`is_popular` AS `is_popular`, `p`.`sort_order` AS `sort_order`, `p`.`view_count` AS `view_count`, `p`.`created_at` AS `created_at`, `p`.`updated_at` AS `updated_at`, (select count(0) from `contacts` `c` where `c`.`message` like concat('%',`p`.`name`,'%')) AS `inquiry_count` FROM `products` AS `p` WHERE `p`.`status` = 'active' ORDER BY `p`.`is_popular` DESC, `p`.`sort_order` ASC, `p`.`created_at` DESC ;

-- --------------------------------------------------------

--
-- Structure for view `v_dashboard_stats`
--
DROP TABLE IF EXISTS `v_dashboard_stats`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_dashboard_stats`  AS SELECT (select count(0) from `products` where `products`.`status` = 'active') AS `total_products`, (select count(0) from `articles` where `articles`.`status` = 'published') AS `total_articles`, (select count(0) from `contacts` where `contacts`.`status` = 'new') AS `new_contacts`, (select count(0) from `contacts` where cast(`contacts`.`created_at` as date) = curdate()) AS `today_contacts`, (select coalesce(sum(`products`.`view_count`),0) from `products`) AS `total_product_views`, (select coalesce(sum(`articles`.`view_count`),0) from `articles`) AS `total_article_views` ;

-- --------------------------------------------------------

--
-- Structure for view `v_published_articles`
--
DROP TABLE IF EXISTS `v_published_articles`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_published_articles`  AS SELECT `articles`.`id` AS `id`, `articles`.`title` AS `title`, `articles`.`category` AS `category`, `articles`.`excerpt` AS `excerpt`, `articles`.`content` AS `content`, `articles`.`image` AS `image`, `articles`.`author` AS `author`, `articles`.`tags` AS `tags`, `articles`.`status` AS `status`, `articles`.`is_featured` AS `is_featured`, `articles`.`view_count` AS `view_count`, `articles`.`read_time` AS `read_time`, `articles`.`published_at` AS `published_at`, `articles`.`created_at` AS `created_at`, `articles`.`updated_at` AS `updated_at` FROM `articles` WHERE `articles`.`status` = 'published' AND (`articles`.`published_at` is null OR `articles`.`published_at` <= current_timestamp()) ORDER BY `articles`.`is_featured` DESC, `articles`.`published_at` DESC, `articles`.`created_at` DESC ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about_features`
--
ALTER TABLE `about_features`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_active` (`is_active`),
  ADD KEY `idx_sort` (`sort_order`);

--
-- Indexes for table `about_values`
--
ALTER TABLE `about_values`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_active` (`is_active`),
  ADD KEY `idx_sort` (`sort_order`);

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_action` (`action`),
  ADD KEY `idx_entity` (`entity_type`,`entity_id`),
  ADD KEY `idx_created` (`created_at`);

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_featured` (`is_featured`),
  ADD KEY `idx_published` (`published_at`);
ALTER TABLE `articles` ADD FULLTEXT KEY `idx_search` (`title`,`excerpt`,`content`);

--
-- Indexes for table `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indexes for table `auth_user`
--
ALTER TABLE `auth_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  ADD KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`);

--
-- Indexes for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  ADD KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_active` (`is_active`),
  ADD KEY `idx_parent` (`parent_id`);

--
-- Indexes for table `certifications`
--
ALTER TABLE `certifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_active` (`is_active`),
  ADD KEY `idx_sort` (`sort_order`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created` (`created_at`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `fk_replied_by` (`replied_by_id`);

--
-- Indexes for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`);

--
-- Indexes for table `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indexes for table `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `media_uploaded_by_id` (`uploaded_by_id`),
  ADD KEY `media_entity_type` (`entity_type`),
  ADD KEY `media_file_type` (`file_type`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_popular` (`is_popular`),
  ADD KEY `idx_sort` (`sort_order`);
ALTER TABLE `products` ADD FULLTEXT KEY `idx_search` (`name`,`description`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`),
  ADD KEY `idx_group` (`setting_group`);

--
-- Indexes for table `social_media`
--
ALTER TABLE `social_media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_active` (`is_active`),
  ADD KEY `idx_sort` (`sort_order`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_status` (`status`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `about_features`
--
ALTER TABLE `about_features`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `about_values`
--
ALTER TABLE `about_values`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `fk_activity_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Constraints for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Constraints for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `fk_categories_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `fk_contacts_replied_by` FOREIGN KEY (`replied_by_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `media_uploaded_by_id_fk` FOREIGN KEY (`uploaded_by_id`) REFERENCES `auth_user` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
