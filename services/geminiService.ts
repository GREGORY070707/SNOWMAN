
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { ResearchPlan, Problem } from "../types";

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
  }

  // Generates a research plan based on the provided topic.
  async generateResearchPlan(topic: string): Promise<ResearchPlan> {
    const model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            subreddits: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            searchTerms: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            productHuntQueries: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            reviewSiteQueries: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            competitorTools: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
          },
          required: ["subreddits", "searchTerms", "productHuntQueries", "reviewSiteQueries", "competitorTools"]
        }
      }
    });

    const prompt = `Generate a research plan for the topic: "${topic}". 
      Focus on finding business problems, customer complaints, and market gaps.`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    return JSON.parse(response.text());
  }

  // Analyzes raw data and clusters it into specific business problems.
  async analyzeAndCluster(topic: string, rawData: string): Promise<Problem[]> {
    const model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              id: { type: SchemaType.STRING },
              rank: { type: SchemaType.NUMBER },
              problemStatement: { type: SchemaType.STRING },
              signalScore: { type: SchemaType.NUMBER },
              scores: {
                type: SchemaType.OBJECT,
                properties: {
                  frequency: { type: SchemaType.NUMBER },
                  painIntensity: { type: SchemaType.NUMBER },
                  monetization: { type: SchemaType.NUMBER },
                  solvability: { type: SchemaType.NUMBER },
                  competitiveGap: { type: SchemaType.NUMBER }
                }
              },
              evidence: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    text: { type: SchemaType.STRING },
                    source: { type: SchemaType.STRING },
                    url: { type: SchemaType.STRING },
                    platform: { type: SchemaType.STRING }
                  }
                }
              },
              existingSolutions: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    name: { type: SchemaType.STRING },
                    url: { type: SchemaType.STRING },
                    rating: { type: SchemaType.NUMBER },
                    complaintSummary: { type: SchemaType.STRING },
                    reviewCount: { type: SchemaType.NUMBER }
                  }
                }
              },
              suggestedNextStep: { type: SchemaType.STRING },
              metadata: {
                type: SchemaType.OBJECT,
                properties: {
                  mentionCount: { type: SchemaType.NUMBER },
                  sources: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                  createdAt: { type: SchemaType.STRING }
                }
              }
            },
            required: ["id", "rank", "problemStatement", "signalScore", "scores", "evidence", "existingSolutions", "suggestedNextStep", "metadata"]
          }
        }
      }
    });

    const prompt = `Analyze this research data for the topic "${topic}" and cluster them into the top 5-10 business problems.
      Data: ${rawData}
      
      Score each problem cluster (0-10) on:
      - Frequency, Pain Intensity, Monetization, Solvability, Competitive Gap.
      
      Overall Signal Score is weighted: (Freq*0.25) + (Pain*0.25) + (Money*0.3) + (Solvability*0.1) + (Gap*0.1).`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    return JSON.parse(response.text());
  }
}
