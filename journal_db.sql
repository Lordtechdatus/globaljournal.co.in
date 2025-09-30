-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 16, 2025 at 04:02 AM
-- Server version: 10.6.22-MariaDB-cll-lve
-- PHP Version: 8.3.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `journal_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(4, 'Prateek', 'admin@globaljournal.com', '$2y$10$PrgSAeQJpXQNMhH2R0kK6.PAyU7H6RikymZy4sw92qYgsTeBkaUXK', '2025-06-26 23:10:20');

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `author_id` int(11) NOT NULL,
  `status` enum('draft','submitted','published','rejected') DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contributors`
--

CREATE TABLE `contributors` (
  `id` int(11) NOT NULL,
  `submission_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `affiliation` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contributors`
--

INSERT INTO `contributors` (`id`, `submission_id`, `name`, `affiliation`, `role`) VALUES
(5, 4, 'Prateek Bajpai', '', 'Contributor, Primary Contact'),
(7, 6, 'Dharmendra Prajapati', '', 'Author, Primary Contact'),
(12, 11, 'Ram sharma', '', 'Author, Primary Contact'),
(16, 15, '', '', 'Author, Primary Contact');

-- --------------------------------------------------------

--
-- Table structure for table `newsubmissions`
--

CREATE TABLE `newsubmissions` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `abstract` text DEFAULT NULL,
  `keywords` text DEFAULT NULL,
  `editor_comments` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `submitted_by` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `newsubmissions`
--

INSERT INTO `newsubmissions` (`id`, `title`, `abstract`, `keywords`, `editor_comments`, `status`, `created_at`, `updated_at`, `submitted_by`) VALUES
(4, 'Guildlines', 'This is a test submission created for internal system validation purposes only. The manuscript title, authorship, and affiliations are placeholders and not associated with any real research. Please disregard this entry for editorial processing. If any automated notifications or actions are triggered, they may be ignored or used to verify functionality. Kindly let us know if any anomalies are observed during this test run.\n\nThank you,\nEditorial System QA Team', '[\"Editorial System QA Team\"]', 'This paper builds on our previous work in the field of AI ethics, specifically addressing recent developments in automated legal decision-making systems.', 'pending', '2025-05-06 17:17:28', '2025-05-06 17:48:18', '1'),
(6, 'AI-Driven Predictive Maintenance for Smart Infrastructure: A Novel Approach Using IoT and Machine Learning Integration for Sustainable Urban Development', 'Modern urban infrastructure demands intelligent maintenance systems to minimize downtime, reduce costs, and enhance safety. This research proposes a novel framework integrating IoT-enabled sensors and machine learning algorithms for predictive maintenance of civil structures, particularly in urban smart bridges and roads. The system collects real-time structural health dataâ€”vibration, strain, and temperatureâ€”and utilizes supervised learning (Random Forest and SVM) to predict failure likelihood. The study was implemented on a pilot basis using a scaled structural model embedded with sensors in Gwalior City, India. The model achieved an accuracy of 92.3% in predicting faults before occurrence, reducing maintenance time by 38% and cost by 27% compared to traditional methods. This paper provides compelling evidence for policymakers and city planners to adopt AI-integrated maintenance systems, marking a significant step toward resilient and sustainable infrastructure.', '[\"Smart infrastructure\",\"predictive maintenance\",\"machine learning\",\"IoT\",\"sustainability\",\"urban development\",\"structural health monitoring.\"]', 'This paper builds on our previous work in the field of AI ethics, specifically addressing recent developments in automated legal decision-making systems.', 'pending', '2025-05-07 12:01:06', '2025-05-07 12:01:06', '4'),
(9, 'The Interplay of Digital Transformational Leadership,', 'The rules of the game are changing in organizations due to several digital advances,\necosystems, industries, and felds. Also, the emergence of new institutional infrastructures and complex systems during this period can result in digital transformation (DT). Thus, new institutional theory should be examined to determine how new\ndigitally-enabled institutions emerge, difuse, and institutionalize within their contexts. The purpose of this study is to use a questionnaire approach to collect and\nanalyze quantitative data (n = 388) to test the model of how digital transformational\nleadership (DTL) infuences DT through organizational agility (OA). The data suggested that OA mediates the relationship between DTL and DT. Furthermore, it\nsheds light on the crucial role of DTL in DT through OA, demonstrating that alignment of organizational models and evolving OA are critical to DT. Ultimately, this\nwork provides important insights into leadership styles and organization agility in\nthe public sector concerning digital transformation.', '[\"Organizational agility \\u00b7 Cambodia \\u00b7 Digital transformational leadership \\u00b7 New institutional theory \\u00b7 Digital transformation \\u00b7 PLS-SEM\"]', 'This paper builds on our previous work in the field of AI ethics, specifically addressing recent developments in automated legal decision-making systems.', 'pending', '2025-06-26 07:22:21', '2025-06-26 07:22:21', '10'),
(11, 'Leveraging Earned Value Analysis for Timely Decision-Making in Construction Projects', 'Timely and informed decision-making is critical to the successful delivery of construction\nprojects. This paper investigates how earned value analysis (EVA) serves as a powerful\nmethodology for driving data-driven decisions throughout the project lifecycle. By\nsystematically integrating EVA with construction management processes, we demonstrate its\neffectiveness in tracking project performance, predicting potential delays and cost overruns,\nand facilitating corrective actions. Through an in-depth analysis of real-world construction\nprojects, we examine key EVA indicators, including Cost Performance Index (CPI), Schedule\nPerformance Index (SPI), and Estimate at Completion (EAC) - and their role in enabling\nproject managers to optimize resource allocation, revise schedules, and maintain financial\ncontrol. The findings reveal that EVA provides a structured framework for early problem\ndetection, risk mitigation, and performance improvement, ultimately leading to more\npredictable project outcomes. The study concludes with practical guidelines for implementing\nEVA in construction environments to enhance transparency, stakeholder communication, and\noverall project success.', '[\"Earned Value Analysis\",\"Construction project control\",\"Decision-making\",\"Predictive analytics\"]', 'This paper builds on our previous work in the field of AI ethics, specifically addressing recent developments in automated legal decision-making systems.', 'pending', '2025-07-03 11:29:39', '2025-07-03 11:29:39', '2'),
(15, '<p><strong>Impact of smart city</strong></p>', 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.', '[\"Adoption of smart healthcare technologies\"]', '<p>Kamal sharma department of computer science and engineering </p>', 'pending', '2025-07-14 10:49:36', '2025-07-14 10:49:36', '2');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiry` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`id`, `user_id`, `token`, `expiry`, `created_at`) VALUES
(33, 2, '4a0c7e5eb9bebb0bccdfd3a48a5c44391b275749149f6362236d639677010c94', '2025-05-11 02:42:49', '2025-05-10 20:12:50');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `report_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`report_id`, `user_id`, `file_name`, `created_at`, `updated_at`) VALUES
(1, 1, 'report_20250510_184056_report_20250510_182317_EIBO_Junaid_Offer.docx', '2025-05-10 06:10:56', '2025-05-10 06:10:56'),
(2, 1, 'report_20250510_184121_Copy_of_Dilotte_Resume_Template.docx', '2025-05-10 06:11:21', '2025-05-10 06:11:21'),
(4, 1, 'report_20250510_185715_report_20250510_182317_EIBO_Junaid_Offer.docx', '2025-05-10 06:27:15', '2025-05-10 06:27:15'),
(12, 2, 'report_20250703_145112_APF_sandeep.docx', '2025-07-03 02:21:12', '2025-07-03 02:21:12'),
(13, 2, 'report_20250703_165818_Paper_KD__3_.docx', '2025-07-03 04:28:18', '2025-07-03 04:28:18'),
(14, 2, 'report_20250710_155500_ppt_sharwani.docx', '2025-07-10 03:25:00', '2025-07-10 03:25:00'),
(15, 12, 'report_20250714_115501_Front_page.docx', '2025-07-13 23:25:01', '2025-07-13 23:25:01'),
(16, 2, 'report_20250714_145231_equations.docx', '2025-07-14 02:22:31', '2025-07-14 02:22:31'),
(17, 2, 'report_20250714_150532_equations.docx', '2025-07-14 02:35:32', '2025-07-14 02:35:32'),
(18, 2, 'report_20250714_150903_equations.docx', '2025-07-14 02:39:03', '2025-07-14 02:39:03'),
(19, 2, 'report_20250714_152944_report.docx', '2025-07-14 02:59:44', '2025-07-14 02:59:44'),
(20, 2, 'report_20250714_161838_Farmer_Nanital_Synopsis.docx', '2025-07-14 03:48:38', '2025-07-14 03:48:38'),
(21, 2, 'report_20250802_150537_Thesis_Khyati.docx', '2025-08-02 02:35:37', '2025-08-02 02:35:37');

-- --------------------------------------------------------

--
-- Table structure for table `submissions`
--

CREATE TABLE `submissions` (
  `id` int(11) NOT NULL,
  `article_id` int(11) NOT NULL,
  `submitted_by` int(11) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `feedback` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `submission_files`
--

CREATE TABLE `submission_files` (
  `id` int(11) NOT NULL,
  `submission_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `author_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `submission_files`
--

INSERT INTO `submission_files` (`id`, `submission_id`, `name`, `size`, `type`, `author_name`) VALUES
(7, 6, 'dharmendra paper.docx', '20', 'Supplementary Material', 'Dharmendra Prajapati'),
(14, 11, 'report_20250703_165818_Paper_KD__3_.docx', '1331', 'Supplementary Material', NULL),
(18, 15, 'report_20250714_161838_Farmer_Nanital_Synopsis.docx', '38', 'Supplementary Material', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `title`
--

CREATE TABLE `title` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `submitted_by` int(11) NOT NULL,
  `status` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `title`
--

INSERT INTO `title` (`id`, `title`, `submitted_by`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Testing', 1, 'pending', '2025-05-06 14:36:32', '2025-05-06 14:36:32'),
(2, 'Testing', 1, 'pending', '2025-05-06 15:16:02', '2025-05-06 15:16:02'),
(3, 'Guidelines', 1, 'pending', '2025-05-06 17:13:26', '2025-05-06 17:13:26'),
(4, 'Test', 1, 'pending', '2025-05-07 11:34:22', '2025-05-07 11:34:22'),
(5, 'Smart Predictive Maintenance of Urban Infrastructure Using IoT-Enabled Machine Learning: A Sustainable Approach for Structural Resilience', 4, 'pending', '2025-05-07 11:58:11', '2025-05-07 11:58:11');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `affiliation` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `phonenumber` varchar(15) DEFAULT NULL,
  `orcid_id` varchar(255) DEFAULT NULL,
  `areas_of_interest` text DEFAULT NULL,
  `agree_to_privacy` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `password`, `affiliation`, `country`, `phonenumber`, `orcid_id`, `areas_of_interest`, `agree_to_privacy`, `created_at`, `updated_at`) VALUES
(1, 'Junaid K', 'jk@123', 'junaidk8185@gmail.com', '$2y$10$VF4eTtwmvcHD4jwemAx0Z.FtsKHqu0IEtTHIMAuRtdFKfEcyL7ejC', 'Indian Institute of Technology Madras', 'India', NULL, '', '', 0, '2025-05-06 13:04:14', '2025-05-10 12:25:41'),
(2, 'Prateek Bajpai', 'prateek1854', 'prateekvajpai1854@gmail.com', '$2y$10$5OwdRR.yZ12xV.eTXokcIu8ZJzgL09QYRAh9Cys4tEmWjUmInKX5e', 'Madhav Institute of Technology and Science', 'India', '7470439101', '', '', 0, '2025-05-06 17:10:16', '2025-05-27 10:50:25'),
(4, 'Dharmendra Prajapati', 'dh22', 'dharm.pra18@gmail.com', '$2y$10$3adz2QGX9V7GcPqq2S868eVPvOf8hppjl7FiRWXm9wFi0c1q0AbRO', 'MITS', 'India', NULL, '', '', 0, '2025-05-07 11:56:21', '2025-05-07 11:56:21'),
(11, 'Ram sharma', 'ram555', 'ramsharma@555gmail.com', '$2y$10$7YZVY5PPO8iodxe/Nl0KfO3OxHSQqAcUaCdLZmIseLVce7GIhqMPa', 'Indian Institute of Technology Madras', 'India', '7772887731', '', '', 0, '2025-07-04 07:20:53', '2025-07-04 07:20:53'),
(12, 'Mayank Ratmele', 'Mayank', 'ratmelem@gmail.com', '$2y$10$yfWWZtD0bFxxv/UAi7/1aOmtIxf.IyAvjJRndXRTxtxx4g2zcsGt2', 'Madhav Institute of Technology and Science', 'India', '8827501525', '', '', 0, '2025-07-14 06:20:59', '2025-07-14 06:20:59');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `contributors`
--
ALTER TABLE `contributors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `submission_id` (`submission_id`);

--
-- Indexes for table `newsubmissions`
--
ALTER TABLE `newsubmissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `token` (`token`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`report_id`);

--
-- Indexes for table `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `article_id` (`article_id`),
  ADD KEY `submitted_by` (`submitted_by`);

--
-- Indexes for table `submission_files`
--
ALTER TABLE `submission_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `submission_id` (`submission_id`);

--
-- Indexes for table `title`
--
ALTER TABLE `title`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `contributors`
--
ALTER TABLE `contributors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `newsubmissions`
--
ALTER TABLE `newsubmissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `submissions`
--
ALTER TABLE `submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `submission_files`
--
ALTER TABLE `submission_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `title`
--
ALTER TABLE `title`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `contributors`
--
ALTER TABLE `contributors`
  ADD CONSTRAINT `contributors_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `newsubmissions` (`id`);

--
-- Constraints for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `submissions`
--
ALTER TABLE `submissions`
  ADD CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`),
  ADD CONSTRAINT `submissions_ibfk_2` FOREIGN KEY (`submitted_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `submission_files`
--
ALTER TABLE `submission_files`
  ADD CONSTRAINT `submission_files_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `newsubmissions` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
