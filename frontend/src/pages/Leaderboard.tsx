import React, { useState, useEffect } from 'react';
import { startupService, LeaderboardItem } from '../services/startup.service';
import { Trophy, Medal, Loader2, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Leaderboard: React.FC = () => {
  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const data = await startupService.getLeaderboard();
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch leaderboard', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#0071E3] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto fade-in-up">
      <div className="text-center mb-20">
        <div className="inline-flex p-5 bg-white shadow-sm rounded-[24px] mb-8 border border-black/[0.03]">
          <Trophy className="w-12 h-12 text-[#0071E3]" />
        </div>
        <h1 className="text-[40px] font-bold text-apple-black mb-4 tracking-tight leading-tight">Global Startup Leaderboard</h1>
        <p className="text-apple-gray text-[17px] max-w-[600px] mx-auto">The highest scoring ideas across the VentureVibe ecosystem, evaluated by the SVI Engine.</p>
      </div>

      <div className="apple-card overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/[0.05] bg-black/[0.01]">
                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-apple-gray">Rank</th>
                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-apple-gray">Startup Idea</th>
                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-apple-gray">Founder</th>
                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-apple-gray text-right">SVI Score</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-black/[0.03] hover:bg-black/[0.01] transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      {index === 0 ? <Medal className="w-5 h-5 text-[#FFD700]" /> : 
                       index === 1 ? <Medal className="w-5 h-5 text-[#C0C0C0]" /> :
                       index === 2 ? <Medal className="w-5 h-5 text-[#CD7F32]" /> :
                       <span className="text-apple-gray font-medium text-[15px]">#{item.rank}</span>}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <div className="font-semibold text-[17px] text-apple-black group-hover:text-apple-blue transition-colors leading-tight mb-1">{item.ideaTitle}</div>
                      <div className="text-[11px] text-apple-gray uppercase font-bold tracking-wider">{item.industry}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-apple-gray text-[15px]">{item.founderName}</div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="text-[28px] font-medium text-apple-black tracking-tighter">{item.sviScore}</div>
                      <div className="text-[9px] text-apple-gray uppercase font-bold leading-[1.1] text-left">
                        SVI <br /> SCORE
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {items.length === 0 && (
        <div className="p-20 text-center text-apple-gray apple-card bg-white/50 border-dashed border-2 mt-4">
          The leaderboard is currently empty. Be the first to publish your score!
        </div>
      )}
    </div>
  );
};