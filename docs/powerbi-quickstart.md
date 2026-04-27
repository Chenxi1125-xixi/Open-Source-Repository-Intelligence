# Power BI Quickstart

This is the fastest way to build a real Power BI version of this project using the full repository source.

## What you need

- Power BI Desktop
- The file `data/repository_dashboard_full.csv`

## Step 1: import the data

1. Open Power BI Desktop.
2. Click `Get data`.
3. Choose `Text/CSV`.
4. Select `data/repository_dashboard_full.csv`.
5. Click `Load`.

This file is built from the full Kaggle repository metadata source and contains 14,644 repositories.

## Step 2: create 4 KPI cards

Create these cards:

- `Total Repositories`
  - drag `repo`
  - change aggregation to `Count (Distinct)`

- `Total Developers`
  - drag `owner`
  - change aggregation to `Count (Distinct)`

- `Total Stars`
  - drag `stars`
  - aggregation `Sum`

- `Total Commits`
  - drag `commits`
  - aggregation `Sum`

## Step 3: create 4 core charts

### Chart 1: top repositories by stars

- Visual: clustered bar chart
- Y-axis: `repo`
- X-axis: `stars`
- Sort: descending by `stars`

### Chart 2: top developers by stars

- Visual: clustered bar chart
- Y-axis: `owner`
- X-axis: `stars`
- Sort: descending by `stars`

### Chart 3: impact distribution

- Visual: donut chart
- Legend: `impact`
- Values: `repo`
- Aggregation: `Count`

### Chart 4: language mix

- Visual: clustered column chart
- X-axis: `language`
- Y-axis: `repo`
- Aggregation: `Count`

## Step 4: create 2 deeper charts

### Scatter plot

- X-axis: `forks`
- Y-axis: `stars`
- Size: `commits`
- Details: `repo`
- Legend: `language`

### Repository table

Add these columns:

- `repo`
- `owner`
- `language`
- `company`
- `impact`
- `stars`
- `forks`
- `commits`
- `active_days`

## Step 5: add slicers

Add slicers for:

- `language`
- `impact`
- `owner`
- `company`

## Step 6: make it look clean

- Put the 4 KPI cards on the top row
- Put the 4 main charts in the middle
- Put the scatter plot and detail table on the bottom
- Import `assets/powerbi-theme.json` if you want the colors to match the website

## Step 7: optional measures

You can add these DAX measures:

```DAX
Total Repositories = DISTINCTCOUNT(repository_dashboard_full[repo])

Total Developers = DISTINCTCOUNT(repository_dashboard_full[owner])

Total Stars = SUM(repository_dashboard_full[stars])

Total Commits = SUM(repository_dashboard_full[commits])

Average Active Days = AVERAGE(repository_dashboard_full[active_days])
```

## Best way to present it

Say it like this:

`I first built the relational database and SQL analysis, then translated the key metrics into an interactive BI dashboard for easier communication and exploration.`

## Recommended report title

Use:

`Open Source Repository Intelligence`

## Recommended first page title

Use:

`Repository Activity Overview`
