-- ============================================================
-- GitHub Repository & Developer Activity Database
-- Final SQL Project: Part 2 Tables + Part 3 Queries
-- Team: Chenxi Liu (cl4776), Haoyi Tan (ht2717)
-- Data sources: github_users.csv and GitHub_repo_metadata.csv
--
-- Notes:
-- 1. This script uses a cleaned subset of the original CSV data.
-- 2. Repository owners are stored as developers, so each repository
--    correctly links to its real GitHub owner.
-- 3. The database is normalized into developer, repository, metric,
--    language lookup, and company lookup tables.
-- ============================================================

DROP DATABASE IF EXISTS github_activity_db;
CREATE DATABASE github_activity_db;
USE github_activity_db;

-- ============================================================
-- Part 2: Database Tables
-- ============================================================

-- Lookup Table 1: Companies
CREATE TABLE companies (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL,
    UNIQUE INDEX uix_company_name (company_name)
);

INSERT INTO companies (company_name) VALUES
  ('Independent Developer'),
  ('University of British Columbia'),
  ('Amazon Web Services'),
  ('LaunchCode'),
  ('IBM Cloud'),
  ('digipodium'),
  ('IBM'),
  ('Academis');

-- Lookup Table 2: Programming Languages
CREATE TABLE languages (
    language_id INT AUTO_INCREMENT PRIMARY KEY,
    language_name VARCHAR(100) NOT NULL,
    UNIQUE INDEX uix_language_name (language_name)
);

INSERT INTO languages (language_name) VALUES
  ('Python'),
  ('Unknown'),
  ('R'),
  ('SQL'),
  ('JavaScript');

-- Parent Table: Developers
CREATE TABLE developers (
    developer_id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(100) NOT NULL,
    full_name VARCHAR(150),
    company_id INT,
    location VARCHAR(150),
    followers INT NOT NULL DEFAULT 0,
    following INT NOT NULL DEFAULT 0,
    public_repos INT NOT NULL DEFAULT 0,
    account_created_date DATE,
    account_updated_date DATE,
    UNIQUE INDEX uix_developer_login (login),
    INDEX ix_developer_location (location),
    INDEX ix_developer_followers (followers),
    CONSTRAINT fk_developers_company
        FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

INSERT INTO developers
  (developer_id, login, full_name, company_id, location, followers, following, public_repos, account_created_date, account_updated_date)
VALUES
  (1, 'UBC-MDS', 'Master of Data Science at the University of British Columbia', 2, 'Vancouver, BC, Canada', 122, 0, 892, '2015-10-23', '2023-03-29'),
  (2, 'aws-samples', 'AWS Samples', 3, NULL, 7843, 0, 5223, '2014-09-26', '2023-05-10'),
  (3, 'LaunchCodeEducation', 'LaunchCode Education', 4, 'United States of America', 103, 0, 231, '2016-01-12', '2023-09-15'),
  (4, 'zaid-kamil', 'zaid kamil', 6, 'lucknow', 290, 17, 444, '2013-09-19', '2023-09-27'),
  (5, 'jt6860', 'jt6860', 1, NULL, 0, 0, 9, NULL, NULL),
  (6, 'prabhatdash', 'prabhatdash', 1, NULL, 0, 0, 7, NULL, NULL),
  (7, 'heathermrauch', 'heathermrauch', 1, NULL, 0, 0, 6, NULL, NULL),
  (8, 'rajatsonar22', 'rajatsonar22', 1, NULL, 0, 0, 6, NULL, NULL),
  (9, 'ssameldeeb', 'ssameldeeb', 1, NULL, 0, 0, 6, NULL, NULL),
  (10, 'a731062834', 'a731062834', 1, NULL, 0, 0, 6, NULL, NULL),
  (11, 'atasayginodabasi', 'atasayginodabasi', 1, NULL, 0, 0, 6, NULL, NULL),
  (12, 'Jane-Dream', 'Jane-Dream', 1, NULL, 0, 0, 6, NULL, NULL),
  (13, 'datainpoint', 'datainpoint', 1, NULL, 0, 0, 6, NULL, NULL),
  (14, 'ArturasVan', 'ArturasVan', 1, NULL, 0, 0, 5, NULL, NULL),
  (15, 'arda-ornek', 'arda-ornek', 1, NULL, 0, 0, 5, NULL, NULL),
  (16, 'ruslanmv', 'Ruslan Magana Vsevolodovna', 7, 'Italy', 80, 2, 193, '2019-06-02', '2023-09-27'),
  (17, 'MahmoudHesham099', 'Mahmoud Hesham', 1, 'Cairo , Egypt', 153, 18, 52, '2019-07-03', '2023-09-28'),
  (18, 'krother', 'Kristian Rother', 8, 'Berlin, Germany', 351, 27, 62, '2009-07-31', '2023-08-31'),
  (19, 'ibm-cloud-architecture', 'IBM Cloud Architecture & Solution Engineering', 5, NULL, 78, 0, 313, '2016-03-31', '2023-06-12'),
  (20, 'johnehunt', 'Dr John Hunt', 1, NULL, 73, 0, 76, '2014-08-06', '2023-08-02');

-- Child Table 1: Repositories
CREATE TABLE repositories (
    repo_id INT AUTO_INCREMENT PRIMARY KEY,
    developer_id INT NOT NULL,
    language_id INT NOT NULL,
    repo_name VARCHAR(255) NOT NULL,
    github_url VARCHAR(300) NOT NULL,
    description TEXT,
    has_readme TINYINT(1) NOT NULL DEFAULT 0,
    created_date DATE,
    updated_date DATE,
    pushed_date DATE,
    UNIQUE INDEX uix_github_url (github_url),
    INDEX ix_repo_name (repo_name),
    INDEX ix_repo_created_date (created_date),
    CONSTRAINT fk_repositories_developer
        FOREIGN KEY (developer_id) REFERENCES developers(developer_id),
    CONSTRAINT fk_repositories_language
        FOREIGN KEY (language_id) REFERENCES languages(language_id)
);

INSERT INTO repositories
  (repo_id, developer_id, language_id, repo_name, github_url, description, has_readme, created_date, updated_date, pushed_date)
VALUES
  (1, 1, 1, 'simpler_eda', 'https://github.com/UBC-MDS/simpler_eda', 'Python package that eases the pain of plotting numeric and categorical features in Altair', 1, '2021-02-25', '2021-03-27', '2021-03-27'),
  (2, 1, 1, 'pymleda', 'https://github.com/UBC-MDS/pymleda', 'Python package that helps with preliminary eda for supervised machine learning tasks.', 1, '2021-02-25', '2021-03-26', '2021-03-26'),
  (3, 1, 1, 'eda_utils_py', 'https://github.com/UBC-MDS/eda_utils_py', 'This package focuses on the tasks of dealing with outlier and missing values, scaling, and correlation visualization.', 1, '2021-02-24', '2021-03-21', '2021-03-21'),
  (4, 2, 5, 'aws-remote-desktop-for-eda', 'https://github.com/aws-samples/aws-remote-desktop-for-eda', 'Launch Xilinx Vivado Design Suite using a DCV Remote Desktop on AWS', 1, '2019-08-14', '2025-04-02', '2021-05-12'),
  (5, 2, 4, 'kinesis-data-analytics-stream-to-dynamodb', 'https://github.com/aws-samples/kinesis-data-analytics-stream-to-dynamodb', NULL, 1, '2021-04-08', '2022-11-16', '2021-09-17'),
  (6, 2, 1, 'devday-mwaa-elt-workflows', 'https://github.com/aws-samples/devday-mwaa-elt-workflows', 'Materials to support the DevDay Data Analytics session on building ELT workflows using Apache Airflow. Details on how to reproduce the demos used during the session are provided in this repository.', 1, '2021-09-03', '2021-10-24', '2021-09-07'),
  (7, 3, 1, 'classes-studio-data-analysis', 'https://github.com/LaunchCodeEducation/classes-studio-data-analysis', NULL, 0, '2021-08-26', '2021-08-26', '2021-08-26'),
  (8, 3, 1, 'dictionaries-studio-data-analysis', 'https://github.com/LaunchCodeEducation/dictionaries-studio-data-analysis', NULL, 0, '2021-08-26', '2021-08-26', '2021-08-26'),
  (9, 3, 1, 'functions-studio-data-analysis', 'https://github.com/LaunchCodeEducation/functions-studio-data-analysis', NULL, 0, '2021-08-24', '2021-08-24', '2021-08-24'),
  (10, 4, 1, 'EDA-on-food-choices-and-preferences-of-Students', 'https://github.com/zaid-kamil/EDA-on-food-choices-and-preferences-of-Students', NULL, 0, '2021-08-29', '2025-02-25', '2021-08-29'),
  (11, 4, 1, 'EDA_app', 'https://github.com/zaid-kamil/EDA_app', NULL, 0, '2021-10-29', '2021-10-29', '2021-10-29'),
  (12, 4, 5, 'pokemon-data-analysis-app', 'https://github.com/zaid-kamil/pokemon-data-analysis-app', NULL, 0, '2023-02-26', '2023-02-26', '2023-02-26'),
  (13, 5, 4, 'CS367Proj5', 'https://github.com/jt6860/CS367Proj5', 'Fifth project for CS367 - Streaming Data Analytics - Ingesting Stock Market Order Streaming Data from PubNub & Predicting Future Market Orders', 0, '2023-12-14', '2023-12-14', '2023-12-14'),
  (14, 5, 1, 'CS367Proj4', 'https://github.com/jt6860/CS367Proj4', 'Fourth project for CS367 - Streaming Data Analytics - Ingesting Wikipedia Streaming Data from PubNub & Converting to PySpark', 0, '2023-12-14', '2023-12-14', '2023-12-14'),
  (15, 5, 1, 'CS367Proj3', 'https://github.com/jt6860/CS367Proj3', 'Third project for CS367 - Streaming Data Analytics - Ingesting Twitter Streaming Data from PubNub & Applying ML Algorithms', 0, '2023-12-14', '2023-12-14', '2023-12-14'),
  (16, 6, 1, 'APSJ20G2_SALES_DATA_ANALYSIS', 'https://github.com/prabhatdash/APSJ20G2_SALES_DATA_ANALYSIS', 'Armita Bora | Chinmoy Jyoti Borah | Diksha Pandey', 0, '2020-11-08', '2021-04-27', '2021-02-26'),
  (17, 6, 1, 'APSJ21G7_ZOMATO_DATA_ANALYSIS', 'https://github.com/prabhatdash/APSJ21G7_ZOMATO_DATA_ANALYSIS', NULL, 0, '2022-03-02', '2022-03-12', '2022-03-12'),
  (18, 6, 1, 'APSJ21G3_EXAM_DATA_ANALYSIS', 'https://github.com/prabhatdash/APSJ21G3_EXAM_DATA_ANALYSIS', NULL, 0, '2022-03-02', '2022-12-03', '2022-03-09'),
  (19, 7, 3, 'MS_DA-advanced_data_analytics', 'https://github.com/heathermrauch/MS_DA-advanced_data_analytics', 'This project was completed during the completion of the Master of Science degree in Data Analytics from Western Governors University', 1, '2023-09-29', '2023-09-29', '2023-09-29'),
  (20, 7, 3, 'MS_DA-data_mining_2', 'https://github.com/heathermrauch/MS_DA-data_mining_2', 'This project was completed during the completion of the Master of Science degree in Data Analytics from Western Governors University', 1, '2023-09-29', '2023-09-29', '2023-09-29'),
  (21, 7, 3, 'MS_DA-data_mining_1', 'https://github.com/heathermrauch/MS_DA-data_mining_1', 'This project was completed during the completion of the Master of Science degree in Data Analytics from Western Governors University', 1, '2023-09-28', '2023-09-28', '2023-09-28'),
  (22, 8, 1, 'Addition-of-two-matrices', 'https://github.com/rajatsonar22/Addition-of-two-matrices', 'Addition of two matrices using the concept (Data analysis of algorithim)', 0, '2024-06-18', '2024-06-18', '2024-06-18'),
  (23, 8, 1, 'Searching-an-element-in-the-list-', 'https://github.com/rajatsonar22/Searching-an-element-in-the-list-', 'This program is to search the element in the list using the concept (Data analysis and algorithim', 0, '2024-06-18', '2024-06-18', '2024-06-18'),
  (24, 8, 1, 'Searching-an-element-', 'https://github.com/rajatsonar22/Searching-an-element-', 'In this program we are going to search an element using concept (Data analysis and algorithim', 0, '2024-06-18', '2024-06-18', '2024-06-18'),
  (25, 9, 1, 'Egypt_Map_Project', 'https://github.com/ssameldeeb/Egypt_Map_Project', 'data analysis and machine learning for Egypt_Map and using power bi', 0, '2022-03-14', '2022-03-14', '2022-03-14'),
  (26, 9, 4, 'welmart_all_sales', 'https://github.com/ssameldeeb/welmart_all_sales', 'data analysis and machine learning for welmart_all_sales', 0, '2022-03-08', '2022-03-08', '2022-03-08'),
  (27, 9, 1, 'Football_score_temes_project', 'https://github.com/ssameldeeb/Football_score_temes_project', 'Data analysis and machine learning for Football_temes_data', 0, '2022-03-01', '2022-03-01', '2022-03-01'),
  (28, 10, 1, 'data-analysis-tools-dog', 'https://github.com/a731062834/data-analysis-tools-dog', NULL, 1, '2024-03-09', '2024-03-09', '2024-03-14'),
  (29, 10, 1, 'data-analysis-tools-eth', 'https://github.com/a731062834/data-analysis-tools-eth', NULL, 1, '2024-03-09', '2024-03-09', '2024-03-14'),
  (30, 10, 1, 'data-analysis-tools-cat', 'https://github.com/a731062834/data-analysis-tools-cat', NULL, 1, '2024-03-09', '2024-03-09', '2024-03-14'),
  (31, 11, 1, 'video_game_sales_exploratory_data_analysis', 'https://github.com/atasayginodabasi/video_game_sales_exploratory_data_analysis', 'https://www.kaggle.com/code/atasaygin/video-game-sales-exploratory-data-analysis', 0, '2022-06-03', '2022-06-24', '2022-06-03'),
  (32, 11, 1, 'student_performance_in_exams_EDA', 'https://github.com/atasayginodabasi/student_performance_in_exams_EDA', 'https://www.kaggle.com/code/atasaygin/student-performance-in-exams-eda', 0, '2022-06-03', '2022-06-24', '2022-06-03'),
  (33, 11, 1, 'spaceship_titanic_EDA_and_stacked_model', 'https://github.com/atasayginodabasi/spaceship_titanic_EDA_and_stacked_model', 'https://www.kaggle.com/code/atasaygin/spaceship-titanic-eda-and-stacked-model-top-10', 0, '2022-06-03', '2022-06-24', '2022-06-03'),
  (34, 12, 1, 'data-analysis-tools-jms-seg', 'https://github.com/Jane-Dream/data-analysis-tools-jms-seg', NULL, 1, '2024-03-15', '2024-03-15', '2024-03-21'),
  (35, 12, 5, 'data-analysis-vector-tool-jms', 'https://github.com/Jane-Dream/data-analysis-vector-tool-jms', NULL, 1, '2024-03-15', '2024-03-15', '2024-03-15'),
  (36, 12, 5, 'data-analysis-uie-extract-tool-jms', 'https://github.com/Jane-Dream/data-analysis-uie-extract-tool-jms', NULL, 1, '2024-03-15', '2024-03-15', '2024-03-15'),
  (37, 13, 1, 'asgmt-2-programming-and-data-analysis-2023', 'https://github.com/datainpoint/asgmt-2-programming-and-data-analysis-2023', 'Assignment 2: Programming and Data Analysis 2023.', 1, '2023-09-28', '2023-09-28', '2023-09-28'),
  (38, 13, 1, 'asgmt-1-programming-and-data-analysis-2023', 'https://github.com/datainpoint/asgmt-1-programming-and-data-analysis-2023', 'Assignment 1: Programming and Data Analysis 2023.', 1, '2023-09-13', '2023-09-14', '2023-09-14'),
  (39, 13, 1, 'final-programming-and-data-analysis-2023', 'https://github.com/datainpoint/final-programming-and-data-analysis-2023', 'Final: Programming and Data Analysis 2023.', 1, '2023-12-18', '2023-12-21', '2023-12-21'),
  (40, 14, 1, 'DataAnalysisTask5Python', 'https://github.com/ArturasVan/DataAnalysisTask5Python', NULL, 1, '2021-06-29', '2021-06-29', '2021-06-29'),
  (41, 14, 1, 'DataAnalysisTask4Python', 'https://github.com/ArturasVan/DataAnalysisTask4Python', NULL, 1, '2021-06-28', '2021-06-29', '2021-06-29'),
  (42, 14, 1, 'DataAnalysisTask3Python', 'https://github.com/ArturasVan/DataAnalysisTask3Python', NULL, 1, '2021-06-26', '2021-06-28', '2021-06-28'),
  (43, 15, 1, 'sea-level-predictor', 'https://github.com/arda-ornek/sea-level-predictor', 'Practice project for Data Analysis with Python', 1, '2022-08-13', '2022-09-30', '2022-08-13'),
  (44, 15, 1, 'page-view-time-series-visualizer', 'https://github.com/arda-ornek/page-view-time-series-visualizer', 'Practice project for Data Analysis with Python', 1, '2022-08-13', '2022-09-30', '2022-08-13'),
  (45, 15, 1, 'medical-data-visualizer', 'https://github.com/arda-ornek/medical-data-visualizer', 'Practice project for Data Analysis with Python', 1, '2022-08-13', '2022-09-30', '2022-08-13'),
  (46, 16, 4, 'Data-Analysis-with-Spark-on-EMR-cluster', 'https://github.com/ruslanmv/Data-Analysis-with-Spark-on-EMR-cluster', 'How to perform Data Analytics with Spark on EMR cluster', 1, '2021-09-28', '2021-09-28', '2021-09-28'),
  (47, 16, 1, 'Performing-Real-Time-Data-Analysis-with-Kinesis', 'https://github.com/ruslanmv/Performing-Real-Time-Data-Analysis-with-Kinesis', 'Performing Real-Time Data Analysis with Kinesis', 1, '2021-09-22', '2021-09-23', '2021-09-23'),
  (48, 17, 1, 'Premier-League-Python-Data-Analysis', 'https://github.com/MahmoudHesham099/Premier-League-Python-Data-Analysis', 'YouTube Video Link: https://youtu.be/PBK8PzSx2ro', 1, '2021-08-20', '2021-08-23', '2021-08-22'),
  (49, 17, 3, 'Python-FPL-Data-Analysis', 'https://github.com/MahmoudHesham099/Python-FPL-Data-Analysis', 'YouTube Video Link: https://youtu.be/uOixWZ-Ejl0', 1, '2021-08-10', '2021-08-11', '2021-08-10'),
  (50, 18, 3, 'Spreadsheet_Tutorial', 'https://github.com/krother/Spreadsheet_Tutorial', 'Course material in German for a one-day beginners course in data analysis with Spreadsheets (OpenOffice, Excel etc.)', 1, '2015-06-01', '2021-12-10', '2021-12-10'),
  (51, 18, 1, 'data_analytics', 'https://github.com/krother/data_analytics', 'Kursmaterialien zum Data Analytics Kurs', 0, '2024-03-11', '2024-03-11', '2024-03-11'),
  (52, 19, 5, 'refarch-eda-store-simulator', 'https://github.com/ibm-cloud-architecture/refarch-eda-store-simulator', NULL, 1, '2020-10-06', '2021-10-28', '2024-09-16'),
  (53, 19, 4, 'refarch-eda', 'https://github.com/ibm-cloud-architecture/refarch-eda', 'Event-Driven Architecture Reference Architecture solution implementation and guidances.', 1, '2018-10-19', '2025-03-13', '2024-03-18'),
  (54, 20, 1, 'python-covid-data-analysis', 'https://github.com/johnehunt/python-covid-data-analysis', NULL, 1, '2021-10-22', '2022-02-07', '2021-10-22'),
  (55, 20, 1, 'DataAnalysisProject', 'https://github.com/johnehunt/DataAnalysisProject', 'Research Project', 1, '2022-10-21', '2022-10-23', '2022-11-13');

-- Child Table 2: Repository Metrics
CREATE TABLE repository_metrics (
    metric_id INT AUTO_INCREMENT PRIMARY KEY,
    repo_id INT NOT NULL,
    stars INT NOT NULL DEFAULT 0,
    forks INT NOT NULL DEFAULT 0,
    watchers INT NOT NULL DEFAULT 0,
    open_issues_count INT NOT NULL DEFAULT 0,
    open_pulls_count INT NOT NULL DEFAULT 0,
    contributors_count INT NOT NULL DEFAULT 0,
    release_count INT NOT NULL DEFAULT 0,
    commit_count INT NOT NULL DEFAULT 0,
    file_count INT NOT NULL DEFAULT 0,
    readme_size_bytes INT,
    community_health_percentage DECIMAL(5,2),
    workflow_count INT NOT NULL DEFAULT 0,
    UNIQUE INDEX uix_metrics_repo_id (repo_id),
    INDEX ix_metrics_stars (stars),
    INDEX ix_metrics_forks (forks),
    CONSTRAINT fk_metrics_repository
        FOREIGN KEY (repo_id) REFERENCES repositories(repo_id)
);

INSERT INTO repository_metrics
  (metric_id, repo_id, stars, forks, watchers, open_issues_count, open_pulls_count, contributors_count, release_count, commit_count, file_count, readme_size_bytes, community_health_percentage, workflow_count)
VALUES
  (1, 1, 0, 5, 0, 1, 1, 5, 9, 114, 13, 6306, 50.00, 2),
  (2, 2, 0, 1, 0, 0, 0, 7, 9, 141, 11, 4941, 50.00, 2),
  (3, 3, 0, 4, 0, 1, 0, 7, 26, 225, 12, 5366, 50.00, 2),
  (4, 4, 16, 141, 4, 0, 0, 3, 0, 29, 9, 12254, 87.00, 0),
  (5, 5, 2, 3, 9, 0, 0, 2, 0, 6, 5, 848, 75.00, 0),
  (6, 6, 2, 0, 12, 0, 0, 2, 0, 3, 8, 43095, 87.00, 0),
  (7, 7, 0, 0, 3, 0, 0, 1, 0, 1, 1, NULL, 0.00, 0),
  (8, 8, 0, 0, 3, 0, 0, 1, 0, 1, 1, NULL, 0.00, 0),
  (9, 9, 0, 0, 3, 0, 0, 1, 0, 1, 3, NULL, 0.00, 0),
  (10, 10, 1, 0, 2, 0, 0, 1, 0, 1, 3, NULL, 0.00, 0),
  (11, 11, 0, 0, 2, 0, 0, 1, 0, 1, 1, NULL, 0.00, 0),
  (12, 12, 0, 0, 2, 1, 1, 1, 0, 3, 4, NULL, 0.00, 0),
  (13, 13, 0, 0, 1, 0, 0, 1, 0, 2, 5, NULL, 14.00, 0),
  (14, 14, 0, 0, 1, 0, 0, 1, 0, 2, 3, NULL, 14.00, 0),
  (15, 15, 0, 0, 1, 0, 0, 1, 0, 2, 4, NULL, 14.00, 0),
  (16, 16, 0, 0, 1, 0, 0, 4, 0, 7, 8, NULL, 14.00, 0),
  (17, 17, 1, 0, 1, 0, 0, 2, 0, 16, 16, NULL, 0.00, 0),
  (18, 18, 0, 0, 1, 0, 0, 2, 0, 14, 12, NULL, 0.00, 0),
  (19, 19, 0, 0, 1, 0, 0, 1, 0, 6, 6, 165, 28.00, 0),
  (20, 20, 0, 0, 1, 0, 0, 1, 0, 2, 10, 155, 28.00, 0),
  (21, 21, 0, 0, 1, 0, 0, 1, 0, 2, 8, 155, 28.00, 0),
  (22, 22, 0, 0, 1, 0, 0, 1, 0, 1, 1, NULL, 14.00, 0),
  (23, 23, 0, 0, 1, 0, 0, 1, 0, 1, 1, NULL, 14.00, 0),
  (24, 24, 0, 0, 1, 0, 0, 1, 0, 1, 1, NULL, 14.00, 0),
  (25, 25, 0, 1, 1, 0, 0, 1, 0, 1, 3, NULL, 14.00, 0),
  (26, 26, 0, 0, 1, 0, 0, 1, 0, 1, 3, NULL, 14.00, 0),
  (27, 27, 0, 0, 1, 0, 0, 1, 0, 1, 3, NULL, 14.00, 0),
  (28, 28, 0, 0, 1, 0, 0, 1, 0, 3, 6, 75, 28.00, 0),
  (29, 29, 0, 0, 1, 0, 0, 1, 0, 4, 6, 81, 28.00, 0),
  (30, 30, 0, 0, 1, 0, 0, 1, 0, 3, 6, 75, 28.00, 0),
  (31, 31, 0, 0, 1, 0, 0, 1, 0, 1, 2, NULL, 14.00, 0),
  (32, 32, 0, 0, 1, 0, 0, 1, 0, 1, 2, NULL, 14.00, 0),
  (33, 33, 0, 0, 1, 0, 0, 1, 0, 1, 4, NULL, 14.00, 0),
  (34, 34, 0, 0, 2, 0, 0, 3, 0, 3, 6, 87, 28.00, 0),
  (35, 35, 0, 0, 2, 0, 0, 2, 0, 2, 5, 72, 28.00, 0),
  (36, 36, 0, 0, 2, 0, 0, 2, 0, 2, 5, 77, 28.00, 0),
  (37, 37, 2, 0, 1, 0, 0, 1, 0, 4, 5, 5963, 37.00, 0),
  (38, 38, 1, 0, 1, 0, 0, 1, 0, 4, 5, 4716, 37.00, 0),
  (39, 39, 1, 0, 1, 0, 0, 1, 0, 3, 9, 8701, 37.00, 0),
  (40, 40, 0, 0, 1, 0, 0, 4, 0, 6, 8, 1642, 14.00, 0),
  (41, 41, 0, 0, 1, 0, 0, 4, 0, 7, 9, 2268, 14.00, 0),
  (42, 42, 0, 0, 1, 0, 0, 8, 0, 13, 9, 3688, 14.00, 0),
  (43, 43, 0, 0, 1, 0, 0, 1, 0, 1, 11, 172, 28.00, 0),
  (44, 44, 0, 0, 1, 0, 0, 1, 0, 1, 14, 229, 28.00, 0),
  (45, 45, 0, 0, 1, 0, 0, 1, 0, 1, 13, 159, 28.00, 0),
  (46, 46, 0, 0, 1, 0, 0, 1, 0, 2, 2, 9025, 28.00, 0),
  (47, 47, 0, 0, 1, 0, 0, 1, 0, 2, 5, 18479, 28.00, 0),
  (48, 48, 0, 0, 1, 0, 0, 1, 0, 3, 9, 526, 28.00, 0),
  (49, 49, 1, 0, 1, 0, 0, 1, 0, 5, 5, 319, 28.00, 0),
  (50, 50, 0, 0, 2, 0, 0, 2, 0, 10, 13, 1734, 28.00, 0),
  (51, 51, 0, 0, 2, 0, 0, 1, 0, 2, 10, NULL, 14.00, 1),
  (52, 52, 0, 8, 2, 3, 0, 4, 0, 72, 14, 13339, 25.00, 2),
  (53, 53, 111, 66, 13, 6, 1, 24, 0, 683, 9, 2356, 37.00, 2),
  (54, 54, 1, 0, 1, 0, 0, 1, 0, 2, 5, 19, 28.00, 0),
  (55, 55, 0, 0, 1, 0, 0, 2, 0, 5, 11, 68, 42.00, 0);

