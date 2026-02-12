
export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  credits: number;
  is_pro: boolean;
}

export interface DimensionScores {
  frequency: number;
  painIntensity: number;
  monetization: number;
  solvability: number;
  competitiveGap: number;
}

export interface Quote {
  text: string;
  source: string;
  url: string;
  platform: 'reddit' | 'producthunt' | 'g2' | 'forum' | 'web';
  date?: string;
}

export interface Competitor {
  name: string;
  url: string;
  rating: number;
  complaintSummary: string;
  reviewCount: number;
}

export interface Problem {
  id: string;
  rank: number;
  problemStatement: string;
  signalScore: number;
  scores: DimensionScores;
  evidence: Quote[];
  existingSolutions: Competitor[];
  suggestedNextStep: string;
  metadata: {
    mentionCount: number;
    sources: string[];
    createdAt: string;
  };
}

export interface ResearchPlan {
  subreddits: string[];
  searchTerms: string[];
  productHuntQueries: string[];
  reviewSiteQueries: string[];
  competitorTools: string[];
}

export enum ResearchStatus {
  IDLE = 'IDLE',
  PLANNING = 'PLANNING',
  SEARCHING = 'SEARCHING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}
