-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 05, 2023 at 04:09 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `t5_6958`
--
CREATE DATABASE IF NOT EXISTS `t5_6958` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `t5_6958`;

-- --------------------------------------------------------

--
-- Table structure for table `assigns`
--

DROP TABLE IF EXISTS `assigns`;
CREATE TABLE `assigns` (
  `assign_id` int(5) NOT NULL,
  `user_id` varchar(10) NOT NULL,
  `quiz_id` varchar(5) NOT NULL,
  `score` int(3) NOT NULL,
  `correct` varchar(4) NOT NULL,
  `incorrect` varchar(4) NOT NULL,
  `timestamps` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `assigns`
--

INSERT INTO `assigns` (`assign_id`, `user_id`, `quiz_id`, `score`, `correct`, `incorrect`, `timestamps`) VALUES
(7, 'USR2304001', 'QZ002', 60, '3', '2', '05-04-2023 20:49:40'),
(8, 'USR2304002', 'QZ002', 100, '5', '0', '05-04-2023 20:50:50'),
(9, 'USR2304002', 'QZ001', 60, '6', '4', '05-04-2023 20:59:41'),
(12, 'USR2304001', 'QZ001', 90, '9', '1', '05-04-2023 21:04:23');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` varchar(2) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
('10', 'Entertainment: Books'),
('11', 'Entertainment: Film'),
('12', 'Entertainment: Music'),
('13', 'Entertainment: Musicals & Theatres'),
('14', 'Entertainment: Television'),
('15', 'Entertainment: Video Games'),
('16', 'Entertainment: Board Games'),
('17', 'Science & Nature'),
('18', 'Science: Computers'),
('19', 'Science: Mathematics'),
('20', 'Mythology'),
('21', 'Sports'),
('22', 'Geography'),
('23', 'History'),
('24', 'Politics'),
('25', 'Art'),
('26', 'Celebrities'),
('27', 'Animals'),
('28', 'Vehicles'),
('29', 'Entertainment: Comics'),
('30', 'Science: Gadgets'),
('31', 'Entertainment: Japanese Anime & Manga'),
('32', 'Entertainment: Cartoon & Animations'),
('33', 'Mixed'),
('9', 'General Knowledge');

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

DROP TABLE IF EXISTS `quizzes`;
CREATE TABLE `quizzes` (
  `quiz_id` varchar(5) NOT NULL,
  `quiz_name` varchar(255) NOT NULL,
  `difficulty` varchar(6) NOT NULL,
  `category` varchar(50) NOT NULL,
  `questions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`questions`)),
  `deleted_at` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `quizzes`
--

INSERT INTO `quizzes` (`quiz_id`, `quiz_name`, `difficulty`, `category`, `questions`, `deleted_at`) VALUES
('QZ001', 'Random Quiz', 'Mixed', 'Mixed', '[{\"text\":\"Under what pseudonym did Stephen King publish five novels between 1977 and 1984?\",\"choices\":[\"Lewis Carroll\",\"Richard Bachman\",\"J. D. Robb\",\"Mark Twain\"],\"answer\":\"Richard Bachman\"},{\"text\":\"The United States of America declared their independence from the British Empire on July 4th, 1776.\",\"choices\":[\"False\",\"True\"],\"answer\":\"True\"},{\"text\":\"In vanilla Minecraft, which of the following cannot be made into a block?\",\"choices\":[\"Coal\",\"String\",\"Wheat\",\"Charcoal\"],\"answer\":\"Charcoal\"},{\"text\":\"What is the Finnish word for \\\"Finland\\\"?\",\"choices\":[\"Sverige\",\"Suomi\",\"Eesti\",\"Magyarország\"],\"answer\":\"Suomi\"},{\"text\":\"In \\\"A Certain Magical Index,\\\" what is Accelerator able to control?\",\"choices\":[\"Wormholes\",\"Velocity\",\"Quantums\",\"Vectors\"],\"answer\":\"Vectors\"},{\"text\":\"How many values can a single byte represent?\",\"choices\":[\"8\",\"256\",\"1\",\"1024\"],\"answer\":\"256\"},{\"text\":\"What NBC sitcom once saw two of its characters try to pitch NBC on a sitcom about nothing?\",\"choices\":[\"Becker\",\"Friends\",\"Frasier\",\"Seinfeld\"],\"answer\":\"Seinfeld\"},{\"text\":\"Which of the following is a class in the game \\\"Hearthstone\\\"?\",\"choices\":[\"Priest\",\"Cleric\",\"Sage\",\"Monk\"],\"answer\":\"Priest\"},{\"text\":\"What is the fastest road legal car in the world?\",\"choices\":[\"Koenigsegg Agera RS\",\"Bugatti Veyron Super Sport\",\"Hennessy Venom GT\",\"Pagani Huayra BC\"],\"answer\":\"Koenigsegg Agera RS\"},{\"text\":\"Wendy O. Koopa appeared in the Super Mario DIC Cartoons, but what was she known as?\",\"choices\":[\"Wendy Pie\",\"Honey Pie\",\"Sweetie Pie\",\"Kootie Pie\"],\"answer\":\"Kootie Pie\"}]', NULL),
('QZ002', 'Animal Quiz', 'Medium', 'Animals', '[{\"text\":\"What color/colour is a polar bear\'s skin?\",\"choices\":[\"Green\",\"White\",\"Black\",\"Pink\"],\"answer\":\"Black\"},{\"text\":\"The Platypus is a mammal.\",\"choices\":[\"False\",\"True\"],\"answer\":\"True\"},{\"text\":\"Which of these species is not extinct?\",\"choices\":[\"Japanese sea lion\",\"Komodo dragon\",\"Saudi gazelle\",\"Tasmanian tiger\"],\"answer\":\"Komodo dragon\"},{\"text\":\"What is the name of the family that the domestic cat is a member of?\",\"choices\":[\"Felidae\",\"Cat\",\"Felis\",\"Felinae\"],\"answer\":\"Felidae\"},{\"text\":\"What is the world\'s longest venomous snake?\",\"choices\":[\"Green Anaconda\",\"King Cobra\",\"Inland Taipan\",\"Yellow Bellied Sea Snake\"],\"answer\":\"King Cobra\"}]', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` varchar(10) NOT NULL,
  `username` varchar(255) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `display_name`, `password`) VALUES
('USR2304001', 'vigilant', 'xiao', 'asd123asd'),
('USR2304002', 'yuheng', 'keqing', '123asd123');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assigns`
--
ALTER TABLE `assigns`
  ADD PRIMARY KEY (`assign_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`quiz_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assigns`
--
ALTER TABLE `assigns`
  MODIFY `assign_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
