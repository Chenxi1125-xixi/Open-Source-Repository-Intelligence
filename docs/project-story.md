# Project Story

## One-line summary

Built a relational analytics platform on public open-source ecosystem data and packaged it into a Power BI-ready portfolio product.

## Problem

Raw GitHub exports mix developer identity, repository metadata, and engagement metrics in denormalized rows. That structure makes multi-entity analysis harder, especially when the goal is to compare developers, repositories, organizations, and languages in one project.

## What this project does

- Normalizes repository and developer data into 5 relational tables
- Enforces parent-child and lookup relationships with keys and indexes
- Produces reusable SQL queries and an analysis view
- Supports a Power BI dashboard for portfolio presentation

## Strongest talking points

- Database design, not just SQL querying
- Data quality handling under imperfect key overlap
- Reusable analysis view for downstream BI tools
- Clear path from raw data to stakeholder-facing insight

## Future extensions

- Add a many-to-many repository-language bridge table
- Add incremental refresh from GitHub API
- Add ETL scripts and data dictionary
- Publish a live embedded Power BI report
