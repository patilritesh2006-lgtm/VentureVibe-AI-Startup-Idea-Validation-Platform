import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { startupService, VentureSession } from '../services/startup.service';
import { motion } from 'framer-motion';
import { 
  Download, 
  ChevronLeft, 
  ShieldAlert, 
  Map, 
  Target, 
  Linkedin, 
  Loader2,
  Trophy,
  BarChart3,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '../components/ui/Button';

export const AnalysisResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<VentureSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetchSession();
    }
  }, [id]);

  const fetchSession = async () => {
    try {
      const data = await startupService.getSession(id!);
      setSession(data);
    } catch (err) {
      console.error('Failed to fetch session', err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = async () => {
    if (!reportRef.current || !session) return;
    
    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      backgroundColor: '#F5F5F7',
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`VentureVibe_Report_${session.ideaTitle.replace(/\s+/g, '_')}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin" />
      </div>
    );
  }

  if (!session || !session.analysis) {
    return (
      <div className="text-center py-20 bg-white rounded-[20px] shadow-sm">
        <h2 className="text-[24px] font-bold text-apple-black mb-4 tracking-tight">Analysis Not Found</h2>
        <Link to="/dashboard">
          <Button variant="primary">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const { analysis } = session;

  return (
    <div className="max-w-[1000px] mx-auto space-y-8 fade-in-up">
      <div className="flex items-center justify-between px-2">
        <Link to="/dashboard" className="flex items-center gap-2 text-apple-gray hover:text-apple-black transition-colors text-[14px] font-medium">
          <ChevronLeft className="w-4 h-4" />
          Dashboard
        </Link>
        <Button
          variant="outline"
          onClick={downloadReport}
          className="gap-2 rounded-full px-5"
          size="sm"
        >
          <Download className="w-4 h-4" />
          Download PDF Report
        </Button>
      </div>

      <div ref={reportRef} className="space-y-10">
        {/* Hero Score Section */}
        <div className="apple-card p-10 md:p-14 bg-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-black/[0.04] text-apple-black text-[11px] font-bold rounded-full uppercase tracking-wider">
                  Analysis Report
                </span>
                {analysis.isFallback && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[11px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Demo Mode Result
                  </span>
                )}
                <span className="text-apple-gray text-[11px] font-medium">• {new Date(session.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
              </div>
              <h1 className="text-[36px] md:text-[48px] font-bold text-apple-black leading-tight tracking-tight mb-4">{session.ideaTitle}</h1>
              <p className="text-apple-gray text-[17px] leading-relaxed max-w-xl">{session.ideaDescription}</p>
            </div>
            
            <div className="flex flex-col items-center justify-center bg-[#F5F5F7] p-10 rounded-[24px] min-w-[220px] shadow-sm border border-black/[0.03]">
              <div className="text-apple-gray text-[13px] font-semibold uppercase tracking-widest mb-2">Startup Viability Index</div>
              <div className="text-[72px] font-light text-apple-black leading-none mb-4 tracking-tighter">
                {analysis.startupViabilityIndex}
              </div>
              <div className="w-full h-1.5 bg-black/[0.05] rounded-full overflow-hidden mb-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.startupViabilityIndex}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-apple-blue rounded-full"
                />
              </div>
              <div className={`text-[15px] font-semibold flex items-center gap-1.5 ${
                analysis.riskExposureLevel === 'Low' ? 'text-[#34C759]' : 
                analysis.riskExposureLevel === 'Moderate' ? 'text-[#FF9500]' : 'text-[#FF3B30]'
              }`}>
                {analysis.riskExposureLevel} Risk
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Score Breakdown Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Market Opportunity', score: analysis.marketOpportunityScore, icon: Target, color: 'text-apple-blue' },
            { label: 'Execution Feasibility', score: analysis.executionFeasibilityScore, icon: BarChart3, color: 'text-indigo-500' },
            { label: 'Differentiation', score: analysis.differentiationScore, icon: Trophy, color: 'text-amber-500' },
            { label: 'Monetization Strength', score: analysis.monetizationScore, icon: Zap, color: 'text-[#34C759]' }
          ].map(stat => (
            <div key={stat.label} className="apple-card p-6 bg-white flex flex-col items-center text-center">
              <div className={`p-3 bg-black/[0.03] rounded-2xl mb-4 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-[28px] font-medium text-apple-black mb-1">{stat.score}</div>
              <div className="text-[11px] text-apple-gray uppercase font-bold tracking-wider leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Executive Summary */}
        <section className="apple-card p-10 bg-white">
          <h2 className="text-[22px] font-bold text-apple-black mb-6 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-apple-blue" />
            Executive Summary
          </h2>
          <p className="text-apple-gray text-[17px] leading-[1.7]">
            {analysis.executiveSummary}
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Risk Assessment */}
          <section className="apple-card p-10 bg-white">
            <h2 className="text-[22px] font-bold text-apple-black mb-8 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-apple-red" />
              Risk Assessment
            </h2>
            <div className="space-y-8">
              {Object.entries(analysis.riskAssessment).map(([key, val]) => (
                <div key={key}>
                  <div className="text-[12px] text-apple-gray uppercase font-bold mb-2 tracking-wider">{key.replace(/([A-Z])/g, ' $1')}</div>
                  <p className="text-[15px] text-apple-black/80 leading-relaxed">{val as string}</p>
                </div>
              ))}
            </div>
          </section>

          {/* MVP Roadmap */}
          <section className="apple-card p-10 bg-white">
            <h2 className="text-[22px] font-bold text-apple-black mb-8 flex items-center gap-3">
              <Map className="w-5 h-5 text-apple-blue" />
              MVP Roadmap
            </h2>
            <div className="space-y-10 relative border-l border-black/[0.06] pl-8 ml-2">
              {[
                { day: 'Day 30', val: analysis.mvpPlan.day30 },
                { day: 'Day 60', val: analysis.mvpPlan.day60 },
                { day: 'Day 90', val: analysis.mvpPlan.day90 }
              ].map(plan => (
                <div key={plan.day} className="relative">
                  <div className="absolute -left-[37px] top-1.5 w-[10px] h-[10px] rounded-full bg-apple-blue border-2 border-white ring-4 ring-apple-blue/10" />
                  <div className="text-[13px] text-apple-blue font-bold mb-2 uppercase tracking-wide">{plan.day} Focus</div>
                  <p className="text-[15px] text-apple-black/80 leading-relaxed">{plan.val}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Positioning Strategy */}
        <section className="apple-card p-10 bg-white">
          <h2 className="text-[22px] font-bold text-apple-black mb-8 flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-indigo-500" />
            Positioning Strategy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { label: 'Target Persona', val: analysis.positioning.targetPersona },
              { label: 'Unique Advantage', val: analysis.positioning.uniqueAdvantage },
              { label: 'Competitive Edge', val: analysis.positioning.competitiveEdge }
            ].map(item => (
              <div key={item.label}>
                <div className="text-[12px] text-apple-gray uppercase font-bold mb-3 tracking-wider">{item.label}</div>
                <p className="text-[15px] text-apple-black/80 leading-relaxed">{item.val}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pitches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
          <section className="apple-card p-10 bg-apple-blue shadow-lg shadow-apple-blue/20">
            <h2 className="text-[22px] font-bold text-white mb-6 flex items-center gap-3">
              <Mic2 className="w-5 h-5 text-white/80" />
              Elevator Pitch
            </h2>
            <p className="text-[18px] text-white/90 font-medium leading-[1.6] italic">
              "{analysis.elevatorPitch}"
            </p>
          </section>

          <section className="apple-card p-10 bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-bold text-apple-black flex items-center gap-3">
                <Linkedin className="w-5 h-5 text-[#0077B5]" />
                LinkedIn Draft
              </h2>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(analysis.linkedinDraft || '');
                  alert('Copied to clipboard!');
                }}
                className="text-[12px] text-apple-blue font-bold hover:underline bg-apple-blue/5 px-3 py-1.5 rounded-full"
              >
                Copy Draft
              </button>
            </div>
            <div className="p-6 bg-[#F5F5F7] rounded-2xl border border-black/[0.03]">
              <p className="text-[14px] text-apple-black/80 whitespace-pre-wrap leading-relaxed">
                {analysis.linkedinDraft}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const Mic2: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/><circle cx="17" cy="7" r="5"/>
  </svg>
);