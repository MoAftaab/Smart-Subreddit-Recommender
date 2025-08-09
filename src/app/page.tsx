"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  ExternalLink,
  Users,
  Search,
  Sparkles,
  Brain,
  Target,
  TrendingUp,
  Star,
  Zap,
} from "lucide-react";
import { SubredditInfo } from "@/lib/reddit-direct";

interface RecommendationResponse {
  recommendations: SubredditInfo[];
  reasoning: string;
  categories: string[];
  searchTerms: string[];
}

export default function Home() {
  const [interests, setInterests] = useState("");
  const [problems, setProblems] = useState("");
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!interests.trim()) {
      setError("Please describe your interests");
      return;
    }

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interests: interests.trim(),
          problems: problems.trim(),
          preferences: preferences.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError("Failed to get recommendations. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatReasoningText = (text: string) => {
    // Split text into sentences and format subreddit mentions
    const sentences = text.split(/(?<=[.!?])\s+/);

    return sentences.map((sentence, index) => {
      // Replace r/subreddit mentions with clickable links
      const formattedSentence = sentence.replace(
        /r\/([a-zA-Z0-9_]+)/g,
        '<a href="https://reddit.com/r/$1" target="_blank" rel="noopener noreferrer" class="text-cyan-300 hover:text-cyan-200 underline font-medium transition-colors">r/$1</a>'
      );

      return (
        <p
          key={index}
          className="mb-3 last:mb-0"
          dangerouslySetInnerHTML={{ __html: formattedSentence }}
        />
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Small floating elements only */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-white/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-purple-300/30 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-cyan-300/40 rounded-full animate-float animation-delay-4000"></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-white/25 rounded-full animate-float"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
      </div>

      <div className="relative z-10 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 pt-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-white/20">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-white/90 text-sm font-medium">
                AI-Powered Community Discovery
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-6 leading-tight">
              Reddit
              <br />
              <span className="text-5xl md:text-6xl">Community Finder</span>
            </h1>

            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Discover your perfect Reddit communities with the power of AI.
              <br />
              <span className="text-cyan-300">
                Tell us your interests, we'll find your tribe.
              </span>
            </p>
          </div>

          {/* Input Form */}
          <Card className="mb-12 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
                <Brain className="w-6 h-6 text-purple-400" />
                Tell us about yourself
              </CardTitle>
              <CardDescription className="text-white/70 text-lg">
                Share your passions, challenges, and preferences to get
                personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="interests"
                    className="text-white font-medium flex items-center gap-2"
                  >
                    <Target className="w-4 h-4 text-pink-400" />
                    Your interests *
                  </Label>
                  <Textarea
                    id="interests"
                    placeholder="e.g., I'm passionate about landscape photography and love capturing golden hour shots. I'm also into drone photography and want to learn more about post-processing techniques..."
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/20 min-h-[100px] text-base"
                    rows={4}
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="problems"
                    className="text-white font-medium flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Problems or challenges (optional)
                  </Label>
                  <Textarea
                    id="problems"
                    placeholder="e.g., I struggle with low-light photography settings and need advice on noise reduction. Also looking for budget-friendly gear recommendations..."
                    value={problems}
                    onChange={(e) => setProblems(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/20 text-base"
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="preferences"
                    className="text-white font-medium flex items-center gap-2"
                  >
                    <Star className="w-4 h-4 text-cyan-400" />
                    Community preferences (optional)
                  </Label>
                  <Textarea
                    id="preferences"
                    placeholder="e.g., I prefer active communities with helpful members, beginner-friendly environments, and regular photo challenges or contests..."
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/20 text-base"
                    rows={3}
                  />
                </div>

                {error && (
                  <div className="bg-white/10 border border-white/30 rounded-lg p-4">
                    <p className="text-white/90 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group"
                >
                  {/* Button shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                  {loading ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      <span>AI is analyzing your interests...</span>
                    </>
                  ) : (
                    <>
                      <Search className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                      <span>Discover My Communities</span>
                      <Sparkles className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6 animate-glow">
                <Brain className="w-10 h-10 text-white animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                AI is Working Its Magic
              </h3>
              <p className="text-white/70 text-lg mb-8">
                Analyzing your interests and finding perfect communities...
              </p>

              {/* Loading progress indicators */}
              <div className="max-w-md mx-auto space-y-4">
                <div className="flex items-center justify-between text-white/60 text-sm">
                  <span>Enhancing search terms</span>
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between text-white/60 text-sm">
                  <span>Searching Reddit communities</span>
                  <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse animation-delay-2000"></div>
                </div>
                <div className="flex items-center justify-between text-white/60 text-sm">
                  <span>AI recommendation analysis</span>
                  <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse animation-delay-4000"></div>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          {results && !loading && (
            <div className="space-y-8">
              {/* AI Reasoning */}
              <Card className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-lg border-white/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2 text-xl">
                    <Brain className="w-6 h-6 text-purple-400" />
                    AI Analysis & Reasoning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-white/90 text-lg leading-relaxed mb-6">
                    {formatReasoningText(results.reasoning)}
                  </div>
                  {results.categories.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                        Identified Categories:
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {results.categories.map((category, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 rounded-full text-sm font-medium border border-cyan-500/30"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recommended Communities */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-6 text-center">
                  Your Perfect Communities
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {results.recommendations.map((subreddit, index) => (
                    <Card
                      key={index}
                      className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-[1.05] hover:shadow-2xl hover:shadow-purple-500/20 group hover-lift relative overflow-hidden"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-lg group-hover:text-purple-300 transition-colors">
                            {subreddit.displayName}
                          </CardTitle>
                          <div className="flex items-center text-sm text-white/70 bg-white/10 rounded-full px-3 py-1">
                            <Users className="mr-1 h-4 w-4" />
                            {formatNumber(subreddit.subscribers)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Shimmer effect overlay */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                        </div>

                        <p className="text-white/80 mb-6 line-clamp-3 leading-relaxed relative z-10">
                          {subreddit.description ||
                            "A vibrant community waiting for you to explore!"}
                        </p>
                        <Button
                          asChild
                          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative z-10"
                        >
                          <a
                            href={subreddit.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                          >
                            <span>Explore Community</span>
                            <ExternalLink className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Search Terms Used */}
              {results.searchTerms.length > 0 && (
                <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white/80 text-sm flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      AI Search Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {results.searchTerms.map((term, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/10 text-white/70 rounded-lg text-sm border border-white/20"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="text-center py-12 mt-16">
            <div className="inline-flex items-center gap-2 text-white/60 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Powered by AI • Built with ❤️ for Reddit Communities</span>
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
