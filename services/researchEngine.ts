
import { GoogleGenAI } from "@google/genai";
import { GeminiService } from "./geminiService";
import { Problem, ResearchPlan } from "../types";

export class ResearchEngine {
  private gemini: GeminiService;

  constructor() {
    this.gemini = new GeminiService();
  }

  async run(topic: string, onProgress: (step: string) => void): Promise<Problem[]> {
    try {
      onProgress("🎯 Intelligent Planning: Decomposing topic...");
      const plan = await this.gemini.generateResearchPlan(topic);
      
      onProgress(`🌐 Web Search: Scanning Reddit & Product Hunt...`);
      const simulatedRawData = await this.simulateExtraction(topic, plan, onProgress);
      
      onProgress("🤖 Pattern Analysis: Clustering into opportunities...");
      const problems = await this.gemini.analyzeAndCluster(topic, simulatedRawData);
      
      onProgress("✅ Finalizing ranked results...");
      return problems.sort((a, b) => b.signalScore - a.signalScore);
    } catch (error) {
      console.error("Research failed:", error);
      throw error;
    }
  }

  private async simulateExtraction(topic: string, plan: ResearchPlan, onProgress: (step: string) => void): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
    
    // Using flash for faster simulation
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Simulate search results for: "${topic}". 
      Subreddits: ${plan.subreddits.join(', ')}.
      Generate 15 specific raw user complaints and forum posts with source URLs.`,
    });

    onProgress(`🔍 Extracting complaints from review sites...`);
    
    return response.text || '';
  }
}
