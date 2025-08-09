import { GoogleGenerativeAI } from '@google/generative-ai';
import { SubredditInfo } from './reddit-direct';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface RecommendationRequest {
  interests: string;
  problems?: string;
  preferences?: string;
}

export interface RecommendationResult {
  subreddits: string[];
  reasoning: string;
  categories: string[];
}

export async function generateSubredditRecommendations(
  request: RecommendationRequest,
  availableSubreddits: SubredditInfo[]
): Promise<RecommendationResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const subredditList = availableSubreddits
      .map(sub => `- r/${sub.name}: ${sub.description} (${sub.subscribers} subscribers)`)
      .join('\n');

    const prompt = `
You are a Reddit expert helping users find relevant subreddits based on their interests and problems.

User Input:
- Interests: ${request.interests}
${request.problems ? `- Problems/Challenges: ${request.problems}` : ''}
${request.preferences ? `- Preferences: ${request.preferences}` : ''}

Available Subreddits:
${subredditList}

Please analyze the user's input and recommend the most relevant subreddits from the list above. Consider:
1. Direct topic matches
2. Community size and activity
3. Relevance to stated problems or interests
4. Potential for helpful discussions

Respond in JSON format with:
{
  "subreddits": ["subreddit1", "subreddit2", ...],
  "reasoning": "Write a well-formatted explanation with each subreddit recommendation on a new sentence. Mention specific subreddits using the format r/subredditname. Explain why each recommended subreddit is relevant to the user's interests.",
  "categories": ["category1", "category2", ...]
}

IMPORTANT: In the reasoning field, write clear sentences separated by periods. Each sentence should explain one subreddit recommendation. Use the exact format r/subredditname when mentioning subreddits.

Limit recommendations to 5-8 most relevant subreddits.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          subreddits: parsed.subreddits || [],
          reasoning: parsed.reasoning || 'No reasoning provided',
          categories: parsed.categories || []
        };
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
    }

    // Fallback if JSON parsing fails
    return {
      subreddits: [],
      reasoning: 'Unable to generate recommendations at this time.',
      categories: []
    };
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return {
      subreddits: [],
      reasoning: 'Error occurred while generating recommendations.',
      categories: []
    };
  }
}

export async function enhanceUserQuery(userInput: string): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
Analyze this user input about their interests or problems: "${userInput}"

Generate 3-5 relevant search keywords or phrases that would help find appropriate subreddits on Reddit. 
Focus on:
- Main topics and themes
- Related communities
- Problem-solving contexts
- Hobby or interest areas

Return only the keywords/phrases, one per line, without explanations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 5);
  } catch (error) {
    console.error('Error enhancing user query:', error);
    return [userInput];
  }
}