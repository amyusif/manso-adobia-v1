# Replit Project Guide

## Overview

This is a Police Command & Control System (PCCS) built for the Manso Adubia District Police Command. The application is a full-stack web application that provides comprehensive management capabilities for police operations including personnel management, case tracking, duty scheduling, communication systems, and reporting.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom police-themed color scheme
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Neon serverless database
- **ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **API Architecture**: RESTful API with standardized error handling

### Development Setup
- **Monorepo Structure**: Shared types and schemas between client and server
- **Hot Reload**: Development server with HMR support
- **Type Safety**: Full TypeScript coverage across the entire stack

## Key Components

### Database Schema
The application uses a comprehensive database schema with the following main entities:

1. **Users**: Authentication and user profile management
2. **Personnel**: Police officer profiles with ranks, units, and status
3. **Cases**: Criminal case management with tracking and status updates
4. **Duties**: Duty assignment and scheduling system
5. **Communications**: Internal messaging and alert system
6. **Alerts**: Emergency notifications and announcements
7. **Sessions**: Session storage for authentication

### Authentication System
- **Provider**: Replit Auth integration
- **Session Management**: PostgreSQL-backed session store
- **Role-based Access**: Multiple user roles (personnel, supervisor, admin, commander)
- **Security**: HTTP-only cookies with secure session handling

### API Routes
- **Personnel Management**: CRUD operations for officer profiles
- **Case Management**: Case creation, tracking, and status updates
- **Duty Scheduling**: Assignment and monitoring of duties
- **Communication**: Internal messaging and alert broadcasting
- **Dashboard**: Statistics and overview data
- **Reports**: Data export and analytics

### UI Components
- **Layout**: Responsive sidebar navigation with header
- **Forms**: Validated forms with error handling
- **Tables**: Data tables with search and filtering
- **Modals**: Dialog-based forms and confirmations
- **Dashboard**: Statistics cards and quick actions

## Data Flow

### Client-Server Communication
1. Client makes authenticated requests to `/api/*` endpoints
2. Server validates user authentication and authorization
3. Database operations performed through Drizzle ORM
4. Responses returned with proper error handling
5. Client updates UI through React Query cache invalidation

### Authentication Flow
1. User redirected to Replit Auth for login
2. Successful authentication creates user session
3. Session stored in PostgreSQL with expiration
4. Client receives session cookie for subsequent requests
5. Protected routes verify authentication status

### Data Validation
- **Client-side**: Zod schemas for form validation
- **Server-side**: Same Zod schemas for API validation
- **Database**: Drizzle schema with constraints and relationships
- **Type Safety**: Shared TypeScript interfaces across stack

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Database ORM and query builder
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation integration
- **wouter**: Client-side routing
- **express**: Node.js web framework
- **passport**: Authentication middleware

### UI Dependencies
- **@radix-ui/***: Headless UI components
- **tailwindcss**: CSS utility framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component styling utilities
- **clsx**: Conditional class names

### Development Dependencies
- **typescript**: Type checking
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution
- **esbuild**: Fast JavaScript bundler

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied to PostgreSQL
4. **Assets**: Static files served from build directory

### Environment Variables
- **DATABASE_URL**: PostgreSQL connection string
- **SESSION_SECRET**: Session encryption key
- **REPLIT_DOMAINS**: Allowed domains for auth
- **ISSUER_URL**: OpenID Connect issuer URL
- **NODE_ENV**: Environment mode (development/production)

### Production Considerations
- Database connection pooling for scalability
- Session store cleanup for expired sessions
- Error logging and monitoring
- Security headers and CORS configuration
- Rate limiting for API endpoints

## Changelog

```
Changelog:
- July 05, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```