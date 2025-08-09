import Snoowrap from 'snoowrap';

// Initialize Reddit API client
const reddit = new Snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT || 'SubredditRecommender/1.0.0',
  clientId: process.env.REDDIT_CLIENT_ID || '',
  clientSecret: process.env.REDDIT_CLIENT_SECRET || '',
  username: '', // Not needed for read-only access
  password: '', // Not needed for read-only access
});

export interface SubredditInfo {
  name: string;
  displayName: string;
  description: string;
  subscribers: number;
  url: string;
  publicDescription: string;
}

export async function searchSubreddits(query: string, limit: number = 10): Promise<SubredditInfo[]> {
  try {
    const results = await reddit.searchSubreddits({
      query,
      limit,
      sort: 'relevance'
    });

    return results.map((subreddit: any) => ({
      name: subreddit.display_name,
      displayName: subreddit.display_name_prefixed,
      description: subreddit.public_description || subreddit.description || '',
      subscribers: subreddit.subscribers || 0,
      url: `https://reddit.com${subreddit.url}`,
      publicDescription: subreddit.public_description || ''
    }));
  } catch (error) {
    console.error('Error searching subreddits:', error);
    return [];
  }
}

export async function getPopularSubreddits(limit: number = 20): Promise<SubredditInfo[]> {
  try {
    const results = await reddit.getPopularSubreddits({ limit });
    
    return results.map((subreddit: any) => ({
      name: subreddit.display_name,
      displayName: subreddit.display_name_prefixed,
      description: subreddit.public_description || subreddit.description || '',
      subscribers: subreddit.subscribers || 0,
      url: `https://reddit.com${subreddit.url}`,
      publicDescription: subreddit.public_description || ''
    }));
  } catch (error) {
    console.error('Error fetching popular subreddits:', error);
    return [];
  }
}

export async function getSubredditInfo(subredditName: string): Promise<SubredditInfo | null> {
  try {
    const subreddit = await reddit.getSubreddit(subredditName);
    await subreddit.fetch();
    
    return {
      name: subreddit.display_name,
      displayName: subreddit.display_name_prefixed,
      description: subreddit.public_description || subreddit.description || '',
      subscribers: subreddit.subscribers || 0,
      url: `https://reddit.com${subreddit.url}`,
      publicDescription: subreddit.public_description || ''
    };
  } catch (error) {
    console.error(`Error fetching subreddit info for ${subredditName}:`, error);
    return null;
  }
}