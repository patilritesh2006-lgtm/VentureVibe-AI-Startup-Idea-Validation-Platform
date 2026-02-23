import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Shield, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Landing: React.FC = () => {
  return (
    <div className="max-w-[1000px] mx-auto">
      <section className="text-center py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0071E3]/10 text-[#0071E3] rounded-full text-[13px] font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-apple-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-apple-blue"></span>
            </span>
            VentureVibe 2.0 is live
          </div>
          <h1 className="text-[44px] md:text-[64px] font-bold text-apple-black leading-[1.1] tracking-tight mb-8">
            Turn your idea into a <br />
            <span className="text-apple-blue">fundable startup.</span>
          </h1>
          <p className="text-[19px] md:text-[22px] text-apple-gray mb-12 max-w-[640px] mx-auto leading-relaxed">
            VentureVibe is your AI Startup Mentor. Get institutional-grade analysis, 
            MVP roadmaps, and investor pitches in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="rounded-full px-10">
                Start Mentorship
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button variant="ghost" size="lg" className="gap-2 group">
                Explore Leaderboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-20">
        {[
          { 
            title: 'Risk Assessment', 
            desc: 'Deep dive into market, technical, and financial risks before you write code.',
            icon: Shield,
            color: 'bg-blue-500'
          },
          { 
            title: 'MVP Roadmap', 
            desc: 'A structured 30-60-90 day execution plan tailored to your industry constraints.',
            icon: Rocket,
            color: 'bg-indigo-500'
          },
          { 
            title: 'Investor Ready', 
            desc: 'Professional elevator pitches and LinkedIn outreach drafts generated instantly.',
            icon: Zap,
            color: 'bg-amber-500'
          }
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="apple-card p-8 apple-card-hover"
          >
            <div className={`w-12 h-12 ${item.color} rounded-[12px] flex items-center justify-center mb-6 shadow-sm`}>
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-[20px] font-semibold text-apple-black mb-3">{item.title}</h3>
            <p className="text-[15px] text-apple-gray leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </section>

      <section className="py-24 text-center">
        <div className="apple-card p-12 max-w-[800px] mx-auto bg-white/50 backdrop-blur-sm">
          <h2 className="text-[24px] font-semibold text-apple-black mb-10">The VentureVibe SVI Engine</h2>
          <p className="text-apple-gray text-[16px] mb-10">
            Our Startup Viability Index (SVI) uses institutional weighted scoring to evaluate your idea:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Market', val: '25%' },
              { label: 'Execution', val: '20%' },
              { label: 'Differentiation', val: '20%' },
              { label: 'Monetization', val: '20%' },
              { label: 'Risk', val: '15%' }
            ].map(item => (
              <div key={item.label} className="p-4 rounded-[16px] border border-black/[0.05] bg-white">
                <div className="text-apple-blue font-bold text-[20px]">{item.val}</div>
                <div className="text-[11px] text-apple-gray uppercase font-semibold tracking-wider mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};