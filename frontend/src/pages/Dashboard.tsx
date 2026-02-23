import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startupService, VentureSession } from '../services/startup.service';
import { authService, User } from '../services/auth.service';
import { AnalysisForm } from '../components/AnalysisForm';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Calendar, ArrowRight, Loader2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [sessions, setSessions] = useState<VentureSession[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sessionsData, userData] = await Promise.all([
        startupService.getSessions(),
        authService.getMe()
      ]);
      setSessions(sessionsData);
      setUser(userData);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async (data: any) => {
    if (isAnalyzing) return; // Prevent double submission
    setIsAnalyzing(true);
    setLastError(null);
    
    try {
      const newSession = await startupService.createSession(data);
      // Re-fetch user data to sync session count after analysis
      await authService.getMe().then(setUser);
      navigate(`/analysis/${newSession.id}`);
    } catch (err: any) {
      console.error('Analysis failed', err);
      
      let errorMessage = "AI service temporarily unavailable. Please try again.";
      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 403 || data?.message?.includes('limit')) {
        errorMessage = "Daily analysis limit reached.";
      } else if (!window.navigator.onLine || err.message === 'Network Error') {
        errorMessage = "Network issue detected. Please retry.";
      }

      setLastError(err.message || "Unknown error");
      alert(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDebugToggle = () => {
    setClickCount(prev => {
      if (prev + 1 >= 3) {
        setDebugMode(!debugMode);
        return 0;
      }
      return prev + 1;
    });
    setTimeout(() => setClickCount(0), 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto space-y-16">
      <header className="fade-in-up flex justify-between items-start">
        <div>
          <h1 className="text-[32px] font-bold text-apple-black mb-2 tracking-tight">Hello, {user?.name || 'Founder'}</h1>
          <p className="text-[17px] text-apple-gray">Welcome to your startup command center.</p>
        </div>
        {debugMode && (
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl text-[12px] font-mono space-y-1 max-w-xs">
            <div className="font-bold text-orange-800">DEBUG MODE</div>
            <div>Sessions: {user?.weeklySessionCount}/3</div>
            <div>Reset: {user?.weeklyResetAt ? new Date(user.weeklyResetAt).toLocaleDateString() : 'N/A'}</div>
            <div>AI Status: {isAnalyzing ? 'Analyzing...' : 'Ready'}</div>
            {lastError && <div className="text-red-600 truncate">Last Err: {lastError}</div>}
          </div>
        )}
      </header>

      <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
        <AnalysisForm 
          onAnalyze={handleAnalyze} 
          isLoading={isAnalyzing} 
          sessionsRemaining={user ? Math.max(0, 3 - user.weeklySessionCount) : 0} 
        />
      </div>

      <section className="fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black/5 rounded-lg">
              <History className="w-5 h-5 text-apple-black" />
            </div>
            <h2 className="text-[22px] font-bold text-apple-black">Analysis History</h2>
          </div>
          <span className="text-[13px] text-apple-gray font-medium">
            {sessions.length} {sessions.length === 1 ? 'Session' : 'Sessions'}
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="apple-card p-16 text-center text-apple-gray bg-white/50 border-dashed border-2">
            No sessions found. Start your first analysis above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {sessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="apple-card p-6 apple-card-hover cursor-pointer group flex flex-col h-full"
                  onClick={() => navigate(`/analysis/${session.id}`)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2.5 py-1 bg-black/5 text-apple-black text-[11px] font-semibold rounded-md uppercase tracking-wider">
                      {session.industry}
                    </span>
                    <div className="flex items-center gap-1.5 text-[12px] text-apple-gray">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(session.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className="text-[19px] font-semibold text-apple-black mb-2 group-hover:text-apple-blue transition-colors leading-tight">
                    {session.ideaTitle}
                  </h3>
                  <p className="text-apple-gray text-[14px] line-clamp-2 mb-6 leading-relaxed">
                    {session.ideaDescription}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/[0.03]">
                    <div className="flex items-center gap-3">
                      <div className="text-[28px] font-medium text-apple-black tracking-tighter">
                        {session.analysis?.startupViabilityIndex || 'N/A'}
                      </div>
                      <div className="text-[10px] text-apple-gray uppercase font-bold leading-[1.1]">
                        SVI <br /> Score
                      </div>
                    </div>
                    <div className="p-2 bg-black/[0.03] rounded-full group-hover:bg-apple-blue group-hover:text-white transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <footer className="pt-16 pb-8 text-center" onClick={handleDebugToggle}>
        <p className="text-[13px] text-apple-gray">Built using AI on Mattr during Launch Rush 2026.</p>
      </footer>
    </div>
  );
};