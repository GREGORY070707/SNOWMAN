
import { GroqService } from "./groqService";
import { Problem, ResearchPlan } from "../types";

export class ResearchEngine {
  private groq: GroqService;

  constructor() {
    this.groq = new GroqService();
  }

  async run(topic: string, onProgress: (step: string) => void): Promise<Problem[]> {
    try {
      onProgress("🎯 Intelligent Planning: Decomposing topic...");
      const plan = await this.groq.generateResearchPlan(topic);
      console.log('Research plan generated:', plan);
      
      onProgress(`🌐 Web Search: Scanning Reddit & Product Hunt...`);
      const simulatedRawData = await this.groq.simulateExtraction(topic, plan);
      console.log('Simulated data length:', simulatedRawData.length);
      
      onProgress(`🔍 Extracting complaints from review sites...`);
      
      onProgress("🤖 Pattern Analysis: Clustering into opportunities...");
      const problems = await this.groq.analyzeAndCluster(topic, simulatedRawData);
      console.log('Problems found:', problems.length);
      
      onProgress("✅ Finalizing ranked results...");
      const sortedProblems = problems.sort((a, b) => b.signalScore - a.signalScore);
      console.log('Sorted problems:', sortedProblems);
      return sortedProblems;
    } catch (error) {
      console.error("Research failed:", error);
      throw error;
    }
  }
}
