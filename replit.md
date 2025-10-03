# Overview

This is a full-stack web application that enables users to generate AI-powered music and images. The application integrates with Suno AI for music generation and OpenAI (DALL-E 3 and GPT-5) for image generation and prompt enhancement. Users can create music tracks with customizable parameters (style, vocals, duration) and generate accompanying visual artwork. The application features a studio interface with real-time audio playback, generation history tracking, and image galleries.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Technology Stack**: React 18 with TypeScript, Vite for bundling, and Wouter for client-side routing.

**UI Framework**: shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling. Uses the "new-york" style variant with a dark-themed color palette featuring purple primary colors (hsl(280, 85%, 60%)).

**State Management**: TanStack Query (React Query) for server state management and caching. Query client configured with disabled automatic refetching (`refetchOnWindowFocus: false`, infinite `staleTime`) for optimized API interactions.

**Key Components**:
- `PromptSidebar`: Main generation interface with tabbed music/image controls and advanced parameter configuration
- `AudioPlayer`: Custom audio player with waveform visualization using HTML5 Canvas
- `GenerationHistory`: Polling-based history viewer that automatically refreshes every 2 seconds when pending generations exist
- `ImageGallery`: Paginated gallery with download and sharing capabilities

**Routing**: Single-page application with `/` and `/studio` routes pointing to the main Studio page.

## Backend Architecture

**Framework**: Express.js server with TypeScript, running on Node.js.

**API Design**: RESTful API structure under `/api` namespace:
- `POST /api/music/generate` - Initiates music generation with prompt enhancement
- `GET /api/music/:id/status` - Polls generation status
- `GET /api/music/:id/download` - Downloads completed audio files
- `POST /api/images/generate` - Generates images with optional music context
- `GET /api/generations` - Retrieves all user generations
- `GET /api/generations/images` - Retrieves image generations only

**Service Layer Pattern**: Separate service modules for external API integrations:
- `server/services/openai.ts` - OpenAI GPT-5 for prompt enhancement and DALL-E 3 for image generation
- `server/services/suno.ts` - SunoAPI.org third-party service for Suno AI music generation

**Data Access Layer**: Storage abstraction through `IStorage` interface implemented by `DatabaseStorage` class, enabling potential future storage backend swaps.

**Request Logging**: Custom middleware logs all `/api` requests with duration tracking and response preview (truncated at 80 characters).

## Database Architecture

**ORM**: Drizzle ORM with PostgreSQL dialect, using Neon serverless database driver with WebSocket support.

**Schema Design** (`shared/schema.ts`):

- `users` table: User authentication (username/password), currently not actively used in the application
- `musicGenerations` table: Stores music generation requests and results
  - Tracks status progression: pending → processing → completed/failed
  - Stores both `audioUrl` and `imageUrl` for generated content
  - Includes `taskId` for external API polling
  - JSONB `metadata` field for extensible storage (BPM, key, genre)
  - Supports multiple model versions (V5, V4_5PLUS, V4_5, V4, V3_5)
- `imageGenerations` table: Stores image generation requests
  - Optional `musicGenerationId` foreign key to link images with music tracks
  - Tracks status and stores resulting `imageUrl`

**Validation**: Zod schemas auto-generated from Drizzle schemas using `drizzle-zod` for runtime type safety on API boundaries.

**Migration Management**: Drizzle Kit configured with migrations output to `./migrations` directory.

## External Dependencies

**Suno AI Music Generation**:
- Access via SunoAPI.org third-party API service
- Base URL: `https://api.sunoapi.org/api/v1`
- Configured via `SUNO_API_KEY` environment variable
- Supports custom parameters: style, vocals, instrumental mode, weirdness/style weights
- Async generation pattern: POST request returns `taskId`, subsequent polling for completion

**OpenAI Integration**:
- GPT-5 model for music prompt enhancement (creates detailed, artistic descriptions)
- DALL-E 3 for image generation (1024x1024, standard quality)
- Configured via `OPENAI_API_KEY` environment variable
- Context-aware image generation: optionally enhances prompts based on music characteristics

**Neon Database**:
- Serverless PostgreSQL hosting
- WebSocket-based connection using `@neondatabase/serverless` driver
- Configured via `DATABASE_URL` environment variable
- Connection pooling via `Pool` class

**Development Tools**:
- Replit-specific plugins for runtime error overlay, cartographer navigation, and dev banner
- Vite HMR configured with custom server integration for development

**Font Loading**: Google Fonts CDN for Inter, Architects Daughter, DM Sans, Fira Code, and Geist Mono font families.

## Application Build and Deployment

**Build Process**:
- Frontend: Vite builds React app to `dist/public`
- Backend: esbuild bundles Express server to `dist/index.js` as ESM module
- Development: tsx for TypeScript execution without compilation

**Environment Variables Required**:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API authentication
- `SUNO_API_KEY` - SunoAPI.org authentication
- `NODE_ENV` - Environment mode (development/production)

**Static Asset Serving**: In production, Express serves built frontend from `dist/public`. In development, Vite dev server handles assets via middleware mode with HMR.