import Groq from "groq-sdk";
import { ResearchPlan, Problem } from "../types";

export class GroqService {
  private groq: Groq;

  constructor() {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    console.log('Groq API Key available:', !!apiKey);
    console.log('Environment variables:', import.meta.env);
    if (!apiKey) {
      console.error('VITE_GROQ_API_KEY environment variable is not set');
      throw new Error('VITE_GROQ_API_KEY environment variable is not set');
    }
    this.groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
  }

  async generateResearchPlan(topic: string): Promise<ResearchPlan> {
    const prompt = `Generate a research plan for the topic: "${topic}". 
Focus on finding business problems, customer complaints, and market gaps.

Return ONLY a valid JSON object with this exact structure:
{
  "subreddits": ["array", "of", "subreddit", "names"],
  "searchTerms": ["array", "of", "search", "terms"],
  "productHuntQueries": ["array", "of", "queries"],
  "reviewSiteQueries": ["array", "of", "queries"],
  "competitorTools": ["array", "of", "tool", "names"]
}`;

    const response = await this.groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0]?.message?.content || '{}');
  }

  async analyzeAndCluster(topic: string, rawData: string): Promise<Problem[]> {
    const prompt = `Analyze this research data for the topic "${topic}" and cluster them into the top 5-10 business problems.
Data: ${rawData}

Score each problem cluster (0-10) on:
- Frequency, Pain Intensity, Monetization, Solvability, Competitive Gap.

Overall Signal Score is weighted: (Freq*0.25) + (Pain*0.25) + (Money*0.3) + (Solvability*0.1) + (Gap*0.1).

Return ONLY a valid JSON object with a "problems" array:
{
  "problems": [
    {
      "id": "unique-id",
      "rank": 1,
      "problemStatement": "description",
      "signalScore": 8.5,
      "scores": {
        "frequency": 9,
        "painIntensity": 8,
        "monetization": 9,
        "solvability": 7,
        "competitiveGap": 8
      },
      "evidence": [
        {
          "text": "quote",
          "source": "source name",
          "url": "https://example.com",
          "platform": "Reddit"
        }
      ],
      "existingSolutions": [
        {
          "name": "Tool Name",
          "url": "https://example.com",
          "rating": 4.2,
          "complaintSummary": "summary",
          "reviewCount": 150
        }
      ],
      "suggestedNextStep": "recommendation",
      "metadata": {
        "mentionCount": 25,
        "sources": ["source1", "source2"],
        "createdAt": "2024-01-01T00:00:00Z"
      }
    }
  ]
}`;

    const response = await this.groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content || '{"problems":[]}';
    console.log('Groq analyzeAndCluster response:', content);
    const parsed = JSON.parse(content);
    const problems = parsed.problems || [];
    console.log('Parsed problems count:', problems.length);
    return problems;
  }

  async simulateExtraction(topic: string, plan: ResearchPlan): Promise<string> {
    const prompt = `Simulate search results for: "${topic}". 
Subreddits: ${plan.subreddits.join(', ')}.
Generate 15 specific raw user complaints and forum posts with source URLs.`;

    const response = await this.groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8
    });

    return response.choices[0]?.message?.content || '';
  }
}
