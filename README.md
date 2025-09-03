# Papa John's Project Dashboard

This is a [Next.js](https://nextjs.org) application that serves as a project management dashboard for Papa John's store renovations. It visualizes project progress and details sourced from a Smartsheet.

## Features

-   **Interactive Map**: Displays all project locations with their current status.
-   **Project Summary**: Key metrics including total projects, completed projects, and overall completion percentage.
-   **Phase Distribution**: Donut chart showing the breakdown of projects by their current phase (e.g., Planning, Permitting, Installation).
-   **Projects by State**: Bar chart visualizing the number of renovation projects in each state.
-   **Detailed Project List**: A table with searchable and expandable rows for detailed information on each project.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Charting**: [Recharts](https://recharts.org/)
-   **Data Source**: [Smartsheet API](https://smartsheet.redoc.ly/)

## Getting Started

First, you'll need to set up your environment variables. Create a `.env.local` file in the root of the project and add your Smartsheet API token:

```
SMARTSHEET_ACCESS_TOKEN=your_smartsheet_api_token_here
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
