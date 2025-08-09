# 🚀 Reddit Community Finder

An AI-powered web application that helps users discover relevant Reddit communities based on their interests and problems. Built with Next.js, TypeScript, and integrates with Reddit API and Google's Gemini AI.

![Reddit Community Finder](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **🤖 AI-Powered Recommendations**: Uses Google Gemini AI to analyze user input and suggest relevant subreddits
- **🔍 Smart Search**: Enhances user queries with AI to find better community matches
- **📱 Responsive Design**: Beautiful, modern UI that works on all devices
- **🎨 Glassmorphism UI**: Stunning purple gradient design with backdrop blur effects
- **🔗 Clickable Subreddit Links**: AI reasoning text formats r/subreddit mentions as clickable links
- **⚡ Real-time Data**: Fetches live subreddit data including subscriber counts and descriptions
- **🎯 Natural Language Input**: Describe interests in plain English - no technical jargon needed
- **📊 Community Insights**: Shows subscriber counts, descriptions, and categories
- **🌟 Smooth Animations**: Floating elements, hover effects, and loading states

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **APIs**: Reddit API (direct implementation), Google Gemini AI
- **Deployment**: Vercel-ready
- **Package Manager**: npm

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Reddit API credentials
- Google Gemini AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd reddit-community-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the `.env.local` file and update with your API credentials:
   ```env
   # Reddit API Configuration
   REDDIT_CLIENT_ID=your_reddit_client_id
   REDDIT_CLIENT_SECRET=your_reddit_client_secret
   REDDIT_USER_AGENT=SubredditRecommender/1.0.0

   # Gemini AI Configuration
   GEMINI_API_KEY=your_gemini_api_key

   # Next.js Configuration
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 API Setup Guide

### Reddit API Setup

1. **Go to Reddit Apps**: Visit [https://www.reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)

2. **Create a new app**:
   - Click "Create App" or "Create Another App"
   - Choose **"script"** as the app type
   - Fill in the required fields:
     - **Name**: Your app name (e.g., "Reddit Community Finder")
     - **Description**: Brief description of your app
     - **About URL**: Can be left blank
     - **Redirect URI**: Use `http://localhost:3000` for development

3. **Get your credentials**:
   - **Client ID**: Found under the app name (short string)
   - **Client Secret**: The "secret" field (longer string)

### Google Gemini AI Setup

1. **Go to Google AI Studio**: Visit [https://aistudio.google.com/](https://aistudio.google.com/)

2. **Get API Key**:
   - Sign in with your Google account
   - Click "Get API Key"
   - Create a new API key
   - Copy the generated key

3. **Important**: Keep your API key secure and never commit it to version control

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── recommendations/     # API endpoint for getting recommendations
│   ├── globals.css             # Global styles and animations
│   ├── layout.tsx              # App layout and metadata
│   └── page.tsx                # Main page component
├── components/
│   └── ui/                     # shadcn/ui components
└── lib/
    ├── gemini.ts               # Google Gemini AI integration
    └── reddit-direct.ts        # Reddit API integration
```

## 🎯 How It Works

1. **User Input**: Users describe their interests, problems, or what they're looking for in natural language
2. **Query Enhancement**: Gemini AI analyzes the input and generates relevant search terms
3. **Subreddit Search**: The app searches Reddit for communities matching those terms
4. **AI Analysis**: Gemini AI evaluates all found subreddits and recommends the most relevant ones
5. **Results Display**: Shows recommended subreddits with descriptions, subscriber counts, and direct links

## 💡 Usage Example

**Input**: 
> "I love photography, especially landscape and street photography. I'm also interested in learning about camera gear and editing techniques."

**Output**: 
The app will recommend relevant subreddits like:
- r/photography - General photography discussions
- r/LandscapePhotography - Landscape-specific community  
- r/streetphotography - Street photography enthusiasts
- r/cameras - Camera gear discussions
- r/postprocessing - Photo editing techniques

Each recommendation includes explanations of why it's relevant to your interests.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**: Push your code to a GitHub repository

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard

3. **Deploy**: Vercel will automatically deploy your app

### Environment Variables for Production

Make sure to add these environment variables in your deployment platform:
- `REDDIT_CLIENT_ID`
- `REDDIT_CLIENT_SECRET`
- `REDDIT_USER_AGENT`
- `GEMINI_API_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your production URL)

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for custom animations and styles
- Update Tailwind classes in components for different color schemes
- Adjust the gradient background in `src/app/page.tsx`

### AI Prompts
- Customize AI behavior in `src/lib/gemini.ts`
- Modify search strategies and recommendation logic

## 🐛 Troubleshooting

### Common Issues

1. **"Module not found" errors**: Run `npm install` to ensure all dependencies are installed

2. **Reddit API errors**: 
   - Verify your Reddit API credentials are correct
   - Ensure your app type is set to "script"
   - Check that your redirect URI matches

3. **Gemini AI errors**:
   - Verify your API key is valid
   - Check that you have sufficient API quota
   - Ensure the model name is correct (`gemini-1.5-flash`)

4. **Port already in use**: 
   - Kill the process using the port: `npx kill-port 3000`
   - Or use a different port: `npm run dev -- -p 3001`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Reddit API](https://www.reddit.com/dev/api/) for community data
- [Google Gemini AI](https://ai.google.dev/) for intelligent recommendations
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Next.js](https://nextjs.org/) for the React framework

---

**Built with ❤️ for the Reddit community**