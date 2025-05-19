# CalyBook

A modern web application for booking venues and services. Built with the T3 Stack.

## Project Description

CalyBook allows users to search for venues, view availability, and book services. It integrates with the AlwaysFullyBooked API for venue and booking management.

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/justbookit.git
   cd justbookit
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env` and fill in the required values.
   - Required environment variables:
     - `AUTH_SECRET`: Secret for NextAuth.js (optional in development).
     - `AUTH_GOOGLE_ID`: Google OAuth client ID.
     - `AUTH_GOOGLE_SECRET`: Google OAuth client secret.
     - `AFB_API_KEY`: API key for AlwaysFullyBooked.
     - `AFB_API_URL`: Base URL for AlwaysFullyBooked API.
     - `DATABASE_URL`: URL for your database.

4. Run the development server:
   ```bash
   pnpm dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
AUTH_SECRET=your_auth_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
AFB_API_KEY=your_afb_api_key
AFB_API_URL=your_afb_api_url
DATABASE_URL=your_database_url
NODE_ENV=development
```

## Deployment Steps

1. **Vercel**:

   - Push your code to a GitHub repository.
   - Connect the repository to Vercel.
   - Set the environment variables in the Vercel dashboard.
   - Deploy!

2. **Netlify**:

   - Push your code to a GitHub repository.
   - Connect the repository to Netlify.
   - Set the environment variables in the Netlify dashboard.
   - Deploy!

3. **Docker**:
   - Build the Docker image:
     ```bash
     docker build -t justbookit .
     ```
   - Run the container:
     ```bash
     docker run -p 3000:3000 justbookit
     ```

## Learn More

To learn more about the T3 Stack, take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!
