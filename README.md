# CalyBook

A comprehensive sports platform that seamlessly integrates venue booking with competitive rankings. Built with the T3 Stack and featuring internationalization support.

## Project Description

CalyBook is a complete sports ecosystem that combines two essential platforms for sports enthusiasts:

- **[AlwaysFullyBooked](https://alwaysfullybooked.com/)** - Professional venue booking and management system
- **[OpenScor](https://openscor.com/)** - Advanced sports ranking and competition platform

This dual-platform integration creates a unique sports experience where users can book venues and immediately participate in competitive rankings, track their progress, and compete with other players - all in one unified platform.

### Key Features

- **Multi-country Support**: Available in Thailand, Hong Kong, Seychelles, France, and Belgium
- **AI Booking Assistant**: Chat-based booking interface powered by OpenRouter AI
- **Sports Rankings & Competition**: 
  - **Tennis and Football Rankings**: Powered by OpenScor's advanced ranking system
  - **ELO-based Rating System**: Fair and competitive player ratings
  - **Real-time Leaderboards**: Live rankings and competition tracking
  - **Match Management**: Game result submission, approval, and statistics
  - **Player Profiles**: Detailed statistics, win/loss records, and achievement tracking
  - **Tournament Support**: Competition and league management
- **Venue Booking Engine**: 
  - **Powered by AlwaysFullyBooked**: Professional venue management
  - **Real-time Availability**: Live availability checking with calendar integration
  - **Multi-service Booking**: Courts, events, training sessions
  - **Payment Processing**: Multiple payment methods and multi-currency support
  - **Booking Management**: Create, modify, and track reservations
- **Group Management**: Create and manage sports groups and teams
- **Internationalization**: Multi-language support with next-intl
- **User Authentication**: Google OAuth integration with NextAuth.js

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router and [Turbo](https://turbo.build/) for fast builds
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PlanetScale](https://planetscale.com/) MySQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [NextAuth.js 5](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
- **State Management**: [TanStack Query](https://tanstack.com/query) with [tRPC](https://trpc.io/)
- **AI Integration**: [OpenRouter AI SDK](https://openrouter.ai/)
- **Sports Platform**: [OpenScor](https://openscor.com/) for rankings and game management
- **Booking Engine**: [AlwaysFullyBooked](https://alwaysfullybooked.com/) for venue management
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Code Quality**: [Biome](https://biomejs.dev/) for linting and formatting

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/alwaysfullybooked/calybook.git
   cd calybook
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory with the following variables:

   ```env
   # Authentication
   AUTH_SECRET=your_auth_secret
   AUTH_GOOGLE_ID=your_google_client_id
   AUTH_GOOGLE_SECRET=your_google_client_secret

   # AlwaysFullyBooked API
   ALWAYSFULLYBOOKED_API_KEY=your_afb_api_key
   ALWAYSFULLYBOOKED_API_URL=your_afb_api_url

   # OpenScor API
   OPENSCOR_API_KEY=your_openscor_api_key
   OPENSCOR_API_URL=your_openscor_api_url

   # AI Integration
   OPENROUTER_API_KEY=your_openrouter_api_key

   # Database
   DATABASE_URL=your_planetscale_mysql_database_url

   # Environment
   NODE_ENV=development
   ```

4. Set up the database:

   ```bash
   # Generate database migrations
   pnpm db:generate

   # Push schema to database
   pnpm db:push

   # Or run migrations
   pnpm db:migrate
   ```

5. Run the development server:

   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3001`

## Available Scripts

- `pnpm dev` - Start development server on port 3001 with Turbo
- `pnpm build` - Build the application for production
- `pnpm start` - Start production server on port 3001
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm check` - Run Biome linting and formatting checks
- `pnpm check:write` - Run Biome and fix issues
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Drizzle Studio for database management

## Environment Variables

### Required Variables

- `AUTH_SECRET`: Secret for NextAuth.js (optional in development)
- `AUTH_GOOGLE_ID`: Google OAuth client ID
- `AUTH_GOOGLE_SECRET`: Google OAuth client secret
- `ALWAYSFULLYBOOKED_API_KEY`: API key for AlwaysFullyBooked
- `ALWAYSFULLYBOOKED_API_URL`: Base URL for AlwaysFullyBooked API
- `OPENSCOR_API_KEY`: API key for OpenScor
- `OPENSCOR_API_URL`: Base URL for OpenScor API
- `OPENROUTER_API_KEY`: API key for OpenRouter AI
- `DATABASE_URL`: PlanetScale MySQL database connection URL

### Optional Variables

- `NODE_ENV`: Environment mode (development, test, production)
- `SKIP_ENV_VALIDATION`: Skip environment validation (useful for Docker builds)

## Project Structure

```
src/
├── actions/           # Server actions for data mutations
├── app/              # Next.js App Router pages
│   ├── (authed)/     # Authenticated user pages
│   ├── (global)/     # Global pages (login, signup, etc.)
│   ├── (local)/      # Country-specific pages
│   └── api/          # API routes
├── components/       # React components
│   ├── client/       # Client-side components
│   ├── server/       # Server-side components
│   └── ui/           # shadcn/ui components
├── data/             # Static data and configurations
├── hooks/            # Custom React hooks
├── i18n/             # Internationalization configuration
├── lib/              # Utility libraries and API clients
├── server/           # Server-side code
│   ├── api/          # tRPC API routers
│   ├── auth/         # Authentication configuration
│   └── db/           # Database schema and configuration
├── styles/           # Global styles
└── trpc/             # tRPC client configuration
```

## API Integrations

### OpenScor - Sports Rankings & Competition Platform
The core competitive sports system powered by [OpenScor](https://openscor.com/):
- **Advanced Ranking System**: 
  - Tennis and football player rankings with ELO-based rating
  - Category-based leaderboards (singles, doubles, team)
  - Seasonal and all-time rankings with progression tracking
  - Fair and competitive player matching
- **Game Management**:
  - Match result submission and real-time tracking
  - Score validation and approval system
  - Head-to-head statistics and performance analytics
  - Comprehensive match history and player statistics
- **Competition Features**:
  - Tournament and league management
  - Player registration and participation tracking
  - Real-time score updates and live leaderboards
  - Performance analytics and achievement tracking
- **Player Profiles**:
  - Detailed player statistics and win/loss records
  - Rating progression over time with visual charts
  - Achievement tracking and milestone recognition
  - Competitive history and rival analysis

### AlwaysFullyBooked - Venue Booking Engine
The professional venue management system powered by [AlwaysFullyBooked](https://alwaysfullybooked.com/):
- **Venue Discovery**: Search and browse available venues by location
- **Service Management**: Multiple service types (courts, events, training)
- **Real-time Availability**: Live availability checking with calendar integration
- **Booking Management**: Create, modify, and cancel reservations
- **Payment Processing**: Multiple payment methods (manual prepaid, reservation only, Stripe)
- **Customer Management**: Booking history and customer profiles
- **Multi-currency Support**: International payment handling

### OpenRouter AI
- AI-powered booking assistant
- Natural language processing for venue search
- Automated booking workflow

## Key Technologies

### OpenScor
Sports platform integration with [OpenScor](https://openscor.com/):
- Advanced ranking algorithms and ELO-based rating system
- Real-time competition management and tournament organization
- Player performance analytics and achievement tracking
- Comprehensive match management and statistics

### AlwaysFullyBooked
Booking engine integration with [AlwaysFullyBooked](https://alwaysfullybooked.com/):
- Professional venue management system
- Multi-venue and multi-service support
- Advanced booking workflows and payment processing
- Customer relationship management

### Turbo
This project uses [Turbo](https://turbo.build/) for fast, incremental builds and development. Turbo provides:
- Incremental builds and caching
- Parallel task execution
- Remote caching for team collaboration
- Optimized development server startup

### Tailwind CSS v4
Built with [Tailwind CSS v4](https://tailwindcss.com/) for utility-first styling:
- Modern CSS features with PostCSS
- Optimized for performance
- Custom design system integration
- Responsive design utilities

### shadcn/ui
UI components built with [shadcn/ui](https://ui.shadcn.com/):
- Re-usable component library
- Radix UI primitives
- Customizable design system
- Accessible components out of the box

### tRPC
Type-safe API layer using [tRPC](https://trpc.io/):
- End-to-end type safety
- Automatic type inference
- Optimistic updates
- Real-time subscriptions

### PlanetScale
Database hosted on [PlanetScale](https://planetscale.com/):
- Serverless MySQL platform
- Branch-based development workflow
- Automatic scaling
- Zero-downtime schema changes

## Platform Integration

### Seamless Sports Experience
CalyBook provides a unified sports platform by integrating both competition and booking:

1. **Sports Competition & Rankings** (OpenScor)
   - Join venue-specific rankings and competitions
   - Track match results, statistics, and performance
   - Compete with other players in fair, rated matches
   - View leaderboards, achievements, and progression
   - Participate in tournaments and leagues

2. **Venue Discovery & Booking** (AlwaysFullyBooked)
   - Search for venues in your area
   - View real-time availability and pricing
   - Book courts, services, or events
   - Manage your booking history and preferences

3. **Unified Sports Profile**
   - Single user account across both platforms
   - Integrated booking and competitive history
   - Seamless navigation between booking and competition features
   - Complete sports journey tracking

### Technical Integration
- **Shared Authentication**: Single sign-on across both platforms
- **Data Synchronization**: Real-time updates between booking and ranking systems
- **Unified UI**: Consistent design language and user experience
- **Cross-platform Features**: Book a court and immediately join rankings for that venue
- **Performance Tracking**: Link bookings to competitive performance

## Deployment

### Vercel (Recommended)

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Set the environment variables in the Vercel dashboard
4. Deploy!

### Docker

1. Build the Docker image:
     ```bash
   docker build -t calybook .
     ```

2. Run the container:
     ```bash
   docker run -p 3001:3001 calybook
   ```

### Environment Variables for Production

Make sure to set all required environment variables in your production environment. For Docker deployments, you can use the `SKIP_ENV_VALIDATION` variable to skip validation during build time.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm check` to ensure code quality
5. Run `pnpm check:write` to automatically fix formatting issues
6. Submit a pull request

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [T3 Stack Documentation](https://create.t3.gg/)
- [Turbo Documentation](https://turbo.build/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [tRPC](https://trpc.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [PlanetScale](https://planetscale.com/)
- [OpenScor](https://openscor.com/)
- [Radix UI](https://www.radix-ui.com/)

## License

This project is licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE) file for details.
