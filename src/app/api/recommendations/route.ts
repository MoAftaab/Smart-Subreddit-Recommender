import { NextRequest, NextResponse } from 'next/server';
import { searchSubreddits, getPopularSubreddits } from '@/lib/reddit-direct';
import { generateSubredditRecommendations, enhanceUserQuery } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { interests, problems, preferences } = body;

    if (!interests || interests.trim().length === 0) {
      return NextResponse.json(
        { error: 'Interests field is required' },
        { status: 400 }
      );
    }

    // Enhance the user query to get better search terms
    const searchTerms = await enhanceUserQuery(interests);
    
    // Search for relevant subreddits using multiple terms
    const allSubreddits = new Map();
    
    // Search with enhanced terms
    for (const term of searchTerms) {
      const results = await searchSubreddits(term, 15);
      results.forEach(sub => {
        if (!allSubreddits.has(sub.name)) {
          allSubreddits.set(sub.name, sub);
        }
      });
    }

    // Also get some popular subreddits as fallback
    const popularSubs = await getPopularSubreddits(30);
    popularSubs.forEach(sub => {
      if (!allSubreddits.has(sub.name)) {
        allSubreddits.set(sub.name, sub);
      }
    });

    const availableSubreddits = Array.from(allSubreddits.values());

    // Generate AI recommendations
    const recommendations = await generateSubredditRecommendations(
      { interests, problems, preferences },
      availableSubreddits
    );

    // Get full info for recommended subreddits
    const recommendedSubreddits = recommendations.subreddits
      .map(name => availableSubreddits.find(sub => sub.name.toLowerCase() === name.toLowerCase()))
      .filter(Boolean);

    return NextResponse.json({
      recommendations: recommendedSubreddits,
      reasoning: recommendations.reasoning,
      categories: recommendations.categories,
      searchTerms
    });

  } catch (error) {
    console.error('Error in recommendations API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}