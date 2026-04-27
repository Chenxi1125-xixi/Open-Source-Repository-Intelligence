# Power BI Build Guide

This guide turns the SQL project into a Power BI report that is easy to embed into the portfolio site.

## Goal

Build one polished report with 3 pages:

1. `Executive Overview`
2. `Repository Deep Dive`
3. `Data Quality and Model Design`

Then publish it and paste the public embed URL into `app.js`.

## Recommended data source

Use the reusable analysis view from the SQL project as your main table.

You can create it with the logic from `Query 7` in `sql/github_db_querys.final.sql`, or use the export query below.

## Power BI dataset design

Primary table:

- `repository_analysis_view`

Recommended columns:

- `owner_login`
- `full_name`
- `company_name`
- `location`
- `followers`
- `public_repos`
- `repo_name`
- `github_url`
- `language_name`
- `has_readme`
- `created_date`
- `updated_date`
- `pushed_date`
- `active_days`
- `stars`
- `forks`
- `watchers`
- `open_issues_count`
- `contributors_count`
- `release_count`
- `commit_count`
- `file_count`
- `community_health_percentage`
- `impact_level`

## Export query for Power BI

Create and query this view in MySQL:

```sql
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
```

Use [powerbi-report-blueprint.md](/Users/xixi/Documents/New%20project/docs/powerbi-report-blueprint.md) as the exact layout storyboard and [assets/powerbi-theme.json](/Users/xixi/Documents/New%20project/assets/powerbi-theme.json) as your starting theme.

## Recommended visuals

### Page 1: Executive Overview

- KPI cards:
  - total repositories
  - total developers
  - total stars
  - total commits
- Clustered bar chart:
  - top repositories by stars
- Bar chart:
  - top developers by total stars
- Donut chart:
  - impact level distribution
- Bar chart:
  - repository count by language
- Table:
  - top repositories with owner, stars, forks, active days

### Page 2: Repository Deep Dive

- Scatter plot:
  - `stars` vs `forks`
  - bubble size: `commit_count`
  - legend: `language_name`
- Bar chart:
  - company name vs total stars
- Histogram or column chart:
  - active days distribution
- Detail table:
  - owner, repo, language, followers, commits, community health

### Page 3: Data Quality and Model Design

- EER diagram image
- Text box:
  - owner-profile overlap challenge
- Text box:
  - free-text commit field cleanup
- Text box:
  - language skew and future many-to-many design
- Card visuals:
  - sample repositories
  - sample developers
  - languages represented

## Recommended slicers

- `language_name`
- `company_name`
- `impact_level`
- `owner_login`
- `has_readme`

## Suggested DAX measures

```DAX
Total Repositories = DISTINCTCOUNT(repository_analysis_view[repo_name])

Total Developers = DISTINCTCOUNT(repository_analysis_view[owner_login])

Total Stars = SUM(repository_analysis_view[stars])

Total Forks = SUM(repository_analysis_view[forks])

Total Commits = SUM(repository_analysis_view[commit_count])

Average Active Days = AVERAGE(repository_analysis_view[active_days])
```

## Design tips

- Use the theme in `assets/powerbi-theme.json` so the dashboard visually matches the portfolio site.
- Keep one accent color for callouts.
- Do not overcrowd page 1. Make it feel executive and scannable.
- Use a tooltip page for repository-level details if you want an extra polished touch.

## Embedding in the website

After publishing the report:

1. Copy the Power BI public embed URL.
2. Open `app.js`.
3. Replace:

```js
const powerBiEmbedUrl = "";
```

with your published embed link.

4. Open `index.html` and confirm the iframe renders.

## Best interview framing

When you demo the dashboard, explain it in this order:

1. Why the data model was needed
2. What cleaning and joining challenges you solved
3. Why you created a reusable SQL view
4. How the Power BI layer helps translate database outputs into decisions
