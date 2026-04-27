-- ============================================================
-- Part 3: Database Project Queries
-- ============================================================

-- Query 1: Rank repositories by stars using DENSE_RANK().
-- This identifies the most popular repositories in the sample.
SELECT
    r.repo_name,
    d.login AS owner_login,
    l.language_name,
    m.stars,
    m.forks,
    DENSE_RANK() OVER (ORDER BY m.stars DESC, m.forks DESC) AS popularity_rank
FROM repositories r
JOIN developers d ON r.developer_id = d.developer_id
JOIN languages l ON r.language_id = l.language_id
JOIN repository_metrics m ON r.repo_id = m.repo_id
ORDER BY popularity_rank, r.repo_name;

-- Query 2: Calculate repository active days using DATEDIFF().
-- Active days are measured from repository creation date to last pushed date.
SELECT
    r.repo_name,
    d.login AS owner_login,
    r.created_date,
    r.pushed_date,
    DATEDIFF(r.pushed_date, r.created_date) AS active_days
FROM repositories r
JOIN developers d ON r.developer_id = d.developer_id
WHERE r.created_date IS NOT NULL
  AND r.pushed_date IS NOT NULL
ORDER BY active_days DESC;

-- Query 3: Use CASE WHEN to classify repositories by popularity.
SELECT
    r.repo_name,
    d.login AS owner_login,
    m.stars,
    m.forks,
    CASE
        WHEN m.stars >= 10 THEN 'High Popularity'
        WHEN m.stars >= 3 THEN 'Medium Popularity'
        WHEN m.stars >= 1 THEN 'Low Popularity'
        ELSE 'No Stars Yet'
    END AS popularity_category
FROM repositories r
JOIN developers d ON r.developer_id = d.developer_id
JOIN repository_metrics m ON r.repo_id = m.repo_id
ORDER BY m.stars DESC, m.forks DESC;

-- Query 4: Aggregate repository performance by developer.
-- This uses COUNT(), SUM(), and AVG().
SELECT
    d.login AS owner_login,
    COUNT(r.repo_id) AS total_repositories,
    SUM(m.stars) AS total_stars,
    SUM(m.forks) AS total_forks,
    ROUND(AVG(m.commit_count), 2) AS avg_commits
FROM developers d
JOIN repositories r ON d.developer_id = r.developer_id
JOIN repository_metrics m ON r.repo_id = m.repo_id
GROUP BY d.developer_id, d.login
ORDER BY total_stars DESC, total_repositories DESC;

-- Query 5: CTE to find developers with above-average repository counts.
WITH developer_repo_counts AS (
    SELECT
        d.developer_id,
        d.login,
        COUNT(r.repo_id) AS repo_count
    FROM developers d
    LEFT JOIN repositories r ON d.developer_id = r.developer_id
    GROUP BY d.developer_id, d.login
),
average_repo_count AS (
    SELECT AVG(repo_count) AS avg_repo_count
    FROM developer_repo_counts
)
SELECT
    drc.login,
    drc.repo_count,
    ROUND(arc.avg_repo_count, 2) AS sample_average_repo_count
FROM developer_repo_counts drc
CROSS JOIN average_repo_count arc
WHERE drc.repo_count > arc.avg_repo_count
ORDER BY drc.repo_count DESC;

-- Query 6: Join across five tables for a complete analysis dataset.
SELECT
    d.login AS owner_login,
    c.company_name,
    d.location,
    r.repo_name,
    l.language_name,
    r.created_date,
    r.pushed_date,
    m.stars,
    m.forks,
    m.commit_count,
    m.community_health_percentage
FROM developers d
LEFT JOIN companies c ON d.company_id = c.company_id
JOIN repositories r ON d.developer_id = r.developer_id
JOIN languages l ON r.language_id = l.language_id
JOIN repository_metrics m ON r.repo_id = m.repo_id
ORDER BY d.login, r.repo_name;

-- Query 7: Create a view for analysis and presentation.
-- This view combines owner, company, repository, language, date, and metric information.
CREATE OR REPLACE VIEW repository_analysis_view AS
SELECT
    d.login AS owner_login,
    d.full_name,
    c.company_name,
    d.location,
    d.followers,
    d.public_repos,
    r.repo_name,
    r.github_url,
    l.language_name,
    r.has_readme,
    r.created_date,
    r.updated_date,
    r.pushed_date,
    DATEDIFF(r.pushed_date, r.created_date) AS active_days,
    m.stars,
    m.forks,
    m.watchers,
    m.open_issues_count,
    m.contributors_count,
    m.release_count,
    m.commit_count,
    m.file_count,
    m.community_health_percentage,
    CASE
        WHEN m.stars >= 10 THEN 'High Impact'
        WHEN m.stars >= 3 THEN 'Medium Impact'
        WHEN m.stars >= 1 THEN 'Low Impact'
        ELSE 'Early Stage'
    END AS impact_level
FROM developers d
LEFT JOIN companies c ON d.company_id = c.company_id
JOIN repositories r ON d.developer_id = r.developer_id
JOIN languages l ON r.language_id = l.language_id
JOIN repository_metrics m ON r.repo_id = m.repo_id;

-- Display the analysis view.
SELECT *
FROM repository_analysis_view
ORDER BY stars DESC, forks DESC, active_days DESC;

-- Optional validation checks.
SELECT COUNT(*) AS developer_count FROM developers;
SELECT COUNT(*) AS repository_count FROM repositories;
SELECT COUNT(*) AS metric_count FROM repository_metrics;
SELECT COUNT(*) AS language_count FROM languages;
SELECT COUNT(*) AS company_count FROM companies;
