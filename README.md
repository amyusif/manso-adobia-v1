# Police Command & Control System (PCCS)

A comprehensive web application for the Manso Adubia District Police Command, providing management capabilities for police operations including personnel management, case tracking, duty scheduling, communication systems, and reporting.

## Features

- **Personnel Management**: Track officer profiles, ranks, units, and duty status
- **Case Management**: Create, track, and manage criminal cases
- **Duty Scheduling**: Assign and monitor officer duties
- **Communication System**: Internal messaging and alert broadcasting
- **Dashboard**: Real-time statistics and overview
- **Authentication**: Secure login with role-based access

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Radix UI + shadcn/ui components
- Tailwind CSS
- React Query for state management
- Wouter for routing

### Backend
- Node.js with Express
- PostgreSQL database
- Drizzle ORM
- Session-based authentication

## Local Development Setup

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- VS Code (recommended)

### Installation

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd police-command-system
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/police_db
   SESSION_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

3. **Database Setup**
   ```bash
   # Create database
   createdb police_db
   
   # Run migrations
   npm run db:push
   
   # Optional: Seed with demo data
   npm run db:seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at http://localhost:5000

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type checking
- `npm run db:push` - Push database schema changes

### Default Demo Accounts

For testing purposes, the following demo accounts are available:

- **Admin**: `admin@police.gov.gh` / `password123`
- **Commander**: `commander@police.gov.gh` / `password123`
- **Supervisor**: `supervisor@police.gov.gh` / `password123`
- **Officer**: `officer@police.gov.gh` / `password123`

### VS Code Setup

#### Recommended Extensions

Install these extensions for the best development experience:

1. **TypeScript Vue Plugin (Volar)** - Enhanced TypeScript support
2. **Tailwind CSS IntelliSense** - CSS class autocomplete
3. **ES7+ React/Redux/React-Native snippets** - React snippets
4. **Prettier - Code formatter** - Code formatting
5. **ESLint** - Linting support

#### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

#### Launch Configuration

Create `.vscode/launch.json` for debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/index.ts",
      "env": {
        "NODE_ENV": "development"
      },
      "runtimeArgs": ["-r", "tsx/register"],
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

#### Tasks Configuration

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Dev Server",
      "type": "shell",
      "command": "npm run dev",
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": []
    },
    {
      "label": "Type Check",
      "type": "shell",
      "command": "npm run check",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    }
  ]
}
```

### Database Management

#### Using a Local PostgreSQL Instance

1. **Install PostgreSQL**
   ```bash
   # On macOS with Homebrew
   brew install postgresql
   brew services start postgresql
   
   # On Ubuntu/Debian
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

2. **Create Database and User**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE police_db;
   CREATE USER police_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE police_db TO police_user;
   \q
   ```

3. **Update .env file**
   ```env
   DATABASE_URL=postgresql://police_user:your_password@localhost:5432/police_db
   ```

#### Using Cloud Database (Recommended for Development)

For easier setup, you can use a cloud PostgreSQL service like:
- **Neon** (Free tier available)
- **Supabase** (Free tier available)
- **Railway** (Free tier available)

### Project Structure

```
police-command-system/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
├── server/                # Backend Express application
│   ├── db.ts             # Database connection
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data access layer
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema and types
└── package.json          # Dependencies and scripts
```

### Development Workflow

1. **Start the development server**: `npm run dev`
2. **Make changes**: The server will automatically restart and the client will hot-reload
3. **Database changes**: Update `shared/schema.ts` and run `npm run db:push`
4. **Type checking**: Run `npm run check` to verify TypeScript types

### Troubleshooting

#### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env file
   - Ensure database exists and user has permissions

2. **Port Already in Use**
   - Kill the process using port 5000: `lsof -ti:5000 | xargs kill -9`
   - Or change the port in server/index.ts

3. **TypeScript Errors**
   - Run `npm run check` to see all type errors
   - Ensure all dependencies are installed

#### Getting Help

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure the database is accessible and migrations have run
4. Check that all required packages are installed

## License

This project is licensed under the MIT License.