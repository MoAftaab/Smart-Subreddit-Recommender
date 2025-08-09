import { NextRequest, NextResponse } from 'next/server'

interface RedditSubreddit {
  display_name: string
  title: string
  public_description: string
  subscribers: number
  active_user_count: number
  url: string
  over18: boolean
  subreddit_type: string
}

interface ProcessedSubreddit {
  name: string
  title: string
  description: string
  subscribers: number
  active_users: number
  url: string
  category?: string
}

function categorizeSubreddit(subreddit: RedditSubreddit): string {
  const name = subreddit.display_name.toLowerCase()
  const title = subreddit.title.toLowerCase()
  const description = subreddit.public_description.toLowerCase()

  const categories = {
    'Technology': ['tech', 'programming', 'coding', 'software', 'computer', 'ai', 'ml', 'developer', 'gadgets'],
    'Gaming': ['gaming', 'games', 'game', 'play', 'console', 'pc', 'xbox', 'playstation', 'nintendo'],
    'Career': ['career', 'job', 'work', 'employment', 'resume', 'interview', 'professional'],
    'Health': ['health', 'fitness', 'medical', 'wellness', 'exercise', 'diet', 'mental', 'therapy'],
    'Hobby': ['hobby', 'craft', 'art', 'music', 'photography', 'cooking', 'gardening', 'diy'],
    'Education': ['learn', 'education', 'school', 'study', 'university', 'college', 'course', 'tutorial'],
    'Entertainment': ['movies', 'tv', 'shows', 'music', 'books', 'reading', 'comedy', 'funny'],
    'Sports': ['sports', 'football', 'basketball', 'soccer', 'baseball', 'hockey', 'fitness'],
    'Finance': ['finance', 'money', 'investing', 'stocks', 'business', 'economy', 'crypto'],
    'Lifestyle': ['life', 'lifestyle', 'relationships', 'dating', 'family', 'home', 'travel']
  }

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => 
      name.includes(keyword) || 
      title.includes(keyword) || 
      description.includes(keyword)
    )) {
      return category
    }
  }

  return 'General'
}

// List of popular and trending subreddits for surprise functionality
const trendingSubreddits = [
  'todayilearned', 'AskReddit', 'gaming', 'movies', 'music', 'science',
  'technology', 'programming', 'funny', 'pics', 'videos', 'news',
  'books', 'fitness', 'food', 'travel', 'art', 'DIY', 'LifeProTips',
  'explainlikeimfive', 'dataisbeautiful', 'Showerthoughts', 'Jokes',
  'gadgets', 'space', 'history', 'philosophy', 'psychology', 'sports'
]

export async function POST(request: NextRequest) {
  try {
    // Get random subreddits from our trending list
    const shuffled = [...trendingSubreddits].sort(() => 0.5 - Math.random())
    const selectedSubreddits = shuffled.slice(0, 8) // Get 8 random ones

    // Fetch details for each subreddit
    const subredditPromises = selectedSubreddits.map(async (subredditName) => {
      try {
        const response = await fetch(`https://www.reddit.com/r/${subredditName}/about.json`, {
          headers: {
            'User-Agent': 'RedditCommunityFinder/1.0'
          }
        })

        if (!response.ok) {
          return null
        }

        const data = await response.json()
        return data.data
      } catch (error) {
        console.error(`Error fetching details for ${subredditName}:`, error)
        return null
      }
    })

    const subredditData = await Promise.all(subredditPromises)
    const validSubreddits: RedditSubreddit[] = subredditData.filter(
      (data): data is RedditSubreddit => 
        data && 
        data.subreddit_type === 'public' && 
        !data.over18 && 
        data.subscribers > 1000
    )

    // Process and return top 5
    const processedSubreddits: ProcessedSubreddit[] = validSubreddits
      .sort((a, b) => {
        // Sort by activity (active users + subscribers)
        const activityA = (a.active_user_count || 0) + a.subscribers
        const activityB = (b.active_user_count || 0) + b.subscribers
        return activityB - activityA
      })
      .slice(0, 5)
      .map(subreddit => ({
        name: subreddit.display_name,
        title: subreddit.title,
        description: subreddit.public_description || 'No description available',
        subscribers: subreddit.subscribers,
        active_users: subreddit.active_user_count || 0,
        url: `https://reddit.com${subreddit.url}`,
        category: categorizeSubreddit(subreddit)
      }))

    return NextResponse.json({
      subreddits: processedSubreddits,
      total_results: processedSubreddits.length,
      message: 'Surprise! Here are some trending communities you might enjoy.'
    })

  } catch (error) {
    console.error('Error in reddit-surprise API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch surprise recommendations' },
      { status: 500 }
    )
  }
}