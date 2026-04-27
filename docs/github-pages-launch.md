# GitHub Pages Launch Guide

This guide helps you turn the repo into a live portfolio link.

## What you already have

- `index.html`
- `styles.css`
- `app.js`
- `assets/`
- `docs/`
- `sql/`

That is enough for a static GitHub Pages site.

## Before pushing

1. Make sure the Power BI embed link is in `app.js`.
2. Confirm `index.html` opens locally and the layout looks right.
3. Keep the repo root as the website root so GitHub Pages can serve it directly.

## Recommended repo name

Use one of these:

- `github-open-source-analytics`
- `github-activity-analytics`
- `github-sql-powerbi-portfolio`

## How to publish

1. Push this project to GitHub.
2. Open the GitHub repository.
3. Go to `Settings`.
4. Open `Pages`.
5. Under `Build and deployment`, choose:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/ (root)`
6. Save.

GitHub will generate a URL like:

`https://your-username.github.io/repository-name/`

## After publishing

Test these:

- the homepage loads
- the Power BI iframe displays
- SQL file download links work
- the schema image renders
- the mobile layout still looks clean

## Portfolio links to reuse

Use the live Pages URL in:

- your resume project section
- LinkedIn featured section
- job applications
- interview follow-up messages

## Suggested repo description

`Portfolio-ready GitHub analytics project combining relational database design, SQL, and Power BI storytelling.`
