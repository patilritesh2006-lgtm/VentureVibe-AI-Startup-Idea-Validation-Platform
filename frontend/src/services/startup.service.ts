import { api } from '@/lib/api';

export interface VentureSession {
  id: string;
  userId: string;
  ideaTitle: string;
  ideaDescription: string;
  industry: string;
  targetMarket: string;
  analysis?: VentureAnalysis;
  createdAt: string;
}

export interface VentureAnalysis {
  id: string;
  sessionId: string;
  startupViabilityIndex: number;
  marketOpportunityScore: number;
  executionFeasibilityScore: number;
  differentiationScore: number;
  monetizationScore: number;
  riskScore: number;
  riskExposureLevel: string;
  executiveSummary: string;
  riskAssessment: {
    marketRisk: string;
    technicalRisk: string;
    adoptionRisk: string;
    revenueRisk: string;
  };
  mvpPlan: {
    day30: string;
    day60: string;
    day90: string;
  };
  positioning: {
    targetPersona: string;
    uniqueAdvantage: string;
    competitiveEdge: string;
  };
  elevatorPitch: string;
  linkedinDraft?: string;
  isFallback?: boolean;
  createdAt: string;
}

export interface LeaderboardItem {
  rank: number;
  ideaTitle: string;
  founderName: string;
  industry: string;
  sviScore: number;
  createdAt: string;
}

export const startupService = {
  createSession: async (data: {
    ideaTitle: string;
    ideaDescription: string;
    industry: string;
    targetMarket: string;
  }): Promise<VentureSession> => {
    const response = await api.post('/api/sessions', data);
    return response.data;
  },

  getSessions: async (): Promise<VentureSession[]> => {
    const response = await api.get('/api/sessions');
    return response.data;
  },

  getSession: async (id: string): Promise<VentureSession> => {
    const response = await api.get(`/api/sessions/${id}`);
    return response.data;
  },

  getLeaderboard: async (): Promise<LeaderboardItem[]> => {
    const response = await api.get('/api/leaderboard');
    return response.data;
  },
};
