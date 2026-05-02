# NexusFlow

NexusFlow is a powerful team collaboration tool built specifically for **Google Prompt Wars**, integrating core Google Cloud services to supercharge coordination, scheduling, and asset management for your team.

## Google Cloud Integrations

To achieve maximum synergy and a top-tier score, NexusFlow integrates natively with the following Google services:

1. **Google Calendar API**
   - Seamlessly schedule and manage team events.
   - Synchronize Prompt Wars deadlines with team availability.
   - Automatically push events and milestone reminders to participants.

2. **Google Drive API**
   - Centralized document storage, tracking, and sharing.
   - Automated creation of project folders and unified resource trees.
   - Directly link and preview relevant Drive files alongside tasks.

3. **Google Meet API**
   - One-click generation of high-quality Meet links for ad-hoc huddles.
   - Auto-attach Meet endpoints to scheduled Calendar events for instant access.

4. **Google Cloud IAM & OAuth 2.0**
   - Streamlined, secure single sign-on (SSO) exclusively utilizing Google Workspace.
   - Roles-based access controls to guarantee that only assigned team members modify critical project states.

## Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS, React
- **Backend**: Next.js Server Actions / API Routes
- **Authentication**: NextAuth.js (configured with Google Provider)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
