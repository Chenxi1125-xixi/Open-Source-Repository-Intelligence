# Final Power BI Build Plan

Project title:
`Open Source Repository Intelligence`

Primary dataset:
`data/repository_dashboard_full.csv`

Dataset scope:

- 14,644 repositories
- 13,615 owners
- 27,006 total stars
- 6,720 total forks
- 234,397 total commits
- 10,802 repositories with a README

This is the recommended final Power BI structure for your project.

## Dataset to import

Use this file directly in Power BI Desktop:

- `data/repository_dashboard_full.csv`

Important note:

- This report should be based on the full repository metadata dataset.
- Do not use the smaller sample CSV for the final report.
- The separate `github_users.csv` file is still useful for database design and limitations discussion, but it should not be the main source for the BI report because only about 200 repositories match it.

## Recommended report structure

Build 3 pages.

1. `Executive Overview`
2. `Repository Quality and Lifecycle`
3. `Methodology and Data Limitations`

## Page 1: Executive Overview

Purpose:

- Give a fast, high-level summary of the repository ecosystem in the source data.

Top-row KPI cards:

- `Total Repositories`
- `Total Owners`
- `Total Stars`
- `Total Forks`
- `Total Commits`
- `README Coverage Rate`

Recommended visuals:

### Visual 1

- Title: `Top 10 Repositories by Stars`
- Type: Clustered bar chart
- Y-axis: `repo`
- X-axis: `stars`
- Tooltips:
  - `owner`
  - `language`
  - `forks`
  - `commits`
  - `active_days`

### Visual 2

- Title: `Top Owners by Total Stars`
- Type: Clustered bar chart
- Y-axis: `owner`
- X-axis: `stars` as `Sum`

### Visual 3

- Title: `Repository Count by Impact Tier`
- Type: Donut chart
- Legend: `impact`
- Values: `repo` as `Count`

### Visual 4

- Title: `Repository Count by Language`
- Type: Clustered column chart
- X-axis: `language`
- Y-axis: `repo` as `Count`

### Visual 5

- Title: `Star Count Buckets`
- Type: Column chart
- Grouping logic:
  - `0`
  - `1-4`
  - `5-19`
  - `20-99`
  - `100+`

Business message for page 1:

- Visibility is highly concentrated in a small set of repositories.
- Python dominates the dataset.
- Most repositories remain in low-visibility tiers.

## Page 2: Repository Quality and Lifecycle

Purpose:

- Show maturity, documentation, and sustainability patterns.

Recommended visuals:

### Visual 1

- Title: `Repository Lifecycle Buckets`
- Type: Clustered bar chart
- Grouping logic:
  - `0-30 days`
  - `31-180 days`
  - `181-365 days`
  - `1-3 years`
  - `3+ years`

### Visual 2

- Title: `Top Active Repositories`
- Type: Clustered bar chart
- Y-axis: `repo`
- X-axis: `active_days`

### Visual 3

- Title: `README Coverage`
- Type: Cards or donut chart
- Suggested metrics:
  - with README
  - without README
  - coverage rate

### Visual 4

- Title: `Community Health Score Bands`
- Type: Clustered column chart
- Grouping logic:
  - `0`
  - `1-25`
  - `26-50`
  - `51-75`
  - `76-100`

### Visual 5

- Title: `Repository Detail Spotlight`
- Type: Table
- Columns:
  - `repo`
  - `owner`
  - `language`
  - `impact`
  - `stars`
  - `forks`
  - `commits`
  - `active_days`
  - `community_health`

Business message for page 2:

- Many repositories are documented but still low-engagement.
- Lifecycle varies sharply across projects.
- Quality signals like README presence and community health do not always align with popularity.

## Page 3: Methodology and Data Limitations

Purpose:

- Make the project feel more thoughtful and technically mature.

Recommended visuals and content:

### Visual 1

- Title: `Relational Schema Overview`
- Type: Image
- Use:
  - `assets/schema-diagram.png`

### Visual 2

- Title: `Source Matching Limitation`
- Type: Text box
- Suggested text:
  - The repository metadata source contains 14,644 repositories, but only about 200 repositories match the separate GitHub users dataset by owner login. Because of this low overlap, the main BI layer uses the full repository metadata file while the dual-source design is preserved in the database project and methodology discussion.

### Visual 3

- Title: `Data Cleaning Decisions`
- Type: Text box
- Suggested text:
  - Commit counts were extracted from free-text fields such as `3 commits`, and lifecycle values were derived from `created_at` and `pushed_at`.

### Visual 4

- Title: `Language Coverage`
- Type: Text box
- Suggested text:
  - The source is overwhelmingly Python-focused, with a much smaller number of `Unknown` entries. This affects interpretation and limits language comparison.

### Visual 5

- Title: `Dataset Snapshot`
- Type: Cards
- Suggested metrics:
  - 14,644 repositories
  - 13,615 owners
  - 27,006 stars
  - 234,397 commits

Business message for page 3:

- The project is not only about charts.
- It demonstrates source evaluation, transformation logic, and a clear understanding of what the data can and cannot support.

## Recommended slicers

Use these slicers across pages:

- `language`
- `impact`
- `owner`
- `has_readme`

Optional:

- `community_health` band

## Recommended DAX measures

```DAX
Total Repositories = DISTINCTCOUNT(repository_dashboard_full[repo])

Total Owners = DISTINCTCOUNT(repository_dashboard_full[owner])

Total Stars = SUM(repository_dashboard_full[stars])

Total Forks = SUM(repository_dashboard_full[forks])

Total Commits = SUM(repository_dashboard_full[commits])

Average Active Days = AVERAGE(repository_dashboard_full[active_days])

README Coverage Rate =
DIVIDE(
    CALCULATE(COUNTROWS(repository_dashboard_full), repository_dashboard_full[has_readme] = 1),
    COUNTROWS(repository_dashboard_full)
)

Average Stars Per Repository =
DIVIDE([Total Stars], [Total Repositories])
```

## Visual titles to use

Use these exact titles for a cleaner final report:

- `Repository Activity Overview`
- `Top 10 Repositories by Stars`
- `Top Owners by Total Stars`
- `Repository Count by Impact Tier`
- `Repository Count by Language`
- `Star Count Buckets`
- `Repository Lifecycle Buckets`
- `Top Active Repositories`
- `README Coverage`
- `Community Health Score Bands`
- `Repository Detail Spotlight`
- `Methodology and Data Limitations`

## Suggested presentation script

Use this flow when presenting:

1. Start with the business question:
   - What does open-source repository activity look like in this dataset?
2. Show the big picture on Page 1.
3. Show maturity and quality patterns on Page 2.
4. End with source limitations and methodology on Page 3.
5. Explain why the website uses a built-in dashboard and why Power BI is offered as a formal alternate BI version.
