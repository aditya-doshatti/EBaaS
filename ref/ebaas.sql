-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 30, 2020 at 10:05 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ebaas`
--

-- --------------------------------------------------------

--
-- Table structure for table `application`
--

CREATE TABLE `application` (
  `id` bigint(20) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `server` varchar(255) DEFAULT NULL,
  `launched` tinyint(1) NOT NULL DEFAULT 0,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `launched_on` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `application`
--

INSERT INTO `application` (`id`, `userid`, `name`, `description`, `server`, `launched`, `created_on`, `launched_on`) VALUES
(8, 7, 'test', NULL, NULL, 0, '2020-04-26 22:50:48', NULL),
(9, 8, 'TestApplication', NULL, NULL, 1, '2020-04-26 22:50:48', '2020-04-27 00:18:01');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` bigint(20) NOT NULL,
  `emailid` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `organisation` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `emailid`, `password`, `name`, `country`, `organisation`) VALUES
(7, 'xyz@getnada.com', '$2b$12$UcJqsloQAG6P5iT1cDstmOvSdRnhBOOeZ3VpZa/fBTjzpOb9.jOqa', 'xyz', NULL, NULL),
(8, 'testacc@gmail.com', '$2b$12$o0v1vf9LW7yoQNeJkvOqh.Pi1FAq8rGb.r92hSHV9TSdMr.eHUhgS', 'Test Account', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_databases`
--

CREATE TABLE `user_databases` (
  `id` bigint(11) NOT NULL,
  `userid` bigint(20) NOT NULL,
  `applicationid` bigint(20) NOT NULL,
  `connectionname` varchar(255) NOT NULL,
  `hostname` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `dbname` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_databases`
--

INSERT INTO `user_databases` (`id`, `userid`, `applicationid`, `connectionname`, `hostname`, `username`, `password`, `dbname`) VALUES
(8, 7, 8, 'myFirstConnection', 'localhost', 'root', 'root', 'ebaas'),
(15, 8, 9, 'demoConnection', 'localhost', 'root', 'root', 'demoDb'),
(16, 8, 9, 'demodb1', 'localhost', 'root', 'root', 'demodb1'),
(17, 8, 9, 'ebaasConnection', 'localhost', 'root', 'root', 'xyz'),
(18, 8, 9, 'ExcelDatabase', 'localhost', 'root', 'root', 'ExcelDatabase');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `application`
--
ALTER TABLE `application`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userid` (`userid`,`name`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `emailid` (`emailid`);

--
-- Indexes for table `user_databases`
--
ALTER TABLE `user_databases`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userid` (`userid`,`applicationid`,`hostname`,`username`,`password`,`dbname`),
  ADD UNIQUE KEY `userid_2` (`userid`,`connectionname`),
  ADD KEY `application_database` (`applicationid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `application`
--
ALTER TABLE `application`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `user_databases`
--
ALTER TABLE `user_databases`
  MODIFY `id` bigint(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `application`
--
ALTER TABLE `application`
  ADD CONSTRAINT `userId` FOREIGN KEY (`userid`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_databases`
--
ALTER TABLE `user_databases`
  ADD CONSTRAINT `application_database` FOREIGN KEY (`applicationid`) REFERENCES `application` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_database` FOREIGN KEY (`userid`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
