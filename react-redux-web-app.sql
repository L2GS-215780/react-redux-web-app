-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 10, 2026 at 09:51 AM
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
-- Database: `react-redux-web-app`
--

-- --------------------------------------------------------

--
-- Table structure for table `message_board`
--

CREATE TABLE `message_board` (
  `id` int(11) NOT NULL,
  `user_id_fk` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_deleted` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_accounts`
--

CREATE TABLE `users_accounts` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `user_role` enum('Admin','User') DEFAULT NULL,
  `is_active` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_accounts`
--

INSERT INTO `users_accounts` (`id`, `first_name`, `last_name`, `user_name`, `password`, `user_role`, `is_active`, `created_at`, `updated_at`) VALUES
(23, 'U2FsdGVkX1/4zX03IOAtpMJIWmtLAIradtQVYxnHeYU=', 'U2FsdGVkX18NTEktyKr8U7Lu55LzBXP5ifLybjFPzSA=', 'Lorenz215780', '$2b$10$VZVt6KQOc5iuR2no42EK8er79Cht1/t94jREPPaUbQvWt2iIMGVXK', 'Admin', 1, '2026-09-08 06:52:57', '2026-09-08 06:52:57'),
(24, 'U2FsdGVkX19HTK0vdvSFZPbxkOP2yCCUy3e4AJCnbeE=', 'U2FsdGVkX19f8l/6MYLOzELEDPDlIp5Jv05ixV7supg=', 'John123', '$2b$10$O/tAcp4Rz2N63zgw/j628.WQwguGwtchM3mOJUIhoazINt06p36I.', 'User', 1, '2026-09-10 03:19:24', '2026-09-10 03:19:24'),
(25, 'U2FsdGVkX1+h5xpfoCt8uZx1oN+ZldZZjhP/swtflBw=', 'U2FsdGVkX1+gnT90TqRqizq8ggX4QlRApPtqwTq1sgA=', 'Jane123', '$2b$10$qL2z6ZA0sXhqGpT1DX989.tFhrsSrqfIpbwPfmbXlBwoFlfTCT0.6', 'User', 1, '2026-09-10 03:19:51', '2026-09-10 03:19:51'),
(27, 'U2FsdGVkX19SIqKTZ8fJ+/saBvLplaqOjFae/lVeKx8=', 'U2FsdGVkX1+KWoci+crKUfIz4Xw8lONyb4DkFGsCP2A=', 'Remy123', '$2b$10$ztP5pSIiYsSiZEJ0tL751eM/DPdegNkDwBZ2FoYNVyTlcl9gcyDRO', 'User', 1, '2026-09-10 03:31:12', '2026-09-10 03:31:12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `message_board`
--
ALTER TABLE `message_board`
  ADD PRIMARY KEY (`id`),
  ADD KEY `message_board_user_id_fk` (`user_id_fk`);

--
-- Indexes for table `users_accounts`
--
ALTER TABLE `users_accounts`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `message_board`
--
ALTER TABLE `message_board`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users_accounts`
--
ALTER TABLE `users_accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `message_board`
--
ALTER TABLE `message_board`
  ADD CONSTRAINT `message_board_user_id_fk` FOREIGN KEY (`user_id_fk`) REFERENCES `users_accounts` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
