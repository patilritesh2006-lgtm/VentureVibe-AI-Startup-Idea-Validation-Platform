import React, { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';

interface AnalysisFormProps {
  onAnalyze: (data: {
    ideaTitle: string;
    ideaDescription: string;
    industry: string;
    targetMarket: string;
  }) => void;
  isLoading: boolean;
  sessionsRemaining: number;
}

export const AnalysisForm: React.FC<AnalysisFormProps> = ({ onAnalyze, isLoading, sessionsRemaining }) => {
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetMarket, setTargetMarket] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({ ideaTitle, ideaDescription, industry, targetMarket });
  };

  const industries = [
    'SaaS', 'Fintech', 'Healthtech', 'Edtech', 'E-commerce', 
    'AI/ML', 'Clean Energy', 'Logistics', 'Real Estate', 'Other'
  ];

  return (
    <div className="apple-card p-8 md:p-10 max-w-[800px] mx-auto bg-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-[24px] font-bold text-apple-black mb-1">New Analysis Session</h2>
          <p className="text-apple-gray text-[15px]">Provide your startup details for AI mentorship</p>
        </div>
        <div className="px-5 py-2.5 bg-black/[0.03] rounded-2xl border border-black/[0.05]">
          <div className="text-[11px] text-apple-gray uppercase tracking-widest font-bold mb-0.5">Sessions Left</div>
          <div className={`text-[20px] font-bold ${sessionsRemaining === 0 ? 'text-apple-red' : 'text-apple-blue'}`}>
            {sessionsRemaining}/3
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="apple-label">Startup Name / Working Title</label>
          <input
            type="text"
            required
            value={ideaTitle}
            onChange={(e) => setIdeaTitle(e.target.value)}
            className="apple-input"
            placeholder="e.g. EcoFlow Logistics"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="apple-label">The Idea (Problem & Solution)</label>
            <span className={`text-[11px] font-medium ${ideaDescription.length >= 1900 ? 'text-apple-red' : 'text-apple-gray'}`}>
              {ideaDescription.length}/2000
            </span>
          </div>
          <textarea
            required
            rows={4}
            maxLength={2000}
            value={ideaDescription}
            onChange={(e) => setIdeaDescription(e.target.value)}
            className="apple-input resize-none"
            placeholder="Describe what you are building and why it matters..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="apple-label">Industry</label>
            <div className="relative">
              <select
                required
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="apple-input appearance-none cursor-pointer pr-10"
              >
                <option value="" disabled>Select industry</option>
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-apple-gray">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="apple-label">Target Market / Persona</label>
            <input
              type="text"
              required
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              className="apple-input"
              placeholder="e.g. SMBs in Southeast Asia"
            />
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading || sessionsRemaining === 0}
            className="w-full py-4 rounded-2xl text-[17px] font-semibold gap-3"
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Analyze My Idea <Sparkles className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
        
        {sessionsRemaining === 0 && (
          <p className="text-center text-apple-red text-[13px] font-medium">
            Weekly session limit reached. Resets every 7 days.
          </p>
        )}
      </form>
    </div>
  );
};
