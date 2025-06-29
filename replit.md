# PokerHelper - Texas Hold'em Strategy Application

## Overview

PokerHelper is a full-stack web application designed to assist Texas Hold'em poker players with strategic decision-making. The application provides hand analysis, position-based recommendations, and starting hand charts to help players make optimal decisions at the poker table.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React hooks with TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Session Storage**: Connect-pg-simple for PostgreSQL session store
- **Database**: PostgreSQL with Drizzle ORM for persistent data storage

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless
- **Schema Management**: Drizzle Kit for migrations
- **Tables**:
  - `users`: User authentication and profile data
  - `poker_sessions`: Hand analysis history and session tracking

## Key Components

### Poker Engine
- **Hand Analysis**: Evaluates two-card starting hands with strength calculations
- **Position Logic**: Implements Big Stack Strategy (BSS) position-based recommendations
- **Starting Hand Charts**: Pre-calculated optimal ranges for each table position
- **Action Recommendations**: Provides fold/call/raise guidance based on hand strength and position

### User Interface Components
- **Card Selector**: Interactive card selection with suit/rank visualization
- **Position Selector**: Table position picker with color-coded position types
- **Hand Analysis Display**: Real-time hand strength meter and classification
- **Starting Hand Chart**: Interactive grid showing recommended hands by position
- **Action Recommendation**: Strategic advice based on current selections

### Data Management
- **Schema Validation**: Zod schemas for type-safe data validation
- **Query Management**: TanStack Query for efficient API state management
- **Storage Abstraction**: Interface-based storage allowing memory/database switching

## Data Flow

1. **User Input**: Player selects two cards and table position
2. **Analysis**: Poker engine evaluates hand strength using BSS methodology
3. **Recommendation**: System provides action advice based on position and hand strength
4. **Persistence**: Session data stored via API to database for tracking
5. **Visualization**: Results displayed through interactive UI components

## External Dependencies

### UI Framework
- **Radix UI**: Headless component primitives for accessibility
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework

### Development Tools
- **Vite**: Build tool with HMR and optimization
- **ESBuild**: Fast TypeScript compilation for production
- **Replit Integration**: Development environment plugins

### Database & ORM
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations
- **Connect-pg-simple**: PostgreSQL session storage

## Deployment Strategy

### Development
- **Local Development**: Memory storage with Vite dev server
- **Hot Reload**: Vite HMR for instant feedback
- **TypeScript**: Strict type checking with incremental builds

### Production
- **Build Process**: Vite builds client assets to `dist/public`
- **Server Bundle**: ESBuild bundles server to `dist/index.js`
- **Database**: PostgreSQL connection via environment variables
- **Static Assets**: Express serves built client files

### Environment Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **Session Storage**: Configurable between memory and PostgreSQL
- **Development Mode**: Automatic detection for development-specific features

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- **June 28, 2025**: Complete card selector redesign for enhanced usability
  - Added smart quick-select mode with premium hand buttons
  - Implemented manual selection mode for precise card picking
  - Added random hand generator for testing different scenarios
  - Color-coded hand tiers (Premium=Gold, Strong=Green, Good=Blue)
  - Larger card display with better touch targets for mobile
  - Toggle between Quick Select and Manual modes
  - One-tap selection for common hands like AA, KK, AKs, etc.

- **June 28, 2025**: Starting hand chart visual matrix implementation
  - Fixed chart display from text list to proper 13x13 poker grid
  - Color-coded recommendations (Green=RAISE, Yellow=CALL, Gray=FOLD)
  - Mobile-responsive grid with proper sizing
  - Interactive hover effects and touch feedback

- **June 28, 2025**: Enhanced tutorial integration
  - Prominent tutorial guide button in welcome section
  - Comprehensive 6-section poker strategy guide
  - Mobile-optimized interface with sticky navigation

- **June 29, 2025**: Database integration
  - Added PostgreSQL database with Drizzle ORM
  - Replaced in-memory storage with persistent database storage
  - Configured database connection and migration system
  - User sessions and poker analysis now stored in database

## Changelog

Changelog:
- June 28, 2025. Initial setup and major UX improvements