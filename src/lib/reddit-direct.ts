import axios from 'axios';

export interface SubredditInfo {
  name: string;
  displayName: string;
  description: string;
  subscribers: number;
  url: string;
  publicDescription: string;
}

// Get Reddit access token
async function getRedditAccessToken(): Promise<string> {
  try {
    const auth = Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64');
    
    const response = await axios.post('https://www.reddit.com/api/v1/access_token', 
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': process.env.REDDIT_USER_AGENT || 'SubredditRecommender/1.0.0'
        }
      }
    );
    
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Reddit access token:', error);
    throw error;
  }
}

export async function searchSubreddits(query: string, limit: number = 10): Promise<SubredditInfo[]> {
  try {
    const accessToken = await getRedditAccessToken();
    
    const response = await axios.get(`https://oauth.reddit.com/subreddits/search`, {
      params: {
        q: query,
        limit,
        sort: 'relevance',
        type: 'sr'
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': process.env.REDDIT_USER_AGENT || 'SubredditRecommender/1.0.0'
      }
    });

    return response.data.data.children.map((item: any) => {
      const subreddit = item.data;
      return {
        name: subreddit.display_name,
        displayName: subreddit.display_name_prefixed,
        description: subreddit.public_description || subreddit.description || '',
        subscribers: subreddit.subscribers || 0,
        url: `https://reddit.com${subreddit.url}`,
        publicDescription: subreddit.public_description || ''
      };
    });
  } catch (error) {
    console.error('Error searching subreddits:', error);
    return [];
  }
}

export async function getPopularSubreddits(limit: number = 20): Promise<SubredditInfo[]> {
  try {
    const accessToken = await getRedditAccessToken();
    
    const response = await axios.get(`https://oauth.reddit.com/subreddits/popular`, {
      params: {
        limit
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': process.env.REDDIT_USER_AGENT || 'SubredditRecommender/1.0.0'
      }
    });

    return response.data.data.children.map((item: any) => {
      const subreddit = item.data;
      return {
        name: subreddit.display_name,
        displayName: subreddit.display_name_prefixed,
        description: subreddit.public_description || subreddit.description || '',
        subscribers: subreddit.subscribers || 0,
        url: `https://reddit.com${subreddit.url}`,
        publicDescription: subreddit.public_description || ''
      };
    });
  } catch (error) {
    console.error('Error fetching popular subreddits:', error);
    return [];
  }
}

export async function getSubredditInfo(subredditName: string): Promise<SubredditInfo | null> {
  try {
    const accessToken = await getRedditAccessToken();
    
    const response = await axios.get(`https://oauth.reddit.com/r/${subredditName}/about`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': process.env.REDDIT_USER_AGENT || 'SubredditRecommender/1.0.0'
      }
    });

    const subreddit = response.data.data;
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