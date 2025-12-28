# VerifyFlow

**AI-Powered KYC/AML Compliance Platform for Fintech Companies**

## Overview

VerifyFlow is a modern, comprehensive compliance automation platform designed for early-to-mid stage fintech companies navigating complex financial regulations. This MVP focuses on the core KYC/AML screening feature with a beautiful, intuitive interface.

## Features

- **Dashboard**: Real-time stats and recent KYC checks overview
- **New KYC Check**: Submit customer information for automated compliance screening
- **Case Management**: View all historical cases with detailed compliance check results
- **Compliance Checks**:
  - Identity Verification
  - Sanctions Screening (OFAC, UN, EU)
  - PEP Database Check
  - Adverse Media Monitoring

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Navigate to the project directory:
```bash
cd verifyflow
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Deploy to Vercel

VerifyFlow is ready to deploy to Vercel with zero configuration!

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to link your project

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite and deploy!

### Option 3: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Vercel will automatically configure everything

The `vercel.json` file is already configured for optimal deployment.

## Project Structure

```
verifyflow/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles with Tailwind
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
```

## Next Steps for Production

### Backend Integration

- Connect to real KYC APIs (Persona, Alloy, Onfido)
- Build FastAPI endpoints for `/kyc/check`, `/kyc/cases`, `/kyc/{id}`
- Implement webhook handlers for async results

### Database

- PostgreSQL schema for cases, checks, audit logs
- Redis caching for frequently accessed cases

### Authentication

- Add login/signup with API key management
- Role-based access (admin, analyst, viewer)

### Advanced Features

- Bulk upload CSV for batch checks
- API documentation (Swagger/OpenAPI)
- Webhook configuration for customer systems
- Custom risk rule builder
- PDF report generation

## Live Demo

Once deployed, your VerifyFlow instance will be available at:
- Production: `https://your-project.vercel.app`
- Preview: `https://your-project-git-branch.vercel.app`

## License

MIT

---

**Built with ❤️ for fintech companies**

