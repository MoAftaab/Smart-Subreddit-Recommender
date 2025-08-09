# Reddit API Setup Guide

To use this Reddit Subreddit Finder app, you need to set up Reddit API credentials.

## Steps to get Reddit API credentials:

1. **Go to Reddit Apps**: Visit https://www.reddit.com/prefs/apps
2. **Create a new app**:
   - Click "Create App" or "Create Another App"
   - Choose "script" as the app type
   - Fill in the required fields:
     - **Name**: Your app name (e.g., "Subreddit Finder")
     - **Description**: Brief description of your app
     - **About URL**: Can be left blank or use your website
     - **Redirect URI**: Use `http://localhost:3000` for development
3. **Get your credentials**:
   - **Client ID**: Found under the app name (short string)
   - **Client Secret**: The "secret" field (longer string)

## Update your .env.local file:

Replace the placeholder values in `.env.local`:

```env
# Reddit API Configuration
REDDIT_CLIENT_ID=your_actual_client_id_here
REDDIT_CLIENT_SECRET=your_actual_client_secret_here
REDDIT_USER_AGENT=SubredditRecommender/1.0.0

# Gemini AI Configuration (already set)
GEMINI_API_KEY=AIzaSyCVe44K6TYJps1WQK8e23nO0zUyzSebrh4

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## Important Notes:

- The app uses read-only access, so no username/password is needed
- Keep your credentials secure and never commit them to version control
- The Gemini API key is already configured in your .env.local file
- For production, make sure to update NEXTAUTH_URL to your actual domain

## Testing the Setup:

After updating your credentials, restart the development server:

```bash
npm run dev
```

Then visit http://localhost:3000 and try making a recommendation request.