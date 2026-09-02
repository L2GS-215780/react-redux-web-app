-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 02, 2026 at 09:04 AM
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
(14, 'U2FsdGVkX18W4FUXgJFeGD1u7Oz2YNj5Iz5G1ciuIKg=', 'U2FsdGVkX19HIzGnbRFPF5Q1th7rh+f5odUPxEd6ncM=', 'Lorenz215780', '$2b$10$sHDL9UjMGszfVvJ6ItXQv.SDKH51bQ/sGvEE8cfy32rPm3KztpKd.', 'Admin', 1, '2026-09-02 06:06:34', '2026-09-02 06:06:34'),
(15, 'U2FsdGVkX1/kzhIwd87AtkYdw/QWr2R1JlySpjfplSs=', 'U2FsdGVkX1/Vlh7c2UEOoMEDrthOeXEYLrNK389Doi0=', 'user123', '$2b$10$f3FcUsFvYlKx9iND.9FjcuYDIToDwufrf1z/Jy1oRTgPrTRNb76bS', 'User', 1, '2026-09-02 07:00:31', '2026-09-02 07:00:31'),
(16, 'U2FsdGVkX18jcRwJLQzVvcsG/QF2jEvbowUl7UDqa4g=', 'U2FsdGVkX1/Km7uo61dkC90gomQOM7kDuRYktMPZkPQ=', 'user456', '$2b$10$Sf1L4JvAPUnwKxa0Z/oQnumfZxY/eTot7J9gnFV9AsUdW3Y4bsUmu', 'User', 1, '2026-09-02 07:01:20', '2026-09-02 07:01:20'),
(17, 'U2FsdGVkX1/ZJogSnIQr2kYWdx/WOjtNF5Bs8ARf3+A=', 'U2FsdGVkX1+Y6deGrm6QYqi6Z3qLsrYlbYyDh5RCxh8=', 'user789', '$2b$10$TRRy6veIYJfEHUTyT6iwMeO9zOOhY9nLXD.xC7p/gpoFNrcO1yvL2', 'User', 1, '2026-09-02 07:01:36', '2026-09-02 07:01:36');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

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
