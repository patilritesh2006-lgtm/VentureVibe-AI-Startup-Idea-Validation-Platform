import { Llm, LlmProvider } from '@uptiqai/integrations-sdk';
import prisma from '../client.ts';
import ApiError from '../utils/ApiError.ts';
import { checkAndResetSessionCount, incrementSessionCount } from './userService.ts';

export class StartupService {
  private _llm: Llm | null = null;

  private get llm(): Llm {
    if (!this._llm) {
      const provider = (process.env.LLM_PROVIDER as LlmProvider) || ('Google' as LlmProvider);
      this._llm = new Llm({ provider });
    }
    return this._llm;
  }

  private calculateSVI(scores: {
    marketOpportunity: number;
    executionFeasibility: number;
    differentiation: number;
    monetizationStrength: number;
    riskScore: number;
  }): number {
    const svi =
      scores.marketOpportunity * 0.25 +
      scores.executionFeasibility * 0.20 +
      scores.differentiation * 0.20 +
      scores.monetizationStrength * 0.20 +
      (100 - scores.riskScore) * 0.15;
    return Math.round(svi);
  }

  private getRiskExposureLevel(riskScore: number): string {
    if (riskScore <= 30) return 'Low';
    if (riskScore <= 60) return 'Moderate';
    return 'High';
  }

  async createSession(userId: string, details: {
    ideaTitle: string;
    ideaDescription: string;
    industry: string;
    targetMarket: string;
  }) {
    // 1. Check session limit
    const user = await checkAndResetSessionCount(userId);
    if (user.weeklySessionCount >= 3) {
      throw new ApiError(403, 'Weekly session limit reached.');
    }

    // 2. Generate Analysis with LLM
    const prompt = `
      As VentureVibe AI Startup Mentor, provide a professional, structured analysis for this startup idea:
      
      Idea Title: ${details.ideaTitle}
      Description: ${details.ideaDescription}
      Industry: ${details.industry}
      Target Market: ${details.targetMarket}
      
      Generate a response in strict JSON format:
      {
        "scores": {
          "marketOpportunity": number (0-100),
          "executionFeasibility": number (0-100),
          "differentiation": number (0-100),
          "monetizationStrength": number (0-100),
          "riskScore": number (0-100)
        },
        "executiveSummary": "string",
        "riskAssessment": {
          "marketRisk": "string",
          "technicalRisk": "string",
          "adoptionRisk": "string",
          "revenueRisk": "string"
        },
        "mvpPlan": {
          "day30": "string",
          "day60": "string",
          "day90": "string"
        },
        "positioning": {
          "targetPersona": "string",
          "uniqueAdvantage": "string",
          "competitiveEdge": "string"
        },
        "elevatorPitch": "string",
        "linkedinDraft": "string"
      }
      
      Tone: Structured, professional, analytical. No hype, no emojis.
    `;

    const llmParams: any = {
      messages: [{ role: 'user', content: prompt }],
    };

    if (process.env.LLM_MODEL) {
      llmParams.model = process.env.LLM_MODEL;
    }

    let result;
    let isFallback = false;

    try {
      // AI Call Protection with Timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI Analysis Timeout (30s)')), 30000)
      );

      const aiPromise = this.llm.generateText(llmParams);
      const response = (await Promise.race([aiPromise, timeoutPromise])) as any;

      if (!response || !response.text) {
        throw new Error('Empty AI response');
      }

      // Clean up potential markdown blocks
      const cleanText = response.text.replace(/```json\n?|\n?```/g, '').trim();
      result = JSON.parse(cleanText);
    } catch (error: any) {
      console.error('CRITICAL: AI Analysis Failed.', {
        error: error.message,
        stack: error.stack,
        details: { ideaTitle: details.ideaTitle, userId }
      });

      // Fallback Safety System
      isFallback = true;
      result = {
        scores: {
          marketOpportunity: 72,
          executionFeasibility: 65,
          differentiation: 68,
          monetizationStrength: 60,
          riskScore: 45
        },
        executiveSummary: "(Demo Mode Result) AI service is currently unavailable. Based on typical patterns for " + details.industry + ", your idea shows promising potential with moderate execution risks.",
        riskAssessment: {
          marketRisk: "Standard market competition for " + details.industry + ".",
          technicalRisk: "Initial development and scaling challenges.",
          adoptionRisk: "Customer acquisition in " + details.targetMarket + " requires validation.",
          revenueRisk: "Monetization strategy requires market testing."
        },
        mvpPlan: {
          day30: "Validate core assumptions and build MVP landing page.",
          day60: "Develop functional prototype for early beta testing.",
          day90: "Refine product based on user feedback and prepare for launch."
        },
        positioning: {
          targetPersona: "Core users within " + details.targetMarket + ".",
          uniqueAdvantage: "Targeted solution for identified pain points.",
          competitiveEdge: "Agile iteration and customer-centric design."
        },
        elevatorPitch: details.ideaTitle + " aims to transform " + details.industry + " by providing a robust solution for " + details.targetMarket + ".",
        linkedinDraft: "Just used VentureVibe AI to analyze my startup idea: " + details.ideaTitle + "! Extremely insightful roadmap. #Startup #VentureVibe"
      };
    }

    const svi = this.calculateSVI(result.scores);
    const riskExposureLevel = this.getRiskExposureLevel(result.scores.riskScore);

    // 3. Save to DB
    const session = await prisma.ventureSession.create({
      data: {
        userId,
        ideaTitle: details.ideaTitle,
        ideaDescription: details.ideaDescription,
        industry: details.industry,
        targetMarket: details.targetMarket,
        analysis: {
          create: {
            startupViabilityIndex: svi,
            marketOpportunityScore: result.scores.marketOpportunity,
            executionFeasibilityScore: result.scores.executionFeasibility,
            differentiationScore: result.scores.differentiation,
            monetizationScore: result.scores.monetizationStrength,
            riskScore: result.scores.riskScore,
            riskExposureLevel,
            executiveSummary: result.executiveSummary,
            riskAssessment: result.riskAssessment,
            mvpPlan: result.mvpPlan,
            positioning: result.positioning,
            elevatorPitch: result.elevatorPitch,
            linkedinDraft: result.linkedinDraft,
            isFallback
          }
        }
      },
      include: {
        analysis: true
      }
    });

    // 4. Increment session count ONLY after successful analysis (real or fallback) and DB save
    await incrementSessionCount(userId);

    return {
      ...session,
      isFallback
    };
  }

  async getSessions(userId: string) {
    return await prisma.ventureSession.findMany({
      where: { userId, isDeleted: false },
      include: { analysis: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getSessionById(id: string, userId: string) {
    const session = await prisma.ventureSession.findFirst({
      where: { id, userId, isDeleted: false },
      include: { analysis: true }
    });
    
    if (!session) throw new ApiError(404, 'Session not found');
    return session;
  }

  async getLeaderboard() {
    const analyses = await prisma.ventureAnalysis.findMany({
      where: { isDeleted: false },
      include: {
        session: {
          include: {
            user: true
          }
        }
      },
      orderBy: { startupViabilityIndex: 'desc' },
      take: 20
    });

    return analyses.map((a, index) => ({
      rank: index + 1,
      ideaTitle: a.session.ideaTitle,
      founderName: a.session.user.name || 'Anonymous',
      industry: a.session.industry,
      sviScore: a.startupViabilityIndex,
      createdAt: a.createdAt
    }));
  }
}

export const startupService = new StartupService();
