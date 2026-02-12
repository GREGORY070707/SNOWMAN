
import { GoogleGenAI, Type } from "@google/genai";
import { ResearchPlan, Problem } from "../types";

export class GeminiService {
  // Generates a research plan based on the provided topic.
  async generateResearchPlan(topic: string): Promise<ResearchPlan> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a research plan for the topic: "${topic}". 
      Focus on finding business problems, customer complaints, and market gaps.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subreddits: { type: Type.ARRAY, items: { type: Type.STRING } },
            searchTerms: { type: Type.ARRAY, items: { type: Type.STRING } },
            productHuntQueries: { type: Type.ARRAY, items: { type: Type.STRING } },
            reviewSiteQueries: { type: Type.ARRAY, items: { type: Type.STRING } },
            competitorTools: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["subreddits", "searchTerms", "productHuntQueries", "reviewSiteQueries", "competitorTools"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  }

  // Analyzes raw data and clusters it into specific business problems.
  // Switched to gemini-3-flash-preview for high speed.
  async analyzeAndCluster(topic: string, rawData: string): Promise<Problem[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this research data for the topic "${topic}" and cluster them into the top 5-10 business problems.
      Data: ${rawData}
      
      Score each problem cluster (0-10) on:
      - Frequency, Pain Intensity, Monetization, Solvability, Competitive Gap.
      
      Overall Signal Score is weighted: (Freq*0.25) + (Pain*0.25) + (Money*0.3) + (Solvability*0.1) + (Gap*0.1).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              rank: { type: Type.NUMBER },
              problemStatement: { type: Type.STRING },
              signalScore: { type: Type.NUMBER },
              scores: {
                type: Type.OBJECT,
                properties: {
                  frequency: { type: Type.NUMBER },
                  painIntensity: { type: Type.NUMBER },
                  monetization: { type: Type.NUMBER },
                  solvability: { type: Type.NUMBER },
                  competitiveGap: { type: Type.NUMBER }
                }
              },
              evidence: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    source: { type: Type.STRING },
                    url: { type: Type.STRING },
                    platform: { type: Type.STRING }
                  }
                }
              },
              existingSolutions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    url: { type: Type.STRING },
                    rating: { type: Type.NUMBER },
                    complaintSummary: { type: Type.STRING },
                    reviewCount: { type: Type.NUMBER }
                  }
                }
              },
              suggestedNextStep: { type: Type.STRING },
              metadata: {
                type: Type.OBJECT,
                properties: {
                  mentionCount: { type: Type.NUMBER },
                  sources: { type: Type.ARRAY, items: { type: Type.STRING } },
                  createdAt: { type: Type.STRING }
                }
              }
            },
            required: ["id", "rank", "problemStatement", "signalScore", "scores", "evidence", "existingSolutions", "suggestedNextStep", "metadata"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  }
}
